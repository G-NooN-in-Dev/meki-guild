'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'
import Image from 'next/image'

import GameItemIcon from '@/components/game-item-icon'
import {
	formatStageJourneyStatValue,
	getStageJourneyPortraitSrc,
	STAGE_JOURNEY_CHAPTERS
} from '@/features/tips/lib/stage-journey.constants'
import { getGameItemMeta } from '@/libs/game-item.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

type StageJourneyChapterTableProps = {
	selectedChapter: number
	onSelectChapter: (chapter: number) => void
}

const cellBaseClassName = 'px-1 py-2 text-xs md:px-3 md:py-2.5 md:text-sm'
const chapterCellClassName =
	'w-9 min-w-9 max-w-9 px-0.5 py-2 text-center text-xs font-semibold tabular-nums md:w-10 md:min-w-10 md:max-w-10 md:py-2.5 md:text-sm'

/** 열별 헤더·본문 배경색 (대항전 표와 같은 파스텔 톤) */
const COLUMN_CLASS = {
	chapter: {
		header: 'bg-grayscale-100 text-grayscale-600',
		cell: 'bg-grayscale-50 text-grayscale-800'
	},
	boss: {
		header: 'bg-pastel-yellow-100 text-pastel-yellow-900',
		cell: 'text-grayscale-900'
	},
	rewards: {
		header: 'bg-pastel-blue-100 text-pastel-blue-900',
		cell: 'text-grayscale-800'
	},
	special: {
		header: 'bg-pastel-green-100 text-pastel-green-900',
		cell: 'text-grayscale-900'
	}
} as const

/**
 * 챕터별 클리어 보상·특수 옵션 요약 표.
 * 행을 누르면 아래 보유 효과 표의 챕터가 바뀝니다.
 */
function StageJourneyChapterTable({ selectedChapter, onSelectChapter }: StageJourneyChapterTableProps) {
	return (
		<div className="border-grayscale-200 bg-card shadow-soft max-h-[min(50dvh,28rem)] overflow-auto rounded-xl border md:max-h-[min(55dvh,32rem)]">
			<Table className="w-full min-w-120 table-fixed md:min-w-136" containerClassName="overflow-visible">
				<TableHeader sticky>
					<TableRow className="border-grayscale-200 hover:bg-transparent">
						<TableHead
							className={cn(
								COLUMN_CLASS.chapter.header,
								'w-9 max-w-9 min-w-9 px-0.5 text-center text-xs md:w-10 md:max-w-10 md:min-w-10 md:text-sm'
							)}
						>
							챕터
						</TableHead>
						<TableHead className={cn(COLUMN_CLASS.boss.header, 'w-[22%] text-left text-xs md:w-[19%] md:text-sm')}>
							보스
						</TableHead>
						<TableHead
							className={cn(
								COLUMN_CLASS.rewards.header,
								'w-[40%] text-left text-xs leading-tight md:w-[42%] md:text-sm'
							)}
						>
							클리어 보상
						</TableHead>
						<TableHead className={cn(COLUMN_CLASS.special.header, 'text-left text-xs leading-tight md:text-sm')}>
							특수 옵션
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{STAGE_JOURNEY_CHAPTERS.map((entry) => {
						const isSelected = entry.chapter === selectedChapter

						return (
							<TableRow
								key={entry.chapter}
								aria-selected={isSelected}
								className={cn(
									'border-grayscale-200 group cursor-pointer',
									isSelected ? 'bg-pastel-yellow-50 hover:bg-pastel-yellow-50' : 'hover:bg-grayscale-50/60'
								)}
								onClick={() => onSelectChapter(entry.chapter)}
							>
								<TableCell
									className={cn(
										chapterCellClassName,
										COLUMN_CLASS.chapter.cell,
										'group-hover:bg-grayscale-100/80',
										isSelected && 'bg-pastel-yellow-100 text-pastel-yellow-900'
									)}
								>
									{entry.chapter}
								</TableCell>
								<TableCell className={cn(cellBaseClassName, COLUMN_CLASS.boss.cell)}>
									<span className="flex min-w-0 items-center gap-2">
										<Image
											src={getStageJourneyPortraitSrc(entry.chapter)}
											alt={entry.name}
											width={64}
											height={64}
											unoptimized
											draggable={false}
											className="bg-card border-grayscale-200 size-8 shrink-0 rounded-md border object-contain md:size-9"
										/>
										<span className="truncate text-xs font-medium break-keep md:text-sm">{entry.name}</span>
									</span>
								</TableCell>
								<TableCell
									className={cn(cellBaseClassName, COLUMN_CLASS.rewards.cell, 'text-left leading-snug break-keep')}
								>
									<ul className="flex flex-col gap-0.5">
										{entry.rewards?.map((reward) => {
											const item = getGameItemMeta(reward.itemId)

											return (
												<li key={`${entry.chapter}-${reward.itemId}`} className="flex min-w-0 items-center gap-1.5">
													<GameItemIcon itemId={reward.itemId} size="sm" />
													<span className="min-w-0 truncate">
														{item.label}{' '}
														<span className="text-grayscale-900 font-bold tabular-nums">
															{formatLocaleNumber(reward.amount)}
														</span>
													</span>
												</li>
											)
										})}
										{!entry.rewards?.length && <li className="text-grayscale-500">정보 추가 예정</li>}
									</ul>
								</TableCell>
								<TableCell className={cn(cellBaseClassName, COLUMN_CLASS.special.cell, 'text-left break-keep')}>
									{entry.special ? (
										<>
											<span className="text-grayscale-700">{entry.special.label}</span>{' '}
											<span className="text-grayscale-900 font-bold tabular-nums">
												{formatStageJourneyStatValue(entry.special.value, entry.special.unit)}
											</span>
										</>
									) : (
										<span className="text-grayscale-500">정보 추가 예정</span>
									)}
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}

export default StageJourneyChapterTable
