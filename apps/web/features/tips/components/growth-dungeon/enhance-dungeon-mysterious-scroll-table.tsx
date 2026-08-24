import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { ChevronDownIcon } from 'lucide-react'

import {
	ENHANCE_DUNGEON_MYSTERIOUS_SCROLL_BAND_ENTRIES,
	ENHANCE_DUNGEON_MYSTERIOUS_SCROLL_DROP_PERCENT
} from '@/features/tips/lib/growth-dungeon.constants'

const headerText = '의문의 주문서 세부 확률'

/** 열 공통 — 가운데 정렬 + 숫자 정렬 */
const cellBaseClassName =
	'px-1 py-2 text-center text-[11px] font-semibold tabular-nums xs:px-1.5 xs:text-xs md:px-2 md:py-2.5 md:text-sm'

/** 티어 헤더 톤 — 노말=회색, 레어=파랑, 에픽=보라 */
const tierHeadClassName = {
	normal: 'bg-grayscale-100 text-grayscale-700',
	rare: 'bg-pastel-blue-100 text-pastel-blue-900',
	epic: 'bg-pastel-purple-100 text-pastel-purple-900'
} as const

const tierCellClassName = {
	normal: 'bg-grayscale-50 text-grayscale-900',
	rare: 'bg-pastel-blue-50 text-grayscale-900',
	epic: 'bg-pastel-purple-50 text-grayscale-900'
} as const

/** 세부 확률(%) 표시. 불필요한 소수 자리는 잘라냅니다. */
function formatScrollRatePercent(value: number) {
	if (value === 0) return '—'

	const rounded = Math.round(value * 1000) / 1000

	return `${rounded}%`
}

function formatStageRange(stageFrom: number, stageTo: number) {
	if (stageFrom === stageTo) return String(stageFrom)

	return `${stageFrom} ~ ${stageTo}`
}

function MysteriousScrollTableBody() {
	return (
		<div className="flex flex-col gap-2 md:gap-3">
			<p className="text-grayscale-600 text-xs md:text-sm">
				클리어 시 각 주문서의 실제 획득 확률입니다. (의문의 주문서 {ENHANCE_DUNGEON_MYSTERIOUS_SCROLL_DROP_PERCENT}% ×
				단계별 티어 × 레어·에픽 균등 분배)
			</p>

			<div className="border-grayscale-200 overflow-x-auto rounded-xl border pb-2.5">
				<Table className="w-full min-w-xl table-fixed" containerClassName="overflow-visible">
					<TableHeader>
						<TableRow className="border-grayscale-200 hover:bg-transparent">
							<TableHead
								rowSpan={2}
								className={cn(
									'bg-grayscale-100 text-grayscale-600 border-r-grayscale-200 w-[12%] border-r text-center align-middle text-xs md:text-sm'
								)}
							>
								단계
							</TableHead>
							<TableHead
								className={cn(
									tierHeadClassName.normal,
									'xs:text-xs w-[14%] px-1 text-center text-[11px] leading-tight md:px-2 md:text-sm'
								)}
							>
								노말
							</TableHead>
							<TableHead
								colSpan={2}
								className={cn(
									tierHeadClassName.rare,
									'xs:text-xs w-[28%] px-1 text-center text-[11px] leading-tight md:px-2 md:text-sm'
								)}
							>
								레어
							</TableHead>
							<TableHead
								colSpan={3}
								className={cn(
									tierHeadClassName.epic,
									'xs:text-xs w-[46%] px-1 text-center text-[11px] leading-tight md:px-2 md:text-sm'
								)}
							>
								에픽
							</TableHead>
						</TableRow>
						<TableRow className="border-grayscale-200 hover:bg-transparent">
							<TableHead
								className={cn(
									tierHeadClassName.normal,
									'xs:text-[11px] px-1 text-center text-[10px] leading-tight md:px-2 md:text-xs'
								)}
							>
								40%
							</TableHead>
							<TableHead
								className={cn(
									tierHeadClassName.rare,
									'xs:text-[11px] px-1 text-center text-[10px] leading-tight md:px-2 md:text-xs'
								)}
							>
								40%
							</TableHead>
							<TableHead
								className={cn(
									tierHeadClassName.rare,
									'xs:text-[11px] px-1 text-center text-[10px] leading-tight md:px-2 md:text-xs'
								)}
							>
								25%
							</TableHead>
							<TableHead
								className={cn(
									tierHeadClassName.epic,
									'xs:text-[11px] px-1 text-center text-[10px] leading-tight md:px-2 md:text-xs'
								)}
							>
								70%
							</TableHead>
							<TableHead
								className={cn(
									tierHeadClassName.epic,
									'xs:text-[11px] px-1 text-center text-[10px] leading-tight md:px-2 md:text-xs'
								)}
							>
								30%
							</TableHead>
							<TableHead
								className={cn(
									tierHeadClassName.epic,
									'xs:text-[11px] px-1 text-center text-[10px] leading-tight md:px-2 md:text-xs'
								)}
							>
								15%
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{ENHANCE_DUNGEON_MYSTERIOUS_SCROLL_BAND_ENTRIES.map(
							({ stageFrom, stageTo, details: { normal40, rare40, rare25, epic70, epic30, epic15 } }) => (
								<TableRow key={`${stageFrom}-${stageTo}`} className="border-grayscale-200 hover:bg-transparent">
									<TableCell
										className={cn(
											cellBaseClassName,
											'bg-grayscale-50 text-grayscale-800 border-r-grayscale-200 border-r'
										)}
									>
										{formatStageRange(stageFrom, stageTo)}
									</TableCell>
									<TableCell className={cn(cellBaseClassName, tierCellClassName.normal)}>
										{formatScrollRatePercent(normal40)}
									</TableCell>
									<TableCell className={cn(cellBaseClassName, tierCellClassName.rare)}>
										{formatScrollRatePercent(rare40)}
									</TableCell>
									<TableCell className={cn(cellBaseClassName, tierCellClassName.rare)}>
										{formatScrollRatePercent(rare25)}
									</TableCell>
									<TableCell className={cn(cellBaseClassName, tierCellClassName.epic)}>
										{formatScrollRatePercent(epic70)}
									</TableCell>
									<TableCell className={cn(cellBaseClassName, tierCellClassName.epic)}>
										{formatScrollRatePercent(epic30)}
									</TableCell>
									<TableCell className={cn(cellBaseClassName, tierCellClassName.epic)}>
										{formatScrollRatePercent(epic15)}
									</TableCell>
								</TableRow>
							)
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

/**
 * 강화 던전 — 의문의 주문서 세부 종류 실제 획득 확률 표.
 * 드롭률(10%)까지 반영한 클리어당 확률입니다. 모바일은 접고, md 이상은 펼칩니다.
 */
function EnhanceDungeonMysteriousScrollTable() {
	return (
		<Card
			size="sm"
			className="border-grayscale-200 shadow-soft data-[size=sm]:gap-0 data-[size=sm]:py-0 md:data-[size=sm]:gap-4 md:data-[size=sm]:py-4"
		>
			<Collapsible className="flex flex-col md:hidden">
				<CollapsibleTrigger
					className={cn(
						'group flex w-full cursor-pointer items-center justify-between bg-transparent px-4 py-3 text-left',
						'text-grayscale-900 text-base font-semibold',
						'focus-visible:ring-grayscale-900 rounded-md focus-visible:ring-2 focus-visible:outline-none'
					)}
				>
					{headerText}
					<ChevronDownIcon
						aria-hidden
						className="size-4 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-180"
					/>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div className="border-grayscale-200 border-t px-4 py-3">
						<MysteriousScrollTableBody />
					</div>
				</CollapsibleContent>
			</Collapsible>

			<div className="hidden md:contents">
				<CardHeader>
					<CardTitle className="text-grayscale-900 text-lg font-semibold">{headerText}</CardTitle>
				</CardHeader>
				<CardContent>
					<MysteriousScrollTableBody />
				</CardContent>
			</div>
		</Card>
	)
}

export default EnhanceDungeonMysteriousScrollTable
