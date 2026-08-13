import { clampRelicAwakeningStage, getRelicById } from '@/features/tips/lib/relic.constants'
import type { RelicAwakeningValues, RelicPossessionStatLine, RelicStatUnit } from '@/features/tips/types/relic.type'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/**
 * 유니크 공통 보유 효과.
 * 0단계 방어력은 제공표의 `30%` 대신 70으로 둡니다. (70·140·210·420·700·1,400)
 */
const UNIQUE_COMMON_POSSESSION = [
	{ label: '공격력', unit: 'flat', values: [100, 200, 300, 600, 1000, 2000] },
	{ label: '방어력', unit: 'flat', values: [70, 140, 210, 420, 700, 1400] }
] as const satisfies readonly RelicPossessionStatLine[]

/**
 * 에픽 공통 보유 효과.
 * 4~5단계는 제공 데이터, 0~3단계는 유니크와 같은 배율(1/2/3/6/10/20)로 채웠습니다.
 */
const EPIC_COMMON_POSSESSION = [
	{ label: '공격력', unit: 'flat', values: [50, 100, 150, 300, 500, 1000] },
	{ label: '최대 HP', unit: 'flat', values: [500, 1000, 1500, 3000, 5000, 10000] }
] as const satisfies readonly RelicPossessionStatLine[]

/** 자쿰·혼테일 전용. 혼테일은 제공표가 비어 있어 자쿰과 같은 최종 데미지로 둡니다. */
const RAID_UNIQUE_POSSESSION = [
	{ label: '최종 데미지', unit: 'percent', values: [1, 1.2, 1.4, 1.6, 1.8, 2] }
] as const satisfies readonly RelicPossessionStatLine[]

function percentLine(label: string, values: RelicAwakeningValues): RelicPossessionStatLine {
	return { label, unit: 'percent', values }
}

function flatLine(label: string, values: RelicAwakeningValues): RelicPossessionStatLine {
	return { label, unit: 'flat', values }
}

/** 레전드리·특수 유니크만 명시. 나머지 유니크/에픽은 등급 공통값을 씁니다. */
const RELIC_POSSESSION_STATS_BY_ID: Record<string, readonly RelicPossessionStatLine[]> = {
	'legendary-holy-grail': [percentLine('데미지', [30, 36, 42, 48, 54, 60])],
	'legendary-old-music-box': [flatLine('디버프 내성', [10, 12, 14, 16, 18, 20])],
	'legendary-silver-pendant': [percentLine('방어 관통력', [5, 6, 7, 8, 9, 10])],
	'legendary-star-stone': [percentLine('방어력', [10, 12, 14, 16, 18, 20])],
	'legendary-ancient-book': [percentLine('크리티컬 확률', [5, 6, 7, 8, 9, 10])],
	'legendary-will-o-wisp': [percentLine('받는 피해 감소', [5, 6, 7, 8, 9, 10])],
	'legendary-flame-grass': [percentLine('일반 몬스터 데미지', [15, 18, 21, 24, 27, 30])],
	'legendary-soul-contract': [percentLine('스킬 데미지', [15, 18, 21, 24, 27, 30])],
	'legendary-lit-lamp': [percentLine('보스 몬스터 데미지', [15, 18, 21, 24, 27, 30])],
	'legendary-soul-pouch': [flatLine('회피', [20, 24, 28, 32, 36, 40])],
	'legendary-ancient-document-fragment': [percentLine('최대 데미지 배율', [15, 18, 21, 24, 27, 30])],
	'legendary-ice-soul-stone': [percentLine('크리티컬 데미지', [10, 12, 14, 16, 18, 20])],
	'legendary-burning-lava': [flatLine('명중', [10, 12, 14, 16, 18, 20])],
	'legendary-cygnus-necklace': [percentLine('기본 공격 데미지', [15, 18, 21, 24, 27, 30])],
	'legendary-bottle-of-emotions': [percentLine('최소 데미지 배율', [15, 18, 21, 24, 27, 30])],
	'legendary-celestial-dragon-elixir': [percentLine('공격 속도', [5, 6, 7, 8, 9, 10])],
	'legendary-candle': [percentLine('데미지', [30, 36, 42, 48, 54, 60])],
	'legendary-alliance-emblem': [percentLine('최대 데미지 배율', [15, 18, 21, 24, 27, 30])],
	'legendary-horn-flute': [percentLine('보스 몬스터 데미지', [15, 18, 21, 24, 27, 30])],
	'legendary-cursed-doll': [flatLine('명중', [10, 12, 14, 16, 18, 20])],
	'legendary-reindeer-spear': [percentLine('데미지', [30, 36, 42, 48, 54, 60])],
	'legendary-secret-map': [percentLine('최종 데미지', [2, 2.4, 2.8, 3.2, 3.6, 4])],
	'legendary-circulation-ring': [percentLine('크리티컬 데미지', [10, 12, 14, 16, 18, 20])],
	'unique-zakum-stone-fragment': RAID_UNIQUE_POSSESSION,
	'unique-horntail-scale': RAID_UNIQUE_POSSESSION
}

function getRelicPossessionStats(relicId: string): readonly RelicPossessionStatLine[] | undefined {
	const explicit = RELIC_POSSESSION_STATS_BY_ID[relicId]
	if (explicit) {
		return explicit
	}

	const relic = getRelicById(relicId)
	if (!relic) {
		return undefined
	}

	if (relic.grade === 'unique') {
		return UNIQUE_COMMON_POSSESSION
	}

	if (relic.grade === 'epic') {
		return EPIC_COMMON_POSSESSION
	}

	return undefined
}

function formatRelicPossessionValue(value: number, unit: RelicStatUnit) {
	if (unit === 'percent') {
		const rounded = Math.round(value * 10) / 10
		return `+${rounded}%`
	}

	return `+${formatLocaleNumber(Math.round(value))}`
}

/** 선택한 각성 단계의 보유 효과 문구. 표에서 장착 효과와 같은 단계를 씁니다. */
function resolveRelicPossessionLines(relicId: string, stage: number): readonly string[] {
	const stats = getRelicPossessionStats(relicId)
	if (!stats) {
		return []
	}

	const safeStage = clampRelicAwakeningStage(stage)
	return stats.map(({ label, unit, values }) => `${label} ${formatRelicPossessionValue(values[safeStage], unit)}`)
}

export { formatRelicPossessionValue, getRelicPossessionStats, resolveRelicPossessionLines }
