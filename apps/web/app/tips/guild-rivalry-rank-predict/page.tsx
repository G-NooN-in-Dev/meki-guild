import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import GuildRivalryRankPredictSection from '@/features/tips/sections/guild-rivalry-rank-predict.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('guild-rivalry-rank-predict'),
	description: '매칭된 길드들의 길드원 전투력으로 길드 대항전 순위를 예측해 보세요.'
}

function GuildRivalryRankPredictPage() {
	return (
		<PageShell>
			<GuildRivalryRankPredictSection />
		</PageShell>
	)
}

export default GuildRivalryRankPredictPage
