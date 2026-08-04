import type { GuildRivalryHitCutEntry } from '@/features/tips/types/guild-rivalry-hit-cut.type'

/** 표에 표시할 최대 단계 */
export const GUILD_RIVALRY_HIT_CUT_MAX_STAGE = 50

/** 1단계 기준 명중. 이후 단계마다 +8 */
export const GUILD_RIVALRY_BASE_HIT = 200

/** 단계가 오를 때마다 증가하는 명중 */
export const GUILD_RIVALRY_HIT_PER_STAGE = 8

/** 단계마다 보스 등장 전 나오는 잡몹 수 */
export const GUILD_RIVALRY_MOBS_PER_STAGE = 6

/** 잡몹 1마리 처치 시 얻는 보스 데미지 증가 스택 */
export const GUILD_RIVALRY_BUFF_STACK_PER_MOB = 1

/** 단계마다 잡몹을 모두 처치했을 때 얻는 스택 (마리 수 × 마리당 스택) */
export const GUILD_RIVALRY_BUFF_STACK_PER_STAGE = GUILD_RIVALRY_MOBS_PER_STAGE * GUILD_RIVALRY_BUFF_STACK_PER_MOB

/** 보스 몬스터 피격 시 감소하는 스택 */
export const GUILD_RIVALRY_BUFF_STACK_LOSS_ON_BOSS_HIT = 4

/**
 * 필요 명중보다 높을 때 최종 데미지 증가에 반영되는 최대 명중 차이.
 * (보유 명중 − 필요 명중)이 이 값을 넘어도 추가 이득은 없음.
 */
export const GUILD_RIVALRY_HIT_BONUS_MAX_DIFF = 30

/**
 * 단계 → 누적 보스 데미지 증가 스택.
 * 단계마다 잡몹 6마리 × +1 = +6이므로 stage × 6.
 */
function getGuildRivalryBuffStack(stage: number) {
	return stage * GUILD_RIVALRY_BUFF_STACK_PER_STAGE
}

/**
 * 단계 → 요구 명중.
 * 1단계 200, 이후 단계마다 +8 → 200 + (stage - 1) × 8.
 */
function getGuildRivalryRequiredHit(stage: number) {
	return GUILD_RIVALRY_BASE_HIT + (stage - 1) * GUILD_RIVALRY_HIT_PER_STAGE
}

/** 1~maxStage 단계 표 데이터 */
function buildGuildRivalryHitCutEntries(maxStage = GUILD_RIVALRY_HIT_CUT_MAX_STAGE): GuildRivalryHitCutEntry[] {
	return Array.from({ length: maxStage }, (_, index) => {
		const stage = index + 1

		return {
			stage,
			buffStack: getGuildRivalryBuffStack(stage),
			requiredHit: getGuildRivalryRequiredHit(stage)
		}
	})
}

/** 페이지 표에 바로 쓰는 1~40단 데이터 */
export const GUILD_RIVALRY_HIT_CUT_ENTRIES = buildGuildRivalryHitCutEntries()

export { buildGuildRivalryHitCutEntries, getGuildRivalryBuffStack, getGuildRivalryRequiredHit }
