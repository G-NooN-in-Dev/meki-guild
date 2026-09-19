import { getRivalryRankPoints } from '@/libs/rivalry-rank-points.constants'

import type {
	RivalryPredictGuildRow,
	RivalryPredictMember,
	RivalryPredictMemberRow,
	RivalryPredictResult
} from '../types/guild-rivalry-rank-predict.type'
import { sortPredictMembersByCombatPower } from './guild-rank-predict.helpers'

/**
 * 전체 길드원을 전투력 내림차순으로 정렬하고, 대항전 포인트를 길드별로 합산합니다.
 * 동점이면 길드 입력 순서 → 이름 순으로 순위를 고정합니다.
 */
function buildRivalryPredictResult(members: readonly RivalryPredictMember[]): RivalryPredictResult {
	const sorted = sortPredictMembersByCombatPower(members)

	const memberRows: RivalryPredictMemberRow[] = sorted.map((member, index) => {
		const rank = index + 1

		return {
			...member,
			rank,
			points: getRivalryRankPoints(rank) ?? 0
		}
	})

	const pointsByGuild = new Map<
		number,
		{ guildName: string; serverLabel: string | null; guildIndex: number; totalPoints: number }
	>()

	for (const row of memberRows) {
		const current = pointsByGuild.get(row.guildIndex)

		if (current) {
			current.totalPoints += row.points
			continue
		}

		pointsByGuild.set(row.guildIndex, {
			guildName: row.guildName,
			serverLabel: row.serverLabel,
			guildIndex: row.guildIndex,
			totalPoints: row.points
		})
	}

	const guildRows: RivalryPredictGuildRow[] = [...pointsByGuild.values()]
		.sort((a, b) => {
			if (a.totalPoints !== b.totalPoints) {
				return b.totalPoints - a.totalPoints
			}

			return a.guildIndex - b.guildIndex
		})
		.map((guild, index) => ({
			rank: index + 1,
			guildName: guild.guildName,
			serverLabel: guild.serverLabel,
			guildIndex: guild.guildIndex,
			totalPoints: guild.totalPoints
		}))

	return { members: memberRows, guilds: guildRows }
}

export { buildRivalryPredictResult }
