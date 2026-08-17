import type { GuildRivalryHitCutEntry } from '@/features/tips/types/guild-rivalry-hit-cut.type'

/**
 * 단계별 보스/일반몹 기본 명중컷. index 0 = 1단계.
 * 소환 직후 보정(+20)은 포함하지 않습니다.
 */
export const GUILD_RIVALRY_BASE_HIT_BY_STAGE = [
	85, 100, 115, 130, 145, 165, 186, 207, 229, 251, 261, 271, 281, 291, 301, 310, 319, 328, 337, 346, 353, 360, 367, 374,
	381, 388, 395, 402, 409, 416, 421, 426, 431, 436, 441, 446, 451, 456, 461, 466, 470, 474, 478, 482, 486, 490, 494,
	498, 502, 506, 510, 514, 518, 522, 526, 530, 534, 538, 542, 546, 550, 554, 558, 562, 566, 570, 574, 578, 582, 586,
	590, 594, 598, 602, 606, 610, 614, 618, 622, 626, 630
] as const

/** 표에 표시할 최대 단계. 원본 배열은 이보다 길어도 여기까지만 보여 줍니다. */
export const GUILD_RIVALRY_HIT_CUT_MAX_STAGE = 80

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
	return GUILD_RIVALRY_BASE_HIT_BY_STAGE[stage - 1]
}

/** 1~maxStage 단계 표 데이터 */
function buildGuildRivalryHitCutEntries(maxStage = GUILD_RIVALRY_HIT_CUT_MAX_STAGE): GuildRivalryHitCutEntry[] {
	return GUILD_RIVALRY_BASE_HIT_BY_STAGE.slice(0, maxStage).map((requiredHit, index) => {
		const stage = index + 1

		return {
			stage,
			buffStack: getGuildRivalryBuffStack(stage),
			requiredHit
		}
	})
}

/** 페이지 표에 바로 쓰는 단계별 데이터 */
export const GUILD_RIVALRY_HIT_CUT_ENTRIES = buildGuildRivalryHitCutEntries()

export { buildGuildRivalryHitCutEntries, getGuildRivalryBuffStack, getGuildRivalryRequiredHit }
