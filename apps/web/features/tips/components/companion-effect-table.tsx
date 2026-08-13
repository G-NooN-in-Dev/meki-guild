'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import { useState } from 'react'

import CompanionLevelStepper from '@/features/tips/components/companion-level-stepper'
import GradePortrait from '@/features/tips/components/grade-portrait'
import {
	COMPANION_EQUIP_EFFECT_BASE_BY_JOB,
	COMPANION_GRADE_MAX_LEVEL,
	COMPANION_GRADE_META,
	COMPANION_GRADE_ORDER,
	COMPANION_JOBS,
	getCompanionImageSrc,
	resolveEquipEffects
} from '@/features/tips/lib/companion-setup.constants'
import { ITEM_GRADE_BADGE_CLASS, ITEM_GRADE_SLOT_CLASS } from '@/features/tips/lib/item-grade.constants'
import type { CompanionGrade } from '@/features/tips/types/companion.type'

/** 모바일에서도 한 화면에 들어가도록 비율 고정 */
const jobHeaderClassName =
	'bg-grayscale-100 text-grayscale-600 sticky left-0 z-30 w-[28%] min-w-0 overflow-hidden px-1.5 text-center text-xs whitespace-normal sm:px-2 md:w-[22%] md:px-3 md:text-sm'
const jobCellClassName =
	'bg-grayscale-50 sticky left-0 z-[1] w-[28%] min-w-0 overflow-hidden px-1.5 py-2.5 align-middle whitespace-normal sm:px-2 md:w-[22%] md:px-3 md:py-3'
const gradeHeaderClassName =
	'w-[24%] min-w-0 overflow-hidden px-1 py-2 text-center align-bottom text-[11px] leading-tight whitespace-normal sm:px-1.5 sm:text-xs md:w-[26%] md:px-2 md:py-3 md:text-sm'
const gradeCellClassName =
	'w-[24%] min-w-0 overflow-hidden px-1 py-2.5 text-center align-middle whitespace-normal sm:px-1.5 md:w-[26%] md:px-2 md:py-3'

function formatEffectValue(value: number, unit: 'percent' | 'flat') {
	return unit === 'percent' ? `+${value}%` : `+${value}`
}

/**
 * 직업 행 × 등급 열 표.
 * 효과 종류는 직업마다 같고, 수치는 열(등급) 공통 레벨로 계산합니다.
 * 모바일은 table-fixed로 가로를 맞추고, 헤더 레벨 UI는 줄바꿈·축소로 대응합니다.
 */
function CompanionEffectTable() {
	const [levelByGrade, setLevelByGrade] = useState<Record<CompanionGrade, number>>({
		legendary: 1,
		unique: 1,
		epic: 1
	})

	return (
		<div className="border-grayscale-200 bg-card shadow-soft max-h-[min(70dvh,44rem)] overflow-auto rounded-xl border">
			<Table className="w-full table-fixed" containerClassName="overflow-visible">
				<TableHeader sticky>
					<TableRow className="border-grayscale-200 hover:bg-transparent">
						<TableHead className={jobHeaderClassName}>동료</TableHead>
						{COMPANION_GRADE_ORDER.map((grade) => (
							<TableHead key={grade} className={cn(gradeHeaderClassName, ITEM_GRADE_BADGE_CLASS[grade])}>
								<div className="flex flex-col items-center gap-2.5">
									<span className="font-semibold">{COMPANION_GRADE_META[grade].label}</span>
									<CompanionLevelStepper
										density="header"
										level={levelByGrade[grade]}
										maxLevel={COMPANION_GRADE_MAX_LEVEL[grade]}
										onLevelChange={(next) =>
											setLevelByGrade((prev) => ({
												...prev,
												[grade]: next
											}))
										}
									/>
								</div>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{COMPANION_JOBS.map((job) => {
						const effectBase =
							COMPANION_EQUIP_EFFECT_BASE_BY_JOB[job as keyof typeof COMPANION_EQUIP_EFFECT_BASE_BY_JOB]
						const imageSrc = getCompanionImageSrc(job)

						return (
							<TableRow key={job} className="border-grayscale-200 hover:bg-transparent">
								<TableCell className={jobCellClassName}>
									<div className="flex min-w-0 items-center gap-1.5 sm:gap-2.5">
										<GradePortrait src={imageSrc} alt={job} size="sm" className="shrink-0" />
										<div className="min-w-0 flex-1">
											<p className="text-grayscale-900 text-xs leading-snug font-medium break-keep sm:text-sm">{job}</p>
											<p className="text-grayscale-500 text-[10px] leading-snug break-keep sm:text-xs">
												{effectBase?.label ?? '장착 효과'}
											</p>
										</div>
									</div>
								</TableCell>

								{COMPANION_GRADE_ORDER.map((grade) => {
									const level = levelByGrade[grade]
									const effect = resolveEquipEffects(job, grade, level)[0]

									return (
										<TableCell key={grade} className={cn(gradeCellClassName, ITEM_GRADE_SLOT_CLASS[grade])}>
											<p className="text-grayscale-900 text-xs font-semibold tabular-nums sm:text-sm">
												{effect ? formatEffectValue(effect.value, effect.unit) : '—'}
											</p>
										</TableCell>
									)
								})}
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}

export default CompanionEffectTable
