import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const dataDirectory = join(scriptDirectory, '../apps/web/data')
const currentWeekPath = join(dataDirectory, 'current-week.json')
const previousWeekPath = join(dataDirectory, 'previous-week.json')
const contentDatesPath = join(dataDirectory, 'guild-content-dates.json')

/** CLI 인자로 받는 이월 대상 */
const ROTATION_MODES = {
	all: ['combatPower', 'expedition', 'rivalry', 'training', 'guildBoss'],
	character: ['combatPower'],
	expedition: ['expedition'],
	rivalry: ['rivalry'],
	training: ['training'],
	'guild-boss': ['guildBoss']
}

const CONTENT_DATE_KEYS = {
	combatPower: 'combatPower',
	expedition: 'expedition',
	rivalry: 'rivalry',
	training: 'training',
	guildBoss: 'guildBoss'
}

const MODE_LABELS = {
	all: '전체',
	character: '전투력·레벨·직업',
	expedition: '토벌전(등급·등수·점수)',
	rivalry: '대항전',
	training: '수련장',
	'guild-boss': '길드보스'
}

/** previous 로 이월되는 항목 표시명 */
const CARRY_LABELS = {
	combatPower: '전투력·레벨·직업',
	expedition: '토벌전(등급·등수·점수)',
	rivalry: '대항전',
	training: '수련장',
	guildBoss: '길드보스'
}

/** current 에서 초기화되는 항목 표시명 */
const CLEAR_LABELS = {
	combatPower: '전투력',
	expedition: '토벌전(등급·등수·점수)',
	rivalry: '대항전',
	training: '수련장',
	guildBoss: '길드보스'
}

function formatFieldLabels(fields, labels) {
	return fields.map((field) => labels[field]).join(', ')
}

function readJson(path) {
	return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, data) {
	writeFileSync(path, `${JSON.stringify(data, null, '\t')}\n`, 'utf8')
}

/** 한국(Asia/Seoul) 기준 오늘 날짜(YYYY-MM-DD). UTC toISOString 은 새벽 KST에 하루 밀립니다. */
function getToday() {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Asia/Seoul',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(new Date())
}

function findMemberByName(members, name) {
	return members.find((member) => member.name === name)
}

/** current → previous 로 복사할 필드만 반영합니다. 멤버 구성은 동일하다고 가정합니다. */
function copyFieldsToPrevious(currentMember, previousMember, fields) {
	for (const field of fields) {
		switch (field) {
			case 'combatPower':
				previousMember.level = currentMember.level
				previousMember.job = currentMember.job
				previousMember.combatPower = currentMember.combatPower
				break
			case 'expedition':
				previousMember.expedition = {
					grade: currentMember.expedition.grade,
					placement:
						typeof currentMember.expedition.placement === 'number' && currentMember.expedition.placement > 0
							? currentMember.expedition.placement
							: null,
					score: currentMember.expedition.score
				}
				break
			case 'rivalry':
				previousMember.rivalry = currentMember.rivalry
				break
			case 'training':
				previousMember.training = currentMember.training
				break
			case 'guildBoss':
				if (currentMember.guildBoss !== undefined) {
					previousMember.guildBoss = currentMember.guildBoss
				} else {
					delete previousMember.guildBoss
				}
				break
			default:
				throw new Error(`알 수 없는 이월 필드: ${field}`)
		}
	}
}

/** current-week 에서 입력 대기 상태로 비울 필드만 초기화합니다. */
function clearFieldsInCurrent(member, fields) {
	const nextMember = { ...member }

	for (const field of fields) {
		switch (field) {
			case 'combatPower':
				// 레벨·직업은 current 에 유지하고, 전투력만 재입력 대기 상태로 비웁니다.
				nextMember.combatPower = ''
				break
			case 'expedition':
				nextMember.expedition = { grade: '', placement: null, score: '' }
				break
			case 'rivalry':
				nextMember.rivalry = ''
				break
			case 'training':
				nextMember.training = ''
				break
			case 'guildBoss':
				delete nextMember.guildBoss
				break
			default:
				throw new Error(`알 수 없는 이월 필드: ${field}`)
		}
	}

	return nextMember
}

function rotateGuildWeek(mode) {
	const fields = ROTATION_MODES[mode]

	if (!fields) {
		console.error('❌ 사용법: pnpm guild:rotate <대상>')
		console.error('')
		console.error('대상:')
		for (const [key, label] of Object.entries(MODE_LABELS)) {
			console.error(`  ${key.padEnd(14)} ${label}`)
		}
		process.exit(1)
	}

	const currentWeek = readJson(currentWeekPath)
	const previousWeek = readJson(previousWeekPath)
	const contentDates = readJson(contentDatesPath)
	const today = getToday()

	for (const currentMember of currentWeek.members) {
		const previousMember = findMemberByName(previousWeek.members, currentMember.name)

		if (!previousMember) {
			throw new Error(`previous-week.json 에 "${currentMember.name}" 멤버가 없습니다.`)
		}

		copyFieldsToPrevious(currentMember, previousMember, fields)
	}

	currentWeek.members = currentWeek.members.map((member) => clearFieldsInCurrent(member, fields))

	// 분야별 수집일: 기존 current → previous 로 밀고, current 는 오늘(새 수집 시작일)
	for (const field of fields) {
		const dateKey = CONTENT_DATE_KEYS[field]
		const existing = contentDates[dateKey] ?? { current: null, previous: null }

		contentDates[dateKey] = {
			previous: existing.current ?? null,
			current: today
		}
	}

	writeJson(previousWeekPath, previousWeek)
	writeJson(currentWeekPath, currentWeek)
	writeJson(contentDatesPath, contentDates)

	const carried = formatFieldLabels(fields, CARRY_LABELS)
	const cleared = formatFieldLabels(fields, CLEAR_LABELS)

	console.log(`✅ ${MODE_LABELS[mode]} 이월 완료`)
	console.log(`   previous-week.json ← ${carried} 반영`)
	console.log(`   current-week.json ${cleared} 초기화`)
	if (fields.includes('combatPower')) {
		console.log(`   (레벨·직업은 current 에 유지)`)
	}
	console.log(`   guild-content-dates.json 최근→직전 이월, 최근=${today}`)
}

const mode = process.argv[2]

rotateGuildWeek(mode)
