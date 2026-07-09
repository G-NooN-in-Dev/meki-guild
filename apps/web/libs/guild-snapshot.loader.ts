import currentWeekJson from '@/data/current-week.json'
import previousWeekJson from '@/data/previous-week.json'
import type {
	GuildComparePageData,
	GuildDashboardData,
	GuildWeekSnapshot
} from '@/features/guild/types/guild-snapshot.type'
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

/** 1 vs 1 비교 페이지용: 이번 주 활성 길드원 목록 */
export function loadGuildComparePageData(): GuildComparePageData {
	const comparisons = compareSnapshots(currentWeek, previousWeek)
	const activeNames = new Set(
		comparisons.filter((comparison) => comparison.status !== 'left').map((comparison) => comparison.name)
	)

	return {
		updatedAt: currentWeek.updatedAt,
		members: currentWeek.members.filter((member) => activeNames.has(member.name))
	}
}
