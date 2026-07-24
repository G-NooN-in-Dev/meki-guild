'use server'

import { ConsultingValidationError } from '@/features/tips/lib/companion-consulting.validation'
import type {
	CompanionConsultingComment,
	CompanionConsultingPost
} from '@/features/tips/types/companion-consulting.type'
import {
	createConsultingComment,
	createConsultingPost,
	deleteConsultingComment,
	deleteConsultingPost,
	getConsultingPostByShortId,
	listConsultingComments,
	listConsultingPosts,
	updateConsultingComment,
	updateConsultingPost,
	verifyConsultingCommentPassword,
	verifyConsultingPostPassword
} from '@/libs/companion-consulting.server'

type ActionOk<T> = { ok: true; data: T }
type ActionFail = { ok: false; error: string }
export type ConsultingActionResult<T> = ActionOk<T> | ActionFail

function toActionError(error: unknown): ActionFail {
	if (error instanceof ConsultingValidationError) {
		return { ok: false, error: error.message }
	}

	console.error('[companion-consulting]', error)
	return { ok: false, error: '저장에 실패했습니다. 잠시 후 다시 시도해 주세요.' }
}

/** 최근 컨설팅 게시글 목록 */
export async function fetchConsultingPostsAction(): Promise<ConsultingActionResult<CompanionConsultingPost[]>> {
	try {
		const data = await listConsultingPosts()
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 게시글 + 추천 댓글 */
export async function fetchConsultingPostDetailAction(
	shortId: string
): Promise<ConsultingActionResult<{ post: CompanionConsultingPost; comments: CompanionConsultingComment[] }>> {
	try {
		const post = await getConsultingPostByShortId(shortId)
		if (!post) {
			return { ok: false, error: '게시글을 찾을 수 없습니다.' }
		}

		const comments = await listConsultingComments(shortId)
		return { ok: true, data: { post, comments } }
	} catch (error) {
		return toActionError(error)
	}
}

/** 현황 게시글 작성 */
export async function createConsultingPostAction(input: unknown): Promise<ConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await createConsultingPost(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 현황 게시글 수정 */
export async function updateConsultingPostAction(input: unknown): Promise<ConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await updateConsultingPost(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 현황 게시글 삭제 (추천 세팅 포함) */
export async function deleteConsultingPostAction(input: unknown): Promise<ConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await deleteConsultingPost(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 게시글 수정 화면 진입 전 비밀번호 확인 */
export async function verifyConsultingPostPasswordAction(
	input: unknown
): Promise<ConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await verifyConsultingPostPassword(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 추천 세팅 댓글 작성 */
export async function createConsultingCommentAction(
	input: unknown
): Promise<ConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await createConsultingComment(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 추천 세팅 댓글 수정 */
export async function updateConsultingCommentAction(
	input: unknown
): Promise<ConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await updateConsultingComment(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 추천 세팅 댓글 삭제 */
export async function deleteConsultingCommentAction(
	input: unknown
): Promise<ConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await deleteConsultingComment(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}

/** 추천 수정 진입 전 비밀번호 확인 */
export async function verifyConsultingCommentPasswordAction(
	input: unknown
): Promise<ConsultingActionResult<{ shortId: string }>> {
	try {
		const data = await verifyConsultingCommentPassword(input)
		return { ok: true, data }
	} catch (error) {
		return toActionError(error)
	}
}
