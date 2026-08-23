/** 길드 토벌전 단계별 필요 명중·제한시간 한 줄 */
type GuildExpeditionHitCutEntry = {
	/** 토벌전 단계 (1부터) */
	stage: number
	/** 해당 단계 필요 명중 */
	requiredHit: number
	/** 해당 단계 제한시간(초) */
	timeLimitSec: number
}

export type { GuildExpeditionHitCutEntry }
