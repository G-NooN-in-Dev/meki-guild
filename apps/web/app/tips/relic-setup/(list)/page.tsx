import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import PageLoading from '@/components/page-loading'
import PageShell from '@/components/page-shell'
import ConsultingHubHeader from '@/features/tips/components/consulting-hub-header'
import { getRelicConsultingListPath } from '@/features/tips/lib/relic-consulting.constants'
import RelicConsultingHubSection from '@/features/tips/sections/relic-consulting-hub.section'
import { loadRelicConsultingPostList } from '@/libs/relic-consulting.loader'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
	title: '유물 세팅 컨설팅',
	description: '보유·각성·현재 세팅을 올리면, 추천 세팅을 댓글로 받을 수 있습니다. ID·URL을 카톡 채널에 공유해보세요.'
}

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

/** DB 목록만 담당 — Suspense 안에서 await 합니다. */
async function RelicSetupTipContent({ searchParams }: RelicSetupTipPageProps) {
	const { page: rawPage } = await searchParams
	const requestedPage = parseListPage(rawPage)

	let posts: Awaited<ReturnType<typeof loadRelicConsultingPostList>>['posts'] = []
	let page = 1
	let totalPages = 0
	let totalCount = 0
	let loadError: string | null = null

	try {
		const result = await loadRelicConsultingPostList({ page: requestedPage })
		posts = result.posts
		page = result.page
		totalPages = result.totalPages
		totalCount = result.totalCount
	} catch (error) {
		console.error('[relic-consulting] list failed', error)
		loadError = '목록을 불러오지 못했습니다. MongoDB 연결(MONGODB_URI)을 확인해 주세요.'
	}

	if (!loadError && totalPages > 0 && requestedPage !== page) {
		redirect(getRelicConsultingListPath(page))
	}

	return (
		<RelicConsultingHubSection
			posts={posts}
			page={page}
			totalPages={totalPages}
			totalCount={totalCount}
			loadError={loadError}
		/>
	)
}

function RelicSetupTipPage({ searchParams }: RelicSetupTipPageProps) {
	return (
		<PageShell>
			<section className="flex w-full min-w-0 flex-col gap-4 md:gap-6">
				<ConsultingHubHeader
					badge="유물"
					title="유물 세팅 컨설팅"
					description="보유·각성·현재 세팅을 올리면, 추천 세팅을 댓글로 받을 수 있습니다. ID·URL을 카톡 채널에 공유해보세요."
					newHref="/tips/relic-setup/new"
				/>
				<Suspense fallback={<PageLoading variant="hub-body" />}>
					<RelicSetupTipContent searchParams={searchParams} />
				</Suspense>
			</section>
		</PageShell>
	)
}

export default RelicSetupTipPage
