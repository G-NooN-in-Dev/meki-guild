import type { ParsedGuildMember } from '@/features/guild/types/guild-snapshot.type'
import { formatRankArrowDelta } from '@/utils/format-delta-label'

/**
 * 멤버별 순위를 담는 객체 (이름 → 등수).
 * Server→Client 직렬화를 위해 Map 대신 plain object를 사용합니다.
 */
type RankingMap = Record<string, number>

/** 순위 표시 대상 항목들의 등수 모음. 레벨은 순위 기준이 아니므로 제외. */
type MemberRankings = {
	combatPower: RankingMap
	/** 토벌전 등수. 숫자가 작을수록 상위(1위가 최고) */
	expeditionPlacement: RankingMap
	expeditionScore: RankingMap
	rivalry: RankingMap
	training: RankingMap
	guildBoss: RankingMap
}

/**
 * 전체 길드원을 받아 항목별 길드 내 등수를 계산합니다.
 * 값이 없는(hasXxx = false) 멤버는 순위에서 제외됩니다.
 * 동점은 같은 등수를 부여합니다 (1, 2, 2, 4 방식).
 */
function computeMemberRankings(members: ParsedGuildMember[]): MemberRankings {
	return {
		combatPower: computeRank(members, (m) => (m.hasCombatPower ? m.combatPower : null)),
		expeditionPlacement: computeRankAsc(members, (m) => (m.expedition.hasPlacement ? m.expedition.placement : null)),
		expeditionScore: computeRank(members, (m) => (m.expedition.hasScore ? m.expedition.score : null)),
		rivalry: computeRank(members, (m) => (m.hasRivalry ? m.rivalry : null)),
		training: computeRank(members, (m) => (m.hasTraining ? m.training : null)),
		guildBoss: computeRank(members, (m) => (m.hasGuildBoss ? m.guildBoss : null))
	}
}

/** 값이 큰 순서로 등수를 매깁니다. null이면 순위에서 제외. */
function computeRank(members: ParsedGuildMember[], getValue: (m: ParsedGuildMember) => bigint | null): RankingMap {
	const entries = members
		.map((m) => ({ name: m.name, value: getValue(m) }))
		.filter((e): e is { name: string; value: bigint } => e.value !== null)
		.sort((a, b) => (b.value > a.value ? 1 : b.value < a.value ? -1 : 0))

	const map: RankingMap = {}
	let rank = 1
	let prevRank = 1
	let prevValue: bigint | null = null

	for (const entry of entries) {
		if (prevValue !== null && entry.value === prevValue) {
			// 동점 처리: 직전과 같은 등수
			map[entry.name] = prevRank
		} else {
			map[entry.name] = rank
			prevRank = rank
		}
		prevValue = entry.value
		rank++
	}

	return map
}

/** 값이 작은 순서로 등수를 매깁니다. 토벌전 등수처럼 숫자가 작을수록 상위인 항목에 사용합니다. */
function computeRankAsc(members: ParsedGuildMember[], getValue: (m: ParsedGuildMember) => number | null): RankingMap {
	const entries = members
		.map((m) => ({ name: m.name, value: getValue(m) }))
		.filter((e): e is { name: string; value: number } => e.value !== null)
		.sort((a, b) => a.value - b.value)

	const map: RankingMap = {}
	let rank = 1
	let prevRank = 1
	let prevValue: number | null = null

	for (const entry of entries) {
		if (prevValue !== null && entry.value === prevValue) {
			map[entry.name] = prevRank
		} else {
			map[entry.name] = rank
			prevRank = rank
		}
		prevValue = entry.value
		rank++
	}

	return map
}

/** 길드 내 순위 라벨 (예: "1위"). 등수 정보가 없으면 null */
function formatRankLabel(rankingMap: RankingMap, memberName: string): string | null {
	const rank = rankingMap[memberName]
	if (rank === undefined) return null
	return `${rank}위`
}

/**
 * 순위 변동 라벨. 등수가 낮아지면(숫자 감소) 상승(▲), 높아지면(숫자 증가) 하락(▼).
 * 변동 없거나 비교 불가면 null.
 */
function formatRankDiffLabel(currentMap: RankingMap, previousMap: RankingMap, memberName: string): string | null {
	const current = currentMap[memberName]
	const previous = previousMap[memberName]

	if (current === undefined || previous === undefined) return null

	return formatRankArrowDelta(current - previous)
}

/** 순위에 참여한 전체 인원 수 */
function getRankingTotal(rankingMap: RankingMap): number {
	return Object.keys(rankingMap).length
}

export { computeMemberRankings, formatRankDiffLabel, formatRankLabel, getRankingTotal }
export type { MemberRankings, RankingMap }
