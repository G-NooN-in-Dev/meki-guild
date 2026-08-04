import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import PageLoading from '@/components/page-loading'
import PageShell from '@/components/page-shell'
import { RelicConsultingValidationError } from '@/features/tips/lib/relic-consulting.validation'
import RelicConsultingDetailSection from '@/features/tips/sections/relic-consulting-detail.section'
import { loadRelicConsultingPostByShortId, loadRelicConsultingPostDetail } from '@/libs/relic-consulting.loader'

export const dynamic = 'force-dynamic'

type RelicConsultingDetailPageProps = {
	params: Promise<{ id: string }>
}

/** 게시글 제목·내용으로 OG/탭 제목을 맞춥니다. */
async function generateMetadata({ params }: RelicConsultingDetailPageProps): Promise<Metadata> {
	const { id } = await params

	try {
		const post = await loadRelicConsultingPostByShortId(id)
		if (!post) {
			return {
				title: '유물 세팅 컨설팅',
				description: '유물 세팅 현황과 추천을 확인합니다.'
			}
		}

		return {
			title: post.title,
			description: post.content || '유물 세팅 현황과 추천을 확인합니다.'
		}
	} catch {
		return {
			title: '유물 세팅 컨설팅',
			description: '유물 세팅 현황과 추천을 확인합니다.'
		}
	}
}

async function RelicConsultingDetailContent({ params }: RelicConsultingDetailPageProps) {
	const { id } = await params

	let post = null
	let comments: Awaited<ReturnType<typeof loadRelicConsultingPostDetail>>['comments'] = []

	try {
		const detail = await loadRelicConsultingPostDetail(id)
		post = detail.post
		comments = detail.comments
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

export { generateMetadata }
