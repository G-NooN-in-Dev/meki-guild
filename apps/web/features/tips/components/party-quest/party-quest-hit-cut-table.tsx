import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import { scrollToRewardDetailIfNarrow } from '@/features/tips/lib/scroll-to-reward-detail'
import { formatLocaleNumber } from '@/utils/format-korean-number'

import {
	getPartyQuestDefense,
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

const HEAD_CLASS_NAME =
	'h-auto min-w-0 overflow-hidden px-1 py-2 text-center text-[10px] leading-tight break-keep whitespace-normal xs:text-xs md:px-2 md:text-sm'

type PartyQuestStatLineProps = {
	name: string
	value: number | undefined
	className: string
	nameClassName: string
}

/** 칸 안의 이름과 최댓값. 이름만 보고 명중·방어력을 구분합니다. */
function PartyQuestStatLine({ name, value, className, nameClassName }: PartyQuestStatLineProps) {
	return (
		<span
			className={cn(
				'flex w-full flex-col items-center justify-center gap-0.5 px-0.5 py-1 transition-colors',
				className
			)}
		>
			<span className={cn('text-[10px] leading-none font-medium md:text-xs', nameClassName)}>{name}</span>
			<span className="xs:text-sm text-xs font-semibold tabular-nums md:text-base">
				{value !== undefined ? formatLocaleNumber(value) : '—'}
			</span>
		</span>
	)
}

type PartyQuestDifficultyCellProps = {
	questLabel: string
	difficultyLabel: string
	requiredHit: number | undefined
	defense: number | undefined
	isSelected: boolean
	onSelect: () => void
}

function PartyQuestDifficultyCell({
	questLabel,
	difficultyLabel,
	requiredHit,
	defense,
	isSelected,
	onSelect
}: PartyQuestDifficultyCellProps) {
	const hasStats = requiredHit !== undefined && defense !== undefined
	const label = hasStats
		? `${questLabel} ${difficultyLabel}, 필요 명중 ${formatLocaleNumber(requiredHit)}, 방어력 ${formatLocaleNumber(defense)}`
		: `${questLabel} ${difficultyLabel} 정보 없음`

	return (
		<TableCell className="p-0">
			<button
				type="button"
				onClick={onSelect}
				aria-label={label}
				className="group relative flex size-full cursor-pointer flex-col"
			>
				<PartyQuestStatLine
					name="명중"
					value={requiredHit}
					className={cn(
						'text-grayscale-900 group-hover:bg-pastel-blue-200/50',
						isSelected ? 'bg-pastel-blue-200/80' : 'bg-pastel-blue-50'
					)}
					nameClassName="text-pastel-blue-900"
				/>
				<PartyQuestStatLine
					name="방어력"
					value={defense}
					className={cn(
						'text-grayscale-900 border-grayscale-200 group-hover:bg-pastel-orange-200/50 border-t',
						isSelected ? 'bg-pastel-orange-200/80' : 'bg-pastel-orange-50'
					)}
					nameClassName="text-pastel-orange-900"
				/>
				{isSelected ? (
					<span aria-hidden className="ring-grayscale-900 pointer-events-none absolute inset-0 ring-2 ring-inset" />
				) : null}
			</button>
		</TableCell>
	)
}

function PartyQuestHitCutTable({ selectedQuest, setSelectedQuest }: PartyQuestHitCutTableProps) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-col gap-1">
				<h2 className="text-grayscale-900 text-base font-semibold md:text-lg">필요 명중 · 방어력</h2>
				<p className="text-grayscale-600 text-sm">
					수치를 누르면 아래에 보상 정보가 표시됩니다. 해당 수치는 퀘스트 내 최대 명중·방어력입니다.
				</p>
			</div>

			<HitCutTableShell scrollable={false}>
				<TableHeader sticky>
					<TableRow className="border-grayscale-200 hover:bg-transparent">
						<TableHead className={cn(HEAD_CLASS_NAME, 'bg-grayscale-100 text-grayscale-600 w-[28%] md:w-[22%]')}>
							퀘스트 / 난이도
						</TableHead>
						{PARTY_QUEST_DIFFICULTIES.map(({ key, label, chipClassName }) => (
							<TableHead key={key} className={cn(HEAD_CLASS_NAME, chipClassName)}>
								{label}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{PARTY_QUEST_ORDER.map((quest) => {
						const questLabel = PARTY_QUEST_META[quest].label

						return (
							<TableRow key={quest} className="border-grayscale-200 hover:bg-transparent">
								<TableCell
									className={cn(
										HIT_CUT_CELL_BASE_CLASS_NAME,
										'bg-grayscale-50 text-grayscale-800 break-keep whitespace-normal'
									)}
								>
									{questLabel}
								</TableCell>
								{PARTY_QUEST_DIFFICULTIES.map(({ key: difficulty, label: difficultyLabel }) => (
									<PartyQuestDifficultyCell
										key={difficulty}
										questLabel={questLabel}
										difficultyLabel={difficultyLabel}
										requiredHit={getPartyQuestRequiredHit(quest, difficulty)}
										defense={getPartyQuestDefense(quest, difficulty)}
										isSelected={selectedQuest.quest === quest && selectedQuest.difficulty === difficulty}
										onSelect={() => {
											setSelectedQuest({ quest, difficulty })
											scrollToRewardDetailIfNarrow()
										}}
									/>
								))}
							</TableRow>
						)
					})}
				</TableBody>
			</HitCutTableShell>
		</div>
	)
}

export default PartyQuestHitCutTable
