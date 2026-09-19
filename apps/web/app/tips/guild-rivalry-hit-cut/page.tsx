import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import GuildRivalryHitCutSection from '@/features/tips/sections/guild-rivalry-hit-cut.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('guild-rivalry-hit-cut'),
	description: '길드 대항전 단계별 필요 명중과, 잡몹 처치로 쌓이는 보스 데미지 증가 스택을 확인해보세요.'
}

function GuildRivalryHitCutPage() {
	return (
		<PageShell>
			<GuildRivalryHitCutSection />
		</PageShell>
	)
}

export default GuildRivalryHitCutPage
