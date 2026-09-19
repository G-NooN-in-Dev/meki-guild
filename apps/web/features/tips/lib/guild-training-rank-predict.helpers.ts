import type {
	TrainingPredictGuildRow,
	TrainingPredictMember,
	TrainingPredictMemberRow,
	TrainingPredictResult
} from '../types/guild-training-rank-predict.type'
import { sortPredictMembersByCombatPower } from './guild-rank-predict.helpers'

/**
 * 전체 길드원을 전투력 내림차순으로 정렬하고, 길드별 전투력 합산으로 순위를 매깁니다.
 * 동점이면 길드 입력 순서 → 이름 순으로 순위를 고정합니다.
 */
function buildTrainingPredictResult(members: readonly TrainingPredictMember[]): TrainingPredictResult {
	const sorted = sortPredictMembersByCombatPower(members)

	const memberRows: TrainingPredictMemberRow[] = sorted.map((member, index) => ({
		...member,
		rank: index + 1
	}))

	const combatByGuild = new Map<
		number,
		{ guildName: string; serverLabel: string | null; guildIndex: number; totalCombatPower: bigint }
	>()

	for (const row of memberRows) {
		const current = combatByGuild.get(row.guildIndex)

		if (current) {
			current.totalCombatPower += row.combatPower
			continue
		}

		combatByGuild.set(row.guildIndex, {
			guildName: row.guildName,
			serverLabel: row.serverLabel,
			guildIndex: row.guildIndex,
			totalCombatPower: row.combatPower
		})
	}

	const guildRows: TrainingPredictGuildRow[] = [...combatByGuild.values()]
		.sort((a, b) => {
			if (a.totalCombatPower !== b.totalCombatPower) {
				return a.totalCombatPower > b.totalCombatPower ? -1 : 1
			}

			return a.guildIndex - b.guildIndex
		})
		.map((guild, index) => ({
			rank: index + 1,
			guildName: guild.guildName,
			serverLabel: guild.serverLabel,
			guildIndex: guild.guildIndex,
			totalCombatPower: guild.totalCombatPower
		}))

	return { members: memberRows, guilds: guildRows }
}

export { buildTrainingPredictResult }
