import { buildComparison, buildLeftMemberComparison } from '@/features/guild/lib/build-member-comparison'
import { parseGuildMember } from '@/features/guild/lib/parse-guild-member'
import type {
	GuildMemberComparison,
	GuildWeekSnapshot,
	MemberComparisonStatus
} from '@/features/guild/types/guild-snapshot.type'

function compareSnapshots(currentWeek: GuildWeekSnapshot, previousWeek: GuildWeekSnapshot): GuildMemberComparison[] {
	const currentMembers = currentWeek.members.map(parseGuildMember)
	const previousMembers = previousWeek.members.map(parseGuildMember)
	const previousByName = new Map(previousMembers.map((member) => [member.name, member]))
	const comparisons: GuildMemberComparison[] = []

	for (const current of currentMembers) {
		const previous = previousByName.get(current.name) ?? null
		const status: MemberComparisonStatus = previous ? 'active' : 'new'

		comparisons.push(buildComparison(current, previous, status))
		previousByName.delete(current.name)
	}

	for (const previous of previousByName.values()) {
		comparisons.push(buildLeftMemberComparison(previous))
	}

	return comparisons.sort((left, right) => {
		if (left.status === 'left' && right.status !== 'left') {
			return 1
		}

		if (left.status !== 'left' && right.status === 'left') {
			return -1
		}

		const leftPower = left.combatPower.hasValue ? left.combatPower.current : -1n
		const rightPower = right.combatPower.hasValue ? right.combatPower.current : -1n

		if (leftPower === rightPower) {
			return left.name.localeCompare(right.name, 'ko')
		}

		return leftPower > rightPower ? -1 : 1
	})
}

export { compareSnapshots, parseGuildMember }
