import type { WorldBossEntry } from '@/features/tips/types/world-boss.type'

/** 표에 표시할 최대 단계 */
const WORLD_BOSS_MAX_STAGE = 20

/** 1단계 기준 필요 명중 */
const WORLD_BOSS_HIT_BASE = 15

/** 단계당 필요 명중 증가 */
const WORLD_BOSS_HIT_INCREMENT = 12

/** 방어력이 고정되기 시작하는 단계 */
const WORLD_BOSS_FLAT_DEFENSE_START_STAGE = 10

/** 10단계부터 고정되는 방어력 */
const WORLD_BOSS_FLAT_DEFENSE = 62100

/** 킹 캐슬 골렘 처치 제한시간(초) */
export const WORLD_BOSS_TIME_LIMIT_SEC = 75

/**
 * 킹 캐슬 골렘 표시 메타.
 * imageWidth/Height는 원본 GIF 픽셀이며, 화면 크기는 CSS로 맞춥니다.
 */
export const WORLD_BOSS_META = {
	label: '킹 캐슬 골렘',
	imageSrc: '/monsters/king-castle-golem.gif',
	imageWidth: 400,
	imageHeight: 293
} as const

/**
 * 1~9단계 방어력.
 * 10단계부터는 단계가 올라도 WORLD_BOSS_FLAT_DEFENSE로 고정됩니다.
 */
const WORLD_BOSS_EARLY_DEFENSE = [1500, 3000, 4500, 7800, 13200, 23200, 35700, 54500, 82500] as const

/** 단계 → 필요 명중. 1단계 15, 이후 단계마다 12씩 증가합니다. */
function getWorldBossRequiredHit(stage: number) {
	return WORLD_BOSS_HIT_BASE + (stage - 1) * WORLD_BOSS_HIT_INCREMENT
}

/** 단계 → 방어력. 9단계까지는 표 값, 10단계부터는 고정값입니다. */
function getWorldBossDefense(stage: number) {
	if (stage >= WORLD_BOSS_FLAT_DEFENSE_START_STAGE) {
		return WORLD_BOSS_FLAT_DEFENSE
	}

	return WORLD_BOSS_EARLY_DEFENSE[stage - 1] ?? WORLD_BOSS_FLAT_DEFENSE
}

/** 1~maxStage 단계 표 데이터 */
function buildWorldBossEntries(maxStage = WORLD_BOSS_MAX_STAGE): WorldBossEntry[] {
	return Array.from({ length: maxStage }, (_, index) => {
		const stage = index + 1

		return {
			stage,
			defense: getWorldBossDefense(stage),
			requiredHit: getWorldBossRequiredHit(stage)
		}
	})
}

/** 페이지 표에 바로 쓰는 단계별 데이터 */
export const WORLD_BOSS_ENTRIES = buildWorldBossEntries()
