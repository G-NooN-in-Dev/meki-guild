import type { GuildMemberComparison, NumericDelta } from '@/features/guild/types/guild-snapshot.type'
import {
	GUILD_CONTENT_UPDATED_AT,
	type GuildContentDates,
	isGuildContentUpdatedThisWeek
} from '@/libs/guild-content-dates.constants'

/** 컨텐츠별 시상 부문 키 (표시 순서와 동일) */
type ContentAwardMetricKey = 'combatPower' | 'expeditionScore' | 'rivalry' | 'bounty' | 'guildBoss' | 'training'

/** 부문당 시상 인원 (1~3등) */
const CONTENT_AWARD_TOP_LIMIT = 3

/** 부문 키 ↔ 수집일 키 */
const METRIC_TO_DATE_KEY = {
	combatPower: 'combatPower',
	expeditionScore: 'expedition',
	rivalry: 'rivalry',
	bounty: 'bounty',
	guildBoss: 'guildBoss',
	training: 'training'
} as const satisfies Record<ContentAwardMetricKey, keyof GuildContentDates>

/** 부문별 화면 라벨 */
const CONTENT_AWARD_METRIC_LABELS = {
	combatPower: '전투력',
	expeditionScore: '토벌전',
	rivalry: '대항전',
	bounty: '현상수배',
	guildBoss: '길드보스',
	training: '수련장'
} as const satisfies Record<ContentAwardMetricKey, string>

/** 시상 부문 표시 순서 */
const CONTENT_AWARD_METRIC_ORDER = [
	'combatPower',
	'expeditionScore',
	'rivalry',
	'bounty',
	'guildBoss',
	'training'
] as const satisfies readonly ContentAwardMetricKey[]

type ContentAwardWinner = {
	name: string
	job: string
	/** 정렬·비교용 원시 점수 (성장률 % 또는 단계 증가량) */
	score: number
	/** 표시용 라벨 (예: +12.3% / +3단계) */
	scoreLabel: string
	/** 1부터 시작하는 순위 */
	rank: number
}

type ContentAwardSlotBase = {
	key: ContentAwardMetricKey
	label: string
	/** 해당 컨텐츠 최신 수집일 (YYYY-MM-DD). 없으면 null */
	criteriaDate: string | null
}

type ContentAwardSlot =
	| (ContentAwardSlotBase & {
			/** 해당 컨텐츠가 이번 주 갱신됐고 시상자가 1명 이상 */
			status: 'ready'
			winners: ContentAwardWinner[]
	  })
	| (ContentAwardSlotBase & {
			/** 이번 주 미갱신 · 유효 성장률 없음 */
			status: 'pending'
			winners: null
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

/** 현상수배 단계 증가량. 비교 불가·증가 없으면 null */
function getBountyStageIncrease(comparison: GuildMemberComparison): number | null {
	const { hasValue, diff } = comparison.bounty

	if (!hasValue || diff === null || diff <= 0) {
		return null
	}

	return diff
}

function formatBountyStageIncreaseLabel(increase: number): string {
	return `+${increase}단계`
}

function getMetricDelta(
	comparison: GuildMemberComparison,
	key: Exclude<ContentAwardMetricKey, 'bounty'>
): NumericDelta {
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

type ContentAwardCandidate = Omit<ContentAwardWinner, 'rank'> & {
	/** 동점 시 타이브레이커용 현재 전투력 */
	combatPower: bigint
}

/** 후보를 점수 내림차순 → 전투력 내림차순 → 이름 가나다순으로 정렬합니다. */
function compareAwardCandidates(left: ContentAwardCandidate, right: ContentAwardCandidate): number {
	if (left.score !== right.score) {
		return right.score - left.score
	}

	if (left.combatPower !== right.combatPower) {
		return left.combatPower > right.combatPower ? -1 : 1
	}

	return left.name.localeCompare(right.name, 'ko')
}

/**
 * 한 부문의 상위 N명을 고릅니다.
 * active 멤버만, 유효 점수가 있는 사람만. 동점이면 전투력 → 이름 가나다순.
 * - bounty: 증가한 단계 수
 * - 그 외: 성장률(%)
 */
function selectMetricTopWinners(
	comparisons: GuildMemberComparison[],
	key: ContentAwardMetricKey,
	limit: number = CONTENT_AWARD_TOP_LIMIT
): ContentAwardWinner[] {
	const candidates: ContentAwardCandidate[] = []

	for (const comparison of comparisons) {
		if (comparison.status !== 'active') {
			continue
		}

		if (key === 'bounty') {
			const increase = getBountyStageIncrease(comparison)

			if (increase === null) {
				continue
			}

			candidates.push({
				name: comparison.name,
				job: comparison.job,
				score: increase,
				scoreLabel: formatBountyStageIncreaseLabel(increase),
				combatPower: comparison.combatPower.current
			})
			continue
		}

		const percent = getGrowthPercent(getMetricDelta(comparison, key))

		if (percent === null) {
			continue
		}

		candidates.push({
			name: comparison.name,
			job: comparison.job,
			score: percent,
			scoreLabel: formatGrowthPercentLabel(percent),
			combatPower: comparison.combatPower.current
		})
	}

	return candidates
		.sort(compareAwardCandidates)
		.slice(0, limit)
		.map(({ combatPower: _combatPower, ...candidate }, index) => ({
			...candidate,
			rank: index + 1
		}))
}

/**
 * 시상 부문 슬롯을 만듭니다.
 * - 이번 주 갱신된 컨텐츠만 상위 3명 선정
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
				winners: null,
				pendingReason: '이번 주 업데이트 대기'
			}
		}

		const winners = selectMetricTopWinners(comparisons, key)

		if (winners.length === 0) {
			return {
				key,
				label,
				criteriaDate,
				status: 'pending',
				winners: null,
				pendingReason: '선정할 길드원이 없습니다'
			}
		}

		return {
			key,
			label,
			criteriaDate,
			status: 'ready',
			winners
		}
	})
}

/** 한 부문이라도 시상자가 있으면 true */
function hasAnyContentAwardWinner(slots: ContentAwardSlot[]): boolean {
	return slots.some((slot) => slot.status === 'ready')
}

/** Marquee 등에는 ready 슬롯만 넘깁니다. */
function getReadyContentAwardSlots(slots: ContentAwardSlot[]): Array<Extract<ContentAwardSlot, { status: 'ready' }>> {
	return slots.filter((slot): slot is Extract<ContentAwardSlot, { status: 'ready' }> => slot.status === 'ready')
}

export { CONTENT_AWARD_TOP_LIMIT, getReadyContentAwardSlots, hasAnyContentAwardWinner, selectContentAwardSlots }
export type { ContentAwardMetricKey, ContentAwardSlot, ContentAwardWinner }
