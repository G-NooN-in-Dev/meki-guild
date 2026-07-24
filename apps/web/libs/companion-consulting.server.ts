import { randomInt } from 'node:crypto'

import {
	CONSULTING_POST_LIST_LIMIT,
	CONSULTING_SHORT_ID_ALPHABET,
	CONSULTING_SHORT_ID_LENGTH,
	createEmptyPresetStats
} from '@/features/tips/lib/companion-consulting.constants'
import {
	ConsultingValidationError,
	parseConsultingCommentInput,
	parseConsultingCommentUpdateFields,
	parseConsultingDeleteInput,
	parseConsultingPostInput,
	parseConsultingPostUpdateInput,
	parseConsultingShortId
} from '@/features/tips/lib/companion-consulting.validation'
import type {
	CompanionConsultingComment,
	CompanionConsultingCommentInput,
	CompanionConsultingLoadout,
	CompanionConsultingPost,
	CompanionConsultingPostInput,
	CompanionConsultingPostListResult,
	CompanionOwnershipEntry,
	ConsultingPresetStats
} from '@/features/tips/types/companion-consulting.type'
import { hashConsultingPassword, verifyConsultingPassword } from '@/libs/consulting-password.server'
import { getDb } from '@/libs/mongodb.server'

const POSTS_COLLECTION = 'companion_consulting_posts'
const COMMENTS_COLLECTION = 'companion_consulting_comments'

/** MongoDB에 저장하는 게시글 문서 */
type PostDocument = {
	shortId: string
	title: string
	/** 예전 글에는 없을 수 있어 조회 시 빈 값으로 보정합니다. */
	presetStats?: ConsultingPresetStats
	ownership: CompanionOwnershipEntry[]
	loadout: CompanionConsultingLoadout
	/** CUD용 비밀번호 해시. 예전 글에는 없을 수 있습니다. */
	passwordHash?: string
	createdAt: Date
}

type CommentDocument = {
	shortId: string
	postShortId: string
	note: string
	loadout: CompanionConsultingLoadout
	/** CUD용 비밀번호 해시. 예전 댓글에는 없을 수 있습니다. */
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

function toPostView(doc: PostDocument, commentCount: number): CompanionConsultingPost {
	return {
		shortId: doc.shortId,
		title: doc.title,
		presetStats: doc.presetStats ?? createEmptyPresetStats(),
		ownership: doc.ownership,
		loadout: doc.loadout,
		createdAt: doc.createdAt.toISOString(),
		commentCount,
		// 해시 자체는 클라이언트에 보내지 않고, 수정·삭제 가능 여부만 노출합니다.
		hasPassword: Boolean(doc.passwordHash)
	}
}

function toCommentView(doc: CommentDocument): CompanionConsultingComment {
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
		throw new ConsultingValidationError(`이 ${entityLabel}은(는) 수정·삭제할 수 없습니다.`)
	}

	if (!verifyConsultingPassword(password, passwordHash)) {
		throw new ConsultingValidationError('비밀번호가 올바르지 않습니다.')
	}
}

type ListConsultingPostsOptions = {
	/** 1부터 시작. 범위를 벗어나면 totalPages 안으로 보정합니다. */
	page?: number
	pageSize?: number
}

/** 최근 게시글 목록 (댓글 수·페이지네이션 포함) */
export async function listConsultingPosts(
	options: ListConsultingPostsOptions = {}
): Promise<CompanionConsultingPostListResult> {
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
export async function getConsultingPostByShortId(rawShortId: string): Promise<CompanionConsultingPost | null> {
	await ensureIndexes()
	const shortId = parseConsultingShortId(rawShortId)
	const db = await getDb()
	const post = await db.collection<PostDocument>(POSTS_COLLECTION).findOne({ shortId }, { projection: { _id: 0 } })

	if (!post) {
		return null
	}

	const commentCount = await db.collection(COMMENTS_COLLECTION).countDocuments({ postShortId: shortId })
	return toPostView(post, commentCount)
}

/** 게시글의 추천 댓글 목록 (오래된 순 — 읽기 흐름) */
export async function listConsultingComments(rawPostShortId: string): Promise<CompanionConsultingComment[]> {
	await ensureIndexes()
	const postShortId = parseConsultingShortId(rawPostShortId)
	const db = await getDb()
	const comments = await db
		.collection<CommentDocument>(COMMENTS_COLLECTION)
		.find({ postShortId }, { projection: { _id: 0 } })
		.sort({ createdAt: 1 })
		.toArray()

	return comments.map(toCommentView)
}

/** 게시글 생성 → shortId 반환 */
export async function createConsultingPost(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()
	const input = parseConsultingPostInput(rawInput) satisfies CompanionConsultingPostInput
	const db = await getDb()
	const shortId = await allocateUniqueShortId(POSTS_COLLECTION)
	const document = {
		shortId,
		title: input.title,
		presetStats: input.presetStats,
		ownership: [...input.ownership],
		loadout: input.loadout,
		passwordHash: hashConsultingPassword(input.password),
		createdAt: new Date()
	} satisfies PostDocument

	await db.collection<PostDocument>(POSTS_COLLECTION).insertOne(document)
	return { shortId }
}

/** 게시글 수정 — 비밀번호 검증 후 본문만 갱신 (비밀번호 자체는 바꾸지 않음) */
export async function updateConsultingPost(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()
	const { shortId, password, title, presetStats, ownership, loadout } = parseConsultingPostUpdateInput(rawInput)
	const db = await getDb()
	const post = await db
		.collection<PostDocument>(POSTS_COLLECTION)
		.findOne({ shortId }, { projection: { passwordHash: 1 } })

	if (!post) {
		throw new ConsultingValidationError('게시글을 찾을 수 없습니다.')
	}

	assertPasswordMatches(password, post.passwordHash, '게시글')

	await db.collection<PostDocument>(POSTS_COLLECTION).updateOne(
		{ shortId },
		{
			$set: {
				title,
				presetStats,
				ownership: [...ownership],
				loadout
			}
		}
	)

	return { shortId }
}

/**
 * 수정 화면 진입 전 비밀번호만 확인합니다.
 * 통과해도 저장은 update 시 다시 검증합니다.
 */
export async function verifyConsultingPostPassword(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()
	const { shortId, password } = parseConsultingDeleteInput(rawInput, '게시글 ID')
	const db = await getDb()
	const post = await db
		.collection<PostDocument>(POSTS_COLLECTION)
		.findOne({ shortId }, { projection: { passwordHash: 1 } })

	if (!post) {
		throw new ConsultingValidationError('게시글을 찾을 수 없습니다.')
	}

	assertPasswordMatches(password, post.passwordHash, '게시글')
	return { shortId }
}

/** 게시글 삭제 — 비밀번호 검증 후 추천 댓글까지 cascade 삭제 */
export async function deleteConsultingPost(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()
	const { shortId, password } = parseConsultingDeleteInput(rawInput, '게시글 ID')
	const db = await getDb()
	const post = await db
		.collection<PostDocument>(POSTS_COLLECTION)
		.findOne({ shortId }, { projection: { passwordHash: 1 } })

	if (!post) {
		throw new ConsultingValidationError('게시글을 찾을 수 없습니다.')
	}

	assertPasswordMatches(password, post.passwordHash, '게시글')

	await db.collection(COMMENTS_COLLECTION).deleteMany({ postShortId: shortId })
	await db.collection(POSTS_COLLECTION).deleteOne({ shortId })

	return { shortId }
}

/**
 * 추천 세팅 댓글 작성.
 * 장착 가능 여부는 게시글 보유 현황으로만 검증합니다.
 */
export async function createConsultingComment(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()

	if (!rawInput || typeof rawInput !== 'object') {
		throw new ConsultingValidationError('요청 본문이 올바르지 않습니다.')
	}

	const { postShortId: rawPostShortId, note, loadout, password } = rawInput as Record<string, unknown>
	const postShortId = parseConsultingShortId(rawPostShortId)
	const db = await getDb()
	const post = await db
		.collection<PostDocument>(POSTS_COLLECTION)
		.findOne({ shortId: postShortId }, { projection: { ownership: 1 } })

	if (!post) {
		throw new ConsultingValidationError('게시글을 찾을 수 없습니다.')
	}

	// 게시글 ownership을 붙여 공통 검증기를 재사용합니다.
	const parsed = parseConsultingCommentInput({
		postShortId,
		note,
		loadout,
		password,
		ownership: post.ownership
	}) satisfies CompanionConsultingCommentInput

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
export async function updateConsultingComment(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()
	const { shortId, password, note, loadout } = parseConsultingCommentUpdateFields(rawInput)
	const db = await getDb()
	const comment = await db
		.collection<CommentDocument>(COMMENTS_COLLECTION)
		.findOne({ shortId }, { projection: { passwordHash: 1, postShortId: 1 } })

	if (!comment) {
		throw new ConsultingValidationError('추천 세팅을 찾을 수 없습니다.')
	}

	assertPasswordMatches(password, comment.passwordHash, '추천 세팅')

	const post = await db
		.collection<PostDocument>(POSTS_COLLECTION)
		.findOne({ shortId: comment.postShortId }, { projection: { ownership: 1 } })

	if (!post) {
		throw new ConsultingValidationError('게시글을 찾을 수 없습니다.')
	}

	// ownership은 게시글 기준 — 클라이언트 값을 신뢰하지 않습니다.
	const parsed = parseConsultingCommentInput({
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
export async function verifyConsultingCommentPassword(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()
	const { shortId, password } = parseConsultingDeleteInput(rawInput, '추천 ID')
	const db = await getDb()
	const comment = await db
		.collection<CommentDocument>(COMMENTS_COLLECTION)
		.findOne({ shortId }, { projection: { passwordHash: 1 } })

	if (!comment) {
		throw new ConsultingValidationError('추천 세팅을 찾을 수 없습니다.')
	}

	assertPasswordMatches(password, comment.passwordHash, '추천 세팅')
	return { shortId }
}

/** 추천 댓글 삭제 — 비밀번호 검증 */
export async function deleteConsultingComment(rawInput: unknown): Promise<{ shortId: string }> {
	await ensureIndexes()
	const { shortId, password } = parseConsultingDeleteInput(rawInput, '추천 ID')
	const db = await getDb()
	const comment = await db
		.collection<CommentDocument>(COMMENTS_COLLECTION)
		.findOne({ shortId }, { projection: { passwordHash: 1 } })

	if (!comment) {
		throw new ConsultingValidationError('추천 세팅을 찾을 수 없습니다.')
	}

	assertPasswordMatches(password, comment.passwordHash, '추천 세팅')

	await db.collection(COMMENTS_COLLECTION).deleteOne({ shortId })
	return { shortId }
}
