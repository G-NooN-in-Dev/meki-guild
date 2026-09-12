import type { GuildTrainingHitTier, GuildTrainingStageEntry } from '@/features/tips/types/guild-training-info.type'

/** 표에 표시할 최대 단계 */
export const GUILD_TRAINING_MAX_STAGE = 50

/** 시작 제한시간(초) */
export const GUILD_TRAINING_TIME_LIMIT_SEC = 90

/** 일반몹 처치 수마다 제한시간에 더해지는 시간(초) */
export const GUILD_TRAINING_TIME_BONUS_SEC = 2

/** 제한시간 보너스가 발생하는 일반몹 처치 간격 */
export const GUILD_TRAINING_TIME_BONUS_KILL_INTERVAL = 30

/** 단계마다 나오는 일반몹 수 */
export const GUILD_TRAINING_NORMAL_MOB_COUNT = 84

/** 일반몹 소환 쿨타임(초) */
export const GUILD_TRAINING_NORMAL_MOB_SPAWN_COOLDOWN_SEC = 8

/** 단계마다 나오는 특수몹 수 */
export const GUILD_TRAINING_SPECIAL_MOB_COUNT = 3

/** 특수몹 소환 쿨타임(초) */
export const GUILD_TRAINING_SPECIAL_MOB_SPAWN_COOLDOWN_SEC = 20

/** 1단계 특수몹 필요 타수 */
export const GUILD_TRAINING_SPECIAL_HITS_BASE = 20

/** 단계마다 특수몹 필요 타수 증가 */
export const GUILD_TRAINING_SPECIAL_HITS_INCREMENT = 4

/** 1단계 일반몹 처치 점수 */
export const GUILD_TRAINING_NORMAL_KILL_SCORE_BASE = 300

/** 일반몹 점수 — 단계 증가 1차 항 계수 */
export const GUILD_TRAINING_NORMAL_KILL_SCORE_LINEAR = 309

/** 일반몹 점수 — 단계 증가 3차 항 계수 */
export const GUILD_TRAINING_NORMAL_KILL_SCORE_CUBIC = 9

/** 1단계 특수몹 처치 점수 */
export const GUILD_TRAINING_SPECIAL_KILL_SCORE_BASE = 3750

/** 특수몹 점수 — 단계 증가 1차 항 계수 */
export const GUILD_TRAINING_SPECIAL_KILL_SCORE_LINEAR = 3780

/** 특수몹 점수 — 단계 증가 3차 항 계수 */
export const GUILD_TRAINING_SPECIAL_KILL_SCORE_CUBIC = 30

/** 특수몹 처치 효과 지속 시간(초) */
export const GUILD_TRAINING_SPECIAL_KILL_EFFECT_DURATION_SEC = 10

/** 일반몹 빈사 상태 해제 시간(초) */
export const GUILD_TRAINING_NORMAL_DEATH_STATE_RECOVERY_SEC = 3

/**
 * 일반몹 명중컷 구간.
 * 특수몹 명중컷은 `2 × 일반몹 명중컷 − 1단계 기준(80)`으로 유도합니다.
 */
export const GUILD_TRAINING_HIT_TIERS = [
	{ startStage: 1, baseHit: 80, increment: 18 },
	{ startStage: 4, baseHit: 130, increment: 14 },
	{ startStage: 6, baseHit: 154, increment: 10 },
	{ startStage: 9, baseHit: 182, increment: 8 },
	{ startStage: 11, baseHit: 197, increment: 7 },
	{ startStage: 16, baseHit: 231, increment: 6 },
	{ startStage: 21, baseHit: 259, increment: 4 }
] as const satisfies readonly GuildTrainingHitTier[]

/** 1단계 일반/특수 공통 명중컷 (특수몹 공식의 기준값) */
export const GUILD_TRAINING_BASE_HIT_CUT = GUILD_TRAINING_HIT_TIERS[0].baseHit

/** 단계 → 특수몹 필요 타수 (1단계 20, 이후 +4) */
function getGuildTrainingSpecialRequiredHits(stage: number) {
	return GUILD_TRAINING_SPECIAL_HITS_BASE + (stage - 1) * GUILD_TRAINING_SPECIAL_HITS_INCREMENT
}

/** 단계 → 일반몹 명중컷 */
function getGuildTrainingNormalHitCut(stage: number) {
	let tier: GuildTrainingHitTier = GUILD_TRAINING_HIT_TIERS[0]

	for (const candidate of GUILD_TRAINING_HIT_TIERS) {
		if (stage >= candidate.startStage) {
			tier = candidate
		} else {
			break
		}
	}

	const { baseHit, increment, startStage } = tier

	return baseHit + (stage - startStage) * increment
}

/** 단계 → 특수몹 명중컷 (일반몹의 2배 증가폭) */
function getGuildTrainingSpecialHitCut(stage: number) {
	return 2 * getGuildTrainingNormalHitCut(stage) - GUILD_TRAINING_BASE_HIT_CUT
}

/**
 * 단계 → 일반몹 처치 점수.
 * `base + linear×(s−1) + cubic×s×(s−1)×(s−2)`
 */
function getGuildTrainingNormalKillScore(stage: number) {
	return (
		GUILD_TRAINING_NORMAL_KILL_SCORE_BASE +
		GUILD_TRAINING_NORMAL_KILL_SCORE_LINEAR * (stage - 1) +
		GUILD_TRAINING_NORMAL_KILL_SCORE_CUBIC * stage * (stage - 1) * (stage - 2)
	)
}

/**
 * 단계 → 특수몹 처치 점수.
 * `base + linear×(s−1) + cubic×s×(s−1)×(s−2)`
 */
function getGuildTrainingSpecialKillScore(stage: number) {
	return (
		GUILD_TRAINING_SPECIAL_KILL_SCORE_BASE +
		GUILD_TRAINING_SPECIAL_KILL_SCORE_LINEAR * (stage - 1) +
		GUILD_TRAINING_SPECIAL_KILL_SCORE_CUBIC * stage * (stage - 1) * (stage - 2)
	)
}

/** 1~maxStage 단계 표 데이터 */
function buildGuildTrainingStageEntries(maxStage = GUILD_TRAINING_MAX_STAGE): GuildTrainingStageEntry[] {
	return Array.from({ length: maxStage }, (_, index) => {
		const stage = index + 1

		return {
			stage,
			normalKillScore: getGuildTrainingNormalKillScore(stage),
			normalHitCut: getGuildTrainingNormalHitCut(stage),
			specialKillScore: getGuildTrainingSpecialKillScore(stage),
			specialHitCut: getGuildTrainingSpecialHitCut(stage),
			specialRequiredHits: getGuildTrainingSpecialRequiredHits(stage)
		}
	})
}

/** 페이지 표에 바로 쓰는 단계별 데이터 */
export const GUILD_TRAINING_STAGE_ENTRIES = buildGuildTrainingStageEntries()

export {
	buildGuildTrainingStageEntries,
	getGuildTrainingNormalHitCut,
	getGuildTrainingNormalKillScore,
	getGuildTrainingSpecialHitCut,
	getGuildTrainingSpecialKillScore,
	getGuildTrainingSpecialRequiredHits
}
