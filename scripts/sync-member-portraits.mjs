import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const webAppDirectory = join(scriptDirectory, '../apps/web')
const currentWeekPath = join(webAppDirectory, 'data/current-week.json')
const membersDirectory = join(webAppDirectory, 'public/members')

const MGF_PORTRAIT_BASE = 'https://mgf.gg/ranking/ranking_image.php'
const CONCURRENCY = 5
const REQUEST_GAP_MS = 80

/**
 * NFC 정규화한 닉네임.png 경로.
 * UI `getMemberPortraitSrc`의 encodeURIComponent와 짝을 이룹니다.
 */
function portraitFileName(name) {
	return `${name.normalize('NFC')}.png`
}

function portraitUrl(name) {
	return `${MGF_PORTRAIT_BASE}?n=${encodeURIComponent(name.normalize('NFC'))}`
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

function sha256(buffer) {
	return createHash('sha256').update(buffer).digest('hex')
}

function readRosterNames() {
	if (!existsSync(currentWeekPath)) {
		throw new Error('current-week.json이 없습니다. 먼저 `pnpm guild:sync`로 로스터를 만든 뒤 다시 실행하세요.')
	}

	const snapshot = JSON.parse(readFileSync(currentWeekPath, 'utf8'))
	const members = snapshot?.members

	if (!Array.isArray(members) || members.length === 0) {
		throw new Error('current-week.json에 members가 비어 있습니다.')
	}

	const names = []
	const seen = new Set()

	for (const member of members) {
		const name = typeof member?.name === 'string' ? member.name.trim() : ''
		if (!name) continue

		const key = name.normalize('NFC')
		if (seen.has(key)) continue
		seen.add(key)
		names.push(key)
	}

	if (names.length === 0) {
		throw new Error('유효한 길드원 닉네임이 없습니다.')
	}

	return names
}

/**
 * mgf 초상화 1건 다운로드. 성공 시 Buffer, 실패 시 throw.
 */
async function fetchPortraitBuffer(name) {
	const response = await fetch(portraitUrl(name), {
		headers: { Accept: 'image/*' },
		redirect: 'follow'
	})

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}`)
	}

	const contentType = response.headers.get('content-type') ?? ''
	if (!contentType.startsWith('image/')) {
		throw new Error(`이미지가 아님 (${contentType || 'content-type 없음'})`)
	}

	const buffer = Buffer.from(await response.arrayBuffer())
	if (buffer.byteLength === 0) {
		throw new Error('빈 응답')
	}

	return buffer
}

/**
 * 기존 파일과 해시가 같으면 skip, 다르면 기록.
 * @returns {'created' | 'updated' | 'skipped'}
 */
function writePortraitIfChanged(filePath, buffer) {
	const nextHash = sha256(buffer)

	if (existsSync(filePath)) {
		const previousHash = sha256(readFileSync(filePath))
		if (previousHash === nextHash) {
			return 'skipped'
		}
		writeFileSync(filePath, buffer)
		return 'updated'
	}

	writeFileSync(filePath, buffer)
	return 'created'
}

/**
 * 로스터에 없는 public/members/*.png 삭제.
 * @returns {string[]} 삭제된 파일명
 */
function pruneStalePortraits(rosterNames) {
	if (!existsSync(membersDirectory)) {
		return []
	}

	const keep = new Set(rosterNames.map(portraitFileName))
	const removed = []

	for (const entry of readdirSync(membersDirectory)) {
		if (!entry.endsWith('.png')) continue
		if (keep.has(entry)) continue

		unlinkSync(join(membersDirectory, entry))
		removed.push(entry)
	}

	return removed
}

/**
 * 이름 목록을 concurrency만큼 나눠 순차 배치 처리.
 */
async function mapPool(items, concurrency, worker) {
	const results = new Array(items.length)
	let nextIndex = 0

	async function runWorker() {
		while (nextIndex < items.length) {
			const index = nextIndex
			nextIndex += 1
			results[index] = await worker(items[index], index)
			if (REQUEST_GAP_MS > 0) {
				await sleep(REQUEST_GAP_MS)
			}
		}
	}

	const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => runWorker())
	await Promise.all(workers)
	return results
}

async function syncMemberPortraits() {
	const names = readRosterNames()
	mkdirSync(membersDirectory, { recursive: true })

	console.log(`🎨 길드원 초상화 동기화 시작 (${names.length}명 → mgf.gg)`)

	let created = 0
	let updated = 0
	let skipped = 0
	const failures = []

	await mapPool(names, CONCURRENCY, async (name) => {
		const filePath = join(membersDirectory, portraitFileName(name))

		try {
			const buffer = await fetchPortraitBuffer(name)
			const result = writePortraitIfChanged(filePath, buffer)

			if (result === 'created') created += 1
			else if (result === 'updated') updated += 1
			else skipped += 1
		} catch (error) {
			failures.push({ name, message: error instanceof Error ? error.message : String(error) })
		}
	})

	const removed = pruneStalePortraits(names)

	console.log('✅ 초상화 동기화 완료')
	console.log(`   신규 ${created} · 갱신 ${updated} · 동일 skip ${skipped}`)
	if (removed.length > 0) {
		console.log(`   로스터 외 삭제 ${removed.length}: ${removed.join(', ')}`)
	}
	if (failures.length > 0) {
		console.log(`   실패 ${failures.length} (기존 파일 유지):`)
		for (const { name, message } of failures) {
			console.log(`   - ${name}: ${message}`)
		}
		process.exitCode = 1
	}
}

syncMemberPortraits().catch((error) => {
	console.error(`❌ ${error.message}`)
	process.exit(1)
})
