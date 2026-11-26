'use client'

import { Button } from '@shared/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@shared/ui/empty'
import { SearchXIcon } from 'lucide-react'
import { useState } from 'react'

import RelicEffectDesktopTable from '@/features/tips/components/relic/relic-effect-desktop-table'
import RelicEffectGrid from '@/features/tips/components/relic/relic-effect-grid'
import RelicFilterPopover from '@/features/tips/components/relic/relic-filter-popover'
import RelicPotentialTable from '@/features/tips/components/relic/relic-potential-table'
import { RELICS, resolveRelicEffects } from '@/features/tips/lib/relic.constants'
import { INITIAL_RELIC_FILTER } from '@/features/tips/lib/relic-filter.constants'
import { matchesRelicFilter } from '@/features/tips/lib/relic-filter.helpers'
import { resolveRelicPossessionLines } from '@/features/tips/lib/relic-possession.constants'
import type { RelicEffectRow, RelicFilterState } from '@/features/tips/types/relic.type'

function createInitialStageByRelicId() {
	return Object.fromEntries(RELICS.map((relic) => [relic.id, 0])) as Record<string, number>
}

/**
 * 유물별 장착·보유 효과.
 * tab(896px) 미만은 이미지 그리드 + 바텀시트, 이상은 4열 표.
 */
function RelicEffectTable() {
	const [stageByRelicId, setStageByRelicId] = useState(createInitialStageByRelicId)

	const [filter, setFilter] = useState<RelicFilterState>(INITIAL_RELIC_FILTER)

	// 필터를 먼저 적용해 보이지 않는 유물의 효과 문구는 계산하지 않습니다.
	const rows: RelicEffectRow[] = RELICS.filter((relic) => matchesRelicFilter(relic, filter)).map((relic) => {
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
						각성 단계를 바꾸면 장착 효과와 보유 효과가 같이 바뀝니다. 모바일에서는 유물을 눌러 효과를 확인할 수
						있습니다.
					</p>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<RelicFilterPopover filter={filter} onFilterChange={setFilter} />
					<RelicPotentialTable />
				</div>
			</div>

			{rows.length === 0 ? (
				<Empty className="border-grayscale-200 bg-card/50 shadow-soft border border-dashed py-10 md:py-12">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<SearchXIcon />
						</EmptyMedia>
						<EmptyTitle className="text-base md:text-lg">조건에 맞는 유물이 없어요</EmptyTitle>
						<EmptyDescription>필터를 줄이거나 초기화해서 다시 찾아보세요.</EmptyDescription>
					</EmptyHeader>
					<Button type="button" variant="outline" size="sm" onClick={() => setFilter(INITIAL_RELIC_FILTER)}>
						필터 초기화
					</Button>
				</Empty>
			) : (
				<>
					<div className="tab:hidden">
						<RelicEffectGrid rows={rows} onStageChange={handleStageChange} />
					</div>

					<div className="tab:block hidden">
						<RelicEffectDesktopTable rows={rows} onStageChange={handleStageChange} />
					</div>
				</>
			)}
		</div>
	)
}

export default RelicEffectTable
