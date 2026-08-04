import type {
	RelicGrade,
	RelicPotentialGrade,
	RelicPotentialOption,
	RelicStatEffect,
	RelicStatUnit
} from '@/features/tips/types/relic.type'

/** UI·탭용 잠재 등급 순서 (높은 등급 먼저) */
export const RELIC_POTENTIAL_GRADE_ORDER = [
	'mystic',
	'legendary',
	'unique',
	'epic',
	'rare'
] as const satisfies readonly RelicPotentialGrade[]

/** 잠재 등급 표시 라벨 */
export const RELIC_POTENTIAL_GRADE_META = {
	mystic: { label: '미스틱' },
	legendary: { label: '레전드리' },
	unique: { label: '유니크' },
	epic: { label: '에픽' },
	rare: { label: '레어' }
} as const satisfies Record<RelicPotentialGrade, { label: string }>

/**
 * 잠재 등급 Badge 색상.
 * 미스틱=진한 빨강(pure-red), 레어=파랑. 나머지는 유물 등급과 같은 톤을 씁니다.
 */
export const RELIC_POTENTIAL_GRADE_BADGE_CLASS = {
	mystic: 'border-transparent bg-pure-red/15 text-danger-700',
	legendary: 'border-transparent bg-pastel-green-100 text-pastel-green-800',
	unique: 'border-transparent bg-pastel-yellow-100 text-pastel-yellow-800',
	epic: 'border-transparent bg-pastel-purple-100 text-pastel-purple-800',
	rare: 'border-transparent bg-pastel-blue-100 text-pastel-blue-800'
} as const satisfies Record<RelicPotentialGrade, string>

/** 잠재 등급 탭 색상 */
export const RELIC_POTENTIAL_GRADE_TAB_CLASS = {
	mystic: 'text-danger-700 data-active:bg-pure-red/15 data-active:text-danger-700',
	legendary: 'text-pastel-green-700 data-active:bg-pastel-green-100 data-active:text-pastel-green-800',
	unique: 'text-pastel-yellow-700 data-active:bg-pastel-yellow-100 data-active:text-pastel-yellow-800',
	epic: 'text-pastel-purple-700 data-active:bg-pastel-purple-100 data-active:text-pastel-purple-800',
	rare: 'text-pastel-blue-700 data-active:bg-pastel-blue-100 data-active:text-pastel-blue-800'
} as const satisfies Record<RelicPotentialGrade, string>

/**
 * 유물 등급별 잠재옵션 최대 칸 수.
 * 레전드리 3칸 / 유니크·에픽 2칸
 */
export const RELIC_POTENTIAL_SLOT_LIMIT = {
	legendary: 3,
	unique: 2,
	epic: 2
} as const satisfies Record<RelicGrade, number>

function getRelicPotentialSlotLimit(grade: RelicGrade) {
	return RELIC_POTENTIAL_SLOT_LIMIT[grade]
}

/** 잠재옵션에 등장하는 스탯 종류 (등급별 수치만 다름) */
const POTENTIAL_STAT_LINES = [
	{ key: 'main-stat', label: '주 스탯', unit: 'percent' },
	{ key: 'damage-taken-reduction', label: '받는 피해 감소', unit: 'percent' },
	{ key: 'defense', label: '방어력', unit: 'percent' },
	{ key: 'accuracy', label: '명중', unit: 'flat' },
	{ key: 'crit-rate', label: '크리티컬 확률', unit: 'percent' },
	{ key: 'min-damage-multiplier', label: '최소 데미지 배율', unit: 'percent' },
	{ key: 'max-damage-multiplier', label: '최대 데미지 배율', unit: 'percent' },
	{ key: 'boss-damage', label: '보스 몬스터 데미지', unit: 'percent' },
	{ key: 'normal-damage', label: '일반 몬스터 데미지', unit: 'percent' },
	{ key: 'status-damage', label: '상태이상 데미지', unit: 'percent' },
	{ key: 'damage', label: '데미지', unit: 'percent' },
	{ key: 'ignore-defense', label: '방어 관통력', unit: 'percent' }
] as const satisfies readonly { key: string; label: string; unit: RelicStatUnit }[]

/**
 * 등급별 수치 세트.
 * 미스틱만 2단계(12%/24% · 10%/20%)가 있습니다.
 * 배열 순서는 POTENTIAL_STAT_LINES와 같습니다.
 */
const POTENTIAL_VALUE_SETS = {
	mystic: [
		[12, 6, 12, 12, 12, 12, 12, 24, 24, 24, 24, 12],
		[10, 5, 10, 10, 10, 10, 10, 20, 20, 20, 20, 10]
	],
	legendary: [[7, 3.5, 7, 7, 7, 7, 7, 14, 14, 14, 14, 7]],
	unique: [[4.5, 2.3, 4.5, 4, 4.5, 4.5, 4.5, 9, 9, 9, 9, 4.5]],
	epic: [[3, 1.5, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3]],
	rare: [[2, 1, 2, 2, 2, 2, 2, 4, 4, 4, 4, 2]]
} as const satisfies Record<RelicPotentialGrade, readonly (readonly number[])[]>

function formatPotentialValue(value: number, unit: RelicStatUnit) {
	return unit === 'percent' ? `+${value}%` : `+${value}`
}

function createPotentialOption(
	grade: RelicPotentialGrade,
	statKey: string,
	label: string,
	value: number,
	unit: RelicStatUnit
): RelicPotentialOption {
	return {
		id: `${grade}-${statKey}-${value}`,
		grade,
		label,
		value,
		unit,
		displayText: `${label} ${formatPotentialValue(value, unit)}`
	}
}

/**
 * 한 등급의 옵션 목록을 만듭니다.
 * 미스틱처럼 같은 스탯에 수치가 여러 개면, 스탯별로 묶고 높은 수치를 위에 둡니다.
 */
function buildPotentialOptionsForGrade(grade: RelicPotentialGrade): RelicPotentialOption[] {
	const valueSets = POTENTIAL_VALUE_SETS[grade]

	return POTENTIAL_STAT_LINES.flatMap((stat, index) => {
		const values: number[] = []
		for (const set of valueSets) {
			const value = set[index]
			if (typeof value === 'number') {
				values.push(value)
			}
		}

		// 같은 스탯이면 높은 수치(12%/24%)가 먼저 보이도록
		values.sort((a, b) => b - a)

		return values.map((value) => createPotentialOption(grade, stat.key, stat.label, value, stat.unit))
	})
}

/** 전체 잠재옵션 카탈로그 (등급 높은 순 → 스탯별 · 수치 높은 순) */
export const RELIC_POTENTIAL_OPTIONS: readonly RelicPotentialOption[] =
	RELIC_POTENTIAL_GRADE_ORDER.flatMap(buildPotentialOptionsForGrade)

function getRelicPotentialOptionById(id: string): RelicPotentialOption | undefined {
	return RELIC_POTENTIAL_OPTIONS.find((option) => option.id === id)
}

function getRelicPotentialOptionsByGrade(grade: RelicPotentialGrade): readonly RelicPotentialOption[] {
	return RELIC_POTENTIAL_OPTIONS.filter((option) => option.grade === grade)
}

/**
 * 잠재옵션 id 목록을 합산용 스탯으로 변환합니다.
 * 상시 효과라 scope는 두지 않고, 같은 label끼리 유물 기본 효과와도 합쳐집니다.
 */
function resolvePotentialStats(potentialIds: readonly string[]): readonly RelicStatEffect[] {
	return potentialIds.flatMap((id) => {
		const option = getRelicPotentialOptionById(id)
		if (!option) {
			return []
		}

		const { label, value, unit, displayText } = option
		return [{ label, value, unit, displayText } satisfies RelicStatEffect]
	})
}

/** 유물 등급 변경 시 잠재 칸 수를 맞춥니다. */
function clampPotentialIds(potentialIds: readonly string[], relicGrade: RelicGrade): readonly string[] {
	const limit = getRelicPotentialSlotLimit(relicGrade)
	return potentialIds.slice(0, limit).filter((id) => Boolean(getRelicPotentialOptionById(id)))
}

export {
	clampPotentialIds,
	getRelicPotentialOptionById,
	getRelicPotentialOptionsByGrade,
	getRelicPotentialSlotLimit,
	resolvePotentialStats
}
