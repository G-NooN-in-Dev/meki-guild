import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import PageLoading from '@/components/page-loading'
import PageShell from '@/components/page-shell'
import { ConsultingValidationError } from '@/features/tips/lib/companion-consulting.validation'
import CompanionConsultingDetailSection from '@/features/tips/sections/companion-consulting-detail.section'
import { getConsultingPostByShortId, listConsultingComments } from '@/libs/companion-consulting.server'

export const dynamic = 'force-dynamic'

type CompanionConsultingDetailPageProps = {
	params: Promise<{ id: string }>
}

async function CompanionConsultingDetailContent({ params }: CompanionConsultingDetailPageProps) {
	const { id } = await params

	let post = null
	let comments: Awaited<ReturnType<typeof listConsultingComments>> = []

	try {
		post = await getConsultingPostByShortId(id)
		if (post) {
			comments = await listConsultingComments(id)
		}
	} catch (error) {
		if (error instanceof ConsultingValidationError) {
			notFound()
		}
		console.error('[companion-consulting] detail failed', error)
		notFound()
	}

	if (!post) {
		notFound()
	}

	return <CompanionConsultingDetailSection post={post} comments={comments} />
}

function CompanionConsultingDetailPage({ params }: CompanionConsultingDetailPageProps) {
	return (
		<PageShell>
			<Suspense fallback={<PageLoading variant="detail" />}>
				<CompanionConsultingDetailContent params={params} />
			</Suspense>
		</PageShell>
	)
}

export default CompanionConsultingDetailPage
