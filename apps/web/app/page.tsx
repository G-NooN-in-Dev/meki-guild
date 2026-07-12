import GuildDashboardSection from '@/features/guild/sections/guild-dashboard.section'
import { loadGuildDashboardData } from '@/libs/guild-snapshot.loader'

function Homepage() {
	const data = loadGuildDashboardData()

	return (
		<div className="min-h-screen-safe flex w-full min-w-0 flex-1 font-sans">
			<main className="flex w-full min-w-0 flex-1">
				<div className="max-w-content container mx-auto flex w-full min-w-0 flex-col px-4 py-8 md:px-6">
					<GuildDashboardSection data={data} />
				</div>
			</main>
		</div>
	)
}

export default Homepage
