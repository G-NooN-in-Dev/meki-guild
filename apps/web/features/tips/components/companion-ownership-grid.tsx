'use client'

import { Switch } from '@shared/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'
import { cn } from '@shared/ui/utils'
import { useState } from 'react'

import CompanionLevelStepper from '@/features/tips/components/companion-level-stepper'
import GradePortrait from '@/features/tips/components/grade-portrait'
import {
	clampCompanionLevel,
	COMPANION_GRADE_MAX_LEVEL,
	COMPANION_GRADE_META,
	COMPANION_GRADE_ORDER,
	COMPANION_GRADE_TAB_CLASS,
	COMPANIONS
} from '@/features/tips/lib/companion-setup.constants'
import { ITEM_GRADE_SLOT_CLASS } from '@/features/tips/lib/item-grade.constants'
import type { Companion, CompanionGrade } from '@/features/tips/types/companion.type'
import type { CompanionOwnershipStateMap } from '@/features/tips/types/companion-consulting.type'

type CompanionOwnershipGridProps = {
	ownership: CompanionOwnershipStateMap
	onOwnershipChange?: (next: CompanionOwnershipStateMap) => void
	readOnly?: boolean
	className?: string
}

function isCompanionGrade(value: string | number | null): value is CompanionGrade {
	return typeof value === 'string' && (COMPANION_GRADE_ORDER as readonly string[]).includes(value)
}

/**
 * 동료 보유/미보유 스위치 + 보유 시 레벨 입력.
 * 미보유는 어둡게 표시해 게임 컬렉션 화면과 비슷한 느낌을 줍니다.
 */
function CompanionOwnershipGrid({
	ownership,
	onOwnershipChange,
	readOnly = false,
	className
}: CompanionOwnershipGridProps) {
	const [gradeTab, setGradeTab] = useState<CompanionGrade>('legendary')

	const ownedCount = COMPANIONS.filter((companion) => ownership[companion.id]?.owned).length

	function updateCompanion(companion: Companion, patch: Partial<{ owned: boolean; level: number }>) {
		if (readOnly || !onOwnershipChange) {
			return
		}

		const current = ownership[companion.id] ?? { owned: false, level: 1 }
		const owned = patch.owned ?? current.owned
		const level = clampCompanionLevel(companion.grade, patch.level ?? current.level)

		onOwnershipChange({
			...ownership,
			[companion.id]: { owned, level: owned ? level : 1 }
		})
	}

	return (
		<div className={cn('flex flex-col gap-3', className)}>
			<div className="flex items-end justify-between gap-2">
				<div>
					<h2 className="text-grayscale-900 font-semibold">보유 현황</h2>
					<p className="text-grayscale-500 text-sm">보유 스위치를 켜고, 레벨을 맞춰 주세요.</p>
				</div>
				<p className="text-grayscale-600 text-sm tabular-nums">
					{ownedCount}/{COMPANIONS.length} 보유
				</p>
			</div>

			<Tabs
				value={gradeTab}
				onValueChange={(value) => {
					if (isCompanionGrade(value)) {
						setGradeTab(value)
					}
				}}
				className="gap-3"
			>
				<TabsList className="grid w-full grid-cols-3">
					{COMPANION_GRADE_ORDER.map((grade) => (
						<TabsTrigger
							key={grade}
							value={grade}
							className={cn('text-xs md:text-sm', COMPANION_GRADE_TAB_CLASS[grade])}
						>
							{COMPANION_GRADE_META[grade].label}
						</TabsTrigger>
					))}
				</TabsList>

				{COMPANION_GRADE_ORDER.map((grade) => {
					const companions = COMPANIONS.filter((item) => item.grade === grade)

					return (
						<TabsContent key={grade} value={grade} className="mt-0">
							{/* 모바일부터 2열 — 카드가 화면 전체 폭을 쓰지 않게 합니다 */}
							<div className="grid grid-cols-2 gap-1.5 md:grid-cols-3 xl:grid-cols-4">
								{companions.map((companion) => {
									const state = ownership[companion.id] ?? { owned: false, level: 1 }
									const { owned, level } = state

									return (
										<div
											key={companion.id}
											className={cn(
												'border-grayscale-200 bg-card flex flex-col gap-1.5 rounded-lg border p-2',
												// 보유 시에만 등급색 — 미보유는 회색 톤을 유지합니다.
												owned ? ITEM_GRADE_SLOT_CLASS[companion.grade] : 'bg-grayscale-50'
											)}
										>
											<div className="flex items-start gap-1.5">
												{/* 미보유는 초상·이름만 흐리게 — 스위치는 항상 또렷하게 */}
												<div className={cn('flex min-w-0 flex-1 items-center gap-1.5', !owned && 'opacity-45')}>
													<GradePortrait
														src={companion.imageSrc}
														alt={companion.name}
														grade={companion.grade}
														size="sm"
														className={cn(!owned && 'grayscale')}
													/>
													<div className="min-w-0 flex-1">
														<p className="text-grayscale-900 truncate text-xs font-semibold md:text-sm">
															{companion.name}
														</p>
													</div>
												</div>
												{!readOnly ? (
													<Switch
														size="sm"
														checked={owned}
														onCheckedChange={(checked) => updateCompanion(companion, { owned: checked })}
														aria-label={`${companion.name} 보유`}
														className={cn(
															'mt-0.5 shrink-0',
															!owned && 'data-unchecked:border-grayscale-400 data-unchecked:bg-grayscale-300'
														)}
													/>
												) : (
													<span className="text-grayscale-600 mt-0.5 shrink-0 text-[10px] font-medium">
														{owned ? '보유' : '미보유'}
													</span>
												)}
											</div>

											{owned ? (
												readOnly ? (
													<p className="text-grayscale-600 text-xs tabular-nums">Lv.{level}</p>
												) : (
													<CompanionLevelStepper
														level={level}
														maxLevel={COMPANION_GRADE_MAX_LEVEL[companion.grade]}
														onLevelChange={(nextLevel) => updateCompanion(companion, { level: nextLevel })}
														compact
													/>
												)
											) : null}
										</div>
									)
								})}
							</div>
						</TabsContent>
					)
				})}
			</Tabs>
		</div>
	)
}

export default CompanionOwnershipGrid
