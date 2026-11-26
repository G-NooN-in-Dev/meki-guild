'use client'

import { Button } from '@shared/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { cn } from '@shared/ui/utils'
import { useState } from 'react'

import RelicAwakeningCellControl from '@/features/tips/components/relic/relic-awakening-cell-control'
import RelicEffectLineList from '@/features/tips/components/relic/relic-effect-line-list'
import RelicIdentity from '@/features/tips/components/relic/relic-identity'
import GradePortrait from '@/features/tips/components/shared/grade-portrait'
import { ITEM_GRADE_SLOT_CLASS, ITEM_GRADE_SLOT_HOVER_CLASS } from '@/features/tips/lib/item-grade.constants'
import { getRelicMaxAwakeningStage } from '@/features/tips/lib/relic.constants'
import type { RelicEffectRow } from '@/features/tips/types/relic.type'

type RelicEffectGridProps = {
	rows: readonly RelicEffectRow[]
	onStageChange: (relicId: string, stage: number) => void
}

/**
 * 모바일·태블릿용 유물 그리드.
 * 이미지를 누르면 바텀시트로 각성 조절과 장착·보유 효과를 보여줍니다.
 */
function RelicEffectGrid({ rows, onStageChange }: RelicEffectGridProps) {
	const [open, setOpen] = useState(false)
	// 닫힘 애니메이션 중 내용이 사라지지 않도록 open과 선택 id를 따로 둡니다.
	const [selectedId, setSelectedId] = useState<string | null>(null)

	// 각성 변경이 바로 보이도록 상태가 아닌 최신 rows에서 찾습니다. 필터로 사라지면 시트도 비웁니다.
	const selectedRow = rows.find((row) => row.relic.id === selectedId)

	const sheetOpen = open && selectedRow !== undefined

	function handleSelect(relicId: string) {
		// 열린 상태에서 같은 유물을 다시 누르면 닫고, 다른 유물이면 내용만 바꿉니다.
		if (sheetOpen && relicId === selectedId) {
			setOpen(false)
			return
		}
		setSelectedId(relicId)
		setOpen(true)
	}

	return (
		<>
			{/* 시트가 그리드를 가리지 않도록 열려 있는 동안 시트 높이만큼 하단 여백을 둡니다. */}
			<ul className={cn('grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8', sheetOpen && 'pb-[45dvh]')}>
				{rows.map(({ relic }) => {
					const selected = open && relic.id === selectedId

					return (
						<li key={relic.id}>
							<Button
								type="button"
								variant="ghost"
								aria-label={`${relic.name} 효과 보기`}
								aria-haspopup="dialog"
								onClick={() => handleSelect(relic.id)}
								className={cn(
									'aspect-square h-auto w-full rounded-xl p-1',
									ITEM_GRADE_SLOT_CLASS[relic.grade],
									ITEM_GRADE_SLOT_HOVER_CLASS[relic.grade],
									selected && 'ring-grayscale-900/30 ring-2'
								)}
							>
								<GradePortrait src={relic.imageSrc} alt="" grade={relic.grade} className="size-full" />
							</Button>
						</li>
					)
				})}
			</ul>

			<Sheet open={sheetOpen} onOpenChange={setOpen} modal={false} disablePointerDismissal>
				<SheetContent
					side="bottom"
					showOverlay={false}
					className="z-modal h-[45dvh] max-h-[45dvh] gap-0 rounded-t-2xl p-0"
				>
					{selectedRow ? (
						<>
							<SheetHeader className="border-grayscale-200 flex-row items-center justify-between gap-3 border-b pr-12">
								<SheetTitle className="sr-only">{selectedRow.relic.name}</SheetTitle>
								<SheetDescription className="sr-only">
									{selectedRow.relic.name}의 각성 단계와 장착·보유 효과
								</SheetDescription>
								<div className="min-w-0 flex-1">
									<RelicIdentity relic={selectedRow.relic} />
								</div>
								<RelicAwakeningCellControl
									stage={selectedRow.stage}
									maxStage={getRelicMaxAwakeningStage(selectedRow.relic.grade)}
									onStageChange={(stage) => onStageChange(selectedRow.relic.id, stage)}
								/>
							</SheetHeader>

							<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
								<section className="flex flex-col gap-1">
									<p className="text-grayscale-500 text-[11px] font-medium">장착 효과</p>
									<RelicEffectLineList lines={selectedRow.equipLines} lineKeyPrefix={`${selectedRow.relic.id}-equip`} />
								</section>
								<section className="flex flex-col gap-1">
									<p className="text-grayscale-500 text-[11px] font-medium">보유 효과</p>
									<RelicEffectLineList
										lines={selectedRow.possessionLines}
										lineKeyPrefix={`${selectedRow.relic.id}-possession`}
									/>
								</section>
							</div>
						</>
					) : null}
				</SheetContent>
			</Sheet>
		</>
	)
}

export default RelicEffectGrid
