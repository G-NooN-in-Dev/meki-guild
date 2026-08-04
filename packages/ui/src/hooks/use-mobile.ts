import { useSyncExternalStore } from 'react'

import { getBreakpointMdPx, isBelowMdViewport } from '../lib/breakpoints'

/**
 * Sidebar 등에서 모바일 UI 분기용 hook.
 * 기준은 theme.css `--breakpoint-md`(Tailwind `md:`) 미만이다.
 */
function useIsMobile() {
	return useSyncExternalStore(
		(onStoreChange) => {
			const mdPx = getBreakpointMdPx()
			const mql = window.matchMedia(`(width < ${mdPx}px)`)
			mql.addEventListener('change', onStoreChange)
			return () => mql.removeEventListener('change', onStoreChange)
		},
		isBelowMdViewport,
		() => false
	)
}

export { useIsMobile }
