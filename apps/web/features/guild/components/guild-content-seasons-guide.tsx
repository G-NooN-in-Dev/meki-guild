'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'
import { cn } from '@shared/ui/utils'
import { CalendarRangeIcon } from 'lucide-react'

import {
	formatSeasonRange,
	getContentSeasonSummary,
	getGuildContentSeasonSummaries,
	getSeasonsByContent,
	getSeasonStatus,
	GUILD_CONTENT_SEASON_STATUS_LABEL,
	GUILD_SEASONAL_CONTENT_META,
	GUILD_SEASONAL_CONTENT_ORDER,
	type GuildContentSeason,
	type GuildSeasonalContentKey,
	SEASON_STATUS_BADGE_CLASS,
	SEASON_STATUS_CARD_CLASS
} from '@/libs/guild-content-seasons.constants'
import dayjs, { type Dayjs } from '@/utils/dayjs'

function SeasonScheduleTable({ seasons, now }: { seasons: readonly GuildContentSeason[]; now: Dayjs }) {
	if (seasons.length === 0) {
		return (
			<p className="text-grayscale-500 px-3 py-8 text-center text-sm">
				등록된 시즌이 없습니다. 현재는 시즌 종료 상태입니다.
			</p>
		)
	}

	const hasActiveSeason = seasons.some((season) => getSeasonStatus(season, now) === 'active')
	// 예정 강조는 진행 중이 없고(종료→예정), 가장 가까운 시즌 1개만
	const nearestUpcomingLabel = hasActiveSeason
		? undefined
		: seasons.find((season) => getSeasonStatus(season, now) === 'upcoming')?.label

	return (
		<Table containerClassName="overflow-visible">
			<TableHeader sticky className="[&>tr>th]:bg-grayscale-100">
				<TableRow className="border-grayscale-200 bg-grayscale-100 hover:bg-grayscale-100">
					<TableHead className="text-grayscale-600 h-11 px-3 text-xs font-semibold tracking-wide">시즌</TableHead>
					<TableHead className="text-grayscale-600 h-11 px-3 text-xs font-semibold tracking-wide">기간</TableHead>
					<TableHead className="text-grayscale-600 h-11 px-3 text-center text-xs font-semibold tracking-wide">
						상태
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{seasons.map((season) => {
					const status = getSeasonStatus(season, now)
					const isDimmed = status === 'ended'

					const { content, endsAt, label, startsAt } = season

					const showCardClass =
						status === 'active' || status === 'ended' || (status === 'upcoming' && label === nearestUpcomingLabel)

					return (
						<TableRow
							key={`${content}-${label}`}
							className={cn('border-grayscale-100', showCardClass && SEASON_STATUS_CARD_CLASS[status])}
						>
							<TableCell
								className={cn(
									'px-3 py-2.5 text-sm font-semibold',
									isDimmed ? 'text-grayscale-400' : 'text-grayscale-900'
								)}
							>
								{label}
							</TableCell>
							<TableCell
								className={cn(
									'px-3 py-2.5 text-sm tabular-nums',
									isDimmed ? 'text-grayscale-400' : 'text-grayscale-700'
								)}
							>
								{formatSeasonRange(startsAt, endsAt)}
							</TableCell>
							<TableCell className="px-3 py-2.5 text-center">
								<Badge variant="outline" className={cn(SEASON_STATUS_BADGE_CLASS[status])}>
									{GUILD_CONTENT_SEASON_STATUS_LABEL[status]}
								</Badge>
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}

function SeasonTabPanel({ content, now }: { content: GuildSeasonalContentKey; now: Dayjs }) {
	const seasons = getSeasonsByContent(content)
	const summary = getContentSeasonSummary(content, now)

	const { contentLabel, dateLabel, seasonLabel } = summary

	return (
		<div className="flex flex-col gap-3">
			<p className="text-grayscale-600 text-sm">
				<span className="text-grayscale-900 font-semibold">{contentLabel}</span>
				{' · '}
				<span className="tabular-nums">{dateLabel}</span>
				{seasonLabel ? (
					<>
						{' '}
						<span className="text-grayscale-400">({seasonLabel})</span>
					</>
				) : null}
			</p>
			<div className="border-grayscale-200 bg-card shadow-soft max-h-[50dvh] overflow-y-auto rounded-xl border sm:max-h-[55dvh]">
				<SeasonScheduleTable seasons={seasons} now={now} />
			</div>
		</div>
	)
}

function GuildContentSeasonsGuide() {
	const now = dayjs()
	const defaultTab =
		getGuildContentSeasonSummaries(now).find((summary) => summary.status === 'active')?.content ??
		GUILD_SEASONAL_CONTENT_ORDER[0]

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button variant="outline" size="sm" className="text-grayscale-600 shrink-0 gap-1.5" aria-label="시즌 일정">
						<CalendarRangeIcon className="size-4" />
						<span className="lg:hidden">시즌</span>
						<span className="hidden lg:inline">시즌 일정</span>
					</Button>
				}
			/>
			<DialogContent className="max-h-[90dvh] max-w-[calc(100%-(--spacing(4)))] gap-4 overflow-hidden p-4 sm:max-w-lg sm:gap-6 sm:p-6">
				<DialogHeader>
					<DialogTitle>길드 컨텐츠 시즌 일정</DialogTitle>
					<DialogDescription>대항전·수련장·길드보스 시즌 기간입니다. 시간은 한국 기준입니다.</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue={defaultTab} className="min-h-0 gap-3">
					<TabsList className="grid w-full grid-cols-3">
						{GUILD_SEASONAL_CONTENT_ORDER.map((content) => (
							<TabsTrigger key={content} value={content}>
								{GUILD_SEASONAL_CONTENT_META[content].label}
							</TabsTrigger>
						))}
					</TabsList>

					{GUILD_SEASONAL_CONTENT_ORDER.map((content) => (
						<TabsContent key={content} value={content} className="mt-0">
							<SeasonTabPanel content={content} now={now} />
						</TabsContent>
					))}
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}

export default GuildContentSeasonsGuide
