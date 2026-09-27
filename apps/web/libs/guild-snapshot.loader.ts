import currentWeekJson from '@/data/current-week.json'
import previousWeekJson from '@/data/previous-week.json'
import { compareSnapshots, parseGuildMember } from '@/features/guild/lib/compare-snapshots'
import { computeMemberRankings } from '@/features/guild/lib/compute-member-rankings'
import type { GuildDashboardData, GuildWeekSnapshot } from '@/features/guild/types/guild-snapshot.type'

const currentWeek = currentWeekJson as GuildWeekSnapshot
const previousWeek = previousWeekJson as GuildWeekSnapshot

function loadGuildDashboardData(): GuildDashboardData {
	const parsedMembers = currentWeek.members.map(parseGuildMember)
	const parsedPreviousMembers = previousWeek.members.map(parseGuildMember)
	const rankings = computeMemberRankings(parsedMembers)
	const previousRankings = computeMemberRankings(parsedPreviousMembers)

	return {
		currentWeek,
		previousWeek,
		comparisons: compareSnapshots(currentWeek, previousWeek),
		rankings,
		previousRankings
	}
}

export { loadGuildDashboardData }
