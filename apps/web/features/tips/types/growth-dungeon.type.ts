/** 성장 던전 단계별 필요 명중 한 줄 */
type GrowthDungeonHitCutEntry = {
	/** 던전 단계 (1부터) */
	stage: number
	/** 해당 단계 필요 명중 */
	requiredHit: number
	/** 10·20·30… 어려운 단계 여부 */
	isHardStage: boolean
}

/** 경험치 던전 단계별 표 한 줄 */
type ExperienceDungeonHitCutEntry = GrowthDungeonHitCutEntry & {
	/** 해당 단계 처치해야 하는 몬스터 수 */
	requiredKillCount: number
	/** 주니어 부기 필요 명중 (일반보다 +2) */
	juniorBoogieRequiredHit: number
}

export type { ExperienceDungeonHitCutEntry, GrowthDungeonHitCutEntry }
