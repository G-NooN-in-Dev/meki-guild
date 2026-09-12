'use client'

import { useState } from 'react'

import type { PartyQuestSelection } from '../../types/party-quest.type'
import PartyQuestHitCutTable from './party-quest-hit-cut-table'
import PartyQuestRewardTable from './party-quest-reward-table'

function PartyQuestBoard() {
	const [selectedQuest, setSelectedQuest] = useState<PartyQuestSelection>({ quest: 'ring', difficulty: 'easy' })

	return (
		<div className="flex flex-col gap-6 md:gap-8">
			<PartyQuestHitCutTable selectedQuest={selectedQuest} setSelectedQuest={setSelectedQuest} />
			<PartyQuestRewardTable selectedQuest={selectedQuest} />
		</div>
	)
}

export default PartyQuestBoard
