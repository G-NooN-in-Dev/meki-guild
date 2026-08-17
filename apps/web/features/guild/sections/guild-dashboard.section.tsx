import { cn } from '@shared/ui/lib/utils'

import GrowthDelta from '@/features/guild/components/growth-delta'
import GuildMemberTable from '@/features/guild/components/guild-member-table'
import { calculateGuildSummaryMetrics } from '@/features/guild/lib/guild-summary'
import { GUILD_ZERO_DELTA_LABEL, type GuildDashboardData } from '@/features/guild/types/guild-snapshot.type'
import { isGuildMetricVisible } from '@/libs/guild-metric-visibility.constants'

type GuildDashboardSectionProps = {
	data: GuildDashboardData
}

type SummaryMetaRow = {
	label: string
	value: string
	/** 절대값 옆 증감량(길드 포인트·순위·평균 레벨 등) */
	delta?: string | null
	/**
	 * 증감율.
	 * - delta가 있으면 delta 옆에 표시
	 * - delta가 없으면 value(변화량) 옆에 표시
	 */
	percentLabel?: string | null
}

type SummaryCard = {
	label: string
	value: string
	/** 직전 대비 증감율. undefined면 증감율 UI 미표시 */
	percentLabel?: string | null
	/** 메인 값 소제목. metaRows와 함께 있으면 좌우 분할 레이아웃 */
	valueLabel?: string
	metaRows?: SummaryMetaRow[]
	/** 데스크탑 그리드 열 수. 정보가 많은 카드에 사용 */
	columnSpan?: 2
}

type SplitSummaryCard = SummaryCard & {
	valueLabel: string
	metaRows: SummaryMetaRow[]
}

const isSplitSummaryCard = (card: SummaryCard): card is SplitSummaryCard =>
	Boolean(card.valueLabel && card.metaRows && card.metaRows.length > 0)

/** 요약 카드 본문: 값은 크게, 증감율만 GrowthDelta로 옆에 표시 */
function SummaryCardValue({
	value,
	percentLabel,
	className = 'mt-2'
}: {
	value: string
	percentLabel?: string | null
	className?: string
}) {
	if (percentLabel === undefined) {
		return <p className={cn('text-grayscale-900 text-2xl font-semibold', className)}>{value}</p>
	}

	return (
		<p className={cn('flex flex-wrap items-baseline gap-x-2', className)}>
			<span className="text-grayscale-900 text-2xl font-semibold">{value}</span>
			{percentLabel ? (
				<GrowthDelta
					value={value === GUILD_ZERO_DELTA_LABEL ? null : value}
					percentLabel={percentLabel}
					hideValue
					className="text-sm"
				/>
			) : null}
		</p>
	)
}

function SummaryMetaItem({ row }: { row: SummaryMetaRow }) {
	const showDelta = row.delta !== undefined
	const showPercentOnly = !showDelta && row.percentLabel !== undefined

	return (
		<div>
			<p className="text-grayscale-500 text-sm font-semibold">{row.label}</p>
			<p className="mt-1 flex flex-wrap items-baseline gap-x-2">
				<span className="text-grayscale-900 text-xl font-semibold">{row.value}</span>
				{showDelta ? (
					<GrowthDelta value={row.delta ?? null} percentLabel={row.percentLabel} />
				) : showPercentOnly ? (
					<GrowthDelta
						value={row.value === GUILD_ZERO_DELTA_LABEL ? null : row.value}
						percentLabel={row.percentLabel}
						hideValue
					/>
				) : null}
			</p>
		</div>
	)
}

function PrimaryMetricBlock({
	valueLabel,
	value,
	percentLabel
}: {
	valueLabel: string
	value: string
	percentLabel?: string | null
}) {
	return (
		<div>
			<p className="text-grayscale-500 text-sm font-semibold">{valueLabel}</p>
			<SummaryCardValue value={value} percentLabel={percentLabel} className="mt-1" />
		</div>
	)
}

/**
 * 좌우 분할 요약 카드 본문.
 * - 기본: 4열(메인 2 + 메타 1·1). 모바일은 메인 아래 메타 2열
 * - sharesRowAtXl: xl 반폭일 때 메인 | 메타(세로)
 */
function SplitSummaryCardBody({
	valueLabel,
	value,
	percentLabel,
	metaRows,
	sharesRowAtXl
}: {
	valueLabel: string
	value: string
	percentLabel?: string | null
	metaRows: SummaryMetaRow[]
	sharesRowAtXl: boolean
}) {
	return (
		<div className="mt-2">
			<div className={cn('grid grid-cols-2 gap-3 md:grid-cols-4', sharesRowAtXl && 'xl:hidden')}>
				<div className="col-span-2">
					<PrimaryMetricBlock valueLabel={valueLabel} value={value} percentLabel={percentLabel} />
				</div>
				{metaRows.map((row) => (
					<SummaryMetaItem key={row.label} row={row} />
				))}
			</div>

			{sharesRowAtXl ? (
				<div className="hidden xl:grid xl:grid-cols-2 xl:gap-0">
					<div className="border-grayscale-100 border-r pr-3">
						<PrimaryMetricBlock valueLabel={valueLabel} value={value} percentLabel={percentLabel} />
					</div>
					<div className="space-y-2 pl-3">
						{metaRows.map((row) => (
							<SummaryMetaItem key={row.label} row={row} />
						))}
					</div>
				</div>
			) : null}
		</div>
	)
}

function SummaryCardView({ card, sharesRowAtXl = false }: { card: SummaryCard; sharesRowAtXl?: boolean }) {
	return (
		<div
			className={cn(
				'border-grayscale-200 bg-card shadow-soft rounded-xl border p-4',
				card.columnSpan === 2 && 'md:col-span-2'
			)}
		>
			<p className="text-grayscale-500 text-sm">{card.label}</p>
			{isSplitSummaryCard(card) ? (
				<SplitSummaryCardBody
					valueLabel={card.valueLabel}
					value={card.value}
					percentLabel={card.percentLabel}
					metaRows={card.metaRows}
					sharesRowAtXl={sharesRowAtXl}
				/>
			) : (
				<SummaryCardValue value={card.value} percentLabel={card.percentLabel} />
			)}
		</div>
	)
}

function buildSummaryCards(metrics: ReturnType<typeof calculateGuildSummaryMetrics>): {
	top: SummaryCard
	bottom: SummaryCard[]
} {
	const top: SummaryCard = {
		label: '전투력 · 레벨',
		valueLabel: '길드 총 전투력',
		value: metrics.combatPowerTotal,
		metaRows: [
			{
				label: '변화량',
				value: metrics.combatPowerChange,
				percentLabel: metrics.combatPowerChangePercent
			},
			{
				label: '평균 레벨',
				value: `Lv. ${metrics.averageLevel}`,
				delta: metrics.averageLevelChange
			}
		]
	}

	// 수련장·길드보스는 수집 주기가 길어 표시 플래그가 켜진 경우만 포함
	const bottom: SummaryCard[] = [
		{
			label: '토벌전 변화',
			valueLabel: '토벌전 점수 총합',
			value: metrics.expeditionScoreChange,
			percentLabel: metrics.expeditionScoreChangePercent,
			columnSpan: 2,
			metaRows: [
				{
					label: '길드 포인트 총합',
					value: metrics.expeditionGradePointsTotal,
					delta: metrics.expeditionGradePointsChange
				},
				{
					label: '길드 순위',
					value: metrics.guildExpeditionRankLabel,
					delta: metrics.guildExpeditionRankChange
				}
			]
		},
		{
			label: '대항전 변화',
			valueLabel: '대항전 점수 총합',
			value: metrics.rivalryChange,
			percentLabel: metrics.rivalryChangePercent,
			columnSpan: 2,
			metaRows: [
				{
					label: '길드 포인트 총합',
					value: metrics.rivalryPointsTotal,
					delta: metrics.rivalryPointsChange
				},
				{
					label: '길드 순위',
					value: metrics.guildRivalryRankLabel,
					delta: metrics.guildRivalryRankChange
				}
			]
		},
		...(isGuildMetricVisible('training')
			? [
					{
						label: '수련장 변화',
						value: metrics.trainingChange,
						percentLabel: metrics.trainingChangePercent
					} satisfies SummaryCard
				]
			: []),
		...(isGuildMetricVisible('guildBoss')
			? [
					{
						label: '길드보스 변화',
						value: metrics.guildBossChange,
						percentLabel: metrics.guildBossChangePercent
					} satisfies SummaryCard
				]
			: [])
	]

	return { top, bottom }
}

function GuildDashboardSection({ data }: GuildDashboardSectionProps) {
	const metrics = calculateGuildSummaryMetrics(data.comparisons, {
		expeditionRank: {
			current: data.currentWeek.guild?.expeditionRank,
			previous: data.previousWeek.guild?.expeditionRank
		},
		rivalryRank: {
			current: data.currentWeek.guild?.rivalryRank,
			previous: data.previousWeek.guild?.rivalryRank
		},
		rivalryPoints: {
			current: data.currentWeek.guild?.rivalryPoints,
			previous: data.previousWeek.guild?.rivalryPoints
		}
	})
	const { top: topSummaryCard, bottom: bottomSummaryCards } = buildSummaryCards(metrics)
	const splitSummaryCards = bottomSummaryCards.filter((card) => card.columnSpan === 2)
	const restSummaryCards = bottomSummaryCards.filter((card) => card.columnSpan !== 2)
	// 토벌전·대항전처럼 2열 카드가 둘이면 xl에서 한 줄을 나눠 씁니다
	const sharesRowAtXl = splitSummaryCards.length >= 2

	return (
		<section className="flex w-full min-w-0 flex-col gap-6">
			<header className="flex flex-col gap-2">
				<p className="text-grayscale-500 text-sm">길드 종합 현황</p>
				<h1 className="text-grayscale-900 text-3xl font-semibold">메이플키우기 게임즈 길드</h1>
			</header>

			<div className="flex flex-col gap-4">
				<SummaryCardView card={topSummaryCard} />

				{splitSummaryCards.length > 0 ? (
					<div className={sharesRowAtXl ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-4' : 'grid gap-4 md:grid-cols-2'}>
						{splitSummaryCards.map((card) => (
							<SummaryCardView key={card.label} card={card} sharesRowAtXl={sharesRowAtXl} />
						))}
					</div>
				) : null}

				{restSummaryCards.length > 0 ? (
					<div className="grid gap-4 md:grid-cols-2">
						{restSummaryCards.map((card) => (
							<SummaryCardView key={card.label} card={card} />
						))}
					</div>
				) : null}
			</div>

			<GuildMemberTable
				comparisons={data.comparisons}
				rankings={data.rankings}
				previousRankings={data.previousRankings}
			/>
		</section>
	)
}

export default GuildDashboardSection
