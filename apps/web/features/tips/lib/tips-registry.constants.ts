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
		title: '유물 장착 효과',
		description: '유물별 각성 효과와 잠재옵션, 세팅 합산을 확인해보세요.',
		tags: ['유물'],
		href: '/tips/relic-setup'
	},
	{
		slug: 'content-stage-cut',
		title: '컨텐츠 별 스테이지컷',
		description: '컨텐츠 및 난이도 별 스테이지컷을 확인해보세요.',
		tags: ['파티퀘스트', '보스레이드'],
		href: '/tips/content-stage-cut'
	},
	{
		slug: 'guild-rivalry-hit-cut',
		title: '대항전 명중컷 · 버프 스택',
		description: '길드 대항전 단계별 필요 명중과, 보스 데미지 증가 스택을 확인해보세요.',
		tags: ['대항전'],
		href: '/tips/guild-rivalry-hit-cut'
	}
] as const satisfies readonly TipEntry[]

/** 레지스트리 등장 순서를 유지한 태그 목록 (필터 칩용) */
export const TIP_TAGS = [...new Set(TIP_ENTRIES.flatMap((tip) => tip.tags))] as const
