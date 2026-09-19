import type {
	MgfGuildInfoResponse,
	MgfGuildMemberDto,
	RankPredictGuildRowBase,
	RankPredictMember,
	RankPredictMemberRow
} from './guild-rank-predict.type'

type RivalryPredictMember = RankPredictMember

/** 전투력 정렬 후 개인 순위·포인트가 붙은 행 */
type RivalryPredictMemberRow = RankPredictMemberRow & {
	points: number
}

/** 길드별 포인트 합산 순위 */
type RivalryPredictGuildRow = RankPredictGuildRowBase & {
	totalPoints: number
}

type RivalryPredictResult = {
	members: RivalryPredictMemberRow[]
	guilds: RivalryPredictGuildRow[]
}

export type {
	MgfGuildInfoResponse,
	MgfGuildMemberDto,
	RivalryPredictGuildRow,
	RivalryPredictMember,
	RivalryPredictMemberRow,
	RivalryPredictResult
}
