import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import GuildBountySection from '@/features/tips/sections/guild-bounty.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('guild-bounty'),
	description: '길드 현상수배 제한시간, 필요 명중·방어력, 동료·버프 구슬 타이밍과 불꽃늑대 공격 패턴을 확인해보세요.'
}

function GuildBountyPage() {
	return (
		<PageShell>
			<GuildBountySection />
		</PageShell>
	)
}

export default GuildBountyPage
