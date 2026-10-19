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
import { TrophyIcon } from 'lucide-react'

import JobBadge from '@/features/guild/components/job-badge'
import MemberDisplayName from '@/features/guild/components/member-display-name'
import {
	type ContentAwardSlot,
	hasAnyContentAwardWinner,
	selectContentAwardSlots
} from '@/features/guild/lib/select-content-award-winners'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { formatDate } from '@/utils/dayjs'

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

/** 시상 한 행: 부문 | 이름·직업 | 성장률 */
function AwardSlot({ slot }: AwardSlotProps) {
	const { label, criteriaDate } = slot

	if (slot.status === 'pending') {
		return (
			<li className="flex min-w-0 items-center gap-3 py-2.5">
				<AwardSlotLabel label={label} criteriaDate={criteriaDate} />
				<p className="text-grayscale-400 min-w-0 flex-1 truncate text-xs">{slot.pendingReason}</p>
			</li>
		)
	}

	const { name, job, percentLabel } = slot.winner

	return (
		<li className="flex min-w-0 items-center gap-3 py-2.5">
			<AwardSlotLabel label={label} criteriaDate={criteriaDate} />
			<div className="flex min-w-0 flex-1 items-center gap-1.5">
				<p className="text-grayscale-900 truncate text-sm font-semibold">
					<MemberDisplayName name={name} />
				</p>
				<JobBadge job={job} className="max-w-24 shrink-0 truncate text-[10px]" />
			</div>
			<p className="text-success-700 shrink-0 text-sm font-semibold tabular-nums">{percentLabel}</p>
		</li>
	)
}

/**
 * 주간 성장왕 Popover.
 * 전투력·토벌전·대항전·길드보스·수련장 각각 성장률 1등을 한꺼번에 보여 줍니다.
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
					<PopoverDescription>각 부문에서 가장 높은 성장을 달성한 길드원입니다</PopoverDescription>
				</PopoverHeader>

				{!hasWinner ? (
					<p className="text-grayscale-500 py-6 text-center text-sm">
						아직 시상할 컨텐츠가 없습니다. 주간 업데이트가 끝나면 선정됩니다.
					</p>
				) : (
					<ul className="divide-grayscale-100 divide-y" aria-label="주간 성장왕">
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
