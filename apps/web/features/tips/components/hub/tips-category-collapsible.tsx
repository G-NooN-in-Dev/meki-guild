'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { cn } from '@shared/ui/utils'
import { ChevronDownIcon } from 'lucide-react'
import { type FocusEvent, useState } from 'react'

import TipCard from '@/features/tips/components/hub/tip-card'
import type { TipCategory, TipCategoryGroup, TipEntry } from '@/features/tips/types/tip.type'
import useMediaQuery from '@/hooks/use-media-query'

/**
 * hover 열기는 실제 마우스/트랙패드에만 적용.
 * 태블릿은 min-width 768px여도 터치라, 첫 탭 mouseenter→click이 열림/닫힘을 상쇄함.
 */
const HOVER_INTERACTION_QUERY = '(hover: hover) and (pointer: fine)'

const triggerClassName = cn(
	'group border-grayscale-300 shadow-soft flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border-2 bg-white p-3 text-left',
	'text-grayscale-900 text-lg font-semibold md:text-xl',
	'focus-visible:ring-grayscale-900 focus-visible:ring-2 focus-visible:outline-none'
)

type TipsCategoryCollapsibleProps = {
	groups: readonly TipCategoryGroup[]
}

type TipCategoryCollapsibleItemProps = {
	category: TipCategory
	tips: readonly TipEntry[]
	useHoverOpen: boolean
}

function TipCardList({ tips }: { tips: readonly TipEntry[] }) {
	return (
		<ul className="grid grid-cols-2 gap-4 rounded-md bg-transparent p-3 sm:flex sm:flex-col">
			{tips.map((tip) => (
				<li key={tip.slug} className="h-full">
					<TipCard tip={tip} />
				</li>
			))}
		</ul>
	)
}

/** 터치·좁은 포인터: 클릭 토글·기본 펼침 (hover 로직 없음) */
function MobileTipCategoryCollapsible({ category, tips }: Omit<TipCategoryCollapsibleItemProps, 'useHoverOpen'>) {
	const { label } = category

	return (
		<Collapsible defaultOpen className="flex min-w-0 flex-col">
			<CollapsibleTrigger className={triggerClassName}>
				{label}
				<ChevronDownIcon
					aria-hidden
					className="text-grayscale-400 size-4 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-180"
				/>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<TipCardList tips={tips} />
			</CollapsibleContent>
		</Collapsible>
	)
}

/** 마우스/트랙패드: 트리거 hover/focus로 열고, 영역 leave/blur로 닫음 */
function DesktopTipCategoryCollapsible({ category, tips }: Omit<TipCategoryCollapsibleItemProps, 'useHoverOpen'>) {
	const { label } = category
	const [open, setOpen] = useState(false)

	function handleTriggerMouseEnter() {
		setOpen(true)
	}

	function handleMouseLeave() {
		setOpen(false)
	}

	function handleTriggerFocus() {
		setOpen(true)
	}

	function handleBlur(event: FocusEvent<HTMLDivElement>) {
		if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
		setOpen(false)
	}

	return (
		<Collapsible
			open={open}
			onOpenChange={setOpen}
			onMouseLeave={handleMouseLeave}
			onBlur={handleBlur}
			className="flex w-full min-w-0 flex-col self-start"
		>
			<CollapsibleTrigger
				onMouseEnter={handleTriggerMouseEnter}
				onFocus={handleTriggerFocus}
				className={triggerClassName}
			>
				{label}
				<ChevronDownIcon
					aria-hidden
					className="text-grayscale-400 size-4 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-180"
				/>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<TipCardList tips={tips} />
			</CollapsibleContent>
		</Collapsible>
	)
}

function TipCategoryCollapsibleItem({ category, tips, useHoverOpen }: TipCategoryCollapsibleItemProps) {
	if (useHoverOpen) {
		return <DesktopTipCategoryCollapsible category={category} tips={tips} />
	}

	return <MobileTipCategoryCollapsible category={category} tips={tips} />
}

/**
 * 카테고리별 독립 Collapsible.
 * 레이아웃: 모바일 flex-col · tipCard 2열 / sm+: 카테고리 2·3열 · tipCard 세로 나열.
 * 상호작용: hover+fine pointer면 hover 열기, 그 외(태블릿 터치 포함)는 클릭 토글.
 */
function TipsCategoryCollapsible({ groups }: TipsCategoryCollapsibleProps) {
	const useHoverOpen = useMediaQuery(HOVER_INTERACTION_QUERY)

	return (
		<div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:items-start sm:gap-4 lg:grid-cols-3 lg:gap-6">
			{groups.map(({ category, tips }) => (
				<TipCategoryCollapsibleItem key={category.id} category={category} tips={tips} useHoverOpen={useHoverOpen} />
			))}
		</div>
	)
}

export default TipsCategoryCollapsible
