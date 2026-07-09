import { useEffect, useState } from 'react'

import { getBreakpointMdPx, isBelowMdViewport } from '../lib/breakpoints'

/**
 * Sidebar 등에서 모바일 UI 분기용 hook.
 * 기준은 theme.css `--breakpoint-md`(Tailwind `md:`) 미만이다.
 */
export function useIsMobile() {
	const [isMobile, setIsMobile] = useState(isBelowMdViewport)

	useEffect(() => {
		const mdPx = getBreakpointMdPx()
		const mql = window.matchMedia(`(width < ${mdPx}px)`)
		const onChange = () => setIsMobile(mql.matches)

		mql.addEventListener('change', onChange)
		return () => mql.removeEventListener('change', onChange)
	}, [])

	return isMobile
}
