import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import BossRaidSection from '@/features/tips/sections/boss-raid.section'

export const metadata: Metadata = {
	title: '보스레이드 명중컷 및 보상',
	description: '보스레이드 명중컷 및 보상을 확인해보세요.'
}

function StageJourneyPage() {
	return (
		<PageShell>
			<BossRaidSection />
		</PageShell>
	)
}

export default StageJourneyPage
