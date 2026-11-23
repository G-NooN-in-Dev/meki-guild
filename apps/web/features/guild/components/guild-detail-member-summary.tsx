'use client'

import { cn } from '@shared/ui/utils'
import Image from 'next/image'

import GrowthDelta, { MemberStatusBadge } from '@/features/guild/components/growth-delta'
import JobBadge from '@/features/guild/components/job-badge'
import MemberDisplayName from '@/features/guild/components/member-display-name'
import { getDetailSectionMetricDisplay } from '@/features/guild/lib/detail-section-sort'
import type { GuildRosterSectionId } from '@/features/guild/types/guild-dashboard.type'
import { GUILD_EMPTY_VALUE_LABEL, type GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { getJobPortraitSrc } from '@/libs/job-portrait.constants'

type GuildDetailMemberSummaryProps = {
	comparison: GuildMemberComparison
	sectionId: GuildRosterSectionId
	/** ON이면 증감량 대신 증감율(%) 표시. % 없으면 증감량 유지 */
	sortByPercent?: boolean
	className?: string
}

function MemberJobPortrait({ job }: { job: string }) {
	const src = getJobPortraitSrc(job)

	if (!src) {
		return (
			<span
				aria-hidden
				className="bg-grayscale-100 border-grayscale-200 inline-block size-11 shrink-0 rounded-lg border"
			/>
		)
	}

	return (
		<Image
			src={src}
			alt={`${job} 초상화`}
			width={112}
			height={112}
			draggable={false}
			className="bg-grayscale-50 border-grayscale-200 size-11 shrink-0 rounded-lg border object-contain"
		/>
	)
}

/**
 * 로스터 카드·Collapsible 접힘 헤더 공통 요약.
 * 전투력·레벨: 레벨·전투력 / 그 외: 항목 최신 수치 + 증감(율)
 */
function GuildDetailMemberSummary({
	comparison,
	sectionId,
	sortByPercent = false,
	className
}: GuildDetailMemberSummaryProps) {
	const { name, job, level, combatPower, status } = comparison
	const metric = getDetailSectionMetricDisplay(comparison, sectionId)
	const showMetricChange = status !== 'left'
	const hasPercent = Boolean(metric.changePercentLabel)
	const isOverview = sectionId === 'overview'

	const changeNode = showMetricChange ? (
		sortByPercent && hasPercent ? (
			<GrowthDelta value={null} percentLabel={metric.changePercentLabel} hideValue className="text-xs" />
		) : (
			<GrowthDelta value={metric.changeDeltaLabel} className="text-xs" />
		)
	) : null

	return (
		<div className={cn('flex min-w-0 items-center gap-3', className)}>
			<MemberJobPortrait job={job} />
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<div className="flex min-w-0 flex-wrap items-center gap-1.5">
					<p className="text-grayscale-900 truncate text-sm font-semibold">
						<MemberDisplayName name={name} />
					</p>
					<MemberStatusBadge status={status} />
					<JobBadge job={job} className="text-[10px]" />
				</div>
				<p className="text-grayscale-500 flex flex-wrap items-baseline gap-x-2 text-xs tabular-nums">
					{isOverview ? (
						<>
							<span>Lv.{level.currentLabel}</span>
							<span>{combatPower.currentLabel}</span>
						</>
					) : (
						<span
							className={
								metric.valueLabel === GUILD_EMPTY_VALUE_LABEL ? 'text-grayscale-400' : 'text-grayscale-700 font-medium'
							}
						>
							{metric.valueLabel}
						</span>
					)}
					{changeNode}
				</p>
			</div>
		</div>
	)
}

export default GuildDetailMemberSummary
