import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import GuildBossSection from '@/features/tips/sections/guild-boss.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('guild-boss'),
	description: '길드 보스대전 제한시간, 필요 명중·방어력과 사악한 뱀형제의 진행 순서·공격 패턴을 확인해보세요.'
}

function GuildBossPage() {
	return (
		<PageShell>
			<GuildBossSection />
		</PageShell>
	)
}

export default GuildBossPage
