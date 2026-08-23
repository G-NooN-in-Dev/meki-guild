import type { GuildRivalryHitCutEntry } from '@/features/tips/types/guild-rivalry-hit-cut.type'

type GuildRivalryHitTier = {
	/** 이 구간이 시작되는 단계 */
	startStage: number
	/** startStage 단계의 기본 명중컷 */
	baseHit: number
	/** startStage 이후 단계마다 더해지는 명중 */
	increment: number
}

/** 표에 표시할 최대 단계 */
export const GUILD_RIVALRY_HIT_CUT_MAX_STAGE = 80

/**
 * 단계별 보스/일반몹 기본 명중컷 구간.
 * 구간이 바뀌면 증가폭(increment)만 달라지고, 값은 직전 단계에서 이어집니다.
 * 소환 직후 보정(+20)은 포함하지 않습니다.
 */
export const GUILD_RIVALRY_HIT_TIERS = [
	{ startStage: 1, baseHit: 85, increment: 15 },
	{ startStage: 6, baseHit: 165, increment: 21 },
	{ startStage: 9, baseHit: 229, increment: 22 },
	{ startStage: 11, baseHit: 261, increment: 10 },
	{ startStage: 16, baseHit: 310, increment: 9 },
	{ startStage: 21, baseHit: 353, increment: 7 },
	{ startStage: 31, baseHit: 421, increment: 5 },
	{ startStage: 41, baseHit: 470, increment: 4 }
] as const satisfies readonly GuildRivalryHitTier[]

/** 잡몹 등장 시 기본 명중컷에 더해지는 값 */
export const GUILD_RIVALRY_SPAWN_HIT_BONUS = 20

/** 잡몹 등장 이후 일정 간격마다 감소하는 명중 */
export const GUILD_RIVALRY_SPAWN_HIT_DECAY = 2

/** 소환 보정 명중이 감소하는 간격(초) */
export const GUILD_RIVALRY_SPAWN_HIT_DECAY_INTERVAL_SEC = 0.8

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

/** 대항전 단계 기본 제한시간(초). 단계 전환 시에도 이 값을 넘지 않습니다. */
export const GUILD_RIVALRY_TIME_LIMIT_SEC = 35

/** 단계를 넘길 때 남은 제한시간에 더해지는 시간(초) */
export const GUILD_RIVALRY_TIME_LIMIT_REFILL_SEC = 20

/**
 * 단계 → 누적 보스 데미지 증가 스택.
 * 단계마다 잡몹 6마리 × +1 = +6이므로 stage × 6.
 */
function getGuildRivalryBuffStack(stage: number) {
	return stage * GUILD_RIVALRY_BUFF_STACK_PER_STAGE
}

/** 단계 → 보스/일반몹 기본 명중컷 */
function getGuildRivalryRequiredHit(stage: number) {
	let tier: GuildRivalryHitTier = GUILD_RIVALRY_HIT_TIERS[0]

	for (const candidate of GUILD_RIVALRY_HIT_TIERS) {
		if (stage >= candidate.startStage) {
			tier = candidate
		} else {
			break
		}
	}

	const { baseHit, increment, startStage } = tier

	return baseHit + (stage - startStage) * increment
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

/** 페이지 표에 바로 쓰는 단계별 데이터 */
export const GUILD_RIVALRY_HIT_CUT_ENTRIES = buildGuildRivalryHitCutEntries()

export { buildGuildRivalryHitCutEntries, getGuildRivalryBuffStack, getGuildRivalryRequiredHit }
export type { GuildRivalryHitTier }
