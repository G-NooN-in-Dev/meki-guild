import {
	CONSULTING_CONTENT_MAX_LENGTH,
	CONSULTING_NOTE_MAX_LENGTH,
	CONSULTING_PASSWORD_MAX_LENGTH,
	CONSULTING_PASSWORD_MIN_LENGTH,
	CONSULTING_PRESET_STAT_FIELDS,
	CONSULTING_SHORT_ID_ALPHABET,
	CONSULTING_SHORT_ID_LENGTH,
	CONSULTING_TITLE_MAX_LENGTH
} from '@/features/tips/lib/companion-consulting.constants'
import { clampRelicAwakeningStage, getRelicById, RELIC_SETUP_SLOTS } from '@/features/tips/lib/relic.constants'
import { clampPotentialIds, getRelicPotentialOptionById } from '@/features/tips/lib/relic-potential.constants'
import type { ConsultingPresetStats } from '@/features/tips/types/companion-consulting.type'
import type {
	RelicConsultingCommentInput,
	RelicConsultingLoadout,
	RelicConsultingPostInput,
	RelicOwnershipEntry
} from '@/features/tips/types/relic-consulting.type'

/** 검증 실패 시 사용자에게 보여줄 메시지 */
export class RelicConsultingValidationError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'RelicConsultingValidationError'
	}
}

function assertShortId(value: unknown, label: string): string {
	if (typeof value !== 'string') {
		throw new RelicConsultingValidationError(`${label}가 올바르지 않습니다.`)
	}

	const normalized = value.trim().toUpperCase()
	if (normalized.length !== CONSULTING_SHORT_ID_LENGTH) {
		throw new RelicConsultingValidationError(`${label} 길이가 올바르지 않습니다.`)
	}

	for (const char of normalized) {
		if (!CONSULTING_SHORT_ID_ALPHABET.includes(char)) {
			throw new RelicConsultingValidationError(`${label} 형식이 올바르지 않습니다.`)
		}
	}

	return normalized
}

function assertTitle(value: unknown): string {
	if (typeof value !== 'string') {
		throw new RelicConsultingValidationError('제목을 입력해 주세요.')
	}

	const trimmed = value.trim()
	if (trimmed.length === 0) {
		throw new RelicConsultingValidationError('제목을 입력해 주세요.')
	}

	if (trimmed.length > CONSULTING_TITLE_MAX_LENGTH) {
		throw new RelicConsultingValidationError(`제목은 ${CONSULTING_TITLE_MAX_LENGTH}자까지 입력할 수 있습니다.`)
	}

	return trimmed
}

/** 게시글 내용 — 비워 두면 빈 문자열. 필수 아님. */
function assertContent(value: unknown): string {
	if (value === undefined || value === null) {
		return ''
	}

	if (typeof value !== 'string') {
		throw new RelicConsultingValidationError('내용 형식이 올바르지 않습니다.')
	}

	const trimmed = value.trim()
	if (trimmed.length > CONSULTING_CONTENT_MAX_LENGTH) {
		throw new RelicConsultingValidationError(`내용은 ${CONSULTING_CONTENT_MAX_LENGTH}자까지 입력할 수 있습니다.`)
	}

	return trimmed
}

function assertNote(value: unknown): string {
	if (value === undefined || value === null) {
		return ''
	}

	if (typeof value !== 'string') {
		throw new RelicConsultingValidationError('메모 형식이 올바르지 않습니다.')
	}

	const trimmed = value.trim()
	if (trimmed.length > CONSULTING_NOTE_MAX_LENGTH) {
		throw new RelicConsultingValidationError(`메모는 ${CONSULTING_NOTE_MAX_LENGTH}자까지 입력할 수 있습니다.`)
	}

	return trimmed
}

/**
 * CUD용 단순 비밀번호 검증.
 * 계정 로그인이 아니라 글/댓글을 고치·지울 때 쓰는 키입니다.
 */
function assertPassword(value: unknown): string {
	if (typeof value !== 'string') {
		throw new RelicConsultingValidationError('비밀번호를 입력해 주세요.')
	}

	const trimmed = value.trim()
	if (trimmed.length < CONSULTING_PASSWORD_MIN_LENGTH) {
		throw new RelicConsultingValidationError(`비밀번호는 ${CONSULTING_PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`)
	}

	if (trimmed.length > CONSULTING_PASSWORD_MAX_LENGTH) {
		throw new RelicConsultingValidationError(`비밀번호는 ${CONSULTING_PASSWORD_MAX_LENGTH}자까지 입력할 수 있습니다.`)
	}

	if (/\s/.test(trimmed)) {
		throw new RelicConsultingValidationError('비밀번호에 공백을 넣을 수 없습니다.')
	}

	return trimmed
}

/** 프리셋 스탯 — 정의된 필드 모두 0 이상 숫자여야 합니다. */
function assertPresetStats(value: unknown): ConsultingPresetStats {
	if (!value || typeof value !== 'object') {
		throw new RelicConsultingValidationError('프리셋 스탯을 입력해 주세요.')
	}

	const raw = value as Record<string, unknown>
	const stats = {} as ConsultingPresetStats

	for (const field of CONSULTING_PRESET_STAT_FIELDS) {
		const fieldValue = raw[field.id]
		if (typeof fieldValue !== 'number' || !Number.isFinite(fieldValue)) {
			throw new RelicConsultingValidationError(`${field.label} 수치가 올바르지 않습니다.`)
		}

		if (fieldValue < 0) {
			throw new RelicConsultingValidationError(`${field.label}은(는) 0 이상이어야 합니다.`)
		}

		stats[field.id] = field.unit === 'percent' ? Math.round(fieldValue * 10) / 10 : Math.round(fieldValue)
	}

	return stats
}

function assertOwnership(value: unknown): RelicOwnershipEntry[] {
	if (!Array.isArray(value)) {
		throw new RelicConsultingValidationError('보유 현황 형식이 올바르지 않습니다.')
	}

	const seen = new Set<string>()
	const entries: RelicOwnershipEntry[] = []

	for (const item of value) {
		if (!item || typeof item !== 'object') {
			throw new RelicConsultingValidationError('보유 현황 항목이 올바르지 않습니다.')
		}

		const { relicId, stage } = item as { relicId?: unknown; stage?: unknown }
		if (typeof relicId !== 'string') {
			throw new RelicConsultingValidationError('보유 유물 ID가 올바르지 않습니다.')
		}

		const relic = getRelicById(relicId)
		if (!relic) {
			throw new RelicConsultingValidationError(`알 수 없는 유물입니다: ${relicId}`)
		}

		if (seen.has(relicId)) {
			throw new RelicConsultingValidationError('보유 현황에 같은 유물이 중복되어 있습니다.')
		}
		seen.add(relicId)

		if (typeof stage !== 'number' || !Number.isFinite(stage)) {
			throw new RelicConsultingValidationError(`${relic.name} 각성 단계가 올바르지 않습니다.`)
		}

		entries.push({
			relicId,
			stage: clampRelicAwakeningStage(stage)
		})
	}

	return entries
}

function assertPotentialIds(value: unknown, relicName: string): string[] {
	if (!Array.isArray(value)) {
		throw new RelicConsultingValidationError(`${relicName} 잠재옵션 형식이 올바르지 않습니다.`)
	}

	const ids: string[] = []
	for (const item of value) {
		if (typeof item !== 'string') {
			throw new RelicConsultingValidationError(`${relicName} 잠재옵션 ID가 올바르지 않습니다.`)
		}

		if (!getRelicPotentialOptionById(item)) {
			throw new RelicConsultingValidationError(`${relicName}에 알 수 없는 잠재옵션이 있습니다.`)
		}

		ids.push(item)
	}

	return ids
}

function assertLoadout(
	value: unknown,
	ownership: readonly RelicOwnershipEntry[],
	{ requireEquipped }: { requireEquipped: boolean }
): RelicConsultingLoadout {
	if (!value || typeof value !== 'object') {
		throw new RelicConsultingValidationError('세팅 형식이 올바르지 않습니다.')
	}

	const raw = value as Record<string, unknown>
	const stageById = new Map(ownership.map((entry) => [entry.relicId, entry.stage]))
	const usedIds = new Set<string>()
	const loadout: RelicConsultingLoadout = {}
	let equippedCount = 0

	for (const slot of RELIC_SETUP_SLOTS) {
		const slotRaw = raw[slot.id]
		if (!slotRaw || typeof slotRaw !== 'object') {
			loadout[slot.id] = { relicId: null, stage: 0, potentialIds: [] }
			continue
		}

		const { relicId, stage, potentialIds } = slotRaw as {
			relicId?: unknown
			stage?: unknown
			potentialIds?: unknown
		}

		if (relicId === null || relicId === undefined || relicId === '') {
			loadout[slot.id] = { relicId: null, stage: 0, potentialIds: [] }
			continue
		}

		if (typeof relicId !== 'string') {
			throw new RelicConsultingValidationError(`${slot.label} 유물 ID가 올바르지 않습니다.`)
		}

		const relic = getRelicById(relicId)
		if (!relic) {
			throw new RelicConsultingValidationError(`${slot.label}에 알 수 없는 유물이 있습니다.`)
		}

		const ownedStage = stageById.get(relicId)
		if (ownedStage === undefined) {
			throw new RelicConsultingValidationError(`${slot.label}: 미보유 유물은 장착할 수 없습니다 (${relic.name}).`)
		}

		if (usedIds.has(relicId)) {
			throw new RelicConsultingValidationError(`같은 유물을 여러 슬롯에 넣을 수 없습니다 (${relic.name}).`)
		}
		usedIds.add(relicId)

		// 슬롯 각성은 보유 각성을 기준으로 맞춤
		const resolvedStage =
			typeof stage === 'number' && Number.isFinite(stage) ? clampRelicAwakeningStage(stage) : ownedStage

		if (resolvedStage !== ownedStage) {
			throw new RelicConsultingValidationError(
				`${relic.name} 슬롯 각성(${resolvedStage})이 보유 각성(${ownedStage})과 다릅니다.`
			)
		}

		const rawPotentialIds = assertPotentialIds(potentialIds ?? [], relic.name)
		const clampedPotentials = clampPotentialIds(rawPotentialIds, relic.grade)
		if (clampedPotentials.length !== rawPotentialIds.length) {
			throw new RelicConsultingValidationError(
				`${relic.name} 잠재옵션 칸 수(${rawPotentialIds.length})가 등급 한도를 초과합니다.`
			)
		}

		loadout[slot.id] = {
			relicId,
			stage: ownedStage,
			potentialIds: clampedPotentials
		}
		equippedCount += 1
	}

	if (requireEquipped && equippedCount === 0) {
		throw new RelicConsultingValidationError('유물을 한 개 이상 장착해 주세요.')
	}

	return loadout
}

/** 게시글 작성 페이로드 검증 */
export function parseRelicConsultingPostInput(value: unknown): RelicConsultingPostInput {
	if (!value || typeof value !== 'object') {
		throw new RelicConsultingValidationError('요청 본문이 올바르지 않습니다.')
	}

	const { title, content, presetStats, ownership, loadout, password } = value as Record<string, unknown>
	const ownershipEntries = assertOwnership(ownership)
	if (ownershipEntries.length === 0) {
		throw new RelicConsultingValidationError('보유 유물을 한 개 이상 선택해 주세요.')
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
export function parseRelicConsultingPostUpdateInput(value: unknown): RelicConsultingPostInput & { shortId: string } {
	if (!value || typeof value !== 'object') {
		throw new RelicConsultingValidationError('요청 본문이 올바르지 않습니다.')
	}

	const { shortId: rawShortId, ...rest } = value as Record<string, unknown>
	const parsed = parseRelicConsultingPostInput(rest)

	return {
		shortId: assertShortId(rawShortId, '게시글 ID'),
		...parsed
	}
}

/** 추천 댓글 페이로드 검증 */
export function parseRelicConsultingCommentInput(value: unknown): RelicConsultingCommentInput {
	if (!value || typeof value !== 'object') {
		throw new RelicConsultingValidationError('요청 본문이 올바르지 않습니다.')
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

/** 추천 댓글 수정 — shortId + 비밀번호 + note/loadout */
export function parseRelicConsultingCommentUpdateFields(value: unknown): {
	shortId: string
	password: string
	note: string
	loadout: unknown
} {
	if (!value || typeof value !== 'object') {
		throw new RelicConsultingValidationError('요청 본문이 올바르지 않습니다.')
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
export function parseRelicConsultingDeleteInput(
	value: unknown,
	idLabel: string
): { shortId: string; password: string } {
	if (!value || typeof value !== 'object') {
		throw new RelicConsultingValidationError('요청 본문이 올바르지 않습니다.')
	}

	const { shortId, password } = value as Record<string, unknown>

	return {
		shortId: assertShortId(shortId, idLabel),
		password: assertPassword(password)
	}
}

export function parseRelicConsultingShortId(value: unknown): string {
	return assertShortId(value, '게시글 ID')
}
