/** 주차 슬롯. older → previous → current 순으로 시계열에 넣습니다. */
type GuildWeekSlot = 'older' | 'previous' | 'current'

/** 지표 표시 포맷 */
type GuildMetricFormat = 'korean' | 'training' | 'level' | 'stage' | 'rank' | 'count'

/**
 * 주간 대비 변화 표기.
 * - percent: 증감량 + 증감율(%) — 점수·전투력 등
 * - absolute: 증감량만 — 레벨·순위·클리어 단계
 */
type GuildMetricChangeKind = 'percent' | 'absolute'

type GuildMetricYAxisId = 'left' | 'right'

/** 차트 한 점. value 는 Recharts용 number (bigint 합은 Number로 변환). */
type GuildMetricPoint = {
	slot: GuildWeekSlot
	/** X축 라벨용 수집일 (없으면 슬롯명) */
	label: string
	collectedAt: string | null
	value: number | null
	/** 직전 점 대비 증감량. older(첫 점)는 null */
	changeDeltaLabel: string | null
	/** 직전 점 대비 증감율. absolute 지표·첫 점은 null */
	changePercentLabel: string | null
}

type GuildMetricSeries = {
	key: string
	label: string
	format: GuildMetricFormat
	changeKind: GuildMetricChangeKind
	/** 순위처럼 낮을수록 좋은 지표 */
	lowerIsBetter?: boolean
	/** 고정 순위 스케일 (대항전 1~5, 수련장 1~7). Y축 domain에 사용 */
	rankDomain?: { min: number; max: number }
	/** false면 상단 수치만 표시하고 차트 라인에서는 제외 */
	showInChart: boolean
	/** 같은 카드 안 차트 묶음 (0부터). 다른 그룹은 아래쪽 별도 차트 */
	chartGroup: number
	/** 해당 차트에서의 Y축 */
	yAxisId: GuildMetricYAxisId
	points: GuildMetricPoint[]
	/** 라인/도트 색 */
	stroke: string
	/** 영역 채움 색 */
	fill: string
	/** 최신 주 값 (한국어 단위) */
	latestLabel: string
	/** 헤더용: 최신 주의 직전 대비 증감량 */
	changeDeltaLabel: string | null
	/** 헤더용: 최신 주의 직전 대비 증감율 (absolute면 null) */
	changePercentLabel: string | null
}

type GuildDashboardChartCardId = 'overview' | 'jobs' | 'bounty' | 'expedition' | 'rivalry' | 'training' | 'guild-boss'

/** 로스터·멤버 차트 항목. 직업 분포(jobs)는 전용 UI라 제외합니다. */
type GuildRosterSectionId = Exclude<GuildDashboardChartCardId, 'jobs'>

type GuildDashboardChartCard = {
	id: GuildDashboardChartCardId
	title: string
	href: string
	series: GuildMetricSeries[]
}

type GuildRosterChangeSummary = {
	newCount: number
	leftCount: number
}

type GuildDashboardData = {
	cards: GuildDashboardChartCard[]
	rosterChange: GuildRosterChangeSummary
}

export type {
	GuildDashboardChartCard,
	GuildDashboardChartCardId,
	GuildMetricChangeKind,
	GuildMetricFormat,
	GuildMetricPoint,
	GuildMetricSeries,
	GuildMetricYAxisId,
	GuildRosterChangeSummary,
	GuildRosterSectionId,
	GuildDashboardData,
	GuildWeekSlot
}
