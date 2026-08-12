import { randomInt } from 'node:crypto'

import {
	CONSULTING_POST_LIST_LIMIT,
	CONSULTING_SHORT_ID_ALPHABET,
	CONSULTING_SHORT_ID_LENGTH,
	normalizePresetStats
} from '@/features/tips/lib/consulting.constants'
import {
	parseRelicConsultingCommentInput,
	parseRelicConsultingCommentUpdateFields,
	parseRelicConsultingDeleteInput,
	parseRelicConsultingPostInput,
	parseRelicConsultingPostUpdateInput,
	parseRelicConsultingShortId,
	RelicConsultingValidationError
} from '@/features/tips/lib/relic-consulting.validation'
import type { ConsultingPresetStats } from '@/features/tips/types/consulting-preset.type'
import type {
	RelicConsultingComment,
	RelicConsultingCommentInput,
	RelicConsultingLoadout,
	RelicConsultingPost,
	RelicConsultingPostInput,
	RelicConsultingPostListResult,
	RelicOwnershipEntry
} from '@/features/tips/types/relic-consulting.type'
import { hashConsultingPassword, verifyConsultingPassword } from '@/libs/consulting-password.server'
import { getDb } from '@/libs/mongodb.server'

const POSTS_COLLECTION = 'relic_consulting_posts'
const COMMENTS_COLLECTION = 'relic_consulting_comments'

/** MongoDB에 저장하는 게시글 문서 */
type PostDocument = {
	shortId: string
	title: string
	/** 보충 설명. 예전 글에는 없을 수 있어 조회 시 빈 문자열로 보정합니다. */
	content?: string
	presetStats?: ConsultingPresetStats
	ownership: RelicOwnershipEntry[]
	loadout: RelicConsultingLoadout
	/** CUD용 비밀번호 해시 */
	passwordHash?: string
	createdAt: Date
}

type CommentDocument = {
	shortId: string
	postShortId: string
	note: string
	loadout: RelicConsultingLoadout
	passwordHash?: string
	createdAt: Date
}

let indexesReadyPromise: Promise<void> | null = null

/** 공유용 짧은 ID 생성 (충돌 시 재시도) */
function createShortId() {
	let result = ''
	for (let index = 0; index < CONSULTING_SHORT_ID_LENGTH; index += 1) {
		result += CONSULTING_SHORT_ID_ALPHABET[randomInt(CONSULTING_SHORT_ID_ALPHABET.length)]
	}
	return result
}

async function ensureIndexes() {
	if (!indexesReadyPromise) {
		indexesReadyPromise = (async () => {
			const db = await getDb()
			await Promise.all([
				db.collection(POSTS_COLLECTION).createIndex({ shortId: 1 }, { unique: true }),
				db.collection(POSTS_COLLECTION).createIndex({ createdAt: -1 }),
				db.collection(COMMENTS_COLLECTION).createIndex({ shortId: 1 }, { unique: true }),
				db.collection(COMMENTS_COLLECTION).createIndex({ postShortId: 1, createdAt: -1 })
			])
		})().catch((error) => {
			indexesReadyPromise = null
			throw error
		})
	}

	await indexesReadyPromise
}

async function allocateUniqueShortId(collectionName: string) {
	const db = await getDb()
	const collection = db.collection(collectionName)

	for (let attempt = 0; attempt < 12; attempt += 1) {
		const shortId = createShortId()
		const existing = await collection.findOne({ shortId }, { projection: { _id: 1 } })
		if (!existing) {
			return shortId
		}
	}

	throw new Error('고유 ID를 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.')
}

function toPostView(doc: PostDocument, commentCount: number): RelicConsultingPost {
	return {
		shortId: doc.shortId,
		title: doc.title,
		content: doc.content ?? '',
		presetStats: normalizePresetStats(doc.presetStats),
		ownership: doc.ownership,
		loadout: doc.loadout,
		createdAt: doc.createdAt.toISOString(),
		commentCount,
		// 해시 자체는 클라이언트에 보내지 않고, 수정·삭제 가능 여부만 노출합니다.
		hasPassword: Boolean(doc.passwordHash)
	}
}

function toCommentView(doc: CommentDocument): RelicConsultingComment {
	return {
		shortId: doc.shortId,
		postShortId: doc.postShortId,
		note: doc.note,
		loadout: doc.loadout,
		createdAt: doc.createdAt.toISOString(),
		hasPassword: Boolean(doc.passwordHash)
	}
}

/** 저장된 해시와 입력 비밀번호를 검사합니다. 해시가 없으면 수정·삭제 불가. */
function assertPasswordMatches(password: string, passwordHash: string | undefined, entityLabel: string) {
	if (!passwordHash) {
		throw new RelicConsultingValidationError(`이 ${entityLabel}은(는) 수정·삭제할 수 없습니다.`)
	}

	if (!verifyConsultingPassword(password, passwordHash)) {
		throw new RelicConsultingValidationError('비밀번호가 올바르지 않습니다.')
	}
}

type ListRelicConsultingPostsOptions = {
	page?: number
	pageSize?: number
}

/** 최근 게시글 목록 (댓글 수·페이지네이션 포함) */
async function listRelicConsultingPosts(
	options: ListRelicConsultingPostsOptions = {}
): Promise<RelicConsultingPostListResult> {
	const pageSize = Math.max(1, options.pageSize ?? CONSULTING_POST_LIST_LIMIT)
	const requestedPage = Math.max(1, Math.floor(options.page ?? 1))

	await ensureIndexes()
	const db = await getDb()
	const postsCollection = db.collection<PostDocument>(POSTS_COLLECTION)

	const totalCount = await postsCollection.countDocuments()
	const totalPages = totalCount === 0 ? 0 : Math.ceil(totalCount / pageSize)
	const page = totalPages === 0 ? 1 : Math.min(requestedPage, totalPages)
	const skip = (page - 1) * pageSize

	const posts = await postsCollection
		.find({}, { projection: { _id: 0 } })
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(pageSize)
		.toArray()

	if (posts.length === 0) {
		return { posts: [], page, pageSize, totalCount, totalPages }
	}

	const shortIds = posts.map((post) => post.shortId)
	const commentCounts = await db
		.collection(COMMENTS_COLLECTION)
		.aggregate<{ _id: string; count: number }>([
			{ $match: { postShortId: { $in: shortIds } } },
			{ $group: { _id: '$postShortId', count: { $sum: 1 } } }
		])
		.toArray()

	const countByPostId = new Map(commentCounts.map((row) => [row._id, row.count]))

	return {
		posts: posts.map((post) => toPostView(post, countByPostId.get(post.shortId) ?? 0)),
		page,
		pageSize,
		totalCount,
		totalPages
	}
}

/** shortId로 게시글 조회 */
async function getRelicConsultingPostByShortId(rawShortId: string): Promise<RelicConsultingPost | null> {
	await ensureIndexes()
	const shortId = parseRelicConsultingShortId(rawShortId)
	const db = await getDb()
	const post = await db.collection<PostDocument>(POSTS_COLLECTION).findOne({ shortId }, { projection: { _id: 0 } })

	if (!post) {
		return null
	}

	const commentCount = await db.collection(COMMENTS_COLLECTION).countDocuments({ postShortId: shortId })
	return toPostView(post, commentCount)
}

/** 게시글의 추천 댓글 목록 (오래된 순 — 읽기 흐름) */
async function listRelicConsultingComments(rawPostShortId: string): Promise<RelicConsultingComment[]> {
	await ensureIndexes()
	const postShortId = parseRelicConsultingShortId(rawPostShortId)
	const db = await getDb()
	const comments = await db
		.collection<CommentDocument>(COMMENTS_COLLECTION)
		.find({ postShortId }, { projection: { _id: 0 } })
		.sort({ createdAt: 1 })
		.toArray()

	return comments.map(toCommentView)
}

/** 게시글 생성 → shortId 반환 */
async function createRelicConsultingPost(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()
	const input = parseRelicConsultingPostInput(rawInput) satisfies RelicConsultingPostInput
	const db = await getDb()
	const shortId = await allocateUniqueShortId(POSTS_COLLECTION)
	const document = {
		shortId,
		title: input.title,
		content: input.content,
		presetStats: input.presetStats,
		ownership: [...input.ownership],
		loadout: input.loadout,
		passwordHash: hashConsultingPassword(input.password),
		createdAt: new Date()
	} satisfies PostDocument

	await db.collection<PostDocument>(POSTS_COLLECTION).insertOne(document)
	return { shortId }
}

/** 게시글 수정 — 비밀번호 검증 후 본문만 갱신 */
async function updateRelicConsultingPost(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()
	const { shortId, password, title, content, presetStats, ownership, loadout } =
		parseRelicConsultingPostUpdateInput(rawInput)
	const db = await getDb()
	const post = await db
		.collection<PostDocument>(POSTS_COLLECTION)
		.findOne({ shortId }, { projection: { passwordHash: 1 } })

	if (!post) {
		throw new RelicConsultingValidationError('게시글을 찾을 수 없습니다.')
	}

	assertPasswordMatches(password, post.passwordHash, '게시글')

	await db.collection<PostDocument>(POSTS_COLLECTION).updateOne(
		{ shortId },
		{
			$set: {
				title,
				content,
				presetStats,
				ownership: [...ownership],
				loadout
			}
		}
	)

	return { shortId }
}

/** 수정 화면 진입 전 비밀번호만 확인 */
async function verifyRelicConsultingPostPassword(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()
	const { shortId, password } = parseRelicConsultingDeleteInput(rawInput, '게시글 ID')
	const db = await getDb()
	const post = await db
		.collection<PostDocument>(POSTS_COLLECTION)
		.findOne({ shortId }, { projection: { passwordHash: 1 } })

	if (!post) {
		throw new RelicConsultingValidationError('게시글을 찾을 수 없습니다.')
	}

	assertPasswordMatches(password, post.passwordHash, '게시글')
	return { shortId }
}

/** 게시글 삭제 — 비밀번호 검증 후 추천 댓글까지 cascade 삭제 */
async function deleteRelicConsultingPost(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()
	const { shortId, password } = parseRelicConsultingDeleteInput(rawInput, '게시글 ID')
	const db = await getDb()
	const post = await db
		.collection<PostDocument>(POSTS_COLLECTION)
		.findOne({ shortId }, { projection: { passwordHash: 1 } })

	if (!post) {
		throw new RelicConsultingValidationError('게시글을 찾을 수 없습니다.')
	}

	assertPasswordMatches(password, post.passwordHash, '게시글')

	await db.collection(COMMENTS_COLLECTION).deleteMany({ postShortId: shortId })
	await db.collection(POSTS_COLLECTION).deleteOne({ shortId })

	return { shortId }
}

/**
 * 추천 세팅 댓글 작성.
 * 장착 가능 여부는 게시글 보유 현황으로만 검증합니다.
 * 잠재옵션은 추천자가 자유롭게 제안할 수 있습니다.
 */
async function createRelicConsultingComment(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()

	if (!rawInput || typeof rawInput !== 'object') {
		throw new RelicConsultingValidationError('요청 본문이 올바르지 않습니다.')
	}

	const { postShortId: rawPostShortId, note, loadout, password } = rawInput as Record<string, unknown>
	const postShortId = parseRelicConsultingShortId(rawPostShortId)
	const db = await getDb()
	const post = await db
		.collection<PostDocument>(POSTS_COLLECTION)
		.findOne({ shortId: postShortId }, { projection: { ownership: 1 } })

	if (!post) {
		throw new RelicConsultingValidationError('게시글을 찾을 수 없습니다.')
	}

	const parsed = parseRelicConsultingCommentInput({
		postShortId,
		note,
		loadout,
		password,
		ownership: post.ownership
	}) satisfies RelicConsultingCommentInput

	const shortId = await allocateUniqueShortId(COMMENTS_COLLECTION)
	const document = {
		shortId,
		postShortId: parsed.postShortId,
		note: parsed.note,
		loadout: parsed.loadout,
		passwordHash: hashConsultingPassword(parsed.password),
		createdAt: new Date()
	} satisfies CommentDocument

	await db.collection<CommentDocument>(COMMENTS_COLLECTION).insertOne(document)
	return { shortId }
}

/** 추천 댓글 수정 — 비밀번호 검증 후 note/loadout만 갱신 */
async function updateRelicConsultingComment(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()
	const { shortId, password, note, loadout } = parseRelicConsultingCommentUpdateFields(rawInput)
	const db = await getDb()
	const comment = await db
		.collection<CommentDocument>(COMMENTS_COLLECTION)
		.findOne({ shortId }, { projection: { passwordHash: 1, postShortId: 1 } })

	if (!comment) {
		throw new RelicConsultingValidationError('추천 세팅을 찾을 수 없습니다.')
	}

	assertPasswordMatches(password, comment.passwordHash, '추천 세팅')

	const post = await db
		.collection<PostDocument>(POSTS_COLLECTION)
		.findOne({ shortId: comment.postShortId }, { projection: { ownership: 1 } })

	if (!post) {
		throw new RelicConsultingValidationError('게시글을 찾을 수 없습니다.')
	}

	const parsed = parseRelicConsultingCommentInput({
		postShortId: comment.postShortId,
		note,
		loadout,
		password,
		ownership: post.ownership
	})

	await db
		.collection<CommentDocument>(COMMENTS_COLLECTION)
		.updateOne({ shortId }, { $set: { note: parsed.note, loadout: parsed.loadout } })

	return { shortId }
}

/** 추천 수정 진입 전 비밀번호만 확인 */
async function verifyRelicConsultingCommentPassword(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()
	const { shortId, password } = parseRelicConsultingDeleteInput(rawInput, '추천 ID')
	const db = await getDb()
	const comment = await db
		.collection<CommentDocument>(COMMENTS_COLLECTION)
		.findOne({ shortId }, { projection: { passwordHash: 1 } })

	if (!comment) {
		throw new RelicConsultingValidationError('추천 세팅을 찾을 수 없습니다.')
	}

	assertPasswordMatches(password, comment.passwordHash, '추천 세팅')
	return { shortId }
}

/** 추천 댓글 삭제 — 비밀번호 검증 */
async function deleteRelicConsultingComment(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()
	const { shortId, password } = parseRelicConsultingDeleteInput(rawInput, '추천 ID')
	const db = await getDb()
	const comment = await db
		.collection<CommentDocument>(COMMENTS_COLLECTION)
		.findOne({ shortId }, { projection: { passwordHash: 1 } })

	if (!comment) {
		throw new RelicConsultingValidationError('추천 세팅을 찾을 수 없습니다.')
	}

	assertPasswordMatches(password, comment.passwordHash, '추천 세팅')

	await db.collection(COMMENTS_COLLECTION).deleteOne({ shortId })
	return { shortId }
}

export {
	createRelicConsultingComment,
	createRelicConsultingPost,
	deleteRelicConsultingComment,
	deleteRelicConsultingPost,
	getRelicConsultingPostByShortId,
	listRelicConsultingComments,
	listRelicConsultingPosts,
	updateRelicConsultingComment,
	updateRelicConsultingPost,
	verifyRelicConsultingCommentPassword,
	verifyRelicConsultingPostPassword
}
