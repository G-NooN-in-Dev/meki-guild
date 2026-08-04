'use client'

import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/utils'
import { useState } from 'react'

import RelicAwakeningStars from '@/features/tips/components/relic-awakening-stars'
import RelicSlot from '@/features/tips/components/relic-slot'
import RelicSlotEditor from '@/features/tips/components/relic-slot-editor'
import {
	aggregateRelicStats,
	clampRelicAwakeningStage,
	getRelicActivationCondition,
	getRelicById,
	RELIC_SETUP_SLOTS,
	resolveRelicEffects
} from '@/features/tips/lib/relic.constants'
import {
	clampPotentialIds,
	getRelicPotentialOptionById,
	resolvePotentialStats
} from '@/features/tips/lib/relic-potential.constants'
import type { Relic, RelicSlotLoadout } from '@/features/tips/types/relic.type'
import type { RelicConsultingLoadout } from '@/features/tips/types/relic-consulting.type'

type RelicSetupBoardProps = {
	loadouts: RelicConsultingLoadout
	onLoadoutsChange?: (loadouts: RelicConsultingLoadout) => void
	/** 보유 유물만 선택 (컨설팅용). 없으면 전체 */
	allowedIds?: ReadonlySet<string> | null
	/** 슬롯 각성을 보유 각성에 맞춤 — 선택 시 각성 고정 */
	stageByRelicId?: ReadonlyMap<string, number> | null
	readOnly?: boolean
	/** 보드 제목 */
	title?: string
	className?: string
}

const EMPTY_LOADOUT: RelicSlotLoadout = { relicId: null, stage: 0, potentialIds: [] }

/**
 * 유물 4슬롯 세팅 보드 + (편집 시) Sheet.
 * 시뮬레이터·컨설팅 작성·추천에서 공통으로 씁니다.
 */
function RelicSetupBoard({
	loadouts,
	onLoadoutsChange,
	allowedIds = null,
	stageByRelicId = null,
	readOnly = false,
	title = '세팅 보드',
	className
}: RelicSetupBoardProps) {
	const [editingSlotId, setEditingSlotId] = useState<string | null>(null)
	const lockStage = Boolean(stageByRelicId)

	const editingSlot = editingSlotId ? (RELIC_SETUP_SLOTS.find((slot) => slot.id === editingSlotId) ?? null) : null
	const editingLoadout = editingSlotId ? (loadouts[editingSlotId] ?? EMPTY_LOADOUT) : EMPTY_LOADOUT
	const editingRelic = editingLoadout.relicId ? (getRelicById(editingLoadout.relicId) ?? null) : null

	const excludedIds = (() => {
		const ids = new Set<string>()
		for (const [slotId, loadout] of Object.entries(loadouts)) {
			if (loadout.relicId && slotId !== editingSlotId) {
				ids.add(loadout.relicId)
			}
		}
		return ids
	})()

	const equippedCount = RELIC_SETUP_SLOTS.filter((slot) => Boolean(loadouts[slot.id]?.relicId)).length

	/** 유물 기본 효과 + 잠재옵션을 라벨·스코프별로 합산 */
	const aggregatedStats = (() => {
		const stats = RELIC_SETUP_SLOTS.flatMap((slot) => {
			const loadout = loadouts[slot.id]
			if (!loadout?.relicId) {
				return []
			}

			const effects = resolveRelicEffects(loadout.relicId, loadout.stage)
			const potentialStats = resolvePotentialStats(loadout.potentialIds)
			return [...(effects?.stats ?? []), ...potentialStats]
		})

		return aggregateRelicStats(stats)
	})()

	const activeConditions = (() => {
		const set = new Set<string>()
		for (const slot of RELIC_SETUP_SLOTS) {
			const relicId = loadouts[slot.id]?.relicId
			if (!relicId) {
				continue
			}
			const condition = getRelicActivationCondition(relicId)
			if (condition) {
				set.add(condition)
			}
		}
		return [...set]
	})()

	function updateLoadouts(next: RelicConsultingLoadout) {
		onLoadoutsChange?.(next)
	}

	function handleSelectRelic(relic: Relic) {
		if (!editingSlotId || readOnly) {
			return
		}

		const previous = loadouts[editingSlotId]
		const isSameRelic = previous?.relicId === relic.id
		const ownedStage = stageByRelicId?.get(relic.id)
		const stage =
			ownedStage !== undefined
				? clampRelicAwakeningStage(ownedStage)
				: isSameRelic
					? clampRelicAwakeningStage(previous?.stage ?? 0)
					: 0

		updateLoadouts({
			...loadouts,
			[editingSlotId]: {
				relicId: relic.id,
				stage,
				potentialIds: isSameRelic ? clampPotentialIds(previous?.potentialIds ?? [], relic.grade) : []
			}
		})
	}

	function handleClearSlot() {
		if (!editingSlotId || readOnly) {
			return
		}

		updateLoadouts({
			...loadouts,
			[editingSlotId]: { ...EMPTY_LOADOUT }
		})
	}

	function handleStageChange(stage: number) {
		if (!editingSlotId || readOnly || lockStage) {
			return
		}

		const loadout = loadouts[editingSlotId]
		if (!loadout?.relicId) {
			return
		}

		updateLoadouts({
			...loadouts,
			[editingSlotId]: {
				...loadout,
				stage: clampRelicAwakeningStage(stage)
			}
		})
	}

	function handlePotentialChange(potentialIds: readonly string[]) {
		if (!editingSlotId || readOnly) {
			return
		}

		const loadout = loadouts[editingSlotId]
		if (!loadout?.relicId) {
			return
		}

		const relic = getRelicById(loadout.relicId)
		if (!relic) {
			return
		}

		updateLoadouts({
			...loadouts,
			[editingSlotId]: {
				...loadout,
				potentialIds: clampPotentialIds(potentialIds, relic.grade)
			}
		})
	}

	function getSlotView(slotId: string) {
		const loadout = loadouts[slotId] ?? EMPTY_LOADOUT
		const relic = loadout.relicId ? (getRelicById(loadout.relicId) ?? null) : null
		const effects = relic ? resolveRelicEffects(relic.id, loadout.stage) : null
		return { loadout, relic, effects }
	}

	return (
		<div
			className={cn(
				'grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]',
				className
			)}
		>
			<div className="flex flex-col gap-3">
				<div className="flex items-end justify-between gap-2">
					<h2 className="text-grayscale-900 font-semibold">{title}</h2>
					<p className="text-grayscale-600 text-sm tabular-nums">{equippedCount}/4 장착</p>
				</div>

				<div className="grid gap-2 sm:grid-cols-2">
					{RELIC_SETUP_SLOTS.map((slot) => {
						const { id, label } = slot
						const { loadout, relic, effects } = getSlotView(id)
						return (
							<RelicSlot
								key={id}
								label={label}
								relic={relic}
								stage={loadout.stage}
								potentialIds={loadout.potentialIds}
								resolvedEffects={effects}
								isEditing={!readOnly && editingSlotId === id}
								readOnly={readOnly}
								onOpen={readOnly ? undefined : () => setEditingSlotId(id)}
							/>
						)
					})}
				</div>
			</div>

			<aside className="border-grayscale-200 bg-card shadow-soft rounded-xl border p-4 lg:sticky lg:top-24">
				<h2 className="text-grayscale-900 font-semibold">장착 효과 합산</h2>
				<p className="text-grayscale-500 mt-0.5 text-sm">유물 효과 + 잠재옵션 합친 수치</p>

				{aggregatedStats.length > 0 ? (
					<ul className="mt-4 space-y-2">
						{aggregatedStats.map((stat) => {
							const { label, value, unit, scope } = stat
							const rowKey = `${label}::${scope ?? 'always'}::${unit}`
							return (
								<li
									key={rowKey}
									className="border-grayscale-100 flex items-baseline justify-between gap-3 border-b pb-2 last:border-0 last:pb-0"
								>
									<span className="text-grayscale-600 min-w-0 text-sm">
										{label}
										{scope ? <span className="text-grayscale-400 block text-xs">{scope}</span> : null}
									</span>
									<span className="text-grayscale-900 shrink-0 text-sm font-semibold tabular-nums">
										{unit === 'percent' ? `+${value}%` : `+${value}`}
									</span>
								</li>
							)
						})}
					</ul>
				) : (
					<p className="text-grayscale-400 mt-4 text-sm">슬롯에 유물을 장착하면 여기에 합산됩니다.</p>
				)}

				{activeConditions.length > 0 ? (
					<div className="border-grayscale-100 mt-4 border-t pt-3">
						<p className="text-grayscale-500 text-xs font-medium">콘텐츠 발동 조건</p>
						<div className="mt-2 flex flex-wrap gap-1.5">
							{activeConditions.map((condition) => (
								<Badge key={condition} variant="outline" className="text-xs">
									{condition}
								</Badge>
							))}
						</div>
					</div>
				) : null}

				{equippedCount > 0 ? (
					<div className="border-grayscale-100 mt-4 border-t pt-3">
						<p className="text-grayscale-500 text-xs font-medium">유물별 효과</p>
						<ul className="mt-2 space-y-3">
							{RELIC_SETUP_SLOTS.map((slot) => {
								const { loadout, relic, effects } = getSlotView(slot.id)
								if (!relic || !effects) {
									return null
								}

								return (
									<li key={slot.id}>
										<p className="text-grayscale-900 flex items-center gap-1.5 text-xs font-semibold">
											{relic.name}
											<RelicAwakeningStars stage={loadout.stage} />
										</p>
										<ul className="text-grayscale-600 mt-1 list-inside list-disc text-xs">
											{effects.lines.map((line) => (
												<li key={`${slot.id}-${line}`}>{line}</li>
											))}
											{loadout.potentialIds.map((id, index) => {
												const option = getRelicPotentialOptionById(id)
												if (!option) {
													return null
												}
												return <li key={`${slot.id}-potential-${id}-${index}`}>잠재: {option.displayText}</li>
											})}
										</ul>
									</li>
								)
							})}
						</ul>
					</div>
				) : null}
			</aside>

			{!readOnly ? (
				<RelicSlotEditor
					open={editingSlotId !== null}
					onOpenChange={(open) => {
						if (!open) {
							setEditingSlotId(null)
						}
					}}
					slotLabel={editingSlot?.label ?? null}
					relic={editingRelic}
					stage={editingLoadout.stage}
					potentialIds={editingLoadout.potentialIds}
					excludedIds={excludedIds}
					allowedIds={allowedIds}
					lockStage={lockStage}
					onSelect={handleSelectRelic}
					onClear={handleClearSlot}
					onStageChange={handleStageChange}
					onPotentialChange={handlePotentialChange}
				/>
			) : null}
		</div>
	)
}

export default RelicSetupBoard
