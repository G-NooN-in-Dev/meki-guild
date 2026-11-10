/** 길드 대항전 단계별 명중컷·보스 데미지 증가 스택 한 줄 */
type GuildRivalryEntry = {
	/** 대항전 단계 (1부터) */
	stage: number
	/** 해당 단계까지 잡몹 처치로 쌓인 보스 데미지 증가 스택 합계 */
	buffStack: number
	/** 해당 단계 보스/일반몹 기본 명중컷 (잡몹 소환 보정 제외) */
	requiredHit: number
	/** 잡몹 등장 직후 필요 명중 (requiredHit + 소환 보정). 이후 시간 경과로 기본값까지 감소 */
	spawnRequiredHit: number
}

/** 대항전 보스 식별자. 단계마다 아주르 → 제이드 → 스칼렛 순으로 반복합니다. */
type GuildRivalryBossId = 'azure' | 'jayde' | 'scarlet'

/** 보스 공격 범위 */
type GuildRivalryAttackRangeId = 'player-direction' | 'below'

/**
 * 보스 공격 부가 효과.
 * `boss-damage-stack-loss`는 모든 공격에 포함되며, 감소량은 단계마다 다릅니다.
 */
type GuildRivalryAttackEffectId =
	'boss-damage-stack-loss' | 'hit-rate-down' | 'move-speed-down' | 'stun' | 'incoming-damage-up' | 'burn'

/** 보스 한 타의 공격 패턴 */
type GuildRivalryBossAttack = {
	/** 패턴 내 타수 (1부터) */
	hit: number
	/** 공격 이름 */
	name: string
	/** 공격 범위 */
	range: GuildRivalryAttackRangeId
	/** 피격 시 적용되는 효과 */
	effects: readonly GuildRivalryAttackEffectId[]
}

/** 보스 표시 메타와 반복 공격 패턴 */
type GuildRivalryBoss = {
	id: GuildRivalryBossId
	label: string
	imageSrc: string
	/** 원본 GIF 픽셀 너비. 화면 크기는 CSS로 맞춥니다. */
	imageWidth: number
	/** 원본 GIF 픽셀 높이. 화면 크기는 CSS로 맞춥니다. */
	imageHeight: number
	/** 고정 공격 패턴. 보스가 이 순서를 반복합니다. */
	attacks: readonly GuildRivalryBossAttack[]
}

export type {
	GuildRivalryAttackEffectId,
	GuildRivalryAttackRangeId,
	GuildRivalryBoss,
	GuildRivalryBossAttack,
	GuildRivalryBossId,
	GuildRivalryEntry
}
