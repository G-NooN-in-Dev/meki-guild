'use client'

import { useState } from 'react'

import RelicSetupBoard from '@/features/tips/components/relic-setup-board'
import { createEmptyRelicLoadout } from '@/features/tips/lib/relic.constants'
import type { RelicLoadout } from '@/features/tips/types/relic.type'

/**
 * 4슬롯에 유물·각성·잠재옵션을 올려 장착 효과 합산을 확인합니다.
 */
function RelicSetupSimulator() {
	const [loadouts, setLoadouts] = useState<RelicLoadout>(() => createEmptyRelicLoadout())

	return (
		<div className="flex flex-col gap-4">
			<p className="text-grayscale-600 text-sm">
				슬롯을 눌러 유물·각성·잠재옵션을 입력하면, 오른쪽(또는 아래)에 효과가 합산됩니다.
			</p>
			<RelicSetupBoard loadouts={loadouts} onLoadoutsChange={setLoadouts} title="세팅 보드" />
		</div>
	)
}

export default RelicSetupSimulator
