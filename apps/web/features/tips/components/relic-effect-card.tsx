'use client'

import { Card } from '@shared/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { cn } from '@shared/ui/utils'
import { ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'

import RelicAwakeningCellControl from '@/features/tips/components/relic-awakening-cell-control'
import RelicEffectLineList from '@/features/tips/components/relic-effect-line-list'
import RelicIdentity from '@/features/tips/components/relic-identity'
import { ITEM_GRADE_SLOT_CLASS } from '@/features/tips/lib/item-grade.constants'
import type { RelicEffectRow } from '@/features/tips/types/relic.type'

type RelicEffectCardProps = RelicEffectRow & {
	onStageChange: (stage: number) => void
}

/**
 * 모바일용 유물 카드.
 * 접힌 줄: 아이콘·이름·등급·각성(−/+). 이름이나 화살표를 누르면 효과가 열립니다.
 * −/+는 트리거 밖에 두어, 각성만 바꿀 때 카드가 열리지 않게 합니다.
 */
function RelicEffectCard({ relic, stage, equipLines, possessionLines, onStageChange }: RelicEffectCardProps) {
	const [open, setOpen] = useState(false)

	return (
		<Card size="sm" className={cn('shadow-soft shrink-0 gap-0 py-0 ring-0', ITEM_GRADE_SLOT_CLASS[relic.grade])}>
			<Collapsible open={open} onOpenChange={setOpen} className="flex flex-col">
				<div className="flex items-center gap-1.5 px-2 py-2 sm:px-3">
					<CollapsibleTrigger
						aria-label={`${relic.name} 효과 ${open ? '접기' : '펼치기'}`}
						className={cn(
							'flex min-w-0 flex-1 cursor-pointer items-center bg-transparent text-left',
							'focus-visible:ring-grayscale-900 rounded-md hover:bg-transparent focus-visible:ring-2 focus-visible:outline-none'
						)}
					>
						<RelicIdentity relic={relic} />
					</CollapsibleTrigger>
					<RelicAwakeningCellControl layout="row" stage={stage} onStageChange={onStageChange} />
					<CollapsibleTrigger
						aria-label={`${relic.name} 효과 ${open ? '접기' : '펼치기'}`}
						className={cn(
							'text-grayscale-500 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md bg-transparent',
							'focus-visible:ring-grayscale-900 hover:bg-transparent focus-visible:ring-2 focus-visible:outline-none'
						)}
					>
						<ChevronDownIcon
							aria-hidden
							className={cn('size-4 transition-transform duration-200', open && 'rotate-180')}
						/>
					</CollapsibleTrigger>
				</div>

				<CollapsibleContent>
					<div className="border-grayscale-200/80 flex flex-col gap-2.5 border-t px-3 py-3">
						<section className="flex flex-col gap-1">
							<p className="text-grayscale-500 text-[11px] font-medium">장착 효과</p>
							<RelicEffectLineList lines={equipLines} lineKeyPrefix={`${relic.id}-equip`} />
						</section>
						<section className="flex flex-col gap-1">
							<p className="text-grayscale-500 text-[11px] font-medium">보유 효과</p>
							<RelicEffectLineList lines={possessionLines} lineKeyPrefix={`${relic.id}-possession`} />
						</section>
					</div>
				</CollapsibleContent>
			</Collapsible>
		</Card>
	)
}

export default RelicEffectCard
