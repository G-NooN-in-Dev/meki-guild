'use client'

import { Button } from '@shared/ui/button'
import { cn } from '@shared/ui/lib/utils'
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
	getWeeklyGrowthSelectionStatus,
	selectWeeklyGrowthLeaders,
	type WeeklyGrowthLeader
} from '@/features/guild/lib/select-weekly-growth-leaders'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { formatGuildContentDate } from '@/libs/guild-content-dates.constants'

type WeeklyGrowthLeadersProps = {
	comparisons: GuildMemberComparison[]
}

/** 포디움 단상 높이·메달 톤 (1등 가운데가 가장 높음) */
const PODIUM_STYLES = {
	1: {
		order: 'order-2',
		barHeight: 'h-16',
		medalClass: 'bg-pastel-yellow-200 text-pastel-yellow-900 ring-pastel-yellow-400',
		barClass: 'bg-pastel-yellow-100 border-pastel-yellow-300'
	},
	2: {
		order: 'order-1',
		barHeight: 'h-11',
		medalClass: 'bg-grayscale-100 text-grayscale-700 ring-grayscale-300',
		barClass: 'bg-grayscale-50 border-grayscale-200'
	},
	3: {
		order: 'order-3',
		barHeight: 'h-8',
		medalClass: 'bg-pastel-orange-100 text-pastel-orange-800 ring-pastel-orange-300',
		barClass: 'bg-pastel-orange-50 border-pastel-orange-200'
	}
} as const

type PodiumSlotProps = {
	leader: WeeklyGrowthLeader
}

/** 포디움 한 칸: 메달 → 닉네임 → 평균 성장률 → 단상 */
function PodiumSlot({ leader }: PodiumSlotProps) {
	const { rank, name, job, scoreLabel } = leader
	const { order, barHeight, medalClass, barClass } = PODIUM_STYLES[rank]

	return (
		<div className={cn('flex min-w-0 flex-1 flex-col items-center gap-1.5', order)} role="listitem">
			<div
				className={cn('flex size-8 items-center justify-center rounded-full text-sm font-bold ring-2', medalClass)}
				aria-hidden
			>
				{rank}
			</div>
			<p className="text-grayscale-900 w-full truncate text-center text-xs font-semibold">
				<MemberDisplayName name={name} />
			</p>
			<JobBadge job={job} className="max-w-full truncate text-[10px]" />
			<p className="text-success-700 text-xs font-semibold tabular-nums">{scoreLabel}</p>
			<div
				className={cn('border-grayscale-200 w-full rounded-t-md border border-b-0', barHeight, barClass)}
				aria-hidden
			/>
		</div>
	)
}

type LeaderDetailProps = {
	leader: WeeklyGrowthLeader
}

/** 포디움 아래: 지표별 성장률 목록 */
function LeaderDetail({ leader }: LeaderDetailProps) {
	const { rank, name, metrics } = leader

	return (
		<div className="border-grayscale-100 border-t pt-2 first:border-t-0 first:pt-0">
			<p className="text-grayscale-900 mb-1 text-xs font-semibold">
				<span className="text-grayscale-500 mr-1.5">{rank}등</span>
				<MemberDisplayName name={name} />
			</p>
			<ul className="flex flex-col gap-0.5">
				{metrics.map((metric) => (
					<li key={metric.key} className="text-grayscale-600 flex items-center justify-between gap-2 text-xs">
						<span>{metric.label}</span>
						<span className="font-medium tabular-nums">{metric.percentLabel}</span>
					</li>
				))}
			</ul>
		</div>
	)
}

type PendingStateProps = {
	pendingLabels: string[]
}

/** 주간 필수 컨텐츠가 아직 다 안 모였을 때 안내 */
function PendingState({ pendingLabels }: PendingStateProps) {
	return (
		<div className="text-grayscale-600 flex flex-col gap-2 py-4 text-sm">
			<p>전투력 · 토벌전 · 대항전이 모두 업데이트된 뒤 선정됩니다.</p>
			{pendingLabels.length > 0 ? (
				<p className="text-grayscale-500 text-xs">대기 중: {pendingLabels.join(', ')}</p>
			) : null}
		</div>
	)
}

/**
 * 금주의 길드원 Popover.
 * 주간 필수 컨텐츠가 모두 갱신된 뒤, 성장률 평균 상위 3명을 포디움으로 보여 줍니다.
 */
function WeeklyGrowthLeaders({ comparisons }: WeeklyGrowthLeadersProps) {
	const status = getWeeklyGrowthSelectionStatus()
	const leaders = selectWeeklyGrowthLeaders(comparisons)

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant="outline"
						size="sm"
						className="text-grayscale-600 shrink-0 gap-1.5"
						aria-label="금주의 길드원"
					>
						<TrophyIcon className="size-4" />
						<span className="hidden md:inline">금주의 길드원</span>
					</Button>
				}
			/>
			<PopoverContent align="end" className="w-88 gap-3 p-3">
				<PopoverHeader>
					<div className="flex items-baseline justify-between gap-2">
						<PopoverTitle>금주의 길드원</PopoverTitle>
						{status.ready ? (
							<p className="text-grayscale-500 shrink-0 text-xs tabular-nums">
								선정일 {formatGuildContentDate(status.selectedAt)}
							</p>
						) : null}
					</div>
					<PopoverDescription>
						{status.ready ? '금주 성장률이 가장 높은 길드원입니다' : '주간 컨텐츠 업데이트가 모두 끝나면 선정됩니다'}
					</PopoverDescription>
				</PopoverHeader>

				{!status.ready ? (
					<PendingState pendingLabels={status.pendingLabels} />
				) : leaders.length === 0 ? (
					<p className="text-grayscale-500 py-6 text-center text-sm">선정할 수 있는 길드원이 없습니다.</p>
				) : (
					<>
						{/* 포디움: flex order로 시각 순서는 2 · 1 · 3 */}
						<div className="flex items-end gap-2 px-1 pt-1" role="list" aria-label="금주의 길드원 포디움">
							{leaders.map((leader) => (
								<PodiumSlot key={leader.name} leader={leader} />
							))}
						</div>

						<div className="flex flex-col gap-2">
							{leaders.map((leader) => (
								<LeaderDetail key={leader.name} leader={leader} />
							))}
						</div>
					</>
				)}
			</PopoverContent>
		</Popover>
	)
}

export default WeeklyGrowthLeaders
