/** 성장 던전(무기) 단계별 필요 명중 한 줄 */
type GrowthDungeonHitCutEntry = {
	/** 던전 단계 (1부터) */
	stage: number
	/** 해당 단계 필요 명중 */
	requiredHit: number
	/** 10·20·30… 어려운 단계 여부 */
	isHardStage: boolean
}

export type { GrowthDungeonHitCutEntry }
