import type { RelicContent, RelicEffectCategory, RelicFilterState, RelicTag } from '@/features/tips/types/relic.type'

/** 필터를 하나도 고르지 않은 초기 상태 */
const INITIAL_RELIC_FILTER: RelicFilterState = {
	grades: [],
	contents: [],
	categories: [],
	tags: []
}

/** 특수 옵션 — 표시 순서대로 나열합니다. */
const RELIC_CONTENT_OPTIONS = [
	{ value: 'chapter-hunt', label: '챕터 사냥' },
	{ value: 'chapter-challenge', label: '챕터 도전' },
	{ value: 'chapter-boss', label: '챕터 보스' },
	{ value: 'world-boss', label: '월드보스' },
	{ value: 'growth-dungeon', label: '성장 던전' },
	{ value: 'guild-raid', label: '길드 토벌전' },
	{ value: 'zakum', label: '자쿰' },
	{ value: 'horntail', label: '혼테일' },
	{ value: 'pink-bean', label: '핑크빈' },
	{ value: 'arena', label: '아레나 / 월드 아레나' }
] as const satisfies readonly { value: RelicContent; label: string }[]

/** 효과 종류. 데미지 → 치명 → 공격 → 피격·유틸 순입니다. */
const RELIC_EFFECT_CATEGORY_OPTIONS = [
	{ value: 'final-damage', label: '최종 데미지' },
	{ value: 'damage', label: '데미지' },
	{ value: 'attack', label: '공격력' },
	{ value: 'skill-basic-damage', label: '스킬 · 기본 공격 데미지' },
	{ value: 'attack-speed', label: '공격 속도' },
	{ value: 'penetration', label: '방어 관통력' },
	{ value: 'critical-rate', label: '크리티컬 확률' },
	{ value: 'critical-damage', label: '크리티컬 데미지' },
	{ value: 'normal-monster-damage', label: '일반 몬스터 데미지' },
	{ value: 'boss-monster-damage', label: '보스 몬스터 데미지' },
	{ value: 'min-damage-multiplier', label: '최소 데미지 배율' },
	{ value: 'max-damage-multiplier', label: '최대 데미지 배율' },
	{ value: 'taken-damage-increase', label: '받는 피해 증가' },
	{ value: 'taken-damage-reduction', label: '받는 피해 감소' },
	{ value: 'buff-debuff', label: '버프 · 디버프' },
	{ value: 'recovery', label: 'HP / MP 회복' },
	{ value: 'cooldown-reduction', label: '재사용 대기시간 감소' },
	{ value: 'duration', label: '지속시간 증가' },
	{ value: 'accuracy', label: '명중' }
] as const satisfies readonly { value: RelicEffectCategory; label: string }[]

/** 기타 옵션 */
const RELIC_TAG_OPTIONS = [
	{ value: 'companion', label: '동료 효과' },
	{ value: 'stackable', label: '중첩 가능' },
	{ value: 'cooldown', label: '재사용 대기시간' }
] as const satisfies readonly { value: RelicTag; label: string }[]

/**
 * 장착 효과 라벨 → 효과 종류.
 * 필터는 장착 효과만 보고, 보유 효과는 보지 않습니다.
 * 새 라벨은 여기에 넣어야 필터에 잡히며, 끝의 ` (…)` 보조 설명은 조회 시 뺍니다.
 */
const RELIC_EFFECT_CATEGORY_BY_LABEL: Record<string, RelicEffectCategory> = {
	'최종 데미지': 'final-damage',
	'동료 최종 데미지': 'final-damage',

	데미지: 'damage',
	'현재 데미지': 'damage',
	'일반 몬스터 데미지': 'normal-monster-damage',
	'보스 몬스터 데미지': 'boss-monster-damage',
	'스킬 데미지': 'skill-basic-damage',
	'기본 공격 데미지': 'skill-basic-damage',
	'최소 데미지 배율': 'min-damage-multiplier',
	'최대 데미지 배율': 'max-damage-multiplier',

	'크리티컬 확률': 'critical-rate',
	'크리티컬 데미지': 'critical-damage',

	공격력: 'attack',
	'아군 공격력': 'attack',
	'공격 속도': 'attack-speed',
	'방어 관통력': 'penetration',
	명중: 'accuracy',

	'받는 피해': 'taken-damage-increase',
	'대상 받는 피해': 'taken-damage-increase',
	'받는 피해 감소': 'taken-damage-reduction',
	'피해 면역 시간(초)': 'taken-damage-reduction',

	'대상 HP 회복력 감소': 'buff-debuff',
	'디버프 내성': 'buff-debuff',
	'특정 디버프 제거 쿨타임(초)': 'buff-debuff',

	'HP 회복': 'recovery',
	'HP/MP 회복': 'recovery',

	'스킬 재사용 대기시간 감소': 'cooldown-reduction',
	'HP 물약 재사용 대기시간 감소': 'cooldown-reduction',

	'버프 지속시간': 'duration',
	'동료 소환 지속시간': 'duration',
	'석상 특수 효과 지속시간': 'duration'
}

export {
	INITIAL_RELIC_FILTER,
	RELIC_CONTENT_OPTIONS,
	RELIC_EFFECT_CATEGORY_BY_LABEL,
	RELIC_EFFECT_CATEGORY_OPTIONS,
	RELIC_TAG_OPTIONS
}
