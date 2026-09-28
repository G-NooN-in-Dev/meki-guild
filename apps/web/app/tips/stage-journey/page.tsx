import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import StageJourneySection from '@/features/tips/sections/stage-journey.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('stage-journey'),
	description: '챕터별 클리어 보상과 보유 효과·특수 옵션을 확인해보세요.'
}

function StageJourneyPage() {
	return (
		<PageShell>
			<StageJourneySection />
		</PageShell>
	)
}

export default StageJourneyPage
