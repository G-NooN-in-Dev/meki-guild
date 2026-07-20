import type {
	Relic,
	RelicAwakeningStage,
	RelicGrade,
	RelicResolvedEffects,
	RelicStatEffect,
	RelicStatUnit
} from '@/features/tips/types/relic.type'

/** UI·정렬용 등급 순서 (높은 등급 먼저) */
export const RELIC_GRADE_ORDER = ['legendary', 'unique', 'epic'] as const satisfies readonly RelicGrade[]

/** 등급 표시 라벨 — MGF.GG 유물 페이지 표기(레전드리)를 따릅니다. */
export const RELIC_GRADE_META = {
	legendary: {
		label: '레전드리'
	},
	unique: {
		label: '유니크'
	},
	epic: {
		label: '에픽'
	}
} as const satisfies Record<RelicGrade, { label: string }>

/**
 * 등급 Badge 색상.
 * 동료 세팅과 같은 파스텔 톤을 씁니다.
 */
export const RELIC_GRADE_BADGE_CLASS = {
	legendary: 'border-transparent bg-pastel-green-100 text-pastel-green-800',
	unique: 'border-transparent bg-pastel-yellow-100 text-pastel-yellow-800',
	epic: 'border-transparent bg-pastel-purple-100 text-pastel-purple-800'
} as const satisfies Record<RelicGrade, string>

/** 등급 탭 색상 (동료 세팅과 동일 톤) */
export const RELIC_GRADE_TAB_CLASS = {
	legendary: 'text-pastel-green-700 data-active:bg-pastel-green-100 data-active:text-pastel-green-800',
	unique: 'text-pastel-yellow-700 data-active:bg-pastel-yellow-100 data-active:text-pastel-yellow-800',
	epic: 'text-pastel-purple-700 data-active:bg-pastel-purple-100 data-active:text-pastel-purple-800'
} as const satisfies Record<RelicGrade, string>

/** 유물 슬롯은 총 4칸 */
export const RELIC_SETUP_SLOTS = [
	{ id: 'slot-1', label: '유물 슬롯 1' },
	{ id: 'slot-2', label: '유물 슬롯 2' },
	{ id: 'slot-3', label: '유물 슬롯 3' },
	{ id: 'slot-4', label: '유물 슬롯 4' }
] as const

/** 유물 각성은 0~5 단계 */
export const RELIC_MAX_AWAKENING_STAGE = 5

/** 유물 원본 목록 */
const RELIC_CATALOG_SOURCE = [
	{ name: '죽은 자의 부적', grade: 'epic', iconKey: 'charm-of-the-dead' },
	{ name: '돼지의 리본', grade: 'epic', iconKey: 'pig-ribbon' },
	{ name: '무녀의 구슬', grade: 'epic', iconKey: 'shaman-orb' },
	{ name: '어둠의 계약서', grade: 'epic', iconKey: 'dark-contract' },
	{ name: '무지개색 달팽이 등껍질', grade: 'unique', iconKey: 'rainbow-snail-shell' },
	{ name: '육각 수정 목걸이', grade: 'unique', iconKey: 'hex-crystal-necklace' },
	{ name: '아르웬의 유리구두', grade: 'unique', iconKey: 'arwen-glass-slipper' },
	{ name: '머쉬맘의 갓', grade: 'unique', iconKey: 'mushmom-hat' },
	{ name: '맑은 샘물', grade: 'unique', iconKey: 'clear-spring-water' },
	{ name: '헬레나의 오래된 장갑', grade: 'unique', iconKey: 'helenas-old-gloves' },
	{ name: '자쿰의 돌조각', grade: 'unique', iconKey: 'zakum-stone-fragment' },
	{ name: '혼테일의 비늘', grade: 'unique', iconKey: 'horntail-scale' },
	{ name: '성배', grade: 'legendary', iconKey: 'holy-grail' },
	{ name: '낡은 오르골', grade: 'legendary', iconKey: 'old-music-box' },
	{ name: '은 펜던트', grade: 'legendary', iconKey: 'silver-pendant' },
	{ name: '별의 돌', grade: 'legendary', iconKey: 'star-stone' },
	{ name: '고대의 책', grade: 'legendary', iconKey: 'ancient-book' },
	{ name: '월로', grade: 'legendary', iconKey: 'will-o-wisp' },
	{ name: '화염초', grade: 'legendary', iconKey: 'flame-grass' },
	{ name: '영혼의 계약서', grade: 'legendary', iconKey: 'soul-contract' },
	{ name: '불이 켜진 램프', grade: 'legendary', iconKey: 'lit-lamp' },
	{ name: '영혼의 주머니', grade: 'legendary', iconKey: 'soul-pouch' },
	{ name: '고대문서 조각', grade: 'legendary', iconKey: 'ancient-document-fragment' },
	{ name: '얼음의 영혼석', grade: 'legendary', iconKey: 'ice-soul-stone' },
	{ name: '불타는 용암', grade: 'legendary', iconKey: 'burning-lava' },
	{ name: '세이람의 목걸이', grade: 'legendary', iconKey: 'cygnus-necklace' },
	{ name: '감정의 물병', grade: 'legendary', iconKey: 'bottle-of-emotions' },
	{ name: '천도나무용 명약', grade: 'legendary', iconKey: 'celestial-dragon-elixir' },
	{ name: '양초', grade: 'legendary', iconKey: 'candle' },
	{ name: '동맹의 증표', grade: 'legendary', iconKey: 'alliance-emblem' },
	{ name: '뿔피리', grade: 'legendary', iconKey: 'horn-flute' },
	{ name: '저주받은 인형', grade: 'legendary', iconKey: 'cursed-doll' }
] as const satisfies readonly {
	name: string
	grade: RelicGrade
	iconKey: string
}[]

/**
 * 유물 이름 → public/tips/relics 파일명 키.
 * 등급별 이미지는 없고 유물당 PNG 1장입니다.
 */
export const RELIC_ICON_KEY = Object.fromEntries(
	RELIC_CATALOG_SOURCE.map((relic) => [relic.name, relic.iconKey])
) as Record<(typeof RELIC_CATALOG_SOURCE)[number]['name'], (typeof RELIC_CATALOG_SOURCE)[number]['iconKey']>

/** iconKey → public 경로 */
export function getRelicImageSrcByIconKey(iconKey: string) {
	return iconKey ? `/tips/relics/${iconKey}.png` : ''
}

/** 유물 표시명 → public 경로. 매핑이 없으면 빈 문자열. */
export function getRelicImageSrc(name: string) {
	const iconKey = RELIC_ICON_KEY[name as keyof typeof RELIC_ICON_KEY]
	return iconKey ? getRelicImageSrcByIconKey(iconKey) : ''
}

function createRelic(entry: (typeof RELIC_CATALOG_SOURCE)[number]): Relic {
	return {
		id: `${entry.grade}-${entry.iconKey}`,
		name: entry.name,
		grade: entry.grade,
		iconKey: entry.iconKey,
		imageSrc: getRelicImageSrcByIconKey(entry.iconKey)
	}
}

/** 등급 높은 순 → 이름 가나다순으로 정렬된 전체 유물 카탈로그 */
export const RELICS: readonly Relic[] = [...RELIC_CATALOG_SOURCE].map(createRelic).sort((a, b) => {
	const gradeDiff = RELIC_GRADE_ORDER.indexOf(a.grade) - RELIC_GRADE_ORDER.indexOf(b.grade)
	if (gradeDiff !== 0) {
		return gradeDiff
	}

	return a.name.localeCompare(b.name, 'ko')
})

export function getRelicById(id: string): Relic | undefined {
	return RELICS.find((relic) => relic.id === id)
}

export function getRelicByName(name: string): Relic | undefined {
	return RELICS.find((relic) => relic.name === name)
}

export function getRelicsByGrade(grade: RelicGrade): readonly Relic[] {
	return RELICS.filter((relic) => relic.grade === grade)
}

function stageValue<T>(values: readonly T[], stage: RelicAwakeningStage): T {
	const value = values[stage]
	if (value === undefined) {
		throw new Error(`각성 단계 값이 없습니다: stage=${stage}`)
	}
	return value
}

function stagePercent(values: readonly number[], stage: RelicAwakeningStage): string {
	return `${stageValue(values, stage)}%`
}

function stageFlat(values: readonly number[], stage: RelicAwakeningStage): string {
	return `${stageValue(values, stage)}`
}

/** 입력 단계가 범위를 벗어나면 0~5로 보정 */
export function clampRelicAwakeningStage(stage: number): RelicAwakeningStage {
	const clamped = Math.min(RELIC_MAX_AWAKENING_STAGE, Math.max(0, Math.floor(stage)))
	return clamped as RelicAwakeningStage
}

/** 게임 표시와 맞추기: %는 소수 1자리, 절대값은 정수 */
function roundRelicStatValue(value: number, unit: RelicStatUnit) {
	if (unit === 'percent') {
		return Math.round(value * 10) / 10
	}

	return Math.round(value)
}

function formatRelicStatValue(value: number, unit: RelicStatUnit) {
	const rounded = roundRelicStatValue(value, unit)
	return unit === 'percent' ? `+${rounded}%` : `+${rounded}`
}

/**
 * 합산용 스탯 한 줄을 만듭니다.
 * scope가 있으면 UI·합산에서 "최종 데미지 (월드보스)"처럼 구분해 표시합니다.
 */
function createRelicStat(
	label: string,
	values: readonly number[],
	stage: RelicAwakeningStage,
	unit: RelicStatUnit,
	scope?: string
): RelicStatEffect {
	const value = roundRelicStatValue(stageValue(values, stage), unit)
	return {
		label,
		value,
		unit,
		scope,
		displayText: `${label} ${formatRelicStatValue(value, unit)}`
	}
}

/** 합산 키: 같은 라벨·스코프·단위끼리만 더합니다. */
function relicStatAggregationKey({ label, scope, unit }: Pick<RelicStatEffect, 'label' | 'scope' | 'unit'>) {
	return `${label}::${scope ?? 'always'}::${unit}`
}

type RelicEffectDefinition = {
	activationCondition?: string
	resolveLines: (stage: RelicAwakeningStage) => readonly string[]
	/** 사이드바 합산에 쓰는 구조화 수치. lines와 별도로 유지합니다. */
	resolveStats: (stage: RelicAwakeningStage) => readonly RelicStatEffect[]
}

/** 유물별 효과 정의. 숫자는 각성 단계(0~5)에 따라 증가합니다. */
const RELIC_EFFECT_DEFINITION_BY_ID: Record<string, RelicEffectDefinition> = {
	'legendary-holy-grail': {
		resolveLines: (stage) => [
			`적 처치 시 2% 확률(보스는 100%)로 30초간 최종 데미지 ${stagePercent([15, 18, 21, 24, 27, 30], stage)} 증가`
		],
		resolveStats: (stage) => [
			createRelicStat('최종 데미지', [15, 18, 21, 24, 27, 30], stage, 'percent', '처치 시 30초')
		]
	},
	'legendary-old-music-box': {
		resolveLines: (stage) => [
			`디버프 피격 시 디버프 1개 제거 + 25초간 공격력 ${stagePercent([25, 30, 35, 40, 45, 50], stage)} 증가 (재사용 대기시간 20초)`
		],
		resolveStats: (stage) => [
			createRelicStat('공격력', [25, 30, 35, 40, 45, 50], stage, 'percent', '디버프 피격 시 25초')
		]
	},
	'legendary-silver-pendant': {
		resolveLines: (stage) => [
			`공격 시 15% 확률로 대상 받는 피해 5초간 ${stagePercent([10, 12, 14, 16, 18, 20], stage)} 증가`,
			`동시에 HP 회복력 30초간 ${stagePercent([5, 6, 7, 8, 9, 10], stage)} 감소, 최대 5중첩(지속시간 개별 적용)`
		],
		resolveStats: (stage) => [
			createRelicStat('대상 받는 피해', [10, 12, 14, 16, 18, 20], stage, 'percent', '공격 시 5초'),
			createRelicStat('대상 HP 회복력 감소', [5, 6, 7, 8, 9, 10], stage, 'percent', '중첩당')
		]
	},
	'legendary-star-stone': {
		resolveLines: (stage) => [
			`받는 피해 ${stagePercent([20, 24, 28, 32, 36, 40], stage)} 증가`,
			`보스 몬스터 데미지 ${stagePercent([50, 60, 70, 80, 90, 100], stage)} 증가`
		],
		resolveStats: (stage) => [
			createRelicStat('받는 피해', [20, 24, 28, 32, 36, 40], stage, 'percent'),
			createRelicStat('보스 몬스터 데미지', [50, 60, 70, 80, 90, 100], stage, 'percent')
		]
	},
	'legendary-ancient-book': {
		resolveLines: (stage) => [
			`크리티컬 확률 ${stagePercent([10, 12, 14, 16, 18, 20], stage)} 증가`,
			`크리티컬 데미지가 크리티컬 확률의 ${stagePercent([30, 36, 42, 48, 54, 60], stage)}만큼 증가`
		],
		resolveStats: (stage) => [
			createRelicStat('크리티컬 확률', [10, 12, 14, 16, 18, 20], stage, 'percent'),
			createRelicStat('크리티컬 데미지 (크확 연동)', [30, 36, 42, 48, 54, 60], stage, 'percent')
		]
	},
	'legendary-will-o-wisp': {
		resolveLines: (stage) => [
			`피해를 입으면 5% 확률로 HP ${stagePercent([3, 3.6, 4.2, 4.8, 5.4, 6], stage)} 회복`,
			`${stageValue([1, 1.2, 1.4, 1.6, 1.8, 2], stage)}초간 피해 면역 (재사용 대기시간 5초)`
		],
		resolveStats: (stage) => [
			createRelicStat('HP 회복', [3, 3.6, 4.2, 4.8, 5.4, 6], stage, 'percent', '피격 시'),
			createRelicStat('피해 면역 시간(초)', [1, 1.2, 1.4, 1.6, 1.8, 2], stage, 'flat', '피격 시')
		]
	},
	'legendary-flame-grass': {
		resolveLines: (stage) => [
			`주변 적 1명마다 최종 데미지 ${stagePercent([1, 1.2, 1.4, 1.6, 1.8, 2], stage)} 증가 (최대 10명)`
		],
		resolveStats: (stage) => [
			createRelicStat('최종 데미지', [1, 1.2, 1.4, 1.6, 1.8, 2], stage, 'percent', '주변 적 1명당'),
			createRelicStat('최종 데미지', [10, 12, 14, 16, 18, 20], stage, 'percent', '주변 적 10명 최대')
		]
	},
	'legendary-soul-contract': {
		activationCondition: '챕터 사냥',
		resolveLines: (stage) => [`전투 시 스킬 재사용 대기시간 ${stagePercent([20, 24, 28, 32, 36, 40], stage)} 감소`],
		resolveStats: (stage) => [
			createRelicStat('스킬 재사용 대기시간 감소', [20, 24, 28, 32, 36, 40], stage, 'percent', '챕터 사냥')
		]
	},
	'legendary-lit-lamp': {
		activationCondition: '월드보스',
		resolveLines: (stage) => [`전투 시 최종 데미지 ${stagePercent([20, 24, 28, 32, 36, 40], stage)} 증가`],
		resolveStats: (stage) => [createRelicStat('최종 데미지', [20, 24, 28, 32, 36, 40], stage, 'percent', '월드보스')]
	},
	'legendary-soul-pouch': {
		activationCondition: '아레나 / 월드 아레나',
		resolveLines: (stage) => [`전투 시 최종 데미지 ${stagePercent([20, 24, 28, 32, 36, 40], stage)} 증가`],
		resolveStats: (stage) => [
			createRelicStat('최종 데미지', [20, 24, 28, 32, 36, 40], stage, 'percent', '아레나 / 월드 아레나')
		]
	},
	'legendary-ancient-document-fragment': {
		activationCondition: '길드 토벌전',
		resolveLines: (stage) => [`전투 시 최종 데미지 ${stagePercent([20, 24, 28, 32, 36, 40], stage)} 증가`],
		resolveStats: (stage) => [createRelicStat('최종 데미지', [20, 24, 28, 32, 36, 40], stage, 'percent', '길드 토벌전')]
	},
	'legendary-ice-soul-stone': {
		resolveLines: (stage) => [
			'2초마다 MP 1% 회복',
			`MP 50% 이상일 때 크리티컬 데미지 ${stagePercent([20, 24, 28, 32, 36, 40], stage)} 증가`,
			`MP 75% 이상일 때 크리티컬 데미지 ${stagePercent([40, 48, 56, 64, 72, 80], stage)} 증가`
		],
		resolveStats: (stage) => [
			createRelicStat('크리티컬 데미지', [20, 24, 28, 32, 36, 40], stage, 'percent', 'MP 50% 이상'),
			createRelicStat('크리티컬 데미지', [40, 48, 56, 64, 72, 80], stage, 'percent', 'MP 75% 이상')
		]
	},
	'legendary-burning-lava': {
		resolveLines: (stage) => [
			`대상이 보호막 보유 시 최종 데미지 ${stagePercent([60, 72, 84, 96, 108, 120], stage)} 증가`,
			`대상이 디버프 보유 시 최종 데미지 ${stagePercent([8, 9.6, 11.2, 12.8, 14.4, 16], stage)} 증가`,
			`대상이 보호막이 아닌 버프 보유 시 최종 데미지 ${stagePercent([4, 4.8, 5.6, 6.4, 7.2, 8], stage)} 증가`
		],
		resolveStats: (stage) => [
			createRelicStat('최종 데미지', [60, 72, 84, 96, 108, 120], stage, 'percent', '대상 보호막'),
			createRelicStat('최종 데미지', [8, 9.6, 11.2, 12.8, 14.4, 16], stage, 'percent', '대상 디버프'),
			createRelicStat('최종 데미지', [4, 4.8, 5.6, 6.4, 7.2, 8], stage, 'percent', '대상 버프')
		]
	},
	'legendary-cygnus-necklace': {
		resolveLines: (stage) => [
			`주변 적 2명 이상: 일반 몬스터 데미지 ${stagePercent([30, 36, 42, 48, 54, 60], stage)} 증가`,
			`주변 적 1명: 보스 몬스터 데미지 ${stagePercent([10, 12, 14, 16, 18, 20], stage)} 증가`
		],
		resolveStats: (stage) => [
			createRelicStat('일반 몬스터 데미지', [30, 36, 42, 48, 54, 60], stage, 'percent', '주변 적 2명+'),
			createRelicStat('보스 몬스터 데미지', [10, 12, 14, 16, 18, 20], stage, 'percent', '주변 적 1명')
		]
	},
	'legendary-bottle-of-emotions': {
		resolveLines: (stage) => [
			`공격력 ${stagePercent([15, 18, 21, 24, 27, 30], stage)} 증가`,
			`공격 속도 60% 초과분 3%마다 최종 데미지 ${stagePercent([0.5, 0.6, 0.7, 0.8, 0.9, 1], stage)} 증가`,
			`추가 최종 데미지 최대 ${stagePercent([10, 12, 14, 16, 18, 20], stage)}`
		],
		resolveStats: (stage) => [
			createRelicStat('공격력', [15, 18, 21, 24, 27, 30], stage, 'percent'),
			createRelicStat('최종 데미지', [0.5, 0.6, 0.7, 0.8, 0.9, 1], stage, 'percent', '공속 3%당'),
			createRelicStat('최종 데미지', [10, 12, 14, 16, 18, 20], stage, 'percent', '공속 연동 최대')
		]
	},
	'legendary-celestial-dragon-elixir': {
		resolveLines: (stage) => [
			`공격 시 20% 확률로 5초간 대상 받는 피해 ${stagePercent([15, 18, 21, 24, 27, 30], stage)} 증가`,
			`전투 중 1회: 대상 버프 1개 제거 후 5초간 추가로 받는 피해 ${stagePercent([15, 18, 21, 24, 27, 30], stage)} 증가`
		],
		resolveStats: (stage) => [
			createRelicStat('대상 받는 피해', [15, 18, 21, 24, 27, 30], stage, 'percent', '공격 시 5초'),
			createRelicStat('대상 받는 피해', [15, 18, 21, 24, 27, 30], stage, 'percent', '버프 제거 후 5초')
		]
	},
	'legendary-candle': {
		resolveLines: (stage) => [
			`전투 시작 시 최종 데미지 ${stagePercent([8, 9.6, 11.2, 12.8, 14.4, 16], stage)} 증가`,
			`20초 후 보스 몬스터 데미지 ${stagePercent([30, 36, 42, 48, 54, 60], stage)} 증가`,
			'전투 시작 30초 후 모든 효과 종료'
		],
		resolveStats: (stage) => [
			createRelicStat('최종 데미지', [8, 9.6, 11.2, 12.8, 14.4, 16], stage, 'percent', '전투 시작~30초'),
			createRelicStat('보스 몬스터 데미지', [30, 36, 42, 48, 54, 60], stage, 'percent', '전투 20~30초')
		]
	},
	'legendary-alliance-emblem': {
		resolveLines: (stage) => [
			`아군 플레이어 공격력 ${stagePercent([10, 12, 14, 16, 18, 20], stage)} 증가`,
			'같은 유물을 장착한 다른 플레이어 효과와 중첩 적용'
		],
		resolveStats: (stage) => [createRelicStat('아군 공격력', [10, 12, 14, 16, 18, 20], stage, 'percent')]
	},
	'legendary-horn-flute': {
		resolveLines: (stage) => [
			`동료 소환 중 자신/동료 최종 데미지 ${stagePercent([10, 12, 14, 16, 18, 20], stage)} 증가`,
			`챕터 보스 전장에서는 자신의 최종 데미지 ${stagePercent([20, 24, 28, 32, 36, 40], stage)} 증가`
		],
		resolveStats: (stage) => [
			createRelicStat('최종 데미지', [10, 12, 14, 16, 18, 20], stage, 'percent', '동료 소환 중'),
			createRelicStat('최종 데미지', [20, 24, 28, 32, 36, 40], stage, 'percent', '챕터 보스 전장')
		]
	},
	'legendary-cursed-doll': {
		resolveLines: (stage) => [
			`명중 ${stageFlat([15, 18, 21, 24, 27, 30], stage)} + 최종 데미지 ${stagePercent([7, 8.4, 9.8, 11.2, 12.6, 14], stage)} 증가`,
			`공격이 회피되면 5초간 최종 데미지 효과 제거, 명중은 ${stageFlat([45, 54, 63, 72, 81, 90], stage)} 증가`
		],
		resolveStats: (stage) => [
			createRelicStat('명중', [15, 18, 21, 24, 27, 30], stage, 'flat'),
			createRelicStat('최종 데미지', [7, 8.4, 9.8, 11.2, 12.6, 14], stage, 'percent'),
			createRelicStat('명중', [45, 54, 63, 72, 81, 90], stage, 'flat', '회피 시 5초')
		]
	},
	'unique-rainbow-snail-shell': {
		resolveLines: (stage) => [
			`전투 시작 후 15초간 크리티컬 확률 ${stagePercent([15, 18, 21, 24, 27, 30], stage)} 증가`,
			`전투 시작 후 15초간 크리티컬 데미지 ${stagePercent([20, 24, 28, 32, 36, 40], stage)} 증가`
		],
		resolveStats: (stage) => [
			createRelicStat('크리티컬 확률', [15, 18, 21, 24, 27, 30], stage, 'percent', '전투 시작 15초'),
			createRelicStat('크리티컬 데미지', [20, 24, 28, 32, 36, 40], stage, 'percent', '전투 시작 15초')
		]
	},
	'unique-hex-crystal-necklace': {
		resolveLines: (stage) => [
			`20초마다 30초간 현재 데미지의 ${stagePercent([15, 18, 21, 24, 27, 30], stage)}만큼 증가`,
			'효과 최대 3중첩'
		],
		resolveStats: (stage) => [
			createRelicStat('현재 데미지', [15, 18, 21, 24, 27, 30], stage, 'percent', '중첩당'),
			createRelicStat('현재 데미지', [45, 54, 63, 72, 81, 90], stage, 'percent', '3중첩 최대')
		]
	},
	'unique-arwen-glass-slipper': {
		resolveLines: (stage) => [`동료 소환 지속시간 ${stagePercent([20, 24, 28, 32, 36, 40], stage)} 증가`],
		resolveStats: (stage) => [createRelicStat('동료 소환 지속시간', [20, 24, 28, 32, 36, 40], stage, 'percent')]
	},
	'unique-mushmom-hat': {
		resolveLines: (stage) => [
			`명중 ${stageFlat([5, 6, 7, 8, 9, 10], stage)} 증가`,
			`대상 회피보다 명중이 높으면 차이 1마다 데미지 ${stagePercent([1, 1.2, 1.4, 1.6, 1.8, 2], stage)} 증가`,
			`추가 데미지 최대 ${stagePercent([20, 24, 28, 32, 36, 40], stage)}`
		],
		resolveStats: (stage) => [
			createRelicStat('명중', [5, 6, 7, 8, 9, 10], stage, 'flat'),
			createRelicStat('데미지', [1, 1.2, 1.4, 1.6, 1.8, 2], stage, 'percent', '명중 차이 1당'),
			createRelicStat('데미지', [20, 24, 28, 32, 36, 40], stage, 'percent', '명중 차이 최대')
		]
	},
	'unique-clear-spring-water': {
		activationCondition: '성장 던전',
		resolveLines: (stage) => [`전투 시 최종 데미지 ${stagePercent([10, 12, 14, 16, 18, 20], stage)} 증가`],
		resolveStats: (stage) => [createRelicStat('최종 데미지', [10, 12, 14, 16, 18, 20], stage, 'percent', '성장 던전')]
	},
	'unique-helenas-old-gloves': {
		resolveLines: (stage) => [
			`공격 속도 ${stagePercent([8, 9.6, 11.2, 12.8, 14.4, 16], stage)} 증가`,
			`공격 속도의 ${stagePercent([25, 30, 35, 40, 45, 50], stage)}만큼 최대 데미지 배율 증가`
		],
		resolveStats: (stage) => [
			createRelicStat('공격 속도', [8, 9.6, 11.2, 12.8, 14.4, 16], stage, 'percent'),
			createRelicStat('최대 데미지 배율 (공속 연동)', [25, 30, 35, 40, 45, 50], stage, 'percent')
		]
	},
	'unique-zakum-stone-fragment': {
		activationCondition: '자쿰',
		resolveLines: (stage) => [
			`전투 시 최종 데미지 ${stagePercent([20, 28, 36, 44, 52, 60], stage)} 증가`,
			`HP 물약 재사용 대기시간 ${stagePercent([20, 28, 36, 44, 52, 60], stage)} 감소`,
			`디버프 내성 ${stageFlat([15, 18, 21, 24, 27, 30], stage)} 증가`
		],
		resolveStats: (stage) => [
			createRelicStat('최종 데미지', [20, 28, 36, 44, 52, 60], stage, 'percent', '자쿰'),
			createRelicStat('HP 물약 재사용 대기시간 감소', [20, 28, 36, 44, 52, 60], stage, 'percent', '자쿰'),
			createRelicStat('디버프 내성', [15, 18, 21, 24, 27, 30], stage, 'flat', '자쿰')
		]
	},
	'unique-horntail-scale': {
		activationCondition: '혼테일',
		resolveLines: (stage) => [
			`전투 시 최종 데미지 ${stagePercent([20, 28, 36, 44, 52, 60], stage)} 증가`,
			`HP 물약 재사용 대기시간 ${stagePercent([20, 28, 36, 44, 52, 60], stage)} 감소`,
			`'허약/유혹/물약 봉인/암흑' 즉시 제거 (재사용 대기시간 ${stageValue([60, 54, 48, 42, 36, 30], stage)}초)`
		],
		resolveStats: (stage) => [
			createRelicStat('최종 데미지', [20, 28, 36, 44, 52, 60], stage, 'percent', '혼테일'),
			createRelicStat('HP 물약 재사용 대기시간 감소', [20, 28, 36, 44, 52, 60], stage, 'percent', '혼테일'),
			createRelicStat('특정 디버프 제거 쿨타임(초)', [60, 54, 48, 42, 36, 30], stage, 'flat', '혼테일')
		]
	},
	'epic-charm-of-the-dead': {
		resolveLines: (stage) => [`10초마다 5초간 공격력 ${stagePercent([10, 12, 14, 16, 18, 20], stage)} 증가`],
		resolveStats: (stage) => [createRelicStat('공격력', [10, 12, 14, 16, 18, 20], stage, 'percent', '10초마다 5초')]
	},
	'epic-pig-ribbon': {
		resolveLines: (stage) => [
			`공격 시 20% 확률로 HP/MP ${stagePercent([1, 1.2, 1.4, 1.6, 1.8, 2], stage)} 회복 (재사용 대기시간 5초)`
		],
		resolveStats: (stage) => [createRelicStat('HP/MP 회복', [1, 1.2, 1.4, 1.6, 1.8, 2], stage, 'percent', '공격 시')]
	},
	'epic-shaman-orb': {
		resolveLines: (stage) => [`버프 지속시간 ${stagePercent([6, 7.2, 8.4, 9.6, 10.8, 12], stage)} 증가`],
		resolveStats: (stage) => [createRelicStat('버프 지속시간', [6, 7.2, 8.4, 9.6, 10.8, 12], stage, 'percent')]
	},
	'epic-dark-contract': {
		resolveLines: (stage) => [`보스 공격 시 크리티컬 확률 ${stagePercent([8, 9.6, 11.2, 12.8, 14.4, 16], stage)} 증가`],
		resolveStats: (stage) => [
			createRelicStat('크리티컬 확률', [8, 9.6, 11.2, 12.8, 14.4, 16], stage, 'percent', '보스 공격 시')
		]
	}
}

export function getRelicActivationCondition(relicId: string): string | undefined {
	return RELIC_EFFECT_DEFINITION_BY_ID[relicId]?.activationCondition
}

export function resolveRelicEffects(relicId: string, stage: number): RelicResolvedEffects | null {
	const relic = getRelicById(relicId)
	const definition = RELIC_EFFECT_DEFINITION_BY_ID[relicId]
	if (!relic || !definition) {
		return null
	}

	const safeStage = clampRelicAwakeningStage(stage)
	return {
		relicId: relic.id,
		relicName: relic.name,
		grade: relic.grade,
		stage: safeStage,
		lines: definition.resolveLines(safeStage),
		stats: definition.resolveStats(safeStage)
	}
}

/**
 * 장착된 유물 스탯을 라벨·스코프별로 합산합니다.
 * 조건부 효과(월드보스 등)는 scope가 달라서 상시 수치와 섞이지 않습니다.
 */
export function aggregateRelicStats(stats: readonly RelicStatEffect[]): readonly RelicStatEffect[] {
	const totals = new Map<string, { label: string; value: number; unit: RelicStatUnit; scope?: string }>()

	for (const { label, value, unit, scope } of stats) {
		const key = relicStatAggregationKey({ label, scope, unit })
		const existing = totals.get(key)
		if (existing) {
			existing.value += value
			continue
		}

		totals.set(key, { label, value, unit, scope })
	}

	return [...totals.values()].map(({ label, value, unit, scope }) => {
		const rounded = roundRelicStatValue(value, unit)
		return {
			label,
			value: rounded,
			unit,
			scope,
			displayText: `${label} ${formatRelicStatValue(rounded, unit)}`
		} satisfies RelicStatEffect
	})
}
