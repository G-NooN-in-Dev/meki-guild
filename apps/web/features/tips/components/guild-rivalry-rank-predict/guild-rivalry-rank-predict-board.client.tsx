'use client'

import GuildRankPredictBoard from '@/features/tips/components/guild-rank-predict/guild-rank-predict-board.client'
import { RIVALRY_PREDICT_MAX_GUILDS } from '@/features/tips/lib/guild-rivalry-rank-predict.constants'
import { buildRivalryPredictResult } from '@/features/tips/lib/guild-rivalry-rank-predict.helpers'

import RivalryPredictGuildTable from './rivalry-predict-guild-table'
import RivalryPredictMemberTable from './rivalry-predict-member-table'

/** 길드 대항전 순위 예측 — 입력·조회·결과 표 */
function GuildRivalryRankPredictBoard() {
	return (
		<GuildRankPredictBoard
			maxGuilds={RIVALRY_PREDICT_MAX_GUILDS}
			inputIdPrefix="rivalry-predict-guild"
			guildTableTitle="길드 대항전 예측 순위"
			buildResult={buildRivalryPredictResult}
			MemberTable={RivalryPredictMemberTable}
			GuildTable={RivalryPredictGuildTable}
			hint={
				<>
					대항전에 매칭된 길드명을 순서대로 입력하세요. 전투력 데이터는 MGF.GG 기준입니다. <br />
					단순 전투력 기준 비교이므로 실제 결과와 다를 수 있습니다.
				</>
			}
		/>
	)
}

export default GuildRivalryRankPredictBoard
