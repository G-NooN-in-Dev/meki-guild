import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import GuildRivalrySection from '@/features/tips/sections/guild-rivalry.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('guild-rivalry'),
	description: '길드 대항전 단계별 필요 명중과, 보스 데미지 증가 스택을 확인해보세요.'
}

function GuildRivalryPage() {
	return (
		<PageShell>
			<GuildRivalrySection />
		</PageShell>
	)
}

export default GuildRivalryPage
