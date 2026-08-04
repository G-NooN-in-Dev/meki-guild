'use server'

import { RelicConsultingValidationError } from '@/features/tips/lib/relic-consulting.validation'
import type {
	RelicConsultingComment,
	RelicConsultingPost,
	RelicConsultingPostListResult
} from '@/features/tips/types/relic-consulting.type'
import {
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
} from '@/libs/relic-consulting.server'

type ActionOk<T> = { ok: true; data: T }
type ActionFail = { ok: false; error: string }
type RelicConsultingActionResult<T> = ActionOk<T> | ActionFail

function toActionError(error: unknown): ActionFail {
	if (error instanceof RelicConsultingValidationError) {
		return { ok: false, error: error.message }
	}

	console.error('[relic-consulting]', error)
	return { ok: false, error: '저장에 실패했습니다. 잠시 후 다시 시도해 주세요.' }
}

/** 최근 컨설팅 게시글 목록 (페이지네이션) */
async function fetchRelicConsultingPostsAction(
	page = 1
): Promise<RelicConsultingActionResult<RelicConsultingPostListResult>> {
	try {
		const data = await listRelicConsultingPosts({ page })
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 게시글 + 추천 댓글 */
async function fetchRelicConsultingPostDetailAction(
	shortId: string
): Promise<RelicConsultingActionResult<{ post: RelicConsultingPost; comments: RelicConsultingComment[] }>> {
	try {
		const post = await getRelicConsultingPostByShortId(shortId)
		if (!post) {
			return { ok: false, error: '게시글을 찾을 수 없습니다.' }
		}

		const comments = await listRelicConsultingComments(shortId)
		return { ok: true, data: { post, comments } }
	} catch (error) {
		return toActionError(error)
	}
}

/** 현황 게시글 작성 */
async function createRelicConsultingPostAction(
	input: unknown
): Promise<RelicConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await createRelicConsultingPost(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 현황 게시글 수정 */
async function updateRelicConsultingPostAction(
	input: unknown
): Promise<RelicConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await updateRelicConsultingPost(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 현황 게시글 삭제 (추천 세팅 포함) */
async function deleteRelicConsultingPostAction(
	input: unknown
): Promise<RelicConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await deleteRelicConsultingPost(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 게시글 수정 화면 진입 전 비밀번호 확인 */
async function verifyRelicConsultingPostPasswordAction(
	input: unknown
): Promise<RelicConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await verifyRelicConsultingPostPassword(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 추천 세팅 댓글 작성 */
async function createRelicConsultingCommentAction(
	input: unknown
): Promise<RelicConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await createRelicConsultingComment(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 추천 세팅 댓글 수정 */
async function updateRelicConsultingCommentAction(
	input: unknown
): Promise<RelicConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await updateRelicConsultingComment(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 추천 세팅 댓글 삭제 */
async function deleteRelicConsultingCommentAction(
	input: unknown
): Promise<RelicConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await deleteRelicConsultingComment(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 추천 수정 진입 전 비밀번호 확인 */
async function verifyRelicConsultingCommentPasswordAction(
	input: unknown
): Promise<RelicConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await verifyRelicConsultingCommentPassword(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

export {
	createRelicConsultingCommentAction,
	createRelicConsultingPostAction,
	deleteRelicConsultingCommentAction,
	deleteRelicConsultingPostAction,
	fetchRelicConsultingPostDetailAction,
	fetchRelicConsultingPostsAction,
	updateRelicConsultingCommentAction,
	updateRelicConsultingPostAction,
	verifyRelicConsultingCommentPasswordAction,
	verifyRelicConsultingPostPasswordAction
}
export type { RelicConsultingActionResult }
