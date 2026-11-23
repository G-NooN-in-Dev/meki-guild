import type { GuildDashboardChartCardId } from '@/features/guild/types/guild-dashboard.type'

/** 차트 라인·도트 스트로크 */
const CHART_SERIES_STROKE_COLORS = [
	'var(--color-pastel-red-700)',
	'var(--color-pastel-orange-700)',
	'var(--color-pastel-yellow-700)',
	'var(--color-pastel-green-700)',
	'var(--color-pastel-blue-700)',
	'var(--color-pastel-navy-600)',
	'var(--color-pastel-purple-700)'
] as const

const CHART_SERIES_FILL_COLORS = [
	'var(--color-pastel-blue-200)',
	'var(--color-pastel-green-200)',
	'var(--color-pastel-orange-200)',
	'var(--color-pastel-navy-200)',
	'var(--color-pastel-purple-200)',
	'var(--color-pastel-red-200)',
	'var(--color-pastel-yellow-200)'
] as const

const PALETTE_LENGTH = CHART_SERIES_STROKE_COLORS.length

/**
 * 항목(카드)별 기본 색.
 * 0 red · 1 orange · 2 yellow · 3 green · 4 blue · 5 navy · 6 purple
 */
const SECTION_CHART_COLOR_BASE = {
	overview: 0,
	jobs: 2,
	expedition: 1,
	rivalry: 3,
	training: 6,
	'guild-boss': 4,
	bounty: 5
} as const satisfies Record<GuildDashboardChartCardId, number>

/**
 * 같은 항목 안에서 시리즈를 구분합니다.
 * slot 0,1,2… 마다 +2 해서 인접 지표가 비슷한 색이 되지 않게 합니다.
 */
function getSectionSeriesColorIndex(sectionId: GuildDashboardChartCardId, slot: number): number {
	const base = SECTION_CHART_COLOR_BASE[sectionId]
	return (base + slot * 2) % PALETTE_LENGTH
}

/** 상세: 순위 변동 차트 색 (slot 0) */
function getDetailRankColorIndex(sectionId: GuildDashboardChartCardId): number {
	return getSectionSeriesColorIndex(sectionId, 0)
}

/**
 * 상세: 항목 데이터 차트 색.
 * 순위 차트(slot 0)와 겹치지 않도록 metricSlot 0 → 전체 slot 1부터.
 */
function getDetailMetricColorIndex(sectionId: GuildDashboardChartCardId, metricSlot: number): number {
	return getSectionSeriesColorIndex(sectionId, metricSlot + 1)
}

export {
	CHART_SERIES_FILL_COLORS,
	CHART_SERIES_STROKE_COLORS,
	getDetailMetricColorIndex,
	getDetailRankColorIndex,
	getSectionSeriesColorIndex,
	PALETTE_LENGTH,
	SECTION_CHART_COLOR_BASE
}
