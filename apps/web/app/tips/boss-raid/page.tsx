import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import BossRaidSection from '@/features/tips/sections/boss-raid.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('boss-raid'),
	description: '보스레이드 명중컷 및 보상을 확인해보세요.'
}

function BossRaidPage() {
	return (
		<PageShell>
			<BossRaidSection />
		</PageShell>
	)
}

export default BossRaidPage
