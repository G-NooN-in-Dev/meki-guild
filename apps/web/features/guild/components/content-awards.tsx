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
import MemberPortrait from '@/features/guild/components/member-portrait'
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

type AwardSlotHeaderProps = {
	label: string
	criteriaDate: string | null
}

/** 부문명 + 최신 수집일(기준일) */
function AwardSlotHeader({ label, criteriaDate }: AwardSlotHeaderProps) {
	return (
		<div className="flex flex-col items-center gap-0.5">
			<p className="text-grayscale-700 text-sm font-semibold">{label}</p>
			{criteriaDate ? (
				<p className="text-grayscale-400 text-xs tabular-nums">기준 {formatDate(criteriaDate, 'MM.DD')}</p>
			) : null}
		</div>
	)
}

/** 시상대 한 칸: 부문 → 초상화 → 이름 → 직업 → 성장률 (세로 스택) */
function AwardSlot({ slot }: AwardSlotProps) {
	const { label, criteriaDate } = slot

	if (slot.status === 'pending') {
		return (
			<li className="xs:gap-2 xs:px-1 xs:py-2 flex min-w-0 flex-col items-center gap-1.5 px-0.5 py-1.5 text-center">
				<AwardSlotHeader label={label} criteriaDate={criteriaDate} />
				{/* 모바일 md(64) · xs+ lg(96) — 3열에서도 높이·너비가 맞도록 */}
				<div className="bg-grayscale-50 border-grayscale-200 xs:size-24 size-16 rounded-xl border" aria-hidden />
				<p className="text-grayscale-400 text-[11px] leading-snug">{slot.pendingReason}</p>
			</li>
		)
	}

	const { name, job, percentLabel } = slot.winner

	return (
		<li className="xs:gap-1.5 xs:px-1 xs:py-2 flex min-w-0 flex-col items-center gap-1 px-0.5 py-1.5 text-center">
			<AwardSlotHeader label={label} criteriaDate={criteriaDate} />
			<MemberPortrait name={name} size="lg" className="xs:size-24 size-16" />
			<p className="text-grayscale-900 xs:text-sm w-full truncate text-xs font-semibold">
				<MemberDisplayName name={name} />
			</p>
			<JobBadge job={job} className="max-w-full truncate text-[10px]" />
			<p className="text-success-700 xs:text-sm text-xs font-semibold tabular-nums">{percentLabel}</p>
		</li>
	)
}

/**
 * 컨텐츠별 시상 Popover.
 * 전투력·토벌전·대항전·길드보스·수련장 각각 성장률 1등을 한꺼번에 보여 줍니다.
 */
function ContentAwards({ comparisons }: ContentAwardsProps) {
	const slots = selectContentAwardSlots(comparisons)
	const hasWinner = hasAnyContentAwardWinner(slots)

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant="outline"
						size="sm"
						className="text-grayscale-600 shrink-0 gap-1.5"
						aria-label="컨텐츠별 시상"
					>
						<TrophyIcon className="size-4" />
						<span className="hidden lg:inline">컨텐츠별 시상</span>
					</Button>
				}
			/>
			<PopoverContent align="end" className="w-120 max-w-[calc(100vw-2rem)] gap-3 p-4" collisionPadding={8}>
				<PopoverHeader>
					<PopoverTitle>컨텐츠별 시상</PopoverTitle>
					<PopoverDescription>각 컨텐츠별 성장률 1등 길드원입니다</PopoverDescription>
				</PopoverHeader>

				{!hasWinner ? (
					<p className="text-grayscale-500 py-6 text-center text-sm">
						아직 시상할 컨텐츠가 없습니다. 주간 업데이트가 끝나면 선정됩니다.
					</p>
				) : (
					<ul className="xs:gap-x-2 xs:gap-y-3 grid grid-cols-3 gap-x-1.5 gap-y-2" aria-label="컨텐츠별 시상">
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
