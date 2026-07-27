import NotFoundView from '@/components/not-found-view'

/**
 * 유물 세팅 구간 — 잘못된 shortId·삭제된 글·없는 수정 URL 등.
 * [id]/page·edit에서 notFound() 시 이 UI를 보여 줍니다.
 */
function RelicSetupNotFoundPage() {
	return (
		<NotFoundView
			title="게시글을 찾을 수 없습니다"
			description="주소가 잘못되었거나, 삭제된 유물 세팅 요청일 수 있습니다."
			primaryHref="/tips/relic-setup"
			primaryLabel="목록으로"
		/>
	)
}

export default RelicSetupNotFoundPage
