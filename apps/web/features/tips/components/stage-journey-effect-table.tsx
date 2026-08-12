'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import {
	formatStageJourneyStatValue,
	getStageJourneyChapter,
	STAGE_JOURNEY_GRADE_META,
	STAGE_JOURNEY_GRADE_ORDER
} from '@/features/tips/lib/stage-journey.constants'

type StageJourneyEffectTableProps = {
	chapter: number
}

const labelHeaderClassName =
	'bg-grayscale-100 text-grayscale-600 sticky left-0 z-30 w-[26%] min-w-0 px-2 text-left text-xs sm:w-[22%] sm:px-3 sm:text-sm'
const labelCellClassName =
	'bg-grayscale-50 sticky left-0 z-[1] w-[26%] min-w-0 px-2 py-2.5 text-left align-middle sm:w-[22%] sm:px-3 sm:py-3'
const gradeHeaderClassName =
	'min-w-0 overflow-hidden px-1 py-2 text-center text-[11px] leading-tight whitespace-normal sm:px-1.5 sm:text-xs md:px-2 md:text-sm'
const gradeCellClassName = 'min-w-0 overflow-hidden px-1 py-2.5 text-center align-middle sm:px-1.5 sm:py-3 md:px-2'
const gradeValueClassName =
	'text-grayscale-900 text-[11px] leading-snug font-semibold tabular-nums sm:text-xs md:text-sm'

/** 테스트용: 등급 열 배경색 (헤더보다 한 톤 옅게) */
const STAGE_JOURNEY_GRADE_CELL_CLASS = {
	normal: 'bg-grayscale-100',
	rare: 'bg-pastel-blue-50',
	epic: 'bg-pastel-purple-50',
	unique: 'bg-pastel-yellow-50',
	legendary: 'bg-pastel-green-50',
	mystic: 'bg-pure-red/5',
	mysticPlus: 'bg-pure-red/10'
} as const

/**
 * 선택한 챕터의 보유 효과 3슬롯 × 등급 7열 표.
 * 좁은 화면에서는 가로 스크롤하고, 옵션 열은 sticky로 고정합니다.
 */
function StageJourneyEffectTable({ chapter }: StageJourneyEffectTableProps) {
	const entry = getStageJourneyChapter(chapter)

	if (!entry) {
		return (
			<p className="text-grayscale-600 border-grayscale-200 bg-card shadow-soft rounded-xl border px-4 py-6 text-sm">
				선택한 챕터 데이터를 찾을 수 없습니다.
			</p>
		)
	}

	if (!entry.slots?.length) {
		return (
			<div className="flex flex-col gap-3">
				<div className="flex flex-wrap items-baseline justify-between gap-2">
					<h2 className="text-grayscale-900 text-base font-semibold md:text-lg">
						{entry.chapter}챕터 · {entry.name} 보유 효과
					</h2>
				</div>
				<p className="text-grayscale-600 border-grayscale-200 bg-card shadow-soft rounded-xl border px-4 py-6 text-sm">
					해당 챕터의 보유 효과 데이터는 추가 예정입니다.
				</p>
			</div>
		)
	}

	const displayRows = [...entry.slots]
	const remainingSlotCount = Math.max(0, 3 - displayRows.length)
	for (let index = 0; index < remainingSlotCount; index += 1) {
		displayRows.push({
			label: '추가 예정',
			unit: 'flat',
			values: {
				normal: 0,
				rare: 0,
				epic: 0,
				unique: 0,
				legendary: 0,
				mystic: 0,
				mysticPlus: 0
			}
		})
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-wrap items-baseline justify-between gap-2">
				<h2 className="text-grayscale-900 text-base font-semibold md:text-lg">
					{entry.chapter}챕터 · {entry.name} 보유 효과
				</h2>
				<p className="text-grayscale-500 text-xs md:text-sm">
					{entry.special ? (
						<>
							<span>특수 옵션: </span>
							<span className="text-grayscale-600 font-medium">
								{entry.special.label} {formatStageJourneyStatValue(entry.special.value, entry.special.unit)}
							</span>
							<span className="text-grayscale-400"> (3슬롯 유니크 이상)</span>
						</>
					) : (
						<span className="text-grayscale-500">특수 옵션 정보 추가 예정</span>
					)}
				</p>
			</div>

			<div className="border-grayscale-200 bg-card shadow-soft overflow-auto rounded-xl border">
				<Table className="w-full min-w-2xl table-fixed">
					<TableHeader className="sticky top-0 z-20">
						<TableRow className="border-grayscale-200 hover:bg-transparent">
							<TableHead className={labelHeaderClassName}>보유 효과</TableHead>
							{STAGE_JOURNEY_GRADE_ORDER.map((grade) => (
								<TableHead
									key={grade}
									className={cn(gradeHeaderClassName, STAGE_JOURNEY_GRADE_META[grade].badgeClassName)}
								>
									<span className="flex flex-col items-center gap-0.5">
										<span className="font-semibold">{STAGE_JOURNEY_GRADE_META[grade].label}</span>
										<span className="text-[10px] leading-none opacity-80 sm:text-[11px]">
											({STAGE_JOURNEY_GRADE_META[grade].probabilityText})
										</span>
									</span>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{displayRows.map((slot, index) => (
							<TableRow
								key={`${entry.chapter}-${slot.label}-${index}`}
								className="border-grayscale-200 hover:bg-transparent"
							>
								<TableCell className={cn(labelCellClassName, 'text-grayscale-800 font-medium break-keep')}>
									{slot.label}
									{slot.isEstimated && <span className="text-grayscale-500 ml-1 text-[11px] font-normal">(추정)</span>}
								</TableCell>
								{STAGE_JOURNEY_GRADE_ORDER.map((grade) => (
									<TableCell key={grade} className={cn(gradeCellClassName, STAGE_JOURNEY_GRADE_CELL_CLASS[grade])}>
										<p className={gradeValueClassName}>
											{slot.label === '추가 예정'
												? '추가 예정'
												: formatStageJourneyStatValue(slot.values[grade], slot.unit)}
										</p>
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}

export default StageJourneyEffectTable
