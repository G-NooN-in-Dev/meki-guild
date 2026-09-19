import type { CheerioAPI } from 'cheerio'
import { load } from 'cheerio'

import type { MgfGuildInfoResponse, MgfGuildMemberDto } from '@/features/tips/types/guild-rank-predict.type'
import { formatKoreanNumber } from '@/utils/format-korean-number'

import { getMgfGuildInfoHtml, MGF_ORIGIN } from './mgf-guild-info.service.server'

class MgfGuildInfoError extends Error {
	readonly status: number

	constructor(message: string, status: number) {
		super(message)
		this.name = 'MgfGuildInfoError'
		this.status = status
	}
}

function toAbsoluteMgfUrl(src: string | undefined): string | null {
	if (!src) {
		return null
	}

	try {
		return new URL(src, MGF_ORIGIN).href
	} catch {
		return null
	}
}

function parseMemberLevel(subText: string): number {
	const match = subText.match(/Lv\.?\s*(\d+)/i)
	if (!match) {
		return 0
	}

	return Number.parseInt(match[1] ?? '0', 10)
}

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
		const portraitSrc = $row.find('.char-img').attr('src')

		members.push({
			name,
			job: parseMemberJob($row.find('.job-icon-sm').attr('alt'), subText),
			level: parseMemberLevel(subText),
			combatPower: combatPower.toString(),
			combatPowerLabel,
			portraitUrl: toAbsoluteMgfUrl(portraitSrc)
		})
	})

	return members
}

/**
 * 길드명으로 mgf 길드 정보를 조회·파싱합니다.
 * 길드가 없거나 멤버를 못 찾으면 MgfGuildInfoError를 던집니다.
 */
async function loadMgfGuildInfo(guildName: string): Promise<MgfGuildInfoResponse> {
	const trimmed = guildName.trim()

	if (!trimmed) {
		throw new MgfGuildInfoError('길드명을 입력해 주세요.', 400)
	}

	const html = await getMgfGuildInfoHtml(trimmed)
	const $ = load(html)

	if (html.includes('길드를 찾을 수 없습니다')) {
		throw new MgfGuildInfoError(`「${trimmed}」 길드를 찾을 수 없습니다.`, 404)
	}

	const resolvedGuildName = $('.guild-name').first().text().replace(/\s+/g, ' ').trim() || trimmed
	const serverLabel = $('.server-chip').first().text().replace(/\s+/g, ' ').trim() || null
	const members = parseMembersFromHtml($)

	if (members.length === 0) {
		throw new MgfGuildInfoError(`「${resolvedGuildName}」 길드원 정보를 파싱하지 못했습니다.`, 502)
	}

	return {
		guildName: resolvedGuildName,
		serverLabel,
		members
	}
}

export { loadMgfGuildInfo, MgfGuildInfoError }
