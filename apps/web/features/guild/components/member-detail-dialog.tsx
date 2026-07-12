'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { cn } from '@shared/ui/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'

import { GrowthDelta, MemberStatusBadge } from '@/features/guild/components/growth-delta'
import JobBadge from '@/features/guild/components/job-badge'
import MemberDisplayName, { useMemberDisplayName } from '@/features/guild/components/member-display-name'
import { GUILD_EMPTY_VALUE_LABEL, type GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import {
	formatGuildContentDateOrNone,
	GUILD_CONTENT_UPDATED_AT,
	type GuildContentDateRange
} from '@/libs/guild-content-dates.constants'
import { formatPlacementRank } from '@/utils/format-korean-number'

type MemberDetailDialogProps = {
	comparison: GuildMemberComparison
}

/** 직전 주 값이 없으면 빈 값 표기 (신규·미비교) */
function formatPreviousValue(label: string | null | undefined): string {
	if (!label) {
		return GUILD_EMPTY_VALUE_LABEL
	}

	return label
}

function getValueClassName(label: string): string {
	return label === GUILD_EMPTY_VALUE_LABEL ? 'text-grayscale-400' : ''
}

type DetailRow = {
	label: string
	currentLabel: string
	previousLabel: string
	diffLabel: string | null
	diffPercentLabel?: string | null
	/** 해당 항목의 최근·직전 수집일 */
	contentDates: GuildContentDateRange
}

/** 멤버 비교 데이터를 Dialog 표 행으로 펼칩니다 */
function buildDetailRows(comparison: GuildMemberComparison): DetailRow[] {
	return [
		{
			label: '레벨',
			currentLabel: comparison.level.currentLabel,
			previousLabel: comparison.level.previous !== null ? String(comparison.level.previous) : GUILD_EMPTY_VALUE_LABEL,
			diffLabel: comparison.level.diffLabel,
			contentDates: GUILD_CONTENT_UPDATED_AT.combatPower
		},
		{
			label: '전투력',
			currentLabel: comparison.combatPower.currentLabel,
			previousLabel: formatPreviousValue(comparison.combatPower.previousLabel),
			diffLabel: comparison.combatPower.diffLabel,
			diffPercentLabel: comparison.combatPower.diffPercentLabel,
			contentDates: GUILD_CONTENT_UPDATED_AT.combatPower
		},
		{
			label: '토벌전 (등급)',
			currentLabel: comparison.expeditionGrade.currentLabel,
			previousLabel: formatPreviousValue(comparison.expeditionGrade.previous),
			diffLabel: comparison.expeditionGrade.diffLabel,
			contentDates: GUILD_CONTENT_UPDATED_AT.expedition
		},
		{
			label: '토벌전 (등수)',
			// currentLabel은 placementLabel(`N위`)을 그대로 사용. 직전만 숫자라 여기서 포맷
			currentLabel: comparison.expeditionPlacement.currentLabel,
			previousLabel: formatPlacementRank(comparison.expeditionPlacement.previous),
			diffLabel: comparison.expeditionPlacement.diffLabel,
			contentDates: GUILD_CONTENT_UPDATED_AT.expedition
		},
		{
			label: '토벌전 (점수)',
			currentLabel: comparison.expeditionScore.currentLabel,
			previousLabel: formatPreviousValue(comparison.expeditionScore.previousLabel),
			diffLabel: comparison.expeditionScore.diffLabel,
			diffPercentLabel: comparison.expeditionScore.diffPercentLabel,
			contentDates: GUILD_CONTENT_UPDATED_AT.expedition
		},
		{
			label: '대항전',
			currentLabel: comparison.rivalry.currentLabel,
			previousLabel: formatPreviousValue(comparison.rivalry.previousLabel),
			diffLabel: comparison.rivalry.diffLabel,
			diffPercentLabel: comparison.rivalry.diffPercentLabel,
			contentDates: GUILD_CONTENT_UPDATED_AT.rivalry
		},
		{
			label: '수련장',
			currentLabel: comparison.training.currentLabel,
			previousLabel: formatPreviousValue(comparison.training.previousLabel),
			diffLabel: comparison.training.diffLabel,
			diffPercentLabel: comparison.training.diffPercentLabel,
			contentDates: GUILD_CONTENT_UPDATED_AT.training
		},
		{
			label: '길드보스',
			currentLabel: comparison.guildBoss.currentLabel,
			previousLabel: formatPreviousValue(comparison.guildBoss.previousLabel),
			diffLabel: comparison.guildBoss.diffLabel,
			diffPercentLabel: comparison.guildBoss.diffPercentLabel,
			contentDates: GUILD_CONTENT_UPDATED_AT.guildBoss
		}
	]
}

type PeriodHeadProps = {
	label: string
	align?: 'left' | 'right'
}

/** 기간 라벨만 표시 (날짜는 행마다 분야별로 다름) */
function PeriodHead({ label, align = 'right' }: PeriodHeadProps) {
	return (
		<TableHead className={cn('text-grayscale-500', align === 'right' && 'text-right')}>
			<span className="text-grayscale-700 font-semibold">{label}</span>
		</TableHead>
	)
}

type PeriodValueCellProps = {
	value: string
	updatedAt: string | null
	emphasize?: boolean
}

/** 값 + 해당 기간의 수집일을 함께 표시합니다 */
function PeriodValueCell({ value, updatedAt, emphasize = false }: PeriodValueCellProps) {
	return (
		<div className="flex flex-col items-end gap-0.5">
			<span className={cn('tabular-nums', emphasize && 'font-semibold', getValueClassName(value))}>{value}</span>
			<span className="text-grayscale-400 text-[11px] font-normal tabular-nums">
				{formatGuildContentDateOrNone(updatedAt)}
			</span>
		</div>
	)
}

function MemberDetailDialog({ comparison }: MemberDetailDialogProps) {
	const rows = buildDetailRows(comparison)
	const displayName = useMemberDisplayName(comparison.name)

	return (
		<Dialog>
			<DialogTrigger
				render={
					// 테이블 셀 안에서 이름 아래로 두는 보조 액션 — 버튼보다 링크 톤이 덜 산만함
					<button
						type="button"
						className="text-grayscale-500 hover:text-grayscale-800 text-xs font-normal underline decoration-dotted underline-offset-4 transition-colors hover:cursor-pointer"
						aria-label={`${displayName} 자세히 보기`}
					>
						자세히 보기
					</button>
				}
			/>
			<DialogContent className="sm:max-w-xl">
				<DialogHeader>
					{/* 이름·상태·직업을 한 줄로 나란히 표시 */}
					<DialogTitle className="flex flex-wrap items-center gap-1.5">
						<MemberDisplayName name={comparison.name} />
						<MemberStatusBadge status={comparison.status} />
						<JobBadge job={comparison.job} />
					</DialogTitle>
					{/* DialogDescription은 a11y용으로 숨기고, 직업은 색상 Badge로 표시 */}
					<DialogDescription className="sr-only">{comparison.job}</DialogDescription>
				</DialogHeader>
				{/* 회색 배경 + sticky 헤더로 숫자 대비·스크롤 가독성 확보 */}
				<div className="border-grayscale-200 bg-grayscale-100 max-h-96 overflow-y-auto rounded-lg border">
					<Table>
						<TableHeader className="bg-grayscale-100 sticky top-0 z-10">
							<TableRow className="bg-grayscale-100 hover:bg-grayscale-100 border-grayscale-200">
								<TableHead className="text-grayscale-500 w-[28%]">항목</TableHead>
								<PeriodHead label="최근 데이터" />
								<PeriodHead label="직전 데이터" />
								<TableHead className="text-grayscale-500 text-right">증감</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((row, index) => (
								<TableRow
									key={row.label}
									className={cn('border-grayscale-200', index % 2 === 0 ? 'bg-card' : 'bg-grayscale-50')}
								>
									<TableCell className="text-grayscale-700 py-3 font-medium">{row.label}</TableCell>
									<TableCell className="py-3 text-right">
										<PeriodValueCell value={row.currentLabel} updatedAt={row.contentDates.current} emphasize />
									</TableCell>
									<TableCell className="text-grayscale-600 py-3 text-right">
										<PeriodValueCell value={row.previousLabel} updatedAt={row.contentDates.previous} />
									</TableCell>
									<TableCell className="py-3 text-right">
										<GrowthDelta value={row.diffLabel} percentLabel={row.diffPercentLabel} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default MemberDetailDialog
