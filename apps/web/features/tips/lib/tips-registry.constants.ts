import type { TipCategory, TipCategoryGroup, TipEntry } from '@/features/tips/types/tip.type'

/**
 * 허브 카테고리 정의 (표시 순서).
 * 항목이 없는 카테고리는 `getTipsGroupedByCategory`에서 제외됩니다.
 */
export const TIP_CATEGORIES = [
	{ id: 'growth-adventure', label: '성장·모험 컨텐츠' },
	{ id: 'guild-contents', label: '길드 컨텐츠' },
	{ id: 'predict-calculator', label: '예측·계산기' },
	{ id: 'info', label: '정보' }
] as const satisfies readonly TipCategory[]

/**
 * 정보/팁 허브에 노출할 팁 목록.
 * 새 팁 추가 시 여기에 항목을 넣고 `/app/tips/[slug]/page.tsx` 라우트를 만듭니다.
 */
export const TIP_ENTRIES = [
	// 성장·모험 컨텐츠
	{
		slug: 'growth-dungeon',
		title: '성장 던전 정보',
		description: '단계별 명중컷 · 규칙',
		category: 'growth-adventure',
		tags: ['성장 던전'],
		href: '/tips/growth-dungeon'
	},
	{
		slug: 'boss-raid',
		title: '보스레이드 정보',
		description: '보스·난이도별 명중컷 · 클리어 보상',
		category: 'growth-adventure',
		tags: ['보스레이드'],
		href: '/tips/boss-raid'
	},
	{
		slug: 'party-quest',
		title: '파티퀘스트 정보',
		description: '퀘스트·난이도별 명중컷 · 클리어 보상',
		category: 'growth-adventure',
		tags: ['파티퀘스트'],
		href: '/tips/party-quest'
	},
	// 길드 컨텐츠
	{
		slug: 'guild-expedition-hit-cut',
		title: '토벌전 정보',
		description: '단계별 명중컷 · 제한시간',
		category: 'guild-contents',
		tags: ['토벌전'],
		href: '/tips/guild-expedition-hit-cut'
	},
	{
		slug: 'guild-rivalry-hit-cut',
		title: '대항전 정보',
		description: '단계별 명중컷 · 보스 데미지 스택',
		category: 'guild-contents',
		tags: ['대항전'],
		href: '/tips/guild-rivalry-hit-cut'
	},
	{
		slug: 'guild-training-info',
		title: '수련장 정보',
		description: '단계별 명중컷 · 처치 점수',
		category: 'guild-contents',
		tags: ['수련장'],
		href: '/tips/guild-training-info'
	},
	// 예측·계산기
	{
		slug: 'guild-rivalry-rank-predict',
		title: '길드 대항전 순위 예측',
		description: '길드원 전투력 기준 대항전 예상 순위',
		category: 'predict-calculator',
		tags: ['대항전'],
		href: '/tips/guild-rivalry-rank-predict'
	},
	{
		slug: 'guild-training-rank-predict',
		title: '길드 수련장 순위 예측',
		description: '길드원 전투력 기준 수련장 예상 순위',
		category: 'predict-calculator',
		tags: ['수련장'],
		href: '/tips/guild-training-rank-predict'
	},
	// 각종 정보
	{
		slug: 'companion-setup',
		title: '동료 정보',
		description: '직업·등급·레벨별 효과 비교, 세팅 시뮬레이션',
		category: 'info',
		tags: ['동료'],
		href: '/tips/companion-setup'
	},
	{
		slug: 'relic-setup',
		title: '유물 정보',
		description: '장착·보유 효과, 잠재 옵션, 세팅 시뮬레이션',
		category: 'info',
		tags: ['유물'],
		href: '/tips/relic-setup'
	},
	{
		slug: 'stage-journey',
		title: '용사의 발자취 정보',
		description: '챕터별 클리어 보상, 보유 효과·특수 옵션',
		category: 'info',
		tags: ['용사의 여정'],
		href: '/tips/stage-journey'
	},
	{
		slug: 'content-stage-cut',
		title: '스테이지컷 정보',
		description: '파티퀘스트·보스레이드 난이도별 스테이지컷',
		category: 'info',
		tags: ['파티퀘스트', '보스레이드'],
		href: '/tips/content-stage-cut'
	},
	{
		slug: 'job-release-order',
		title: '직업 출시 순서표',
		description: '원작 메이플 출시 순서',
		category: 'info',
		tags: ['직업'],
		href: '/tips/job-release-order'
	}
] as const satisfies readonly TipEntry[]

type TipSlug = (typeof TIP_ENTRIES)[number]['slug']

const TIP_ENTRIES_BY_SLUG = new Map(TIP_ENTRIES.map((entry) => [entry.slug, entry] as const))
const TIP_CATEGORIES_BY_ID = new Map(TIP_CATEGORIES.map((category) => [category.id, category] as const))

/** 상세 페이지 slug로 레지스트리 항목을 조회합니다. */
function getTipBySlug(slug: TipSlug) {
	return TIP_ENTRIES_BY_SLUG.get(slug)
}

/** 상세 페이지·metadata용 제목 (TIP_ENTRIES.title). */
function getTipTitleBySlug(slug: TipSlug): string {
	return getTipBySlug(slug)?.title ?? ''
}

/**
 * 상세 페이지 Badge 라벨.
 * 카테고리 label을 맨 앞에 두고, 그 뒤에 tags 순서를 유지합니다.
 */
function getTipBadgeLabelsBySlug(slug: TipSlug): readonly string[] {
	const entry = getTipBySlug(slug)
	if (!entry) return []

	const categoryLabel = TIP_CATEGORIES_BY_ID.get(entry.category)?.label
	return categoryLabel ? [categoryLabel, ...entry.tags] : [...entry.tags]
}

/**
 * 카테고리 순서대로 팁을 묶습니다.
 * 소속 팁이 없는 카테고리는 제외합니다.
 */
function getTipsGroupedByCategory(): TipCategoryGroup[] {
	return TIP_CATEGORIES.flatMap((category) => {
		const tips = TIP_ENTRIES.filter((tip) => tip.category === category.id)

		if (tips.length === 0) {
			return []
		}

		return [{ category, tips }]
	})
}

export { getTipBadgeLabelsBySlug, getTipBySlug, getTipsGroupedByCategory, getTipTitleBySlug }
export type { TipSlug }
