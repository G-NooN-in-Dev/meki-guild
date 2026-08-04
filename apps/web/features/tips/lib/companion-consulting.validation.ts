import {
	clampCompanionLevel,
	COMPANION_SETUP_SLOTS,
	getCompanionById
} from '@/features/tips/lib/companion-setup.constants'
import {
	CONSULTING_CONTENT_MAX_LENGTH,
	CONSULTING_NOTE_MAX_LENGTH,
	CONSULTING_PASSWORD_MAX_LENGTH,
	CONSULTING_PASSWORD_MIN_LENGTH,
	CONSULTING_PRESET_STAT_FIELDS,
	CONSULTING_SHORT_ID_ALPHABET,
	CONSULTING_SHORT_ID_LENGTH,
	CONSULTING_TITLE_MAX_LENGTH
} from '@/features/tips/lib/consulting.constants'
import type {
	CompanionConsultingCommentInput,
	CompanionConsultingLoadout,
	CompanionConsultingPostInput,
	CompanionOwnershipEntry,
	ConsultingPresetStats
} from '@/features/tips/types/companion-consulting.type'

/** 검증 실패 시 사용자에게 보여줄 메시지 */
export class ConsultingValidationError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'ConsultingValidationError'
	}
}

function assertShortId(value: unknown, label: string): string {
	if (typeof value !== 'string') {
		throw new ConsultingValidationError(`${label}가 올바르지 않습니다.`)
	}

	const normalized = value.trim().toUpperCase()
	if (normalized.length !== CONSULTING_SHORT_ID_LENGTH) {
		throw new ConsultingValidationError(`${label} 길이가 올바르지 않습니다.`)
	}

	for (const char of normalized) {
		if (!CONSULTING_SHORT_ID_ALPHABET.includes(char)) {
			throw new ConsultingValidationError(`${label} 형식이 올바르지 않습니다.`)
		}
	}

	return normalized
}

function assertTitle(value: unknown): string {
	if (typeof value !== 'string') {
		throw new ConsultingValidationError('제목을 입력해 주세요.')
	}

	const trimmed = value.trim()
	if (trimmed.length === 0) {
		throw new ConsultingValidationError('제목을 입력해 주세요.')
	}

	if (trimmed.length > CONSULTING_TITLE_MAX_LENGTH) {
		throw new ConsultingValidationError(`제목은 ${CONSULTING_TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`)
	}

	return trimmed
}

/** 게시글 내용 — 비워 두면 빈 문자열. 필수 아님. */
function assertContent(value: unknown): string {
	if (value === undefined || value === null) {
		return ''
	}

	if (typeof value !== 'string') {
		throw new ConsultingValidationError('내용 형식이 올바르지 않습니다.')
	}

	const trimmed = value.trim()
	if (trimmed.length > CONSULTING_CONTENT_MAX_LENGTH) {
		throw new ConsultingValidationError(`내용은 ${CONSULTING_CONTENT_MAX_LENGTH}자까지 입력할 수 있습니다.`)
	}

	return trimmed
}

function assertNote(value: unknown): string {
	if (value === undefined || value === null) {
		return ''
	}

	if (typeof value !== 'string') {
		throw new ConsultingValidationError('메모 형식이 올바르지 않습니다.')
	}

	const trimmed = value.trim()
	if (trimmed.length > CONSULTING_NOTE_MAX_LENGTH) {
		throw new ConsultingValidationError(`메모는 ${CONSULTING_NOTE_MAX_LENGTH}자까지 입력할 수 있습니다.`)
	}

	return trimmed
}

/**
 * CUD용 단순 비밀번호 검증.
 * 계정 로그인이 아니라 글/댓글을 고치·지울 때 쓰는 키입니다.
 */
function assertPassword(value: unknown): string {
	if (typeof value !== 'string') {
		throw new ConsultingValidationError('비밀번호를 입력해 주세요.')
	}

	// 앞뒤 공백만 제거 — 중간 공백은 허용하지 않아 실수 입력을 줄입니다.
	const trimmed = value.trim()
	if (trimmed.length < CONSULTING_PASSWORD_MIN_LENGTH) {
		throw new ConsultingValidationError(`비밀번호는 ${CONSULTING_PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`)
	}

	if (trimmed.length > CONSULTING_PASSWORD_MAX_LENGTH) {
		throw new ConsultingValidationError(`비밀번호는 ${CONSULTING_PASSWORD_MAX_LENGTH}자까지 입력할 수 있습니다.`)
	}

	if (/\s/.test(trimmed)) {
		throw new ConsultingValidationError('비밀번호에 공백을 넣을 수 없습니다.')
	}

	return trimmed
}

/** 프리셋 스탯 — 정의된 필드 모두 0 이상 숫자여야 합니다. */
function assertPresetStats(value: unknown): ConsultingPresetStats {
	if (!value || typeof value !== 'object') {
		throw new ConsultingValidationError('프리셋 스탯을 입력해 주세요.')
	}

	const raw = value as Record<string, unknown>
	const stats = {} as ConsultingPresetStats

	for (const field of CONSULTING_PRESET_STAT_FIELDS) {
		const fieldValue = raw[field.id]
		if (typeof fieldValue !== 'number' || !Number.isFinite(fieldValue)) {
			throw new ConsultingValidationError(`${field.label} 수치가 올바르지 않습니다.`)
		}

		if (fieldValue < 0) {
			throw new ConsultingValidationError(`${field.label}은(는) 0 이상이어야 합니다.`)
		}

		// %·flat 모두 소수 1자리까지 허용합니다.
		stats[field.id] = Math.round(fieldValue * 10) / 10
	}

	return stats
}

function assertOwnership(value: unknown): CompanionOwnershipEntry[] {
	if (!Array.isArray(value)) {
		throw new ConsultingValidationError('보유 현황 형식이 올바르지 않습니다.')
	}

	const seen = new Set<string>()
	const entries: CompanionOwnershipEntry[] = []

	for (const item of value) {
		if (!item || typeof item !== 'object') {
			throw new ConsultingValidationError('보유 현황 항목이 올바르지 않습니다.')
		}

		const { companionId, level } = item as { companionId?: unknown; level?: unknown }
		if (typeof companionId !== 'string') {
			throw new ConsultingValidationError('보유 동료 ID가 올바르지 않습니다.')
		}

		const companion = getCompanionById(companionId)
		if (!companion) {
			throw new ConsultingValidationError(`알 수 없는 동료입니다: ${companionId}`)
		}

		if (seen.has(companionId)) {
			throw new ConsultingValidationError('보유 현황에 같은 동료가 중복되어 있습니다.')
		}
		seen.add(companionId)

		if (typeof level !== 'number' || !Number.isFinite(level)) {
			throw new ConsultingValidationError(`${companion.name} 레벨이 올바르지 않습니다.`)
		}

		entries.push({
			companionId,
			level: clampCompanionLevel(companion.grade, level)
		})
	}

	return entries
}

function assertLoadout(
	value: unknown,
	ownership: readonly CompanionOwnershipEntry[],
	{ requireEquipped }: { requireEquipped: boolean }
): CompanionConsultingLoadout {
	if (!value || typeof value !== 'object') {
		throw new ConsultingValidationError('세팅 형식이 올바르지 않습니다.')
	}

	const raw = value as Record<string, unknown>
	const levelById = new Map(ownership.map((entry) => [entry.companionId, entry.level]))
	const usedIds = new Set<string>()
	const loadout: CompanionConsultingLoadout = {}
	let equippedCount = 0

	for (const slot of COMPANION_SETUP_SLOTS) {
		const slotRaw = raw[slot.id]
		if (!slotRaw || typeof slotRaw !== 'object') {
			loadout[slot.id] = { companionId: null, level: 1 }
			continue
		}

		const { companionId, level } = slotRaw as { companionId?: unknown; level?: unknown }

		if (companionId === null || companionId === undefined || companionId === '') {
			loadout[slot.id] = { companionId: null, level: 1 }
			continue
		}

		if (typeof companionId !== 'string') {
			throw new ConsultingValidationError(`${slot.label} 동료 ID가 올바르지 않습니다.`)
		}

		const companion = getCompanionById(companionId)
		if (!companion) {
			throw new ConsultingValidationError(`${slot.label}에 알 수 없는 동료가 있습니다.`)
		}

		const ownedLevel = levelById.get(companionId)
		if (ownedLevel === undefined) {
			throw new ConsultingValidationError(`${slot.label}: 미보유 동료는 장착할 수 없습니다 (${companion.name}).`)
		}

		if (usedIds.has(companionId)) {
			throw new ConsultingValidationError(`같은 동료를 여러 슬롯에 넣을 수 없습니다 (${companion.name}).`)
		}
		usedIds.add(companionId)

		// 슬롯 레벨은 보유 레벨을 기준으로 맞춤 (게임이 동료당 레벨 1개)
		const resolvedLevel =
			typeof level === 'number' && Number.isFinite(level) ? clampCompanionLevel(companion.grade, level) : ownedLevel

		if (resolvedLevel !== ownedLevel) {
			throw new ConsultingValidationError(
				`${companion.name} 슬롯 레벨(${resolvedLevel})이 보유 레벨(${ownedLevel})과 다릅니다.`
			)
		}

		loadout[slot.id] = { companionId, level: ownedLevel }
		equippedCount += 1
	}

	if (requireEquipped && equippedCount === 0) {
		throw new ConsultingValidationError('동료를 한 명 이상 장착해 주세요.')
	}

	return loadout
}

/** 게시글 작성 페이로드 검증 */
function parseConsultingPostInput(value: unknown): CompanionConsultingPostInput {
	if (!value || typeof value !== 'object') {
		throw new ConsultingValidationError('요청 본문이 올바르지 않습니다.')
	}

	const { title, content, presetStats, ownership, loadout, password } = value as Record<string, unknown>
	const ownershipEntries = assertOwnership(ownership)
	if (ownershipEntries.length === 0) {
		throw new ConsultingValidationError('보유 동료를 한 명 이상 선택해 주세요.')
	}

	return {
		title: assertTitle(title),
		content: assertContent(content),
		presetStats: assertPresetStats(presetStats),
		ownership: ownershipEntries,
		loadout: assertLoadout(loadout, ownershipEntries, { requireEquipped: true }),
		password: assertPassword(password)
	}
}

/** 게시글 수정 페이로드 — shortId + 비밀번호 + 본문 */
function parseConsultingPostUpdateInput(value: unknown): CompanionConsultingPostInput & { shortId: string } {
	if (!value || typeof value !== 'object') {
		throw new ConsultingValidationError('요청 본문이 올바르지 않습니다.')
	}

	const { shortId: rawShortId, ...rest } = value as Record<string, unknown>
	const parsed = parseConsultingPostInput(rest)

	return {
		shortId: assertShortId(rawShortId, '게시글 ID'),
		...parsed
	}
}

/** 추천 댓글 페이로드 검증 */
function parseConsultingCommentInput(value: unknown): CompanionConsultingCommentInput {
	if (!value || typeof value !== 'object') {
		throw new ConsultingValidationError('요청 본문이 올바르지 않습니다.')
	}

	const { postShortId, note, loadout, ownership, password } = value as Record<string, unknown>
	const shortId = assertShortId(postShortId, '게시글 ID')

	// 서버에서 게시글 ownership으로 다시 검증하므로, 클라이언트가 보낸 ownership은 참고용
	const ownershipEntries = assertOwnership(ownership)

	return {
		postShortId: shortId,
		note: assertNote(note),
		loadout: assertLoadout(loadout, ownershipEntries, { requireEquipped: true }),
		password: assertPassword(password)
	}
}

/** 추천 댓글 수정 — shortId + 비밀번호 + note/loadout (ownership은 서버가 붙임) */
function parseConsultingCommentUpdateFields(value: unknown): {
	shortId: string
	password: string
	note: string
	loadout: unknown
} {
	if (!value || typeof value !== 'object') {
		throw new ConsultingValidationError('요청 본문이 올바르지 않습니다.')
	}

	const { shortId, password, note, loadout } = value as Record<string, unknown>

	return {
		shortId: assertShortId(shortId, '추천 ID'),
		password: assertPassword(password),
		note: assertNote(note),
		loadout
	}
}

/** 삭제 요청 — shortId + 비밀번호 */
function parseConsultingDeleteInput(value: unknown, idLabel: string): { shortId: string; password: string } {
	if (!value || typeof value !== 'object') {
		throw new ConsultingValidationError('요청 본문이 올바르지 않습니다.')
	}

	const { shortId, password } = value as Record<string, unknown>

	return {
		shortId: assertShortId(shortId, idLabel),
		password: assertPassword(password)
	}
}

function parseConsultingShortId(value: unknown): string {
	return assertShortId(value, '게시글 ID')
}

export {
	parseConsultingCommentInput,
	parseConsultingCommentUpdateFields,
	parseConsultingDeleteInput,
	parseConsultingPostInput,
	parseConsultingPostUpdateInput,
	parseConsultingShortId
}
