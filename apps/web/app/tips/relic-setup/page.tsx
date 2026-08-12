import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import RelicSetupSection from '@/features/tips/sections/relic-setup.section'

export const metadata: Metadata = {
	title: '유물 장착 효과',
	description: '유물별 각성 효과·잠재옵션과 세팅 합산을 정리한 가이드입니다.'
}

function RelicSetupPage() {
	return (
		<PageShell>
			<RelicSetupSection />
		</PageShell>
	)
}

export default RelicSetupPage
