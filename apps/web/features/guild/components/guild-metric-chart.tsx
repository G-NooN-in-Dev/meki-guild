'use client'

import { cn } from '@shared/ui/utils'
import type { ReactNode } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import GrowthDelta from '@/features/guild/components/growth-delta'
import {
	buildIntegerYAxis,
	buildTrainingYAxis,
	createMetricAxisTickFormatter,
	formatMetricValue,
	resolveSeriesYAxisId
} from '@/features/guild/lib/format-metric-series'
import type { GuildMetricSeries, GuildWeekSlot } from '@/features/guild/types/guild-dashboard.type'
import { getContentGradeTextClass } from '@/libs/content-tier-band.constants'

/** Recharts wrapper·자손 클릭/포커스 시 outline·ring 제거 */
const RECHARTS_FOCUS_OUTLINE_RESET_CLASS = cn(
	'[&_.recharts-wrapper]:ring-0 [&_.recharts-wrapper]:outline-hidden',
	'[&_.recharts-wrapper]:focus:ring-0 [&_.recharts-wrapper]:focus:outline-hidden',
	'[&_.recharts-wrapper_*]:ring-0 [&_.recharts-wrapper_*]:outline-hidden',
	'[&_.recharts-wrapper_*]:focus:ring-0 [&_.recharts-wrapper_*]:focus:outline-hidden',
	'[&_.recharts-surface]:ring-0 [&_.recharts-surface]:outline-hidden',
	'[&_.recharts-surface]:focus:ring-0 [&_.recharts-surface]:focus:outline-hidden',
	'[&_svg]:ring-0 [&_svg]:outline-hidden',
	'[&_svg]:focus:ring-0 [&_svg]:focus:outline-hidden'
)

type GuildMetricChartProps = {
	/** 상단 요약에 쓸 전체 지표 */
	seriesList: GuildMetricSeries[]
}

type ChartPlotProps = {
	/** 이 차트에 그릴 라인만 (showInChart=true) */
	plotSeries: GuildMetricSeries[]
}

type ChartRow = {
	slot: GuildWeekSlot
	label: string
	collectedAt: string | null
	values: Record<string, number | null>
	deltas: Record<string, string | null>
	percents: Record<string, string | null>
}

type CombinedTooltipProps = {
	active?: boolean
	payload?: ReadonlyArray<{ payload?: ChartRow; dataKey?: string | number }>
	seriesList: GuildMetricSeries[]
}

/** 모든 시리즈를 한 줄로 합칩니다. */
function buildCombinedRows(seriesList: GuildMetricSeries[]): ChartRow[] {
	const template = seriesList[0]?.points ?? []

	return template.map((point, index) => {
		const values: Record<string, number | null> = {}
		const deltas: Record<string, string | null> = {}
		const percents: Record<string, string | null> = {}

		for (const series of seriesList) {
			const { key, points } = series
			const seriesPoint = points[index]

			values[key] = seriesPoint?.value ?? null
			deltas[key] = seriesPoint?.changeDeltaLabel ?? null
			percents[key] = seriesPoint?.changePercentLabel ?? null
		}

		const { collectedAt, label, slot } = point

		return {
			slot,
			label,
			collectedAt,
			values,
			deltas,
			percents,
			...Object.fromEntries(seriesList.map((series) => [series.key, values[series.key] ?? null]))
		}
	})
}

/** 차트 툴팁. 모든 시리즈 정보를 표시합니다. */
function GuildCombinedTooltip({ active, payload, seriesList }: CombinedTooltipProps): ReactNode {
	if (!active || !payload?.length) {
		return null
	}

	const row = payload[0]?.payload

	if (!row) {
		return null
	}

	const { collectedAt, deltas, label, percents, values } = row

	return (
		<div className="border-grayscale-200 bg-card max-w-72 rounded-lg border px-3 py-2 text-xs shadow-md">
			<p className="text-grayscale-500 mb-2">{collectedAt ?? label}</p>
			<ul className="flex flex-col gap-1.5">
				{seriesList.map((series) => {
					const { key, label: seriesLabel, stroke, format } = series
					const value = values[key] ?? null
					const delta = deltas[key] ?? null
					const percent = percents[key] ?? null
					const hasChange = Boolean(delta || percent)

					return (
						<li key={key} className="flex flex-col gap-0.5">
							<p className="text-grayscale-900 flex flex-wrap items-baseline gap-x-1.5 font-semibold tabular-nums">
								<span
									className="inline-block size-2 shrink-0 rounded-full"
									style={{ backgroundColor: stroke }}
									aria-hidden
								/>
								<span className="text-grayscale-600 font-medium">{seriesLabel}</span>
								{formatMetricValue(value, format)}
							</p>
							{hasChange ? (
								<p className="text-grayscale-500 flex items-center gap-1 pl-3.5">
									<span>직전 대비</span>
									<GrowthDelta value={delta} percentLabel={percent} />
								</p>
							) : null}
						</li>
					)
				})}
			</ul>
		</div>
	)
}

/** 차트 Y축 설정을 계산합니다. */
function resolveAxisConfig(seriesOnAxis: GuildMetricSeries[], values: number[]) {
	const rankDomain = seriesOnAxis.find((series) => series.rankDomain)?.rankDomain
	const allRanks = seriesOnAxis.length > 0 && seriesOnAxis.every((series) => series.format === 'rank')
	const integerFormats = seriesOnAxis.every(
		(series) =>
			series.format === 'level' || series.format === 'stage' || series.format === 'rank' || series.format === 'count'
	)
	const lowerIsBetter = allRanks && seriesOnAxis.every((series) => series.lowerIsBetter)
	const format = seriesOnAxis[0]?.format ?? (allRanks ? 'rank' : integerFormats ? 'level' : 'korean')
	const tickFormatter = createMetricAxisTickFormatter(values, format)

	if (rankDomain && allRanks) {
		const max = Math.max(...seriesOnAxis.map((series) => series.rankDomain?.max ?? rankDomain.max))
		const min = Math.min(...seriesOnAxis.map((series) => series.rankDomain?.min ?? rankDomain.min))

		return {
			domain: [min, max] as [number, number],
			ticks: Array.from({ length: max - min + 1 }, (_, index) => min + index),
			reversed: true,
			allowDecimals: false,
			tickFormatter
		}
	}

	if (integerFormats && seriesOnAxis.length > 0) {
		const allCounts = seriesOnAxis.every((series) => series.format === 'count')
		/** 인원 수는 0이 최소 — 음수(-1) tick 없음 */
		const integerAxis = buildIntegerYAxis(values, allCounts ? { minFloor: 0 } : undefined)

		return {
			domain: integerAxis?.domain ?? (['auto', 'auto'] as const),
			ticks: integerAxis?.ticks,
			reversed: lowerIsBetter === true,
			allowDecimals: false,
			tickFormatter
		}
	}

	if (format === 'training') {
		const trainingAxis = buildTrainingYAxis(values)

		return {
			domain: trainingAxis?.domain ?? (['auto', 'auto'] as const),
			ticks: trainingAxis?.ticks,
			reversed: false,
			allowDecimals: true,
			tickFormatter
		}
	}

	return {
		domain: ['auto', 'auto'] as const,
		ticks: undefined,
		reversed: false,
		allowDecimals: true,
		tickFormatter
	}
}

/** 하나의 차트 그룹(멀티라인). */
function GuildChartPlot({ plotSeries }: ChartPlotProps): ReactNode {
	const data = buildCombinedRows(plotSeries)
	const hasAnyValue = plotSeries.some((series) => series.points.some((point) => point.value !== null))

	const leftSeries = plotSeries.filter((series) => resolveSeriesYAxisId(series) === 'left')
	const rightSeries = plotSeries.filter((series) => resolveSeriesYAxisId(series) === 'right')
	const showLeft = leftSeries.length > 0
	const showRight = rightSeries.length > 0

	const leftValues = leftSeries.flatMap((series) =>
		series.points.map((point) => point.value).filter((value): value is number => value !== null)
	)
	const rightValues = rightSeries.flatMap((series) =>
		series.points.map((point) => point.value).filter((value): value is number => value !== null)
	)
	const leftAxis = resolveAxisConfig(leftSeries, leftValues)
	const rightAxis = resolveAxisConfig(rightSeries, rightValues)

	if (!hasAnyValue) {
		return <div className="text-grayscale-500 flex h-40 items-center justify-center text-xs">데이터 없음</div>
	}

	return (
		<div className={cn('h-52 w-full min-w-0', RECHARTS_FOCUS_OUTLINE_RESET_CLASS)}>
			<ResponsiveContainer width="100%" height="100%">
				{/* accessibilityLayer : focus 시 ring(border) 출력 여부 */}
				<LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} accessibilityLayer={false}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--color-grayscale-200)" vertical={false} />
					<XAxis
						dataKey="label"
						tick={{ fontSize: 10, fill: 'var(--color-grayscale-500)' }}
						tickLine={false}
						axisLine={false}
					/>
					{showLeft ? (
						<YAxis
							yAxisId="left"
							width={56}
							tick={{ fontSize: 10, fill: 'var(--color-grayscale-500)' }}
							tickLine={false}
							axisLine={false}
							domain={leftAxis.domain}
							ticks={leftAxis.ticks}
							reversed={leftAxis.reversed}
							allowDecimals={leftAxis.allowDecimals}
							tickFormatter={leftAxis.tickFormatter}
						/>
					) : null}
					{showRight ? (
						<YAxis
							yAxisId="right"
							orientation="right"
							width={48}
							tick={{ fontSize: 10, fill: 'var(--color-grayscale-500)' }}
							tickLine={false}
							axisLine={false}
							domain={rightAxis.domain}
							ticks={rightAxis.ticks}
							reversed={rightAxis.reversed}
							allowDecimals={rightAxis.allowDecimals}
							tickFormatter={rightAxis.tickFormatter}
						/>
					) : null}
					<Tooltip
						cursor={{ stroke: 'var(--color-grayscale-400)', strokeWidth: 1, strokeDasharray: '4 4' }}
						content={<GuildCombinedTooltip seriesList={plotSeries} />}
					/>
					<Legend height={28} iconType="circle" wrapperStyle={{ fontSize: 11, color: 'var(--color-grayscale-600)' }} />
					{plotSeries.map((series) => {
						const { key, label: seriesLabel, stroke } = series

						return (
							<Line
								key={key}
								yAxisId={resolveSeriesYAxisId(series)}
								type="monotone"
								dataKey={key}
								name={seriesLabel}
								stroke={stroke}
								strokeWidth={2.5}
								dot={{ r: 3.5, fill: stroke, strokeWidth: 0 }}
								activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
								connectNulls={false}
								isAnimationActive={false}
							/>
						)
					})}
				</LineChart>
			</ResponsiveContainer>
		</div>
	)
}

/**
 * 카드 본문: 전체 지표 요약 + chartGroup별 멀티라인 차트.
 * showInChart=false 지표는 상단 수치만 표시합니다.
 */
function GuildMetricChart({ seriesList }: GuildMetricChartProps) {
	const chartGroups = [...new Set(seriesList.map((series) => series.chartGroup))].sort((a, b) => a - b)

	return (
		<div className="flex min-w-0 flex-col gap-4">
			<ul className="flex flex-col gap-2">
				{seriesList.map((series) => {
					const {
						key,
						label: seriesLabel,
						showInChart,
						stroke,
						latestLabel,
						changeDeltaLabel,
						changePercentLabel
					} = series
					return (
						<li key={key} className="flex items-start justify-between gap-x-3">
							<p className="text-grayscale-600 flex shrink-0 items-center gap-1.5 pt-0.5 text-xs font-medium">
								{showInChart ? (
									<span
										className="inline-block size-2 shrink-0 rounded-full"
										style={{ backgroundColor: stroke }}
										aria-hidden
									/>
								) : (
									<span className="inline-block size-2 shrink-0" aria-hidden />
								)}
								{seriesLabel}
							</p>
							{/* 값·증감을 오른쪽 세로 스택 — 한국어 단위 중간 줄바꿈 방지 */}
							<div className="flex min-w-0 flex-col items-end gap-0.5 text-right">
								<span
									className={cn(
										'text-sm font-semibold break-keep whitespace-nowrap tabular-nums',
										key === 'expeditionGrade' ? getContentGradeTextClass(latestLabel) : 'text-grayscale-900'
									)}
								>
									{latestLabel}
								</span>
								<GrowthDelta value={changeDeltaLabel} percentLabel={changePercentLabel} />
							</div>
						</li>
					)
				})}
			</ul>

			{chartGroups.map((group) => {
				const plotSeries = seriesList.filter((series) => series.chartGroup === group && series.showInChart)

				if (plotSeries.length === 0) {
					return null
				}

				return (
					<div key={group} className="border-grayscale-100 flex min-w-0 flex-col gap-2 border-t pt-3">
						<GuildChartPlot plotSeries={plotSeries} />
					</div>
				)
			})}
		</div>
	)
}

export default GuildMetricChart
