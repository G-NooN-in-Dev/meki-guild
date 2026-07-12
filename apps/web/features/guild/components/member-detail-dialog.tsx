'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { cn } from '@shared/ui/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'

import { GrowthDelta, MemberStatusBadge } from '@/features/guild/components/growth-delta'
import JobBadge from '@/features/guild/components/job-badge'
import MemberDisplayName, { useMemberDisplayName } from '@/features/guild/components/member-display-name'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { GUILD_UNENTERED_LABEL } from '@/features/guild/types/guild-snapshot.type'
import { formatGuildContentDate } from '@/libs/guild-content-dates.constants'

type MemberDetailDialogProps = {
	comparison: GuildMemberComparison
	/** 최근 주 스냅샷 수집일 (YYYY-MM-DD) */
	currentUpdatedAt: string
	/** 직전 주 스냅샷 수집일 (YYYY-MM-DD) */
	previousUpdatedAt: string
}

/** 직전 주 값이 없으면 '-'로 표시 (신규·미비교) */
function formatPreviousValue(label: string | null | undefined): string {
	if (!label) {
		return '-'
	}

	return label
}

function getValueClassName(label: string): string {
	return label === GUILD_UNENTERED_LABEL || label === '-' ? 'text-grayscale-400' : ''
}

type DetailRow = {
	label: string
	currentLabel: string
	previousLabel: string
	diffLabel: string | null
	diffPercentLabel?: string | null
}

/** 멤버 비교 데이터를 Dialog 표 행으로 펼칩니다 */
function buildDetailRows(comparison: GuildMemberComparison): DetailRow[] {
	return [
		{
			label: '레벨',
			currentLabel: comparison.level.currentLabel,
			previousLabel: comparison.level.previous !== null ? String(comparison.level.previous) : '-',
			diffLabel: comparison.level.diffLabel
		},
		{
			label: '전투력',
			currentLabel: comparison.combatPower.currentLabel,
			previousLabel: formatPreviousValue(comparison.combatPower.previousLabel),
			diffLabel: comparison.combatPower.diffLabel,
			diffPercentLabel: comparison.combatPower.diffPercentLabel
		},
		{
			label: '토벌전 (등급)',
			currentLabel: comparison.expeditionGrade.currentLabel,
			previousLabel: formatPreviousValue(comparison.expeditionGrade.previous),
			diffLabel: comparison.expeditionGrade.diffLabel
		},
		{
			label: '토벌전 (점수)',
			currentLabel: comparison.expeditionScore.currentLabel,
			previousLabel: formatPreviousValue(comparison.expeditionScore.previousLabel),
			diffLabel: comparison.expeditionScore.diffLabel,
			diffPercentLabel: comparison.expeditionScore.diffPercentLabel
		},
		{
			label: '대항전',
			currentLabel: comparison.rivalry.currentLabel,
			previousLabel: formatPreviousValue(comparison.rivalry.previousLabel),
			diffLabel: comparison.rivalry.diffLabel,
			diffPercentLabel: comparison.rivalry.diffPercentLabel
		},
		{
			label: '수련장',
			currentLabel: comparison.training.currentLabel,
			previousLabel: formatPreviousValue(comparison.training.previousLabel),
			diffLabel: comparison.training.diffLabel,
			diffPercentLabel: comparison.training.diffPercentLabel
		},
		{
			label: '길드보스',
			currentLabel: comparison.guildBoss.currentLabel,
			previousLabel: formatPreviousValue(comparison.guildBoss.previousLabel),
			diffLabel: comparison.guildBoss.diffLabel,
			diffPercentLabel: comparison.guildBoss.diffPercentLabel
		}
	]
}

type PeriodHeadProps = {
	label: string
	updatedAt: string
	align?: 'left' | 'right'
}

/** 기간 라벨 + 업데이트일을 세로로 묶어 헤더에 표시 */
function PeriodHead({ label, updatedAt, align = 'right' }: PeriodHeadProps) {
	return (
		<TableHead className={cn('text-grayscale-500', align === 'right' && 'text-right')}>
			<div className={cn('flex flex-col gap-0.5', align === 'right' && 'items-end')}>
				<span className="text-grayscale-700 font-semibold">{label}</span>
				<span className="text-grayscale-400 text-[11px] font-normal tabular-nums">
					{formatGuildContentDate(updatedAt)}
				</span>
			</div>
		</TableHead>
	)
}

function MemberDetailDialog({ comparison, currentUpdatedAt, previousUpdatedAt }: MemberDetailDialogProps) {
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
								<PeriodHead label="최근 데이터" updatedAt={currentUpdatedAt} />
								<PeriodHead label="직전 데이터" updatedAt={previousUpdatedAt} />
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
									<TableCell
										className={cn('py-3 text-right font-semibold tabular-nums', getValueClassName(row.currentLabel))}
									>
										{row.currentLabel}
									</TableCell>
									<TableCell
										className={cn(
											'text-grayscale-600 py-3 text-right tabular-nums',
											getValueClassName(row.previousLabel)
										)}
									>
										{row.previousLabel}
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
