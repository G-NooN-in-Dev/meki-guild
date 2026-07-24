'use client'

import { Switch } from '@shared/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'
import { cn } from '@shared/ui/utils'
import { useMemo, useState } from 'react'

import GradePortrait from '@/features/tips/components/grade-portrait'
import RelicAwakeningStars from '@/features/tips/components/relic-awakening-stars'
import RelicAwakeningStepper from '@/features/tips/components/relic-awakening-stepper'
import {
	clampRelicAwakeningStage,
	getRelicActivationCondition,
	RELIC_GRADE_META,
	RELIC_GRADE_ORDER,
	RELIC_GRADE_TAB_CLASS,
	RELICS
} from '@/features/tips/lib/relic.constants'
import type { Relic, RelicGrade } from '@/features/tips/types/relic.type'
import type { RelicOwnershipStateMap } from '@/features/tips/types/relic-consulting.type'

type RelicOwnershipGridProps = {
	ownership: RelicOwnershipStateMap
	onOwnershipChange?: (next: RelicOwnershipStateMap) => void
	readOnly?: boolean
	className?: string
}

function isRelicGrade(value: string | number | null): value is RelicGrade {
	return typeof value === 'string' && (RELIC_GRADE_ORDER as readonly string[]).includes(value)
}

/**
 * 유물 보유/미보유 스위치 + 보유 시 각성 단계 입력.
 * 미보유는 어둡게 표시해 게임 컬렉션 화면과 비슷한 느낌을 줍니다.
 */
function RelicOwnershipGrid({ ownership, onOwnershipChange, readOnly = false, className }: RelicOwnershipGridProps) {
	const [gradeTab, setGradeTab] = useState<RelicGrade>('legendary')

	const ownedCount = useMemo(() => RELICS.filter((relic) => ownership[relic.id]?.owned).length, [ownership])

	function updateRelic(relic: Relic, patch: Partial<{ owned: boolean; stage: number }>) {
		if (readOnly || !onOwnershipChange) {
			return
		}

		const current = ownership[relic.id] ?? { owned: false, stage: 0 }
		const owned = patch.owned ?? current.owned
		const stage = clampRelicAwakeningStage(patch.stage ?? current.stage)

		onOwnershipChange({
			...ownership,
			[relic.id]: { owned, stage: owned ? stage : 0 }
		})
	}

	return (
		<div className={cn('flex flex-col gap-3', className)}>
			<div className="flex items-end justify-between gap-2">
				<div>
					<h2 className="text-grayscale-900 font-semibold">보유 현황</h2>
					<p className="text-grayscale-500 text-sm">보유 스위치를 켜고, 각성 단계를 맞춰 주세요.</p>
				</div>
				<p className="text-grayscale-600 text-sm tabular-nums">
					{ownedCount}/{RELICS.length} 보유
				</p>
			</div>

			<Tabs
				value={gradeTab}
				onValueChange={(value) => {
					if (isRelicGrade(value)) {
						setGradeTab(value)
					}
				}}
				className="gap-3"
			>
				<TabsList className="grid w-full grid-cols-3">
					{RELIC_GRADE_ORDER.map((grade) => (
						<TabsTrigger key={grade} value={grade} className={cn('text-xs md:text-sm', RELIC_GRADE_TAB_CLASS[grade])}>
							{RELIC_GRADE_META[grade].label}
						</TabsTrigger>
					))}
				</TabsList>

				{RELIC_GRADE_ORDER.map((grade) => {
					const relics = RELICS.filter((item) => item.grade === grade)

					return (
						<TabsContent key={grade} value={grade} className="mt-0">
							<div className="grid grid-cols-2 gap-1.5 md:grid-cols-3 xl:grid-cols-4">
								{relics.map((relic) => {
									const state = ownership[relic.id] ?? { owned: false, stage: 0 }
									const { owned, stage } = state
									const activationCondition = getRelicActivationCondition(relic.id)

									return (
										<div
											key={relic.id}
											className={cn(
												'border-grayscale-200 bg-card flex flex-col gap-1.5 rounded-lg border p-2',
												!owned && 'bg-grayscale-50'
											)}
										>
											<div className="flex items-start gap-1.5">
												{/* 미보유는 초상·이름만 흐리게 — 스위치는 항상 또렷하게 */}
												<div className={cn('flex min-w-0 flex-1 items-center gap-1.5', !owned && 'opacity-45')}>
													<GradePortrait
														src={relic.imageSrc}
														alt={relic.name}
														grade={relic.grade}
														size="sm"
														className={cn(!owned && 'grayscale')}
													/>
													<div className="min-w-0 flex-1">
														<p className="text-grayscale-900 truncate text-xs font-semibold md:text-sm">{relic.name}</p>
														{activationCondition ? (
															<p className="text-grayscale-400 truncate text-[10px]">{activationCondition}</p>
														) : null}
													</div>
												</div>
												{!readOnly ? (
													<Switch
														size="sm"
														checked={owned}
														onCheckedChange={(checked) => updateRelic(relic, { owned: checked })}
														aria-label={`${relic.name} 보유`}
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
													<p className="text-grayscale-600 flex items-center gap-1 text-xs tabular-nums">
														각성 {stage}
														<RelicAwakeningStars stage={stage} />
													</p>
												) : (
													<RelicAwakeningStepper
														stage={stage}
														onStageChange={(nextStage) => updateRelic(relic, { stage: nextStage })}
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

export default RelicOwnershipGrid
