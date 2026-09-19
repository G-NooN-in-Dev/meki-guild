'use client'

import GuildRankPredictBoard from '@/features/tips/components/guild-rank-predict/guild-rank-predict-board.client'
import { TRAINING_PREDICT_MAX_GUILDS } from '@/features/tips/lib/guild-training-rank-predict.constants'
import { buildTrainingPredictResult } from '@/features/tips/lib/guild-training-rank-predict.helpers'

import TrainingPredictGuildTable from './training-predict-guild-table'
import TrainingPredictMemberTable from './training-predict-member-table'

/** 길드 수련장 순위 예측 — 입력·조회·결과 표 */
function GuildTrainingRankPredictBoard() {
	return (
		<GuildRankPredictBoard
			maxGuilds={TRAINING_PREDICT_MAX_GUILDS}
			inputIdPrefix="training-predict-guild"
			inputGridClassName="xl:grid-cols-4"
			guildTableTitle="길드 수련장 예측 순위"
			buildResult={buildTrainingPredictResult}
			MemberTable={TrainingPredictMemberTable}
			GuildTable={TrainingPredictGuildTable}
			hint={
				<>
					수련장에 매칭된 길드명을 순서대로 입력하세요. 전투력 데이터는 MGF.GG 기준입니다. <br />
					단순 전투력 기준 비교이므로 실제 결과와 다를 수 있습니다.
				</>
			}
		/>
	)
}

export default GuildTrainingRankPredictBoard
