'use client'

import { Card, CardContent } from '@shared/ui/card'

import GuildJobClassCard from '@/features/guild/components/guild-job-class-card'
import GuildMetricChart from '@/features/guild/components/guild-metric-chart'
import type { GuildMetricSeries } from '@/features/guild/types/guild-dashboard.type'
import type { GuildJobClassLineCardData } from '@/features/guild/types/guild-job-distribution.type'

type GuildJobDistributionPanelProps = {
	/** 직업군별 인원 추이 (대시보드 jobs 카드와 동일) */
	classLineSeries: GuildMetricSeries[]
	/** 직업군 5 Card */
	classLineCards: GuildJobClassLineCardData[]
}

/**
 * 상세 직업 탭 본문.
 * 상단: 직업군 추이 차트 / 하단: 직업군 Card 가로 스크롤.
 */
function GuildJobDistributionPanel({ classLineSeries, classLineCards }: GuildJobDistributionPanelProps) {
	return (
		<div className="flex w-full min-w-0 flex-col gap-4">
			<Card size="sm" className="min-w-0">
				<CardContent className="pt-4">
					<GuildMetricChart seriesList={classLineSeries} />
				</CardContent>
			</Card>

			<div className="flex w-full min-w-0 gap-4 overflow-x-auto pb-1">
				{classLineCards.map((card) => (
					<GuildJobClassCard key={card.classLine} card={card} />
				))}
			</div>
		</div>
	)
}

export default GuildJobDistributionPanel
