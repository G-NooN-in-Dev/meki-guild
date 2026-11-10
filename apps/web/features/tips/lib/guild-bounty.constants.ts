import type {
	GuildBountyAttack,
	GuildBountyAttackEffectId,
	GuildBountyBuffOrb,
	GuildBountyMonster,
	GuildBountyStageBand,
	GuildBountyStageEntry,
	GuildBountyTipsEntry
} from '@/features/tips/types/guild-bounty.type'

/** 현상수배(불꽃늑대) 최대 클리어 단계 */
const GUILD_BOUNTY_MAX_STAGE = 100

/** 1단계 클리어 점수 */
const GUILD_BOUNTY_STAGE_CLEAR_SCORE_BASE = 100

/** 어려운 단계가 반복되는 간격 */
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

/** Dialog·표기용 10단계 밴드 */
const GUILD_BOUNTY_STAGE_BANDS = Array.from({ length: GUILD_BOUNTY_MAX_STAGE / 10 }, (_, index) => {
	const fromStage = index * 10 + 1

	return {
		fromStage,
		toStage: fromStage + 9
	} satisfies GuildBountyStageBand
}) as readonly GuildBountyStageBand[]

/** 현상수배 제한시간(초) */
const GUILD_BOUNTY_TIME_LIMIT_SEC = 120

/** 전 단계 공통 필요 명중 */
const GUILD_BOUNTY_REQUIRED_HIT = 263

/** 1단계 방어력 */
const GUILD_BOUNTY_DEFENSE_BASE = 30000

/** 단계마다 증가하는 방어력 */
const GUILD_BOUNTY_DEFENSE_INCREMENT = 1500

/** 동료 최대 소환 수 */
const GUILD_BOUNTY_COMPANION_MAX_COUNT = 3

/** 첫 동료 소환 가능 시각(컨텐츠 시작 후 초) */
const GUILD_BOUNTY_COMPANION_FIRST_AVAILABLE_SEC = 6

/** 이후 동료 소환 가능 간격(초) */
const GUILD_BOUNTY_COMPANION_INTERVAL_SEC = 35

/** 버프 구슬 총 생성 횟수 */
const GUILD_BOUNTY_BUFF_ORB_COUNT = 3

/** 첫 버프 구슬 생성 시각(컨텐츠 시작 후 초) */
const GUILD_BOUNTY_BUFF_ORB_FIRST_SPAWN_SEC = 3

/** 이후 버프 구슬 생성 간격(초) */
const GUILD_BOUNTY_BUFF_ORB_INTERVAL_SEC = 34.5

/**
 * 버프 구슬 생성 시점의 남은 시간 표기.
 * 간격이 소수(34.5초)라 2·3번째는 초 단위 범위로 적어 둡니다.
 */
const GUILD_BOUNTY_BUFF_ORB_REMAINING_LABELS = [
	'01:57',
	'01:22 ~ 01:23 사이',
	'00:47 ~ 00:48 사이'
] as const satisfies readonly string[]

/** 버프 구슬 미획득 시 사라지는 시간(초) */
const GUILD_BOUNTY_BUFF_ORB_DESPAWN_SEC = 7

/** 보스 강화·동료 약점 발동 HP 비율(%) */
const GUILD_BOUNTY_BOSS_ENRAGE_HP_PERCENT = 50

/** 일반 모드 불꽃늑대 */
const GUILD_BOUNTY_NORMAL_MONSTER = {
	id: 'flame-wolf',
	label: '불꽃늑대',
	imageSrc: '/monsters/flame-wolf.gif',
	imageWidth: 600,
	imageHeight: 620
} as const satisfies GuildBountyMonster

/** 5단계마다 등장하는 어려운 모드 불꽃늑대 */
const GUILD_BOUNTY_HARD_MONSTER = {
	id: 'extreme-flame-wolf',
	label: '익스트림 불꽃늑대',
	imageSrc: '/monsters/extreme-flame-wolf.gif',
	imageWidth: 750,
	imageHeight: 466
} as const satisfies GuildBountyMonster

/** 공격 효과 표시 문구·Badge 스타일 */
const GUILD_BOUNTY_ATTACK_EFFECT_META = {
	'final-damage-down': {
		label: '최종 데미지 감소',
		badgeClassName: 'bg-pastel-purple-100 text-pastel-purple-900'
	},
	'move-speed-down': {
		label: '이동속도 감소',
		badgeClassName: 'bg-pastel-green-100 text-pastel-green-900'
	}
} as const satisfies Record<GuildBountyAttackEffectId, { label: string; badgeClassName: string }>

/** 불꽃늑대 공격 패턴 */
const GUILD_BOUNTY_ATTACKS = [
	{ id: 'large-circle', name: '큰 원 공격', effects: ['final-damage-down'] },
	{ id: 'medium-circle', name: '중간 원 공격', effects: ['move-speed-down'] },
	{ id: 'small-circle', name: '작은 원 공격', effects: ['final-damage-down'] },
	{ id: 'horizontal', name: 'ㅡ자 공격', effects: ['move-speed-down'] }
] as const satisfies readonly GuildBountyAttack[]

/**
 * 버프 구슬 표시 메타.
 * 플레이어 현재 위치 기준 좌·우에 생성됩니다. 좌측은 빨강, 우측은 노랑입니다.
 * 효과 문구는 summary에서 EmphasizedText와 함께 작성합니다.
 */
const GUILD_BOUNTY_BUFF_ORBS = [
	{
		id: 'left',
		sideLabel: '좌측',
		badgeClassName: 'bg-red-100 text-red-900'
	},
	{
		id: 'right',
		sideLabel: '우측',
		badgeClassName: 'bg-yellow-100 text-yellow-900'
	}
] as const satisfies readonly GuildBountyBuffOrb[]

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

/** 경과 초 → 남은 시간 MM:SS */
function formatGuildBountyRemainingTime(elapsedSec: number): string {
	const remainingSec = Math.max(0, Math.round(GUILD_BOUNTY_TIME_LIMIT_SEC - elapsedSec))
	const minutes = Math.floor(remainingSec / 60)
	const seconds = remainingSec % 60

	return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/** 동료 n번째(1부터) 소환 가능 시각(컨텐츠 시작 후 초) */
function getGuildBountyCompanionAvailableSec(order: number): number {
	return GUILD_BOUNTY_COMPANION_FIRST_AVAILABLE_SEC + (order - 1) * GUILD_BOUNTY_COMPANION_INTERVAL_SEC
}

/** 자동 소환 설정 시 동료 소환 시점(경과·남은 시간) 목록 */
function getGuildBountyCompanionTimings() {
	return Array.from({ length: GUILD_BOUNTY_COMPANION_MAX_COUNT }, (_, index) => {
		const order = index + 1
		const elapsedSec = getGuildBountyCompanionAvailableSec(order)

		return {
			order,
			elapsedSec,
			remainingLabel: formatGuildBountyRemainingTime(elapsedSec)
		}
	})
}

/** 단계 → 방어력 (1단계 30000, 이후 +1500) */
function getGuildBountyDefense(stage: number): number {
	return GUILD_BOUNTY_DEFENSE_BASE + (stage - 1) * GUILD_BOUNTY_DEFENSE_INCREMENT
}

/** 팁 페이지 단계 표 데이터 */
function buildGuildBountyTipsEntries(maxStage = GUILD_BOUNTY_MAX_STAGE): readonly GuildBountyTipsEntry[] {
	return getGuildBountyStageEntries(maxStage).map(({ stage, clearScore, huntingScore, isHardStage }) => ({
		stage,
		defense: getGuildBountyDefense(stage),
		requiredHit: GUILD_BOUNTY_REQUIRED_HIT,
		clearScore,
		huntingScore,
		isHardStage
	}))
}

const GUILD_BOUNTY_TIPS_ENTRIES = buildGuildBountyTipsEntries()

export {
	getGuildBountyCompanionTimings,
	getGuildBountyDefense,
	getGuildBountyHuntingScore,
	getGuildBountyStageClearScore,
	getGuildBountyStageEntries,
	GUILD_BOUNTY_ATTACK_EFFECT_META,
	GUILD_BOUNTY_ATTACKS,
	GUILD_BOUNTY_BOSS_ENRAGE_HP_PERCENT,
	GUILD_BOUNTY_BUFF_ORB_COUNT,
	GUILD_BOUNTY_BUFF_ORB_DESPAWN_SEC,
	GUILD_BOUNTY_BUFF_ORB_FIRST_SPAWN_SEC,
	GUILD_BOUNTY_BUFF_ORB_INTERVAL_SEC,
	GUILD_BOUNTY_BUFF_ORB_REMAINING_LABELS,
	GUILD_BOUNTY_BUFF_ORBS,
	GUILD_BOUNTY_COMPANION_FIRST_AVAILABLE_SEC,
	GUILD_BOUNTY_COMPANION_INTERVAL_SEC,
	GUILD_BOUNTY_COMPANION_MAX_COUNT,
	GUILD_BOUNTY_DEFENSE_BASE,
	GUILD_BOUNTY_DEFENSE_INCREMENT,
	GUILD_BOUNTY_HARD_MONSTER,
	GUILD_BOUNTY_HARD_STAGE_INTERVAL,
	GUILD_BOUNTY_MAX_STAGE,
	GUILD_BOUNTY_NORMAL_MONSTER,
	GUILD_BOUNTY_REQUIRED_HIT,
	GUILD_BOUNTY_STAGE_BANDS,
	GUILD_BOUNTY_TIME_LIMIT_SEC,
	GUILD_BOUNTY_TIPS_ENTRIES,
	isGuildBountyHardStage,
	isValidGuildBountyStage
}
export type { GuildBountyStageBand, GuildBountyStageEntry }
