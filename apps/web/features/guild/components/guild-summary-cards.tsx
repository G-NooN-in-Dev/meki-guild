import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@shared/ui/accordion'
import { cn } from '@shared/ui/utils'

import GrowthDelta from '@/features/guild/components/growth-delta'
import { calculateGuildSummaryMetrics } from '@/features/guild/lib/guild-summary'
import { GUILD_ZERO_DELTA_LABEL } from '@/features/guild/types/guild-snapshot.type'
import { getGuildContentsOrder, type GuildContentsOrderKey } from '@/libs/guild-contents-order.constants'

type GuildSummaryMetrics = ReturnType<typeof calculateGuildSummaryMetrics>

type GuildSummaryCardsProps = {
	metrics: GuildSummaryMetrics
}

type SummaryMetaRow = {
	label: string
	value: string
	/** 절대값 옆 증감량(길드 포인트·순위·평균 레벨 등) */
	delta?: string | null
	/**
	 * 증감율.
	 * - delta가 있으면 delta 옆에 표시
	 * - delta가 없으면 value(변화량) 옆에 표시
	 */
	percentLabel?: string | null
}

type SummaryCard = {
	label: string
	value: string
	/**
	 * 메인 값 옆 절대 증감량 (예: 사냥실적 +1,234).
	 * 있으면 GrowthDelta에 value로 넘겨 색·부호를 맞춥니다.
	 */
	changeLabel?: string | null
	/** 직전 대비 증감율. undefined면 증감율 UI 미표시 */
	percentLabel?: string | null
	/** 메인 값 소제목. metaRows와 함께 있으면 좌우 분할 레이아웃 */
	valueLabel?: string
	/**
	 * 좌측(메인) 영역에 함께 쌓는 보조 지표.
	 * 예: 현상수배 — 평균 클리어 단계를 총 사냥실적 아래에 둠
	 */
	secondaryRows?: SummaryMetaRow[]
	/** 우측 메타 지표 (순위·포인트 등) */
	metaRows?: SummaryMetaRow[]
	/** 데스크탑 그리드 열 수. 정보가 많은 카드에 사용 */
	columnSpan?: 2
}

type SplitSummaryCard = SummaryCard & {
	valueLabel: string
	metaRows: SummaryMetaRow[]
}

const isSplitSummaryCard = (card: SummaryCard): card is SplitSummaryCard =>
	Boolean(card.valueLabel && card.metaRows && card.metaRows.length > 0)

/**
 * 요약 카드 본문: 값은 크게, 옆에 증감(절대량·증감율)을 GrowthDelta로 표시.
 * - changeLabel 있음: +1,234 (+2.3%) 형태
 * - percent만 있음: (+2.3%) 만 표시 (전투력 총합 등)
 */
function SummaryCardValue({
	value,
	changeLabel,
	percentLabel,
	className = 'mt-2'
}: {
	value: string
	changeLabel?: string | null
	percentLabel?: string | null
	className?: string
}) {
	const showChange = changeLabel !== undefined
	const showPercentOnly = !showChange && percentLabel !== undefined

	if (!showChange && !showPercentOnly) {
		return <p className={cn('text-grayscale-900 text-2xl font-semibold', className)}>{value}</p>
	}

	return (
		<p className={cn('flex flex-wrap items-baseline gap-x-2', className)}>
			<span className="text-grayscale-900 text-2xl font-semibold">{value}</span>
			{showChange ? (
				<GrowthDelta value={changeLabel ?? null} percentLabel={percentLabel} className="text-sm" />
			) : percentLabel ? (
				<GrowthDelta
					value={value === GUILD_ZERO_DELTA_LABEL ? null : value}
					percentLabel={percentLabel}
					hideValue
					className="text-sm"
				/>
			) : null}
		</p>
	)
}

function SummaryMetaItem({ row }: { row: SummaryMetaRow }) {
	const showDelta = row.delta !== undefined
	const showPercentOnly = !showDelta && row.percentLabel !== undefined

	return (
		<div>
			<p className="text-grayscale-500 text-sm font-semibold">{row.label}</p>
			<p className="mt-1 flex flex-wrap items-baseline gap-x-2">
				<span className="text-grayscale-900 text-xl font-semibold">{row.value}</span>
				{showDelta ? (
					<GrowthDelta value={row.delta ?? null} percentLabel={row.percentLabel} />
				) : showPercentOnly ? (
					<GrowthDelta
						value={row.value === GUILD_ZERO_DELTA_LABEL ? null : row.value}
						percentLabel={row.percentLabel}
						hideValue
					/>
				) : null}
			</p>
		</div>
	)
}

function PrimaryMetricBlock({
	valueLabel,
	value,
	changeLabel,
	percentLabel
}: {
	valueLabel: string
	value: string
	changeLabel?: string | null
	percentLabel?: string | null
}) {
	return (
		<div>
			<p className="text-grayscale-500 text-sm font-semibold">{valueLabel}</p>
			<SummaryCardValue value={value} changeLabel={changeLabel} percentLabel={percentLabel} className="mt-1" />
		</div>
	)
}

/**
 * 좌우 분할 요약 카드 본문.
 * - 기본: 4열(메인 2 + 메타 1·1). 모바일은 메인 아래 메타 2열
 * - secondaryRows가 있으면 좌측(메인+보조) | 우측(메타) 2열
 * - sharesRowAtXl: xl 반폭일 때 메인 | 메타(세로)
 */
function SplitSummaryCardBody({
	valueLabel,
	value,
	changeLabel,
	percentLabel,
	secondaryRows = [],
	metaRows,
	sharesRowAtXl
}: {
	valueLabel: string
	value: string
	changeLabel?: string | null
	percentLabel?: string | null
	secondaryRows?: SummaryMetaRow[]
	metaRows: SummaryMetaRow[]
	sharesRowAtXl: boolean
}) {
	const leftBlock = (
		<div className="space-y-3">
			<PrimaryMetricBlock valueLabel={valueLabel} value={value} changeLabel={changeLabel} percentLabel={percentLabel} />
			{secondaryRows.map((row) => (
				<SummaryMetaItem key={row.label} row={row} />
			))}
		</div>
	)

	if (secondaryRows.length > 0) {
		return (
			<div className="mt-2">
				<div className="grid grid-cols-2 gap-3 sm:hidden">
					<PrimaryMetricBlock
						valueLabel={valueLabel}
						value={value}
						changeLabel={changeLabel}
						percentLabel={percentLabel}
					/>
					{secondaryRows.map((row) => (
						<SummaryMetaItem key={row.label} row={row} />
					))}
					{metaRows.map((row) => (
						<SummaryMetaItem key={row.label} row={row} />
					))}
				</div>

				{/* sm~xl: 좌(메인+평균) | 우(순위) */}
				<div className={cn('hidden grid-cols-2 gap-3 sm:grid', sharesRowAtXl && 'xl:hidden')}>
					{leftBlock}
					<div className="space-y-3">
						{metaRows.map((row) => (
							<SummaryMetaItem key={row.label} row={row} />
						))}
					</div>
				</div>

				{sharesRowAtXl ? (
					<div className="hidden xl:grid xl:grid-cols-2 xl:gap-0">
						<div className="border-grayscale-100 border-r pr-3">{leftBlock}</div>
						<div className="space-y-2 pl-3">
							{metaRows.map((row) => (
								<SummaryMetaItem key={row.label} row={row} />
							))}
						</div>
					</div>
				) : null}
			</div>
		)
	}

	return (
		<div className="mt-2">
			<div className={cn('grid grid-cols-2 gap-3 md:grid-cols-4', sharesRowAtXl && 'xl:hidden')}>
				<div className="col-span-2">
					<PrimaryMetricBlock
						valueLabel={valueLabel}
						value={value}
						changeLabel={changeLabel}
						percentLabel={percentLabel}
					/>
				</div>
				{metaRows.map((row) => (
					<SummaryMetaItem key={row.label} row={row} />
				))}
			</div>

			{sharesRowAtXl ? (
				<div className="hidden xl:grid xl:grid-cols-2 xl:gap-0">
					<div className="border-grayscale-100 border-r pr-3">
						<PrimaryMetricBlock
							valueLabel={valueLabel}
							value={value}
							changeLabel={changeLabel}
							percentLabel={percentLabel}
						/>
					</div>
					<div className="space-y-2 pl-3">
						{metaRows.map((row) => (
							<SummaryMetaItem key={row.label} row={row} />
						))}
					</div>
				</div>
			) : null}
		</div>
	)
}

function SummaryCardBody({ card, sharesRowAtXl = false }: { card: SummaryCard; sharesRowAtXl?: boolean }) {
	if (isSplitSummaryCard(card)) {
		return (
			<SplitSummaryCardBody
				valueLabel={card.valueLabel}
				value={card.value}
				changeLabel={card.changeLabel}
				percentLabel={card.percentLabel}
				secondaryRows={card.secondaryRows}
				metaRows={card.metaRows}
				sharesRowAtXl={sharesRowAtXl}
			/>
		)
	}

	// valueLabel 없이 metaRows만 있으면 동등 열(수련장: 점수·순위 1줄)
	if (card.metaRows && card.metaRows.length > 0) {
		return (
			<div className={cn('mt-2 grid gap-3', card.metaRows.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4')}>
				{card.metaRows.map((row) => (
					<SummaryMetaItem key={row.label} row={row} />
				))}
			</div>
		)
	}

	return <SummaryCardValue value={card.value} changeLabel={card.changeLabel} percentLabel={card.percentLabel} />
}

function SummaryCardView({ card, sharesRowAtXl = false }: { card: SummaryCard; sharesRowAtXl?: boolean }) {
	return (
		<div
			className={cn(
				'border-grayscale-200 bg-card shadow-soft rounded-xl border p-4',
				card.columnSpan === 2 && 'md:col-span-2'
			)}
		>
			<p className="text-grayscale-500 text-sm">{card.label}</p>
			<SummaryCardBody card={card} sharesRowAtXl={sharesRowAtXl} />
		</div>
	)
}

/** 모바일: 라벨만 보이고, 본문은 Accordion으로 펼칩니다 */
function GuildSummaryAccordion({ cards }: { cards: SummaryCard[] }) {
	return (
		<Accordion multiple className="border-grayscale-200 bg-card shadow-soft rounded-xl border md:hidden">
			{cards.map((card) => (
				<AccordionItem key={card.label} value={card.label} className="border-grayscale-200 px-4">
					<AccordionTrigger className="text-grayscale-900 items-center py-3 font-semibold hover:no-underline">
						{card.label}
					</AccordionTrigger>
					<AccordionContent className="[&_p:not(:last-child)]:mb-0">
						<SummaryCardBody card={card} />
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}

function buildSummaryCards(metrics: GuildSummaryMetrics): {
	/** columnSpan 2 카드 — 전투력·현상수배·토벌전·대항전 */
	wide: SummaryCard[]
	/** 수련장·길드보스 등 표시 순서 컨텐츠 */
	rest: SummaryCard[]
} {
	const wide: SummaryCard[] = [
		{
			label: '전투력 · 레벨',
			valueLabel: '길드 총 전투력',
			value: metrics.combatPowerTotal,
			percentLabel: metrics.combatPowerChangePercent,
			columnSpan: 2,
			metaRows: [
				{
					label: '평균 레벨',
					value: `Lv. ${metrics.averageLevel}`,
					delta: metrics.averageLevelChange
				}
			]
		},
		{
			label: '현상수배 변화',
			valueLabel: '길드 총 사냥실적',
			value: metrics.huntingScoreTotal,
			changeLabel: metrics.huntingScoreChange,
			percentLabel: metrics.huntingScoreChangePercent,
			columnSpan: 2,
			secondaryRows: [
				{
					label: '평균 클리어 단계',
					value: metrics.averageBountyStage,
					delta: metrics.averageBountyStageChange
				}
			],
			metaRows: [
				{
					label: '서버 내 순위',
					value: metrics.guildBountyRankLabel,
					delta: metrics.guildBountyRankChange
				},
				{
					label: '전체 서버 내 순위',
					value: metrics.guildAllBountyRankLabel,
					delta: metrics.guildAllBountyRankChange
				}
			]
		},
		{
			label: '토벌전 변화',
			valueLabel: '토벌전 점수 총합',
			value: metrics.expeditionScoreChange,
			percentLabel: metrics.expeditionScoreChangePercent,
			columnSpan: 2,
			metaRows: [
				{
					label: '길드 포인트 총합',
					value: metrics.expeditionGradePointsTotal,
					delta: metrics.expeditionGradePointsChange
				},
				{
					label: '길드 순위',
					value: metrics.guildExpeditionRankLabel,
					delta: metrics.guildExpeditionRankChange
				}
			]
		},
		{
			label: '대항전 변화',
			valueLabel: '대항전 점수 총합',
			value: metrics.rivalryChange,
			percentLabel: metrics.rivalryChangePercent,
			columnSpan: 2,
			metaRows: [
				{
					label: '길드 포인트 총합',
					value: metrics.rivalryPointsTotal,
					delta: metrics.rivalryPointsChange
				},
				{
					label: '길드 순위',
					value: metrics.guildRivalryRankLabel,
					delta: metrics.guildRivalryRankChange
				}
			]
		}
	]

	const rest = getGuildContentsOrder().map(({ key, label }) =>
		createOrderedSummaryCard(key, label, metrics)
	) satisfies SummaryCard[]

	return { wide, rest }
}

/** 표시 순서 컨텐츠 요약 카드 — 키별 메트릭 매핑 */
function createOrderedSummaryCard(
	key: GuildContentsOrderKey,
	label: string,
	metrics: GuildSummaryMetrics
): SummaryCard {
	switch (key) {
		case 'training':
			return {
				label: `${label} 변화`,
				value: metrics.trainingChange,
				metaRows: [
					{
						label: '수련장 점수 총합',
						value: metrics.trainingChange,
						percentLabel: metrics.trainingChangePercent
					},
					{
						label: '길드 순위',
						value: metrics.guildTrainingRankLabel,
						delta: metrics.guildTrainingRankChange
					}
				]
			}
		case 'guildBoss':
			return {
				label: `${label} 변화`,
				value: metrics.guildBossChange,
				percentLabel: metrics.guildBossChangePercent
			}
	}
}

/** 길드 요약 카드. 모바일은 아코디언, md 이상은 카드 그리드 */
function GuildSummaryCards({ metrics }: GuildSummaryCardsProps) {
	const { wide: wideSummaryCards, rest: restSummaryCards } = buildSummaryCards(metrics)
	const summaryCards = [...wideSummaryCards, ...restSummaryCards]
	// 2열 카드가 둘 이상이면 xl에서 한 줄을 나눠 씁니다 (전투력|현상수배 / 토벌전|대항전)
	const sharesRowAtXl = wideSummaryCards.length >= 2

	return (
		<>
			<GuildSummaryAccordion cards={summaryCards} />

			<div className="hidden flex-col gap-4 md:flex">
				{wideSummaryCards.length > 0 ? (
					<div className={sharesRowAtXl ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-4' : 'grid gap-4 md:grid-cols-2'}>
						{wideSummaryCards.map((card) => (
							<SummaryCardView key={card.label} card={card} sharesRowAtXl={sharesRowAtXl} />
						))}
					</div>
				) : null}

				{restSummaryCards.length > 0 ? (
					<div className="grid gap-4 md:grid-cols-2">
						{restSummaryCards.map((card) => (
							<SummaryCardView key={card.label} card={card} />
						))}
					</div>
				) : null}
			</div>
		</>
	)
}

export default GuildSummaryCards
