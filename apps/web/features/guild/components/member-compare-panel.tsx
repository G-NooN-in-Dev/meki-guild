'use client'

import { cn } from '@shared/ui/lib/utils'

import { GrowthDelta } from '@/features/guild/components/growth-delta'
import JobBadge from '@/features/guild/components/job-badge'
import MemberDisplayName from '@/features/guild/components/member-display-name'
import {
	GUILD_EMPTY_VALUE_LABEL,
	type MemberVsMemberComparison,
	type MemberVsWinner
} from '@/features/guild/types/guild-snapshot.type'
import { getExpeditionGradeTextClass } from '@/libs/expedition-guild-tier.constants'
import { getGuildContentCriteriaLabel, GUILD_CONTENT_UPDATED_AT } from '@/libs/guild-content-dates.constants'
import { isGuildMetricVisible } from '@/libs/guild-metric-visibility.constants'
import { formatRankLabel, type MemberRankings } from '@/utils/compute-member-rankings'

type MemberComparePanelProps = {
	comparison: MemberVsMemberComparison
	rankings: MemberRankings
}

type CompareSide = 'self' | 'opponent'

type CompareRow = {
	label: string
	selfValue: string
	opponentValue: string
	diffLabel: string | null
	diffPercentLabel?: string | null
	winner: MemberVsWinner
	/** 최근 수집일. 있으면 항목 라벨 아래에 기준일 표시 */
	contentUpdatedAt?: string | null
	/** 직업 행은 텍스트 대신 JobBadge로 표시합니다 */
	valueKind?: 'text' | 'job' | 'expeditionGrade'
	/** 나(왼쪽)의 길드 내 순위 라벨 */
	selfRankLabel?: string | null
	/** 상대방(오른쪽)의 길드 내 순위 라벨 */
	opponentRankLabel?: string | null
}

type RankLead = {
	leftLeadLabel: string | null
	rightLeadLabel: string | null
}

/** 비교 행 그리드 — 모바일·데스크탑 공통 3열, 항목 열 수직 중앙 정렬 */
const compareRowGridClassName =
	'grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-2 md:grid-cols-3 md:gap-x-10'

/** 내부 비교 데이터(left/right)를 화면 역할(self/opponent)로 매핑합니다. */
function toCompareSide(side: CompareSide): 'left' | 'right' {
	return side === 'self' ? 'left' : 'right'
}

function getWinnerClassName(side: CompareSide, winner: MemberVsWinner): string {
	const compareSide = toCompareSide(side)

	if (winner === 'tie') {
		return 'text-grayscale-900'
	}

	return winner === compareSide ? 'text-success-700 font-semibold' : 'text-grayscale-500'
}

/** 나-상대방 차이값을 우세한 쪽 기준 양수 표기로 뒤집습니다. */
function getWinnerDiffLabel(winner: MemberVsWinner, side: CompareSide, diffLabel: string | null): string | null {
	const compareSide = toCompareSide(side)

	if (!diffLabel || winner === 'tie' || winner !== compareSide) {
		return null
	}

	if (winner === 'left') {
		return diffLabel
	}

	if (diffLabel.startsWith('+')) {
		return `-${diffLabel.slice(1)}`
	}

	if (diffLabel.startsWith('-')) {
		return `+${diffLabel.slice(1)}`
	}

	if (diffLabel.startsWith('▲')) {
		return `▼${diffLabel.slice(1)}`
	}

	if (diffLabel.startsWith('▼')) {
		return `▲${diffLabel.slice(1)}`
	}

	return diffLabel
}

function getWinnerDiffPercentLabel(
	winner: MemberVsWinner,
	side: CompareSide,
	diffPercentLabel: string | null | undefined
): string | null {
	const compareSide = toCompareSide(side)

	if (!diffPercentLabel || winner === 'tie' || winner !== compareSide) {
		return null
	}

	if (winner === 'left') {
		return diffPercentLabel
	}

	if (diffPercentLabel.startsWith('+')) {
		return `-${diffPercentLabel.slice(1)}`
	}

	if (diffPercentLabel.startsWith('-')) {
		return `+${diffPercentLabel.slice(1)}`
	}

	return diffPercentLabel
}

/** `N위` 라벨에서 숫자만 꺼냅니다. */
function parseRankLabel(rankLabel: string | null | undefined): number | null {
	if (!rankLabel) {
		return null
	}

	const numeric = Number(rankLabel.replace('위', '').trim())
	return Number.isFinite(numeric) && numeric > 0 ? numeric : null
}

/**
 * 양쪽 모두 순위가 있을 때, 더 높은 쪽(숫자가 작은 쪽) 라벨 옆에
 * `▲차이`를 보여주기 위한 좌/우 표시값을 계산합니다.
 */
function getRankLead(rankSelf: string | null | undefined, rankOpponent: string | null | undefined): RankLead {
	const selfRank = parseRankLabel(rankSelf)
	const opponentRank = parseRankLabel(rankOpponent)

	if (selfRank === null || opponentRank === null) {
		return { leftLeadLabel: null, rightLeadLabel: null }
	}

	const rankGap = Math.abs(selfRank - opponentRank)
	if (rankGap === 0) {
		return { leftLeadLabel: null, rightLeadLabel: null }
	}

	return selfRank < opponentRank
		? { leftLeadLabel: `▲${rankGap}`, rightLeadLabel: null }
		: { leftLeadLabel: null, rightLeadLabel: `▲${rankGap}` }
}

type CompareValueProps = {
	side: CompareSide
	value: string
	winner: MemberVsWinner
	diffLabel: string | null
	diffPercentLabel?: string | null
	valueKind?: 'text' | 'job' | 'expeditionGrade'
	rankLabel?: string | null
}

function CompareValue({
	side,
	value,
	winner,
	diffLabel,
	diffPercentLabel,
	valueKind = 'text',
	rankLabel
}: CompareValueProps) {
	const winnerDiffLabel = getWinnerDiffLabel(winner, side, diffLabel)
	const winnerDiffPercentLabel = getWinnerDiffPercentLabel(winner, side, diffPercentLabel)
	const isJob = valueKind === 'job'
	const isExpeditionGrade = valueKind === 'expeditionGrade'
	const useOwnValueColor = isJob || isExpeditionGrade

	return (
		<div
			className={cn(
				'flex min-w-0 flex-col items-center gap-0.5 text-center',
				!useOwnValueColor && getWinnerClassName(side, winner)
			)}
		>
			{isJob ? (
				<JobBadge job={value} />
			) : (
				<span
					className={cn(
						'text-xs leading-snug font-medium wrap-break-word md:text-sm',
						isExpeditionGrade && getExpeditionGradeTextClass(value)
					)}
				>
					{value}
					{rankLabel ? <span className="text-grayscale-600 ml-0.5 text-[10px] font-normal">({rankLabel})</span> : null}
				</span>
			)}
			{winnerDiffLabel ? (
				<GrowthDelta
					value={winnerDiffLabel}
					percentLabel={winnerDiffPercentLabel}
					className="max-w-full text-center wrap-break-word whitespace-normal"
				/>
			) : null}
		</div>
	)
}

type CompareLabelProps = {
	label: string
	contentUpdatedAt?: string | null
	leftLeadLabel?: string | null
	rightLeadLabel?: string | null
}

function CompareLabel({ label, contentUpdatedAt, leftLeadLabel, rightLeadLabel }: CompareLabelProps) {
	const leadPlaceholder = <span aria-hidden className="w-6 shrink-0" />

	// 기준일이 있으면 라벨 아래에 상시 표시 (Tooltip hover 대신)
	if (contentUpdatedAt !== undefined) {
		return (
			<div className="flex flex-col items-center gap-0.5 px-1 text-center">
				<div className="grid w-full grid-cols-[24px_auto_24px] place-items-center gap-1">
					{leftLeadLabel ? <GrowthDelta value={leftLeadLabel} className="shrink-0 text-[10px]" /> : leadPlaceholder}
					<span className="text-grayscale-500 text-xs">{label}</span>
					{rightLeadLabel ? <GrowthDelta value={rightLeadLabel} className="shrink-0 text-[10px]" /> : leadPlaceholder}
				</div>
				<span className="text-grayscale-400 text-[10px] leading-tight">
					{getGuildContentCriteriaLabel(contentUpdatedAt)}
				</span>
			</div>
		)
	}

	return (
		<div className="grid w-full grid-cols-[24px_auto_24px] place-items-center gap-1 px-1">
			{leftLeadLabel ? <GrowthDelta value={leftLeadLabel} className="shrink-0 text-[10px]" /> : leadPlaceholder}
			<span className="text-grayscale-500 text-xs">{label}</span>
			{rightLeadLabel ? <GrowthDelta value={rightLeadLabel} className="shrink-0 text-[10px]" /> : leadPlaceholder}
		</div>
	)
}

type CompareRowItemProps = {
	row: CompareRow
}

function CompareRowItem({ row }: CompareRowItemProps) {
	const rankLead = getRankLead(row.selfRankLabel, row.opponentRankLabel)

	return (
		<div className="border-grayscale-100 border-b px-3 py-3 last:border-b-0 md:px-4 md:py-2.5">
			<div className={compareRowGridClassName}>
				<CompareValue
					side="self"
					value={row.selfValue}
					winner={row.winner}
					diffLabel={row.diffLabel}
					diffPercentLabel={row.diffPercentLabel}
					valueKind={row.valueKind}
					rankLabel={row.selfRankLabel}
				/>
				<div className="flex items-center justify-center self-stretch px-0.5 md:px-1">
					<CompareLabel
						label={row.label}
						contentUpdatedAt={row.contentUpdatedAt}
						leftLeadLabel={rankLead.leftLeadLabel}
						rightLeadLabel={rankLead.rightLeadLabel}
					/>
				</div>
				<CompareValue
					side="opponent"
					value={row.opponentValue}
					winner={row.winner}
					diffLabel={row.diffLabel}
					diffPercentLabel={row.diffPercentLabel}
					valueKind={row.valueKind}
					rankLabel={row.opponentRankLabel}
				/>
			</div>
		</div>
	)
}

function buildCompareRows(comparison: MemberVsMemberComparison, rankings: MemberRankings): CompareRow[] {
	const leftName = comparison.left.name
	const rightName = comparison.right.name

	return [
		{
			label: '직업',
			selfValue: comparison.left.job,
			opponentValue: comparison.right.job,
			diffLabel: null,
			winner: 'tie',
			valueKind: 'job'
		},
		{
			label: '레벨',
			selfValue: `${comparison.level.left}`,
			opponentValue: `${comparison.level.right}`,
			diffLabel: comparison.level.diffLabel,
			winner: comparison.level.winner,
			contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.combatPower.current
		},
		{
			label: '전투력',
			selfValue: comparison.combatPower.leftLabel,
			opponentValue: comparison.combatPower.rightLabel,
			diffLabel: comparison.combatPower.diffLabel,
			diffPercentLabel: comparison.combatPower.diffPercentLabel,
			winner: comparison.combatPower.winner,
			contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.combatPower.current,
			selfRankLabel: formatRankLabel(rankings.combatPower, leftName),
			opponentRankLabel: formatRankLabel(rankings.combatPower, rightName)
		},
		{
			label: '토벌전 등급',
			selfValue: comparison.expeditionGrade.left,
			opponentValue: comparison.expeditionGrade.right,
			diffLabel: comparison.expeditionGrade.diffLabel,
			winner: comparison.expeditionGrade.winner,
			contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.expedition.current,
			valueKind: 'expeditionGrade'
		},
		{
			label: '토벌전 등수',
			selfValue: comparison.expeditionPlacement.leftHasValue
				? comparison.expeditionPlacement.leftLabel
				: GUILD_EMPTY_VALUE_LABEL,
			opponentValue: comparison.expeditionPlacement.rightHasValue
				? comparison.expeditionPlacement.rightLabel
				: GUILD_EMPTY_VALUE_LABEL,
			diffLabel:
				comparison.expeditionPlacement.leftHasValue && comparison.expeditionPlacement.rightHasValue
					? comparison.expeditionPlacement.diffLabel
					: null,
			winner: comparison.expeditionPlacement.winner,
			contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.expedition.current,
			selfRankLabel: comparison.expeditionPlacement.leftHasValue
				? formatRankLabel(rankings.expeditionPlacement, leftName)
				: null,
			opponentRankLabel: comparison.expeditionPlacement.rightHasValue
				? formatRankLabel(rankings.expeditionPlacement, rightName)
				: null
		},
		{
			label: '토벌전 점수',
			selfValue: comparison.expeditionScore.leftLabel,
			opponentValue: comparison.expeditionScore.rightLabel,
			diffLabel: comparison.expeditionScore.diffLabel,
			diffPercentLabel: comparison.expeditionScore.diffPercentLabel,
			winner: comparison.expeditionScore.winner,
			contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.expedition.current,
			selfRankLabel: formatRankLabel(rankings.expeditionScore, leftName),
			opponentRankLabel: formatRankLabel(rankings.expeditionScore, rightName)
		},
		{
			label: '대항전',
			selfValue: comparison.rivalry.leftLabel,
			opponentValue: comparison.rivalry.rightLabel,
			diffLabel: comparison.rivalry.diffLabel,
			diffPercentLabel: comparison.rivalry.diffPercentLabel,
			winner: comparison.rivalry.winner,
			contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.rivalry.current,
			selfRankLabel: formatRankLabel(rankings.rivalry, leftName),
			opponentRankLabel: formatRankLabel(rankings.rivalry, rightName)
		},
		...(isGuildMetricVisible('training')
			? [
					{
						label: '수련장',
						selfValue: comparison.training.leftLabel,
						opponentValue: comparison.training.rightLabel,
						diffLabel: comparison.training.diffLabel,
						diffPercentLabel: comparison.training.diffPercentLabel,
						winner: comparison.training.winner,
						contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.training.current,
						selfRankLabel: formatRankLabel(rankings.training, leftName),
						opponentRankLabel: formatRankLabel(rankings.training, rightName)
					} satisfies CompareRow
				]
			: []),
		...(isGuildMetricVisible('guildBoss')
			? [
					{
						label: '길드보스',
						selfValue: comparison.guildBoss.leftHasValue ? comparison.guildBoss.leftLabel : GUILD_EMPTY_VALUE_LABEL,
						opponentValue: comparison.guildBoss.rightHasValue
							? comparison.guildBoss.rightLabel
							: GUILD_EMPTY_VALUE_LABEL,
						diffLabel:
							comparison.guildBoss.leftHasValue && comparison.guildBoss.rightHasValue
								? comparison.guildBoss.diffLabel
								: null,
						diffPercentLabel:
							comparison.guildBoss.leftHasValue && comparison.guildBoss.rightHasValue
								? comparison.guildBoss.diffPercentLabel
								: null,
						winner: comparison.guildBoss.winner,
						contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.guildBoss.current,
						selfRankLabel: comparison.guildBoss.leftHasValue ? formatRankLabel(rankings.guildBoss, leftName) : null,
						opponentRankLabel: comparison.guildBoss.rightHasValue
							? formatRankLabel(rankings.guildBoss, rightName)
							: null
					} satisfies CompareRow
				]
			: [])
	]
}

function MemberSummaryCard({ role, name, job }: { role: '나' | '상대방'; name: string; job: string }) {
	return (
		<div className="border-grayscale-200 bg-card shadow-soft min-w-0 rounded-xl border p-3 text-center md:p-4">
			<p className="text-grayscale-500 text-[11px] md:text-xs">{role}</p>
			{/* 잠금 시 별칭 — 비교 로직의 name 키는 실명 그대로 */}
			<p className="text-grayscale-900 mt-1 truncate text-base font-semibold md:text-xl">
				<MemberDisplayName name={name} />
			</p>
			{/* 멤버 테이블·상세와 동일하게 직업별 색상 Badge로 표시 */}
			<div className="mt-1.5 flex justify-center">
				<JobBadge job={job} />
			</div>
		</div>
	)
}

function MemberComparePanel({ comparison, rankings }: MemberComparePanelProps) {
	const rows = buildCompareRows(comparison, rankings)

	return (
		<div className="flex flex-col gap-3 md:gap-4">
			{/* 모바일: 2열 카드 / 데스크탑: 나 | VS | 상대방 */}
			<div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
				<MemberSummaryCard role="나" name={comparison.left.name} job={comparison.left.job} />

				<div className="text-grayscale-400 hidden items-center justify-center text-sm font-semibold md:flex md:px-2">
					VS
				</div>

				<MemberSummaryCard role="상대방" name={comparison.right.name} job={comparison.right.job} />
			</div>

			<div className="border-grayscale-200 bg-card shadow-soft overflow-hidden rounded-xl border">
				<div className="bg-card min-w-0">
					{rows.map((row) => (
						<CompareRowItem key={row.label} row={row} />
					))}
				</div>
			</div>
		</div>
	)
}

export default MemberComparePanel
