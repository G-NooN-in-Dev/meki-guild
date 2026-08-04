import type { CompanionSlotLoadout } from '@/features/tips/types/companion.type'

/**
 * 보유 중인 동료 한 건.
 * 미보유는 DB에 넣지 않고, 보유한 항목만 배열로 저장합니다.
 */
type CompanionOwnershipEntry = {
	companionId: string
	level: number
}

/** 슬롯 id → 장착 동료 (메인·서브) */
type CompanionConsultingLoadout = Record<string, CompanionSlotLoadout>

/** 프리셋 스탯 단위. percent=% / flat=절대값(명중·회피) */
type ConsultingPresetStatUnit = 'percent' | 'flat'

/**
 * 현재 프리셋 기준 전투 수치 키.
 * UI·검증·저장 순서는 CONSULTING_PRESET_STAT_FIELDS를 따릅니다.
 */
type ConsultingPresetStatId =
	| 'critRate'
	| 'critDamage'
	| 'attackSpeed'
	| 'mainStatBonus'
	| 'minDamageMultiplier'
	| 'maxDamageMultiplier'
	| 'bossDamage'
	| 'normalDamage'
	| 'accuracy'
	| 'evasion'

/** 프리셋 스탯 수치 맵 */
type ConsultingPresetStats = Record<ConsultingPresetStatId, number>

/**
 * 게시글 작성·수정용 클라이언트 페이로드.
 * password는 CUD용 단순 키이며, 서버에서만 해시로 저장합니다.
 */
type CompanionConsultingPostInput = {
	/** 목적/제목 한 줄 */
	title: string
	/** 보충 설명. 비워 두면 빈 문자열로 저장합니다. */
	content: string
	/** 현재 프리셋 기준 전투 수치 */
	presetStats: ConsultingPresetStats
	ownership: readonly CompanionOwnershipEntry[]
	loadout: CompanionConsultingLoadout
	/** 수정·삭제 시 다시 입력하는 CUD 비밀번호 */
	password: string
}

/** 목록·상세에 쓰는 게시글 요약/본문 */
type CompanionConsultingPost = {
	shortId: string
	title: string
	/** 보충 설명. 예전 글은 빈 문자열일 수 있습니다. */
	content: string
	presetStats: ConsultingPresetStats
	ownership: readonly CompanionOwnershipEntry[]
	loadout: CompanionConsultingLoadout
	/** ISO 문자열 */
	createdAt: string
	commentCount: number
	/** 비밀번호가 저장된 글만 수정·삭제 UI를 엽니다 (예전 글은 false) */
	hasPassword: boolean
}

/** 목록 API 페이지네이션 결과 */
type CompanionConsultingPostListResult = {
	posts: CompanionConsultingPost[]
	/** 실제 조회에 사용한 페이지 (범위 밖이면 보정됨) */
	page: number
	pageSize: number
	totalCount: number
	totalPages: number
}

/** 추천 세팅 댓글 입력 */
type CompanionConsultingCommentInput = {
	postShortId: string
	note: string
	loadout: CompanionConsultingLoadout
	/** 수정·삭제 시 다시 입력하는 CUD 비밀번호 */
	password: string
}

/** 추천 세팅 댓글 */
type CompanionConsultingComment = {
	shortId: string
	postShortId: string
	note: string
	loadout: CompanionConsultingLoadout
	createdAt: string
	/** 비밀번호가 저장된 댓글만 수정·삭제 UI를 엽니다 */
	hasPassword: boolean
}

/** 보유 UI용 로컬 상태 (미보유 포함) */
type CompanionOwnershipState = {
	owned: boolean
	level: number
}

type CompanionOwnershipStateMap = Record<string, CompanionOwnershipState>

export type {
	CompanionConsultingComment,
	CompanionConsultingCommentInput,
	CompanionConsultingLoadout,
	CompanionConsultingPost,
	CompanionConsultingPostInput,
	CompanionConsultingPostListResult,
	CompanionOwnershipEntry,
	CompanionOwnershipState,
	CompanionOwnershipStateMap,
	ConsultingPresetStatId,
	ConsultingPresetStats,
	ConsultingPresetStatUnit
}
