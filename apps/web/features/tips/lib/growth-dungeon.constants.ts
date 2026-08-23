import type { ExperienceDungeonHitCutEntry, GrowthDungeonHitCutEntry } from '@/features/tips/types/growth-dungeon.type'

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

/** 성장 던전 공통 — 10의 배수 단계는 어려운 단계 */
function isGrowthDungeonHardStage(stage: number) {
	return stage > 0 && stage % GROWTH_DUNGEON_HARD_STAGE_INTERVAL === 0
}

/** 무기 던전 머쉬맘 처치 제한시간(초). 전 단계 동일 */
export const WEAPON_DUNGEON_TIME_LIMIT_SEC = 22

/** 무기 던전 1단계 기준 필요 명중 */
export const WEAPON_DUNGEON_BASE_HIT_CUT = 7

/** 무기 던전 단계당 필요 명중 증가 */
export const WEAPON_DUNGEON_HIT_CUT_INCREMENT = 2

/** 무기 던전 단계 → 필요 명중 (1단계 7, 이후 단계마다 +2) */
function getWeaponDungeonRequiredHitCut(stage: number) {
	return WEAPON_DUNGEON_BASE_HIT_CUT + (stage - 1) * WEAPON_DUNGEON_HIT_CUT_INCREMENT
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

/** 경험치 던전 단계당 필요 명중 증가 */
export const EXPERIENCE_DUNGEON_HIT_CUT_INCREMENT = 2

/** 경험치 던전 단계 → 필요 명중 (1단계 8, 이후 단계마다 +2) */
function getExperienceDungeonRequiredHitCut(stage: number) {
	return EXPERIENCE_DUNGEON_BASE_HIT_CUT + (stage - 1) * EXPERIENCE_DUNGEON_HIT_CUT_INCREMENT
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

export {
	buildExperienceDungeonHitCutEntries,
	buildWeaponDungeonHitCutEntries,
	getExperienceDungeonRequiredHitCut,
	getExperienceDungeonRequiredKillCount,
	getWeaponDungeonRequiredHitCut,
	isGrowthDungeonHardStage
}
