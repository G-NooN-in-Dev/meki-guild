import { notFound } from 'next/navigation'

import { ConsultingValidationError } from '@/features/tips/lib/companion-consulting.validation'
import CompanionConsultingDetailSection from '@/features/tips/sections/companion-consulting-detail.section'
import { getConsultingPostByShortId, listConsultingComments } from '@/libs/companion-consulting.server'

export const dynamic = 'force-dynamic'

type CompanionConsultingDetailPageProps = {
	params: Promise<{ id: string }>
}

async function CompanionConsultingDetailPage({ params }: CompanionConsultingDetailPageProps) {
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

	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col px-4 py-8 md:px-6">
					<CompanionConsultingDetailSection post={post} comments={comments} />
				</div>
			</main>
		</div>
	)
}

export default CompanionConsultingDetailPage
