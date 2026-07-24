import { notFound } from 'next/navigation'

import { RelicConsultingValidationError } from '@/features/tips/lib/relic-consulting.validation'
import RelicConsultingDetailSection from '@/features/tips/sections/relic-consulting-detail.section'
import { getRelicConsultingPostByShortId, listRelicConsultingComments } from '@/libs/relic-consulting.server'

export const dynamic = 'force-dynamic'

type RelicConsultingDetailPageProps = {
	params: Promise<{ id: string }>
}

async function RelicConsultingDetailPage({ params }: RelicConsultingDetailPageProps) {
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

	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col px-4 py-8 md:px-6">
					<RelicConsultingDetailSection post={post} comments={comments} />
				</div>
			</main>
		</div>
	)
}

export default RelicConsultingDetailPage
