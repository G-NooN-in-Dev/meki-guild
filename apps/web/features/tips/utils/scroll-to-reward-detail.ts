/** 보스레이드·파티퀘스트 보상 상세 섹션 앵커 */
export const TIPS_REWARD_DETAIL_ID = 'tips-reward-detail'

/** 고정 헤더(h-14) + 여유 */
const HEADER_OFFSET_PX = 56

/** 네이티브 smooth보다 느리게 — 긴 거리에서도 급하지 않게 */
const SCROLL_DURATION_MS = 800

/**
 * 제목이 이 비율보다 아래에 있으면 “안 보임”으로 보고 스크롤합니다.
 * 화면 하단 끝에 살짝만 걸친 경우는 스크롤 대상으로 둡니다.
 */
const VISIBLE_TOP_MAX_RATIO = 0.65

/** 연속 탭·터치 직후 재호출 시 이전 애니메이션을 끊기 위한 토큰 */
let scrollAnimationToken = 0

function getViewportHeight() {
	return window.visualViewport?.height ?? window.innerHeight
}

/**
 * 보상 상세 제목이 화면 안에 충분히 보이면 true.
 * 이미 보이면 다시 스크롤하지 않아, 셀을 연속으로 눌러도 화면이 덜컥거리지 않습니다.
 */
function isRewardDetailComfortablyVisible(element: HTMLElement) {
	const { top } = element.getBoundingClientRect()
	const lowerBound = getViewportHeight() * VISIBLE_TOP_MAX_RATIO

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
 * 보상 상세가 화면 밖에 있을 때만 천천히 스크롤합니다.
 * 뷰포트 너비로 막지 않습니다 — iPad 가로·1024px 에뮬도 동일하게 동작해야 합니다.
 * 터치 직후 브라우저 기본 스크롤과 싸우지 않도록 한 프레임 뒤에 시작합니다.
 */
function scrollToRewardDetailIfNarrow() {
	if (typeof window === 'undefined') return

	const token = ++scrollAnimationToken

	requestAnimationFrame(() => {
		if (token !== scrollAnimationToken) return

		const element = document.getElementById(TIPS_REWARD_DETAIL_ID)
		if (!element) return
		if (isRewardDetailComfortablyVisible(element)) return

		const targetY = window.scrollY + element.getBoundingClientRect().top - HEADER_OFFSET_PX
		animateWindowScrollTo(targetY, SCROLL_DURATION_MS)
	})
}

export { scrollToRewardDetailIfNarrow }
