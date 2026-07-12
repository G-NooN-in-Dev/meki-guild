import { GrowthDelta } from '@/features/guild/components/growth-delta'
import GuildMemberTable from '@/features/guild/components/guild-member-table'
import type { GuildDashboardData } from '@/features/guild/types/guild-snapshot.type'
import { formatGuildContentDate } from '@/libs/guild-content-dates.constants'
import { calculateGuildSummaryMetrics } from '@/utils/guild-summary'

type GuildDashboardSectionProps = {
	data: GuildDashboardData
}

type SummaryCard = {
	label: string
	value: string
	description?: string
	/** 토벌전 카드 하단: 등급 점수 합계 */
	subValue?: string
	subDelta?: string | null
}

function GuildDashboardSection({ data }: GuildDashboardSectionProps) {
	const metrics = calculateGuildSummaryMetrics(data.comparisons)

	const topSummaryCards: SummaryCard[] = [
		{
			label: '총 전투력 변화',
			value: metrics.combatPowerChange,
			description: '직전 대비'
		},
		{
			label: '평균 레벨',
			value: metrics.averageLevel,
			description: ''
		}
	]

	const bottomSummaryCards: SummaryCard[] = [
		{
			label: '토벌전',
			value: metrics.expeditionScoreChange,
			subValue: metrics.expeditionGradePointsTotal,
			subDelta: metrics.expeditionGradePointsChange,
			description: '직전 대비'
		},
		{
			label: '대항전',
			value: metrics.rivalryChange,
			description: '직전 대비'
		},
		{
			label: '수련장',
			value: metrics.trainingChange,
			description: '직전 대비'
		},
		{
			label: '길드보스',
			value: metrics.guildBossChange,
			description: '직전 대비'
		}
	]

	return (
		<section className="flex w-full flex-col gap-6">
			<header className="flex flex-col gap-2">
				<p className="text-grayscale-500 text-sm">길드 종합 현황</p>
				<h1 className="text-grayscale-900 text-3xl font-semibold">메이플키우기 게임즈 길드</h1>
				<p className="text-grayscale-600 text-sm">
					최근 업데이트 : {formatGuildContentDate(data.currentWeek.updatedAt)}
				</p>
			</header>

			<div className="flex flex-col gap-4">
				<div className="grid gap-4 md:grid-cols-2">
					{topSummaryCards.map((card) => (
						<div key={card.label} className="border-grayscale-200 bg-card shadow-soft rounded-xl border p-4">
							<p className="flex items-center gap-1">
								<span className="text-grayscale-500 text-sm">{card.label}</span>
								{card.description && <span className="text-grayscale-400 text-xs">({card.description})</span>}
							</p>
							<p className="text-grayscale-900 mt-2 text-2xl font-semibold">{card.value}</p>
						</div>
					))}
				</div>

				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					{bottomSummaryCards.map((card) => (
						<div key={card.label} className="border-grayscale-200 bg-card shadow-soft rounded-xl border p-4">
							<p className="flex items-center gap-1">
								<span className="text-grayscale-500 text-sm">{card.label}</span>
								{card.description && <span className="text-grayscale-400 text-xs">({card.description})</span>}
							</p>
							<p className="text-grayscale-900 mt-2 text-2xl font-semibold">{card.value}</p>
							{card.subValue ? (
								<div className="mt-1 flex items-baseline gap-2">
									<span className="text-grayscale-500 text-sm font-semibold">길드 점수</span>
									<span className="text-grayscale-500 text-sm font-medium">{card.subValue}</span>
									<GrowthDelta value={card.subDelta ?? null} />
								</div>
							) : null}
						</div>
					))}
				</div>
			</div>

			<GuildMemberTable
				comparisons={data.comparisons}
				currentUpdatedAt={data.currentWeek.updatedAt}
				previousUpdatedAt={data.previousWeek.updatedAt}
			/>
		</section>
	)
}

export default GuildDashboardSection
