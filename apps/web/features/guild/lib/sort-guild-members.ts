import type { GuildMemberComparison, LevelDelta, NumericDelta } from '@/features/guild/types/guild-snapshot.type'

type GuildMemberSortKey =
	'combatPower' | 'expeditionScore' | 'expeditionPlacement' | 'rivalry' | 'training' | 'guildBoss' | 'level'
type GuildMemberSortDirection = 'asc' | 'desc'

type GuildMemberSortState = {
	sortKey: GuildMemberSortKey
	sortDirection: GuildMemberSortDirection
	/** true면 절대값 대신 증감율(또는 증감량) 기준 */
	sortByPercent: boolean
}

/** 증감율 비교 불가(신규·이전값 없음·0)일 때 쓰는 정렬용 센티널 — 내림차순에서 맨 아래 */
const MISSING_PERCENT_SORT_VALUE = Number.NEGATIVE_INFINITY

/**
 * NumericDelta의 증감율을 정렬용 숫자로 변환합니다.
 * (diff / previous) * 100 과 동일하되, bigint 정수 연산으로 소수 정밀도를 유지합니다.
 */
function getNumericPercentSortValue(delta: NumericDelta): number {
	if (!delta.hasValue || delta.diff === null || delta.previous === null || delta.previous === 0n) {
		return MISSING_PERCENT_SORT_VALUE
	}

	// 소수점 2자리까지 반영: (diff / previous) * 10000 → 나중에 /100 한 것과 같은 순서
	return Number((delta.diff * 10000n) / delta.previous)
}

/**
 * 레벨 증감 정렬 값.
 * 레벨은 %가 아니라 몇 올랐는지(diff) 그 자체로 비교합니다.
 */
function getLevelChangeSortValue(delta: LevelDelta): number {
	if (!delta.hasValue || delta.diff === null) {
		return MISSING_PERCENT_SORT_VALUE
	}

	return delta.diff
}

/**
 * 토벌전 등수 증감 정렬 값.
 * raw diff는 (현재−이전)이라 음수=상승이므로, desc에서 상승이 위로 오도록 부호를 뒤집습니다.
 */
function getPlacementChangeSortValue(delta: LevelDelta): number {
	if (!delta.hasValue || delta.diff === null) {
		return MISSING_PERCENT_SORT_VALUE
	}

	return -delta.diff
}

/**
 * 컬럼별 정렬 값을 뽑습니다.
 * sortByPercent=true면 절대값 대신 증감 기준으로 비교합니다.
 * (전투력 등은 %, 레벨은 증가량, 등수는 상승량)
 */
function getSortValue(
	comparison: GuildMemberComparison,
	key: GuildMemberSortKey,
	sortByPercent: boolean
): bigint | number {
	if (sortByPercent) {
		switch (key) {
			case 'combatPower':
				return getNumericPercentSortValue(comparison.combatPower)
			case 'expeditionScore':
				return getNumericPercentSortValue(comparison.expeditionScore)
			case 'expeditionPlacement':
				return getPlacementChangeSortValue(comparison.expeditionPlacement)
			case 'rivalry':
				return getNumericPercentSortValue(comparison.rivalry)
			case 'training':
				return getNumericPercentSortValue(comparison.training)
			case 'guildBoss':
				return getNumericPercentSortValue(comparison.guildBoss)
			case 'level':
				return getLevelChangeSortValue(comparison.level)
		}
	}

	switch (key) {
		case 'combatPower':
			return comparison.combatPower.hasValue ? comparison.combatPower.current : -1n
		case 'expeditionScore':
			return comparison.expeditionScore.hasValue ? comparison.expeditionScore.current : -1n
		case 'expeditionPlacement':
			// 등수는 작을수록 상위. 부호를 뒤집어 desc=상위 등수 먼저가 됩니다.
			return comparison.expeditionPlacement.hasValue
				? -comparison.expeditionPlacement.current
				: MISSING_PERCENT_SORT_VALUE
		case 'rivalry':
			return comparison.rivalry.hasValue ? comparison.rivalry.current : -1n
		case 'training':
			return comparison.training.hasValue ? comparison.training.current : -1n
		case 'guildBoss':
			return comparison.guildBoss.hasValue ? comparison.guildBoss.current : -1n
		case 'level':
			return comparison.level.hasValue ? comparison.level.current : -1
	}
}

/**
 * 주 정렬 값이 같을 때 보조 정렬.
 * desc: 레벨 절대값 높은 순 → 전투력 높은 순
 * asc: 둘 다 반대로 (레벨 낮은 순 → 전투력 낮은 순)
 */
function compareTieBreakers(
	left: GuildMemberComparison,
	right: GuildMemberComparison,
	sortDirection: GuildMemberSortDirection
): number {
	const isAscending = sortDirection === 'asc'
	const leftLevel = left.level.hasValue ? left.level.current : -1
	const rightLevel = right.level.hasValue ? right.level.current : -1

	if (leftLevel !== rightLevel) {
		return isAscending ? leftLevel - rightLevel : rightLevel - leftLevel
	}

	const leftCombat = left.combatPower.hasValue ? left.combatPower.current : -1n
	const rightCombat = right.combatPower.hasValue ? right.combatPower.current : -1n

	if (leftCombat !== rightCombat) {
		if (isAscending) {
			return leftCombat < rightCombat ? -1 : 1
		}

		return leftCombat > rightCombat ? -1 : 1
	}

	return 0
}

/** 정렬 상태를 적용해 길드원 목록 순서를 바꿉니다. 탈퇴 멤버는 항상 맨 아래입니다. */
function sortGuildMembers(
	comparisons: GuildMemberComparison[],
	{ sortKey, sortDirection, sortByPercent }: GuildMemberSortState
): GuildMemberComparison[] {
	const next = [...comparisons]

	next.sort((left, right) => {
		if (left.status === 'left' && right.status !== 'left') {
			return 1
		}

		if (left.status !== 'left' && right.status === 'left') {
			return -1
		}

		const leftValue = getSortValue(left, sortKey, sortByPercent)
		const rightValue = getSortValue(right, sortKey, sortByPercent)

		if (leftValue === rightValue) {
			return compareTieBreakers(left, right, sortDirection)
		}

		const isAscending = sortDirection === 'asc'

		if (typeof leftValue === 'bigint' && typeof rightValue === 'bigint') {
			return isAscending ? (leftValue < rightValue ? -1 : 1) : leftValue > rightValue ? -1 : 1
		}

		return isAscending ? (leftValue as number) - (rightValue as number) : (rightValue as number) - (leftValue as number)
	})

	return next
}

export { sortGuildMembers }
export type { GuildMemberSortDirection, GuildMemberSortKey, GuildMemberSortState }
