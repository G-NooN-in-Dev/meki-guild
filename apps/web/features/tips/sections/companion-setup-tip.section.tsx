'use client'

import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/utils'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import CompanionSlot from '@/features/tips/components/companion-slot'
import CompanionSlotEditor from '@/features/tips/components/companion-slot-editor'
import {
	aggregateEquipEffects,
	clampCompanionLevel,
	COMPANION_SETUP_SLOTS,
	getCompanionById,
	resolveEquipEffects
} from '@/features/tips/lib/companion-setup.constants'
import type { Companion, CompanionSlotLoadout } from '@/features/tips/types/companion.type'

type SlotLoadouts = Record<string, CompanionSlotLoadout>

const INITIAL_LOADOUTS: SlotLoadouts = Object.fromEntries(
	COMPANION_SETUP_SLOTS.map((slot) => [slot.id, { companionId: null, level: 1 }])
)

function CompanionSetupTipSection() {
	const [loadouts, setLoadouts] = useState<SlotLoadouts>(INITIAL_LOADOUTS)
	const [editingSlotId, setEditingSlotId] = useState<string | null>(null)

	const editingSlot = editingSlotId ? (COMPANION_SETUP_SLOTS.find((slot) => slot.id === editingSlotId) ?? null) : null
	const editingLoadout = editingSlotId
		? (loadouts[editingSlotId] ?? { companionId: null, level: 1 })
		: { companionId: null, level: 1 }
	const editingCompanion = editingLoadout.companionId ? (getCompanionById(editingLoadout.companionId) ?? null) : null

	/** 다른 슬롯에 이미 있는 동료는 선택 목록에서 제외 */
	const excludedIds = useMemo(() => {
		const ids = new Set<string>()
		for (const [slotId, loadout] of Object.entries(loadouts)) {
			if (loadout.companionId && slotId !== editingSlotId) {
				ids.add(loadout.companionId)
			}
		}
		return ids
	}, [loadouts, editingSlotId])

	/** 장착된 동료들의 효과를 종류별로 합산한 최종 수치 */
	const aggregatedEquipEffects = useMemo(() => {
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
	}, [loadouts])

	const equippedCount = useMemo(
		() => COMPANION_SETUP_SLOTS.filter((slot) => Boolean(loadouts[slot.id]?.companionId)).length,
		[loadouts]
	)

	function handleSelectCompanion(companion: Companion) {
		if (!editingSlotId) {
			return
		}

		setLoadouts((current) => ({
			...current,
			[editingSlotId]: {
				companionId: companion.id,
				level:
					current[editingSlotId]?.companionId === companion.id
						? clampCompanionLevel(companion.grade, current[editingSlotId]?.level ?? 1)
						: 1
			}
		}))
	}

	function handleClearSlot() {
		if (!editingSlotId) {
			return
		}

		setLoadouts((current) => ({
			...current,
			[editingSlotId]: { companionId: null, level: 1 }
		}))
	}

	function handleLevelChange(level: number) {
		if (!editingSlotId) {
			return
		}

		setLoadouts((current) => {
			const loadout = current[editingSlotId]
			if (!loadout?.companionId) {
				return current
			}

			const companion = getCompanionById(loadout.companionId)
			if (!companion) {
				return current
			}

			return {
				...current,
				[editingSlotId]: {
					...loadout,
					level: clampCompanionLevel(companion.grade, level)
				}
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
						동료
					</Badge>
					<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">동료 세팅</h1>
					<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">슬롯을 눌러 동료를 장착해보세요.</p>
				</header>
			</div>

			<div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] xl:grid-cols-[minmax(0,1fr)_20rem]">
				{/* 세팅 보드 */}
				<div className="flex flex-col gap-3">
					<div className="flex items-end justify-between gap-2">
						<h2 className="text-grayscale-900 font-semibold">세팅 보드</h2>
						<p className="text-grayscale-600 text-sm tabular-nums">{equippedCount}/7 장착</p>
					</div>

					<CompanionSlot
						slot={mainSlot}
						companion={mainSlotView.companion}
						level={mainSlotView.loadout.level}
						equipEffects={mainSlotView.equipEffects}
						isEditing={editingSlotId === mainSlot.id}
						onOpen={() => setEditingSlotId(mainSlot.id)}
					/>

					<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
						{subSlots.map((slot) => {
							const { loadout, companion, equipEffects } = getSlotView(slot.id)
							return (
								<CompanionSlot
									key={slot.id}
									slot={slot}
									companion={companion}
									level={loadout.level}
									equipEffects={equipEffects}
									isEditing={editingSlotId === slot.id}
									onOpen={() => setEditingSlotId(slot.id)}
								/>
							)
						})}
					</div>
				</div>

				{/* 합산 패널 — 데스크탑에서 sticky */}
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
			</div>

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
				onSelect={handleSelectCompanion}
				onClear={handleClearSlot}
				onLevelChange={handleLevelChange}
			/>
		</section>
	)
}

export default CompanionSetupTipSection
