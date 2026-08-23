import type { GuildExpeditionHitCutEntry } from '@/features/tips/types/guild-expedition-hit-cut.type'

/** 표에 표시할 최대 단계 */
export const GUILD_EXPEDITION_HIT_CUT_MAX_STAGE = 50

/** 11단계부터 적용되는 후반 구간 시작 단계 */
export const GUILD_EXPEDITION_LATE_TIER_START_STAGE = 11

/** 1~10단계 1단계 기준 필요 명중 */
export const GUILD_EXPEDITION_EARLY_HIT_BASE = 39

/** 1~10단계 단계당 필요 명중 증가 */
export const GUILD_EXPEDITION_EARLY_HIT_INCREMENT = 12

/** 11단계 이상 11단계 기준 필요 명중 */
export const GUILD_EXPEDITION_LATE_HIT_BASE = 150

/** 11단계 이상 단계당 필요 명중 증가 */
export const GUILD_EXPEDITION_LATE_HIT_INCREMENT = 3

/** 시작 제한시간(초). 단계 클리어 시 충전되어도 이 값을 넘지 않습니다. */
export const GUILD_EXPEDITION_TIME_LIMIT_SEC = 50

/** 단계 클리어 시 충전되는 제한시간(초). 11단계부터는 충전되지 않습니다. */
export const GUILD_EXPEDITION_TIME_LIMIT_REFILL_SEC = 5

/** 1~10단계 1단계 기준 제한시간(초) */
export const GUILD_EXPEDITION_EARLY_TIME_LIMIT_BASE_SEC = GUILD_EXPEDITION_TIME_LIMIT_SEC

/** 1~10단계 단계당 제한시간 증가(초) */
export const GUILD_EXPEDITION_EARLY_TIME_LIMIT_INCREMENT_SEC = 5

/** 11단계 이상 고정 제한시간(초) */
export const GUILD_EXPEDITION_LATE_TIME_LIMIT_SEC = 100

/** 단계 → 필요 명중 */
function getGuildExpeditionRequiredHit(stage: number) {
	if (stage < GUILD_EXPEDITION_LATE_TIER_START_STAGE) {
		return GUILD_EXPEDITION_EARLY_HIT_BASE + (stage - 1) * GUILD_EXPEDITION_EARLY_HIT_INCREMENT
	}

	return (
		GUILD_EXPEDITION_LATE_HIT_BASE +
		(stage - GUILD_EXPEDITION_LATE_TIER_START_STAGE) * GUILD_EXPEDITION_LATE_HIT_INCREMENT
	)
}

/** 단계 → 제한시간(초) */
function getGuildExpeditionTimeLimitSec(stage: number) {
	if (stage < GUILD_EXPEDITION_LATE_TIER_START_STAGE) {
		return GUILD_EXPEDITION_EARLY_TIME_LIMIT_BASE_SEC + (stage - 1) * GUILD_EXPEDITION_EARLY_TIME_LIMIT_INCREMENT_SEC
	}

	return GUILD_EXPEDITION_LATE_TIME_LIMIT_SEC
}

/** 1~maxStage 단계 표 데이터 */
function buildGuildExpeditionHitCutEntries(
	maxStage = GUILD_EXPEDITION_HIT_CUT_MAX_STAGE
): GuildExpeditionHitCutEntry[] {
	return Array.from({ length: maxStage }, (_, index) => {
		const stage = index + 1

		return {
			stage,
			requiredHit: getGuildExpeditionRequiredHit(stage),
			timeLimitSec: getGuildExpeditionTimeLimitSec(stage)
		}
	})
}

/** 페이지 표에 바로 쓰는 단계별 데이터 */
export const GUILD_EXPEDITION_HIT_CUT_ENTRIES = buildGuildExpeditionHitCutEntries()

export { buildGuildExpeditionHitCutEntries, getGuildExpeditionRequiredHit, getGuildExpeditionTimeLimitSec }
