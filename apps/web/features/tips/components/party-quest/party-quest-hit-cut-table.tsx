import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import { formatLocaleNumber } from '@/utils/format-korean-number'

import {
	getPartyQuestRequiredHit,
	PARTY_QUEST_DIFFICULTIES,
	PARTY_QUEST_META,
	PARTY_QUEST_ORDER
} from '../../lib/party-quest.constants'
import type { PartyQuestSelection } from '../../types/party-quest.type'

type PartyQuestHitCutTableProps = {
	selectedQuest: PartyQuestSelection
	setSelectedQuest: (_next: PartyQuestSelection) => void
}

function PartyQuestHitCutTable({ selectedQuest, setSelectedQuest }: PartyQuestHitCutTableProps) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col gap-1">
				<h2 className="text-grayscale-900 text-base font-semibold md:text-lg">명중컷 표</h2>
				<p className="text-grayscale-600 text-sm">명중 수치를 누르면 아래에 보상 정보가 표시됩니다.</p>
			</div>

			<HitCutTableShell scrollable={false} tableClassName="min-w-96">
				<TableHeader sticky>
					<TableRow className="border-grayscale-200 hover:bg-transparent">
						<TableHead className="bg-grayscale-100 text-grayscale-600 xs:text-xs h-auto w-[28%] min-w-0 overflow-hidden px-1 py-2 text-center text-[10px] leading-tight break-keep whitespace-normal md:w-[22%] md:px-2 md:text-sm">
							퀘스트 / 난이도
						</TableHead>
						{PARTY_QUEST_DIFFICULTIES.map(({ key, label, chipClassName }) => (
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
					{PARTY_QUEST_ORDER.map((quest) => (
						<TableRow key={quest} className="border-grayscale-200 hover:bg-transparent">
							<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-grayscale-50 text-grayscale-800')}>
								{PARTY_QUEST_META[quest].label}
							</TableCell>
							{PARTY_QUEST_DIFFICULTIES.map(({ key: difficulty }) => {
								const requiredHit = getPartyQuestRequiredHit(quest, difficulty)
								const isSelected = selectedQuest.quest === quest && selectedQuest.difficulty === difficulty

								return (
									<TableCell key={difficulty} className="p-0">
										<button
											type="button"
											onClick={() => setSelectedQuest({ quest, difficulty })}
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

export default PartyQuestHitCutTable
