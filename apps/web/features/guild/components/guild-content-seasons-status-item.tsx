import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/utils'

import {
	DATE_CLASSNAME,
	type GuildContentSeasonSummary,
	SEASON_STATUS_BADGE_CLASS,
	SEASON_STATUS_CARD_CLASS
} from '@/libs/guild-content-seasons.constants'

type SeasonStatusItemProps = {
	summary: GuildContentSeasonSummary
	/** 전달 시 button으로 렌더해 클릭으로 상세 일정을 열 수 있게 합니다. */
	onSelect?: () => void
}

function SeasonStatusItem({ summary, onSelect }: SeasonStatusItemProps) {
	const { contentLabel, status, statusLabel, seasonLabel, dateLabel } = summary
	const className = cn(
		'shadow-soft flex min-w-0 flex-col gap-1.5 rounded-xl border p-3 text-left',
		SEASON_STATUS_CARD_CLASS[status],
		onSelect &&
			'hover:ring-grayscale-300 cursor-pointer transition-shadow hover:ring-2 focus-visible:ring-2 focus-visible:outline-none'
	)

	const body = (
		<>
			<div className="flex items-center justify-between gap-3">
				<div className="flex items-center gap-1">
					<p className="text-grayscale-700 text-sm">{contentLabel}</p>
					{seasonLabel ? <p className="text-grayscale-400 text-xs">({seasonLabel})</p> : null}
				</div>
				<Badge variant="outline" className={cn(SEASON_STATUS_BADGE_CLASS[status])}>
					{statusLabel}
				</Badge>
			</div>
			<p className={cn('text-sm font-semibold tabular-nums', DATE_CLASSNAME[status])}>{dateLabel}</p>
		</>
	)

	if (onSelect) {
		return (
			<button type="button" onClick={onSelect} className={className} aria-label={`${contentLabel} 시즌 일정 보기`}>
				{body}
			</button>
		)
	}

	return <div className={className}>{body}</div>
}

export default SeasonStatusItem
export type { SeasonStatusItemProps }
