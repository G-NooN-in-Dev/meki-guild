import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import RelicSetupSection from '@/features/tips/sections/relic-setup.section'

export const metadata: Metadata = {
	title: '유물 장착 효과',
	description: '유물별 각성 효과와 잠재옵션을 확인해보세요.'
}

function RelicSetupPage() {
	return (
		<PageShell>
			<RelicSetupSection />
		</PageShell>
	)
}

export default RelicSetupPage
