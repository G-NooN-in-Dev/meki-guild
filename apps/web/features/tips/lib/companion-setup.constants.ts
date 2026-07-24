import {
	ITEM_GRADE_BADGE_CLASS,
	ITEM_GRADE_ORDER,
	ITEM_GRADE_TAB_CLASS
} from '@/features/tips/lib/item-grade.constants'
import type {
	Companion,
	CompanionEquipEffect,
	CompanionEquipEffectBase,
	CompanionEquipEffectUnit,
	CompanionGrade,
	CompanionSetupSlot
} from '@/features/tips/types/companion.type'

/** UI·정렬용 등급 순서 — 공통 ITEM_GRADE_ORDER 재사용 */
export const COMPANION_GRADE_ORDER = ITEM_GRADE_ORDER

/** 등급 표시 라벨·차수 (동료만 차수 표기) */
export const COMPANION_GRADE_META = {
	legendary: {
		label: '레전더리',
		tierLabel: '4차'
	},
	unique: {
		label: '유니크',
		tierLabel: '3차'
	},
	epic: {
		label: '에픽',
		tierLabel: '2차'
	}
} as const satisfies Record<CompanionGrade, { label: string; tierLabel: string }>

/** 등급 Badge·탭 색상 — 공통 상수 재사용 */
export const COMPANION_GRADE_BADGE_CLASS = ITEM_GRADE_BADGE_CLASS
export const COMPANION_GRADE_TAB_CLASS = ITEM_GRADE_TAB_CLASS

/**
 * 레전더리 1레벨 대비 등급별 1레벨 수치 배율.
 * 유니크·에픽으로 갈수록 절반씩 줄어듭니다. (1 → 0.5 → 0.25)
 */
export const COMPANION_GRADE_LEVEL1_MULTIPLIER = {
	legendary: 1,
	unique: 0.5,
	epic: 0.25
} as const satisfies Record<CompanionGrade, number>

/**
 * 레벨당 상승률 (해당 등급 1레벨 수치 대비).
 * 실측: 레전더리/에픽 10%, 유니크 11%.
 */
export const COMPANION_GRADE_LEVEL_GROWTH_RATE = {
	legendary: 0.1,
	unique: 0.11,
	epic: 0.1
} as const satisfies Record<CompanionGrade, number>

/** 등급별 최대 레벨 */
export const COMPANION_GRADE_MAX_LEVEL = {
	legendary: 16,
	unique: 10,
	epic: 30
} as const satisfies Record<CompanionGrade, number>

/** 메인 1 + 서브 6 슬롯 정의 */
export const COMPANION_SETUP_SLOTS = [
	{ id: 'main', role: 'main', subIndex: null, label: '메인 동료' },
	{ id: 'sub-1', role: 'sub', subIndex: 1, label: '서브 동료 1' },
	{ id: 'sub-2', role: 'sub', subIndex: 2, label: '서브 동료 2' },
	{ id: 'sub-3', role: 'sub', subIndex: 3, label: '서브 동료 3' },
	{ id: 'sub-4', role: 'sub', subIndex: 4, label: '서브 동료 4' },
	{ id: 'sub-5', role: 'sub', subIndex: 5, label: '서브 동료 5' },
	{ id: 'sub-6', role: 'sub', subIndex: 6, label: '서브 동료 6' }
] as const satisfies readonly CompanionSetupSlot[]

/**
 * 동료 선택·보유 UI 직업 배치 순서.
 * 길드 직업 분포(JOBS_BY_CLASS_LINE)와 별도로 둡니다.
 */
export const COMPANION_JOB_ORDER = [
	'히어로',
	'팔라딘',
	'다크나이트',
	'썬콜',
	'불독',
	'비숍',
	'보우마스터',
	'신궁',
	'나이트로드',
	'섀도어',
	'바이퍼',
	'캡틴',
	'나이트워커',
	'윈드브레이커'
] as const satisfies readonly string[]

/**
 * 아직 출시되지 않아 동료 정보가 없는 직업.
 * 출시 후 COMPANION_EQUIP_EFFECT_BASE_BY_JOB에 수치를 넣고 여기서 제거합니다.
 */
export const UNRELEASED_COMPANION_JOBS = [] as const

const UNRELEASED_COMPANION_JOB_SET = new Set<string>(UNRELEASED_COMPANION_JOBS)

/** 출시된 직업만 동료 선택에 노출합니다. */
export const COMPANION_JOBS = COMPANION_JOB_ORDER.filter((job) => !UNRELEASED_COMPANION_JOB_SET.has(job))

/**
 * 직업별 장착 효과 — 레전더리 1레벨 기준.
 * 아이콘이 아직 없는 직업은 COMPANION_JOB_ICON_KEY에 넣지 않으면 플레이스홀더로 표시됩니다.
 */
export const COMPANION_EQUIP_EFFECT_BASE_BY_JOB = {
	히어로: { label: '최대 데미지 배율', legendaryLevel1Value: 20, unit: 'percent' },
	팔라딘: { label: '기본 공격 데미지', legendaryLevel1Value: 8, unit: 'percent' },
	다크나이트: { label: '명중', legendaryLevel1Value: 24, unit: 'flat' },
	썬콜: { label: '일반 몬스터 데미지', legendaryLevel1Value: 20, unit: 'percent' },
	불독: { label: '크리티컬 확률', legendaryLevel1Value: 12, unit: 'percent' },
	비숍: { label: '스킬 데미지', legendaryLevel1Value: 8, unit: 'percent' },
	보우마스터: { label: '공격 속도', legendaryLevel1Value: 20, unit: 'percent' },
	신궁: { label: '상태이상 데미지', legendaryLevel1Value: 32, unit: 'percent' },
	윈드브레이커: { label: '보스 몬스터 데미지', legendaryLevel1Value: 20, unit: 'percent' },
	나이트로드: { label: '보스 몬스터 데미지', legendaryLevel1Value: 20, unit: 'percent' },
	섀도어: { label: '최소 데미지 배율', legendaryLevel1Value: 20, unit: 'percent' },
	나이트워커: { label: '명중', legendaryLevel1Value: 24, unit: 'flat' },
	바이퍼: { label: '주 스탯', legendaryLevel1Value: 12, unit: 'percent' },
	캡틴: { label: '크리티컬 데미지', legendaryLevel1Value: 12, unit: 'percent' }
} as const satisfies Record<string, CompanionEquipEffectBase>

/** 게임 표시와 맞추기: %는 소수 1자리, 절대값은 정수 */
function roundEquipEffectValue(value: number, unit: CompanionEquipEffectUnit) {
	if (unit === 'percent') {
		return Math.round(value * 10) / 10
	}

	return Math.round(value)
}

function formatEquipEffectValue(value: number, unit: CompanionEquipEffectUnit) {
	const rounded = roundEquipEffectValue(value, unit)
	return unit === 'percent' ? `+${rounded}%` : `+${rounded}`
}

/** 등급 최대 레벨 안으로 레벨을 보정합니다. */
export function clampCompanionLevel(grade: CompanionGrade, level: number) {
	const maxLevel = COMPANION_GRADE_MAX_LEVEL[grade]
	return Math.min(maxLevel, Math.max(1, Math.floor(level)))
}

/**
 * 장착 효과 계산.
 * 수치 = 등급1레벨값 × (1 + (레벨-1) × 등급상승률)
 */
export function resolveEquipEffects(
	job: string,
	grade: CompanionGrade,
	level: number
): readonly CompanionEquipEffect[] {
	const base = COMPANION_EQUIP_EFFECT_BASE_BY_JOB[job as keyof typeof COMPANION_EQUIP_EFFECT_BASE_BY_JOB]

	if (!base) {
		return [
			{
				label: '장착 효과',
				value: 0,
				unit: 'flat',
				displayText: '장착 효과 — 수치 입력 예정'
			}
		]
	}

	const safeLevel = clampCompanionLevel(grade, level)
	const level1Value = base.legendaryLevel1Value * COMPANION_GRADE_LEVEL1_MULTIPLIER[grade]
	const rawValue = level1Value * (1 + (safeLevel - 1) * COMPANION_GRADE_LEVEL_GROWTH_RATE[grade])
	const value = roundEquipEffectValue(rawValue, base.unit)

	return [
		{
			label: base.label,
			value,
			unit: base.unit,
			displayText: `${base.label} ${formatEquipEffectValue(value, base.unit)}`
		}
	]
}

/**
 * 같은 효과 라벨끼리 수치를 합산해 최종 목록을 만듭니다.
 * (예: 히어로+히어로 다른 등급이 둘 다 있으면 최대 데미지 배율을 합침)
 */
export function aggregateEquipEffects(effects: readonly CompanionEquipEffect[]): readonly CompanionEquipEffect[] {
	const totals = new Map<string, { label: string; value: number; unit: CompanionEquipEffectUnit }>()

	for (const effect of effects) {
		const existing = totals.get(effect.label)
		if (existing) {
			existing.value += effect.value
			continue
		}

		totals.set(effect.label, {
			label: effect.label,
			value: effect.value,
			unit: effect.unit
		})
	}

	return [...totals.values()].map((entry) => {
		const value = roundEquipEffectValue(entry.value, entry.unit)
		return {
			label: entry.label,
			value,
			unit: entry.unit,
			displayText: `${entry.label} ${formatEquipEffectValue(value, entry.unit)}`
		}
	})
}

/**
 * 직업 → public/tips/companions 파일명 키.
 * 등급별 이미지는 없고 직업당 PNG 1장입니다.
 */
export const COMPANION_JOB_ICON_KEY = {
	히어로: 'hero',
	팔라딘: 'paladin',
	다크나이트: 'darkknight',
	썬콜: 'mage_sc',
	불독: 'mage_fd',
	비숍: 'bishop',
	보우마스터: 'bowmaster',
	신궁: 'marksman',
	나이트로드: 'nightlord',
	섀도어: 'shadower',
	바이퍼: 'viper',
	캡틴: 'captain',
	나이트워커: 'nightwalker',
	윈드브레이커: 'windbreaker'
} as const satisfies Record<string, string>

/** 직업 초상화 public 경로. 매핑이 없으면 빈 문자열. */
export function getCompanionImageSrc(job: string) {
	const iconKey = COMPANION_JOB_ICON_KEY[job as keyof typeof COMPANION_JOB_ICON_KEY]
	return iconKey ? `/tips/companions/${iconKey}.png` : ''
}

/** 직업 × 등급 조합으로 동료 카탈로그를 만듭니다. */
function createCompanion(job: string, grade: CompanionGrade): Companion {
	return {
		id: `${grade}-${job}`,
		name: job,
		job,
		grade,
		imageSrc: getCompanionImageSrc(job)
	}
}

export const COMPANIONS: readonly Companion[] = COMPANION_JOBS.flatMap((job) =>
	COMPANION_GRADE_ORDER.map((grade) => createCompanion(job, grade))
)

export function getCompanionById(id: string): Companion | undefined {
	return COMPANIONS.find((companion) => companion.id === id)
}
