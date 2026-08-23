'use client'

import { useState } from 'react'

import { BossRaidSelection } from '../../types/boss-raid.type'
import BossRaidHitCutTable from './boss-raid-hit-cut-table'
import BossRaidRewardTable from './boss-raid-reward-table'

function BossRaidBoard() {
	const [selectedBoss, setSelectedBoss] = useState<BossRaidSelection>({ boss: 'zakum', difficulty: 'easy' })

	return (
		<div className="flex flex-col gap-6 md:gap-8">
			<BossRaidHitCutTable selectedBoss={selectedBoss} setSelectedBoss={setSelectedBoss} />
			<BossRaidRewardTable selectedBoss={selectedBoss} />
		</div>
	)
}

export default BossRaidBoard
