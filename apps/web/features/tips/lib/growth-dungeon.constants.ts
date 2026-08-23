import type { GrowthDungeonHitCutEntry } from '@/features/tips/types/growth-dungeon.type'

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

export { buildWeaponDungeonHitCutEntries, getWeaponDungeonRequiredHitCut, isGrowthDungeonHardStage }
