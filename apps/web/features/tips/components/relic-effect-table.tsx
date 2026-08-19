'use client'

import { useState } from 'react'

import RelicEffectCard from '@/features/tips/components/relic-effect-card'
import RelicEffectDesktopTable from '@/features/tips/components/relic-effect-desktop-table'
import RelicPotentialTable from '@/features/tips/components/relic-potential-table'
import { RELICS, resolveRelicEffects } from '@/features/tips/lib/relic.constants'
import { resolveRelicPossessionLines } from '@/features/tips/lib/relic-possession.constants'
import type { RelicEffectRow } from '@/features/tips/types/relic.type'

function createInitialStageByRelicId() {
	return Object.fromEntries(RELICS.map((relic) => [relic.id, 0])) as Record<string, number>
}

/**
 * 유물별 장착·보유 효과.
 * tab(896px) 미만은 카드, 이상은 4열 표. 각성 상태는 둘 다 같습니다.
 */
function RelicEffectTable() {
	const [stageByRelicId, setStageByRelicId] = useState(createInitialStageByRelicId)

	const rows: RelicEffectRow[] = RELICS.map((relic) => {
		const stage = stageByRelicId[relic.id] ?? 0
		return {
			relic,
			stage,
			equipLines: resolveRelicEffects(relic.id, stage)?.lines ?? [],
			possessionLines: resolveRelicPossessionLines(relic.id, stage)
		}
	})

	function handleStageChange(relicId: string, stage: number) {
		setStageByRelicId((prev) => ({
			...prev,
			[relicId]: stage
		}))
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="flex min-w-0 flex-col gap-1">
					<h3 className="text-grayscale-900 text-base font-semibold">유물 효과</h3>
					<p className="text-grayscale-600 text-sm">
						각성 단계를 바꾸면 장착 효과와 보유 효과가 같이 바뀝니다. 모바일에서는 유물을 눌러 효과를 펼칠 수 있습니다.
					</p>
				</div>
				<RelicPotentialTable />
			</div>

			<div className="tab:hidden flex flex-col gap-2">
				{rows.map((row) => (
					<RelicEffectCard
						key={row.relic.id}
						{...row}
						onStageChange={(stage) => handleStageChange(row.relic.id, stage)}
					/>
				))}
			</div>

			<div className="tab:block hidden">
				<RelicEffectDesktopTable rows={rows} onStageChange={handleStageChange} />
			</div>
		</div>
	)
}

export default RelicEffectTable
