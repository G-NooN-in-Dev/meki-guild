/** 월드보스 단계별 방어력·필요 명중 한 줄 */
type WorldBossEntry = {
	/** 월드보스 단계 (1부터) */
	stage: number
	/** 해당 단계 방어력 */
	defense: number
	/** 해당 단계 필요 명중 */
	requiredHit: number
}

export type { WorldBossEntry }
