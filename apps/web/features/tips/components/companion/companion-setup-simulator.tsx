'use client'

import { useState } from 'react'

import CompanionSetupBoard from '@/features/tips/components/companion/companion-setup-board'
import { createEmptyCompanionLoadout } from '@/features/tips/lib/companion-setup.constants'
import type { CompanionLoadout } from '@/features/tips/types/companion.type'

/**
 * 메인·서브 슬롯에 동료를 올려 장착 효과 합산을 확인합니다.
 */
function CompanionSetupSimulator() {
	const [loadouts, setLoadouts] = useState<CompanionLoadout>(() => createEmptyCompanionLoadout())

	return (
		<div className="flex flex-col gap-4">
			<p className="text-grayscale-600 text-sm">
				슬롯을 눌러 동료와 레벨을 입력하면, 오른쪽(또는 아래)에 장착 효과가 합산됩니다.
			</p>
			<CompanionSetupBoard loadouts={loadouts} onLoadoutsChange={setLoadouts} title="세팅 보드" />
		</div>
	)
}

export default CompanionSetupSimulator
