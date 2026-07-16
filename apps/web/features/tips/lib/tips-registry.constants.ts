import type { TipEntry } from '@/features/tips/types/tip.type'

/**
 * 정보/팁 허브에 노출할 팁 목록.
 * 새 팁 추가 시 여기에 항목을 넣고 `/app/tips/[slug]/page.tsx` 라우트를 만듭니다.
 */
export const TIP_ENTRIES = [
	{
		slug: 'companion-setup',
		title: '동료 세팅',
		description: '메인·서브 동료를 배치하고 장착 효과를 확인합니다.',
		category: '동료',
		href: '/tips/companion-setup'
	}
	// 보류: guild-rivalry-hit-cut (길드대항전 명중컷)
] as const satisfies readonly TipEntry[]
