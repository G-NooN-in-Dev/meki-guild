/** 현상수배(불꽃늑대) 최대 클리어 단계 */
const GUILD_BOUNTY_MAX_STAGE = 100

/** 1단계 클리어 점수 */
const GUILD_BOUNTY_STAGE_CLEAR_SCORE_BASE = 100

/**
 * 어려운 단계가 반복되는 간격.
 */
const GUILD_BOUNTY_HARD_STAGE_INTERVAL = 5

/** 1~15단계 일반 증가폭 */
const GUILD_BOUNTY_EARLY_NORMAL_STEP = 10

/**
 * 16단계부터 15단계 블록마다 일반 증가폭이 +10씩 커집니다.
 * 16~30 → 20, 31~45 → 30, …
 */
const GUILD_BOUNTY_BLOCK_SIZE = 15

/** 어려운 단계 증가폭 = 해당 구간 일반 증가폭 × 배수 (16단계 이후) */
const GUILD_BOUNTY_HARD_STEP_MULTIPLIER = 6

/** Dialog·tips 표기용 10단계 밴드 */
type GuildBountyStageBand = {
	fromStage: number
	toStage: number
}

const GUILD_BOUNTY_STAGE_BANDS = Array.from({ length: GUILD_BOUNTY_MAX_STAGE / 10 }, (_, index) => {
	const fromStage = index * 10 + 1

	return {
		fromStage,
		toStage: fromStage + 9
	} satisfies GuildBountyStageBand
}) as readonly GuildBountyStageBand[]

type GuildBountyStageEntry = {
	stage: number
	/** 해당 단계 클리어 점수 */
	clearScore: number
	/** 1~stage 누적 합 (= 사냥 실적) */
	huntingScore: number
	/** 5·10·15… 어려운 단계 여부 */
	isHardStage: boolean
}

function isValidGuildBountyStage(stage: number): boolean {
	return Number.isInteger(stage) && stage >= 1 && stage <= GUILD_BOUNTY_MAX_STAGE
}

/** 5의 배수 단계는 어려운 단계 */
function isGuildBountyHardStage(stage: number): boolean {
	return stage > 0 && stage % GUILD_BOUNTY_HARD_STAGE_INTERVAL === 0
}

/**
 * stage 점수 = (stage−1) 점수 + 이 증가폭.
 * - 1~15: 일반 +10, 어려운 단계(5/10/15)는 +20/+30/+40
 * - 16~: 15단계 블록마다 일반 증가폭 +10, 어려운 단계는 일반×6
 */
function getGuildBountyStageClearScoreStep(stage: number): number {
	if (stage <= 1) {
		return 0
	}

	if (stage <= GUILD_BOUNTY_BLOCK_SIZE) {
		if (isGuildBountyHardStage(stage)) {
			return (
				GUILD_BOUNTY_EARLY_NORMAL_STEP + GUILD_BOUNTY_EARLY_NORMAL_STEP * (stage / GUILD_BOUNTY_HARD_STAGE_INTERVAL)
			)
		}

		return GUILD_BOUNTY_EARLY_NORMAL_STEP
	}

	const block = Math.ceil((stage - GUILD_BOUNTY_BLOCK_SIZE) / GUILD_BOUNTY_BLOCK_SIZE)
	const normalStep = GUILD_BOUNTY_EARLY_NORMAL_STEP + GUILD_BOUNTY_EARLY_NORMAL_STEP * block

	return isGuildBountyHardStage(stage) ? normalStep * GUILD_BOUNTY_HARD_STEP_MULTIPLIER : normalStep
}

/** 해당 단계의 클리어 점수. 범위 밖이면 null */
function getGuildBountyStageClearScore(stage: number): number | null {
	if (!isValidGuildBountyStage(stage)) {
		return null
	}

	let score = GUILD_BOUNTY_STAGE_CLEAR_SCORE_BASE

	for (let current = 2; current <= stage; current += 1) {
		score += getGuildBountyStageClearScoreStep(current)
	}

	return score
}

/** 1~N단계 클리어 점수 누적 합(사냥 실적). 범위 밖이면 null */
function getGuildBountyHuntingScore(clearedStage: number): number | null {
	if (!isValidGuildBountyStage(clearedStage)) {
		return null
	}

	let sum = 0

	for (let stage = 1; stage <= clearedStage; stage += 1) {
		const clearScore = getGuildBountyStageClearScore(stage)

		if (clearScore === null) {
			return null
		}

		sum += clearScore
	}

	return sum
}

/** 1~maxStage 각 단계의 클리어·누적 점수 목록 */
function getGuildBountyStageEntries(maxStage: number = GUILD_BOUNTY_MAX_STAGE): readonly GuildBountyStageEntry[] {
	const limit = Math.min(Math.max(maxStage, 0), GUILD_BOUNTY_MAX_STAGE)
	const entries: GuildBountyStageEntry[] = []
	let huntingScore = 0
	let clearScore = GUILD_BOUNTY_STAGE_CLEAR_SCORE_BASE

	for (let stage = 1; stage <= limit; stage += 1) {
		if (stage > 1) {
			clearScore += getGuildBountyStageClearScoreStep(stage)
		}

		huntingScore += clearScore
		entries.push({
			stage,
			clearScore,
			huntingScore,
			isHardStage: isGuildBountyHardStage(stage)
		})
	}

	return entries
}

export {
	getGuildBountyHuntingScore,
	getGuildBountyStageClearScore,
	getGuildBountyStageEntries,
	GUILD_BOUNTY_HARD_STAGE_INTERVAL,
	GUILD_BOUNTY_MAX_STAGE,
	GUILD_BOUNTY_STAGE_BANDS,
	isGuildBountyHardStage,
	isValidGuildBountyStage
}
export type { GuildBountyStageBand, GuildBountyStageEntry }
