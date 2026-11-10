/** 보스레이드·파티퀘스트 보상 상세 섹션 앵커 */
export const TIPS_REWARD_DETAIL_ID = 'tips-reward-detail'

/** 데스크탑(lg+)에서는 표와 보상이 한 화면에 보이므로 스크롤하지 않습니다. */
const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)'

/** 고정 헤더(h-14) + 여유 */
const HEADER_OFFSET_PX = 56

/** 네이티브 smooth보다 느리게 — 긴 거리에서도 급하지 않게 */
const SCROLL_DURATION_MS = 800

/** 연속 탭 시 이전 애니메이션을 끊기 위한 토큰 */
let scrollAnimationToken = 0

/**
 * 보상 상세 제목이 화면 안에 충분히 보이면 true.
 * 이미 보이면 다시 스크롤하지 않아, 셀을 연속으로 눌러도 화면이 덜컥거리지 않습니다.
 */
function isRewardDetailComfortablyVisible(element: HTMLElement) {
	const { top } = element.getBoundingClientRect()
	const lowerBound = window.innerHeight * 0.75

	return top >= HEADER_OFFSET_PX && top <= lowerBound
}

function easeOutCubic(t: number) {
	return 1 - (1 - t) ** 3
}

/** duration 동안 ease-out으로 window 스크롤. 새 호출이 오면 이전 애니메이션은 중단합니다. */
function animateWindowScrollTo(targetY: number, durationMs: number) {
	const startY = window.scrollY
	const delta = targetY - startY
	if (Math.abs(delta) < 4) return

	const token = ++scrollAnimationToken
	const startTime = performance.now()

	function frame(now: number) {
		if (token !== scrollAnimationToken) return

		const progress = Math.min(1, (now - startTime) / durationMs)
		window.scrollTo(0, startY + delta * easeOutCubic(progress))

		if (progress < 1) {
			requestAnimationFrame(frame)
		}
	}

	requestAnimationFrame(frame)
}

/**
 * 모바일·태블릿에서, 보상 상세가 화면 밖에 있을 때만 천천히 스크롤합니다.
 * 이미 보이면 no-op. 대상에 scroll-mt-14를 둡니다.
 */
function scrollToRewardDetailIfNarrow() {
	if (typeof window === 'undefined') return
	if (window.matchMedia(DESKTOP_MEDIA_QUERY).matches) return

	const element = document.getElementById(TIPS_REWARD_DETAIL_ID)
	if (!element) return
	if (isRewardDetailComfortablyVisible(element)) return

	const targetY = window.scrollY + element.getBoundingClientRect().top - HEADER_OFFSET_PX
	animateWindowScrollTo(targetY, SCROLL_DURATION_MS)
}

export { scrollToRewardDetailIfNarrow }
