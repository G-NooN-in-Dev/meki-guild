import currentWeekJson from '@/data/current-week.json'
import previousWeekJson from '@/data/previous-week.json'
import type { GuildDashboardData, GuildWeekSnapshot } from '@/features/guild/types/guild-snapshot.type'
import { compareSnapshots } from '@/utils/compare-snapshots'

const currentWeek = currentWeekJson as GuildWeekSnapshot
const previousWeek = previousWeekJson as GuildWeekSnapshot

export function loadGuildDashboardData(): GuildDashboardData {
	return {
		currentWeek,
		previousWeek,
		comparisons: compareSnapshots(currentWeek, previousWeek)
	}
}
