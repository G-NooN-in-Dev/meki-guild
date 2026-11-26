'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { Checkbox } from '@shared/ui/checkbox'
import { Label } from '@shared/ui/label'
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from '@shared/ui/popover'
import { ListFilterIcon } from 'lucide-react'

import { RELIC_GRADE_META, RELIC_GRADE_ORDER } from '@/features/tips/lib/relic.constants'
import {
	INITIAL_RELIC_FILTER,
	RELIC_CONTENT_OPTIONS,
	RELIC_EFFECT_CATEGORY_OPTIONS,
	RELIC_TAG_OPTIONS
} from '@/features/tips/lib/relic-filter.constants'
import { countActiveRelicFilters, toggleFilterValue } from '@/features/tips/lib/relic-filter.helpers'
import type { RelicFilterState } from '@/features/tips/types/relic.type'

type FilterOption<T extends string> = {
	value: T
	label: string
}

type RelicFilterGroupProps<T extends string> = {
	title: string
	options: readonly FilterOption<T>[]
	selected: readonly T[]
	onToggle: (value: T) => void
	/** row=한 줄 가로 배치(옵션이 적은 그룹), one=1열, two=2열 그리드(옵션이 많은 그룹) */
	layout?: 'row' | 'one' | 'two'
}

const GROUP_LAYOUT_CLASS = {
	row: 'flex flex-wrap gap-x-4 gap-y-2',
	one: 'grid grid-cols-1 gap-y-2',
	two: 'grid grid-cols-2 gap-x-3 gap-y-2'
} as const satisfies Record<NonNullable<RelicFilterGroupProps<string>['layout']>, string>

/** 체크박스 한 그룹. 항목 전체가 Label이라 글자를 눌러도 토글됩니다. */
function RelicFilterGroup<T extends string>({
	title,
	options,
	selected,
	onToggle,
	layout = 'one'
}: RelicFilterGroupProps<T>) {
	return (
		<fieldset className="flex min-w-0 flex-col gap-2">
			<legend className="text-grayscale-500 mb-2 text-xs font-medium">{title}</legend>
			<div className={GROUP_LAYOUT_CLASS[layout]}>
				{options.map(({ value, label }) => (
					<Label key={value} className="text-grayscale-800 min-w-0 gap-2 text-sm leading-snug font-normal">
						<Checkbox checked={selected.includes(value)} onCheckedChange={() => onToggle(value)} />
						<span className="min-w-0 break-keep">{label}</span>
					</Label>
				))}
			</div>
		</fieldset>
	)
}

type RelicFilterPopoverProps = {
	filter: RelicFilterState
	onFilterChange: (filter: RelicFilterState) => void
}

const GRADE_OPTIONS = RELIC_GRADE_ORDER.map((grade) => ({
	value: grade,
	label: RELIC_GRADE_META[grade].label
}))

/**
 * 유물 필터 Popover.
 * 그룹 안은 OR, 그룹 사이는 AND입니다. 선택 즉시 반영하며 상태는 부모가 가집니다.
 */
function RelicFilterPopover({ filter, onFilterChange }: RelicFilterPopoverProps) {
	const activeCount = countActiveRelicFilters(filter)

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button variant="outline" size="sm" className="text-grayscale-700 relative shrink-0 gap-1.5">
						<ListFilterIcon className="size-4" />
						필터
						{/* 뱃지를 모서리에 띄워 버튼 폭이 변하지 않게 합니다. (폭이 변하면 Popover 위치가 같이 움직임) */}
						{activeCount > 0 ? (
							<Badge
								aria-label={`선택한 필터 ${activeCount}개`}
								className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[10px] tabular-nums"
							>
								{activeCount}
							</Badge>
						) : null}
					</Button>
				}
			/>
			<PopoverContent
				align="end"
				className="max-h-[min(var(--available-height),32rem)] w-80 max-w-[calc(100vw-(--spacing(4)))] gap-3 p-4"
				collisionPadding={8}
			>
				<PopoverHeader className="flex-row items-center justify-between">
					<PopoverTitle className="text-sm">유물 필터</PopoverTitle>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						disabled={activeCount === 0}
						onClick={() => onFilterChange(INITIAL_RELIC_FILTER)}
					>
						초기화
					</Button>
				</PopoverHeader>

				{/* 팝오버 높이를 뷰포트 안의 남는 공간(--available-height)으로 제한하고, 넘치는 항목은 내부 스크롤 */}
				<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
					<RelicFilterGroup
						title="등급"
						options={GRADE_OPTIONS}
						selected={filter.grades}
						layout="row"
						onToggle={(grade) => onFilterChange({ ...filter, grades: toggleFilterValue(filter.grades, grade) })}
					/>
					<RelicFilterGroup
						title="특수 옵션"
						options={RELIC_CONTENT_OPTIONS}
						selected={filter.contents}
						onToggle={(content) => onFilterChange({ ...filter, contents: toggleFilterValue(filter.contents, content) })}
						layout="two"
					/>
					<RelicFilterGroup
						title="효과 종류 (장착 효과 기준)"
						options={RELIC_EFFECT_CATEGORY_OPTIONS}
						selected={filter.categories}
						onToggle={(category) =>
							onFilterChange({ ...filter, categories: toggleFilterValue(filter.categories, category) })
						}
						layout="two"
					/>
					<RelicFilterGroup
						title="기타 옵션"
						options={RELIC_TAG_OPTIONS}
						selected={filter.tags}
						onToggle={(tag) => onFilterChange({ ...filter, tags: toggleFilterValue(filter.tags, tag) })}
					/>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default RelicFilterPopover
