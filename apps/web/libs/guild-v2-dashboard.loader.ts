import currentWeekJson from '@/data/current-week.json'
import olderWeekJson from '@/data/older-week.json'
import previousWeekJson from '@/data/previous-week.json'
import type { GuildWeekSnapshot } from '@/features/guild/types/guild-snapshot.type'
import type { WeekScalars } from '@/features/guild-v2/lib/aggregate-week-metrics'
import { buildSeriesPoints, countRosterChanges } from '@/features/guild-v2/lib/aggregate-week-metrics'
import { buildJobClassLineSeries } from '@/features/guild-v2/lib/build-job-distribution'
import { getSectionSeriesColorIndex } from '@/features/guild-v2/lib/chart-series-colors'
import { enrichMetricSeries } from '@/features/guild-v2/lib/format-metric-series'
import { buildGuildDetailHref } from '@/features/guild-v2/lib/guild-detail-nav'
import type {
	GuildDashboardChartCard,
	GuildDashboardChartCardId,
	GuildMetricChangeKind,
	GuildMetricFormat,
	GuildMetricSeries,
	GuildMetricYAxisId,
	GuildV2DashboardData,
	GuildWeekSlot
} from '@/features/guild-v2/types/guild-v2-dashboard.type'
import { GUILD_CONTENT_UPDATED_AT, type GuildContentDateRange } from '@/libs/guild-content-dates.constants'

const currentWeek = currentWeekJson as GuildWeekSnapshot
const previousWeek = previousWeekJson as GuildWeekSnapshot
const olderWeek = olderWeekJson as GuildWeekSnapshot

type SeriesDraft = {
	key: string
	label: string
	format: GuildMetricFormat
	changeKind?: GuildMetricChangeKind
	lowerIsBetter?: boolean
	rankDomain?: { min: number; max: number }
	showInChart?: boolean
	chartGroup?: number
	yAxisId?: GuildMetricYAxisId
	dateRange: GuildContentDateRange
	pick: (_scalars: WeekScalars) => number | null
}

/**
 * 카드 내 시리즈 색.
 * 카드 기본색 + 시리즈 순서*2 로 항목·지표를 구분합니다.
 */
function buildCardSeries(
	cardId: GuildDashboardChartCardId,
	weeks: Record<GuildWeekSlot, GuildWeekSnapshot>,
	drafts: SeriesDraft[]
): GuildMetricSeries[] {
	return drafts.map((draft, index) =>
		enrichMetricSeries(
			{
				key: draft.key,
				label: draft.label,
				format: draft.format,
				changeKind: draft.changeKind,
				lowerIsBetter: draft.lowerIsBetter,
				rankDomain: draft.rankDomain,
				showInChart: draft.showInChart,
				chartGroup: draft.chartGroup,
				yAxisId: draft.yAxisId,
				colorIndex: getSectionSeriesColorIndex(cardId, index),
				points: buildSeriesPoints(weeks, draft.dateRange, draft.pick)
			},
			index
		)
	)
}

function loadGuildV2DashboardData(): GuildV2DashboardData {
	const weeks: Record<GuildWeekSlot, GuildWeekSnapshot> = {
		older: olderWeek,
		previous: previousWeek,
		current: currentWeek
	}

	const dates = GUILD_CONTENT_UPDATED_AT

	const cards: GuildDashboardChartCard[] = [
		{
			id: 'overview',
			title: '전투력·레벨',
			href: buildGuildDetailHref('overview'),
			series: buildCardSeries('overview', weeks, [
				{
					key: 'totalCombatPower',
					label: '총 전투력',
					format: 'korean',
					yAxisId: 'left',
					chartGroup: 0,
					dateRange: dates.combatPower,
					pick: (s) => s.totalCombatPower
				},
				{
					key: 'averageLevel',
					label: '평균 레벨',
					format: 'level',
					changeKind: 'absolute',
					yAxisId: 'right',
					chartGroup: 0,
					dateRange: dates.combatPower,
					pick: (s) => s.averageLevel
				}
			])
		},
		{
			id: 'jobs',
			title: '직업',
			href: buildGuildDetailHref('jobs'),
			/** 직업군별 인원 — 로스터 수집일과 동일하게 combatPower 날짜 사용 */
			series: buildJobClassLineSeries(weeks, dates.combatPower)
		},
		{
			id: 'bounty',
			title: '현상수배',
			href: buildGuildDetailHref('bounty'),
			series: buildCardSeries('bounty', weeks, [
				{
					key: 'totalHuntingScore',
					label: '총 사냥실적',
					format: 'korean',
					/** 상단 수치만 표시, 차트 라인 제외 */
					changeKind: 'absolute',
					showInChart: false,
					chartGroup: 0,
					yAxisId: 'left',
					dateRange: dates.bounty,
					pick: (s) => s.totalHuntingScore
				},
				{
					key: 'averageBountyStage',
					label: '평균 클리어 단계',
					format: 'stage',
					changeKind: 'absolute',
					/** 상단 수치만 표시, 차트 라인 제외 */
					showInChart: false,
					chartGroup: 0,
					yAxisId: 'right',
					dateRange: dates.bounty,
					pick: (s) => s.averageBountyStage
				},
				{
					key: 'bountyRank',
					label: '서버 내 순위',
					format: 'rank',
					changeKind: 'absolute',
					lowerIsBetter: true,
					/** 좌측 Y축 */
					yAxisId: 'left',
					chartGroup: 1,
					dateRange: dates.bounty,
					pick: (s) => s.bountyRank
				},
				{
					key: 'allBountyRank',
					label: '전체 서버 내 순위',
					format: 'rank',
					changeKind: 'absolute',
					lowerIsBetter: true,
					/** 우측 Y축 */
					yAxisId: 'right',
					chartGroup: 1,
					dateRange: dates.bounty,
					pick: (s) => s.allBountyRank
				}
			])
		},
		{
			id: 'expedition',
			title: '토벌전',
			href: buildGuildDetailHref('expedition'),
			series: buildCardSeries('expedition', weeks, [
				{
					key: 'totalExpeditionScore',
					label: '총 점수',
					format: 'korean',
					/** 상단 수치만 표시, 차트 라인 제외 */
					showInChart: false,
					chartGroup: 0,
					yAxisId: 'left',
					dateRange: dates.expedition,
					pick: (s) => s.totalExpeditionScore
				},
				{
					key: 'expeditionGuildPoints',
					label: '길드 포인트 총합',
					format: 'korean',
					/** 증감량만 표기 (퍼센트 제외) */
					changeKind: 'absolute',
					yAxisId: 'left',
					chartGroup: 0,
					dateRange: dates.expedition,
					pick: (s) => s.expeditionGuildPoints
				},
				{
					key: 'expeditionRank',
					label: '서버 내 순위',
					format: 'rank',
					changeKind: 'absolute',
					lowerIsBetter: true,
					yAxisId: 'right',
					chartGroup: 0,
					dateRange: dates.expedition,
					pick: (s) => s.expeditionRank
				}
			])
		},
		{
			id: 'rivalry',
			title: '대항전',
			href: buildGuildDetailHref('rivalry'),
			series: buildCardSeries('rivalry', weeks, [
				{
					key: 'totalRivalryScore',
					label: '총 점수',
					format: 'korean',
					yAxisId: 'left',
					chartGroup: 0,
					dateRange: dates.rivalry,
					pick: (s) => s.totalRivalryScore
				},
				{
					key: 'rivalryRank',
					label: '길드 순위',
					format: 'rank',
					changeKind: 'absolute',
					lowerIsBetter: true,
					rankDomain: { min: 1, max: 5 },
					yAxisId: 'right',
					chartGroup: 0,
					dateRange: dates.rivalry,
					pick: (s) => s.rivalryRank
				}
			])
		},
		{
			id: 'training',
			title: '수련장',
			href: buildGuildDetailHref('training'),
			series: buildCardSeries('training', weeks, [
				{
					key: 'totalTrainingScore',
					label: '총 점수',
					format: 'training',
					yAxisId: 'left',
					chartGroup: 0,
					dateRange: dates.training,
					pick: (s) => s.totalTrainingScore
				},
				{
					key: 'trainingRank',
					label: '길드 순위',
					format: 'rank',
					changeKind: 'absolute',
					lowerIsBetter: true,
					rankDomain: { min: 1, max: 7 },
					yAxisId: 'right',
					chartGroup: 0,
					dateRange: dates.training,
					pick: (s) => s.trainingRank
				}
			])
		},
		{
			id: 'guild-boss',
			title: '길드보스',
			href: buildGuildDetailHref('guild-boss'),
			series: buildCardSeries('guild-boss', weeks, [
				{
					key: 'totalGuildBossScore',
					label: '총 점수',
					format: 'korean',
					yAxisId: 'left',
					chartGroup: 0,
					dateRange: dates.guildBoss,
					pick: (s) => s.totalGuildBossScore
				}
			])
		}
	]

	return {
		cards,
		rosterChange: countRosterChanges(currentWeek, previousWeek)
	}
}

export { loadGuildV2DashboardData }
