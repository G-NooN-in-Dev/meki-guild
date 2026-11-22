'use client'

import GuildMetricChart from '@/features/guild-v2/components/guild-metric-chart'
import type { GuildDetailMemberSectionCharts } from '@/features/guild-v2/types/guild-detail-roster.type'

type GuildDetailMemberChartsProps = {
	charts: GuildDetailMemberSectionCharts
}

/** 선택 멤버의 순위 변동 + 항목 데이터 변동 차트 */
function GuildDetailMemberCharts({ charts }: GuildDetailMemberChartsProps) {
	const { rankSeries, metricSeries } = charts
	return (
		<div className="flex min-w-0 flex-col gap-4">
			<section className="flex min-w-0 flex-col gap-2">
				<h3 className="text-grayscale-800 text-sm font-semibold">순위 변동</h3>
				<GuildMetricChart seriesList={rankSeries} />
			</section>
			<section className="flex min-w-0 flex-col gap-2">
				<h3 className="text-grayscale-800 text-sm font-semibold">항목 데이터</h3>
				<GuildMetricChart seriesList={metricSeries} />
			</section>
		</div>
	)
}

export default GuildDetailMemberCharts
