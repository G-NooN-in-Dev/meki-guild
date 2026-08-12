import NotFoundView from '@/components/not-found-view'

/** 앱 전역 — 존재하지 않는 URL·루트에서 호출된 notFound() */
function NotFoundPage() {
	return <NotFoundView primaryHref="/" primaryLabel="홈으로" />
}

export default NotFoundPage
