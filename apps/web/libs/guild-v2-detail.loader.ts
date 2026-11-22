import currentWeekJson from '@/data/current-week.json'
import olderWeekJson from '@/data/older-week.json'
import previousWeekJson from '@/data/previous-week.json'
import { compareSnapshots } from '@/features/guild/lib/compare-snapshots'
import type { GuildWeekSnapshot } from '@/features/guild/types/guild-snapshot.type'
import { buildJobClassLineCards } from '@/features/guild-v2/lib/build-job-distribution'
import { buildMemberDetailChartsByMember } from '@/features/guild-v2/lib/build-member-detail-charts'
import type { GuildDetailRosterData } from '@/features/guild-v2/types/guild-detail-roster.type'
import type { GuildJobClassLineCardData } from '@/features/guild-v2/types/guild-job-distribution.type'
import type { GuildWeekSlot } from '@/features/guild-v2/types/guild-v2-dashboard.type'
import { GUILD_CONTENT_UPDATED_AT } from '@/libs/guild-content-dates.constants'

const currentWeek = currentWeekJson as GuildWeekSnapshot
const previousWeek = previousWeekJson as GuildWeekSnapshot
const olderWeek = olderWeekJson as GuildWeekSnapshot

function getDetailWeeks(): Record<GuildWeekSlot, GuildWeekSnapshot> {
	return {
		older: olderWeek,
		previous: previousWeek,
		current: currentWeek
	}
}

/** 상세 페이지 로스터·멤버별 3주 차트 */
function loadGuildV2DetailRosterData(): GuildDetailRosterData {
	const weeks = getDetailWeeks()

	const comparisons = compareSnapshots(currentWeek, previousWeek).filter((comparison) => comparison.status !== 'left')

	return {
		comparisons,
		chartsByMember: buildMemberDetailChartsByMember(weeks)
	}
}

/** 상세 직업 탭: 직업군 Card 5장 */
function loadGuildV2JobClassLineCards(): GuildJobClassLineCardData[] {
	const weeks = getDetailWeeks()
	const comparisons = compareSnapshots(currentWeek, previousWeek)

	return buildJobClassLineCards(weeks, GUILD_CONTENT_UPDATED_AT.combatPower, comparisons)
}

export { loadGuildV2DetailRosterData, loadGuildV2JobClassLineCards }
