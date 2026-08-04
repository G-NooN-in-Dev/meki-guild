import {
	getRelicConsultingPostByShortId,
	listRelicConsultingComments,
	listRelicConsultingPosts
} from '@/libs/relic-consulting.server'

/** 유물 컨설팅 게시글 목록 (페이지네이션) */
async function loadRelicConsultingPostList(options?: { page?: number; pageSize?: number }) {
	return listRelicConsultingPosts(options)
}

/** 유물 컨설팅 상세 — 게시글 + 댓글 (게시글 없으면 댓 빈 배열) */
async function loadRelicConsultingPostDetail(shortId: string) {
	const post = await getRelicConsultingPostByShortId(shortId)
	const comments = post ? await listRelicConsultingComments(shortId) : []
	return { post, comments }
}

/** 유물 컨설팅 게시글 단건 (수정·메타데이터용) */
async function loadRelicConsultingPostByShortId(shortId: string) {
	return getRelicConsultingPostByShortId(shortId)
}

export { loadRelicConsultingPostByShortId, loadRelicConsultingPostDetail, loadRelicConsultingPostList }
