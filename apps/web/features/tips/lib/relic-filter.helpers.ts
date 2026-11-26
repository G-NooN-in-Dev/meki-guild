import { RELICS } from '@/features/tips/lib/relic.constants'
import { RELIC_EFFECT_DEFINITION_BY_ID } from '@/features/tips/lib/relic-effects.data'
import { RELIC_EFFECT_CATEGORY_BY_LABEL } from '@/features/tips/lib/relic-filter.constants'
import type {
	Relic,
	RelicContent,
	RelicEffectCategory,
	RelicFilterState,
	RelicTag
} from '@/features/tips/types/relic.type'

/** 유물 하나가 필터에서 갖는 속성 (각성 단계와 무관한 정적 값) */
type RelicFilterMeta = {
	categories: ReadonlySet<RelicEffectCategory>
	contents: ReadonlySet<RelicContent>
	tags: ReadonlySet<RelicTag>
}

/** 라벨 뒤 ` (연동)` 같은 보조 설명을 떼고 카테고리를 찾습니다. */
function resolveEffectCategory(label: string): RelicEffectCategory | undefined {
	return RELIC_EFFECT_CATEGORY_BY_LABEL[label.replace(/\s+\(.*\)$/, '')]
}

function createRelicFilterMeta(relic: Relic): RelicFilterMeta {
	const definition = RELIC_EFFECT_DEFINITION_BY_ID[relic.id]
	const categories = new Set<RelicEffectCategory>(definition?.extraEffectCategories)

	// 효과 종류는 장착 효과만 기준으로 합니다. 라벨은 각성 단계와 무관하므로 0단계로 읽습니다.
	for (const { label } of definition?.resolveStats(0) ?? []) {
		const category = resolveEffectCategory(label)
		if (category) {
			categories.add(category)
		}
	}

	return {
		categories,
		contents: new Set(definition?.contents),
		tags: new Set(definition?.tags)
	}
}

/** 유물 id → 필터 속성. 데이터가 정적이라 모듈 로드 시 한 번만 계산합니다. */
const RELIC_FILTER_META_BY_ID: ReadonlyMap<string, RelicFilterMeta> = new Map(
	RELICS.map((relic) => [relic.id, createRelicFilterMeta(relic)])
)

/** 선택값이 비어 있으면 통과(전체), 아니면 하나라도 일치(OR)해야 통과 */
function matchesAny<T>(selected: readonly T[], has: (value: T) => boolean) {
	return selected.length === 0 || selected.some(has)
}

/** 그룹 사이는 AND, 그룹 안은 OR */
function matchesRelicFilter(relic: Relic, filter: RelicFilterState): boolean {
	const meta = RELIC_FILTER_META_BY_ID.get(relic.id)
	if (!meta) {
		return false
	}

	return (
		matchesAny(filter.grades, (grade) => relic.grade === grade) &&
		matchesAny(filter.contents, (content) => meta.contents.has(content)) &&
		matchesAny(filter.categories, (category) => meta.categories.has(category)) &&
		matchesAny(filter.tags, (tag) => meta.tags.has(tag))
	)
}

/** 선택된 필터 값의 총 개수 (트리거 뱃지용) */
function countActiveRelicFilters({ grades, contents, categories, tags }: RelicFilterState) {
	return grades.length + contents.length + categories.length + tags.length
}

/** 배열에 값이 있으면 빼고, 없으면 추가합니다. */
function toggleFilterValue<T>(values: readonly T[], value: T): T[] {
	return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

export { countActiveRelicFilters, matchesRelicFilter, toggleFilterValue }
