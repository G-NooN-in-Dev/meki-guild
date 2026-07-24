import {
	buildConsultingPaginationItems,
	CONSULTING_NOTE_MAX_LENGTH,
	CONSULTING_PASSWORD_MAX_LENGTH,
	CONSULTING_PASSWORD_MIN_LENGTH,
	CONSULTING_POST_LIST_LIMIT,
	CONSULTING_PRESET_STAT_FIELDS,
	CONSULTING_SHORT_ID_ALPHABET,
	CONSULTING_SHORT_ID_LENGTH,
	CONSULTING_TITLE_MAX_LENGTH,
	createEmptyPresetStats
} from '@/features/tips/lib/companion-consulting.constants'
import { clampRelicAwakeningStage, getRelicById, RELIC_SETUP_SLOTS, RELICS } from '@/features/tips/lib/relic.constants'
import { clampPotentialIds } from '@/features/tips/lib/relic-potential.constants'
import type { RelicGrade, RelicSlotLoadout } from '@/features/tips/types/relic.type'
import type {
	RelicConsultingLoadout,
	RelicOwnershipEntry,
	RelicOwnershipStateMap
} from '@/features/tips/types/relic-consulting.type'

/** 동료 컨설팅과 동일한 공유 한도·프리셋·페이지네이션을 재사용합니다. */
export {
	buildConsultingPaginationItems,
	CONSULTING_NOTE_MAX_LENGTH,
	CONSULTING_PASSWORD_MAX_LENGTH,
	CONSULTING_PASSWORD_MIN_LENGTH,
	CONSULTING_POST_LIST_LIMIT,
	CONSULTING_PRESET_STAT_FIELDS,
	CONSULTING_SHORT_ID_ALPHABET,
	CONSULTING_SHORT_ID_LENGTH,
	CONSULTING_TITLE_MAX_LENGTH,
	createEmptyPresetStats
}

/**
 * 등급별 기본 보유 여부.
 * 유니크·에픽은 대부분 보유, 레전드리는 미보유가 많다는 전제.
 */
export const RELIC_CONSULTING_DEFAULT_OWNED_BY_GRADE = {
	legendary: false,
	unique: true,
	epic: true
} as const satisfies Record<RelicGrade, boolean>

const EMPTY_SLOT_LOADOUT: RelicSlotLoadout = { relicId: null, stage: 0, potentialIds: [] }

/** 빈 세팅 보드 (슬롯별 null) */
export function createEmptyRelicConsultingLoadout(): RelicConsultingLoadout {
	return Object.fromEntries(RELIC_SETUP_SLOTS.map((slot) => [slot.id, { ...EMPTY_SLOT_LOADOUT }]))
}

/**
 * 보유 현황 초기값.
 * 레전드리=미보유, 유니크·에픽=보유 각성 0
 */
export function createDefaultRelicOwnershipStateMap(): RelicOwnershipStateMap {
	return Object.fromEntries(
		RELICS.map((relic) => [
			relic.id,
			{
				owned: RELIC_CONSULTING_DEFAULT_OWNED_BY_GRADE[relic.grade],
				stage: 0
			}
		])
	)
}

/** 보유 맵 → DB에 넣을 보유 목록 (owned만) */
export function relicOwnershipStateToEntries(stateMap: RelicOwnershipStateMap): RelicOwnershipEntry[] {
	const entries: RelicOwnershipEntry[] = []

	for (const relic of RELICS) {
		const state = stateMap[relic.id]
		if (!state?.owned) {
			continue
		}

		entries.push({
			relicId: relic.id,
			stage: clampRelicAwakeningStage(state.stage)
		})
	}

	return entries
}

/** DB 보유 목록 → UI 상태 맵 (없는 id는 미보유) */
export function relicOwnershipEntriesToStateMap(entries: readonly RelicOwnershipEntry[]): RelicOwnershipStateMap {
	const ownedById = new Map(entries.map((entry) => [entry.relicId, entry.stage]))
	const base = createDefaultRelicOwnershipStateMap()

	for (const relic of RELICS) {
		const stage = ownedById.get(relic.id)
		if (stage === undefined) {
			base[relic.id] = { owned: false, stage: 0 }
			continue
		}

		base[relic.id] = {
			owned: true,
			stage: clampRelicAwakeningStage(stage)
		}
	}

	return base
}

/** 보유 목록 → relicId Set (슬롯 선택 제한용) */
export function relicOwnershipEntriesToAllowedIds(entries: readonly RelicOwnershipEntry[]): Set<string> {
	return new Set(entries.map((entry) => entry.relicId))
}

/** 보유 목록 → relicId → 각성 단계 */
export function relicOwnershipEntriesToStageMap(entries: readonly RelicOwnershipEntry[]): Map<string, number> {
	return new Map(entries.map((entry) => [entry.relicId, clampRelicAwakeningStage(entry.stage)]))
}

/**
 * 슬롯에 유물을 넣을 때 보유 각성을 반영합니다.
 * 미보유면 relicId를 비웁니다. 잠재옵션은 등급 칸 수에 맞게 잘라 둡니다.
 */
export function syncRelicLoadoutWithOwnership(
	loadout: RelicConsultingLoadout,
	entries: readonly RelicOwnershipEntry[]
): RelicConsultingLoadout {
	const stageById = relicOwnershipEntriesToStageMap(entries)
	const next = { ...loadout }

	for (const slot of RELIC_SETUP_SLOTS) {
		const current = next[slot.id] ?? EMPTY_SLOT_LOADOUT
		const { relicId } = current

		if (!relicId) {
			next[slot.id] = { ...EMPTY_SLOT_LOADOUT }
			continue
		}

		const ownedStage = stageById.get(relicId)
		if (ownedStage === undefined) {
			next[slot.id] = { ...EMPTY_SLOT_LOADOUT }
			continue
		}

		const relic = getRelicById(relicId)
		next[slot.id] = {
			relicId,
			stage: ownedStage,
			potentialIds: relic ? clampPotentialIds(current.potentialIds, relic.grade) : []
		}
	}

	return next
}

/** 목록 URL. 1페이지는 쿼리 없이 깔끔하게 둡니다. */
export function getRelicConsultingListPath(page = 1) {
	if (page <= 1) {
		return '/tips/relic-setup'
	}

	return `/tips/relic-setup?page=${page}`
}

/** 공유 URL 경로 (앱 origin은 클라이언트에서 붙임) */
export function getRelicConsultingPostPath(shortId: string) {
	return `/tips/relic-setup/${shortId}`
}
