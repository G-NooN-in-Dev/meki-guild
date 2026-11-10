/** 보스대전 공격 방향 (좌측 뱀 / 우측 뱀 / 아래) */
type GuildBossAttackDirectionId = 'left' | 'right' | 'down'

/**
 * 보스 공격 부가 효과.
 * HP·MP 감소는 좌·우·아래 공격을 받을수록 감소량이 커집니다.
 */
type GuildBossAttackEffectId =
	'hp-down' | 'mp-down' | 'hp-potion-cooldown-up' | 'mp-potion-cooldown-up' | 'move-speed-down'

/** 보스 한 종류의 방향 공격 */
type GuildBossAttack = {
	id: GuildBossAttackDirectionId
	/** 공격 이름 */
	name: string
	/** 공격 방향 */
	direction: GuildBossAttackDirectionId
	/** 어느 뱀이 시전하는지 등 짧은 보충 설명. 없으면 생략 */
	source?: string
	/** 피격 시 적용되는 효과 */
	effects: readonly GuildBossAttackEffectId[]
}

/** 컨텐츠 진행 한 단계의 종류 */
type GuildBossProgressStepId = 'side-attacks' | 'down-attack' | 'incoming-damage-down' | 'stun'

/** 컨텐츠 진행 순서의 한 칸 */
type GuildBossProgressStep = {
	id: GuildBossProgressStepId
	/** 좌·우 공격처럼 반복 횟수가 있을 때 */
	count?: number
}

/** 보스대전 보스 표시 메타와 방향별 공격 */
type GuildBoss = {
	id: string
	label: string
	imageSrc: string
	/** 원본 GIF 픽셀 너비. 화면 크기는 CSS로 맞춥니다. */
	imageWidth: number
	/** 원본 GIF 픽셀 높이. 화면 크기는 CSS로 맞춥니다. */
	imageHeight: number
	attacks: readonly GuildBossAttack[]
}

export type {
	GuildBoss,
	GuildBossAttack,
	GuildBossAttackDirectionId,
	GuildBossAttackEffectId,
	GuildBossProgressStep,
	GuildBossProgressStepId
}
