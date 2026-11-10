/** 길드 토벌전 단계별 방어력·필요 명중·제한시간 한 줄 */
type GuildExpeditionEntry = {
	/** 토벌전 단계 (1부터) */
	stage: number
	/** 해당 단계 방어력 (1단계 100000, 이후 +10000) */
	defense: number
	/** 해당 단계 필요 명중 */
	requiredHit: number
	/** 해당 단계 제한시간(초) */
	timeLimitSec: number
}

export type { GuildExpeditionEntry }
