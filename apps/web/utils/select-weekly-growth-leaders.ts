import type { GuildMemberComparison, NumericDelta } from '@/features/guild/types/guild-snapshot.type'
import {
	getGuildContentDateDayDiff,
	GUILD_CONTENT_UPDATED_AT,
	type GuildContentDateRange,
	isGuildContentUpdatedThisWeek,
	toGuildContentDateTimestamp
} from '@/libs/guild-content-dates.constants'

/** 금주의 길드원 점수에 쓰는 지표 키 */
export type WeeklyGrowthMetricKey = 'combatPower' | 'expeditionScore' | 'rivalry' | 'training' | 'guildBoss'

/** 지표별 표시 라벨 (Popover 상세용) */
export const WEEKLY_GROWTH_METRIC_LABELS = {
	combatPower: '전투력',
	expeditionScore: '토벌전',
	rivalry: '대항전',
	training: '수련장',
	guildBoss: '길드보스'
} as const satisfies Record<WeeklyGrowthMetricKey, string>

/**
 * 매주 반드시 갱신되는 컨텐츠.
 * 금주의 길드원은 이 세 가지가 모두 이번 주 갱신된 뒤에만 선정합니다.
 */
const REQUIRED_WEEKLY_DATE_KEYS = ['combatPower', 'expedition', 'rivalry'] as const

/** 점수 지표 키 ↔ 수집일 키 */
const METRIC_TO_DATE_KEY = {
	combatPower: 'combatPower',
	expeditionScore: 'expedition',
	rivalry: 'rivalry',
	training: 'training',
	guildBoss: 'guildBoss'
} as const satisfies Record<WeeklyGrowthMetricKey, keyof typeof GUILD_CONTENT_UPDATED_AT>

/** 수집일 키 → 화면 라벨 (대기 안내용) */
const DATE_KEY_LABELS = {
	combatPower: '전투력 · 레벨',
	expedition: '토벌전',
	rivalry: '대항전',
	training: '수련장',
	guildBoss: '길드보스'
} as const satisfies Record<keyof typeof GUILD_CONTENT_UPDATED_AT, string>

/** 항상 점수에 포함하는 기본 지표 */
const BASE_METRIC_KEYS = [
	'combatPower',
	'expeditionScore',
	'rivalry'
] as const satisfies readonly WeeklyGrowthMetricKey[]

/** 같은 주간 사이클로 볼 수 있는 수집일 최대 간격(일). 보통 1~3일 */
export const WEEKLY_GROWTH_CYCLE_MAX_GAP_DAYS = 3

export type WeeklyGrowthMetricBreakdown = {
	key: WeeklyGrowthMetricKey
	label: string
	/** 표시용 성장률 (예: +12.3%) */
	percentLabel: string
	/** 정렬·평균용 원시 % 값 */
	percent: number
}

export type WeeklyGrowthLeader = {
	rank: 1 | 2 | 3
	name: string
	job: string
	/** 포함 지표 성장률의 산술 평균 (%) */
	score: number
	/** 표시용 평균 성장률 */
	scoreLabel: string
	/** 점수에 실제 반영된 지표들 */
	metrics: WeeklyGrowthMetricBreakdown[]
	/** 동점 시 타이브레이커로 쓴 전투력 성장률 (없으면 null) */
	combatPowerPercent: number | null
}

/** 선정 가능 여부. ready=false면 아직 주간 업데이트가 끝나지 않음 */
export type WeeklyGrowthSelectionStatus =
	| {
			ready: true
			activeMetricKeys: WeeklyGrowthMetricKey[]
			pendingLabels: []
			/**
			 * 선정일 (YYYY-MM-DD).
			 * 이번 주 점수에 포함된 지표들의 최신 수집일 중 가장 늦은 날
			 * (= 주간 업데이트가 모두 모인 시점).
			 */
			selectedAt: string
	  }
	| {
			ready: false
			activeMetricKeys: []
			/** 아직 갱신되지 않은 주간 필수 컨텐츠 라벨 */
			pendingLabels: string[]
			selectedAt: null
	  }

/**
 * NumericDelta에서 성장률(%)을 뽑습니다.
 * 미입력·이전값 0·비교 불가면 null.
 */
function getGrowthPercent(delta: NumericDelta): number | null {
	const { hasValue, diff, previous } = delta

	if (!hasValue || diff === null || previous === null || previous === 0n) {
		return null
	}

	// 소수 4자리까지: (diff / previous) * 100
	return Number((diff * 1_000_000n) / previous) / 10_000
}

/** 내부 계산용 %를 화면용 라벨로 변환합니다. */
function formatGrowthPercentLabel(percent: number): string {
	if (percent === 0) {
		return '0%'
	}

	const sign = percent > 0 ? '+' : '-'
	const abs = Math.abs(percent)

	return `${sign}${abs.toFixed(1)}%`
}

/** 주간 필수 컨텐츠의 최신 수집일 목록 (null 제외) */
function getRequiredWeeklyCurrentDates(contentDates: typeof GUILD_CONTENT_UPDATED_AT): string[] {
	return REQUIRED_WEEKLY_DATE_KEYS.map((key) => contentDates[key].current).filter(
		(date): date is string => date !== null
	)
}

/**
 * 수집일이 주간 필수 컨텐츠 사이클(최소~최대 ±허용일) 안에 있는지 판별합니다.
 * 수련장·길드보스가 “이번 주 배치”인지 가릴 때 사용합니다.
 */
function isDateInWeeklyCycleWindow(date: string, weeklyCurrentDates: string[], maxGapDays: number): boolean {
	if (weeklyCurrentDates.length === 0) {
		return false
	}

	const timestamps = weeklyCurrentDates.map(toGuildContentDateTimestamp)
	const minTs = Math.min(...timestamps)
	const maxTs = Math.max(...timestamps)
	const padMs = maxGapDays * 24 * 60 * 60 * 1000
	const target = toGuildContentDateTimestamp(date)

	return target >= minTs - padMs && target <= maxTs + padMs
}

/**
 * 주간 필수 3종(전투력·토벌·대항)이 모두 이번 주 갱신됐는지,
 * 그리고 수련장·길드보스를 같은 주 점수에 넣을지 판별합니다.
 */
export function getWeeklyGrowthSelectionStatus(
	contentDates: typeof GUILD_CONTENT_UPDATED_AT = GUILD_CONTENT_UPDATED_AT
): WeeklyGrowthSelectionStatus {
	const pendingLabels = REQUIRED_WEEKLY_DATE_KEYS.filter(
		(key) => !isGuildContentUpdatedThisWeek(contentDates[key])
	).map((key) => DATE_KEY_LABELS[key])

	if (pendingLabels.length > 0) {
		return {
			ready: false,
			activeMetricKeys: [],
			pendingLabels,
			selectedAt: null
		}
	}

	const weeklyCurrentDates = getRequiredWeeklyCurrentDates(contentDates)

	// 필수 3종의 최신일이 서로 너무 벌어지면 같은 주로 보기 어려움
	const timestamps = weeklyCurrentDates.map(toGuildContentDateTimestamp)
	const spanDays = (Math.max(...timestamps) - Math.min(...timestamps)) / (24 * 60 * 60 * 1000)

	if (spanDays > WEEKLY_GROWTH_CYCLE_MAX_GAP_DAYS) {
		return {
			ready: false,
			activeMetricKeys: [],
			pendingLabels: ['주간 컨텐츠 수집일 확인이 필요해요'],
			selectedAt: null
		}
	}

	const activeMetricKeys: WeeklyGrowthMetricKey[] = [...BASE_METRIC_KEYS]
	/** 선정일에 쓸 수집일 — 점수에 실제로 들어간 지표의 current만 모음 */
	const selectionDates: string[] = [...weeklyCurrentDates]

	for (const metricKey of ['training', 'guildBoss'] as const) {
		const dateKey = METRIC_TO_DATE_KEY[metricKey]
		const dates: GuildContentDateRange = contentDates[dateKey]
		const { current } = dates

		// 미수집이거나, 갱신되지 않았거나, 주간 사이클 밖이면 점수에서 제외
		if (!current) {
			continue
		}

		if (!isGuildContentUpdatedThisWeek(dates)) {
			continue
		}

		if (!isDateInWeeklyCycleWindow(current, weeklyCurrentDates, WEEKLY_GROWTH_CYCLE_MAX_GAP_DAYS)) {
			continue
		}

		activeMetricKeys.push(metricKey)
		selectionDates.push(current)
	}

	// 포함된 지표 중 가장 늦은 수집일 = 이번 주 선정이 가능해진 날
	const selectedAt = selectionDates.reduce((latest, date) =>
		toGuildContentDateTimestamp(date) > toGuildContentDateTimestamp(latest) ? date : latest
	)

	return {
		ready: true,
		activeMetricKeys,
		pendingLabels: [],
		selectedAt
	}
}

/**
 * 이번 주 점수에 넣을 지표 키 목록.
 * 선정이 아직 준비되지 않았으면 빈 배열.
 */
export function getActiveWeeklyGrowthMetricKeys(
	contentDates: typeof GUILD_CONTENT_UPDATED_AT = GUILD_CONTENT_UPDATED_AT
): WeeklyGrowthMetricKey[] {
	return getWeeklyGrowthSelectionStatus(contentDates).activeMetricKeys
}

function getMetricDelta(comparison: GuildMemberComparison, key: WeeklyGrowthMetricKey): NumericDelta {
	switch (key) {
		case 'combatPower':
			return comparison.combatPower
		case 'expeditionScore':
			return comparison.expeditionScore
		case 'rivalry':
			return comparison.rivalry
		case 'training':
			return comparison.training
		case 'guildBoss':
			return comparison.guildBoss
	}
}

/**
 * 한 멤버의 금주 성장 점수를 계산합니다.
 * 유효 지표가 하나도 없으면 null.
 */
function scoreMemberGrowth(
	comparison: GuildMemberComparison,
	activeKeys: WeeklyGrowthMetricKey[]
): Omit<WeeklyGrowthLeader, 'rank'> | null {
	const { name, job } = comparison
	const metrics: WeeklyGrowthMetricBreakdown[] = []

	for (const key of activeKeys) {
		const percent = getGrowthPercent(getMetricDelta(comparison, key))

		if (percent === null) {
			continue
		}

		metrics.push({
			key,
			label: WEEKLY_GROWTH_METRIC_LABELS[key],
			percent,
			percentLabel: formatGrowthPercentLabel(percent)
		})
	}

	if (metrics.length === 0) {
		return null
	}

	const score = metrics.reduce((sum, metric) => sum + metric.percent, 0) / metrics.length
	const combatPowerPercent = getGrowthPercent(comparison.combatPower)

	return {
		name,
		job,
		score,
		scoreLabel: formatGrowthPercentLabel(score),
		metrics,
		combatPowerPercent
	}
}

/**
 * 이번 주 성장률 상위 3명을 선정합니다.
 * - 주간 필수 컨텐츠(전투력·토벌·대항)가 모두 갱신된 뒤에만 선정
 * - active 멤버만
 * - 지표 가중치 없이 % 평균
 * - 수련장·길드보스는 같은 주간 사이클(±3일)에 갱신됐을 때만 포함
 * - 동점이면 전투력 성장률 우선
 */
export function selectWeeklyGrowthLeaders(
	comparisons: GuildMemberComparison[],
	contentDates: typeof GUILD_CONTENT_UPDATED_AT = GUILD_CONTENT_UPDATED_AT
): WeeklyGrowthLeader[] {
	const status = getWeeklyGrowthSelectionStatus(contentDates)

	if (!status.ready) {
		return []
	}

	const { activeMetricKeys } = status

	const scored = comparisons
		.filter((comparison) => comparison.status === 'active')
		.map((comparison) => scoreMemberGrowth(comparison, activeMetricKeys))
		.filter((entry): entry is Omit<WeeklyGrowthLeader, 'rank'> => entry !== null)
		.sort((left, right) => {
			if (right.score !== left.score) {
				return right.score - left.score
			}

			// 동점 → 전투력 성장률. 없으면 맨 뒤로
			const leftCombat = left.combatPowerPercent ?? Number.NEGATIVE_INFINITY
			const rightCombat = right.combatPowerPercent ?? Number.NEGATIVE_INFINITY

			if (rightCombat !== leftCombat) {
				return rightCombat - leftCombat
			}

			return left.name.localeCompare(right.name, 'ko')
		})
		.slice(0, 3)

	return scored.map((entry, index) => ({
		...entry,
		rank: (index + 1) as 1 | 2 | 3
	}))
}

/** 테스트·디버그용: 두 날짜가 같은 주간 창인지 */
export function isGuildContentInSameWeeklyCycle(
	left: string,
	right: string,
	maxGapDays = WEEKLY_GROWTH_CYCLE_MAX_GAP_DAYS
): boolean {
	return getGuildContentDateDayDiff(left, right) <= maxGapDays
}
