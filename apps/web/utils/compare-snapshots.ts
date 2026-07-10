import type {
	GuildMemberComparison,
	GuildMemberInput,
	GuildWeekSnapshot,
	LevelDelta,
	MemberComparisonStatus,
	NumericDelta,
	ParsedGuildMember
} from '@/features/guild/types/guild-snapshot.type'
import { GUILD_UNENTERED_LABEL } from '@/features/guild/types/guild-snapshot.type'
import { formatExpeditionGradeDelta, getExpeditionGradeDiff } from '@/libs/expedition-guild-tier.constants'
import {
	formatDeltaPercent,
	formatKoreanDelta,
	formatTrainingDelta,
	formatTrainingScore
} from '@/utils/format-korean-number'
import { parseKoreanNumber } from '@/utils/parse-korean-number'

function isEmptyInput(value: string | number | undefined): boolean {
	if (value === undefined || value === null) {
		return true
	}

	if (typeof value === 'string') {
		return value.trim() === ''
	}

	return false
}

function toKoreanLabel(value: string | number): string {
	if (typeof value === 'number') {
		return value.toLocaleString('ko-KR')
	}

	return value
}

export function parseGuildMember(member: GuildMemberInput): ParsedGuildMember {
	const hasCombatPower = !isEmptyInput(member.combatPower)
	const hasLevel = member.level > 0
	const hasExpeditionGrade = !isEmptyInput(member.expedition.grade)
	const hasExpeditionScore = !isEmptyInput(member.expedition.score)
	const hasRivalry = !isEmptyInput(member.rivalry)
	const hasTraining = !isEmptyInput(member.training)
	const hasGuildBoss = member.guildBoss !== undefined && !isEmptyInput(member.guildBoss)

	const combatPower = hasCombatPower ? parseKoreanNumber(member.combatPower) : 0n
	const expeditionScore = hasExpeditionScore ? parseKoreanNumber(member.expedition.score) : 0n
	const rivalry = hasRivalry ? parseKoreanNumber(member.rivalry) : 0n
	const training = hasTraining ? parseKoreanNumber(member.training) : 0n
	const guildBossValue = member.guildBoss
	const guildBoss = hasGuildBoss && guildBossValue !== undefined ? parseKoreanNumber(guildBossValue) : 0n

	return {
		name: member.name,
		level: member.level,
		job: member.job,
		combatPower,
		combatPowerLabel: hasCombatPower ? toKoreanLabel(member.combatPower) : GUILD_UNENTERED_LABEL,
		hasCombatPower,
		hasLevel,
		expedition: {
			grade: member.expedition.grade,
			score: expeditionScore,
			scoreLabel: hasExpeditionScore ? toKoreanLabel(member.expedition.score) : GUILD_UNENTERED_LABEL,
			hasGrade: hasExpeditionGrade,
			hasScore: hasExpeditionScore
		},
		rivalry,
		rivalryLabel: hasRivalry ? toKoreanLabel(member.rivalry) : GUILD_UNENTERED_LABEL,
		hasRivalry,
		training,
		trainingLabel: hasTraining ? formatTrainingScore(training) : GUILD_UNENTERED_LABEL,
		hasTraining,
		guildBoss,
		guildBossLabel:
			hasGuildBoss && guildBossValue !== undefined ? toKoreanLabel(guildBossValue) : GUILD_UNENTERED_LABEL,
		hasGuildBoss
	}
}

function createEmptyNumericDelta(): NumericDelta {
	return {
		current: 0n,
		previous: null,
		diff: null,
		currentLabel: GUILD_UNENTERED_LABEL,
		previousLabel: null,
		diffLabel: null,
		diffPercentLabel: null,
		hasValue: false
	}
}

function createNumericDelta(
	current: bigint,
	currentLabel: string,
	hasValue: boolean,
	previous: ParsedGuildMember | null,
	getValue: (_member: ParsedGuildMember) => bigint,
	getLabel: (_member: ParsedGuildMember) => string,
	hasPreviousValue: (_member: ParsedGuildMember) => boolean
): NumericDelta {
	if (!hasValue) {
		return createEmptyNumericDelta()
	}

	if (!previous || !hasPreviousValue(previous)) {
		return {
			current,
			previous: null,
			diff: null,
			currentLabel,
			previousLabel: null,
			diffLabel: null,
			diffPercentLabel: null,
			hasValue: true
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
		diffPercentLabel: formatDeltaPercent(diff, previousValue),
		hasValue: true
	}
}

function withTrainingDelta(delta: NumericDelta): NumericDelta {
	return {
		...delta,
		diffLabel: delta.diff === null ? null : formatTrainingDelta(delta.diff)
	}
}

function createExpeditionGradeDelta(
	current: ParsedGuildMember,
	previous: ParsedGuildMember | null
): GuildMemberComparison['expeditionGrade'] {
	if (!current.expedition.hasGrade) {
		return {
			current: current.expedition.grade,
			previous: null,
			currentLabel: GUILD_UNENTERED_LABEL,
			diff: null,
			diffLabel: null,
			changed: false,
			hasValue: false
		}
	}

	const previousGrade = previous?.expedition.hasGrade ? previous.expedition.grade : null

	if (!previousGrade) {
		return {
			current: current.expedition.grade,
			previous: null,
			currentLabel: current.expedition.grade,
			diff: null,
			diffLabel: null,
			changed: false,
			hasValue: true
		}
	}

	const diff = getExpeditionGradeDiff(previousGrade, current.expedition.grade)

	return {
		current: current.expedition.grade,
		previous: previousGrade,
		currentLabel: current.expedition.grade,
		diff,
		diffLabel: formatExpeditionGradeDelta(diff),
		changed: previousGrade !== current.expedition.grade,
		hasValue: true
	}
}

function formatLevelDelta(diff: number | null): string | null {
	if (diff === null || diff === 0) {
		return null
	}

	return diff > 0 ? `▲${diff}` : `▼${Math.abs(diff)}`
}

function createLevelDelta(current: ParsedGuildMember, previous: ParsedGuildMember | null): LevelDelta {
	if (!current.hasLevel) {
		return {
			current: current.level,
			previous: null,
			diff: null,
			diffLabel: null,
			currentLabel: GUILD_UNENTERED_LABEL,
			hasValue: false
		}
	}

	if (!previous?.hasLevel) {
		return {
			current: current.level,
			previous: null,
			diff: null,
			diffLabel: null,
			currentLabel: String(current.level),
			hasValue: true
		}
	}

	const diff = current.level - previous.level

	return {
		current: current.level,
		previous: previous.level,
		diff,
		diffLabel: formatLevelDelta(diff),
		currentLabel: String(current.level),
		hasValue: true
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
		level: createLevelDelta(current, previous),
		combatPower: createNumericDelta(
			current.combatPower,
			current.combatPowerLabel,
			current.hasCombatPower,
			previous,
			(member) => member.combatPower,
			(member) => member.combatPowerLabel,
			(member) => member.hasCombatPower
		),
		expeditionScore: createNumericDelta(
			current.expedition.score,
			current.expedition.scoreLabel,
			current.expedition.hasScore,
			previous,
			(member) => member.expedition.score,
			(member) => member.expedition.scoreLabel,
			(member) => member.expedition.hasScore
		),
		expeditionGrade: createExpeditionGradeDelta(current, previous),
		rivalry: createNumericDelta(
			current.rivalry,
			current.rivalryLabel,
			current.hasRivalry,
			previous,
			(member) => member.rivalry,
			(member) => member.rivalryLabel,
			(member) => member.hasRivalry
		),
		training: withTrainingDelta(
			createNumericDelta(
				current.training,
				current.trainingLabel,
				current.hasTraining,
				previous,
				(member) => member.training,
				(member) => member.trainingLabel,
				(member) => member.hasTraining
			)
		),
		guildBoss: createNumericDelta(
			current.guildBoss,
			current.guildBossLabel,
			current.hasGuildBoss,
			previous,
			(member) => member.guildBoss,
			(member) => member.guildBossLabel,
			(member) => member.hasGuildBoss
		)
	}
}

function buildLeftMemberComparison(previous: ParsedGuildMember): GuildMemberComparison {
	return {
		name: previous.name,
		job: previous.job,
		status: 'left',
		level: {
			current: 0,
			previous: previous.hasLevel ? previous.level : null,
			diff: previous.hasLevel ? -previous.level : null,
			currentLabel: GUILD_UNENTERED_LABEL,
			diffLabel: previous.hasLevel ? formatLevelDelta(-previous.level) : null,
			hasValue: false
		},
		combatPower: {
			current: 0n,
			previous: previous.hasCombatPower ? previous.combatPower : null,
			diff: previous.hasCombatPower ? -previous.combatPower : null,
			currentLabel: GUILD_UNENTERED_LABEL,
			previousLabel: previous.hasCombatPower ? previous.combatPowerLabel : null,
			diffLabel: previous.hasCombatPower ? formatKoreanDelta(-previous.combatPower) : null,
			diffPercentLabel: previous.hasCombatPower
				? formatDeltaPercent(-previous.combatPower, previous.combatPower)
				: null,
			hasValue: false
		},
		expeditionScore: {
			current: 0n,
			previous: previous.expedition.hasScore ? previous.expedition.score : null,
			diff: previous.expedition.hasScore ? -previous.expedition.score : null,
			currentLabel: GUILD_UNENTERED_LABEL,
			previousLabel: previous.expedition.hasScore ? previous.expedition.scoreLabel : null,
			diffLabel: previous.expedition.hasScore ? formatKoreanDelta(-previous.expedition.score) : null,
			diffPercentLabel: previous.expedition.hasScore
				? formatDeltaPercent(-previous.expedition.score, previous.expedition.score)
				: null,
			hasValue: false
		},
		expeditionGrade: {
			current: previous.expedition.grade,
			previous: previous.expedition.hasGrade ? previous.expedition.grade : null,
			currentLabel: GUILD_UNENTERED_LABEL,
			diff: null,
			diffLabel: null,
			changed: previous.expedition.hasGrade,
			hasValue: false
		},
		rivalry: {
			current: 0n,
			previous: previous.hasRivalry ? previous.rivalry : null,
			diff: previous.hasRivalry ? -previous.rivalry : null,
			currentLabel: GUILD_UNENTERED_LABEL,
			previousLabel: previous.hasRivalry ? previous.rivalryLabel : null,
			diffLabel: previous.hasRivalry ? formatKoreanDelta(-previous.rivalry) : null,
			diffPercentLabel: previous.hasRivalry ? formatDeltaPercent(-previous.rivalry, previous.rivalry) : null,
			hasValue: false
		},
		training: withTrainingDelta({
			current: 0n,
			previous: previous.hasTraining ? previous.training : null,
			diff: previous.hasTraining ? -previous.training : null,
			currentLabel: GUILD_UNENTERED_LABEL,
			previousLabel: previous.hasTraining ? previous.trainingLabel : null,
			diffLabel: previous.hasTraining ? formatTrainingDelta(-previous.training) : null,
			diffPercentLabel: previous.hasTraining ? formatDeltaPercent(-previous.training, previous.training) : null,
			hasValue: false
		}),
		guildBoss: {
			current: 0n,
			previous: previous.hasGuildBoss ? previous.guildBoss : null,
			diff: previous.hasGuildBoss ? -previous.guildBoss : null,
			currentLabel: GUILD_UNENTERED_LABEL,
			previousLabel: previous.hasGuildBoss ? previous.guildBossLabel : null,
			diffLabel: previous.hasGuildBoss ? formatKoreanDelta(-previous.guildBoss) : null,
			diffPercentLabel: previous.hasGuildBoss ? formatDeltaPercent(-previous.guildBoss, previous.guildBoss) : null,
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

		const leftPower = left.combatPower.hasValue ? left.combatPower.current : -1n
		const rightPower = right.combatPower.hasValue ? right.combatPower.current : -1n

		if (leftPower === rightPower) {
			return left.name.localeCompare(right.name, 'ko')
		}

		return leftPower > rightPower ? -1 : 1
	})
}
