import type {
	GuildBoss,
	GuildBossAttackDirectionId,
	GuildBossAttackEffectId,
	GuildBossProgressStep,
	GuildBossProgressStepId
} from '@/features/tips/types/guild-boss.type'

/** 보스대전 제한시간(초). 시간 안에 최대한 많은 피해를 입힙니다. */
export const GUILD_BOSS_TIME_LIMIT_SEC = 100

/** 보스 필요 명중 */
export const GUILD_BOSS_REQUIRED_HIT = 100

/** 보스 방어력 */
export const GUILD_BOSS_DEFENSE = 10000

/** 보스가 자신이 받는 피해를 줄이는 비율(%) */
export const GUILD_BOSS_INCOMING_DAMAGE_REDUCTION_PERCENT = 30

/** 기절 지속 시간(초) */
export const GUILD_BOSS_STUN_DURATION_SEC = 11.7

/** 기절 중 보스가 자신의 받는 최종 피해를 줄이는 비율(%) */
export const GUILD_BOSS_STUN_FINAL_DAMAGE_REDUCTION_PERCENT = 30

/**
 * 공격 범위 표시 문구.
 * 표 칸이 좁은 모바일을 위해 짧은 표현을 씁니다.
 */
export const GUILD_BOSS_ATTACK_DIRECTION_LABEL = {
	left: '좌',
	right: '우',
	down: '아래'
} as const satisfies Record<GuildBossAttackDirectionId, string>

/** 공격 효과 표시 문구·Badge 스타일 */
export const GUILD_BOSS_ATTACK_EFFECT_META = {
	'hp-down': {
		label: 'HP 감소',
		badgeClassName: 'bg-red-100 text-red-900'
	},
	'mp-down': {
		label: 'MP 감소',
		badgeClassName: 'bg-pastel-navy-100 text-pastel-navy-900'
	},
	'hp-potion-cooldown-up': {
		label: 'HP 물약 쿨타임 증가',
		badgeClassName: 'bg-pastel-orange-100 text-pastel-orange-900'
	},
	'mp-potion-cooldown-up': {
		label: 'MP 물약 쿨타임 증가',
		badgeClassName: 'bg-pastel-purple-100 text-pastel-purple-900'
	},
	'move-speed-down': {
		label: '이동속도 감소',
		badgeClassName: 'bg-pastel-green-100 text-pastel-green-900'
	}
} as const satisfies Record<GuildBossAttackEffectId, { label: string; badgeClassName: string }>

/**
 * 진행 단계 표시 문구.
 * count가 있으면 문구에 횟수를 끼워 넣습니다.
 */
export const GUILD_BOSS_PROGRESS_STEP_LABEL = {
	'side-attacks': '좌·우 공격',
	'down-attack': '아래 공격',
	'incoming-damage-down': '받는 피해 감소',
	stun: '기절'
} as const satisfies Record<GuildBossProgressStepId, string>

/**
 * 보스대전 보스 표시 메타와 방향별 공격.
 * imageWidth/Height는 원본 GIF 픽셀이며, 화면 크기는 CSS로 맞춥니다.
 * HP·MP 감소는 좌·우·아래 공격을 받을수록 감소량이 커집니다.
 */
export const GUILD_BOSS = {
	id: 'evil-snake-brothers',
	label: '사악한 뱀형제',
	imageSrc: '/monsters/evil-snake-brothers.gif',
	imageWidth: 346,
	imageHeight: 404,
	attacks: [
		{
			id: 'left',
			name: '좌측 불 내뿜기',
			direction: 'left',
			source: '좌측 뱀',
			effects: ['hp-down', 'hp-potion-cooldown-up']
		},
		{
			id: 'right',
			name: '우측 불 내뿜기',
			direction: 'right',
			source: '우측 뱀',
			effects: ['mp-down', 'mp-potion-cooldown-up']
		},
		{
			id: 'down',
			name: '아래 스모크',
			direction: 'down',
			effects: ['hp-down', 'move-speed-down']
		}
	]
} as const satisfies GuildBoss

/** 아래 진행 패턴을 반복하는 횟수 */
export const GUILD_BOSS_PROGRESSION_REPEAT_COUNT = 2

/**
 * 컨텐츠 진행 순서.
 * 좌·우 3회 → 아래 1회 → 좌·우 3회 → 받는 피해 감소 → 아래 1회 → 기절 & 아래 공격. (`GUILD_BOSS_PROGRESSION_REPEAT_COUNT`번 반복)
 */
export const GUILD_BOSS_PROGRESSION = [
	{ id: 'side-attacks', count: 3 },
	{ id: 'down-attack', count: 1 },
	{ id: 'side-attacks', count: 3 },
	{ id: 'incoming-damage-down' },
	{ id: 'down-attack', count: 1 },
	{ id: 'stun' }
] as const satisfies readonly GuildBossProgressStep[]

/** 진행 단계 → 화면 문구 (횟수·수치 포함) */
function getGuildBossProgressStepLabel(step: GuildBossProgressStep) {
	const { id, count } = step
	const baseLabel = GUILD_BOSS_PROGRESS_STEP_LABEL[id]

	if ((id === 'side-attacks' || id === 'down-attack') && count != null) {
		return `${baseLabel} ${count}번`
	}

	if (id === 'stun') {
		return `${baseLabel} ${GUILD_BOSS_STUN_DURATION_SEC}초 & 아래 공격`
	}

	return baseLabel
}

export { getGuildBossProgressStepLabel }
