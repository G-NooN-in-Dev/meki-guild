'use client'

import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/utils'
import { PlusIcon } from 'lucide-react'

import CompanionPortrait from '@/features/tips/components/companion-portrait'
import { COMPANION_GRADE_BADGE_CLASS, COMPANION_GRADE_META } from '@/features/tips/lib/companion-setup.constants'
import type { Companion, CompanionEquipEffect, CompanionSetupSlot } from '@/features/tips/types/companion.type'

type CompanionSlotProps = {
	slot: CompanionSetupSlot
	companion: Companion | null
	level: number
	equipEffects: readonly CompanionEquipEffect[]
	/** Sheet에서 이 슬롯을 편집 중일 때 강조 */
	isEditing?: boolean
	onOpen: () => void
}

/** 세팅 보드용 슬롯 카드. 클릭하면 Sheet에서 동료·레벨을 편집합니다. */
function CompanionSlot({ slot, companion, level, equipEffects, isEditing = false, onOpen }: CompanionSlotProps) {
	const isMain = slot.role === 'main'
	const gradeMeta = companion ? COMPANION_GRADE_META[companion.grade] : null
	const primaryEffect = equipEffects[0]

	return (
		<button
			type="button"
			onClick={onOpen}
			aria-pressed={isEditing}
			className={cn(
				'group border-grayscale-200 bg-card shadow-soft flex w-full cursor-pointer flex-col gap-1.5 rounded-xl border p-3 text-left transition-colors',
				'hover:border-grayscale-300 hover:bg-grayscale-50/70',
				'focus-visible:ring-grayscale-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
				'[&_img]:cursor-pointer',
				!companion && 'border-dashed',
				isEditing && 'border-grayscale-900 bg-grayscale-50 ring-grayscale-900/10 ring-1',
				isMain && 'md:p-4'
			)}
		>
			<div className="flex items-center justify-between gap-2">
				<p className="text-grayscale-500 text-xs font-medium">{slot.label}</p>
				{companion ? <span className="text-grayscale-400 text-xs tabular-nums">Lv.{level}</span> : null}
			</div>

			{companion && gradeMeta && primaryEffect ? (
				<div className="flex items-start gap-2.5">
					<CompanionPortrait
						src={companion.imageSrc}
						alt={companion.name}
						grade={companion.grade}
						size={isMain ? 'lg' : 'md'}
					/>
					<div className="min-w-0 flex-1 space-y-1">
						<div className="flex flex-wrap items-center gap-1.5">
							<Badge className={COMPANION_GRADE_BADGE_CLASS[companion.grade]}>{gradeMeta.label}</Badge>
							<p className="text-grayscale-900 text-sm font-semibold">{companion.name}</p>
						</div>
						<p className="text-grayscale-600 truncate text-xs md:text-sm">{primaryEffect.displayText}</p>
					</div>
				</div>
			) : (
				<div className="text-grayscale-400 flex items-center gap-1.5 py-2 text-sm">
					<PlusIcon className="size-4 shrink-0" />
					<span>동료 선택</span>
				</div>
			)}
		</button>
	)
}

export default CompanionSlot
