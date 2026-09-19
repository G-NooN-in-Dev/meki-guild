import type { RankPredictGuildRowBase, RankPredictMember, RankPredictMemberRow } from './guild-rank-predict.type'

type TrainingPredictMember = RankPredictMember

/** 전투력 정렬 후 개인 순위가 붙은 행 */
type TrainingPredictMemberRow = RankPredictMemberRow

/** 길드별 전투력 합산 순위 */
type TrainingPredictGuildRow = RankPredictGuildRowBase & {
	totalCombatPower: bigint
}

type TrainingPredictResult = {
	members: TrainingPredictMemberRow[]
	guilds: TrainingPredictGuildRow[]
}

export type { TrainingPredictGuildRow, TrainingPredictMember, TrainingPredictMemberRow, TrainingPredictResult }
