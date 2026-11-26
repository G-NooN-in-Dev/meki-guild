'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'
import { cn } from '@shared/ui/utils'
import { CalendarRangeIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'

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
import dayjs, { DATE_WITH_WEEKDAY_FORMAT, type Dayjs, formatDate } from '@/utils/dayjs'

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
	// Dialog를 열 때 미리 스크롤할 행: 진행 중 시즌 → 없으면 가장 가까운 예정 시즌
	const scrollTargetSeason =
		seasons.find((season) => getSeasonStatus(season, now) === 'active') ??
		seasons.find((season) => getSeasonStatus(season, now) === 'upcoming')

	return (
		// table-fixed: 모바일에서 긴 기간 문자열이 상태 열을 밀어내지 않도록 폭을 고정합니다.
		<Table className="table-fixed" containerClassName="overflow-visible">
			<TableHeader sticky className="[&>tr>th]:bg-grayscale-100">
				<TableRow className="border-grayscale-200 bg-grayscale-100 hover:bg-grayscale-100">
					<TableHead className="text-grayscale-600 h-11 w-16 px-2 text-xs font-semibold tracking-wide sm:w-20 sm:px-3">
						시즌
					</TableHead>
					<TableHead className="text-grayscale-600 h-11 px-2 text-xs font-semibold tracking-wide sm:px-3">
						기간
					</TableHead>
					<TableHead className="text-grayscale-600 h-11 w-14 px-2 text-center text-xs font-semibold tracking-wide sm:w-16 sm:px-3">
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
							data-scroll-target={season === scrollTargetSeason ? '' : undefined}
							className={cn('border-grayscale-100', showCardClass && SEASON_STATUS_CARD_CLASS[status])}
						>
							<TableCell
								className={cn(
									'px-2 py-2.5 text-sm font-semibold sm:px-3',
									isDimmed ? 'text-grayscale-400' : 'text-grayscale-900'
								)}
							>
								{label}
							</TableCell>
							<TableCell
								className={cn(
									'px-2 py-2.5 text-xs tabular-nums sm:px-3 sm:text-sm',
									isDimmed ? 'text-grayscale-400' : 'text-grayscale-700'
								)}
							>
								{/* 모바일: 시작·종료를 두 줄로 나눠 가로 overflow·과도한 줄바꿈을 피합니다. */}
								<span className="flex flex-col sm:hidden">
									<span>{formatDate(startsAt, DATE_WITH_WEEKDAY_FORMAT)}</span>
									<span>~ {formatDate(endsAt, DATE_WITH_WEEKDAY_FORMAT)}</span>
								</span>
								<span className="hidden sm:inline">{formatSeasonRange(startsAt, endsAt)}</span>
							</TableCell>
							<TableCell className="px-2 py-2.5 text-center sm:px-3">
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
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	const { contentLabel, dateLabel, seasonLabel } = summary

	// 탭 패널은 활성화될 때 마운트되므로, Dialog를 열거나 탭을 바꿀 때마다 진행·예정 시즌이 보이도록 스크롤합니다.
	useEffect(() => {
		const container = scrollContainerRef.current
		const target = container?.querySelector<HTMLElement>('[data-scroll-target]')

		if (!container || !target) {
			return
		}

		// Dialog 열림 애니메이션(scale) 중에도 정확하도록 transform 배율로 보정한 뒤 대상 행을 세로 중앙에 맞춥니다.
		const containerRect = container.getBoundingClientRect()
		const targetRect = target.getBoundingClientRect()
		const scale = container.clientHeight > 0 ? containerRect.height / container.clientHeight : 1
		const offsetTop = (targetRect.top - containerRect.top) / scale
		const targetHeight = targetRect.height / scale

		container.scrollTop += offsetTop - (container.clientHeight - targetHeight) / 2
	}, [])

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3">
			<p className="text-grayscale-600 shrink-0 text-sm">
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
			{/* 고정 dvh 대신 Dialog 남은 높이를 채워, 모바일에서 헤더+탭과 합쳐 90dvh를 넘지 않게 합니다. */}
			<div
				ref={scrollContainerRef}
				className="border-grayscale-200 bg-card shadow-soft min-h-0 flex-1 overflow-auto rounded-xl border"
			>
				<SeasonScheduleTable seasons={seasons} now={now} />
			</div>
		</div>
	)
}

type GuildContentSeasonsGuideProps = {
	/** 제어 모드: 외부에서 Dialog 열림 상태를 관리할 때 */
	open?: boolean
	onOpenChange?: (open: boolean) => void
	/** 열릴 때 보여줄 컨텐츠 탭. 없으면 진행 중 시즌(또는 첫 탭) */
	defaultContent?: GuildSeasonalContentKey
	/** false면 트리거 버튼을 숨깁니다. (홈 상태 카드 클릭으로 열 때) */
	showTrigger?: boolean
}

function GuildContentSeasonsGuide({
	open,
	onOpenChange,
	defaultContent,
	showTrigger = true
}: GuildContentSeasonsGuideProps = {}) {
	const now = dayjs()
	const fallbackTab =
		getGuildContentSeasonSummaries(now).find((summary) => summary.status === 'active')?.content ??
		GUILD_SEASONAL_CONTENT_ORDER[0]
	const initialTab = defaultContent ?? fallbackTab

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			{showTrigger ? (
				<DialogTrigger
					render={
						<Button variant="outline" size="sm" className="text-grayscale-600 shrink-0 gap-1.5" aria-label="시즌 일정">
							<CalendarRangeIcon className="size-4" />
							<span className="lg:hidden">시즌</span>
							<span className="hidden lg:inline">시즌 일정</span>
						</Button>
					}
				/>
			) : null}
			{/* grid→flex: 헤더·탭은 고정, 테이블만 남은 높이에서 스크롤 */}
			<DialogContent className="flex max-h-[90dvh] max-w-[calc(100%-(--spacing(4)))] flex-col gap-4 overflow-hidden p-4 sm:max-w-lg sm:gap-6 sm:p-6">
				<DialogHeader className="shrink-0 pr-8">
					<DialogTitle>길드 컨텐츠 시즌 일정</DialogTitle>
					<DialogDescription>대항전·수련장·길드보스 시즌 기간입니다. 시간은 한국 기준입니다.</DialogDescription>
				</DialogHeader>

				{/* defaultContent가 바뀔 때마다 해당 탭으로 다시 열리도록 key로 리마운트 */}
				<Tabs key={initialTab} defaultValue={initialTab} className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
					<TabsList className="grid w-full shrink-0 grid-cols-3">
						{GUILD_SEASONAL_CONTENT_ORDER.map((content) => (
							<TabsTrigger key={content} value={content}>
								{GUILD_SEASONAL_CONTENT_META[content].label}
							</TabsTrigger>
						))}
					</TabsList>

					{GUILD_SEASONAL_CONTENT_ORDER.map((content) => (
						<TabsContent key={content} value={content} className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden">
							<SeasonTabPanel content={content} now={now} />
						</TabsContent>
					))}
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}

export default GuildContentSeasonsGuide
export type { GuildContentSeasonsGuideProps }
