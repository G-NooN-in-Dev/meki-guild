import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import PageLoading from '@/components/page-loading'
import PageShell from '@/components/page-shell'
import { RelicConsultingValidationError } from '@/features/tips/lib/relic-consulting.validation'
import RelicConsultingDetailSection from '@/features/tips/sections/relic-consulting-detail.section'
import { getRelicConsultingPostByShortId, listRelicConsultingComments } from '@/libs/relic-consulting.server'

export const dynamic = 'force-dynamic'

type RelicConsultingDetailPageProps = {
	params: Promise<{ id: string }>
}

async function RelicConsultingDetailContent({ params }: RelicConsultingDetailPageProps) {
	const { id } = await params

	let post = null
	let comments: Awaited<ReturnType<typeof listRelicConsultingComments>> = []

	try {
		post = await getRelicConsultingPostByShortId(id)
		if (post) {
			comments = await listRelicConsultingComments(id)
		}
	} catch (error) {
		if (error instanceof RelicConsultingValidationError) {
			notFound()
		}
		console.error('[relic-consulting] detail failed', error)
		notFound()
	}

	if (!post) {
		notFound()
	}

	return <RelicConsultingDetailSection post={post} comments={comments} />
}

function RelicConsultingDetailPage({ params }: RelicConsultingDetailPageProps) {
	return (
		<PageShell>
			<Suspense fallback={<PageLoading variant="detail" />}>
				<RelicConsultingDetailContent params={params} />
			</Suspense>
		</PageShell>
	)
}

export default RelicConsultingDetailPage
