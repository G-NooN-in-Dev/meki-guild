/** 길드 대항전 단계별 명중컷·보스 데미지 증가 스택 한 줄 */
export type GuildRivalryHitCutEntry = {
	/** 대항전 단계 (1부터) */
	stage: number
	/** 해당 단계까지 잡몹 처치로 쌓인 보스 데미지 증가 스택 합계 */
	buffStack: number
	/** 해당 단계 진입에 필요한 명중 수치 */
	requiredHit: number
}
