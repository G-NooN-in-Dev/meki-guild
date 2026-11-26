'use client'

import { Button } from '@shared/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { cn } from '@shared/ui/utils'
import { useState } from 'react'

import RelicAwakeningCellControl from '@/features/tips/components/relic/relic-awakening-cell-control'
import RelicEffectLineList from '@/features/tips/components/relic/relic-effect-line-list'
import RelicIdentity from '@/features/tips/components/relic/relic-identity'
import GradePortrait from '@/features/tips/components/shared/grade-portrait'
import {
	ITEM_GRADE_CORNER_CHIP_CLASS,
	ITEM_GRADE_SELECTED_CLASS,
	ITEM_GRADE_SLOT_CLASS,
	ITEM_GRADE_SLOT_HOVER_CLASS
} from '@/features/tips/lib/item-grade.constants'
import { getRelicMaxAwakeningStage, RELIC_GRADE_META } from '@/features/tips/lib/relic.constants'
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
					const selected = sheetOpen && relic.id === selectedId
					// 시트가 열려 있으면 선택되지 않은 셀을 흐리게 해 선택 셀이 도드라지게 합니다.
					const dimmed = sheetOpen && !selected
					const gradeLabel = RELIC_GRADE_META[relic.grade].label

					return (
						<li key={relic.id}>
							<Button
								type="button"
								variant="ghost"
								aria-label={`${relic.name} ${gradeLabel} 효과 보기`}
								aria-haspopup="dialog"
								aria-pressed={selected}
								onClick={() => handleSelect(relic.id)}
								className={cn(
									'relative aspect-square h-auto w-full rounded-xl p-1 transition-all duration-200',
									ITEM_GRADE_SLOT_CLASS[relic.grade],
									ITEM_GRADE_SLOT_HOVER_CLASS[relic.grade],
									dimmed && 'opacity-50',
									selected && ['z-10 scale-105 shadow-md ring-2', ITEM_GRADE_SELECTED_CLASS[relic.grade]]
								)}
							>
								<GradePortrait src={relic.imageSrc} alt="" grade={relic.grade} className="size-full" />
								<span
									aria-hidden
									className={cn(
										'absolute top-0 left-0 size-3.5 rounded-tl-xl rounded-br-lg',
										ITEM_GRADE_CORNER_CHIP_CLASS[relic.grade]
									)}
								/>
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
