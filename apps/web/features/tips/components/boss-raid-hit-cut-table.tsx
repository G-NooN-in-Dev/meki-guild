import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { formatLocaleNumber } from '@/utils/format-korean-number'

import {
	BOSS_RAID_BOSS_META,
	BOSS_RAID_BOSS_ORDER,
	BOSS_RAID_DIFFICULTIES,
	getBossRaidRequiredHit
} from '../lib/boss-raid.constants'
import { BossRaidSelection } from '../types/boss-raid.type'

type BossRaidHitCutTableProps = {
	selectedBoss: BossRaidSelection
	setSelectedBoss: (_nextBoss: BossRaidSelection) => void
}

const cellBaseClassName =
	'px-1.5 py-2 text-center text-xs font-semibold tabular-nums xs:px-2 xs:text-sm md:px-3 md:py-2.5 md:text-base'

function BossRaidHitCutTable({ selectedBoss, setSelectedBoss }: BossRaidHitCutTableProps) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col gap-1">
				<h2 className="text-grayscale-900 text-base font-semibold md:text-lg">명중컷 표</h2>
				<p className="text-grayscale-600 text-sm">명중 수치를 누르면 아래에 보상 정보가 표시됩니다.</p>
			</div>

			<div className="border-grayscale-200 bg-card shadow-soft overflow-auto rounded-xl border">
				<Table className="w-full min-w-96 table-fixed" containerClassName="overflow-visible">
					<TableHeader sticky>
						<TableRow className="border-grayscale-200 hover:bg-transparent">
							<TableHead className="bg-grayscale-100 text-grayscale-600 w-[22%] text-center text-xs md:w-[18%] md:text-sm">
								보스 / 난이도
							</TableHead>
							{BOSS_RAID_DIFFICULTIES.map(({ key, label, chipClassName }) => (
								<TableHead
									key={key}
									className={cn('text-center text-xs leading-tight break-keep md:text-sm', chipClassName)}
								>
									<span className={cn('inline-block rounded-md px-1.5 py-0.5 md:px-2 md:py-1')}>{label}</span>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{BOSS_RAID_BOSS_ORDER.map((boss) => (
							<TableRow key={boss} className="border-grayscale-200 hover:bg-transparent">
								<TableCell className={cn(cellBaseClassName, 'bg-grayscale-50 text-grayscale-800')}>
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
													cellBaseClassName,
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
				</Table>
			</div>
		</div>
	)
}

export default BossRaidHitCutTable
