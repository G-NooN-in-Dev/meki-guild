import type {
	AbilityDungeonHitCutEntry,
	EnhanceDungeonHitCutEntry,
	EnhanceDungeonMysteriousScrollBandEntry,
	EnhanceDungeonMysteriousScrollDetailRates,
	EnhanceDungeonMysteriousScrollTier,
	EquipmentDungeonHitCutEntry,
	ExperienceDungeonHitCutEntry,
	GrowthDungeonHitCutEntry
} from '@/features/tips/types/growth-dungeon.type'

export const GROWTH_DUNGEON_TABS = [
	{ label: '무기 던전', value: 'weapon' },
	{ label: '경험치 던전', value: 'experience' },
	{ label: '장비 던전', value: 'equipment' },
	{ label: '용사의 수련장', value: 'ability' },
	{ label: '강화 던전', value: 'enhance' }
] as const

/** 10, 20, 30… 처럼 어려운 단계가 반복되는 간격 */
export const GROWTH_DUNGEON_HARD_STAGE_INTERVAL = 10

/** 성장 던전 최대 단계 */
export const GROWTH_DUNGEON_MAX_STAGE = 140

/**
 * 성장 던전 공통 명중컷 증가 구간
 * ~110: +2 / 111~120: +10 / 121~: +8
 */
export const GROWTH_DUNGEON_HIT_CUT_EARLY_INCREMENT = 2
export const GROWTH_DUNGEON_HIT_CUT_MID_START_STAGE = 111
export const GROWTH_DUNGEON_HIT_CUT_MID_END_STAGE = 120
export const GROWTH_DUNGEON_HIT_CUT_MID_INCREMENT = 10
export const GROWTH_DUNGEON_HIT_CUT_LATE_INCREMENT = 8

/** 성장 던전 공통 — 10의 배수 단계는 어려운 단계 */
function isGrowthDungeonHardStage(stage: number) {
	return stage > 0 && stage % GROWTH_DUNGEON_HARD_STAGE_INTERVAL === 0
}

/** 성장 던전 공통 — 1단계 기준값 + 구간별 증가로 필요 명중 계산 */
function getGrowthDungeonRequiredHitCut(stage: number, baseHit: number) {
	const earlyLastStage = GROWTH_DUNGEON_HIT_CUT_MID_START_STAGE - 1
	const hitAtEarlyLast = baseHit + (earlyLastStage - 1) * GROWTH_DUNGEON_HIT_CUT_EARLY_INCREMENT

	if (stage <= earlyLastStage) {
		return baseHit + (stage - 1) * GROWTH_DUNGEON_HIT_CUT_EARLY_INCREMENT
	}

	if (stage <= GROWTH_DUNGEON_HIT_CUT_MID_END_STAGE) {
		return hitAtEarlyLast + (stage - earlyLastStage) * GROWTH_DUNGEON_HIT_CUT_MID_INCREMENT
	}

	const hitAtMidLast =
		hitAtEarlyLast + (GROWTH_DUNGEON_HIT_CUT_MID_END_STAGE - earlyLastStage) * GROWTH_DUNGEON_HIT_CUT_MID_INCREMENT

	return hitAtMidLast + (stage - GROWTH_DUNGEON_HIT_CUT_MID_END_STAGE) * GROWTH_DUNGEON_HIT_CUT_LATE_INCREMENT
}

/** 무기 던전 머쉬맘 처치 제한시간(초). 전 단계 동일 */
export const WEAPON_DUNGEON_TIME_LIMIT_SEC = 22

/** 무기 던전 1단계 기준 필요 명중 */
export const WEAPON_DUNGEON_BASE_HIT_CUT = 7

/** 무기 던전 단계 → 필요 명중 (1단계 7, 이후 공통 구간 증가) */
function getWeaponDungeonRequiredHitCut(stage: number) {
	return getGrowthDungeonRequiredHitCut(stage, WEAPON_DUNGEON_BASE_HIT_CUT)
}

/** 무기 던전 1~maxStage 단계 표 데이터 */
function buildWeaponDungeonHitCutEntries(maxStage = GROWTH_DUNGEON_MAX_STAGE): GrowthDungeonHitCutEntry[] {
	return Array.from({ length: maxStage }, (_, index) => {
		const stage = index + 1

		return {
			stage,
			requiredHit: getWeaponDungeonRequiredHitCut(stage),
			isHardStage: isGrowthDungeonHardStage(stage)
		}
	})
}

/** 무기 던전 표에 바로 쓰는 단계별 데이터 */
export const WEAPON_DUNGEON_HIT_CUT_ENTRIES = buildWeaponDungeonHitCutEntries()

/** 경험치 던전 처치 제한시간(초). 전 단계 동일 */
export const EXPERIENCE_DUNGEON_TIME_LIMIT_SEC = 22

/** 주니어 부기 처치 시 충전되는 시간(초) */
export const EXPERIENCE_DUNGEON_JUNIOR_BOOGIE_TIME_BONUS_SEC = 4

/** 주니어 부기 명중컷이 일반 몬스터보다 높은 수치 */
export const EXPERIENCE_DUNGEON_JUNIOR_BOOGIE_HIT_CUT_BONUS = 2

/** 경험치 던전 1단계 기준 필요 명중 */
export const EXPERIENCE_DUNGEON_BASE_HIT_CUT = 8

/** 경험치 던전 단계 → 필요 명중 (1단계 8, 이후 공통 구간 증가) */
function getExperienceDungeonRequiredHitCut(stage: number) {
	return getGrowthDungeonRequiredHitCut(stage, EXPERIENCE_DUNGEON_BASE_HIT_CUT)
}

/**
 * 경험치 던전 단계 → 처치해야 하는 몬스터 수
 * 1~2: 20 / 3~4: 22 / 5~6: 25 / 7~8: 27 / 9~10: 30 / 11~15: 33 / 16+: 35
 */
function getExperienceDungeonRequiredKillCount(stage: number) {
	if (stage <= 2) return 20
	if (stage <= 4) return 22
	if (stage <= 6) return 25
	if (stage <= 8) return 27
	if (stage <= 10) return 30
	if (stage <= 15) return 33
	return 35
}

/** 경험치 던전 1~maxStage 단계 표 데이터 */
function buildExperienceDungeonHitCutEntries(maxStage = GROWTH_DUNGEON_MAX_STAGE): ExperienceDungeonHitCutEntry[] {
	return Array.from({ length: maxStage }, (_, index) => {
		const stage = index + 1
		const requiredHit = getExperienceDungeonRequiredHitCut(stage)

		return {
			stage,
			requiredHit,
			requiredKillCount: getExperienceDungeonRequiredKillCount(stage),
			juniorBoogieRequiredHit: requiredHit + EXPERIENCE_DUNGEON_JUNIOR_BOOGIE_HIT_CUT_BONUS,
			isHardStage: isGrowthDungeonHardStage(stage)
		}
	})
}

/** 경험치 던전 표에 바로 쓰는 단계별 데이터 */
export const EXPERIENCE_DUNGEON_HIT_CUT_ENTRIES = buildExperienceDungeonHitCutEntries()

/** 포이즌 푸퍼 명중컷이 일반 몬스터보다 높은 수치 */
export const EQUIPMENT_DUNGEON_POISON_PUFFER_HIT_CUT_BONUS = 3

/** 장비 던전 1단계 기준 필요 명중 */
export const EQUIPMENT_DUNGEON_BASE_HIT_CUT = 12

/** 장비 던전 단계 → 필요 명중 (1단계 12, 이후 공통 구간 증가) */
function getEquipmentDungeonRequiredHitCut(stage: number) {
	return getGrowthDungeonRequiredHitCut(stage, EQUIPMENT_DUNGEON_BASE_HIT_CUT)
}

/**
 * 장비 던전 단계 → 제한시간(초)
 * 1~5: 30 / 6~10: 32 / 11~15: 34 / 16~20: 37 / 21+: 40
 */
function getEquipmentDungeonTimeLimitSec(stage: number) {
	if (stage <= 5) return 30
	if (stage <= 10) return 32
	if (stage <= 15) return 34
	if (stage <= 20) return 37
	return 40
}

/**
 * 장비 던전 단계 → 처치해야 하는 몬스터 수
 * 1~10: 75부터 단계마다 +2 / 11~20: 95부터 단계마다 +1
 * 21~25: 105 / 26~30: 110 / 31~40: 115 / 41+: 120
 */
function getEquipmentDungeonRequiredKillCount(stage: number) {
	if (stage <= 10) return 75 + (stage - 1) * 2
	if (stage <= 20) return 95 + (stage - 11)
	if (stage <= 25) return 105
	if (stage <= 30) return 110
	if (stage <= 40) return 115
	return 120
}

/** 장비 던전 1~maxStage 단계 표 데이터 */
function buildEquipmentDungeonHitCutEntries(maxStage = GROWTH_DUNGEON_MAX_STAGE): EquipmentDungeonHitCutEntry[] {
	return Array.from({ length: maxStage }, (_, index) => {
		const stage = index + 1
		const requiredHit = getEquipmentDungeonRequiredHitCut(stage)

		return {
			stage,
			requiredHit,
			timeLimitSec: getEquipmentDungeonTimeLimitSec(stage),
			requiredKillCount: getEquipmentDungeonRequiredKillCount(stage),
			isHardStage: isGrowthDungeonHardStage(stage)
		}
	})
}

/** 장비 던전 표에 바로 쓰는 단계별 데이터 */
export const EQUIPMENT_DUNGEON_HIT_CUT_ENTRIES = buildEquipmentDungeonHitCutEntries()

/** 용사의 수련장 — 일반 몬스터 사냥 제한시간(초). 전 단계 동일 */
export const ABILITY_DUNGEON_NORMAL_TIME_LIMIT_SEC = 30

/** 용사의 수련장 — 보스 처치 제한시간(초). 전 단계 동일 */
export const ABILITY_DUNGEON_BOSS_TIME_LIMIT_SEC = 20

/** 일반 몬스터 1마리 처치 시 공격력 증가 버프(%) */
export const ABILITY_DUNGEON_ATTACK_BUFF_PERCENT_PER_KILL = 2

/** 공격력 증가 버프 최대 스택 */
export const ABILITY_DUNGEON_ATTACK_BUFF_MAX_STACKS = 100

/** 일반 몬스터 명중컷이 보스 몬스터보다 높은 수치 */
export const ABILITY_DUNGEON_NORMAL_HIT_CUT_BONUS = 2

/** 용사의 수련장 1단계 기준 필요 명중 (보스 몬스터) */
export const ABILITY_DUNGEON_BASE_HIT_CUT = 16

/** 용사의 수련장 단계 → 보스 몬스터 필요 명중 (1단계 18, 이후 공통 구간 증가) */
function getAbilityDungeonRequiredHitCut(stage: number) {
	return getGrowthDungeonRequiredHitCut(stage, ABILITY_DUNGEON_BASE_HIT_CUT)
}

/** 용사의 수련장 1~maxStage 단계 표 데이터 */
function buildAbilityDungeonHitCutEntries(maxStage = GROWTH_DUNGEON_MAX_STAGE): AbilityDungeonHitCutEntry[] {
	return Array.from({ length: maxStage }, (_, index) => {
		const stage = index + 1
		const requiredHit = getAbilityDungeonRequiredHitCut(stage)

		return {
			stage,
			requiredHit,
			isHardStage: isGrowthDungeonHardStage(stage)
		}
	})
}

/** 용사의 수련장 표에 바로 쓰는 단계별 데이터 */
export const ABILITY_DUNGEON_HIT_CUT_ENTRIES = buildAbilityDungeonHitCutEntries()

/** 강화 던전 발록 처치 제한시간(초). 전 단계 동일 */
export const ENHANCE_DUNGEON_TIME_LIMIT_SEC = 25

/** 강화 던전 의문의 주문서 획득 확률(%) */
export const ENHANCE_DUNGEON_MYSTERIOUS_SCROLL_DROP_PERCENT = 10

/**
 * 의문의 주문서 — 단계 구간별 티어 비율(%) 원본.
 * 동일 비율 구간(1~29)은 한 줄로 합칩니다.
 */
const ENHANCE_DUNGEON_MYSTERIOUS_SCROLL_TIER_BANDS = [
	{ stageFrom: 1, stageTo: 29, normal: 100, rare: 0, epic: 0 },
	{ stageFrom: 30, stageTo: 39, normal: 90, rare: 10, epic: 0 },
	{ stageFrom: 40, stageTo: 49, normal: 80, rare: 20, epic: 0 },
	{ stageFrom: 50, stageTo: 59, normal: 70, rare: 30, epic: 0 },
	{ stageFrom: 60, stageTo: 69, normal: 60, rare: 35, epic: 5 },
	{ stageFrom: 70, stageTo: 79, normal: 50, rare: 40, epic: 10 },
	{ stageFrom: 80, stageTo: 89, normal: 40, rare: 45, epic: 15 },
	{ stageFrom: 90, stageTo: 99, normal: 30, rare: 50, epic: 20 },
	{ stageFrom: 100, stageTo: 109, normal: 20, rare: 55, epic: 25 },
	{ stageFrom: 110, stageTo: 119, normal: 10, rare: 60, epic: 30 },
	{ stageFrom: 120, stageTo: 129, normal: 10, rare: 57.5, epic: 32.5 },
	{ stageFrom: 130, stageTo: 139, normal: 10, rare: 55, epic: 35 },
	{ stageFrom: 140, stageTo: 140, normal: 10, rare: 52.5, epic: 37.5 }
] as const satisfies ReadonlyArray<{ stageFrom: number; stageTo: number } & EnhanceDungeonMysteriousScrollTier>

/**
 * 티어 비율 → 세부 6종 **실제 획득** 확률(%).
 * 의문의 주문서 드롭률 × 티어 비율 × (노말 1종 / 레어 2종 균등 / 에픽 3종 균등).
 */
function getEnhanceDungeonMysteriousScrollDetailRates(
	tiers: EnhanceDungeonMysteriousScrollTier
): EnhanceDungeonMysteriousScrollDetailRates {
	const { normal, rare, epic } = tiers
	const dropRate = ENHANCE_DUNGEON_MYSTERIOUS_SCROLL_DROP_PERCENT / 100

	return {
		normal40: normal * dropRate,
		rare40: (rare / 2) * dropRate,
		rare25: (rare / 2) * dropRate,
		epic70: (epic / 3) * dropRate,
		epic30: (epic / 3) * dropRate,
		epic15: (epic / 3) * dropRate
	}
}

/** 구간 표에 바로 쓰는 의문의 주문서 확률 데이터 */
export const ENHANCE_DUNGEON_MYSTERIOUS_SCROLL_BAND_ENTRIES: EnhanceDungeonMysteriousScrollBandEntry[] =
	ENHANCE_DUNGEON_MYSTERIOUS_SCROLL_TIER_BANDS.map(({ stageFrom, stageTo, normal, rare, epic }) => {
		const tiers = { normal, rare, epic }

		return {
			stageFrom,
			stageTo,
			tiers,
			details: getEnhanceDungeonMysteriousScrollDetailRates(tiers)
		}
	})

/** 강화 던전 1단계 기준 필요 명중 */
export const ENHANCE_DUNGEON_BASE_HIT_CUT = 34

/** 강화 던전 1단계 주문의 흔적 획득 개수 */
export const ENHANCE_DUNGEON_BASE_SPELL_TRACE_COUNT = 155

/** 강화 던전 단계마다 증가하는 주문의 흔적 개수 */
export const ENHANCE_DUNGEON_SPELL_TRACE_INCREMENT = 5

/** 강화 던전 단계 → 필요 명중 (1단계 34, 이후 공통 구간 증가) */
function getEnhanceDungeonRequiredHitCut(stage: number) {
	return getGrowthDungeonRequiredHitCut(stage, ENHANCE_DUNGEON_BASE_HIT_CUT)
}

/** 강화 던전 단계 → 주문의 흔적 획득 개수 (1단계 155, 이후 +5) */
function getEnhanceDungeonSpellTraceCount(stage: number) {
	return ENHANCE_DUNGEON_BASE_SPELL_TRACE_COUNT + (stage - 1) * ENHANCE_DUNGEON_SPELL_TRACE_INCREMENT
}

/** 강화 던전 1~maxStage 단계 표 데이터 */
function buildEnhanceDungeonHitCutEntries(maxStage = GROWTH_DUNGEON_MAX_STAGE): EnhanceDungeonHitCutEntry[] {
	return Array.from({ length: maxStage }, (_, index) => {
		const stage = index + 1

		return {
			stage,
			requiredHit: getEnhanceDungeonRequiredHitCut(stage),
			spellTraceCount: getEnhanceDungeonSpellTraceCount(stage),
			isHardStage: isGrowthDungeonHardStage(stage)
		}
	})
}

/** 강화 던전 표에 바로 쓰는 단계별 데이터 */
export const ENHANCE_DUNGEON_HIT_CUT_ENTRIES = buildEnhanceDungeonHitCutEntries()

export {
	buildAbilityDungeonHitCutEntries,
	buildEnhanceDungeonHitCutEntries,
	buildEquipmentDungeonHitCutEntries,
	buildExperienceDungeonHitCutEntries,
	buildWeaponDungeonHitCutEntries,
	getAbilityDungeonRequiredHitCut,
	getEnhanceDungeonMysteriousScrollDetailRates,
	getEnhanceDungeonRequiredHitCut,
	getEnhanceDungeonSpellTraceCount,
	getEquipmentDungeonRequiredHitCut,
	getEquipmentDungeonRequiredKillCount,
	getEquipmentDungeonTimeLimitSec,
	getExperienceDungeonRequiredHitCut,
	getExperienceDungeonRequiredKillCount,
	getGrowthDungeonRequiredHitCut,
	getWeaponDungeonRequiredHitCut,
	isGrowthDungeonHardStage
}
