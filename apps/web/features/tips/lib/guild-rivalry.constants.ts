import type {
	GuildRivalryAttackEffectId,
	GuildRivalryAttackRangeId,
	GuildRivalryBoss,
	GuildRivalryBossId,
	GuildRivalryEntry
} from '@/features/tips/types/guild-rivalry.type'

type GuildRivalryHitTier = {
	/** 이 구간이 시작되는 단계 */
	startStage: number
	/** startStage 단계의 기본 명중컷 */
	baseHit: number
	/** startStage 이후 단계마다 더해지는 명중 */
	increment: number
}

/** 표에 표시할 최대 단계 */
const GUILD_RIVALRY_MAX_STAGE = 80

/**
 * 단계별 보스/일반몹 기본 명중컷 구간.
 * 구간이 바뀌면 증가폭(increment)만 달라지고, 값은 직전 단계에서 이어집니다.
 * 소환 직후 보정(+20)은 포함하지 않습니다.
 */
const GUILD_RIVALRY_HIT_TIERS = [
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

/** 잡몹 방어력 (전 단계 고정) */
export const GUILD_RIVALRY_MOB_DEFENSE = 1000

/** 보스 방어력 (전 단계 고정) */
export const GUILD_RIVALRY_BOSS_DEFENSE = 10000

/** 단계마다 보스 등장 전 나오는 잡몹 수 */
export const GUILD_RIVALRY_MOBS_PER_STAGE = 6

/** 잡몹 1마리 처치 시 얻는 보스 데미지 증가 스택 */
export const GUILD_RIVALRY_BUFF_STACK_PER_MOB = 1

/** 단계마다 잡몹을 모두 처치했을 때 얻는 스택 (마리 수 × 마리당 스택) */
export const GUILD_RIVALRY_BUFF_STACK_PER_STAGE = GUILD_RIVALRY_MOBS_PER_STAGE * GUILD_RIVALRY_BUFF_STACK_PER_MOB

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

/** 단계 → 잡몹 등장 직후 필요 명중 (기본 + 소환 보정) */
function getGuildRivalrySpawnRequiredHit(stage: number) {
	return getGuildRivalryRequiredHit(stage) + GUILD_RIVALRY_SPAWN_HIT_BONUS
}

/** 1~maxStage 단계 표 데이터 */
function buildGuildRivalryEntries(maxStage = GUILD_RIVALRY_MAX_STAGE): GuildRivalryEntry[] {
	return Array.from({ length: maxStage }, (_, index) => {
		const stage = index + 1
		const requiredHit = getGuildRivalryRequiredHit(stage)

		return {
			stage,
			buffStack: getGuildRivalryBuffStack(stage),
			requiredHit,
			spawnRequiredHit: getGuildRivalrySpawnRequiredHit(stage)
		}
	})
}

/** 페이지 표에 바로 쓰는 단계별 데이터 */
export const GUILD_RIVALRY_ENTRIES = buildGuildRivalryEntries()

/** 단계별 보스 등장 순서. 1단계부터 이 순서를 반복합니다. */
export const GUILD_RIVALRY_BOSS_ORDER = ['azure', 'jayde', 'scarlet'] as const satisfies readonly GuildRivalryBossId[]

/**
 * 공격 범위 표시 문구.
 * 표 칸이 좁은 모바일을 위해 짧은 표현을 씁니다.
 */
export const GUILD_RIVALRY_ATTACK_RANGE_LABEL = {
	'player-direction': '좌 or 우',
	below: '아래'
} as const satisfies Record<GuildRivalryAttackRangeId, string>

/** 공격 효과 표시 문구·Badge 스타일 */
export const GUILD_RIVALRY_ATTACK_EFFECT_META = {
	'boss-damage-stack-loss': {
		label: '보스 데미지 스택 감소',
		badgeClassName: 'bg-grayscale-100 text-grayscale-700'
	},
	'hit-rate-down': {
		label: '명중 감소',
		badgeClassName: 'bg-pastel-navy-100 text-pastel-navy-900'
	},
	'move-speed-down': {
		label: '이동속도 감소',
		badgeClassName: 'bg-pastel-purple-100 text-pastel-purple-900'
	},
	stun: {
		label: '기절',
		badgeClassName: 'bg-pastel-yellow-100 text-pastel-yellow-900'
	},
	'incoming-damage-up': {
		label: '받는 피해 증가',
		badgeClassName: 'bg-pastel-orange-100 text-pastel-orange-900'
	},
	burn: {
		label: '화상',
		badgeClassName: 'bg-red-100 text-red-900'
	}
} as const satisfies Record<GuildRivalryAttackEffectId, { label: string; badgeClassName: string }>

/**
 * 대항전 보스 표시 메타와 공격 패턴.
 * imageWidth/Height는 원본 GIF 픽셀이며, 화면 크기는 CSS로 맞춥니다.
 */
export const GUILD_RIVALRY_BOSSES = [
	{
		id: 'azure',
		label: '아주르 워로드',
		imageSrc: '/monsters/azure-warlord.gif',
		imageWidth: 548,
		imageHeight: 488,
		attacks: [
			{
				hit: 1,
				name: '구체 발사',
				range: 'player-direction',
				effects: ['boss-damage-stack-loss', 'hit-rate-down']
			},
			{
				hit: 2,
				name: '무기 휘두르기',
				range: 'below',
				effects: ['boss-damage-stack-loss']
			},
			{
				hit: 3,
				name: '위에서 아래로 무기 내려찍기',
				range: 'below',
				effects: ['boss-damage-stack-loss', 'move-speed-down']
			},
			{
				hit: 4,
				name: '전방으로 무기 내려찍기',
				range: 'player-direction',
				effects: ['boss-damage-stack-loss', 'stun']
			},
			{
				hit: 5,
				name: '구체 발사',
				range: 'player-direction',
				effects: ['boss-damage-stack-loss', 'hit-rate-down']
			}
		]
	},
	{
		id: 'jayde',
		label: '제이드 워로드',
		imageSrc: '/monsters/jayde-warlord.gif',
		imageWidth: 580,
		imageHeight: 546,
		attacks: [
			{
				hit: 1,
				name: '구체 발사',
				range: 'player-direction',
				effects: ['boss-damage-stack-loss', 'hit-rate-down']
			},
			{
				hit: 2,
				name: '전방으로 무기 내려찍기',
				range: 'player-direction',
				effects: ['boss-damage-stack-loss', 'stun']
			},
			{
				hit: 3,
				name: '무기 휘두르기',
				range: 'below',
				effects: ['boss-damage-stack-loss']
			},
			{
				hit: 4,
				name: '위에서 아래로 무기 내려찍기',
				range: 'below',
				effects: ['boss-damage-stack-loss', 'incoming-damage-up']
			},
			{
				hit: 5,
				name: '구체 발사',
				range: 'player-direction',
				effects: ['boss-damage-stack-loss', 'hit-rate-down']
			}
		]
	},
	{
		id: 'scarlet',
		label: '스칼렛 워로드',
		imageSrc: '/monsters/scarlet-warlord.gif',
		imageWidth: 572,
		imageHeight: 488,
		attacks: [
			{
				hit: 1,
				name: '구체 발사',
				range: 'player-direction',
				effects: ['boss-damage-stack-loss', 'hit-rate-down']
			},
			{
				hit: 2,
				name: '무기 휘두르기',
				range: 'below',
				effects: ['boss-damage-stack-loss']
			},
			{
				hit: 3,
				name: '위에서 아래로 무기 내려찍기',
				range: 'below',
				effects: ['boss-damage-stack-loss', 'burn']
			},
			{
				hit: 4,
				name: '전방으로 무기 내려찍기',
				range: 'player-direction',
				effects: ['boss-damage-stack-loss', 'stun']
			},
			{
				hit: 5,
				name: '위에서 아래로 무기 내려찍기',
				range: 'below',
				effects: ['boss-damage-stack-loss', 'burn']
			},
			{
				hit: 6,
				name: '구체 발사',
				range: 'player-direction',
				effects: ['boss-damage-stack-loss', 'hit-rate-down']
			}
		]
	}
] as const satisfies readonly GuildRivalryBoss[]

/** 보스 id → 메타. 단계 조회용으로 빠르게 찾습니다. */
export const GUILD_RIVALRY_BOSS_BY_ID = {
	azure: GUILD_RIVALRY_BOSSES[0],
	jayde: GUILD_RIVALRY_BOSSES[1],
	scarlet: GUILD_RIVALRY_BOSSES[2]
} as const satisfies Record<GuildRivalryBossId, GuildRivalryBoss>

/** 단계 → 해당 단계에 등장하는 보스 (1: 아주르 → 2: 제이드 → 3: 스칼렛 → 반복) */
function getGuildRivalryBossByStage(stage: number) {
	const bossCount = GUILD_RIVALRY_BOSS_ORDER.length
	const orderIndex = (((stage - 1) % bossCount) + bossCount) % bossCount
	const bossId = GUILD_RIVALRY_BOSS_ORDER[orderIndex] ?? 'azure'

	return GUILD_RIVALRY_BOSS_BY_ID[bossId]
}

export { getGuildRivalryBossByStage }
