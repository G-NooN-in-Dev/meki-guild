'use client'

import { cn } from '@shared/ui/utils'
import Image from 'next/image'

import GuildMetricChart from '@/features/guild/components/guild-metric-chart'
import JobBadge from '@/features/guild/components/job-badge'
import MemberDisplayName from '@/features/guild/components/member-display-name'
import type { GuildJobClassLineCardData } from '@/features/guild/types/guild-job-distribution.type'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { getJobPortraitSrc } from '@/libs/job-portrait.constants'

type GuildJobClassCardProps = {
	card: GuildJobClassLineCardData
}

function MemberJobPortrait({ job }: { job: string }) {
	const src = getJobPortraitSrc(job)

	if (!src) {
		return (
			<span
				aria-hidden
				className="bg-grayscale-100/80 border-grayscale-200 inline-block size-10 shrink-0 rounded-lg border"
			/>
		)
	}

	return (
		<Image
			src={src}
			alt={`${job} 초상화`}
			width={80}
			height={80}
			draggable={false}
			className="bg-grayscale-50/80 border-grayscale-200 size-10 shrink-0 rounded-lg border object-contain"
		/>
	)
}

function JobClassMemberRow({ comparison }: { comparison: GuildMemberComparison }) {
	const { name, job, previousJob, jobChanged, level, combatPower } = comparison
	const showJobChange = jobChanged && Boolean(previousJob)

	return (
		<li className="bg-card/70 flex min-w-0 items-center gap-2.5 rounded-lg px-2 py-1.5">
			<MemberJobPortrait job={job} />
			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<div className="flex min-w-0 flex-wrap items-center gap-1.5">
					<p className="text-grayscale-900 truncate text-sm font-semibold">
						<MemberDisplayName name={name} />
					</p>
					{showJobChange && previousJob ? (
						<span className="inline-flex min-w-0 flex-wrap items-center gap-1">
							<JobBadge job={previousJob} className="text-[10px] opacity-70" />
							<span className="text-grayscale-400 text-[10px]" aria-hidden>
								→
							</span>
							<JobBadge job={job} className="text-[10px]" />
						</span>
					) : (
						<JobBadge job={job} className="text-[10px]" />
					)}
				</div>
				<p className="text-grayscale-600 flex flex-wrap items-baseline gap-x-2 text-xs tabular-nums">
					<span>Lv.{level.currentLabel}</span>
					<span>{combatPower.currentLabel}</span>
				</p>
			</div>
		</li>
	)
}

/**
 * 직업군 Card.
 * 고정 크기 · 내부 세로 스크롤. 상단 직업별 인원 추이 + 하단 길드원 목록.
 */
function GuildJobClassCard({ card }: GuildJobClassCardProps) {
	const { classLine, backgroundClass, series, members } = card

	return (
		<article
			className={cn(
				'flex h-140 w-80 shrink-0 flex-col overflow-hidden rounded-xl border border-black/5 shadow-xs',
				backgroundClass
			)}
		>
			<header className="flex shrink-0 items-center justify-between gap-2 px-4 pt-3 pb-1">
				<h3 className="text-grayscale-900 text-base font-semibold">{classLine}</h3>
				<span className="text-grayscale-600 text-xs tabular-nums">{members.length}명</span>
			</header>

			<div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
				<div className="bg-card/60 mb-3 rounded-lg p-2">
					<GuildMetricChart seriesList={series} />
				</div>

				{members.length > 0 ? (
					<ul className="flex flex-col gap-1.5">
						{members.map((comparison) => (
							<JobClassMemberRow key={comparison.name} comparison={comparison} />
						))}
					</ul>
				) : (
					<p className="text-grayscale-500 py-6 text-center text-sm">해당 직업군 길드원이 없습니다</p>
				)}
			</div>
		</article>
	)
}

export default GuildJobClassCard
