import type { Metadata } from 'next'

import PageShell from '@/components/page-shell'
import { getTipTitleBySlug } from '@/features/tips/lib/tips-registry.constants'
import GuildTrainingRankPredictSection from '@/features/tips/sections/guild-training-rank-predict.section'

export const metadata: Metadata = {
	title: getTipTitleBySlug('guild-training-rank-predict'),
	description: '매칭된 길드들의 길드원 전투력으로 길드 수련장 순위를 예측해 보세요.'
}

function GuildTrainingRankPredictPage() {
	return (
		<PageShell>
			<GuildTrainingRankPredictSection />
		</PageShell>
	)
}

export default GuildTrainingRankPredictPage
