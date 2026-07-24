import type { ItemGrade } from '@/features/tips/types/item-grade.type'

/** UI·정렬용 등급 순서 (높은 등급 먼저) */
export const ITEM_GRADE_ORDER = ['legendary', 'unique', 'epic'] as const satisfies readonly ItemGrade[]

/**
 * 등급 Badge 색상.
 * 레전더리=초록, 유니크=노랑, 에픽=보라.
 */
export const ITEM_GRADE_BADGE_CLASS = {
	legendary: 'border-transparent bg-pastel-green-100 text-pastel-green-800',
	unique: 'border-transparent bg-pastel-yellow-100 text-pastel-yellow-800',
	epic: 'border-transparent bg-pastel-purple-100 text-pastel-purple-800'
} as const satisfies Record<ItemGrade, string>

/**
 * 등급 탭 색상.
 * 비활성은 글자색만, 활성(data-active)은 Badge와 같은 배경·글자색을 씁니다.
 */
export const ITEM_GRADE_TAB_CLASS = {
	legendary: 'text-pastel-green-700 data-active:bg-pastel-green-100 data-active:text-pastel-green-800',
	unique: 'text-pastel-yellow-700 data-active:bg-pastel-yellow-100 data-active:text-pastel-yellow-800',
	epic: 'text-pastel-purple-700 data-active:bg-pastel-purple-100 data-active:text-pastel-purple-800'
} as const satisfies Record<ItemGrade, string>

/**
 * 등급별 초상화 테두리 — Badge 파스텔 톤과 맞춤.
 * GradePortrait에서 사용합니다.
 */
export const ITEM_GRADE_RING_CLASS = {
	legendary: 'ring-pastel-green-400',
	unique: 'ring-pastel-yellow-400',
	epic: 'ring-pastel-purple-400'
} as const satisfies Record<ItemGrade, string>

/**
 * 슬롯 카드(동료·유물) 배경·테두리.
 * 아이콘 ring만으로는 구분이 약해서, 장착 시 카드 전체에 같은 파스텔 톤을 입힙니다.
 */
export const ITEM_GRADE_SLOT_CLASS = {
	legendary: 'border-pastel-green-300 bg-pastel-green-50',
	unique: 'border-pastel-yellow-300 bg-pastel-yellow-50',
	epic: 'border-pastel-purple-300 bg-pastel-purple-50'
} as const satisfies Record<ItemGrade, string>

/** 슬롯 카드 hover — 등급 배경을 덮어쓰지 않도록 톤만 살짝 올립니다. */
export const ITEM_GRADE_SLOT_HOVER_CLASS = {
	legendary: 'hover:border-pastel-green-400 hover:bg-pastel-green-100/80',
	unique: 'hover:border-pastel-yellow-400 hover:bg-pastel-yellow-100/80',
	epic: 'hover:border-pastel-purple-400 hover:bg-pastel-purple-100/80'
} as const satisfies Record<ItemGrade, string>
