import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import PageLoading from '@/components/page-loading'
import PageShell from '@/components/page-shell'
import { ConsultingValidationError } from '@/features/tips/lib/companion-consulting.validation'
import CompanionConsultingNewSection from '@/features/tips/sections/companion-consulting-new.section'
import { getConsultingPostByShortId } from '@/libs/companion-consulting.server'

export const dynamic = 'force-dynamic'

type CompanionConsultingEditPageProps = {
	params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CompanionConsultingEditPageProps): Promise<Metadata> {
	const { id } = await params

	try {
		const post = await getConsultingPostByShortId(id)
		if (!post) {
			return {
				title: '동료 현황 수정',
				description: '동료 세팅 현황을 수정합니다.'
			}
		}

		return {
			title: `${post.title} 수정`,
			description: '내용을 수정한 뒤 저장하면 반영됩니다.'
		}
	} catch {
		return {
			title: '동료 현황 수정',
			description: '동료 세팅 현황을 수정합니다.'
		}
	}
}

/** 현황 게시글 수정 — 작성 폼을 초기값으로 재사용합니다. */
async function CompanionConsultingEditContent({ params }: CompanionConsultingEditPageProps) {
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

	return <CompanionConsultingNewSection initialPost={post} />
}

function CompanionConsultingEditPage({ params }: CompanionConsultingEditPageProps) {
	return (
		<PageShell>
			<Suspense fallback={<PageLoading variant="detail" />}>
				<CompanionConsultingEditContent params={params} />
			</Suspense>
		</PageShell>
	)
}

export default CompanionConsultingEditPage
