'use client'

import { cn } from '@shared/ui/utils'
import { useState } from 'react'

import CompanionSlot from '@/features/tips/components/companion/companion-slot'
import CompanionSlotEditor from '@/features/tips/components/companion/companion-slot-editor'
import {
	aggregateEquipEffects,
	clampCompanionLevel,
	COMPANION_SETUP_SLOTS,
	getCompanionById,
	resolveEquipEffects
} from '@/features/tips/lib/companion-setup.constants'
import type { Companion, CompanionLoadout } from '@/features/tips/types/companion.type'

type CompanionSetupBoardProps = {
	loadouts: CompanionLoadout
	onLoadoutsChange?: (loadouts: CompanionLoadout) => void
	/** 보유 동료만 선택. 없으면 전체 */
	allowedIds?: ReadonlySet<string> | null
	/** 슬롯 레벨을 보유 레벨에 맞춤 — 선택 시 레벨 고정 */
	levelByCompanionId?: ReadonlyMap<string, number> | null
	readOnly?: boolean
	/** 보드 제목 */
	title?: string
	className?: string
}

/**
 * 메인+서브 세팅 보드 + (편집 시) Sheet.
 */
function CompanionSetupBoard({
	loadouts,
	onLoadoutsChange,
	allowedIds = null,
	levelByCompanionId = null,
	readOnly = false,
	title = '세팅 보드',
	className
}: CompanionSetupBoardProps) {
	const [editingSlotId, setEditingSlotId] = useState<string | null>(null)
	const lockLevel = Boolean(levelByCompanionId)

	const editingSlot = editingSlotId ? (COMPANION_SETUP_SLOTS.find((slot) => slot.id === editingSlotId) ?? null) : null
	const editingLoadout = editingSlotId
		? (loadouts[editingSlotId] ?? { companionId: null, level: 1 })
		: { companionId: null, level: 1 }
	const editingCompanion = editingLoadout.companionId ? (getCompanionById(editingLoadout.companionId) ?? null) : null

	const excludedIds = (() => {
		const ids = new Set<string>()
		for (const [slotId, loadout] of Object.entries(loadouts)) {
			if (loadout.companionId && slotId !== editingSlotId) {
				ids.add(loadout.companionId)
			}
		}
		return ids
	})()

	const aggregatedEquipEffects = (() => {
		const effects = COMPANION_SETUP_SLOTS.flatMap((slot) => {
			const loadout = loadouts[slot.id]
			if (!loadout?.companionId) {
				return []
			}

			const companion = getCompanionById(loadout.companionId)
			if (!companion) {
				return []
			}

			return [...resolveEquipEffects(companion.job, companion.grade, loadout.level)]
		})

		return aggregateEquipEffects(effects)
	})()

	const equippedCount = COMPANION_SETUP_SLOTS.filter((slot) => Boolean(loadouts[slot.id]?.companionId)).length

	function updateLoadouts(next: CompanionLoadout) {
		onLoadoutsChange?.(next)
	}

	function handleSelectCompanion(companion: Companion) {
		if (!editingSlotId || readOnly) {
			return
		}

		const ownedLevel = levelByCompanionId?.get(companion.id)
		const level =
			ownedLevel !== undefined
				? clampCompanionLevel(companion.grade, ownedLevel)
				: loadouts[editingSlotId]?.companionId === companion.id
					? clampCompanionLevel(companion.grade, loadouts[editingSlotId]?.level ?? 1)
					: 1

		updateLoadouts({
			...loadouts,
			[editingSlotId]: { companionId: companion.id, level }
		})
	}

	function handleClearSlot() {
		if (!editingSlotId || readOnly) {
			return
		}

		updateLoadouts({
			...loadouts,
			[editingSlotId]: { companionId: null, level: 1 }
		})
	}

	function handleLevelChange(level: number) {
		if (!editingSlotId || readOnly || lockLevel) {
			return
		}

		const loadout = loadouts[editingSlotId]
		if (!loadout?.companionId) {
			return
		}

		const companion = getCompanionById(loadout.companionId)
		if (!companion) {
			return
		}

		updateLoadouts({
			...loadouts,
			[editingSlotId]: {
				...loadout,
				level: clampCompanionLevel(companion.grade, level)
			}
		})
	}

	function getSlotView(slotId: string) {
		const loadout = loadouts[slotId] ?? { companionId: null, level: 1 }
		const companion = loadout.companionId ? (getCompanionById(loadout.companionId) ?? null) : null
		const equipEffects = companion ? resolveEquipEffects(companion.job, companion.grade, loadout.level) : []

		return { loadout, companion, equipEffects }
	}

	const mainSlot = COMPANION_SETUP_SLOTS[0]
	const subSlots = COMPANION_SETUP_SLOTS.slice(1)
	const mainSlotView = getSlotView(mainSlot.id)

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
					<p className="text-grayscale-600 text-sm tabular-nums">{equippedCount}/7 장착</p>
				</div>

				<CompanionSlot
					slot={mainSlot}
					companion={mainSlotView.companion}
					level={mainSlotView.loadout.level}
					equipEffects={mainSlotView.equipEffects}
					isEditing={!readOnly && editingSlotId === mainSlot.id}
					readOnly={readOnly}
					onOpen={readOnly ? undefined : () => setEditingSlotId(mainSlot.id)}
				/>

				{/* 매우 좁은 화면은 1열(효과 문구 가독성), xxs부터 2열, lg에서 3열 */}
				<div className="xxs:grid-cols-2 grid grid-cols-1 gap-2 lg:grid-cols-3">
					{subSlots.map((slot) => {
						const { loadout, companion, equipEffects } = getSlotView(slot.id)
						return (
							<CompanionSlot
								key={slot.id}
								slot={slot}
								companion={companion}
								level={loadout.level}
								equipEffects={equipEffects}
								isEditing={!readOnly && editingSlotId === slot.id}
								readOnly={readOnly}
								onOpen={readOnly ? undefined : () => setEditingSlotId(slot.id)}
							/>
						)
					})}
				</div>
			</div>

			<aside className="border-grayscale-200 bg-card shadow-soft rounded-xl border p-4 lg:sticky lg:top-24">
				<h2 className="text-grayscale-900 font-semibold">장착 효과 합산</h2>
				<p className="text-grayscale-500 mt-0.5 text-sm">종류별 최종 수치</p>
				{aggregatedEquipEffects.length > 0 ? (
					<ul className="mt-4 space-y-2">
						{aggregatedEquipEffects.map((effect) => (
							<li
								key={effect.label}
								className="border-grayscale-100 flex items-baseline justify-between gap-3 border-b pb-2 last:border-0 last:pb-0"
							>
								<span className="text-grayscale-600 text-sm">{effect.label}</span>
								<span className="text-grayscale-900 text-sm font-semibold tabular-nums">
									{effect.unit === 'percent' ? `+${effect.value}%` : `+${effect.value}`}
								</span>
							</li>
						))}
					</ul>
				) : (
					<p className="text-grayscale-400 mt-4 text-sm">슬롯에 동료를 장착하면 여기에 합산됩니다.</p>
				)}
			</aside>

			{!readOnly ? (
				<CompanionSlotEditor
					open={editingSlotId !== null}
					onOpenChange={(open) => {
						if (!open) {
							setEditingSlotId(null)
						}
					}}
					slot={editingSlot}
					companion={editingCompanion}
					level={editingLoadout.level}
					excludedIds={excludedIds}
					allowedIds={allowedIds}
					lockLevel={lockLevel}
					onSelect={handleSelectCompanion}
					onClear={handleClearSlot}
					onLevelChange={handleLevelChange}
				/>
			) : null}
		</div>
	)
}

export default CompanionSetupBoard
