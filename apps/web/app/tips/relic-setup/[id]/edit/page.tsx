import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import PageLoading from '@/components/page-loading'
import PageShell from '@/components/page-shell'
import { RelicConsultingValidationError } from '@/features/tips/lib/relic-consulting.validation'
import RelicConsultingNewSection from '@/features/tips/sections/relic-consulting-new.section'
import { getRelicConsultingPostByShortId } from '@/libs/relic-consulting.server'

export const dynamic = 'force-dynamic'

type RelicConsultingEditPageProps = {
	params: Promise<{ id: string }>
}

/** 현황 게시글 수정 — 작성 폼을 초기값으로 재사용합니다. */
async function RelicConsultingEditContent({ params }: RelicConsultingEditPageProps) {
	const { id } = await params

	let post = null

	try {
		post = await getRelicConsultingPostByShortId(id)
	} catch (error) {
		if (error instanceof RelicConsultingValidationError) {
			notFound()
		}
		console.error('[relic-consulting] edit load failed', error)
		notFound()
	}

	if (!post || !post.hasPassword) {
		notFound()
	}

	return <RelicConsultingNewSection initialPost={post} />
}

function RelicConsultingEditPage({ params }: RelicConsultingEditPageProps) {
	return (
		<PageShell>
			<Suspense fallback={<PageLoading variant="detail" />}>
				<RelicConsultingEditContent params={params} />
			</Suspense>
		</PageShell>
	)
}

export default RelicConsultingEditPage
