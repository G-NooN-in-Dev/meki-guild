import type { CheerioAPI } from 'cheerio'
import { load } from 'cheerio'

import type { MgfGuildInfoResponse, MgfGuildMemberDto } from '@/features/tips/types/guild-rank-predict.type'
import { formatKoreanNumber } from '@/utils/format-korean-number'

import { MgfRequestError, parseMgfLevel, toMgfPortraitProxyUrl } from './mgf.client.server'
import { getMgfGuildInfoHtml } from './mgf-guild-info.service.server'

function parseMemberJob(jobFromAlt: string | undefined, subText: string): string {
	const trimmedAlt = jobFromAlt?.trim()
	if (trimmedAlt) {
		return trimmedAlt
	}

	const normalized = subText.replace(/\s+/g, ' ').trim()
	const beforeSep = normalized.split('|')[0]?.trim() ?? ''
	return beforeSep.replace(/Lv\.?\s*\d+/i, '').trim()
}

function parseMembersFromHtml($: CheerioAPI): MgfGuildMemberDto[] {
	const members: MgfGuildMemberDto[] = []

	$('.member-row').each((_, row) => {
		const $row = $(row)
		const name =
			$row.find('.nick-link').attr('title')?.trim() || $row.find('.nick-link').text().replace(/\s+/g, ' ').trim()

		if (!name) {
			return
		}

		const bpRaw = $row.attr('data-bp')?.trim() ?? '0'
		let combatPower: bigint

		try {
			combatPower = BigInt(bpRaw)
		} catch {
			combatPower = 0n
		}

		const combatPowerLabel =
			$row.find('.only-bp .power-tooltip').first().text().trim() ||
			$row.find('.only-bp .power-text').first().text().trim() ||
			formatKoreanNumber(combatPower)

		const subText = $row.find('.member-sub').text()

		members.push({
			name,
			job: parseMemberJob($row.find('.job-icon-sm').attr('alt'), subText),
			level: parseMgfLevel(subText),
			combatPower: combatPower.toString(),
			combatPowerLabel,
			// mgf 직접 URL은 Referer 핫링크 차단 → same-origin 프록시
			portraitUrl: toMgfPortraitProxyUrl(name)
		})
	})

	return members
}

/**
 * 길드명으로 mgf 길드 정보를 조회·파싱합니다.
 * 길드가 없거나 멤버를 못 찾으면 MgfRequestError를 던집니다.
 */
async function loadMgfGuildInfo(guildName: string): Promise<MgfGuildInfoResponse> {
	const trimmed = guildName.trim()

	if (!trimmed) {
		throw new MgfRequestError('길드명을 입력해 주세요.', 400)
	}

	const html = await getMgfGuildInfoHtml(trimmed)
	const $ = load(html)

	if (html.includes('길드를 찾을 수 없습니다')) {
		throw new MgfRequestError(`「${trimmed}」 길드를 찾을 수 없습니다.`, 404)
	}

	const resolvedGuildName = $('.guild-name').first().text().replace(/\s+/g, ' ').trim() || trimmed
	const serverLabel = $('.server-chip').first().text().replace(/\s+/g, ' ').trim() || null
	const members = parseMembersFromHtml($)

	if (members.length === 0) {
		throw new MgfRequestError(`「${resolvedGuildName}」 길드원 정보를 파싱하지 못했습니다.`, 502)
	}

	return {
		guildName: resolvedGuildName,
		serverLabel,
		members
	}
}

export { loadMgfGuildInfo }
