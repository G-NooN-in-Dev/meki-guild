import type {
	MemberVsExpeditionGradeField,
	MemberVsLevelField,
	MemberVsMemberComparison,
	MemberVsNumericField,
	MemberVsWinner,
	ParsedGuildMember
} from '@/features/guild/types/guild-snapshot.type'
import { formatExpeditionGradeDelta, getExpeditionGradeDiff } from '@/libs/expedition-guild-tier.constants'
import {
	formatDeltaPercent,
	formatKoreanDelta,
	formatTrainingDelta,
	formatTrainingScore
} from '@/utils/format-korean-number'

function getNumericWinner(left: bigint, right: bigint): MemberVsWinner {
	if (left === right) {
		return 'tie'
	}

	return left > right ? 'left' : 'right'
}

function getLevelWinner(left: number, right: number): MemberVsWinner {
	if (left === right) {
		return 'tie'
	}

	return left > right ? 'left' : 'right'
}

function formatLevelDiff(diff: number): string | null {
	if (diff === 0) {
		return null
	}

	return diff > 0 ? `+${diff}` : `${diff}`
}

function createNumericField(left: bigint, right: bigint, leftLabel: string, rightLabel: string): MemberVsNumericField {
	const diff = left - right

	return {
		left,
		right,
		leftLabel,
		rightLabel,
		diff,
		diffLabel: formatKoreanDelta(diff),
		winner: getNumericWinner(left, right),
		diffPercentLabel: right === 0n ? null : formatDeltaPercent(diff, right)
	}
}

function createTrainingField(left: ParsedGuildMember, right: ParsedGuildMember): MemberVsNumericField {
	const field = createNumericField(
		left.training,
		right.training,
		formatTrainingScore(left.training),
		formatTrainingScore(right.training)
	)

	return {
		...field,
		diffLabel: field.diff === 0n ? '0' : formatTrainingDelta(field.diff)
	}
}

function createExpeditionGradeField(left: string, right: string): MemberVsExpeditionGradeField {
	const diff = getExpeditionGradeDiff(right, left)
	let winner: MemberVsWinner = 'tie'

	if (diff !== null && diff !== 0) {
		// diff > 0이면 left가 더 높은 등급(챌린저1 방향)
		winner = diff > 0 ? 'left' : 'right'
	}

	return {
		left,
		right,
		diff,
		diffLabel: diff === null || diff === 0 ? null : formatExpeditionGradeDelta(diff),
		winner
	}
}

function createLevelField(left: number, right: number): MemberVsLevelField {
	const diff = left - right

	return {
		left,
		right,
		diff,
		diffLabel: formatLevelDiff(diff),
		winner: getLevelWinner(left, right)
	}
}

function createGuildBossField(
	left: ParsedGuildMember,
	right: ParsedGuildMember
): MemberVsMemberComparison['guildBoss'] {
	const leftHasValue = left.hasGuildBoss
	const rightHasValue = right.hasGuildBoss

	if (!leftHasValue && !rightHasValue) {
		return {
			left: 0n,
			right: 0n,
			leftLabel: '-',
			rightLabel: '-',
			diff: 0n,
			diffLabel: null,
			winner: 'tie',
			diffPercentLabel: null,
			leftHasValue: false,
			rightHasValue: false
		}
	}

	if (!leftHasValue || !rightHasValue) {
		const winner: MemberVsWinner = leftHasValue ? 'left' : rightHasValue ? 'right' : 'tie'

		return {
			left: left.guildBoss,
			right: right.guildBoss,
			leftLabel: left.guildBossLabel,
			rightLabel: right.guildBossLabel,
			diff: left.guildBoss - right.guildBoss,
			diffLabel: null,
			winner,
			diffPercentLabel: null,
			leftHasValue,
			rightHasValue
		}
	}

	return {
		...createNumericField(left.guildBoss, right.guildBoss, left.guildBossLabel, right.guildBossLabel),
		leftHasValue: true,
		rightHasValue: true
	}
}

/** 두 길드원의 현재 주 스펙을 1 vs 1 형태로 비교합니다. */
export function compareMembers(left: ParsedGuildMember, right: ParsedGuildMember): MemberVsMemberComparison {
	return {
		left: { name: left.name, job: left.job },
		right: { name: right.name, job: right.job },
		level: createLevelField(left.level, right.level),
		combatPower: createNumericField(left.combatPower, right.combatPower, left.combatPowerLabel, right.combatPowerLabel),
		expeditionGrade: createExpeditionGradeField(left.expedition.grade, right.expedition.grade),
		expeditionScore: createNumericField(
			left.expedition.score,
			right.expedition.score,
			left.expedition.scoreLabel,
			right.expedition.scoreLabel
		),
		rivalry: createNumericField(left.rivalry, right.rivalry, left.rivalryLabel, right.rivalryLabel),
		training: createTrainingField(left, right),
		guildBoss: createGuildBossField(left, right)
	}
}
