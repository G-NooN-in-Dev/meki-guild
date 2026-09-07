import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/lib/utils'

import {
	DATE_CLASSNAME,
	getGuildContentSeasonSummaries,
	type GuildContentSeasonSummary,
	SEASON_STATUS_BADGE_CLASS,
	SEASON_STATUS_CARD_CLASS
} from '@/libs/guild-content-seasons.constants'

type SeasonStatusItemProps = {
	summary: GuildContentSeasonSummary
}

function SeasonStatusItem({ summary }: SeasonStatusItemProps) {
	const { contentLabel, status, statusLabel, seasonLabel, dateLabel } = summary

	return (
		<div
			className={cn(
				'shadow-soft flex min-w-0 flex-col gap-1.5 rounded-xl border p-3',
				SEASON_STATUS_CARD_CLASS[status]
			)}
		>
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-1">
					<p className="text-grayscale-500 text-sm">{contentLabel}</p>
					{seasonLabel ? <p className="text-grayscale-400 text-xs">({seasonLabel})</p> : null}
				</div>
				<Badge variant="outline" className={cn(SEASON_STATUS_BADGE_CLASS[status])}>
					{statusLabel}
				</Badge>
			</div>
			<p className={cn('text-sm font-semibold tabular-nums', DATE_CLASSNAME[status])}>{dateLabel}</p>
		</div>
	)
}

/** 대항전·수련장·길드보스 현재 시즌 상태 요약 */
function GuildContentSeasonsStatus() {
	const summaries = getGuildContentSeasonSummaries()

	return (
		<div className="grid gap-3 md:grid-cols-3">
			{summaries.map((summary) => (
				<SeasonStatusItem key={summary.content} summary={summary} />
			))}
		</div>
	)
}

export default GuildContentSeasonsStatus
