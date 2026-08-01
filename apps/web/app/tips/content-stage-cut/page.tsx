import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import ContentStageCutSection from '@/features/tips/sections/content-stage-cut.section'

export const metadata: Metadata = {
	title: '컨텐츠 별 스테이지컷',
	description: '파티퀘스트·보스레이드 난이도별 스테이지컷과 클리어 보상 장비를 정리한 가이드입니다.'
}

function ContentStageCutPage() {
	return (
		<PageShell>
			<ContentStageCutSection />
		</PageShell>
	)
}

export default ContentStageCutPage
