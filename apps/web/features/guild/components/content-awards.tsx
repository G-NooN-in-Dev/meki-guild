'use client'

import { Button } from '@shared/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger
} from '@shared/ui/popover'
import { cn } from '@shared/ui/utils'
import { TrophyIcon } from 'lucide-react'

import JobBadge from '@/features/guild/components/job-badge'
import MemberDisplayName from '@/features/guild/components/member-display-name'
import { AWARD_SLOT_BG_CLASS_NAME } from '@/features/guild/lib/content-award-styles'
import {
	type ContentAwardSlot,
	hasAnyContentAwardWinner,
	selectContentAwardSlots
} from '@/features/guild/lib/select-content-award-winners'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { formatDate } from '@/utils/dayjs'

/** 순위 숫자 색 — 1·2·3등 구분 */
const AWARD_RANK_TEXT_CLASS_NAME = {
	1: 'text-pastel-orange-700',
	2: 'text-grayscale-500',
	3: 'text-pastel-orange-800'
} as const

type ContentAwardsProps = {
	comparisons: GuildMemberComparison[]
}

type AwardSlotProps = {
	slot: ContentAwardSlot
}

type AwardSlotLabelProps = {
	label: string
	criteriaDate: string | null
}

/** 부문명 + 최신 수집일(기준일) — 행 왼쪽 고정폭 */
function AwardSlotLabel({ label, criteriaDate }: AwardSlotLabelProps) {
	return (
		<div className="w-22 shrink-0">
			<p className="text-grayscale-700 text-sm font-semibold">{label}</p>
			{criteriaDate ? (
				<p className="text-grayscale-400 text-xs tabular-nums">기준 {formatDate(criteriaDate, 'MM.DD')}</p>
			) : null}
		</div>
	)
}

const awardSlotItemClassName =
	'flex min-w-0 items-start gap-3 rounded-md px-2.5 py-2.5 border border-grayscale-100 shadow-sm hover:scale-[1.02] transition-transform'

/** 시상 한 행: 부문 | 1~3등 이름·직업·성장 점수 */
function AwardSlot({ slot }: AwardSlotProps) {
	const { key, label, criteriaDate } = slot
	const className = cn(awardSlotItemClassName, AWARD_SLOT_BG_CLASS_NAME[key])

	if (slot.status === 'pending') {
		return (
			<li className={className}>
				<AwardSlotLabel label={label} criteriaDate={criteriaDate} />
				<p className="text-grayscale-400 min-w-0 flex-1 self-center truncate text-xs">{slot.pendingReason}</p>
			</li>
		)
	}

	return (
		<li className={className}>
			<AwardSlotLabel label={label} criteriaDate={criteriaDate} />
			<ul className="flex min-w-0 flex-1 flex-col gap-1.5">
				{slot.winners.map((winner) => {
					const { job, name, rank, scoreLabel } = winner
					return (
						<li key={`${slot.key}-${rank}-${name}`} className="flex min-w-0 items-center gap-1.5">
							<span
								className={cn(
									'w-4 shrink-0 text-center text-xs font-bold tabular-nums',
									AWARD_RANK_TEXT_CLASS_NAME[rank as 1 | 2 | 3] ?? 'text-grayscale-500'
								)}
							>
								{rank}
							</span>
							<p className="text-grayscale-900 min-w-0 flex-1 truncate text-sm font-semibold">
								<MemberDisplayName name={name} />
							</p>
							<JobBadge job={job} className="max-w-20 shrink-0 truncate text-[10px]" />
							<p className="text-success-700 shrink-0 text-xs font-semibold tabular-nums sm:text-sm">{scoreLabel}</p>
						</li>
					)
				})}
			</ul>
		</li>
	)
}

/**
 * 주간 성장왕 Popover.
 * 대부분 부문은 성장률(%) 상위 3명, 현상수배는 증가한 단계 수 상위 3명을 보여 줍니다.
 */
function ContentAwards({ comparisons }: ContentAwardsProps) {
	const slots = selectContentAwardSlots(comparisons)
	const hasWinner = hasAnyContentAwardWinner(slots)

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button variant="outline" size="sm" className="text-grayscale-600 shrink-0 gap-1.5" aria-label="주간 성장왕">
						<TrophyIcon className="size-4" />
						<span className="hidden lg:inline">주간 성장왕</span>
					</Button>
				}
			/>
			<PopoverContent align="end" className="w-96 max-w-[calc(100vw-2rem)] gap-3 p-4" collisionPadding={8}>
				<PopoverHeader>
					<PopoverTitle>주간 성장왕</PopoverTitle>
					<PopoverDescription>각 부문에서 성장률 상위 3명을 선정합니다</PopoverDescription>
				</PopoverHeader>

				{!hasWinner ? (
					<p className="text-grayscale-500 py-6 text-center text-sm">
						아직 시상할 컨텐츠가 없습니다. 주간 업데이트가 끝나면 선정됩니다.
					</p>
				) : (
					<ul className="flex flex-col gap-1.5" aria-label="주간 성장왕">
						{slots.map((slot) => (
							<AwardSlot key={slot.key} slot={slot} />
						))}
					</ul>
				)}
			</PopoverContent>
		</Popover>
	)
}

export default ContentAwards
