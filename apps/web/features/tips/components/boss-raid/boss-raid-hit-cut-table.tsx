import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import { formatLocaleNumber } from '@/utils/format-korean-number'

import {
	BOSS_RAID_BOSS_META,
	BOSS_RAID_BOSS_ORDER,
	BOSS_RAID_DIFFICULTIES,
	getBossRaidRequiredHit
} from '../../lib/boss-raid.constants'
import { BossRaidSelection } from '../../types/boss-raid.type'

type BossRaidHitCutTableProps = {
	selectedBoss: BossRaidSelection
	setSelectedBoss: (_nextBoss: BossRaidSelection) => void
}

function BossRaidHitCutTable({ selectedBoss, setSelectedBoss }: BossRaidHitCutTableProps) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col gap-1">
				<h2 className="text-grayscale-900 text-base font-semibold md:text-lg">명중컷 표</h2>
				<p className="text-grayscale-600 text-sm">명중 수치를 누르면 아래에 보상 정보가 표시됩니다.</p>
			</div>

			<HitCutTableShell scrollable={false} tableClassName="min-w-96">
				<TableHeader sticky>
					<TableRow className="border-grayscale-200 hover:bg-transparent">
						<TableHead className="bg-grayscale-100 text-grayscale-600 xs:text-xs h-auto w-[22%] min-w-0 overflow-hidden px-1 py-2 text-center text-[10px] leading-tight break-keep whitespace-normal md:w-[18%] md:px-2 md:text-sm">
							보스 / 난이도
						</TableHead>
						{BOSS_RAID_DIFFICULTIES.map(({ key, label, chipClassName }) => (
							<TableHead
								key={key}
								className={cn(
									'xs:px-1 xs:text-xs h-auto min-w-0 overflow-hidden px-0.5 py-2 text-center text-[10px] leading-tight break-keep whitespace-normal md:px-2 md:text-sm',
									chipClassName
								)}
							>
								{label}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{BOSS_RAID_BOSS_ORDER.map((boss) => (
						<TableRow key={boss} className="border-grayscale-200 hover:bg-transparent">
							<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-grayscale-50 text-grayscale-800')}>
								{BOSS_RAID_BOSS_META[boss].label}
							</TableCell>
							{BOSS_RAID_DIFFICULTIES.map(({ key: difficulty }) => {
								const requiredHit = getBossRaidRequiredHit(boss, difficulty)
								const isSelected = selectedBoss.boss === boss && selectedBoss.difficulty === difficulty

								return (
									<TableCell key={difficulty} className="p-0">
										<button
											type="button"
											onClick={() => setSelectedBoss({ boss, difficulty })}
											className={cn(
												HIT_CUT_CELL_BASE_CLASS_NAME,
												'text-grayscale-900 hover:bg-grayscale-100/80 size-full cursor-pointer transition-colors',
												isSelected && 'ring-grayscale-900 bg-pastel-blue-50 ring-2 ring-inset'
											)}
										>
											{requiredHit !== undefined ? formatLocaleNumber(requiredHit) : '—'}
										</button>
									</TableCell>
								)
							})}
						</TableRow>
					))}
				</TableBody>
			</HitCutTableShell>
		</div>
	)
}

export default BossRaidHitCutTable
