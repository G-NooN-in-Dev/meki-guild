'use server'

import currentWeekJson from '@/data/current-week.json'
import { upsertGuildSheetRow } from '@/features/guild/lib/append-guild-sheet-row.server'
import {
	GUILD_SHEET_FIELD_LABELS,
	GUILD_SHEET_KOREAN_NUMBER_FIELDS,
	GUILD_SHEET_TAB_HEADERS,
	GUILD_SHEET_TAB_INPUT_FIELDS,
	type GuildSheetMemberTab,
	isGuildSheetKoreanNumberField,
	isGuildSheetMemberTab
} from '@/features/guild/lib/sheet-form.schema'
import { isAllowedGuildSheetCollectedAt } from '@/features/guild/lib/sheet-form-rounds'
import type { SubmitGuildSheetFormState } from '@/features/guild/lib/submit-guild-sheet-form.state'
import type { GuildWeekSnapshot } from '@/features/guild/types/guild-snapshot.type'
import { normalizeKoreanUnitNumber, normalizeTrainingScoreNumber } from '@/utils/parse-korean-number'

const currentWeek = currentWeekJson as GuildWeekSnapshot
const currentMemberNames = new Set(currentWeek.members.map((member) => member.name))

function readRequiredString(formData: FormData, key: string): string {
	const value = formData.get(key)

	if (typeof value !== 'string' || value.trim() === '') {
		throw new Error(`${key} 값이 필요합니다.`)
	}

	return value.trim()
}

function normalizeSheetFieldValue(field: string, rawValue: string): string {
	if (!isGuildSheetKoreanNumberField(field)) {
		return rawValue
	}

	const label = GUILD_SHEET_FIELD_LABELS[field]

	try {
		if (GUILD_SHEET_KOREAN_NUMBER_FIELDS[field] === 'trainingScore') {
			return normalizeTrainingScoreNumber(rawValue)
		}

		return normalizeKoreanUnitNumber(rawValue)
	} catch (error) {
		const detail = error instanceof Error ? error.message : '형식이 올바르지 않습니다.'

		throw new Error(`${label}: ${detail}`)
	}
}

function buildRowValues(tab: GuildSheetMemberTab, formData: FormData): string[] {
	const collectedAt = readRequiredString(formData, 'collectedAt')
	const name = readRequiredString(formData, 'name')
	const fieldValues: Record<string, string> = { collectedAt, name }

	for (const field of GUILD_SHEET_TAB_INPUT_FIELDS[tab]) {
		fieldValues[field] = normalizeSheetFieldValue(field, readRequiredString(formData, field))
	}

	if (tab === 'combatPower') {
		const level = Number(fieldValues.level)

		if (!Number.isFinite(level) || level <= 0) {
			throw new Error('레벨은 1 이상의 숫자여야 합니다.')
		}
	}

	if (tab === 'expedition') {
		const placement = Number(fieldValues.placement)

		if (!Number.isFinite(placement) || placement <= 0) {
			throw new Error('순위는 1 이상의 숫자여야 합니다.')
		}
	}

	return GUILD_SHEET_TAB_HEADERS[tab].map((header) => fieldValues[header] ?? '')
}

async function submitGuildSheetForm(
	_prevState: SubmitGuildSheetFormState,
	formData: FormData
): Promise<SubmitGuildSheetFormState> {
	try {
		const tabValue = readRequiredString(formData, 'tab')

		if (!isGuildSheetMemberTab(tabValue)) {
			throw new Error('알 수 없는 탭입니다.')
		}

		const tab = tabValue
		const collectedAt = readRequiredString(formData, 'collectedAt')
		const name = readRequiredString(formData, 'name')

		if (!isAllowedGuildSheetCollectedAt(tab, collectedAt)) {
			throw new Error('선택할 수 없는 회차입니다. 직전 주이거나 아직 열리지 않은 회차일 수 있습니다.')
		}

		if (!currentMemberNames.has(name)) {
			throw new Error('현재 길드원 목록에 없는 이름입니다.')
		}

		const values = buildRowValues(tab, formData)
		const { mode } = await upsertGuildSheetRow({ tab, values })

		return {
			ok: true,
			message:
				mode === 'updated'
					? '기존 데이터를 수정했습니다. 동기화는 추후 한꺼번에 진행됩니다.'
					: '제출되었습니다. 동기화는 추후 한꺼번에 진행됩니다.'
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : '등록에 실패했습니다.'

		return {
			ok: false,
			message
		}
	}
}

export { submitGuildSheetForm }
