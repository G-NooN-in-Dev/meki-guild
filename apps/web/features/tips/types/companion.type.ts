/** 동료 등급. 4차(레전더리) ~ 2차(에픽)만 다룹니다. */
export type CompanionGrade = 'legendary' | 'unique' | 'epic'

/** 슬롯 역할: 메인 1 + 서브 6 */
export type CompanionSlotRole = 'main' | 'sub'

/** 장착 효과 수치 단위. percent=% / flat=절대값(명중 등) */
export type CompanionEquipEffectUnit = 'percent' | 'flat'

/**
 * 직업별 장착 효과의 레전더리 1레벨 기준값.
 * 유니크·에픽은 등급이 내려갈 때마다 절반으로 계산합니다.
 */
export type CompanionEquipEffectBase = {
	label: string
	/** 레전더리 1레벨 기준 수치 */
	legendaryLevel1Value: number
	unit: CompanionEquipEffectUnit
}

/** 등급·레벨이 반영된 실제 장착 효과 (표시용) */
export type CompanionEquipEffect = {
	label: string
	value: number
	unit: CompanionEquipEffectUnit
	/** UI에 바로 쓰는 문구 (예: 최대 데미지 배율 +20%) */
	displayText: string
}

/**
 * 동료 카탈로그 항목 (직업 × 등급).
 * 레벨·장착 효과는 슬롯 상태에 따라 resolveEquipEffects로 계산합니다.
 */
export type Companion = {
	/** 고유 키 (예: legendary-썬콜) */
	id: string
	/** 표시명 — 직업명과 동일 (등급은 배지로 구분) */
	name: string
	/** 대응 직업 */
	job: string
	grade: CompanionGrade
}

/** 세팅 보드의 슬롯 하나 */
export type CompanionSetupSlot = {
	id: string
	role: CompanionSlotRole
	/** 서브 슬롯 번호 (1~6). 메인은 null */
	subIndex: number | null
	label: string
}

/** 슬롯에 장착된 동료 + 레벨 */
export type CompanionSlotLoadout = {
	companionId: string | null
	level: number
}
