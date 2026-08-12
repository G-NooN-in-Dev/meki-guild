'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'

import GradePortrait from '@/features/tips/components/grade-portrait'
import RelicAwakeningStars from '@/features/tips/components/relic-awakening-stars'
import RelicPotentialTable from '@/features/tips/components/relic-potential-table'
import { ITEM_GRADE_BADGE_CLASS, ITEM_GRADE_SLOT_CLASS } from '@/features/tips/lib/item-grade.constants'
import {
	RELIC_GRADE_META,
	RELIC_MAX_AWAKENING_STAGE,
	RELICS,
	resolveRelicEffects
} from '@/features/tips/lib/relic.constants'

const nameHeaderClassName =
	'bg-grayscale-100 text-grayscale-600 sticky left-0 z-30 w-[30%] min-w-0 px-2 text-left text-xs sm:w-[26%] sm:px-3 sm:text-sm md:w-[24%]'
const nameCellClassName =
	'bg-grayscale-50 sticky left-0 z-[1] w-[30%] min-w-0 px-2 py-2.5 align-middle sm:w-[26%] sm:px-3 sm:py-3 md:w-[24%]'
/** 각성 열 — 별(warning) 톤으로 구분 */
const stageHeaderClassName =
	'bg-warning-100 text-warning-700 w-[7.5rem] min-w-[7.5rem] px-1.5 py-2 text-center text-xs sm:w-32 sm:min-w-32 sm:text-sm'
const stageCellClassName =
	'bg-warning-50 w-[7.5rem] min-w-[7.5rem] px-1.5 py-2.5 text-center align-middle sm:w-32 sm:min-w-32'
const effectHeaderClassName =
	'bg-grayscale-100 text-grayscale-600 min-w-0 px-2 py-2 text-left text-xs sm:px-3 sm:text-sm'
const effectCellClassName = 'min-w-0 px-2 py-2.5 align-middle sm:px-3 sm:py-3'

/** %, 초, 중첩 등 단위가 붙은 수치를 본문에서 잘라 강조합니다. */
const EFFECT_NUMBER_PATTERN = /(\d+(?:\.\d+)?(?:%|초|중첩|명|개)?)/g

function emphasizeEffectNumbers(text: string) {
	return text.split(EFFECT_NUMBER_PATTERN).map((part, index) => {
		if (!part || !/^\d/.test(part)) {
			return part
		}

		return (
			<span key={`${part}-${index}`} className="text-grayscale-900 font-semibold tabular-nums">
				{part}
			</span>
		)
	})
}

function createInitialStageByRelicId() {
	return Object.fromEntries(RELICS.map((relic) => [relic.id, 0])) as Record<string, number>
}

type RelicAwakeningCellControlProps = {
	stage: number
	onStageChange: (stage: number) => void
}

/** 효과 표 각성 셀 — 위: 별 트랙, 아래: − / + */
function RelicAwakeningCellControl({ stage, onStageChange }: RelicAwakeningCellControlProps) {
	const canDecrease = stage > 0
	const canIncrease = stage < RELIC_MAX_AWAKENING_STAGE

	return (
		<div className="flex flex-col items-center gap-1.5">
			<RelicAwakeningStars stage={stage} max={RELIC_MAX_AWAKENING_STAGE} />
			<div className="flex items-center gap-1">
				<Button
					type="button"
					variant="outline"
					size="icon-xs"
					disabled={!canDecrease}
					aria-label="각성 단계 감소"
					onClick={() => onStageChange(stage - 1)}
				>
					<MinusIcon className="size-3" />
				</Button>
				<Button
					type="button"
					variant="outline"
					size="icon-xs"
					disabled={!canIncrease}
					aria-label="각성 단계 증가"
					onClick={() => onStageChange(stage + 1)}
				>
					<PlusIcon className="size-3" />
				</Button>
			</div>
		</div>
	)
}

/**
 * 유물별 장착 효과 표.
 * 행마다 각성 단계를 따로 조절해 효과를 비교하고, 잠재옵션은 Dialog로 엽니다.
 */
function RelicEffectTable() {
	const [stageByRelicId, setStageByRelicId] = useState(createInitialStageByRelicId)

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div className="flex min-w-0 flex-col gap-1">
					<h3 className="text-grayscale-900 text-base font-semibold">유물 장착 효과</h3>
					<p className="text-grayscale-600 text-sm">유물마다 각성 단계를 바꿔 효과 수치를 비교해 보세요.</p>
				</div>
				<RelicPotentialTable />
			</div>

			<div className="border-grayscale-200 bg-card shadow-soft max-h-[min(70dvh,44rem)] overflow-auto rounded-xl border">
				<Table className="w-full min-w-xl">
					<TableHeader className="sticky top-0 z-20">
						<TableRow className="border-grayscale-200 hover:bg-transparent">
							<TableHead className={nameHeaderClassName}>유물</TableHead>
							<TableHead className={stageHeaderClassName}>각성</TableHead>
							<TableHead className={effectHeaderClassName}>장착 효과</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{RELICS.map((relic) => {
							const stage = stageByRelicId[relic.id] ?? 0
							const effects = resolveRelicEffects(relic.id, stage)

							return (
								<TableRow key={relic.id} className="border-grayscale-200 hover:bg-transparent">
									<TableCell className={cn(nameCellClassName, ITEM_GRADE_SLOT_CLASS[relic.grade])}>
										<div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
											<GradePortrait
												src={relic.imageSrc}
												alt={relic.name}
												grade={relic.grade}
												size="sm"
												className="shrink-0"
											/>
											<div className="min-w-0 flex-1">
												<p className="text-grayscale-900 text-xs leading-snug font-medium break-keep sm:text-sm">
													{relic.name}
												</p>
												<Badge
													variant="secondary"
													className={cn(
														'mt-1 px-1.5 py-0 text-[10px] font-medium',
														ITEM_GRADE_BADGE_CLASS[relic.grade]
													)}
												>
													{RELIC_GRADE_META[relic.grade].label}
												</Badge>
											</div>
										</div>
									</TableCell>
									<TableCell className={stageCellClassName}>
										<RelicAwakeningCellControl
											stage={stage}
											onStageChange={(next) =>
												setStageByRelicId((prev) => ({
													...prev,
													[relic.id]: next
												}))
											}
										/>
									</TableCell>
									<TableCell className={effectCellClassName}>
										{effects?.lines.length ? (
											<ul className="text-grayscale-600 space-y-1 text-xs leading-snug break-keep sm:text-sm">
												{effects.lines.map((line) => (
													<li key={`${relic.id}-${line}`}>{emphasizeEffectNumbers(line)}</li>
												))}
											</ul>
										) : (
											<p className="text-grayscale-400 text-sm">—</p>
										)}
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default RelicEffectTable
