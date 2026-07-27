import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import PageLoading from '@/components/page-loading'
import PageShell from '@/components/page-shell'
import ConsultingHubHeader from '@/features/tips/components/consulting-hub-header'
import { getConsultingListPath } from '@/features/tips/lib/companion-consulting.constants'
import CompanionConsultingHubSection from '@/features/tips/sections/companion-consulting-hub.section'
import { listConsultingPosts } from '@/libs/companion-consulting.server'

export const dynamic = 'force-dynamic'

type CompanionSetupTipPageProps = {
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
async function CompanionSetupTipContent({ searchParams }: CompanionSetupTipPageProps) {
	const { page: rawPage } = await searchParams
	const requestedPage = parseListPage(rawPage)

	let posts: Awaited<ReturnType<typeof listConsultingPosts>>['posts'] = []
	let page = 1
	let totalPages = 0
	let totalCount = 0
	let loadError: string | null = null

	try {
		const result = await listConsultingPosts({ page: requestedPage })
		posts = result.posts
		page = result.page
		totalPages = result.totalPages
		totalCount = result.totalCount
	} catch (error) {
		console.error('[companion-consulting] list failed', error)
		loadError = '목록을 불러오지 못했습니다. MongoDB 연결(MONGODB_URI)을 확인해 주세요.'
	}

	// redirect는 throw라서 위 try/catch 밖에서 호출합니다.
	if (!loadError && totalPages > 0 && requestedPage !== page) {
		redirect(getConsultingListPath(page))
	}

	return (
		<CompanionConsultingHubSection
			posts={posts}
			page={page}
			totalPages={totalPages}
			totalCount={totalCount}
			loadError={loadError}
		/>
	)
}

/**
 * 헤더는 즉시 렌더하고, 목록만 Suspense로 스트리밍합니다.
 * 라우트 진입 시에는 loading.tsx가 같은 골격으로 즉시 전환을 담당합니다.
 */
function CompanionSetupTipPage({ searchParams }: CompanionSetupTipPageProps) {
	return (
		<PageShell>
			<section className="flex w-full min-w-0 flex-col gap-4 md:gap-6">
				<ConsultingHubHeader
					badge="동료"
					title="동료 세팅 컨설팅"
					description="보유 현황과 현재 세팅을 올리면, 추천 세팅을 댓글로 받을 수 있습니다. ID·URL을 카톡 채널에 공유해보세요."
					newHref="/tips/companion-setup/new"
				/>
				<Suspense fallback={<PageLoading variant="hub-body" />}>
					<CompanionSetupTipContent searchParams={searchParams} />
				</Suspense>
			</section>
		</PageShell>
	)
}

export default CompanionSetupTipPage
