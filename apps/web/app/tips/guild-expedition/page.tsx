import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import GuildExpeditionSection from '@/features/tips/sections/guild-expedition.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('guild-expedition'),
	description: '길드 토벌전 단계별 필요 명중과 제한시간을 확인해보세요.'
}

function GuildExpeditionPage() {
	return (
		<PageShell>
			<GuildExpeditionSection />
		</PageShell>
	)
}

export default GuildExpeditionPage
