import type { TipEntry } from '@/features/tips/types/tip.type'

/**
 * 정보/팁 허브에 노출할 팁 목록.
 * 새 팁 추가 시 여기에 항목을 넣고 `/app/tips/[slug]/page.tsx` 라우트를 만듭니다.
 */
export const TIP_ENTRIES = [
	{
		slug: 'content-stage-cut',
		title: '컨텐츠 별 스테이지컷',
		description: '컨텐츠 및 난이도 별 스테이지컷을 확인해보세요.',
		category: '컨텐츠',
		href: '/tips/content-stage-cut'
	},
	{
		slug: 'guild-rivalry-hit-cut',
		title: '대항전 명중컷 · 버프 스택',
		description: '길드 대항전 단계별 필요 명중과, 보스 데미지 증가 스택을 확인해보세요.',
		category: '대항전',
		href: '/tips/guild-rivalry-hit-cut'
	},
	{
		slug: 'companion-setup',
		title: '동료 세팅 컨설팅',
		description: '동료 세팅 개선이 필요하다면 요청해보세요.',
		category: '동료',
		href: '/tips/companion-setup'
	},
	{
		slug: 'relic-setup',
		title: '유물 세팅 컨설팅',
		description: '유물 세팅 개선이 필요하다면 요청해보세요.',
		category: '유물',
		href: '/tips/relic-setup'
	}
] as const satisfies readonly TipEntry[]
