import { notFound } from 'next/navigation'

import { ConsultingValidationError } from '@/features/tips/lib/companion-consulting.validation'
import CompanionConsultingNewSection from '@/features/tips/sections/companion-consulting-new.section'
import { getConsultingPostByShortId } from '@/libs/companion-consulting.server'

export const dynamic = 'force-dynamic'

type CompanionConsultingEditPageProps = {
	params: Promise<{ id: string }>
}

/** 현황 게시글 수정 — 작성 폼을 초기값으로 재사용합니다. */
async function CompanionConsultingEditPage({ params }: CompanionConsultingEditPageProps) {
	const { id } = await params

	let post = null

	try {
		post = await getConsultingPostByShortId(id)
	} catch (error) {
		if (error instanceof ConsultingValidationError) {
			notFound()
		}
		console.error('[companion-consulting] edit load failed', error)
		notFound()
	}

	// 비밀번호가 없는 예전 글은 수정 화면으로 들어오지 못하게 합니다.
	if (!post || !post.hasPassword) {
		notFound()
	}

	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col px-4 py-8 md:px-6">
					<CompanionConsultingNewSection initialPost={post} />
				</div>
			</main>
		</div>
	)
}

export default CompanionConsultingEditPage
