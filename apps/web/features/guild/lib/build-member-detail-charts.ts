import { WEEK_SLOTS } from '@/features/guild/lib/aggregate-week-metrics'
import { getDetailMetricColorIndex, getDetailRankColorIndex } from '@/features/guild/lib/chart-series-colors'
import { computeMemberRankings, type MemberRankings } from '@/features/guild/lib/compute-member-rankings'
import { enrichMetricSeries } from '@/features/guild/lib/format-metric-series'
import { getGuildExpeditionGradeRank } from '@/features/guild/lib/guild-expedition-tier.constants'
import { parseGuildMember } from '@/features/guild/lib/parse-guild-member'
import type {
	GuildMetricFormat,
	GuildMetricPoint,
	GuildMetricSeries,
	GuildMetricYAxisId,
	GuildRosterSectionId,
	GuildWeekSlot
} from '@/features/guild/types/guild-dashboard.type'
import type {
	GuildDetailChartsByMember,
	GuildDetailMemberSectionCharts
} from '@/features/guild/types/guild-detail-roster.type'
import type { GuildWeekSnapshot, ParsedGuildMember } from '@/features/guild/types/guild-snapshot.type'
import { GUILD_CONTENT_UPDATED_AT, type GuildContentDateRange } from '@/libs/guild-content-dates.constants'

type RankingMetricKey = keyof MemberRankings

/** 항목별 순위 계산 메트릭 */
const SECTION_RANKING_METRIC = {
	overview: 'combatPower',
	bounty: 'bounty',
	expedition: 'expeditionScore',
	rivalry: 'rivalry',
	training: 'training',
	'guild-boss': 'guildBoss'
} as const satisfies Record<GuildRosterSectionId, RankingMetricKey>

/** 항목별 차트 데이터 범위 */
const SECTION_DATE_RANGE = {
	overview: GUILD_CONTENT_UPDATED_AT.combatPower,
	bounty: GUILD_CONTENT_UPDATED_AT.bounty,
	expedition: GUILD_CONTENT_UPDATED_AT.expedition,
	rivalry: GUILD_CONTENT_UPDATED_AT.rivalry,
	training: GUILD_CONTENT_UPDATED_AT.training,
	'guild-boss': GUILD_CONTENT_UPDATED_AT.guildBoss
} as const satisfies Record<GuildRosterSectionId, GuildContentDateRange>

/** 항목별 차트 데이터 초안 */
type MetricDraft = {
	key: string
	label: string
	format: GuildMetricFormat
	lowerIsBetter?: boolean
	showInChart?: boolean
	yAxisId?: GuildMetricYAxisId
	colorIndex?: number
	/** 점 value. null이면 해당 주 미입력 */
	pick: (_member: ParsedGuildMember | undefined) => number | null
	/** latestLabel 덮어쓰기 (등급명 등) */
	formatLatestLabel?: (_member: ParsedGuildMember | undefined) => string
}

/** 차트 점 라벨 */
function pointLabel(collectedAt: string | null, slot: GuildWeekSlot): string {
	if (collectedAt) {
		return collectedAt.slice(5).replace('-', '.')
	}

	if (slot === 'current') return '최신'
	if (slot === 'previous') return '직전'
	return '-'
}

/** 주 스냅샷에서 멤버 찾기 */
function findMember(week: GuildWeekSnapshot, name: string): ParsedGuildMember | undefined {
	const input = week.members.find((member) => member.name === name)
	return input ? parseGuildMember(input) : undefined
}

/** 차트 점 데이터 생성 */
function buildRawPoints(
	weeks: Record<GuildWeekSlot, GuildWeekSnapshot>,
	dateRange: GuildContentDateRange,
	memberName: string,
	pick: (_member: ParsedGuildMember | undefined) => number | null
): Array<Omit<GuildMetricPoint, 'changeDeltaLabel' | 'changePercentLabel'>> {
	return WEEK_SLOTS.map((slot) => {
		const collectedAt = dateRange[slot] ?? null
		const member = findMember(weeks[slot], memberName)

		return {
			slot,
			label: pointLabel(collectedAt, slot),
			collectedAt,
			value: pick(member)
		}
	})
}

/** 차트 시리즈 생성 */
function buildSeriesFromDraft(
	draft: MetricDraft,
	weeks: Record<GuildWeekSlot, GuildWeekSnapshot>,
	dateRange: GuildContentDateRange,
	memberName: string,
	seriesIndex: number
): GuildMetricSeries {
	const { format, key, label, pick, colorIndex, formatLatestLabel, lowerIsBetter, showInChart, yAxisId } = draft

	const series = enrichMetricSeries(
		{
			key,
			label,
			format,
			lowerIsBetter,
			showInChart,
			yAxisId,
			colorIndex: colorIndex ?? seriesIndex,
			chartGroup: 0,
			points: buildRawPoints(weeks, dateRange, memberName, pick)
		},
		seriesIndex
	)

	if (!formatLatestLabel) {
		return series
	}

	const currentMember = findMember(weeks.current, memberName)

	return {
		...series,
		latestLabel: formatLatestLabel(currentMember)
	}
}

/**
 * 멤버 본인 3주 순위만으로 Y축 범위를 잡습니다.
 * 길드 전체 1~N 고정이면 변동이 거의 안 보여서, ±1 여유만 둡니다.
 */
function buildMemberRankDomain(ranks: number[]): { min: number; max: number } {
	if (ranks.length === 0) {
		return { min: 1, max: 1 }
	}

	const minRank = Math.min(...ranks)
	const maxRank = Math.max(...ranks)

	return {
		min: Math.max(1, minRank - 1),
		max: maxRank + 1
	}
}

function buildRankSeries(
	sectionId: GuildRosterSectionId,
	memberName: string,
	metric: RankingMetricKey,
	slotRankings: Record<GuildWeekSlot, MemberRankings>,
	dateRange: GuildContentDateRange
): GuildMetricSeries[] {
	const memberRanks = WEEK_SLOTS.map((slot) => slotRankings[slot][metric][memberName]).filter(
		(rank): rank is number => rank !== undefined
	)
	const colorIndex = getDetailRankColorIndex(sectionId)

	return [
		enrichMetricSeries(
			{
				key: 'guildRank',
				label: '길드 내 순위',
				format: 'rank',
				changeKind: 'absolute',
				lowerIsBetter: true,
				rankDomain: buildMemberRankDomain(memberRanks),
				yAxisId: 'left',
				chartGroup: 0,
				colorIndex,
				points: WEEK_SLOTS.map((slot) => {
					const collectedAt = dateRange[slot] ?? null
					const rank = slotRankings[slot][metric][memberName]

					return {
						slot,
						label: pointLabel(collectedAt, slot),
						collectedAt,
						value: rank === undefined ? null : rank
					}
				})
			},
			colorIndex
		)
	]
}

/** 항목 데이터 시리즈. colorIndex 는 순위 차트와 겹치지 않게 metricSlot 기준으로 부여 */
function buildMetricDrafts(sectionId: GuildRosterSectionId): MetricDraft[] {
	switch (sectionId) {
		case 'overview':
			return [
				{
					key: 'combatPower',
					label: '전투력',
					format: 'korean',
					yAxisId: 'left',
					colorIndex: getDetailMetricColorIndex(sectionId, 0),
					pick: (member) => (member?.hasCombatPower ? Number(member.combatPower) : null)
				},
				{
					key: 'level',
					label: '레벨',
					format: 'level',
					yAxisId: 'right',
					colorIndex: getDetailMetricColorIndex(sectionId, 1),
					pick: (member) => (member?.hasLevel ? member.level : null)
				}
			]
		case 'expedition':
			return [
				{
					key: 'expeditionGrade',
					label: '등급',
					format: 'rank',
					lowerIsBetter: true,
					showInChart: false,
					colorIndex: getDetailMetricColorIndex(sectionId, 0),
					pick: (member) => {
						if (!member?.expedition.hasGrade) return null
						return getGuildExpeditionGradeRank(member.expedition.grade)
					},
					formatLatestLabel: (member) => (member?.expedition.hasGrade ? member.expedition.grade : '-')
				},
				{
					key: 'expeditionScore',
					label: '점수',
					format: 'korean',
					yAxisId: 'left',
					colorIndex: getDetailMetricColorIndex(sectionId, 0),
					pick: (member) => (member?.expedition.hasScore ? Number(member.expedition.score) : null)
				},
				{
					key: 'expeditionPlacement',
					label: '등수',
					format: 'rank',
					lowerIsBetter: true,
					yAxisId: 'right',
					colorIndex: getDetailMetricColorIndex(sectionId, 1),
					pick: (member) => (member?.expedition.hasPlacement ? member.expedition.placement : null)
				}
			]
		case 'rivalry':
			return [
				{
					key: 'rivalry',
					label: '점수',
					format: 'korean',
					yAxisId: 'left',
					colorIndex: getDetailMetricColorIndex(sectionId, 0),
					pick: (member) => (member?.hasRivalry ? Number(member.rivalry) : null)
				}
			]
		case 'training':
			return [
				{
					key: 'training',
					label: '점수',
					format: 'training',
					yAxisId: 'left',
					colorIndex: getDetailMetricColorIndex(sectionId, 0),
					pick: (member) => (member?.hasTraining ? Number(member.training) : null)
				}
			]
		case 'guild-boss':
			return [
				{
					key: 'guildBoss',
					label: '점수',
					format: 'korean',
					yAxisId: 'left',
					colorIndex: getDetailMetricColorIndex(sectionId, 0),
					pick: (member) => (member?.hasGuildBoss ? Number(member.guildBoss) : null)
				}
			]
		case 'bounty':
			return [
				{
					key: 'bounty',
					label: '클리어 단계',
					format: 'stage',
					yAxisId: 'left',
					colorIndex: getDetailMetricColorIndex(sectionId, 0),
					pick: (member) => (member?.hasBounty ? member.bounty : null)
				}
			]
	}
}

function buildSectionCharts(
	sectionId: GuildRosterSectionId,
	memberName: string,
	weeks: Record<GuildWeekSlot, GuildWeekSnapshot>,
	slotRankings: Record<GuildWeekSlot, MemberRankings>
): GuildDetailMemberSectionCharts {
	const dateRange = SECTION_DATE_RANGE[sectionId]
	const metric = SECTION_RANKING_METRIC[sectionId]
	const drafts = buildMetricDrafts(sectionId)

	return {
		rankSeries: buildRankSeries(sectionId, memberName, metric, slotRankings, dateRange),
		metricSeries: drafts.map((draft, index) => buildSeriesFromDraft(draft, weeks, dateRange, memberName, index))
	}
}

/** 현재 주 로스터 전원에 대해 항목별 3주 순위·지표 차트를 만듭니다. */
function buildMemberDetailChartsByMember(weeks: Record<GuildWeekSlot, GuildWeekSnapshot>): GuildDetailChartsByMember {
	const slotRankings: Record<GuildWeekSlot, MemberRankings> = {
		older: computeMemberRankings(weeks.older.members.map(parseGuildMember)),
		previous: computeMemberRankings(weeks.previous.members.map(parseGuildMember)),
		current: computeMemberRankings(weeks.current.members.map(parseGuildMember))
	}

	const sectionIds = Object.keys(SECTION_RANKING_METRIC) as GuildRosterSectionId[]
	const chartsByMember: GuildDetailChartsByMember = {}

	for (const member of weeks.current.members) {
		const bySection = {} as Record<GuildRosterSectionId, GuildDetailMemberSectionCharts>

		for (const sectionId of sectionIds) {
			bySection[sectionId] = buildSectionCharts(sectionId, member.name, weeks, slotRankings)
		}

		chartsByMember[member.name] = bySection
	}

	return chartsByMember
}

export { buildMemberDetailChartsByMember, SECTION_RANKING_METRIC }
