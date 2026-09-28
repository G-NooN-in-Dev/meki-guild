import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import ContentStageCutSection from '@/features/tips/sections/content-stage-cut.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('content-stage-cut'),
	description: '파티퀘스트·보스레이드 난이도별 스테이지컷을 확인해보세요.',
	openGraph: {
		title: getTipTitleBySlug('content-stage-cut'),
		description: '파티퀘스트·보스레이드 난이도별 스테이지컷을 확인해보세요.'
	}
}

function ContentStageCutPage() {
	return (
		<PageShell>
			<ContentStageCutSection />
		</PageShell>
	)
}

export default ContentStageCutPage
