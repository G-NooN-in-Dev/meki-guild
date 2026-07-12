import currentWeekJson from '@/data/current-week.json'
import previousWeekJson from '@/data/previous-week.json'
import type {
	GuildComparePageData,
	GuildDashboardData,
	GuildMemberInput,
	GuildWeekSnapshot
} from '@/features/guild/types/guild-snapshot.type'
import { compareSnapshots } from '@/utils/compare-snapshots'

const currentWeek = currentWeekJson as GuildWeekSnapshot
const previousWeek = previousWeekJson as GuildWeekSnapshot

function isEmptyPlacement(value: number | null | undefined): boolean {
	if (value === undefined || value === null) {
		return true
	}

	return !Number.isFinite(value) || value <= 0
}

/**
 * 1vs1은 최신 스냅샷 기준이지만, 토벌전 등수는 아직 최신만 비어 있는 전환기를 지원합니다.
 * 최신 placement가 없으면 직전 주의 등수를 채워 비교에 쓰입니다.
 */
function withPreviousExpeditionPlacement(
	member: GuildMemberInput,
	previousMember: GuildMemberInput | undefined
): GuildMemberInput {
	if (!isEmptyPlacement(member.expedition.placement) || !previousMember) {
		return member
	}

	if (isEmptyPlacement(previousMember.expedition.placement)) {
		return member
	}

	return {
		...member,
		expedition: {
			...member.expedition,
			placement: previousMember.expedition.placement
		}
	}
}

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
	const previousByName = new Map(previousWeek.members.map((member) => [member.name, member]))

	return {
		members: currentWeek.members
			.filter((member) => activeNames.has(member.name))
			.map((member) => withPreviousExpeditionPlacement(member, previousByName.get(member.name)))
	}
}
