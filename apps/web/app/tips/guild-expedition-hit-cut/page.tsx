import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import GuildExpeditionHitCutSection from '@/features/tips/sections/guild-expedition-hit-cut.section'

export const metadata: Metadata = {
	title: '토벌전 명중컷 · 제한시간',
	description: '길드 토벌전 단계별 필요 명중과 제한시간을 확인해보세요.'
}

function GuildExpeditionHitCutPage() {
	return (
		<PageShell>
			<GuildExpeditionHitCutSection />
		</PageShell>
	)
}

export default GuildExpeditionHitCutPage
