'use server'

import { findGuildSheetRowFields } from '@/features/guild/lib/append-guild-sheet-row.server'
import { type GuildSheetMemberTab, isGuildSheetMemberTab } from '@/features/guild/lib/sheet-form.schema'
import { isAllowedGuildSheetCollectedAt } from '@/features/guild/lib/sheet-form-rounds'

type LoadGuildSheetRowFieldsInput = {
	tab: string
	collectedAt: string
	name: string
}

/**
 * 폼 프리필용. 동일 회차·길드원 행이 있으면 입력 필드만 반환합니다.
 */
async function loadGuildSheetRowFields(input: LoadGuildSheetRowFieldsInput): Promise<Record<string, string> | null> {
	const tabValue = input.tab.trim()
	const collectedAt = input.collectedAt.trim()
	const name = input.name.trim()

	if (!isGuildSheetMemberTab(tabValue) || !collectedAt || !name) {
		return null
	}

	const tab: GuildSheetMemberTab = tabValue

	if (!isAllowedGuildSheetCollectedAt(tab, collectedAt)) {
		return null
	}

	return findGuildSheetRowFields({ tab, collectedAt, name })
}

export { loadGuildSheetRowFields }
