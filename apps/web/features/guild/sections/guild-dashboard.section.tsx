import GuildMemberTable from '@/features/guild/components/guild-member-table'
import GuildSummaryCards from '@/features/guild/components/guild-summary-cards'
import { calculateGuildSummaryMetrics } from '@/features/guild/lib/guild-summary'
import type { GuildDashboardData } from '@/features/guild/types/guild-snapshot.type'

type GuildDashboardSectionProps = {
	data: GuildDashboardData
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

	return (
		<section className="flex w-full min-w-0 flex-col gap-6">
			<header className="flex flex-col gap-2">
				<p className="text-grayscale-500 text-sm">길드 종합 현황</p>
				<h1 className="text-grayscale-900 text-3xl font-semibold">메이플키우기 게임즈 길드</h1>
			</header>

			<GuildSummaryCards metrics={metrics} />

			<GuildMemberTable
				comparisons={data.comparisons}
				rankings={data.rankings}
				previousRankings={data.previousRankings}
			/>
		</section>
	)
}

export default GuildDashboardSection
