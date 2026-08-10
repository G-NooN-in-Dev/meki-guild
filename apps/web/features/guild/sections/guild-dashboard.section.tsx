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
	delta?: string | null
}

type SummaryCard = {
	label: string
	value: string
	/**
	 * 직전 대비 증감율. 멤버 테이블과 동일하게 GrowthDelta에 전달.
	 * undefined면 증감율 UI 미표시(평균 레벨 등).
	 */
	percentLabel?: string | null
	/** 메인 값 소제목(토벌전 점수 총합 등). 없으면 카드 제목만 사용 */
	valueLabel?: string
	/** 길드 포인트·순위. 있으면 점수 총합과 분리해 표시 */
	metaRows?: SummaryMetaRow[]
	/** 데스크탑 그리드에서 차지할 열 수. 토벌전처럼 정보가 많은 카드에 사용 */
	columnSpan?: 2
}

/** 요약 카드 본문: 변화량은 크게, 증감율만 GrowthDelta로 옆에 표시 */
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
	return (
		<div>
			<p className="text-grayscale-500 text-sm font-semibold">{row.label}</p>
			<p className="mt-1 flex flex-wrap items-baseline gap-x-2">
				<span className="text-grayscale-900 text-xl font-semibold">{row.value}</span>
				{/* 길드 포인트·순위는 증감량만 표시(증감율 제외) */}
				{row.delta !== undefined ? <GrowthDelta value={row.delta ?? null} /> : null}
			</p>
		</div>
	)
}

function ScoreTotalBlock({
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
 * 토벌전 카드 본문.
 * - 한 줄 전체: 4열 기준 점수(2) + 포인트(1) + 순위(1) 한 줄
 * - xl에서 다른 카드와 공유(반폭): 점수|길드 좌우, 길드 항목은 2행
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
			{/* 한 줄 전체: 모바일은 점수 아래 포인트|순위, md+는 2+1+1 한 줄 */}
			<div className={cn('grid grid-cols-2 gap-3 md:grid-cols-4', sharesRowAtXl && 'xl:hidden')}>
				<div className="col-span-2">
					<ScoreTotalBlock valueLabel={valueLabel} value={value} percentLabel={percentLabel} />
				</div>
				{metaRows.map((row) => (
					<SummaryMetaItem key={row.label} row={row} />
				))}
			</div>

			{/* xl 반폭: 점수 | (포인트·순위 세로) */}
			{sharesRowAtXl ? (
				<div className="hidden xl:grid xl:grid-cols-2 xl:gap-0">
					<div className="border-grayscale-100 border-r pr-3">
						<ScoreTotalBlock valueLabel={valueLabel} value={value} percentLabel={percentLabel} />
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

function GuildDashboardSection({ data }: GuildDashboardSectionProps) {
	const metrics = calculateGuildSummaryMetrics(data.comparisons, {
		current: data.currentWeek.guild?.expeditionRank,
		previous: data.previousWeek.guild?.expeditionRank
	})

	const topSummaryCards: SummaryCard[] = [
		{
			label: '총 전투력 변화',
			value: metrics.combatPowerChange,
			percentLabel: metrics.combatPowerChangePercent
		},
		{
			label: '평균 레벨',
			value: `Lv. ${metrics.averageLevel}`
		}
	]

	// 수련장·길드보스는 수집 주기가 길어 표시 플래그가 켜진 경우만 요약 카드에 포함
	const bottomSummaryCards: SummaryCard[] = [
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
			value: metrics.rivalryChange,
			percentLabel: metrics.rivalryChangePercent
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

	// xl 4열 그리드에서 토벌전(2)과 나머지 카드가 한 줄을 나란히 쓰는 경우
	const singleColumnCards = bottomSummaryCards.filter((card) => card.columnSpan !== 2)
	const sharesRowAtXl = singleColumnCards.length >= 2

	return (
		<section className="flex w-full min-w-0 flex-col gap-6">
			<header className="flex flex-col gap-2">
				<p className="text-grayscale-500 text-sm">길드 종합 현황</p>
				<h1 className="text-grayscale-900 text-3xl font-semibold">메이플키우기 게임즈 길드</h1>
			</header>

			<div className="flex flex-col gap-4">
				<div className="grid gap-4 md:grid-cols-2">
					{topSummaryCards.map((card) => (
						<div key={card.label} className="border-grayscale-200 bg-card shadow-soft rounded-xl border p-4">
							<p className="text-grayscale-500 text-sm">{card.label}</p>
							<SummaryCardValue value={card.value} percentLabel={card.percentLabel} />
						</div>
					))}
				</div>

				{/* 토벌전(2열) + 나머지. 나머지 2개 이상이면 xl에서 4열로 한 줄 배치 */}
				<div className={sharesRowAtXl ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-4' : 'grid gap-4 md:grid-cols-2'}>
					{bottomSummaryCards.map((card) => (
						<div
							key={card.label}
							className={cn(
								'border-grayscale-200 bg-card shadow-soft rounded-xl border p-4',
								card.columnSpan === 2 && 'md:col-span-2'
							)}
						>
							<p className="text-grayscale-500 text-sm">{card.label}</p>
							{card.valueLabel && card.metaRows && card.metaRows.length > 0 ? (
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
					))}
				</div>
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
