import type { MgfGuildInfoResponse, RankPredictMember } from '../types/guild-rank-predict.type'

/** 입력 슬롯에서 비어 있지 않은 길드명만 뽑습니다. */
function collectGuildNames(inputs: readonly string[]): string[] {
	return inputs.map((value) => value.trim()).filter((value) => value.length > 0)
}

/** UI 단계 전환용 짧은 지연 */
function wait(ms: number) {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, ms)
	})
}

async function fetchGuildInfo(guildName: string): Promise<MgfGuildInfoResponse> {
	const response = await fetch(`/api/tips/guild-info?g_name=${encodeURIComponent(guildName)}`)
	const body = (await response.json()) as MgfGuildInfoResponse & { message?: string }

	if (!response.ok) {
		throw new Error(body.message ?? `「${guildName}」 길드 정보를 조회하지 못했습니다.`)
	}

	return body
}

/** API 응답을 클라이언트 계산용 길드원으로 변환합니다. */
function toPredictMembers(guildIndex: number, guildName: string, response: MgfGuildInfoResponse): RankPredictMember[] {
	return response.members.map((member) => ({
		name: member.name,
		job: member.job,
		level: member.level,
		combatPower: BigInt(member.combatPower),
		combatPowerLabel: member.combatPowerLabel,
		portraitUrl: member.portraitUrl,
		guildName,
		serverLabel: response.serverLabel,
		guildIndex
	}))
}

/**
 * 전투력 내림차순 정렬.
 * 동점이면 길드 입력 순서 → 이름 순으로 순위를 고정합니다.
 */
function sortPredictMembersByCombatPower(members: readonly RankPredictMember[]): RankPredictMember[] {
	return [...members].sort((a, b) => {
		if (a.combatPower !== b.combatPower) {
			return a.combatPower > b.combatPower ? -1 : 1
		}

		if (a.guildIndex !== b.guildIndex) {
			return a.guildIndex - b.guildIndex
		}

		return a.name.localeCompare(b.name, 'ko')
	})
}

export { collectGuildNames, fetchGuildInfo, sortPredictMembersByCombatPower, toPredictMembers, wait }
