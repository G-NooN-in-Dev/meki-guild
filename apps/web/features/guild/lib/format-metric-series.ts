import { CHART_SERIES_FILL_COLORS, CHART_SERIES_STROKE_COLORS } from '@/features/guild/lib/chart-series-colors'
import type {
	GuildMetricChangeKind,
	GuildMetricFormat,
	GuildMetricPoint,
	GuildMetricSeries,
	GuildMetricYAxisId
} from '@/features/guild/types/guild-dashboard.type'
import { formatArrowDelta, formatRankArrowDelta } from '@/utils/format-delta-label'
import {
	formatDeltaPercent,
	formatKoreanNumber,
	formatLocaleNumber,
	formatPlacementRank,
	formatTrainingScore
} from '@/utils/format-korean-number'

const SERIES_STROKE_COLORS = CHART_SERIES_STROKE_COLORS
const SERIES_FILL_COLORS = CHART_SERIES_FILL_COLORS

function toSafeBigInt(value: number): bigint {
	return BigInt(Math.round(value))
}

/** 지표 값을 화면/툴팁용 한국어 단위 문자열로 바꿉니다. */
function formatMetricValue(value: number | null, format: GuildMetricFormat): string {
	if (value === null || !Number.isFinite(value)) {
		return '-'
	}

	switch (format) {
		case 'level':
			return formatLocaleNumber(Math.round(value))
		case 'count':
			return `${formatLocaleNumber(Math.round(value))}명`
		case 'stage':
			return `${formatLocaleNumber(Math.round(value))}단계`
		case 'rank':
			return formatPlacementRank(Math.round(value))
		case 'training':
			return formatTrainingScore(toSafeBigInt(value))
		case 'korean':
		default:
			return formatKoreanNumber(toSafeBigInt(value))
	}
}

/**
 * 정수 지표(레벨 등) Y축.
 * auto domain이면 114 / 114.5 / 115 → round 후 114·115·115처럼 중복됩니다.
 * @param minFloor 도메인 하한 (인원 수는 0 — 음수 tick 방지)
 */
function buildIntegerYAxis(
	values: number[],
	options?: { minFloor?: number }
): { domain: [number, number]; ticks: number[] } | null {
	const finite = values.filter((value) => Number.isFinite(value))

	if (finite.length === 0) {
		return null
	}

	const min = Math.min(...finite)
	const max = Math.max(...finite)
	const paddedMin = Math.floor(min) - 1
	const domainMin = options?.minFloor === undefined ? paddedMin : Math.max(options.minFloor, paddedMin)
	const domainMax = Math.max(domainMin + 1, Math.ceil(max) + 1)
	const ticks = Array.from({ length: domainMax - domainMin + 1 }, (_, index) => domainMin + index)

	return { domain: [domainMin, domainMax], ticks }
}

/** 차트 Y축용 한국어 단위. 축 전체에서 동일 단위를 씁니다. */
const CHART_AXIS_UNITS = [
	{ divisor: 1e20, suffix: '해' },
	{ divisor: 1e16, suffix: '경' },
	{ divisor: 1e12, suffix: '조' },
	{ divisor: 1e8, suffix: '억' },
	{ divisor: 1e4, suffix: '만' }
] as const

type ChartAxisUnit = (typeof CHART_AXIS_UNITS)[number]

/** 수련장 점수 Y축 — 0.5억 단위 (다음 시즌 4~5억 규모 대비) */
const TRAINING_AXIS_STEP = 50_000_000
const TRAINING_AXIS_UNIT = { divisor: 100_000_000, suffix: '억' } as const satisfies ChartAxisUnit

/**
 * 수련장 점수 Y축. 데이터 범위를 0.5억 격자에 맞춥니다.
 */
function buildTrainingYAxis(values: number[]): { domain: [number, number]; ticks: number[] } | null {
	const finite = values.filter((value) => Number.isFinite(value))

	if (finite.length === 0) {
		return null
	}

	const min = Math.min(...finite)
	const max = Math.max(...finite)
	const domainMin = Math.floor(min / TRAINING_AXIS_STEP) * TRAINING_AXIS_STEP
	let domainMax = Math.ceil(max / TRAINING_AXIS_STEP) * TRAINING_AXIS_STEP

	if (domainMax <= domainMin) {
		domainMax = domainMin + TRAINING_AXIS_STEP
	}

	const ticks: number[] = []

	for (let tick = domainMin; tick <= domainMax + 1e-6; tick += TRAINING_AXIS_STEP) {
		ticks.push(tick)
	}

	return { domain: [domainMin, domainMax], ticks }
}

/**
 * 축 최댓값 기준으로 단위를 고릅니다.
 * 범위가 단위 대비 너무 좁으면 한 단계 내려 눈금이 구분되게 합니다.
 */
function resolveChartAxisUnit(maxAbs: number, range: number): ChartAxisUnit | null {
	const startIndex = CHART_AXIS_UNITS.findIndex((unit) => maxAbs >= unit.divisor)

	if (startIndex < 0) {
		return null
	}

	let unitIndex = startIndex

	while (unitIndex < CHART_AXIS_UNITS.length - 1) {
		const unit = CHART_AXIS_UNITS[unitIndex]
		if (!unit) break

		// 범위가 단위의 5% 미만이면 소수만으로는 눈금이 겹치기 쉬워 하위 단위로 내림
		if (range > 0 && range / unit.divisor < 0.05) {
			unitIndex += 1
			continue
		}

		break
	}

	return CHART_AXIS_UNITS[unitIndex] ?? null
}

/** 축 범위가 단위 안에서 구분되도록 소수 자릿수를 정합니다. */
function resolveChartAxisDecimals(range: number, divisor: number): number {
	if (range <= 0) {
		return 0
	}

	const rangeInUnit = range / divisor
	const stepEstimate = rangeInUnit / 4

	if (stepEstimate >= 1) return 0
	if (stepEstimate >= 0.1) return 1
	if (stepEstimate >= 0.01) return 2

	return 3
}

function formatScaledAxisTick(value: number, unit: ChartAxisUnit, decimals: number): string {
	const scaled = value / unit.divisor
	const label = scaled.toLocaleString('ko-KR', {
		maximumFractionDigits: decimals,
		minimumFractionDigits: 0
	})

	return `${label}${unit.suffix}`
}

/**
 * Y축 tickFormatter 팩토리.
 * 축 데이터 범위를 보고 단위·소수 자릿수를 고정해, tick마다 다른 라벨이 나오게 합니다.
 */
function createMetricAxisTickFormatter(values: number[], format: GuildMetricFormat): (_value: number) => string {
	if (format === 'rank' || format === 'level' || format === 'stage' || format === 'count') {
		return (value: number) => (Number.isFinite(value) ? formatLocaleNumber(Math.round(value)) : '')
	}

	/** 수련장: 항상 억 단위 + 소수 1자리 (0.5억 격자) */
	if (format === 'training') {
		return (value: number) => {
			if (!Number.isFinite(value)) {
				return ''
			}

			return formatScaledAxisTick(value, TRAINING_AXIS_UNIT, 1)
		}
	}

	const finite = values.filter((value) => Number.isFinite(value))

	if (finite.length === 0) {
		return () => ''
	}

	const maxAbs = Math.max(...finite.map((value) => Math.abs(value)))
	const min = Math.min(...finite)
	const max = Math.max(...finite)
	const dataRange = max - min
	/** Recharts auto domain 패딩을 감안해 범위가 0이어도 최댓값의 일부로 소수 자릿수를 잡습니다. */
	const effectiveRange = dataRange > 0 ? dataRange : Math.max(maxAbs * 0.05, 1)
	const unit = resolveChartAxisUnit(maxAbs, effectiveRange)

	if (!unit) {
		return (value: number) => (Number.isFinite(value) ? formatLocaleNumber(Math.round(value)) : '')
	}

	const decimals = resolveChartAxisDecimals(effectiveRange, unit.divisor)

	return (value: number) => {
		if (!Number.isFinite(value)) {
			return ''
		}

		return formatScaledAxisTick(value, unit, decimals)
	}
}

/** 단일 값 포맷 (테스트·폴백). 축 전체 formatter가 있으면 createMetricAxisTickFormatter를 씁니다. */
function formatMetricAxisTick(value: number, format: GuildMetricFormat, axisValues: number[] = []): string {
	return createMetricAxisTickFormatter(axisValues.length > 0 ? axisValues : [value], format)(value)
}

function defaultChangeKind(format: GuildMetricFormat): GuildMetricChangeKind {
	if (format === 'level' || format === 'stage' || format === 'rank' || format === 'count') {
		return 'absolute'
	}

	return 'percent'
}

/** 시리즈에 지정된 Y축. 없으면 포맷 기본값(점수=left, 레벨·단계·순위=right). */
function resolveSeriesYAxisId(series: { format: GuildMetricFormat; yAxisId?: GuildMetricYAxisId }): GuildMetricYAxisId {
	if (series.yAxisId) {
		return series.yAxisId
	}

	if (series.format === 'rank' || series.format === 'level' || series.format === 'stage') {
		return 'right'
	}

	/** 인원 수는 단독 Y축(left)이 기본 */
	return 'left'
}

/**
 * 한 점의 직전 점 대비 증감 라벨.
 * lowerIsBetter(순위)는 개선이 ▲ / +% 로 보이도록 부호를 맞춥니다.
 */
function buildPointChangeLabels(
	previous: number | null,
	current: number | null,
	format: GuildMetricFormat,
	changeKind: GuildMetricChangeKind,
	lowerIsBetter: boolean
): { changeDeltaLabel: string | null; changePercentLabel: string | null } {
	if (previous === null || current === null) {
		return { changeDeltaLabel: null, changePercentLabel: null }
	}

	const rawDiff = current - previous

	if (format === 'rank' || lowerIsBetter) {
		return {
			changeDeltaLabel: formatRankArrowDelta(rawDiff),
			changePercentLabel: null
		}
	}

	if (format === 'level' || format === 'stage' || format === 'count' || changeKind === 'absolute') {
		return {
			changeDeltaLabel: formatArrowDelta(rawDiff),
			changePercentLabel: null
		}
	}

	const diff = toSafeBigInt(rawDiff)
	const previousBig = toSafeBigInt(previous)
	const sign = rawDiff > 0 ? '+' : rawDiff < 0 ? '-' : ''
	const absLabel = formatMetricValue(Math.abs(rawDiff), format)
	const changeDeltaLabel = rawDiff === 0 ? '-' : `${sign}${absLabel}`

	return {
		changeDeltaLabel,
		changePercentLabel: formatDeltaPercent(diff, previousBig)
	}
}

/** older → previous → current 순으로, 각 점에 직전 대비 증감을 붙입니다. */
function attachWeekOverWeekChanges(
	points: Array<Omit<GuildMetricPoint, 'changeDeltaLabel' | 'changePercentLabel'>>,
	format: GuildMetricFormat,
	changeKind: GuildMetricChangeKind,
	lowerIsBetter: boolean
): GuildMetricPoint[] {
	return points.map((point, index) => {
		if (index === 0) {
			return {
				...point,
				changeDeltaLabel: null,
				changePercentLabel: null
			}
		}

		const previousValue = points[index - 1]?.value ?? null
		const { changeDeltaLabel, changePercentLabel } = buildPointChangeLabels(
			previousValue,
			point.value,
			format,
			changeKind,
			lowerIsBetter
		)

		return {
			...point,
			changeDeltaLabel,
			changePercentLabel
		}
	})
}

type EnrichMetricSeriesInput = Omit<
	GuildMetricSeries,
	| 'stroke'
	| 'fill'
	| 'latestLabel'
	| 'changeDeltaLabel'
	| 'changePercentLabel'
	| 'points'
	| 'changeKind'
	| 'showInChart'
	| 'chartGroup'
	| 'yAxisId'
> & {
	format: GuildMetricFormat
	changeKind?: GuildMetricChangeKind
	showInChart?: boolean
	chartGroup?: number
	yAxisId?: GuildMetricYAxisId
	/** 색상 팔레트 인덱스. 미지정이면 seriesIndex 사용 */
	colorIndex?: number
	points: Array<Omit<GuildMetricPoint, 'changeDeltaLabel' | 'changePercentLabel'>>
}

/** 시리즈 정보를 확장해 최신 값·증감 라벨을 추가합니다. */
function enrichMetricSeries(series: EnrichMetricSeriesInput, seriesIndex: number): GuildMetricSeries {
	const changeKind = series.changeKind ?? defaultChangeKind(series.format)
	const lowerIsBetter = series.lowerIsBetter === true
	const points = attachWeekOverWeekChanges(series.points, series.format, changeKind, lowerIsBetter)
	const currentPoint = points.find((point) => point.slot === 'current')
	const colorIndex = (series.colorIndex ?? seriesIndex) % SERIES_STROKE_COLORS.length
	const yAxisId = resolveSeriesYAxisId(series)

	return {
		...series,
		changeKind,
		showInChart: series.showInChart !== false,
		chartGroup: series.chartGroup ?? 0,
		yAxisId,
		points,
		stroke: SERIES_STROKE_COLORS[colorIndex] ?? SERIES_STROKE_COLORS[0],
		fill: SERIES_FILL_COLORS[colorIndex] ?? SERIES_FILL_COLORS[0],
		latestLabel: formatMetricValue(currentPoint?.value ?? null, series.format),
		changeDeltaLabel: currentPoint?.changeDeltaLabel ?? null,
		changePercentLabel: currentPoint?.changePercentLabel ?? null
	}
}

export {
	buildIntegerYAxis,
	buildTrainingYAxis,
	createMetricAxisTickFormatter,
	enrichMetricSeries,
	formatMetricAxisTick,
	formatMetricValue,
	resolveSeriesYAxisId
}
