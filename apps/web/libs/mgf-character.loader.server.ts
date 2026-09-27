import type { CheerioAPI } from 'cheerio'
import { load } from 'cheerio'

import type { MgfCharacterBossDto, MgfCharacterDto } from '@/features/tips/types/character-compare.type'
import { formatKoreanNumber } from '@/utils/format-korean-number'
import { parseKoreanNumber } from '@/utils/parse-korean-number'

import { MGF_ORIGIN, MgfRequestError, parseMgfLevel, toMgfPortraitProxyUrl } from './mgf.client.server'
import { getMgfCharacterHtml } from './mgf-character.service.server'

type CheerioSelection = ReturnType<CheerioAPI>

/**
 * 닉네임으로 mgf 캐릭터 정보를 조회·파싱합니다.
 * 캐릭터가 없거나 프로필 카드를 못 찾으면 MgfRequestError를 던집니다.
 */
async function loadMgfCharacter(nickname: string): Promise<MgfCharacterDto> {
	const trimmed = nickname.trim()

	if (!trimmed) {
		throw new MgfRequestError('닉네임을 입력해 주세요.', 400)
	}

	const html = await getMgfCharacterHtml(trimmed)
	const $ = load(html)

	if (html.includes('캐릭터를 찾을 수 없') || html.includes('존재하지 않는 닉네임')) {
		throw new MgfRequestError(`「${trimmed}」 캐릭터를 찾을 수 없습니다.`, 404)
	}

	const $card = $('.profile-card').first()

	if ($card.length === 0) {
		throw new MgfRequestError(`「${trimmed}」 캐릭터 정보를 파싱하지 못했습니다.`, 502)
	}

	return parseCharacterFromCard($, $card, trimmed)
}

function parseCharacterFromCard($: CheerioAPI, $card: CheerioSelection, fallbackName: string): MgfCharacterDto {
	const nickText = $card
		.find('.profile-nick')
		.first()
		.clone()
		.children()
		.remove()
		.end()
		.text()
		.replace(/\s+/g, ' ')
		.trim()
	const name = nickText || fallbackName

	const popularityText = $card.find('.badge-popularity').first().text()
	const popularity = parseLocaleInt(popularityText)

	const $guild = $card.find('.profile-guild-tag').first()
	const guildFromHref = parseGuildNameFromHref($guild.attr('href'))
	const guildFromText = $guild
		.clone()
		.children()
		.remove()
		.end()
		.text()
		.replace(/^🏰\s*/, '')
		.replace(/\s+/g, ' ')
		.trim()
	const guildName = guildFromHref || guildFromText || null

	// mgf 직접 URL은 Referer 핫링크 차단 → same-origin 프록시
	const portraitUrl = toMgfPortraitProxyUrl(name)

	const level = parseMgfLevel(findStatValue($, $card, '레벨'))
	const job = findStatValue($, $card, '직업') || '알 수 없음'
	const weaponRaw = findStatValue($, $card, '무기')
	const weapon = weaponRaw || null

	const { value: combatPower, label: combatPowerLabel } = parsePowerField($card.find('.stat-value.power').first())

	const globalRank = parseRankLabel(findStatValueByClass($card, 'rank-global'))

	const $serverStat = $card
		.find('.stat-box')
		.filter((_, el) => $(el).find('.rank-world').length > 0)
		.first()
	const serverLabelRaw = $serverStat.find('.stat-label').text().replace(/\s+/g, ' ').trim()
	const serverLabel = stripLeadingEmoji(serverLabelRaw) || null
	const serverRank = parseRankLabel($serverStat.find('.rank-world').text())

	return {
		name,
		portraitUrl,
		popularity,
		guildName,
		level,
		job,
		combatPower: combatPower.toString(),
		combatPowerLabel,
		globalRank,
		serverLabel,
		serverRank,
		weapon,
		expedition: parseBossBox($card.find('.guild-boss-box').first()),
		worldBoss: parseBossBox($card.find('.world-boss-box').first())
	}
}

function findStatValue($: CheerioAPI, $card: CheerioSelection, label: string): string {
	const $box = $card
		.find('.stat-box')
		.filter((_, el) => {
			const text = $(el).find('.stat-label').first().text().replace(/\s+/g, ' ').trim()
			return text === label || text.endsWith(label)
		})
		.first()

	return $box.find('.stat-value').first().text().replace(/\s+/g, ' ').trim()
}

function findStatValueByClass($card: CheerioSelection, className: string): string {
	return $card.find(`.stat-value.${className}`).first().text().replace(/\s+/g, ' ').trim()
}

function parsePowerField($power: CheerioSelection): { value: bigint; label: string } {
	const tooltip = $power.find('.power-tooltip').first().text().replace(/\s+/g, ' ').trim()
	const visible = $power.clone().find('.power-tooltip').remove().end().text().replace(/\s+/g, ' ').trim()
	const label = tooltip || visible || '0'
	const value = parseKoreanNumber(label)

	return {
		value,
		label: label || formatKoreanNumber(value)
	}
}

function parseBossBox($box: CheerioSelection): MgfCharacterBossDto | null {
	if ($box.length === 0) {
		return null
	}

	const tooltip = $box.find('.boss-score-tooltip').first().text().replace(/\s+/g, ' ').trim()
	const visible = $box
		.find('.boss-score-wrap')
		.first()
		.clone()
		.find('.boss-score-tooltip')
		.remove()
		.end()
		.text()
		.replace(/\s+/g, ' ')
		.trim()

	const score = tooltip ? parseKoreanNumber(tooltip) : visible ? parseKoreanNumber(visible) : 0n
	const scoreLabel = visible || (score > 0n ? formatKoreanNumber(score) : '')

	if (score === 0n && !scoreLabel) {
		return null
	}

	const badge = $box.find('.boss-rank-badge').first().text().replace(/\s+/g, ' ').trim()

	return {
		score: score.toString(),
		scoreLabel: scoreLabel || formatKoreanNumber(score),
		rank: parseBossRank(badge)
	}
}

/** 예: `Scania 1 · 1,338위` — 프로필 serverLabel과 중복되므로 등수만 사용 */
function parseBossRank(badge: string): number | null {
	if (!badge) {
		return null
	}

	const parts = badge.split('·').map((part) => part.trim())
	if (parts.length >= 2) {
		return parseRankLabel(parts.slice(1).join('·'))
	}

	return parseRankLabel(badge)
}

function parseRankLabel(text: string): number | null {
	const match = text.replace(/,/g, '').match(/(\d+)\s*위/)
	if (!match) {
		return null
	}

	const value = Number.parseInt(match[1] ?? '', 10)
	return Number.isFinite(value) ? value : null
}

function parseLocaleInt(text: string): number | null {
	const match = text.replace(/,/g, '').match(/(\d+)/)
	if (!match) {
		return null
	}

	const value = Number.parseInt(match[1] ?? '', 10)
	return Number.isFinite(value) ? value : null
}

function parseGuildNameFromHref(href: string | undefined): string | null {
	if (!href) {
		return null
	}

	try {
		const url = new URL(href, MGF_ORIGIN)
		const name = url.searchParams.get('g_name')?.trim()
		return name || null
	} catch {
		return null
	}
}

function stripLeadingEmoji(text: string): string {
	return text.replace(/^[\p{Extended_Pictographic}\uFE0F\u200D\s]+/u, '').trim()
}

export { loadMgfCharacter }
