'use client'

import { cn } from '@shared/ui/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@shared/ui/popover'

import { GrowthDelta } from '@/features/guild/components/growth-delta'
import JobBadge from '@/features/guild/components/job-badge'
import MemberDisplayName from '@/features/guild/components/member-display-name'
import type { MemberVsMemberComparison, MemberVsWinner } from '@/features/guild/types/guild-snapshot.type'
import { getGuildContentCriteriaLabel, GUILD_CONTENT_UPDATED_AT } from '@/libs/guild-content-dates.constants'

/** Tooltip은 터치에서 비활성이라, 수집일 안내는 Popover(hover+탭)로 표시합니다 */
const contentDatePopoverClassName =
	'bg-foreground text-background w-auto max-w-xs gap-0 px-3 py-1.5 text-xs shadow-none ring-0'

type MemberComparePanelProps = {
	comparison: MemberVsMemberComparison
}

type CompareSide = 'self' | 'opponent'

type CompareRow = {
	label: string
	selfValue: string
	opponentValue: string
	diffLabel: string | null
	diffPercentLabel?: string | null
	winner: MemberVsWinner
	contentUpdatedAt?: string | null
	/** 직업 행은 텍스트 대신 JobBadge로 표시합니다 */
	valueKind?: 'text' | 'job'
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

type CompareValueProps = {
	side: CompareSide
	value: string
	winner: MemberVsWinner
	diffLabel: string | null
	diffPercentLabel?: string | null
	valueKind?: 'text' | 'job'
}

function CompareValue({ side, value, winner, diffLabel, diffPercentLabel, valueKind = 'text' }: CompareValueProps) {
	const winnerDiffLabel = getWinnerDiffLabel(winner, side, diffLabel)
	const winnerDiffPercentLabel = getWinnerDiffPercentLabel(winner, side, diffPercentLabel)
	const isJob = valueKind === 'job'

	return (
		<div
			className={cn(
				'flex min-w-0 flex-col items-center gap-0.5 text-center',
				!isJob && getWinnerClassName(side, winner)
			)}
		>
			{isJob ? (
				<JobBadge job={value} />
			) : (
				<span className="text-xs leading-snug font-medium break-words md:text-sm">{value}</span>
			)}
			{winnerDiffLabel ? (
				<GrowthDelta
					value={winnerDiffLabel}
					percentLabel={winnerDiffPercentLabel}
					className="max-w-full text-center break-words whitespace-normal"
				/>
			) : null}
		</div>
	)
}

type CompareLabelProps = {
	label: string
	contentUpdatedAt?: string | null
}

function CompareLabel({ label, contentUpdatedAt }: CompareLabelProps) {
	if (contentUpdatedAt !== undefined) {
		return (
			<Popover>
				<PopoverTrigger
					openOnHover
					delay={0}
					render={
						<button
							type="button"
							className="text-grayscale-500 px-1 text-xs underline decoration-dotted underline-offset-4"
						>
							{label}
						</button>
					}
				/>
				<PopoverContent side="top" className={contentDatePopoverClassName}>
					{getGuildContentCriteriaLabel(contentUpdatedAt)}
				</PopoverContent>
			</Popover>
		)
	}

	return <span className="text-grayscale-500 px-1 text-xs">{label}</span>
}

type CompareRowItemProps = {
	row: CompareRow
}

function CompareRowItem({ row }: CompareRowItemProps) {
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
				/>
				<div className="flex items-center justify-center self-stretch px-0.5 md:px-1">
					<CompareLabel label={row.label} contentUpdatedAt={row.contentUpdatedAt} />
				</div>
				<CompareValue
					side="opponent"
					value={row.opponentValue}
					winner={row.winner}
					diffLabel={row.diffLabel}
					diffPercentLabel={row.diffPercentLabel}
					valueKind={row.valueKind}
				/>
			</div>
		</div>
	)
}

function buildCompareRows(comparison: MemberVsMemberComparison): CompareRow[] {
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
			// 레벨·전투력은 동일 스냅샷 기준일을 사용합니다
			contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.combatPower
		},
		{
			label: '전투력',
			selfValue: comparison.combatPower.leftLabel,
			opponentValue: comparison.combatPower.rightLabel,
			diffLabel: comparison.combatPower.diffLabel,
			diffPercentLabel: comparison.combatPower.diffPercentLabel,
			winner: comparison.combatPower.winner,
			contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.combatPower
		},
		{
			label: '토벌전 등급',
			selfValue: comparison.expeditionGrade.left,
			opponentValue: comparison.expeditionGrade.right,
			diffLabel: comparison.expeditionGrade.diffLabel,
			winner: comparison.expeditionGrade.winner,
			contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.expedition
		},
		{
			label: '토벌전 점수',
			selfValue: comparison.expeditionScore.leftLabel,
			opponentValue: comparison.expeditionScore.rightLabel,
			diffLabel: comparison.expeditionScore.diffLabel,
			diffPercentLabel: comparison.expeditionScore.diffPercentLabel,
			winner: comparison.expeditionScore.winner,
			contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.expedition
		},
		{
			label: '대항전',
			selfValue: comparison.rivalry.leftLabel,
			opponentValue: comparison.rivalry.rightLabel,
			diffLabel: comparison.rivalry.diffLabel,
			diffPercentLabel: comparison.rivalry.diffPercentLabel,
			winner: comparison.rivalry.winner,
			contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.rivalry
		},
		{
			label: '수련장',
			selfValue: comparison.training.leftLabel,
			opponentValue: comparison.training.rightLabel,
			diffLabel: comparison.training.diffLabel,
			diffPercentLabel: comparison.training.diffPercentLabel,
			winner: comparison.training.winner,
			contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.training
		},
		{
			label: '길드보스',
			selfValue: comparison.guildBoss.leftHasValue ? comparison.guildBoss.leftLabel : '-',
			opponentValue: comparison.guildBoss.rightHasValue ? comparison.guildBoss.rightLabel : '-',
			diffLabel:
				comparison.guildBoss.leftHasValue && comparison.guildBoss.rightHasValue ? comparison.guildBoss.diffLabel : null,
			diffPercentLabel:
				comparison.guildBoss.leftHasValue && comparison.guildBoss.rightHasValue
					? comparison.guildBoss.diffPercentLabel
					: null,
			winner: comparison.guildBoss.winner,
			contentUpdatedAt: GUILD_CONTENT_UPDATED_AT.guildBoss
		}
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

function MemberComparePanel({ comparison }: MemberComparePanelProps) {
	const rows = buildCompareRows(comparison)

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
