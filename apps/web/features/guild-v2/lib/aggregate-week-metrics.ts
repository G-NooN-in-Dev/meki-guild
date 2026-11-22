import { sumGuildExpeditionGradePoints } from '@/features/guild/lib/guild-expedition-tier.constants'
import { parseGuildMember } from '@/features/guild/lib/parse-guild-member'
import type { GuildWeekSnapshot, ParsedGuildMember } from '@/features/guild/types/guild-snapshot.type'
import type { GuildMetricPoint, GuildWeekSlot } from '@/features/guild-v2/types/guild-v2-dashboard.type'
import type { GuildContentDateRange } from '@/libs/guild-content-dates.constants'

const WEEK_SLOTS: GuildWeekSlot[] = ['older', 'previous', 'current']

function bigintToChartNumber(value: bigint): number {
	return Number(value)
}

function average(values: number[]): number | null {
	if (values.length === 0) {
		return null
	}

	return values.reduce((sum, value) => sum + value, 0) / values.length
}

function parseWeekMembers(week: GuildWeekSnapshot): ParsedGuildMember[] {
	return week.members.map(parseGuildMember)
}

/** 한 주 스냅샷에서 차트용 스칼라 지표를 뽑습니다. */
function aggregateWeekScalars(week: GuildWeekSnapshot) {
	const members = parseWeekMembers(week)
	const combatPowers = members.filter((member) => member.hasCombatPower).map((member) => member.combatPower)
	const levels = members.filter((member) => member.hasLevel).map((member) => member.level)
	const huntingScores = members.filter((member) => member.hasBounty).map((member) => member.huntingScore)
	const bountyStages = members.filter((member) => member.hasBounty).map((member) => member.bounty)
	const expeditionScores = members
		.filter((member) => member.expedition.hasScore)
		.map((member) => member.expedition.score)
	const expeditionGrades = members
		.filter((member) => member.expedition.hasGrade)
		.map((member) => member.expedition.grade)
	const rivalryScores = members.filter((member) => member.hasRivalry).map((member) => member.rivalry)
	const trainingScores = members.filter((member) => member.hasTraining).map((member) => member.training)
	const guildBossScores = members.filter((member) => member.hasGuildBoss).map((member) => member.guildBoss)

	const totalCombatPower = combatPowers.reduce((sum, value) => sum + value, 0n)
	const totalHuntingScore = huntingScores.reduce((sum, value) => sum + value, 0n)
	const totalExpeditionScore = expeditionScores.reduce((sum, value) => sum + value, 0n)
	const totalRivalryScore = rivalryScores.reduce((sum, value) => sum + value, 0n)
	const totalTrainingScore = trainingScores.reduce((sum, value) => sum + value, 0n)
	const totalGuildBossScore = guildBossScores.reduce((sum, value) => sum + value, 0n)
	const averageLevelRaw = average(levels)
	const averageBountyStageRaw = average(bountyStages)

	return {
		totalCombatPower: combatPowers.length > 0 ? bigintToChartNumber(totalCombatPower) : null,
		/** 평균 레벨·클리어 단계는 정수로 반올림해 표시·차트에 동일하게 씁니다. */
		averageLevel: averageLevelRaw === null ? null : Math.round(averageLevelRaw),
		totalHuntingScore: huntingScores.length > 0 ? bigintToChartNumber(totalHuntingScore) : null,
		averageBountyStage: averageBountyStageRaw === null ? null : Math.round(averageBountyStageRaw),
		bountyRank: week.guild?.bountyRank ?? null,
		allBountyRank: week.guild?.allBountyRank ?? null,
		totalExpeditionScore: expeditionScores.length > 0 ? bigintToChartNumber(totalExpeditionScore) : null,
		/** 토벌전 길드 포인트 = 개인 등급 포인트 합 (guild 탭 전용 열 없음) */
		expeditionGuildPoints: expeditionGrades.length > 0 ? sumGuildExpeditionGradePoints(expeditionGrades) : null,
		expeditionRank: week.guild?.expeditionRank ?? null,
		totalRivalryScore: rivalryScores.length > 0 ? bigintToChartNumber(totalRivalryScore) : null,
		rivalryRank: week.guild?.rivalryRank ?? null,
		totalTrainingScore: trainingScores.length > 0 ? bigintToChartNumber(totalTrainingScore) : null,
		trainingRank: week.guild?.trainingRank ?? null,
		totalGuildBossScore: guildBossScores.length > 0 ? bigintToChartNumber(totalGuildBossScore) : null
	}
}

type WeekScalars = ReturnType<typeof aggregateWeekScalars>

function pointLabel(collectedAt: string | null, slot: GuildWeekSlot): string {
	if (collectedAt) {
		return collectedAt.slice(5).replace('-', '.')
	}

	if (slot === 'current') return '최신'
	if (slot === 'previous') return '직전'
	return '-'
}

function buildSeriesPoints(
	weeks: Record<GuildWeekSlot, GuildWeekSnapshot>,
	dateRange: GuildContentDateRange | undefined,
	pick: (_scalars: WeekScalars) => number | null
): Array<Omit<GuildMetricPoint, 'changeDeltaLabel' | 'changePercentLabel'>> {
	return WEEK_SLOTS.map((slot) => {
		const collectedAt = dateRange?.[slot] ?? null
		const scalars = aggregateWeekScalars(weeks[slot])

		return {
			slot,
			label: pointLabel(collectedAt, slot),
			collectedAt,
			value: pick(scalars)
		}
	})
}

function countRosterChanges(current: GuildWeekSnapshot, previous: GuildWeekSnapshot) {
	const currentNames = new Set(current.members.map((member) => member.name))
	const previousNames = new Set(previous.members.map((member) => member.name))

	let newCount = 0
	let leftCount = 0

	for (const name of currentNames) {
		if (!previousNames.has(name)) {
			newCount += 1
		}
	}

	for (const name of previousNames) {
		if (!currentNames.has(name)) {
			leftCount += 1
		}
	}

	return { newCount, leftCount }
}

export { aggregateWeekScalars, buildSeriesPoints, countRosterChanges, WEEK_SLOTS }
export type { WeekScalars }
