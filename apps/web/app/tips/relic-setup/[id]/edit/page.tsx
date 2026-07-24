import { notFound } from 'next/navigation'

import { RelicConsultingValidationError } from '@/features/tips/lib/relic-consulting.validation'
import RelicConsultingNewSection from '@/features/tips/sections/relic-consulting-new.section'
import { getRelicConsultingPostByShortId } from '@/libs/relic-consulting.server'

export const dynamic = 'force-dynamic'

type RelicConsultingEditPageProps = {
	params: Promise<{ id: string }>
}

/** 현황 게시글 수정 — 작성 폼을 초기값으로 재사용합니다. */
async function RelicConsultingEditPage({ params }: RelicConsultingEditPageProps) {
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

	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col px-4 py-8 md:px-6">
					<RelicConsultingNewSection initialPost={post} />
				</div>
			</main>
		</div>
	)
}

export default RelicConsultingEditPage
