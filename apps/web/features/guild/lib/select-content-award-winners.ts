import type { GuildMemberComparison, NumericDelta } from '@/features/guild/types/guild-snapshot.type'
import {
	GUILD_CONTENT_UPDATED_AT,
	type GuildContentDates,
	isGuildContentUpdatedThisWeek
} from '@/libs/guild-content-dates.constants'

/** 컨텐츠별 시상 부문 키 (표시 순서와 동일) */
type ContentAwardMetricKey = 'combatPower' | 'expeditionScore' | 'rivalry' | 'guildBoss' | 'training'

/** 부문 키 ↔ 수집일 키 */
const METRIC_TO_DATE_KEY = {
	combatPower: 'combatPower',
	expeditionScore: 'expedition',
	rivalry: 'rivalry',
	guildBoss: 'guildBoss',
	training: 'training'
} as const satisfies Record<ContentAwardMetricKey, keyof GuildContentDates>

/** 부문별 화면 라벨 */
const CONTENT_AWARD_METRIC_LABELS = {
	combatPower: '전투력',
	expeditionScore: '토벌전',
	rivalry: '대항전',
	guildBoss: '길드보스',
	training: '수련장'
} as const satisfies Record<ContentAwardMetricKey, string>

/** 시상 부문 표시 순서 */
const CONTENT_AWARD_METRIC_ORDER = [
	'combatPower',
	'expeditionScore',
	'rivalry',
	'guildBoss',
	'training'
] as const satisfies readonly ContentAwardMetricKey[]

type ContentAwardWinner = {
	name: string
	job: string
	/** 정렬·비교용 원시 성장률 (%) */
	percent: number
	/** 표시용 성장률 (예: +12.3%) */
	percentLabel: string
}

type ContentAwardSlotBase = {
	key: ContentAwardMetricKey
	label: string
	/** 해당 컨텐츠 최신 수집일 (YYYY-MM-DD). 없으면 null */
	criteriaDate: string | null
}

type ContentAwardSlot =
	| (ContentAwardSlotBase & {
			/** 해당 컨텐츠가 이번 주 갱신됐고 1등이 있음 */
			status: 'ready'
			winner: ContentAwardWinner
	  })
	| (ContentAwardSlotBase & {
			/** 이번 주 미갱신 · 유효 성장률 없음 */
			status: 'pending'
			winner: null
			/** 대기 사유 안내 */
			pendingReason: string
	  })

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

function getMetricDelta(comparison: GuildMemberComparison, key: ContentAwardMetricKey): NumericDelta {
	switch (key) {
		case 'combatPower':
			return comparison.combatPower
		case 'expeditionScore':
			return comparison.expeditionScore
		case 'rivalry':
			return comparison.rivalry
		case 'guildBoss':
			return comparison.guildBoss
		case 'training':
			return comparison.training
	}
}

/**
 * 한 부문의 성장률 1등을 고릅니다.
 * active 멤버만, 유효 성장률이 있는 사람만. 동점이면 이름 가나다순.
 */
function selectMetricWinner(
	comparisons: GuildMemberComparison[],
	key: ContentAwardMetricKey
): ContentAwardWinner | null {
	let best: ContentAwardWinner | null = null

	for (const comparison of comparisons) {
		if (comparison.status !== 'active') {
			continue
		}

		const percent = getGrowthPercent(getMetricDelta(comparison, key))

		if (percent === null) {
			continue
		}

		const candidate: ContentAwardWinner = {
			name: comparison.name,
			job: comparison.job,
			percent,
			percentLabel: formatGrowthPercentLabel(percent)
		}

		if (!best) {
			best = candidate
			continue
		}

		if (candidate.percent !== best.percent) {
			if (candidate.percent > best.percent) {
				best = candidate
			}
			continue
		}

		if (candidate.name.localeCompare(best.name, 'ko') < 0) {
			best = candidate
		}
	}

	return best
}

/**
 * 5개 시상 부문 슬롯을 만듭니다.
 * - 이번 주 갱신된 컨텐츠만 1등 선정
 * - 미갱신이거나 후보가 없으면 pending
 */
function selectContentAwardSlots(
	comparisons: GuildMemberComparison[],
	contentDates: GuildContentDates = GUILD_CONTENT_UPDATED_AT
): ContentAwardSlot[] {
	return CONTENT_AWARD_METRIC_ORDER.map((key) => {
		const label = CONTENT_AWARD_METRIC_LABELS[key]
		const dateKey = METRIC_TO_DATE_KEY[key]
		const dates = contentDates[dateKey]
		const criteriaDate = dates.current

		if (!isGuildContentUpdatedThisWeek(dates)) {
			return {
				key,
				label,
				criteriaDate,
				status: 'pending',
				winner: null,
				pendingReason: '이번 주 업데이트 대기'
			}
		}

		const winner = selectMetricWinner(comparisons, key)

		if (!winner) {
			return {
				key,
				label,
				criteriaDate,
				status: 'pending',
				winner: null,
				pendingReason: '선정할 길드원이 없습니다'
			}
		}

		return {
			key,
			label,
			criteriaDate,
			status: 'ready',
			winner
		}
	})
}

/** 한 부문이라도 시상자가 있으면 true */
function hasAnyContentAwardWinner(slots: ContentAwardSlot[]): boolean {
	return slots.some((slot) => slot.status === 'ready')
}

export { CONTENT_AWARD_METRIC_LABELS, CONTENT_AWARD_METRIC_ORDER, hasAnyContentAwardWinner, selectContentAwardSlots }
export type { ContentAwardMetricKey, ContentAwardSlot, ContentAwardWinner }
