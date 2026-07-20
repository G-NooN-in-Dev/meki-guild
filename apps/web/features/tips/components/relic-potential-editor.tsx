'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'
import { cn } from '@shared/ui/utils'
import { PlusIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

import {
	getRelicPotentialOptionById,
	getRelicPotentialOptionsByGrade,
	getRelicPotentialSlotLimit,
	RELIC_POTENTIAL_GRADE_BADGE_CLASS,
	RELIC_POTENTIAL_GRADE_META,
	RELIC_POTENTIAL_GRADE_ORDER,
	RELIC_POTENTIAL_GRADE_TAB_CLASS
} from '@/features/tips/lib/relic-potential.constants'
import type { RelicGrade, RelicPotentialGrade } from '@/features/tips/types/relic.type'

type RelicPotentialEditorProps = {
	relicGrade: RelicGrade
	potentialIds: readonly string[]
	onChange: (potentialIds: readonly string[]) => void
}

function isRelicPotentialGrade(value: string | number | null): value is RelicPotentialGrade {
	return typeof value === 'string' && (RELIC_POTENTIAL_GRADE_ORDER as readonly string[]).includes(value)
}

/**
 * 유물에 붙는 잠재옵션 편집 UI.
 * 레전드리 최대 3칸, 유니크·에픽 최대 2칸.
 */
function RelicPotentialEditor({ relicGrade, potentialIds, onChange }: RelicPotentialEditorProps) {
	const limit = getRelicPotentialSlotLimit(relicGrade)
	const [pickerOpen, setPickerOpen] = useState(false)
	const [editingIndex, setEditingIndex] = useState<number | null>(null)
	const [gradeTab, setGradeTab] = useState<RelicPotentialGrade>('mystic')

	const canAdd = potentialIds.length < limit
	const isPicking = pickerOpen || editingIndex !== null

	function openAddPicker() {
		if (!canAdd) {
			return
		}
		setEditingIndex(null)
		setPickerOpen(true)
		setGradeTab('mystic')
	}

	function openEditPicker(index: number) {
		const current = getRelicPotentialOptionById(potentialIds[index] ?? '')
		setEditingIndex(index)
		setPickerOpen(false)
		setGradeTab(current?.grade ?? 'mystic')
	}

	function closePicker() {
		setPickerOpen(false)
		setEditingIndex(null)
	}

	function handleSelectOption(optionId: string) {
		if (editingIndex !== null) {
			const next = [...potentialIds]
			next[editingIndex] = optionId
			onChange(next)
			closePicker()
			return
		}

		if (!canAdd) {
			return
		}

		onChange([...potentialIds, optionId])
		closePicker()
	}

	function handleRemove(index: number) {
		onChange(potentialIds.filter((_, i) => i !== index))
		if (editingIndex === index) {
			closePicker()
		}
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-end justify-between gap-2">
				<div>
					<p className="text-grayscale-900 text-sm font-semibold">잠재 옵션</p>
				</div>
				<p className="text-grayscale-500 text-xs tabular-nums">
					{potentialIds.length}/{limit}
				</p>
			</div>

			{potentialIds.length > 0 ? (
				<ul className="space-y-1.5">
					{potentialIds.map((id, index) => {
						const option = getRelicPotentialOptionById(id)
						if (!option) {
							return null
						}

						const isEditing = editingIndex === index

						return (
							<li key={`${id}-${index}`} className="flex items-center gap-1.5">
								<button
									type="button"
									onClick={() => openEditPicker(index)}
									className={cn(
										'border-grayscale-200 flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-sm transition-colors',
										'hover:border-grayscale-300 hover:bg-grayscale-50',
										'focus-visible:ring-grayscale-900 focus-visible:ring-2 focus-visible:outline-none',
										isEditing && 'border-grayscale-900 bg-grayscale-50 ring-grayscale-900/10 ring-1'
									)}
								>
									<Badge className={cn('shrink-0', RELIC_POTENTIAL_GRADE_BADGE_CLASS[option.grade])}>
										{RELIC_POTENTIAL_GRADE_META[option.grade].label}
									</Badge>
									<span className="text-grayscale-800 truncate">{option.displayText}</span>
								</button>
								<button
									type="button"
									aria-label={`${option.displayText} 제거`}
									onClick={() => handleRemove(index)}
									className={cn(
										'text-grayscale-400 hover:text-grayscale-700 hover:bg-grayscale-100 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors',
										'focus-visible:ring-grayscale-900 focus-visible:ring-2 focus-visible:outline-none'
									)}
								>
									<XIcon className="size-4" />
								</button>
							</li>
						)
					})}
				</ul>
			) : (
				<p className="text-grayscale-400 text-xs">아직 잠재옵션이 없습니다.</p>
			)}

			{canAdd && !isPicking ? (
				<Button type="button" variant="outline" size="sm" className="w-full" onClick={openAddPicker}>
					<PlusIcon className="size-4" />
					잠재 추가
				</Button>
			) : null}

			{isPicking ? (
				<div className="border-grayscale-200 bg-card flex flex-col gap-2 rounded-xl border p-2.5">
					<div className="flex items-center justify-between gap-2">
						<p className="text-grayscale-700 text-xs font-medium">
							{editingIndex !== null ? `${editingIndex + 1}번 잠재 변경` : '잠재 옵션 선택'}
						</p>
						<button
							type="button"
							onClick={closePicker}
							className="text-grayscale-500 hover:text-grayscale-800 cursor-pointer text-xs font-medium"
						>
							닫기
						</button>
					</div>

					<Tabs
						value={gradeTab}
						onValueChange={(value) => {
							if (isRelicPotentialGrade(value)) {
								setGradeTab(value)
							}
						}}
						className="gap-2"
					>
						<TabsList className="grid h-auto w-full grid-cols-5 gap-0.5 p-0.5">
							{RELIC_POTENTIAL_GRADE_ORDER.map((grade) => (
								<TabsTrigger
									key={grade}
									value={grade}
									className={cn('px-1 text-[10px] md:text-xs', RELIC_POTENTIAL_GRADE_TAB_CLASS[grade])}
								>
									{RELIC_POTENTIAL_GRADE_META[grade].label}
								</TabsTrigger>
							))}
						</TabsList>

						{RELIC_POTENTIAL_GRADE_ORDER.map((grade) => (
							<TabsContent key={grade} value={grade} className="mt-0">
								{/* 긴 옵션명(+수치)이 잘리지 않도록 1열로 표시 */}
								<div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
									{getRelicPotentialOptionsByGrade(grade).map((option) => (
										<button
											key={option.id}
											type="button"
											onClick={() => handleSelectOption(option.id)}
											className={cn(
												'border-grayscale-200 flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1.5 text-left text-xs font-medium transition-colors',
												'hover:border-grayscale-300 hover:bg-grayscale-50',
												'focus-visible:ring-grayscale-900 focus-visible:ring-2 focus-visible:outline-none'
											)}
										>
											<span className="text-grayscale-800">{option.displayText}</span>
										</button>
									))}
								</div>
							</TabsContent>
						))}
					</Tabs>
				</div>
			) : null}
		</div>
	)
}

export default RelicPotentialEditor
