'use client'

import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/utils'
import { PlusIcon } from 'lucide-react'

import GradePortrait from '@/features/tips/components/grade-portrait'
import { COMPANION_GRADE_BADGE_CLASS, COMPANION_GRADE_META } from '@/features/tips/lib/companion-setup.constants'
import { ITEM_GRADE_SLOT_CLASS, ITEM_GRADE_SLOT_HOVER_CLASS } from '@/features/tips/lib/item-grade.constants'
import type { Companion, CompanionEquipEffect, CompanionSetupSlot } from '@/features/tips/types/companion.type'

type CompanionSlotProps = {
	slot: CompanionSetupSlot
	companion: Companion | null
	level: number
	equipEffects: readonly CompanionEquipEffect[]
	/** Sheet에서 이 슬롯을 편집 중일 때 강조 */
	isEditing?: boolean
	/** true면 클릭 불가 (조회 전용) */
	readOnly?: boolean
	onOpen?: () => void
}

/** 세팅 보드용 슬롯 카드. 클릭하면 Sheet에서 동료·레벨을 편집합니다. */
function CompanionSlot({
	slot,
	companion,
	level,
	equipEffects,
	isEditing = false,
	readOnly = false,
	onOpen
}: CompanionSlotProps) {
	const isMain = slot.role === 'main'
	const gradeMeta = companion ? COMPANION_GRADE_META[companion.grade] : null
	const primaryEffect = equipEffects[0]
	const grade = companion?.grade
	const shellClassName = cn(
		'group border-grayscale-200 bg-card shadow-soft flex w-full flex-col gap-1.5 rounded-xl border p-3 text-left',
		!companion && 'border-dashed',
		// 장착 시 등급 파스텔로 슬롯 전체를 칠해 아이콘 ring만 있을 때보다 구분을 쉽게 합니다.
		grade && ITEM_GRADE_SLOT_CLASS[grade],
		isEditing && 'ring-grayscale-900/20 ring-2',
		isMain && 'md:p-4',
		!readOnly &&
			cn(
				'cursor-pointer transition-colors',
				grade ? ITEM_GRADE_SLOT_HOVER_CLASS[grade] : 'hover:border-grayscale-300 hover:bg-grayscale-50/70',
				'focus-visible:ring-grayscale-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
				'[&_img]:cursor-pointer'
			)
	)

	const body = (
		<>
			<div className="flex items-center justify-between gap-2">
				<p className="text-grayscale-500 text-xs font-medium">{slot.label}</p>
				{companion ? <span className="text-grayscale-400 text-xs tabular-nums">Lv.{level}</span> : null}
			</div>

			{companion && gradeMeta && primaryEffect ? (
				<div className="flex items-start gap-2.5">
					<GradePortrait
						src={companion.imageSrc}
						alt={companion.name}
						grade={companion.grade}
						size={isMain ? 'lg' : 'md'}
					/>
					<div className="min-w-0 flex-1 space-y-1">
						<div className="flex flex-wrap items-center gap-1.5">
							<Badge className={COMPANION_GRADE_BADGE_CLASS[companion.grade]}>{gradeMeta.label}</Badge>
							{/* 좁은 2열 슬롯에서도 이름이 잘리지 않도록 줄바꿈 허용 */}
							<p className="text-grayscale-900 min-w-0 text-sm font-semibold break-keep">{companion.name}</p>
						</div>
						<p className="text-grayscale-600 text-xs break-keep md:text-sm">{primaryEffect.displayText}</p>
					</div>
				</div>
			) : (
				<div className="text-grayscale-400 flex items-center gap-1.5 py-2 text-sm">
					{!readOnly ? <PlusIcon className="size-4 shrink-0" /> : null}
					<span>{readOnly ? '비어 있음' : '동료 선택'}</span>
				</div>
			)}
		</>
	)

	if (readOnly) {
		return <div className={shellClassName}>{body}</div>
	}

	return (
		<button type="button" onClick={onOpen} aria-pressed={isEditing} className={shellClassName}>
			{body}
		</button>
	)
}

export default CompanionSlot
