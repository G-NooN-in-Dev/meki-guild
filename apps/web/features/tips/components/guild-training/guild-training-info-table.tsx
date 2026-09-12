import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import { GUILD_TRAINING_STAGE_ENTRIES } from '@/features/tips/lib/guild-training-info.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

const HEAD_BASE_CLASS_NAME =
	'h-auto px-1.5 py-2 text-center text-xs leading-tight break-keep xs:px-2 sm:px-3 sm:text-sm'

type DualValueCellProps = {
	primary: number
	secondary: number
	className?: string
	/** true면 모바일에서 세로 스택, false면 항상 한 줄 */
	stackOnMobile?: boolean
}

/** 일반몹 / 특수몹 값. 기본은 모바일 세로·sm 이상 가로. */
function DualValueCell({ primary, secondary, className, stackOnMobile = true }: DualValueCellProps) {
	return (
		<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, className)}>
			<span
				className={cn(
					'flex items-center justify-center gap-1.5',
					stackOnMobile && 'flex-col gap-0.5 sm:flex-row sm:gap-1.5'
				)}
			>
				<span>{formatLocaleNumber(primary)}</span>
				<span className={cn('text-grayscale-400 leading-none font-normal', stackOnMobile ? 'text-[10px]' : 'text-sm')}>
					/
				</span>
				<span>{formatLocaleNumber(secondary)}</span>
			</span>
		</TableCell>
	)
}

type DualColumnHeadProps = {
	title: string
	className?: string
}

/** 일반 / 특수 쌍 열의 헤더 — 모바일은 세로, sm 이상은 한 줄 */
function DualColumnHead({ title, className }: DualColumnHeadProps) {
	return (
		<TableHead className={cn(HEAD_BASE_CLASS_NAME, className)}>
			<span className="flex flex-col items-center gap-0.5 sm:flex-row sm:justify-center sm:gap-1">
				<span>{title}</span>
				<span className="text-[10px] leading-none font-normal opacity-80 sm:text-xs">(일반 / 특수)</span>
			</span>
		</TableHead>
	)
}

/**
 * 길드 수련장 단계별 점수·명중컷·타수 표.
 * 일반/특수 값을 한 열에 모으고, 처치 점수만 모바일에서 세로 스택합니다.
 */
function GuildTrainingInfoTable() {
	return (
		<HitCutTableShell>
			<TableHeader sticky>
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead className={cn(HEAD_BASE_CLASS_NAME, 'bg-grayscale-100 text-grayscale-600 w-[12%]')}>
						레벨
					</TableHead>
					<TableHead className={cn(HEAD_BASE_CLASS_NAME, 'bg-pastel-yellow-100 text-pastel-yellow-900 w-[18%]')}>
						{/* 모바일: 2줄 / sm+: 한 줄 */}
						<span className="flex flex-col items-center gap-0.5 sm:hidden">
							<span>특수몹</span>
							<span>필요 타수</span>
						</span>
						<span className="hidden sm:inline">특수몹 필요 타수</span>
					</TableHead>
					<DualColumnHead title="처치 점수" className="bg-pastel-green-100 text-pastel-green-900 w-[38%]" />
					<DualColumnHead title="필요 명중" className="bg-pastel-blue-100 text-pastel-blue-900 w-[32%]" />
				</TableRow>
			</TableHeader>
			<TableBody>
				{GUILD_TRAINING_STAGE_ENTRIES.map((entry) => {
					const { stage, normalKillScore, normalHitCut, specialRequiredHits, specialKillScore, specialHitCut } = entry

					return (
						<TableRow key={stage} className="border-grayscale-200 hover:bg-transparent">
							<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-grayscale-50 text-grayscale-800')}>
								{stage}
							</TableCell>
							<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-pastel-yellow-50 text-grayscale-900')}>
								{formatLocaleNumber(specialRequiredHits)}
							</TableCell>
							<DualValueCell
								primary={normalKillScore}
								secondary={specialKillScore}
								className="bg-pastel-green-50 text-grayscale-900"
							/>
							<DualValueCell
								primary={normalHitCut}
								secondary={specialHitCut}
								stackOnMobile={false}
								className="bg-pastel-blue-50 text-grayscale-900"
							/>
						</TableRow>
					)
				})}
			</TableBody>
		</HitCutTableShell>
	)
}

export default GuildTrainingInfoTable
