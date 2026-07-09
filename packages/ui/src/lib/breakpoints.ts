/**
 * `packages/tailwind-config/theme.css`의 `--breakpoint-*`를 런타임에 읽는 유틸.
 * CSS 미적용·SSR 환경에서는 theme.css와 동일한 fallback 값을 쓴다.
 */
const BREAKPOINT_MD_FALLBACK_PX = 768

/** theme.css `--breakpoint-md` (Tailwind `md:` 시작점) */
export function getBreakpointMdPx(): number {
	if (typeof window === 'undefined') return BREAKPOINT_MD_FALLBACK_PX

	const raw = getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-md').trim()
	const parsed = Number.parseFloat(raw)

	return Number.isFinite(parsed) ? parsed : BREAKPOINT_MD_FALLBACK_PX
}

/**
 * Tailwind `md:` 미만 뷰포트 여부.
 * 디자인 가이드상 모바일/태블릿 경계는 `md`(768px) 미만으로 본다.
 */
export function isBelowMdViewport(): boolean {
	if (typeof window === 'undefined') return false

	return window.matchMedia(`(width < ${getBreakpointMdPx()}px)`).matches
}
