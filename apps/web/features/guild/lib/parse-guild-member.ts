import type { GuildMemberInput, ParsedGuildMember } from '@/features/guild/types/guild-snapshot.type'
import { GUILD_EMPTY_VALUE_LABEL } from '@/features/guild/types/guild-snapshot.type'
import { formatLocaleNumber, formatPlacementRank, formatTrainingScore } from '@/utils/format-korean-number'
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
		return formatLocaleNumber(value)
	}

	return value
}

/** 토벌전 등수 입력값을 정수로 파싱. null·0 이하는 미입력 */
function parsePlacementInput(value: number | null | undefined): { hasPlacement: boolean; placement: number } {
	if (value === null || value === undefined) {
		return { hasPlacement: false, placement: 0 }
	}

	if (!Number.isFinite(value) || value <= 0) {
		return { hasPlacement: false, placement: 0 }
	}

	return { hasPlacement: true, placement: Math.floor(value) }
}

function parseGuildMember(member: GuildMemberInput): ParsedGuildMember {
	const hasCombatPower = !isEmptyInput(member.combatPower)
	const hasLevel = member.level > 0
	const hasExpeditionGrade = !isEmptyInput(member.expedition.grade)
	const hasExpeditionScore = !isEmptyInput(member.expedition.score)
	const { hasPlacement, placement } = parsePlacementInput(member.expedition.placement)
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
		combatPowerLabel: hasCombatPower ? toKoreanLabel(member.combatPower) : GUILD_EMPTY_VALUE_LABEL,
		hasCombatPower,
		hasLevel,
		expedition: {
			grade: member.expedition.grade,
			score: expeditionScore,
			scoreLabel: hasExpeditionScore ? toKoreanLabel(member.expedition.score) : GUILD_EMPTY_VALUE_LABEL,
			hasGrade: hasExpeditionGrade,
			hasScore: hasExpeditionScore,
			placement,
			// 메인 테이블·1vs1·상세 Dialog가 같은 `N위` 표기를 쓰도록 여기서 통일
			placementLabel: hasPlacement ? formatPlacementRank(placement) : GUILD_EMPTY_VALUE_LABEL,
			hasPlacement
		},
		rivalry,
		rivalryLabel: hasRivalry ? toKoreanLabel(member.rivalry) : GUILD_EMPTY_VALUE_LABEL,
		hasRivalry,
		training,
		trainingLabel: hasTraining ? formatTrainingScore(training) : GUILD_EMPTY_VALUE_LABEL,
		hasTraining,
		guildBoss,
		guildBossLabel:
			hasGuildBoss && guildBossValue !== undefined ? toKoreanLabel(guildBossValue) : GUILD_EMPTY_VALUE_LABEL,
		hasGuildBoss
	}
}

export { parseGuildMember }
