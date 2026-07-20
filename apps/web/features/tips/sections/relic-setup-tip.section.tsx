'use client'

import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/utils'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import RelicSlot from '@/features/tips/components/relic-slot'
import RelicSlotEditor from '@/features/tips/components/relic-slot-editor'
import {
	aggregateRelicStats,
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

type SlotLoadouts = Record<string, RelicSlotLoadout>

const EMPTY_LOADOUT: RelicSlotLoadout = { relicId: null, stage: 0, potentialIds: [] }

const INITIAL_LOADOUTS: SlotLoadouts = Object.fromEntries(RELIC_SETUP_SLOTS.map((slot) => [slot.id, EMPTY_LOADOUT]))

/** 동료 세팅과 동일한 구조로 만든 유물 세팅 섹션 */
function RelicSetupTipSection() {
	const [loadouts, setLoadouts] = useState<SlotLoadouts>(INITIAL_LOADOUTS)
	const [editingSlotId, setEditingSlotId] = useState<string | null>(null)

	const editingSlot = editingSlotId ? (RELIC_SETUP_SLOTS.find((slot) => slot.id === editingSlotId) ?? null) : null
	const editingLoadout = editingSlotId ? (loadouts[editingSlotId] ?? EMPTY_LOADOUT) : EMPTY_LOADOUT
	const editingRelic = editingLoadout.relicId ? (getRelicById(editingLoadout.relicId) ?? null) : null

	// 다른 슬롯에 이미 선택된 유물은 중복 장착을 막습니다.
	const excludedIds = useMemo(() => {
		const ids = new Set<string>()
		for (const [slotId, loadout] of Object.entries(loadouts)) {
			if (loadout.relicId && slotId !== editingSlotId) {
				ids.add(loadout.relicId)
			}
		}
		return ids
	}, [loadouts, editingSlotId])

	const equippedCount = useMemo(
		() => RELIC_SETUP_SLOTS.filter((slot) => Boolean(loadouts[slot.id]?.relicId)).length,
		[loadouts]
	)

	/** 유물 기본 효과 + 잠재옵션을 라벨·스코프별로 합산 */
	const aggregatedStats = useMemo(() => {
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
	}, [loadouts])

	const activeConditions = useMemo(() => {
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
	}, [loadouts])

	function handleSelectRelic(relic: Relic) {
		if (!editingSlotId) {
			return
		}

		setLoadouts((current) => {
			const previous = current[editingSlotId]
			const isSameRelic = previous?.relicId === relic.id

			return {
				...current,
				[editingSlotId]: {
					relicId: relic.id,
					// 같은 유물이면 각성·잠재 유지, 다른 유물이면 초기화
					stage: isSameRelic ? (previous?.stage ?? 0) : 0,
					potentialIds: isSameRelic ? clampPotentialIds(previous?.potentialIds ?? [], relic.grade) : []
				}
			}
		})
	}

	function handleClearSlot() {
		if (!editingSlotId) {
			return
		}

		setLoadouts((current) => ({
			...current,
			[editingSlotId]: EMPTY_LOADOUT
		}))
	}

	function handleStageChange(stage: number) {
		if (!editingSlotId) {
			return
		}

		setLoadouts((current) => {
			const loadout = current[editingSlotId]
			if (!loadout?.relicId) {
				return current
			}

			return {
				...current,
				[editingSlotId]: {
					...loadout,
					stage
				}
			}
		})
	}

	function handlePotentialChange(potentialIds: readonly string[]) {
		if (!editingSlotId) {
			return
		}

		setLoadouts((current) => {
			const loadout = current[editingSlotId]
			if (!loadout?.relicId) {
				return current
			}

			const relic = getRelicById(loadout.relicId)
			if (!relic) {
				return current
			}

			return {
				...current,
				[editingSlotId]: {
					...loadout,
					potentialIds: clampPotentialIds(potentialIds, relic.grade)
				}
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
		<section className="flex w-full min-w-0 flex-col gap-4 md:gap-6">
			<div className="flex flex-col gap-3">
				<Link
					href="/tips"
					className={cn(
						'text-grayscale-600 hover:text-grayscale-900 inline-flex w-fit items-center gap-1.5 text-sm font-medium transition-colors'
					)}
				>
					<ArrowLeftIcon className="size-4" />
					정보 / 팁 목록
				</Link>

				<header className="flex flex-col gap-2">
					<Badge variant="secondary" className="w-fit">
						유물
					</Badge>
					<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">유물 세팅</h1>
					<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">
						유물 4개를 장착하고 각성·잠재옵션과 합산 스탯을 확인해보세요.
					</p>
				</header>
			</div>

			<div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
				<div className="flex flex-col gap-3">
					<div className="flex items-end justify-between gap-2">
						<h2 className="text-grayscale-900 font-semibold">세팅 보드</h2>
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
									isEditing={editingSlotId === id}
									onOpen={() => setEditingSlotId(id)}
								/>
							)
						})}
					</div>
				</div>

				{/* 합산 패널 — 동료 세팅과 동일하게 sticky */}
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

					{/* 유물별 원문 효과·잠재 — 합산 아래 참고용 */}
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
											<p className="text-grayscale-900 text-xs font-semibold">
												{relic.name} <span className="text-grayscale-500 font-normal">(각성 {loadout.stage})</span>
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
			</div>

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
				onSelect={handleSelectRelic}
				onClear={handleClearSlot}
				onStageChange={handleStageChange}
				onPotentialChange={handlePotentialChange}
			/>
		</section>
	)
}

export default RelicSetupTipSection
