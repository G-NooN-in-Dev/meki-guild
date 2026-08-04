import type { ConsultingPresetStats } from '@/features/tips/types/companion-consulting.type'
import type { RelicSlotLoadout } from '@/features/tips/types/relic.type'

/**
 * 보유 중인 유물 한 건.
 * 미보유는 DB에 넣지 않고, 보유한 항목만 배열로 저장합니다.
 * stage는 각성 단계(0~5)입니다.
 */
type RelicOwnershipEntry = {
	relicId: string
	stage: number
}

/** 슬롯 id → 장착 유물(각성·잠재 포함) */
type RelicConsultingLoadout = Record<string, RelicSlotLoadout>

/**
 * 게시글 작성·수정용 클라이언트 페이로드.
 * password는 CUD용 단순 키이며, 서버에서만 해시로 저장합니다.
 */
type RelicConsultingPostInput = {
	/** 목적/제목 한 줄 */
	title: string
	/** 보충 설명. 비워 두면 빈 문자열로 저장합니다. */
	content: string
	/** 현재 프리셋 기준 전투 수치 (추천 참고용) */
	presetStats: ConsultingPresetStats
	ownership: readonly RelicOwnershipEntry[]
	loadout: RelicConsultingLoadout
	/** 수정·삭제 시 다시 입력하는 CUD 비밀번호 */
	password: string
}

/** 목록·상세에 쓰는 게시글 요약/본문 */
type RelicConsultingPost = {
	shortId: string
	title: string
	/** 보충 설명. 예전 글은 빈 문자열일 수 있습니다. */
	content: string
	presetStats: ConsultingPresetStats
	ownership: readonly RelicOwnershipEntry[]
	loadout: RelicConsultingLoadout
	/** ISO 문자열 */
	createdAt: string
	commentCount: number
	/** 비밀번호가 저장된 글만 수정·삭제 UI를 엽니다 */
	hasPassword: boolean
}

/** 목록 API 페이지네이션 결과 */
type RelicConsultingPostListResult = {
	posts: RelicConsultingPost[]
	/** 실제 조회에 사용한 페이지 (범위 밖이면 보정됨) */
	page: number
	pageSize: number
	totalCount: number
	totalPages: number
}

/** 추천 세팅 댓글 입력 */
type RelicConsultingCommentInput = {
	postShortId: string
	note: string
	loadout: RelicConsultingLoadout
	/** 수정·삭제 시 다시 입력하는 CUD 비밀번호 */
	password: string
}

/** 추천 세팅 댓글 */
type RelicConsultingComment = {
	shortId: string
	postShortId: string
	note: string
	loadout: RelicConsultingLoadout
	createdAt: string
	/** 비밀번호가 저장된 댓글만 수정·삭제 UI를 엽니다 */
	hasPassword: boolean
}

/** 보유 UI용 로컬 상태 (미보유 포함) */
type RelicOwnershipState = {
	owned: boolean
	/** 각성 단계 0~5 */
	stage: number
}

type RelicOwnershipStateMap = Record<string, RelicOwnershipState>

export type {
	RelicConsultingComment,
	RelicConsultingCommentInput,
	RelicConsultingLoadout,
	RelicConsultingPost,
	RelicConsultingPostInput,
	RelicConsultingPostListResult,
	RelicOwnershipEntry,
	RelicOwnershipState,
	RelicOwnershipStateMap
}
