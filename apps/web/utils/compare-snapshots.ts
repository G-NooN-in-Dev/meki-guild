import type {
	GuildMemberComparison,
	GuildMemberInput,
	GuildWeekSnapshot,
	LevelDelta,
	MemberComparisonStatus,
	NumericDelta,
	ParsedGuildMember
} from '@/features/guild/types/guild-snapshot.type'
import { formatExpeditionGradeDelta, getExpeditionGradeDiff } from '@/libs/expedition-guild-tier.constants'
import {
	formatDeltaPercent,
	formatKoreanDelta,
	formatTrainingDelta,
	formatTrainingScore
} from '@/utils/format-korean-number'
import { parseKoreanNumber } from '@/utils/parse-korean-number'

function toKoreanLabel(value: string | number): string {
	if (typeof value === 'number') {
		return value.toLocaleString('ko-KR')
	}

	return value
}

export function parseGuildMember(member: GuildMemberInput): ParsedGuildMember {
	const combatPower = parseKoreanNumber(member.combatPower)
	const expeditionScore = parseKoreanNumber(member.expedition.score)
	const rivalry = parseKoreanNumber(member.rivalry)
	const training = parseKoreanNumber(member.training)
	const hasGuildBoss = member.guildBoss !== undefined && member.guildBoss !== ''
	const guildBossValue = member.guildBoss
	const guildBoss = hasGuildBoss && guildBossValue !== undefined ? parseKoreanNumber(guildBossValue) : 0n
	const guildBossLabel = hasGuildBoss && guildBossValue !== undefined ? toKoreanLabel(guildBossValue) : '-'

	return {
		name: member.name,
		level: member.level,
		job: member.job,
		combatPower,
		combatPowerLabel: toKoreanLabel(member.combatPower),
		expedition: {
			grade: member.expedition.grade,
			score: expeditionScore,
			scoreLabel: toKoreanLabel(member.expedition.score)
		},
		rivalry,
		rivalryLabel: toKoreanLabel(member.rivalry),
		training,
		trainingLabel: formatTrainingScore(training),
		guildBoss,
		guildBossLabel,
		hasGuildBoss
	}
}

function createGuildBossDelta(
	current: ParsedGuildMember,
	previous: ParsedGuildMember | null
): GuildMemberComparison['guildBoss'] {
	if (!current.hasGuildBoss) {
		return {
			current: 0n,
			previous: null,
			diff: null,
			currentLabel: '-',
			previousLabel: null,
			diffLabel: null,
			diffPercentLabel: null,
			hasValue: false
		}
	}

	const previousMember = previous?.hasGuildBoss ? previous : null

	return {
		...createNumericDelta(
			current.guildBoss,
			current.guildBossLabel,
			previousMember,
			(member) => member.guildBoss,
			(member) => member.guildBossLabel
		),
		hasValue: true
	}
}

function withTrainingDelta(delta: NumericDelta): NumericDelta {
	return {
		...delta,
		diffLabel: delta.diff === null ? null : formatTrainingDelta(delta.diff)
	}
}

function createNumericDelta(
	current: bigint,
	currentLabel: string,
	previous: ParsedGuildMember | null,
	getValue: (_member: ParsedGuildMember) => bigint,
	getLabel: (_member: ParsedGuildMember) => string
): NumericDelta {
	if (!previous) {
		return {
			current,
			previous: null,
			diff: null,
			currentLabel,
			previousLabel: null,
			diffLabel: null,
			diffPercentLabel: null
		}
	}

	const previousValue = getValue(previous)
	const diff = current - previousValue

	return {
		current,
		previous: previousValue,
		diff,
		currentLabel,
		previousLabel: getLabel(previous),
		diffLabel: formatKoreanDelta(diff),
		diffPercentLabel: formatDeltaPercent(diff, previousValue)
	}
}

function createExpeditionGradeDelta(
	current: string,
	previous: string | null
): GuildMemberComparison['expeditionGrade'] {
	if (!previous) {
		return {
			current,
			previous: null,
			diff: null,
			diffLabel: null,
			changed: false
		}
	}

	const diff = getExpeditionGradeDiff(previous, current)

	return {
		current,
		previous,
		diff,
		diffLabel: formatExpeditionGradeDelta(diff),
		changed: previous !== current
	}
}

function formatLevelDelta(diff: number | null): string | null {
	if (diff === null || diff === 0) {
		return null
	}

	return diff > 0 ? `▲${diff}` : `▼${Math.abs(diff)}`
}

function createLevelDelta(current: number, previous: number | null): LevelDelta {
	if (previous === null) {
		return {
			current,
			previous: null,
			diff: null,
			diffLabel: null
		}
	}

	const diff = current - previous

	return {
		current,
		previous,
		diff,
		diffLabel: formatLevelDelta(diff)
	}
}

function buildComparison(
	current: ParsedGuildMember,
	previous: ParsedGuildMember | null,
	status: MemberComparisonStatus
): GuildMemberComparison {
	return {
		name: current.name,
		job: current.job,
		status,
		level: createLevelDelta(current.level, previous?.level ?? null),
		combatPower: createNumericDelta(
			current.combatPower,
			current.combatPowerLabel,
			previous,
			(member) => member.combatPower,
			(member) => member.combatPowerLabel
		),
		expeditionScore: createNumericDelta(
			current.expedition.score,
			current.expedition.scoreLabel,
			previous,
			(member) => member.expedition.score,
			(member) => member.expedition.scoreLabel
		),
		expeditionGrade: createExpeditionGradeDelta(current.expedition.grade, previous?.expedition.grade ?? null),
		rivalry: createNumericDelta(
			current.rivalry,
			current.rivalryLabel,
			previous,
			(member) => member.rivalry,
			(member) => member.rivalryLabel
		),
		training: withTrainingDelta(
			createNumericDelta(
				current.training,
				formatTrainingScore(current.training),
				previous,
				(member) => member.training,
				(member) => member.trainingLabel
			)
		),
		guildBoss: createGuildBossDelta(current, previous)
	}
}

function buildLeftMemberComparison(previous: ParsedGuildMember): GuildMemberComparison {
	return {
		name: previous.name,
		job: previous.job,
		status: 'left',
		level: createLevelDelta(previous.level, previous.level),
		combatPower: {
			current: 0n,
			previous: previous.combatPower,
			diff: -previous.combatPower,
			currentLabel: '-',
			previousLabel: previous.combatPowerLabel,
			diffLabel: formatKoreanDelta(-previous.combatPower),
			diffPercentLabel: formatDeltaPercent(-previous.combatPower, previous.combatPower)
		},
		expeditionScore: {
			current: 0n,
			previous: previous.expedition.score,
			diff: -previous.expedition.score,
			currentLabel: '-',
			previousLabel: previous.expedition.scoreLabel,
			diffLabel: formatKoreanDelta(-previous.expedition.score),
			diffPercentLabel: formatDeltaPercent(-previous.expedition.score, previous.expedition.score)
		},
		expeditionGrade: {
			current: '-',
			previous: previous.expedition.grade,
			diff: null,
			diffLabel: null,
			changed: true
		},
		rivalry: {
			current: 0n,
			previous: previous.rivalry,
			diff: -previous.rivalry,
			currentLabel: '-',
			previousLabel: previous.rivalryLabel,
			diffLabel: formatKoreanDelta(-previous.rivalry),
			diffPercentLabel: formatDeltaPercent(-previous.rivalry, previous.rivalry)
		},
		training: withTrainingDelta({
			current: 0n,
			previous: previous.training,
			diff: -previous.training,
			currentLabel: '-',
			previousLabel: previous.trainingLabel,
			diffLabel: formatTrainingDelta(-previous.training),
			diffPercentLabel: formatDeltaPercent(-previous.training, previous.training)
		}),
		guildBoss: previous.hasGuildBoss
			? {
					current: 0n,
					previous: previous.guildBoss,
					diff: -previous.guildBoss,
					currentLabel: '-',
					previousLabel: previous.guildBossLabel,
					diffLabel: formatKoreanDelta(-previous.guildBoss),
					diffPercentLabel: formatDeltaPercent(-previous.guildBoss, previous.guildBoss),
					hasValue: false
				}
			: {
					current: 0n,
					previous: null,
					diff: null,
					currentLabel: '-',
					previousLabel: null,
					diffLabel: null,
					diffPercentLabel: null,
					hasValue: false
				}
	}
}

export function compareSnapshots(
	currentWeek: GuildWeekSnapshot,
	previousWeek: GuildWeekSnapshot
): GuildMemberComparison[] {
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

		const leftPower = left.combatPower.current
		const rightPower = right.combatPower.current

		if (leftPower === rightPower) {
			return left.name.localeCompare(right.name, 'ko')
		}

		return leftPower > rightPower ? -1 : 1
	})
}
