import {
	clampCompanionLevel,
	COMPANION_SETUP_SLOTS,
	COMPANIONS,
	getCompanionById
} from '@/features/tips/lib/companion-setup.constants'
import { CONSULTING_DEFAULT_OWNED_BY_GRADE } from '@/features/tips/lib/consulting.constants'
import type { CompanionSlotLoadout } from '@/features/tips/types/companion.type'
import type {
	CompanionConsultingLoadout,
	CompanionOwnershipEntry,
	CompanionOwnershipStateMap
} from '@/features/tips/types/companion-consulting.type'

/**
 * 동료 컨설팅 전용 상수·헬퍼.
 * shortId·한도·프리셋 등 공통 규칙은 consulting.constants를 씁니다.
 */

/** 빈 세팅 보드 (슬롯별 null) */
export function createEmptyConsultingLoadout(): CompanionConsultingLoadout {
	return Object.fromEntries(
		COMPANION_SETUP_SLOTS.map((slot) => [slot.id, { companionId: null, level: 1 } satisfies CompanionSlotLoadout])
	)
}

/**
 * 보유 현황 초기값.
 * 레전더리=미보유, 유니크·에픽=보유 Lv.1
 */
export function createDefaultOwnershipStateMap(): CompanionOwnershipStateMap {
	return Object.fromEntries(
		COMPANIONS.map((companion) => [
			companion.id,
			{
				owned: CONSULTING_DEFAULT_OWNED_BY_GRADE[companion.grade],
				level: 1
			}
		])
	)
}

/** 보유 맵 → DB에 넣을 보유 목록 (owned만) */
export function ownershipStateToEntries(stateMap: CompanionOwnershipStateMap): CompanionOwnershipEntry[] {
	const entries: CompanionOwnershipEntry[] = []

	for (const companion of COMPANIONS) {
		const state = stateMap[companion.id]
		if (!state?.owned) {
			continue
		}

		entries.push({
			companionId: companion.id,
			level: clampCompanionLevel(companion.grade, state.level)
		})
	}

	return entries
}

/** DB 보유 목록 → UI 상태 맵 (없는 id는 미보유) */
export function ownershipEntriesToStateMap(entries: readonly CompanionOwnershipEntry[]): CompanionOwnershipStateMap {
	const ownedById = new Map(entries.map((entry) => [entry.companionId, entry.level]))
	const base = createDefaultOwnershipStateMap()

	for (const companion of COMPANIONS) {
		const level = ownedById.get(companion.id)
		if (level === undefined) {
			base[companion.id] = { owned: false, level: 1 }
			continue
		}

		base[companion.id] = {
			owned: true,
			level: clampCompanionLevel(companion.grade, level)
		}
	}

	return base
}

/** 보유 목록 → companionId Set (슬롯 선택 제한용) */
export function ownershipEntriesToAllowedIds(entries: readonly CompanionOwnershipEntry[]): Set<string> {
	return new Set(entries.map((entry) => entry.companionId))
}

/** 보유 목록 → companionId → level */
export function ownershipEntriesToLevelMap(entries: readonly CompanionOwnershipEntry[]): Map<string, number> {
	return new Map(entries.map((entry) => [entry.companionId, entry.level]))
}

/**
 * 슬롯에 동료를 넣을 때 보유 레벨을 반영합니다.
 * 미보유면 companionId를 비웁니다.
 */
export function syncLoadoutWithOwnership(
	loadout: CompanionConsultingLoadout,
	entries: readonly CompanionOwnershipEntry[]
): CompanionConsultingLoadout {
	const levelById = ownershipEntriesToLevelMap(entries)
	const next = { ...loadout }

	for (const slot of COMPANION_SETUP_SLOTS) {
		const current = next[slot.id] ?? { companionId: null, level: 1 }
		const { companionId } = current

		if (!companionId) {
			next[slot.id] = { companionId: null, level: 1 }
			continue
		}

		const ownedLevel = levelById.get(companionId)
		if (ownedLevel === undefined) {
			next[slot.id] = { companionId: null, level: 1 }
			continue
		}

		const companion = getCompanionById(companionId)
		next[slot.id] = {
			companionId,
			level: companion ? clampCompanionLevel(companion.grade, ownedLevel) : ownedLevel
		}
	}

	return next
}

/** 목록 URL. 1페이지는 쿼리 없이 깔끔하게 둡니다. */
export function getConsultingListPath(page = 1) {
	if (page <= 1) {
		return '/tips/companion-setup'
	}

	return `/tips/companion-setup?page=${page}`
}

/** 공유 URL 경로 (앱 origin은 클라이언트에서 붙임) */
export function getConsultingPostPath(shortId: string) {
	return `/tips/companion-setup/${shortId}`
}
