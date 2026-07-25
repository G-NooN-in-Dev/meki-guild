'use client'

import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/utils'
import { PlusIcon } from 'lucide-react'

import GradePortrait from '@/features/tips/components/grade-portrait'
import RelicAwakeningStars from '@/features/tips/components/relic-awakening-stars'
import { ITEM_GRADE_SLOT_CLASS, ITEM_GRADE_SLOT_HOVER_CLASS } from '@/features/tips/lib/item-grade.constants'
import { RELIC_GRADE_BADGE_CLASS, RELIC_GRADE_META } from '@/features/tips/lib/relic.constants'
import {
	getRelicPotentialOptionById,
	RELIC_POTENTIAL_GRADE_BADGE_CLASS
} from '@/features/tips/lib/relic-potential.constants'
import type { Relic, RelicResolvedEffects } from '@/features/tips/types/relic.type'

type RelicSlotProps = {
	label: string
	relic: Relic | null
	stage: number
	potentialIds: readonly string[]
	resolvedEffects: RelicResolvedEffects | null
	isEditing?: boolean
	/** 조회 전용 — 버튼이 아닌 div로 렌더합니다 */
	readOnly?: boolean
	onOpen?: () => void
}

/** 세팅 보드에서 쓰는 유물 슬롯 카드 */
function RelicSlot({
	label,
	relic,
	stage,
	potentialIds,
	resolvedEffects,
	isEditing = false,
	readOnly = false,
	onOpen
}: RelicSlotProps) {
	const content = (
		<>
			<div className="flex items-center justify-between gap-2">
				<p className="text-grayscale-500 text-xs font-medium">{label}</p>
				{relic ? <RelicAwakeningStars stage={stage} /> : null}
			</div>

			{relic ? (
				<div className="flex items-start gap-2.5">
					<GradePortrait src={relic.imageSrc} alt={relic.name} grade={relic.grade} size="md" />
					<div className="min-w-0 flex-1 space-y-1">
						<div className="flex flex-wrap items-center gap-1.5">
							<Badge className={RELIC_GRADE_BADGE_CLASS[relic.grade]}>{RELIC_GRADE_META[relic.grade].label}</Badge>
							{/* 좁은 슬롯에서도 유물 이름이 잘리지 않도록 줄바꿈 허용 */}
							<p className="text-grayscale-900 min-w-0 text-sm font-semibold break-keep">{relic.name}</p>
						</div>
						{/* 추천 조합 조회 시 효과 문구가 잘리지 않도록 전체 표시 */}
						<p className="text-grayscale-600 text-xs break-keep md:text-sm">
							{resolvedEffects?.lines[0] ?? '효과 정보가 없습니다.'}
						</p>
						{potentialIds.length > 0 ? (
							<div className="flex flex-wrap gap-1 pt-0.5">
								{potentialIds.map((id, index) => {
									const option = getRelicPotentialOptionById(id)
									if (!option) {
										return null
									}

									return (
										<Badge
											key={`${id}-${index}`}
											className={cn(
												// truncate 대신 줄바꿈 — 잠재옵션 문구가 배지 밖으로 잘리지 않게 합니다.
												'max-w-full text-left text-[10px] leading-snug break-keep whitespace-normal',
												RELIC_POTENTIAL_GRADE_BADGE_CLASS[option.grade]
											)}
										>
											{option.displayText}
										</Badge>
									)
								})}
							</div>
						) : null}
					</div>
				</div>
			) : (
				<div className="text-grayscale-400 flex items-center gap-1.5 py-2 text-sm">
					<PlusIcon className="size-4 shrink-0" />
					<span>{readOnly ? '비어 있음' : '유물 선택'}</span>
				</div>
			)}
		</>
	)

	const { grade } = relic ?? {}
	const frameClassName = cn(
		'border-grayscale-200 bg-card shadow-soft flex w-full flex-col gap-1.5 rounded-xl border p-3 text-left',
		!relic && 'border-dashed',
		// 장착 시 등급 파스텔로 슬롯 전체를 칠해 아이콘 ring만 있을 때보다 구분을 쉽게 합니다.
		grade && ITEM_GRADE_SLOT_CLASS[grade],
		isEditing && 'ring-grayscale-900/20 ring-2'
	)

	if (readOnly || !onOpen) {
		return <div className={frameClassName}>{content}</div>
	}

	return (
		<button
			type="button"
			onClick={onOpen}
			aria-pressed={isEditing}
			className={cn(
				frameClassName,
				'group cursor-pointer transition-colors',
				grade ? ITEM_GRADE_SLOT_HOVER_CLASS[grade] : 'hover:border-grayscale-300 hover:bg-grayscale-50/70',
				'focus-visible:ring-grayscale-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
			)}
		>
			{content}
		</button>
	)
}

export default RelicSlot
