/** 길드 수련장 단계별 점수·명중컷 한 줄 */
type GuildTrainingStageEntry = {
	/** 수련장 단계 (1부터) */
	stage: number
	/** 일반몹 처치 점수 */
	normalKillScore: number
	/** 일반몹 명중컷 */
	normalHitCut: number
	/** 특수몹 처치 점수 */
	specialKillScore: number
	/** 특수몹 명중컷 */
	specialHitCut: number
	/** 특수몹 필요 타수 */
	specialRequiredHits: number
}

/** 일반몹 명중컷 증가 구간 */
type GuildTrainingHitTier = {
	/** 이 구간이 시작되는 단계 */
	startStage: number
	/** startStage 단계의 일반몹 명중컷 */
	baseHit: number
	/** startStage 이후 단계마다 더해지는 명중 */
	increment: number
}

export type { GuildTrainingHitTier, GuildTrainingStageEntry }
