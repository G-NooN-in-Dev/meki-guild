import type { Metadata } from 'next'
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

/** 게시글 제목·내용으로 OG/탭 제목을 맞춥니다. */
export async function generateMetadata({ params }: CompanionConsultingDetailPageProps): Promise<Metadata> {
	const { id } = await params

	try {
		const post = await getConsultingPostByShortId(id)
		if (!post) {
			return {
				title: '동료 세팅 컨설팅',
				description: '동료 세팅 현황과 추천을 확인합니다.'
			}
		}

		return {
			title: post.title,
			description: post.content || '동료 세팅 현황과 추천을 확인합니다.'
		}
	} catch {
		return {
			title: '동료 세팅 컨설팅',
			description: '동료 세팅 현황과 추천을 확인합니다.'
		}
	}
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
