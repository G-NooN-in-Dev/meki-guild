import {
	getConsultingPostByShortId,
	listConsultingComments,
	listConsultingPosts
} from '@/libs/companion-consulting.server'

/** 동료 컨설팅 게시글 목록 (페이지네이션) */
async function loadConsultingPostList(options?: { page?: number; pageSize?: number }) {
	return listConsultingPosts(options)
}

/** 동료 컨설팅 상세 — 게시글 + 댓글 (게시글 없으면 댓 빈 배열) */
async function loadConsultingPostDetail(shortId: string) {
	const post = await getConsultingPostByShortId(shortId)
	const comments = post ? await listConsultingComments(shortId) : []
	return { post, comments }
}

/** 동료 컨설팅 게시글 단건 (수정·메타데이터용) */
async function loadConsultingPostByShortId(shortId: string) {
	return getConsultingPostByShortId(shortId)
}

export { loadConsultingPostByShortId, loadConsultingPostDetail, loadConsultingPostList }
