/** 클라이언트 계산용 길드원 (bigint 전투력) */
type TrainingPredictMember = {
	name: string
	job: string
	level: number
	combatPower: bigint
	combatPowerLabel: string
	portraitUrl: string | null
	guildName: string
	serverLabel: string | null
	/** 입력 슬롯 순서 (0~6). 동점·길드 색 구분에 사용 */
	guildIndex: number
}

/** 전투력 정렬 후 개인 순위가 붙은 행 */
type TrainingPredictMemberRow = TrainingPredictMember & {
	rank: number
}

/** 길드별 전투력 합산 순위 */
type TrainingPredictGuildRow = {
	rank: number
	guildName: string
	serverLabel: string | null
	guildIndex: number
	totalCombatPower: bigint
}

type TrainingPredictResult = {
	members: TrainingPredictMemberRow[]
	guilds: TrainingPredictGuildRow[]
}

export type { TrainingPredictGuildRow, TrainingPredictMember, TrainingPredictMemberRow, TrainingPredictResult }
