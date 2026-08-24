'use client'

import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { TableIcon } from 'lucide-react'

import {
	formatPotentialValuesForGrade,
	RELIC_POTENTIAL_GRADE_BADGE_CLASS,
	RELIC_POTENTIAL_GRADE_META,
	RELIC_POTENTIAL_GRADE_ORDER,
	RELIC_POTENTIAL_STAT_LINES
} from '@/features/tips/lib/relic-potential.constants'

const labelHeaderClassName =
	'bg-grayscale-100 text-grayscale-600 sticky left-0 z-30 w-[30%] min-w-0 px-2 text-left text-xs sm:w-[28%] sm:px-3 sm:text-sm'
const labelCellClassName =
	'bg-grayscale-50 sticky left-0 z-[1] w-[30%] min-w-0 px-2 py-2.5 text-left align-middle sm:w-[28%] sm:px-3 sm:py-3'
const gradeHeaderClassName =
	'min-w-0 overflow-hidden px-1 py-2 text-center text-[11px] leading-tight whitespace-normal sm:px-1.5 sm:text-xs md:px-2 md:text-sm'
const gradeCellClassName = 'min-w-0 overflow-hidden px-1 py-2.5 text-center align-middle sm:px-1.5 sm:py-3 md:px-2'

/**
 * 등급 셀 수치.
 * 미스틱처럼 값이 둘이면 좁은 폭에서도 넘치지 않게 세로로 쌓습니다.
 */
function PotentialValueText({ grade, label }: { grade: (typeof RELIC_POTENTIAL_GRADE_ORDER)[number]; label: string }) {
	const text = formatPotentialValuesForGrade(grade, label)
	const parts = text === '—' ? [text] : text.split(' / ')

	if (parts.length === 1) {
		return (
			<p className="text-grayscale-900 text-[11px] leading-snug font-semibold tabular-nums sm:text-xs md:text-sm">
				{parts[0]}
			</p>
		)
	}

	return (
		<p className="text-grayscale-900 flex flex-col items-center gap-0.5 text-[11px] leading-tight font-semibold tabular-nums sm:text-xs md:text-sm">
			{parts.map((part) => (
				<span key={part}>{part}</span>
			))}
		</p>
	)
}

/**
 * 잠재옵션 카탈로그 Dialog.
 * 효과 표 헤더에서 열어, 긴 유물 목록을 스크롤하지 않아도 찾을 수 있습니다.
 */
function RelicPotentialTable() {
	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button variant="outline" size="sm" className="text-grayscale-700 shrink-0 gap-1.5">
						<TableIcon className="size-4" />
						잠재 옵션
					</Button>
				}
			/>
			<DialogContent className="max-h-[90dvh] max-w-[calc(100%-(--spacing(4)))] gap-4 overflow-hidden p-4 sm:max-w-3xl sm:gap-5 sm:p-6">
				<DialogHeader>
					<DialogTitle>잠재 옵션</DialogTitle>
					<DialogDescription>등급별 옵션 수치입니다.</DialogDescription>
				</DialogHeader>

				<div className="border-grayscale-200 bg-card shadow-soft max-h-[min(65dvh,36rem)] overflow-auto rounded-xl border">
					<Table className="w-full min-w-136 table-fixed">
						<TableHeader className="sticky top-0 z-20">
							<TableRow className="border-grayscale-200 hover:bg-transparent">
								<TableHead className={labelHeaderClassName}>옵션</TableHead>
								{RELIC_POTENTIAL_GRADE_ORDER.map((grade) => (
									<TableHead key={grade} className={cn(gradeHeaderClassName, RELIC_POTENTIAL_GRADE_BADGE_CLASS[grade])}>
										<span className="font-semibold">{RELIC_POTENTIAL_GRADE_META[grade].label}</span>
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{RELIC_POTENTIAL_STAT_LINES.map((stat) => (
								<TableRow key={stat.key} className="border-grayscale-200 hover:bg-transparent">
									<TableCell className={labelCellClassName}>
										<p className="text-grayscale-900 text-xs leading-snug font-medium break-keep sm:text-sm">
											{stat.label}
										</p>
									</TableCell>
									{RELIC_POTENTIAL_GRADE_ORDER.map((grade) => (
										<TableCell key={grade} className={gradeCellClassName}>
											<PotentialValueText grade={grade} label={stat.label} />
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default RelicPotentialTable
