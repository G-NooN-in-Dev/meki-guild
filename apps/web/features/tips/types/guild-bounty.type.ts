/** 현상수배 보스 공격 효과 */
type GuildBountyAttackEffectId = 'final-damage-down' | 'move-speed-down'

/** 현상수배 보스 한 종류의 공격 */
type GuildBountyAttack = {
	id: string
	/** 공격 이름 */
	name: string
	/** 피격 시 적용되는 효과 */
	effects: readonly GuildBountyAttackEffectId[]
}

/** 현상수배 보스(일반·어려움) 표시 메타 */
type GuildBountyMonster = {
	id: string
	label: string
	imageSrc: string
	/** 원본 GIF 픽셀 너비. 화면 크기는 CSS로 맞춥니다. */
	imageWidth: number
	/** 원본 GIF 픽셀 높이. 화면 크기는 CSS로 맞춥니다. */
	imageHeight: number
}

/** 버프 구슬 위치 */
type GuildBountyBuffOrbSideId = 'left' | 'right'

/** 버프 구슬 한 종류 */
type GuildBountyBuffOrb = {
	id: GuildBountyBuffOrbSideId
	/** 좌 / 우 */
	sideLabel: string
	/** 구슬 색상 Badge 스타일 */
	badgeClassName: string
}

/** Dialog·단계 표기용 10단계 밴드 */
type GuildBountyStageBand = {
	fromStage: number
	toStage: number
}

/** 단계별 클리어·누적 점수 */
type GuildBountyStageEntry = {
	stage: number
	/** 해당 단계 클리어 점수 */
	clearScore: number
	/** 1~stage 누적 합 (= 사냥 실적) */
	huntingScore: number
	/** 5·10·15… 어려운 단계 여부 */
	isHardStage: boolean
}

/** 팁 페이지 단계 표 한 줄 (점수 + 전투 수치) */
type GuildBountyTipsEntry = {
	stage: number
	defense: number
	requiredHit: number
	clearScore: number
	huntingScore: number
	isHardStage: boolean
}

export type {
	GuildBountyAttack,
	GuildBountyAttackEffectId,
	GuildBountyBuffOrb,
	GuildBountyBuffOrbSideId,
	GuildBountyMonster,
	GuildBountyStageBand,
	GuildBountyStageEntry,
	GuildBountyTipsEntry
}
