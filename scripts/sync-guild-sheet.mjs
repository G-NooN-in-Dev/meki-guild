import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const dataDirectory = join(scriptDirectory, '../apps/web/data')
const currentWeekPath = join(dataDirectory, 'current-week.json')
const previousWeekPath = join(dataDirectory, 'previous-week.json')
const contentDatesPath = join(dataDirectory, 'guild-content-dates.json')

/** 링크 공유된 입력 시트. `GUILD_SHEET_ID`로 덮어쓸 수 있습니다. */
const DEFAULT_SHEET_ID = '1AYYb-bDBxFmEK0ldTfClTIS25R74z7dAXB729TGkZqE'

const MEMBER_SHEETS = ['combatPower', 'expedition', 'rivalry', 'training', 'guildBoss']
const REQUIRED_HEADERS = {
	combatPower: ['collectedAt', 'name', 'level', 'job', 'combatPower'],
	expedition: ['collectedAt', 'name', 'grade', 'placement', 'score'],
	rivalry: ['collectedAt', 'name', 'rivalry'],
	training: ['collectedAt', 'name', 'training'],
	guildBoss: ['collectedAt', 'name', 'guildBoss'],
	guild: ['collectedAt', 'content', 'expeditionRank', 'rivalryRank', 'rivalryPoints']
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

function buildGuildMeta(guildRows, expeditionDate, rivalryDate) {
	const expeditionRow = guildRows.find((row) => row.content === 'expedition' && row.collectedAt === expeditionDate)
	const rivalryRow = guildRows.find((row) => row.content === 'rivalry' && row.collectedAt === rivalryDate)

	return {
		expeditionRank: toNumberOrNull(expeditionRow?.expeditionRank),
		rivalryRank: toNumberOrNull(rivalryRow?.rivalryRank),
		rivalryPoints: toNumberOrNull(rivalryRow?.rivalryPoints)
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

function writeJson(path, data) {
	writeFileSync(path, `${JSON.stringify(data, null, '\t')}\n`, 'utf8')
}

function formatDateLabel(date) {
	return date ?? '없음'
}

async function syncGuildSheet() {
	const sheetId = process.env.GUILD_SHEET_ID ?? DEFAULT_SHEET_ID
	const [combatPowerRows, expeditionRows, rivalryRows, trainingRows, guildBossRows, guildRows] = await Promise.all([
		...MEMBER_SHEETS.map((sheetName) => fetchSheetRows(sheetId, sheetName)),
		fetchSheetRows(sheetId, 'guild')
	])

	assertUniqueKeys(combatPowerRows, 'combatPower', (row) =>
		row.collectedAt && row.name ? `${row.collectedAt} / ${row.name}` : ''
	)
	assertUniqueKeys(expeditionRows, 'expedition', (row) =>
		row.collectedAt && row.name ? `${row.collectedAt} / ${row.name}` : ''
	)
	assertUniqueKeys(rivalryRows, 'rivalry', (row) =>
		row.collectedAt && row.name ? `${row.collectedAt} / ${row.name}` : ''
	)
	assertUniqueKeys(trainingRows, 'training', (row) =>
		row.collectedAt && row.name ? `${row.collectedAt} / ${row.name}` : ''
	)
	assertUniqueKeys(guildBossRows, 'guildBoss', (row) =>
		row.collectedAt && row.name ? `${row.collectedAt} / ${row.name}` : ''
	)
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
		buildGuildMeta(guildRows, dates.expedition.current, dates.rivalry.current)
	)
	const previousWeek = buildSnapshot(
		rowsOnDate(combatPowerRows, dates.combatPower.previous),
		previousLookups,
		buildGuildMeta(guildRows, dates.expedition.previous, dates.rivalry.previous)
	)

	writeJson(currentWeekPath, currentWeek)
	writeJson(previousWeekPath, previousWeek)
	writeJson(contentDatesPath, dates)

	console.log('✅ 시트 → JSON 동기화 완료')
	console.log(
		`   전투력     직전=${formatDateLabel(dates.combatPower.previous)}  최신=${formatDateLabel(dates.combatPower.current)}`
	)
	console.log(
		`   토벌전     직전=${formatDateLabel(dates.expedition.previous)}  최신=${formatDateLabel(dates.expedition.current)}`
	)
	console.log(
		`   대항전     직전=${formatDateLabel(dates.rivalry.previous)}  최신=${formatDateLabel(dates.rivalry.current)}`
	)
	console.log(
		`   수련장     직전=${formatDateLabel(dates.training.previous)}  최신=${formatDateLabel(dates.training.current)}`
	)
	console.log(
		`   길드보스   직전=${formatDateLabel(dates.guildBoss.previous)}  최신=${formatDateLabel(dates.guildBoss.current)}`
	)
	console.log(`   current-week.json 멤버 ${currentWeek.members.length}명`)
	console.log(`   previous-week.json 멤버 ${previousWeek.members.length}명`)
}

syncGuildSheet().catch((error) => {
	console.error(`❌ ${error.message}`)
	process.exit(1)
})
