'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import {
	formatStageJourneyStatValue,
	getStageJourneyChapter,
	STAGE_JOURNEY_GRADE_META,
	STAGE_JOURNEY_GRADE_ORDER
} from '@/features/tips/lib/stage-journey.constants'
import type { StageJourneyEffectSlot, StageJourneyGrade } from '@/features/tips/types/stage-journey.type'

type StageJourneyEffectTableProps = {
	chapter: number
}

type StageJourneyEffectGridProps = {
	chapter: number
	slots: readonly StageJourneyEffectSlot[]
}

const PLACEHOLDER_SLOT_LABEL = '추가 예정'

const PLACEHOLDER_SLOT: StageJourneyEffectSlot = {
	label: PLACEHOLDER_SLOT_LABEL,
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

const mobileGradeHeaderClassName =
	'bg-grayscale-100 text-grayscale-600 sticky left-0 z-30 w-[28%] min-w-0 px-2 text-center text-xs'
const mobileGradeCellClassName = 'sticky left-0 z-[1] w-[28%] min-w-0 px-2 py-2 text-center align-middle'
const mobileEffectHeaderClassName =
	'bg-grayscale-100 text-grayscale-600 h-auto min-w-0 px-1 py-2 text-center text-[11px] leading-tight font-medium break-keep whitespace-normal'
const mobileEffectCellClassName = 'min-w-0 overflow-hidden px-1 py-2 text-center align-middle'

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

function toDisplaySlots(slots: readonly StageJourneyEffectSlot[]) {
	const remainingSlotCount = Math.max(0, 3 - slots.length)
	if (remainingSlotCount === 0) {
		return [...slots]
	}

	return [...slots, ...Array.from({ length: remainingSlotCount }, () => PLACEHOLDER_SLOT)]
}

function formatEffectCellValue(slot: StageJourneyEffectSlot, grade: StageJourneyGrade) {
	if (slot.label === PLACEHOLDER_SLOT_LABEL) {
		return PLACEHOLDER_SLOT_LABEL
	}

	return formatStageJourneyStatValue(slot.values[grade], slot.unit)
}

/**
 * 좁은 화면용 등급 7행 × 효과 3열 표.
 * 열이 적어 가로 스크롤 없이 미스틱까지 볼 수 있습니다.
 */
function StageJourneyEffectMobileTable({ chapter, slots }: StageJourneyEffectGridProps) {
	return (
		<Table className="w-full table-fixed">
			<TableHeader className="sticky top-0 z-20">
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead className={mobileGradeHeaderClassName}>등급</TableHead>
					{slots.map((slot, index) => (
						<TableHead key={`${chapter}-${slot.label}-${index}`} className={mobileEffectHeaderClassName}>
							<span className="flex items-center justify-center gap-0.5">
								<span>{slot.label}</span>
								{slot.isEstimated && <span className="text-grayscale-500 text-[10px] font-normal">(추정)</span>}
							</span>
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{STAGE_JOURNEY_GRADE_ORDER.map((grade) => (
					<TableRow key={grade} className="border-grayscale-200 hover:bg-transparent">
						<TableCell className={cn(mobileGradeCellClassName, STAGE_JOURNEY_GRADE_META[grade].badgeClassName)}>
							<span className="flex flex-col items-center gap-0.5">
								<span className="text-xs font-semibold">{STAGE_JOURNEY_GRADE_META[grade].label}</span>
								<span className="text-[10px] leading-none opacity-80">
									({STAGE_JOURNEY_GRADE_META[grade].probabilityText})
								</span>
							</span>
						</TableCell>
						{slots.map((slot, index) => (
							<TableCell
								key={`${chapter}-${slot.label}-${index}-${grade}`}
								className={cn(mobileEffectCellClassName, STAGE_JOURNEY_GRADE_CELL_CLASS[grade])}
							>
								<p className={gradeValueClassName}>{formatEffectCellValue(slot, grade)}</p>
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

/** 넓은 화면용 효과 3행 × 등급 7열 표. */
function StageJourneyEffectDesktopTable({ chapter, slots }: StageJourneyEffectGridProps) {
	return (
		<Table className="w-full min-w-2xl table-fixed">
			<TableHeader className="sticky top-0 z-20">
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead className={labelHeaderClassName}>보유 효과</TableHead>
					{STAGE_JOURNEY_GRADE_ORDER.map((grade) => (
						<TableHead key={grade} className={cn(gradeHeaderClassName, STAGE_JOURNEY_GRADE_META[grade].badgeClassName)}>
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
				{slots.map((slot, index) => (
					<TableRow key={`${chapter}-${slot.label}-${index}`} className="border-grayscale-200 hover:bg-transparent">
						<TableCell className={cn(labelCellClassName, 'text-grayscale-800 font-medium break-keep')}>
							{slot.label}
							{slot.isEstimated && <span className="text-grayscale-500 ml-1 text-[11px] font-normal">(추정)</span>}
						</TableCell>
						{STAGE_JOURNEY_GRADE_ORDER.map((grade) => (
							<TableCell key={grade} className={cn(gradeCellClassName, STAGE_JOURNEY_GRADE_CELL_CLASS[grade])}>
								<p className={gradeValueClassName}>{formatEffectCellValue(slot, grade)}</p>
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}

/**
 * 선택한 챕터의 보유 효과 표.
 * lg 미만은 등급이 행·효과가 열, lg 이상은 효과가 행·등급이 열입니다.
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

	const displaySlots = toDisplaySlots(entry.slots)

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
				<div className="lg:hidden">
					<StageJourneyEffectMobileTable chapter={entry.chapter} slots={displaySlots} />
				</div>
				<div className="hidden lg:block">
					<StageJourneyEffectDesktopTable chapter={entry.chapter} slots={displaySlots} />
				</div>
			</div>
		</div>
	)
}

export default StageJourneyEffectTable
