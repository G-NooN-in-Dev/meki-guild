import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@shared/ui/card'
import Link from 'next/link'

import GuildMetricChart from '@/features/guild/components/guild-metric-chart'
import type { GuildDashboardChartCard } from '@/features/guild/types/guild-dashboard.type'

type GuildDashboardChartCardProps = {
	card: GuildDashboardChartCard
}

function GuildDashboardChartCard({ card }: GuildDashboardChartCardProps) {
	const { href, series, title } = card
	return (
		<Card size="sm" className="min-w-0">
			<CardHeader className="border-b">
				<CardTitle>{title}</CardTitle>
				<CardAction>
					<Link
						href={href}
						className="text-grayscale-600 hover:text-grayscale-900 text-sm whitespace-nowrap underline-offset-2 hover:underline"
					>
						자세히 보기 &gt;
					</Link>
				</CardAction>
			</CardHeader>
			<CardContent className="pt-4">
				<GuildMetricChart seriesList={series} />
			</CardContent>
		</Card>
	)
}

export default GuildDashboardChartCard
