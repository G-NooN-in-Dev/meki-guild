import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import RelicSetupSection from '@/features/tips/sections/relic-setup.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('relic-setup'),
	description: '유물별 장착·보유 효과와 잠재옵션을 확인해보세요.'
}

function RelicSetupPage() {
	return (
		<PageShell>
			<RelicSetupSection />
		</PageShell>
	)
}

export default RelicSetupPage
