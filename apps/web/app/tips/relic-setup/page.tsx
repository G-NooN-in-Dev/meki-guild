import { redirect } from 'next/navigation'

import { getRelicConsultingListPath } from '@/features/tips/lib/relic-consulting.constants'
import RelicConsultingHubSection from '@/features/tips/sections/relic-consulting-hub.section'
import { listRelicConsultingPosts } from '@/libs/relic-consulting.server'

export const dynamic = 'force-dynamic'

type RelicSetupTipPageProps = {
	searchParams: Promise<{ page?: string | string[] }>
}

/** ?page= 쿼리를 1 이상의 정수로 파싱합니다. */
function parseListPage(raw: string | string[] | undefined) {
	const value = Array.isArray(raw) ? raw[0] : raw
	const page = Number.parseInt(value ?? '1', 10)

	if (!Number.isFinite(page) || page < 1) {
		return 1
	}

	return page
}

async function RelicSetupTipPage({ searchParams }: RelicSetupTipPageProps) {
	const { page: rawPage } = await searchParams
	const requestedPage = parseListPage(rawPage)

	let posts: Awaited<ReturnType<typeof listRelicConsultingPosts>>['posts'] = []
	let page = 1
	let totalPages = 0
	let totalCount = 0
	let loadError: string | null = null

	try {
		const result = await listRelicConsultingPosts({ page: requestedPage })
		posts = result.posts
		page = result.page
		totalPages = result.totalPages
		totalCount = result.totalCount
	} catch (error) {
		console.error('[relic-consulting] list failed', error)
		loadError = '목록을 불러오지 못했습니다. MongoDB 연결(MONGODB_URI)을 확인해 주세요.'
	}

	// redirect는 throw라서 위 try/catch 밖에서 호출합니다.
	if (!loadError && totalPages > 0 && requestedPage !== page) {
		redirect(getRelicConsultingListPath(page))
	}

	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col px-4 py-8 md:px-6">
					<RelicConsultingHubSection
						posts={posts}
						page={page}
						totalPages={totalPages}
						totalCount={totalCount}
						loadError={loadError}
					/>
				</div>
			</main>
		</div>
	)
}

export default RelicSetupTipPage
