/**
 * 길드 증감 라벨(▲/▼) 공통 포맷.
 * GrowthDelta가 접두사로 상승/하락 색을 입히므로, 여기선 문자열만 맞춥니다.
 */

/**
 * 값이 커질수록 좋은 지표(레벨·등급·인원 등).
 * 상승=▲, 하락=▼. 변동 없거나 비교 불가면 null.
 */
function formatArrowDelta(diff: number | null): string | null {
	if (diff === null || diff === 0) {
		return null
	}

	return diff > 0 ? `▲${diff}` : `▼${Math.abs(diff)}`
}

/**
 * 등수처럼 숫자가 작을수록 좋은 지표.
 * `rawDiff`는 current - previous (또는 left - right).
 * 등수 상승(숫자 감소)=▲, 하락=▼.
 */
function formatRankArrowDelta(rawDiff: number | null): string | null {
	if (rawDiff === null || rawDiff === 0) {
		return null
	}

	return rawDiff < 0 ? `▲${Math.abs(rawDiff)}` : `▼${rawDiff}`
}

export { formatArrowDelta, formatRankArrowDelta }
