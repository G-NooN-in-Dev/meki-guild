/** API·파서에서 내려오는 길드원 한 명 (전투력은 JSON용 문자열) */
type MgfGuildMemberDto = {
	name: string
	job: string
	level: number
	/** bigint 문자열 (data-bp) */
	combatPower: string
	/** 표시용 한국어 전투력 */
	combatPowerLabel: string
	portraitUrl: string | null
}

/** 길드 정보 조회 API 성공 응답 */
type MgfGuildInfoResponse = {
	guildName: string
	/** mgf server-chip 텍스트. 예: `Scania 1` */
	serverLabel: string | null
	members: MgfGuildMemberDto[]
}

/** 클라이언트 계산용 길드원 (bigint 전투력). 대항전·수련장 순위 예측 공통 */
type RankPredictMember = {
	name: string
	job: string
	level: number
	combatPower: bigint
	combatPowerLabel: string
	portraitUrl: string | null
	guildName: string
	serverLabel: string | null
	/** 입력 슬롯 순서. 동점·길드 색 구분에 사용 */
	guildIndex: number
}

/** 전투력 정렬 후 개인 순위가 붙은 행 */
type RankPredictMemberRow = RankPredictMember & {
	rank: number
}

/** 길드별 집계 행의 공통 필드 */
type RankPredictGuildRowBase = {
	rank: number
	guildName: string
	serverLabel: string | null
	guildIndex: number
}

export type {
	MgfGuildInfoResponse,
	MgfGuildMemberDto,
	RankPredictGuildRowBase,
	RankPredictMember,
	RankPredictMemberRow
}
