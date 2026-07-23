import { GrowthDelta } from '@/features/guild/components/growth-delta'
import GuildMemberTable from '@/features/guild/components/guild-member-table'
import { GUILD_ZERO_DELTA_LABEL, type GuildDashboardData } from '@/features/guild/types/guild-snapshot.type'
import { isGuildMetricVisible } from '@/libs/guild-metric-visibility.constants'
import { calculateGuildSummaryMetrics } from '@/utils/guild-summary'

type GuildDashboardSectionProps = {
	data: GuildDashboardData
}

type SummaryCard = {
	label: string
	value: string
	/**
	 * 직전 대비 증감율. 멤버 테이블과 동일하게 GrowthDelta에 전달.
	 * undefined면 증감율 UI 미표시(평균 레벨 등).
	 */
	percentLabel?: string | null
	/** 토벌전 카드 하단: 등급 점수 합계(증감율 미표시) */
	subValue?: string
	subDelta?: string | null
}

/** 요약 카드 본문: 변화량은 크게, 증감율만 GrowthDelta로 옆에 표시 */
function SummaryCardValue({ value, percentLabel }: { value: string; percentLabel?: string | null }) {
	if (percentLabel === undefined) {
		return <p className="text-grayscale-900 mt-2 text-2xl font-semibold">{value}</p>
	}

	return (
		<p className="mt-2 flex flex-wrap items-baseline gap-x-2">
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

function GuildDashboardSection({ data }: GuildDashboardSectionProps) {
	const metrics = calculateGuildSummaryMetrics(data.comparisons)

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
			value: metrics.expeditionScoreChange,
			percentLabel: metrics.expeditionScoreChangePercent,
			subValue: metrics.expeditionGradePointsTotal,
			subDelta: metrics.expeditionGradePointsChange
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

				{/* 숨긴 지표가 있으면 카드 수에 맞춰 그리드 열 수를 줄임 */}
				<div
					className={
						bottomSummaryCards.length <= 2 ? 'grid gap-4 md:grid-cols-2' : 'grid gap-4 md:grid-cols-2 xl:grid-cols-4'
					}
				>
					{bottomSummaryCards.map((card) => (
						<div key={card.label} className="border-grayscale-200 bg-card shadow-soft rounded-xl border p-4">
							<p className="text-grayscale-500 text-sm">{card.label}</p>
							<SummaryCardValue value={card.value} percentLabel={card.percentLabel} />
							{card.subValue ? (
								<div className="mt-1 flex items-baseline gap-2">
									<span className="text-grayscale-500 text-sm font-semibold">길드 점수</span>
									<span className="text-grayscale-500 text-sm font-medium">{card.subValue}</span>
									{/* 토벌전 길드점수는 증감량만 표시(증감율 제외) */}
									<GrowthDelta value={card.subDelta ?? null} />
								</div>
							) : null}
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
