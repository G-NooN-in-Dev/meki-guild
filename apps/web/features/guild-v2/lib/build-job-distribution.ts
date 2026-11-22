import type { GuildMemberComparison, GuildWeekSnapshot } from '@/features/guild/types/guild-snapshot.type'
import { WEEK_SLOTS } from '@/features/guild-v2/lib/aggregate-week-metrics'
import { enrichMetricSeries } from '@/features/guild-v2/lib/format-metric-series'
import {
	getJobChartFill,
	getJobChartStroke,
	getJobClassLineCardBgClass,
	getJobClassLineChartFill,
	getJobClassLineChartStroke
} from '@/features/guild-v2/lib/job-chart-colors'
import type { GuildJobClassLineCardData } from '@/features/guild-v2/types/guild-job-distribution.type'
import type {
	GuildMetricPoint,
	GuildMetricSeries,
	GuildWeekSlot
} from '@/features/guild-v2/types/guild-v2-dashboard.type'
import type { GuildContentDateRange } from '@/libs/guild-content-dates.constants'
import {
	getJobClassLine,
	JOB_CLASS_LINE_ORDER,
	type JobClassLine,
	JOBS_BY_CLASS_LINE
} from '@/libs/job-class.constants'

function pointLabel(collectedAt: string | null, slot: GuildWeekSlot): string {
	if (collectedAt) {
		return collectedAt.slice(5).replace('-', '.')
	}

	if (slot === 'current') return '최신'
	if (slot === 'previous') return '직전'
	return '-'
}

/** 한 주 스냅샷의 직업군별 인원 */
function countMembersByClassLine(week: GuildWeekSnapshot): Record<JobClassLine, number> {
	const counts = {
		전사: 0,
		마법사: 0,
		궁수: 0,
		도적: 0,
		해적: 0
	} satisfies Record<JobClassLine, number>

	for (const member of week.members) {
		const classLine = getJobClassLine(member.job)
		if (!classLine) continue
		counts[classLine] += 1
	}

	return counts
}

/** 한 주 스냅샷의 직업별 인원 (해당 직업군만) */
function countMembersByJob(week: GuildWeekSnapshot, classLine: JobClassLine): Record<string, number> {
	const counts: Record<string, number> = {}

	for (const job of JOBS_BY_CLASS_LINE[classLine]) {
		counts[job] = 0
	}

	for (const member of week.members) {
		if (getJobClassLine(member.job) !== classLine) continue
		counts[member.job] = (counts[member.job] ?? 0) + 1
	}

	return counts
}

/** 한 주 스냅샷의 직업별 인원 추이 */
function buildCountPoints(
	weeks: Record<GuildWeekSlot, GuildWeekSnapshot>,
	dateRange: GuildContentDateRange,
	pick: (_week: GuildWeekSnapshot) => number
): Array<Omit<GuildMetricPoint, 'changeDeltaLabel' | 'changePercentLabel'>> {
	return WEEK_SLOTS.map((slot) => {
		const collectedAt = dateRange[slot] ?? null

		return {
			slot,
			label: pointLabel(collectedAt, slot),
			collectedAt,
			value: pick(weeks[slot])
		}
	})
}

/** 직업군 차트 색상 적용 */
function applyJobClassLineColors(series: GuildMetricSeries, classLine: JobClassLine): GuildMetricSeries {
	return {
		...series,
		stroke: getJobClassLineChartStroke(classLine),
		fill: getJobClassLineChartFill(classLine)
	}
}

/** 직업 차트 색상 적용 */
function applyJobColors(series: GuildMetricSeries, job: string): GuildMetricSeries {
	return {
		...series,
		stroke: getJobChartStroke(job),
		fill: getJobChartFill(job)
	}
}

/**
 * 대시보드·상세 상단용 직업군별 인원 시계열.
 * Y축·라벨은 인원 수(명)만 사용합니다.
 */
function buildJobClassLineSeries(
	weeks: Record<GuildWeekSlot, GuildWeekSnapshot>,
	dateRange: GuildContentDateRange
): GuildMetricSeries[] {
	return JOB_CLASS_LINE_ORDER.map((classLine, index) => {
		const series = enrichMetricSeries(
			{
				key: classLine,
				label: classLine,
				format: 'count',
				changeKind: 'absolute',
				yAxisId: 'left',
				chartGroup: 0,
				points: buildCountPoints(weeks, dateRange, (week) => countMembersByClassLine(week)[classLine])
			},
			index
		)

		return applyJobClassLineColors(series, classLine)
	})
}

/** 직업군 Card 안: 해당 계열 직업별 인원 추이 */
function buildJobSeriesForClassLine(
	classLine: JobClassLine,
	weeks: Record<GuildWeekSlot, GuildWeekSnapshot>,
	dateRange: GuildContentDateRange
): GuildMetricSeries[] {
	return JOBS_BY_CLASS_LINE[classLine].map((job, index) => {
		const series = enrichMetricSeries(
			{
				key: job,
				label: job,
				format: 'count',
				changeKind: 'absolute',
				yAxisId: 'left',
				chartGroup: 0,
				points: buildCountPoints(weeks, dateRange, (week) => countMembersByJob(week, classLine)[job] ?? 0)
			},
			index
		)

		return applyJobColors(series, job)
	})
}

/** 전투력 높은 순. 비교 불가(값 없음)는 뒤로 */
function compareMembersByCombatPower(left: GuildMemberComparison, right: GuildMemberComparison): number {
	const leftPower = left.combatPower.hasValue ? left.combatPower.current : null
	const rightPower = right.combatPower.hasValue ? right.combatPower.current : null

	if (leftPower === null && rightPower === null) {
		return left.name.localeCompare(right.name, 'ko')
	}
	if (leftPower === null) return 1
	if (rightPower === null) return -1
	if (rightPower !== leftPower) {
		return rightPower > leftPower ? 1 : -1
	}

	return left.name.localeCompare(right.name, 'ko')
}

/**
 * 상세 직업 탭: 직업군 5 Card.
 * 멤버는 현재 로스터(이탈 제외)만, 전투력 내림차순.
 */
function buildJobClassLineCards(
	weeks: Record<GuildWeekSlot, GuildWeekSnapshot>,
	dateRange: GuildContentDateRange,
	comparisons: GuildMemberComparison[]
): GuildJobClassLineCardData[] {
	const activeMembers = comparisons.filter((comparison) => comparison.status !== 'left')

	return JOB_CLASS_LINE_ORDER.map((classLine) => {
		const members = activeMembers
			.filter((comparison) => getJobClassLine(comparison.job) === classLine)
			.sort(compareMembersByCombatPower)

		return {
			classLine,
			backgroundClass: getJobClassLineCardBgClass(classLine),
			series: buildJobSeriesForClassLine(classLine, weeks, dateRange),
			members
		}
	})
}

export { buildJobClassLineCards, buildJobClassLineSeries, countMembersByClassLine, countMembersByJob }
