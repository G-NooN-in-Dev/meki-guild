import type { TipEntry } from '@/features/tips/types/tip.type'

/**
 * 정보/팁 허브에 노출할 팁 목록.
 * 새 팁 추가 시 여기에 항목을 넣고 `/app/tips/[slug]/page.tsx` 라우트를 만듭니다.
 */
export const TIP_ENTRIES = [
	{
		slug: 'companion-setup',
		title: '동료 장착 효과',
		description: '직업·등급·레벨에 따른 동료 장착 효과를 확인해보세요.',
		tags: ['동료'],
		href: '/tips/companion-setup'
	},
	{
		slug: 'relic-setup',
		title: '유물 장착·보유 효과',
		description: '유물별 장착·보유 효과와 잠재 옵션을 확인해보세요.',
		tags: ['유물'],
		href: '/tips/relic-setup'
	},
	{
		slug: 'stage-journey',
		title: '용사의 발자취 정보',
		description: '챕터별 클리어 보상과 보유 효과·특수 옵션을 확인해보세요.',
		tags: ['용사의 여정'],
		href: '/tips/stage-journey'
	},
	{
		slug: 'job-release-order',
		title: '직업 출시 순서표',
		description: '원작 직업 출시 순서로 메이플키우기 다음 직업을 가늠해보세요.',
		tags: ['직업'],
		href: '/tips/job-release-order'
	},
	{
		slug: 'content-stage-cut',
		title: '컨텐츠 별 스테이지컷',
		description: '컨텐츠 및 난이도 별 스테이지컷을 확인해보세요.',
		tags: ['파티퀘스트', '보스레이드'],
		href: '/tips/content-stage-cut'
	},
	{
		slug: 'boss-raid',
		title: '보스레이드 명중컷 및 보상',
		description: '보스레이드 명중컷 및 보상을 확인해보세요.',
		tags: ['보스레이드'],
		href: '/tips/boss-raid'
	},
	{
		slug: 'guild-expedition-hit-cut',
		title: '토벌전 명중컷 · 제한시간',
		description: '길드 토벌전 단계별 필요 명중과 제한시간을 확인해보세요.',
		tags: ['길드컨텐츠', '토벌전'],
		href: '/tips/guild-expedition-hit-cut'
	},
	{
		slug: 'guild-rivalry-hit-cut',
		title: '대항전 명중컷 · 버프 스택',
		description: '길드 대항전 단계별 필요 명중과, 보스 데미지 증가 스택을 확인해보세요.',
		tags: ['길드컨텐츠', '대항전'],
		href: '/tips/guild-rivalry-hit-cut'
	}
] as const satisfies readonly TipEntry[]

/** 레지스트리 등장 순서를 유지한 태그 목록 (필터 칩용) */
export const TIP_TAGS = [...new Set(TIP_ENTRIES.flatMap((tip) => tip.tags))] as const

type TipSlug = (typeof TIP_ENTRIES)[number]['slug']

const TIP_ENTRIES_BY_SLUG = new Map(TIP_ENTRIES.map((entry) => [entry.slug, entry] as const))

/** 상세 페이지 slug로 허브 태그를 조회합니다. */
export function getTipTagsBySlug(slug: TipSlug): readonly string[] {
	return TIP_ENTRIES_BY_SLUG.get(slug)?.tags ?? []
}
