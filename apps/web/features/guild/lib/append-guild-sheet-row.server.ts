import { GoogleAuth } from 'google-auth-library'

import {
	GUILD_SHEET_TAB_HEADERS,
	GUILD_SHEET_TAB_INPUT_FIELDS,
	type GuildSheetMemberTab
} from '@/features/guild/lib/sheet-form.schema'

type GuildSheetRowValues = string[]

type UpsertGuildSheetRowInput = {
	tab: GuildSheetMemberTab
	/** 헤더 순서와 동일한 셀 값 */
	values: GuildSheetRowValues
}

type UpsertGuildSheetRowResult = {
	mode: 'created' | 'updated'
}

type FindGuildSheetRowFieldsInput = {
	tab: GuildSheetMemberTab
	collectedAt: string
	name: string
}

/** 탭 데이터 영역(헤더 제외). sheetRowNumber 는 1-based 시트 행 번호 */
type GuildSheetDataRow = {
	sheetRowNumber: number
	cells: string[]
}

function getGuildSheetId(): string {
	const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID?.trim()

	if (!sheetId) {
		throw new Error('GOOGLE_SHEETS_SHEET_ID 환경 변수가 설정되지 않았습니다.')
	}

	return sheetId
}

function getServiceAccountCredentials() {
	const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL?.trim()
	const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n')

	if (!clientEmail || !privateKey) {
		throw new Error(
			'Google Sheets 쓰기 설정이 없습니다. GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY 를 확인하세요.'
		)
	}

	return { clientEmail, privateKey }
}

async function getSheetsAccessToken(): Promise<string> {
	const { clientEmail, privateKey } = getServiceAccountCredentials()
	const auth = new GoogleAuth({
		credentials: {
			client_email: clientEmail,
			private_key: privateKey
		},
		scopes: ['https://www.googleapis.com/auth/spreadsheets']
	})
	const client = await auth.getClient()
	const tokenResponse = await client.getAccessToken()
	const accessToken = tokenResponse.token

	if (!accessToken) {
		throw new Error('Google Sheets 접근 토큰을 발급받지 못했습니다.')
	}

	return accessToken
}

function columnLetter(indexZeroBased: number): string {
	let remaining = indexZeroBased
	let letter = ''

	while (remaining >= 0) {
		letter = String.fromCharCode((remaining % 26) + 65) + letter
		remaining = Math.floor(remaining / 26) - 1
	}

	return letter
}

function normalizeSheetCell(value: string): string {
	return value.trim()
}

/** collectedAt·name 매칭용. 날짜 구분자는 무시합니다. */
function normalizeMatchKey(value: string): string {
	return normalizeSheetCell(value).replace(/[./]/g, '-').toLowerCase()
}

async function fetchGuildSheetDataRows(tab: GuildSheetMemberTab): Promise<GuildSheetDataRow[]> {
	const spreadsheetId = getGuildSheetId()
	const accessToken = await getSheetsAccessToken()
	const range = encodeURIComponent(`${tab}!A:Z`)
	const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`)
	url.searchParams.set('majorDimension', 'ROWS')
	url.searchParams.set('valueRenderOption', 'FORMATTED_VALUE')
	url.searchParams.set('dateTimeRenderOption', 'FORMATTED_STRING')

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		},
		cache: 'no-store'
	})

	if (!response.ok) {
		const detail = await response.text()
		throw new Error(`Sheet 조회 실패 (HTTP ${response.status}): ${detail.slice(0, 300)}`)
	}

	const payload = (await response.json()) as { values?: string[][] }
	const table = payload.values ?? []

	if (table.length === 0) {
		return []
	}

	// 1행 헤더, 데이터는 2행부터
	return table.slice(1).map((cells, index) => ({
		sheetRowNumber: index + 2,
		cells: cells.map((cell) => String(cell ?? ''))
	}))
}

function findDataRowByCollectedAtAndName(
	rows: GuildSheetDataRow[],
	collectedAt: string,
	name: string
): GuildSheetDataRow | null {
	const collectedAtKey = normalizeMatchKey(collectedAt)
	const nameKey = normalizeMatchKey(name)

	return (
		rows.find((row) => {
			const rowCollectedAt = normalizeMatchKey(row.cells[0] ?? '')
			const rowName = normalizeMatchKey(row.cells[1] ?? '')

			return rowCollectedAt === collectedAtKey && rowName === nameKey
		}) ?? null
	)
}

/**
 * 동일 회차·길드원 행의 입력 필드 값. 없으면 null.
 */
async function findGuildSheetRowFields({
	tab,
	collectedAt,
	name
}: FindGuildSheetRowFieldsInput): Promise<Record<string, string> | null> {
	const headers = GUILD_SHEET_TAB_HEADERS[tab]
	const rows = await fetchGuildSheetDataRows(tab)
	const matched = findDataRowByCollectedAtAndName(rows, collectedAt, name)

	if (!matched) {
		return null
	}

	const record: Record<string, string> = {}

	for (const [index, header] of headers.entries()) {
		record[header] = normalizeSheetCell(matched.cells[index] ?? '')
	}

	return Object.fromEntries(GUILD_SHEET_TAB_INPUT_FIELDS[tab].map((field) => [field, record[field] ?? '']))
}

async function updateGuildSheetRow(
	tab: GuildSheetMemberTab,
	sheetRowNumber: number,
	values: GuildSheetRowValues
): Promise<void> {
	const spreadsheetId = getGuildSheetId()
	const accessToken = await getSheetsAccessToken()
	const lastColumn = columnLetter(values.length - 1)
	const range = encodeURIComponent(`${tab}!A${sheetRowNumber}:${lastColumn}${sheetRowNumber}`)
	const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`)
	url.searchParams.set('valueInputOption', 'USER_ENTERED')

	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ values: [values] })
	})

	if (!response.ok) {
		const detail = await response.text()
		throw new Error(`Sheet 수정 실패 (HTTP ${response.status}): ${detail.slice(0, 300)}`)
	}
}

async function appendGuildSheetRow({ tab, values }: UpsertGuildSheetRowInput): Promise<void> {
	const spreadsheetId = getGuildSheetId()
	const accessToken = await getSheetsAccessToken()
	const range = encodeURIComponent(`${tab}!A:Z`)
	const url = new URL(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append`)
	url.searchParams.set('valueInputOption', 'USER_ENTERED')
	url.searchParams.set('insertDataOption', 'INSERT_ROWS')

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ values: [values] })
	})

	if (!response.ok) {
		const detail = await response.text()
		throw new Error(`Sheet append 실패 (HTTP ${response.status}): ${detail.slice(0, 300)}`)
	}
}

/**
 * collectedAt+name 이 같으면 해당 행을 덮어쓰고, 없으면 append.
 */
async function upsertGuildSheetRow({ tab, values }: UpsertGuildSheetRowInput): Promise<UpsertGuildSheetRowResult> {
	const headers = GUILD_SHEET_TAB_HEADERS[tab]

	if (values.length !== headers.length) {
		throw new Error(`${tab} 행 길이가 헤더(${headers.length})와 다릅니다.`)
	}

	const collectedAt = values[0] ?? ''
	const name = values[1] ?? ''
	const rows = await fetchGuildSheetDataRows(tab)
	const matched = findDataRowByCollectedAtAndName(rows, collectedAt, name)

	if (matched) {
		await updateGuildSheetRow(tab, matched.sheetRowNumber, values)
		return { mode: 'updated' }
	}

	await appendGuildSheetRow({ tab, values })
	return { mode: 'created' }
}

export { appendGuildSheetRow, findGuildSheetRowFields, getGuildSheetId, upsertGuildSheetRow }
export type { UpsertGuildSheetRowResult }
