import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const webAppDirectory = join(scriptDirectory, '../apps/web')
const dataDirectory = join(webAppDirectory, 'data')
const currentWeekPath = join(dataDirectory, 'current-week.json')
const previousWeekPath = join(dataDirectory, 'previous-week.json')
const contentDatesPath = join(dataDirectory, 'guild-content-dates.json')

/** Next 앱과 동일하게 .env.local 이 .env 보다 우선 (이미 있는 키는 덮어쓰지 않음) */
function loadWebAppEnv() {
	for (const fileName of ['.env.local', '.env']) {
		const envPath = join(webAppDirectory, fileName)
		if (!existsSync(envPath)) continue
		process.loadEnvFile(envPath)
	}
}

loadWebAppEnv()

/** CLI 인자로 받는 동기화 대상 (rotate 와 동일) */
const SYNC_MODES = {
	all: ['combatPower', 'expedition', 'rivalry', 'training', 'guildBoss'],
	character: ['combatPower'],
	expedition: ['expedition'],
	rivalry: ['rivalry'],
	training: ['training'],
	'guild-boss': ['guildBoss']
}

const MODE_LABELS = {
	all: '전체',
	character: '전투력·레벨·직업',
	expedition: '토벌전(등급·등수·점수)',
	rivalry: '대항전',
	training: '수련장',
	'guild-boss': '길드보스'
}

const FIELD_LABELS = {
	combatPower: '전투력',
	expedition: '토벌전',
	rivalry: '대항전',
	training: '수련장',
	guildBoss: '길드보스'
}

/** 멤버 탭 sync 시 함께 갱신할 guild 메타 필드 */
const GUILD_META_BY_FIELD = {
	expedition: ['expeditionRank'],
	rivalry: ['rivalryRank', 'rivalryPoints'],
	training: ['trainingRank']
}

const MEMBER_SHEETS = ['combatPower', 'expedition', 'rivalry', 'training', 'guildBoss']
const REQUIRED_HEADERS = {
	combatPower: ['collectedAt', 'name', 'level', 'job', 'combatPower'],
	expedition: ['collectedAt', 'name', 'grade', 'placement', 'score'],
	rivalry: ['collectedAt', 'name', 'rivalry'],
	training: ['collectedAt', 'name', 'training'],
	guildBoss: ['collectedAt', 'name', 'guildBoss'],
	guild: ['collectedAt', 'content', 'expeditionRank', 'rivalryRank', 'rivalryPoints', 'trainingRank']
}

function sheetCsvUrl(sheetId, sheetName) {
	const params = new URLSearchParams({
		tqx: 'out:csv',
		sheet: sheetName
	})

	return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?${params}`
}

function parseCsv(text) {
	const rows = []
	let row = []
	let field = ''
	let inQuotes = false

	const normalized = text
		.replace(/^\uFEFF/, '')
		.replace(/\r\n/g, '\n')
		.replace(/\r/g, '\n')

	for (let index = 0; index < normalized.length; index += 1) {
		const char = normalized[index]
		const next = normalized[index + 1]

		if (inQuotes) {
			if (char === '"' && next === '"') {
				field += '"'
				index += 1
			} else if (char === '"') {
				inQuotes = false
			} else {
				field += char
			}
			continue
		}

		if (char === '"') {
			inQuotes = true
			continue
		}

		if (char === ',') {
			row.push(field)
			field = ''
			continue
		}

		if (char === '\n') {
			row.push(field)
			rows.push(row)
			row = []
			field = ''
			continue
		}

		field += char
	}

	if (field.length > 0 || row.length > 0) {
		row.push(field)
		rows.push(row)
	}

	return rows.filter((cells) => cells.some((cell) => cell.trim() !== ''))
}

function rowsToObjects(csvText, sheetName) {
	const table = parseCsv(csvText)

	if (table.length === 0) {
		throw new Error(`${sheetName} 탭이 비어 있습니다.`)
	}

	const [headerRow, ...dataRows] = table
	const headers = headerRow.map((header) => header.trim())
	const required = REQUIRED_HEADERS[sheetName]
	const missing = required.filter((header) => !headers.includes(header))

	if (missing.length > 0) {
		throw new Error(`${sheetName} 탭 헤더가 올바르지 않습니다. 없는 열: ${missing.join(', ')}`)
	}

	return dataRows.map((cells) => {
		const row = {}

		for (const [index, header] of headers.entries()) {
			row[header] = (cells[index] ?? '').trim()
		}

		return row
	})
}

function isFilledRow(row) {
	return Object.values(row).some((value) => value !== '')
}

async function fetchSheetRows(sheetId, sheetName) {
	const response = await fetch(sheetCsvUrl(sheetId, sheetName), {
		headers: { 'User-Agent': 'meki-guild-sync' }
	})

	if (!response.ok) {
		throw new Error(`${sheetName} 탭을 가져오지 못했습니다. HTTP ${response.status}`)
	}

	const csvText = await response.text()

	if (csvText.includes('<html') || !csvText.includes('collectedAt')) {
		throw new Error(`${sheetName} 탭 CSV를 읽지 못했습니다. 시트가 "링크가 있는 모든 사용자" 보기인지 확인하세요.`)
	}

	return rowsToObjects(csvText, sheetName).filter(isFilledRow)
}

function uniqueSortedDates(rows) {
	return [...new Set(rows.map((row) => row.collectedAt).filter(Boolean))].sort()
}

/** 컨텐츠 탭에서 최근·직전 수집일. 값이 없으면 null */
function latestTwoDates(rows) {
	const dates = uniqueSortedDates(rows)

	return {
		previous: dates.at(-2) ?? null,
		current: dates.at(-1) ?? null
	}
}

function assertUniqueKeys(rows, sheetName, keyFn) {
	const seen = new Set()

	for (const row of rows) {
		const key = keyFn(row)

		if (!key) {
			continue
		}

		if (seen.has(key)) {
			throw new Error(`${sheetName} 탭에 중복 행이 있습니다: ${key}`)
		}

		seen.add(key)
	}
}

function assertMemberSheetKeys(rows, sheetName) {
	assertUniqueKeys(rows, sheetName, (row) => (row.collectedAt && row.name ? `${row.collectedAt} / ${row.name}` : ''))
}

function rowsOnDate(rows, date) {
	if (!date) {
		return []
	}

	return rows.filter((row) => row.collectedAt === date)
}

function mapByName(rows, date) {
	return new Map(rowsOnDate(rows, date).map((row) => [row.name, row]))
}

function toNumberOrNull(value) {
	if (value === undefined || value === null || value === '') {
		return null
	}

	const number = Number(value)

	if (!Number.isFinite(number)) {
		throw new Error(`숫자로 바꿀 수 없습니다: "${value}"`)
	}

	return number
}

function toLevel(value) {
	if (value === undefined || value === null || value === '') {
		return 0
	}

	return toNumberOrNull(value) ?? 0
}

function buildGuildMeta(guildRows, expeditionDate, rivalryDate, trainingDate) {
	const expeditionRow = guildRows.find((row) => row.content === 'expedition' && row.collectedAt === expeditionDate)
	const rivalryRow = guildRows.find((row) => row.content === 'rivalry' && row.collectedAt === rivalryDate)
	const trainingRow = guildRows.find((row) => row.content === 'training' && row.collectedAt === trainingDate)

	return {
		expeditionRank: toNumberOrNull(expeditionRow?.expeditionRank),
		rivalryRank: toNumberOrNull(rivalryRow?.rivalryRank),
		rivalryPoints: toNumberOrNull(rivalryRow?.rivalryPoints),
		trainingRank: toNumberOrNull(trainingRow?.trainingRank)
	}
}

function buildMember(name, lookups) {
	const combat = lookups.combat.get(name)
	const expedition = lookups.expedition.get(name)
	const rivalry = lookups.rivalry.get(name)
	const training = lookups.training.get(name)
	const guildBoss = lookups.guildBoss.get(name)
	const member = {
		name,
		level: toLevel(combat?.level),
		job: combat?.job ?? '',
		combatPower: combat?.combatPower ?? '',
		expedition: {
			grade: expedition?.grade ?? '',
			placement: toNumberOrNull(expedition?.placement),
			score: expedition?.score ?? ''
		},
		rivalry: rivalry?.rivalry ?? '',
		training: training?.training ?? ''
	}

	if (guildBoss?.guildBoss) {
		member.guildBoss = guildBoss.guildBoss
	}

	return member
}

function buildSnapshot(rosterRows, lookups, guildMeta) {
	return {
		guild: guildMeta,
		members: rosterRows.map((row) => buildMember(row.name, lookups))
	}
}

function readJson(path) {
	return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, data) {
	writeFileSync(path, `${JSON.stringify(data, null, '\t')}\n`, 'utf8')
}

function formatDateLabel(date) {
	return date ?? '없음'
}

function printUsageAndExit() {
	console.error('❌ 사용법: pnpm guild:sync [대상]')
	console.error('')
	console.error('대상 (생략 시 전체):')
	for (const [key, label] of Object.entries(MODE_LABELS)) {
		console.error(`  ${key.padEnd(14)} ${label}`)
	}
	process.exit(1)
}

/** 시트 행 값으로 멤버의 해당 필드만 덮어씁니다. */
function applyFieldFromRow(member, field, row) {
	switch (field) {
		case 'combatPower':
			member.level = toLevel(row?.level)
			member.job = row?.job ?? ''
			member.combatPower = row?.combatPower ?? ''
			break
		case 'expedition':
			member.expedition = {
				grade: row?.grade ?? '',
				placement: toNumberOrNull(row?.placement),
				score: row?.score ?? ''
			}
			break
		case 'rivalry':
			member.rivalry = row?.rivalry ?? ''
			break
		case 'training':
			member.training = row?.training ?? ''
			break
		case 'guildBoss':
			if (row?.guildBoss) {
				member.guildBoss = row.guildBoss
			} else {
				delete member.guildBoss
			}
			break
		default:
			throw new Error(`알 수 없는 동기화 필드: ${field}`)
	}
}

function patchMembersField(members, lookup, field) {
	for (const member of members) {
		applyFieldFromRow(member, field, lookup.get(member.name))
	}
}

function patchGuildMetaFields(week, guildRows, content, date, fieldNames) {
	const row = date ? guildRows.find((entry) => entry.content === content && entry.collectedAt === date) : null

	week.guild = { ...(week.guild ?? {}) }

	for (const fieldName of fieldNames) {
		week.guild[fieldName] = toNumberOrNull(row?.[fieldName])
	}
}

function logFieldDates(field, dates) {
	const label = FIELD_LABELS[field].padEnd(8)
	console.log(`   ${label} 직전=${formatDateLabel(dates.previous)}  최신=${formatDateLabel(dates.current)}`)
}

async function syncAllSheets(sheetId) {
	const [combatPowerRows, expeditionRows, rivalryRows, trainingRows, guildBossRows, guildRows] = await Promise.all([
		...MEMBER_SHEETS.map((sheetName) => fetchSheetRows(sheetId, sheetName)),
		fetchSheetRows(sheetId, 'guild')
	])

	assertMemberSheetKeys(combatPowerRows, 'combatPower')
	assertMemberSheetKeys(expeditionRows, 'expedition')
	assertMemberSheetKeys(rivalryRows, 'rivalry')
	assertMemberSheetKeys(trainingRows, 'training')
	assertMemberSheetKeys(guildBossRows, 'guildBoss')
	assertUniqueKeys(guildRows, 'guild', (row) =>
		row.collectedAt && row.content ? `${row.collectedAt} / ${row.content}` : ''
	)

	const dates = {
		combatPower: latestTwoDates(combatPowerRows),
		expedition: latestTwoDates(expeditionRows),
		rivalry: latestTwoDates(rivalryRows),
		training: latestTwoDates(trainingRows),
		guildBoss: latestTwoDates(guildBossRows)
	}

	if (!dates.combatPower.current) {
		throw new Error('combatPower 탭에 collectedAt이 없습니다. 현재 로스터를 만들 수 없습니다.')
	}

	const currentLookups = {
		combat: mapByName(combatPowerRows, dates.combatPower.current),
		expedition: mapByName(expeditionRows, dates.expedition.current),
		rivalry: mapByName(rivalryRows, dates.rivalry.current),
		training: mapByName(trainingRows, dates.training.current),
		guildBoss: mapByName(guildBossRows, dates.guildBoss.current)
	}
	const previousLookups = {
		combat: mapByName(combatPowerRows, dates.combatPower.previous),
		expedition: mapByName(expeditionRows, dates.expedition.previous),
		rivalry: mapByName(rivalryRows, dates.rivalry.previous),
		training: mapByName(trainingRows, dates.training.previous),
		guildBoss: mapByName(guildBossRows, dates.guildBoss.previous)
	}

	const currentWeek = buildSnapshot(
		rowsOnDate(combatPowerRows, dates.combatPower.current),
		currentLookups,
		buildGuildMeta(guildRows, dates.expedition.current, dates.rivalry.current, dates.training.current)
	)
	const previousWeek = buildSnapshot(
		rowsOnDate(combatPowerRows, dates.combatPower.previous),
		previousLookups,
		buildGuildMeta(guildRows, dates.expedition.previous, dates.rivalry.previous, dates.training.previous)
	)

	writeJson(currentWeekPath, currentWeek)
	writeJson(previousWeekPath, previousWeek)
	writeJson(contentDatesPath, dates)

	console.log('✅ 시트 → JSON 전체 동기화 완료')
	for (const field of MEMBER_SHEETS) {
		logFieldDates(field, dates[field])
	}
	console.log(`   current-week.json 멤버 ${currentWeek.members.length}명`)
	console.log(`   previous-week.json 멤버 ${previousWeek.members.length}명`)
}

async function syncPartialSheets(sheetId, mode, fields) {
	for (const path of [currentWeekPath, previousWeekPath, contentDatesPath]) {
		if (!existsSync(path)) {
			throw new Error(
				'부분 동기화는 기존 JSON이 필요합니다. 먼저 `pnpm guild:sync` 또는 `pnpm guild:sync all`을 실행하세요.'
			)
		}
	}

	const needsGuild = fields.some((field) => GUILD_META_BY_FIELD[field])
	const sheetNames = needsGuild ? [...fields, 'guild'] : [...fields]
	const fetchedRows = await Promise.all(sheetNames.map((sheetName) => fetchSheetRows(sheetId, sheetName)))
	const rowsBySheet = Object.fromEntries(sheetNames.map((sheetName, index) => [sheetName, fetchedRows[index]]))

	for (const field of fields) {
		assertMemberSheetKeys(rowsBySheet[field], field)
	}

	if (needsGuild) {
		assertUniqueKeys(rowsBySheet.guild, 'guild', (row) =>
			row.collectedAt && row.content ? `${row.collectedAt} / ${row.content}` : ''
		)
	}

	const currentWeek = readJson(currentWeekPath)
	const previousWeek = readJson(previousWeekPath)
	const contentDates = readJson(contentDatesPath)
	const syncedDates = {}

	for (const field of fields) {
		const rows = rowsBySheet[field]
		const dates = latestTwoDates(rows)
		syncedDates[field] = dates
		contentDates[field] = dates

		patchMembersField(currentWeek.members, mapByName(rows, dates.current), field)
		patchMembersField(previousWeek.members, mapByName(rows, dates.previous), field)

		const metaFields = GUILD_META_BY_FIELD[field]
		if (metaFields) {
			patchGuildMetaFields(currentWeek, rowsBySheet.guild, field, dates.current, metaFields)
			patchGuildMetaFields(previousWeek, rowsBySheet.guild, field, dates.previous, metaFields)
		}
	}

	writeJson(currentWeekPath, currentWeek)
	writeJson(previousWeekPath, previousWeek)
	writeJson(contentDatesPath, contentDates)

	console.log(`✅ 시트 → JSON 부분 동기화 완료 (${MODE_LABELS[mode]})`)
	for (const field of fields) {
		logFieldDates(field, syncedDates[field])
	}
	console.log(`   current-week.json 멤버 ${currentWeek.members.length}명 유지`)
	console.log(`   previous-week.json 멤버 ${previousWeek.members.length}명 유지`)
}

async function syncGuildSheet(modeArg) {
	const mode = modeArg ?? 'all'
	const fields = SYNC_MODES[mode]

	if (!fields) {
		printUsageAndExit()
	}

	const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID

	if (!sheetId) {
		throw new Error('GOOGLE_SHEETS_SHEET_ID 환경 변수가 설정되지 않았습니다. apps/web/.env 를 확인하세요.')
	}

	if (mode === 'all') {
		await syncAllSheets(sheetId)
		return
	}

	await syncPartialSheets(sheetId, mode, fields)
}

syncGuildSheet(process.argv[2]).catch((error) => {
	console.error(`❌ ${error.message}`)
	process.exit(1)
})
