import type {
	ConsultingPresetStatId,
	ConsultingPresetStats,
	ConsultingPresetStatUnit
} from '@/features/tips/types/companion-consulting.type'
import type { ItemGrade } from '@/features/tips/types/item-grade.type'

/**
 * 동료·유물 컨설팅 공통 상수.
 * shortId·글 한도·프리셋·페이지네이션처럼 도메인과 무관한 규칙을 둡니다.
 */

/** 사람이 치기 쉬운 공유 ID 문자 (0/O, 1/I 제외) */
export const CONSULTING_SHORT_ID_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

export const CONSULTING_SHORT_ID_LENGTH = 8

/** 제목 한 줄 최대 길이 */
export const CONSULTING_TITLE_MAX_LENGTH = 60

/** 게시글 내용(선택) 최대 길이 */
export const CONSULTING_CONTENT_MAX_LENGTH = 500

/** 추천 댓글 한 줄 최대 길이 */
export const CONSULTING_NOTE_MAX_LENGTH = 200

/**
 * CUD(작성·수정·삭제)용 단순 비밀번호 길이.
 * 계정 ID/비번이 아니라, 글·댓글을 나중에 고치거나 지울 때 쓰는 키입니다.
 */
export const CONSULTING_PASSWORD_MIN_LENGTH = 4
export const CONSULTING_PASSWORD_MAX_LENGTH = 32

/** 목록 한 페이지에 보여줄 게시글 수 */
export const CONSULTING_POST_LIST_LIMIT = 10

/**
 * 등급별 기본 보유 여부.
 * 유니크·에픽은 대부분 보유, 레전더리(레전드리)는 미보유가 많다는 전제.
 */
export const CONSULTING_DEFAULT_OWNED_BY_GRADE = {
	legendary: false,
	unique: true,
	epic: true
} as const satisfies Record<ItemGrade, boolean>

/**
 * 페이지네이션에 표시할 페이지 번호·말줄임 목록을 만듭니다.
 * 예: 1 … 4 5 6 … 12
 */
export function buildConsultingPaginationItems(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, index) => index + 1)
	}

	const items: Array<number | 'ellipsis'> = [1]
	const start = Math.max(2, currentPage - 1)
	const end = Math.min(totalPages - 1, currentPage + 1)

	if (start > 2) {
		items.push('ellipsis')
	}

	for (let page = start; page <= end; page += 1) {
		items.push(page)
	}

	if (end < totalPages - 1) {
		items.push('ellipsis')
	}

	items.push(totalPages)
	return items
}

/**
 * 현재 프리셋 기준 입력 스탯.
 * 명중·회피만 flat, 나머지는 %.
 * UI 행 순서는 CONSULTING_PRESET_STAT_GROUPS를 따릅니다.
 */
export const CONSULTING_PRESET_STAT_FIELDS = [
	{ id: 'critRate', label: '크리티컬 확률', unit: 'percent' },
	{ id: 'critDamage', label: '크리티컬 데미지', unit: 'percent' },
	{ id: 'attackSpeed', label: '공격 속도', unit: 'percent' },
	{ id: 'mainStatBonus', label: '주스탯 추가 퍼센트', unit: 'percent' },
	{ id: 'minDamageMultiplier', label: '최소 데미지 배율', unit: 'percent' },
	{ id: 'maxDamageMultiplier', label: '최대 데미지 배율', unit: 'percent' },
	{ id: 'bossDamage', label: '보스 몬스터 데미지', unit: 'percent' },
	{ id: 'normalDamage', label: '일반 몬스터 데미지', unit: 'percent' },
	{ id: 'accuracy', label: '명중', unit: 'flat' },
	{ id: 'evasion', label: '회피', unit: 'flat' }
] as const satisfies readonly {
	id: ConsultingPresetStatId
	label: string
	unit: ConsultingPresetStatUnit
}[]

type ConsultingPresetStatField = (typeof CONSULTING_PRESET_STAT_FIELDS)[number]

/**
 * UI 행 배치용 세트 (한 행에 2개).
 * 카드/제목으로 묶지 않고, 한 블록 안에서 행만 나눌 때 씁니다.
 */
export const CONSULTING_PRESET_STAT_GROUPS = [
	{
		id: 'crit',
		label: '크리티컬',
		fieldIds: ['critRate', 'critDamage']
	},
	{
		id: 'speed-main-stat',
		label: '공격 속도 · 주스탯',
		fieldIds: ['attackSpeed', 'mainStatBonus']
	},
	{
		id: 'damage-multiplier',
		label: '데미지 배율',
		fieldIds: ['minDamageMultiplier', 'maxDamageMultiplier']
	},
	{
		id: 'monster-damage',
		label: '몬스터 데미지',
		fieldIds: ['bossDamage', 'normalDamage']
	},
	{
		id: 'hit-evade',
		label: '명중 · 회피',
		fieldIds: ['accuracy', 'evasion']
	}
] as const satisfies readonly {
	id: string
	label: string
	fieldIds: readonly ConsultingPresetStatId[]
}[]

const PRESET_STAT_FIELD_BY_ID = Object.fromEntries(
	CONSULTING_PRESET_STAT_FIELDS.map((field) => [field.id, field])
) as Record<ConsultingPresetStatId, ConsultingPresetStatField>

/** 그룹에 속한 필드 정의 목록 */
export function getPresetStatFieldsByGroup(groupId: (typeof CONSULTING_PRESET_STAT_GROUPS)[number]['id']) {
	const group = CONSULTING_PRESET_STAT_GROUPS.find((item) => item.id === groupId)
	if (!group) {
		return [] as ConsultingPresetStatField[]
	}

	return group.fieldIds.map((fieldId) => PRESET_STAT_FIELD_BY_ID[fieldId])
}

/** 빈 프리셋 스탯 (작성 폼 초기값) */
export function createEmptyPresetStats(): ConsultingPresetStats {
	return Object.fromEntries(CONSULTING_PRESET_STAT_FIELDS.map((field) => [field.id, 0])) as ConsultingPresetStats
}

/**
 * DB·예전 글에 빠진 키가 있어도 전체 필드를 채웁니다.
 * 조회 시 UI/타입이 깨지지 않게 보정용입니다.
 */
export function normalizePresetStats(value: Partial<ConsultingPresetStats> | null | undefined): ConsultingPresetStats {
	const empty = createEmptyPresetStats()
	if (!value) {
		return empty
	}

	return Object.fromEntries(
		CONSULTING_PRESET_STAT_FIELDS.map((field) => {
			const raw = value[field.id]
			return [field.id, typeof raw === 'number' && Number.isFinite(raw) ? raw : 0]
		})
	) as ConsultingPresetStats
}

export function formatPresetStatValue(value: number, unit: ConsultingPresetStatUnit) {
	const rounded = Math.round(value * 10) / 10
	return unit === 'percent' ? `${rounded}%` : String(rounded)
}
