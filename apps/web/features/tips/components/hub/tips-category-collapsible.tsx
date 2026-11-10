'use client'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { cn } from '@shared/ui/utils'
import { ChevronDownIcon } from 'lucide-react'
import { type FocusEvent, useState } from 'react'

import TipCard from '@/features/tips/components/hub/tip-card'
import type { TipCategory, TipCategoryGroup, TipEntry } from '@/features/tips/types/tip.type'
import useMediaQuery from '@/hooks/use-media-query'

/** 카테고리 그리드가 시작되는 구간과 맞춤 */
const DESKTOP_MEDIA_QUERY = '(min-width: 768px)'

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
	isDesktop: boolean
}

function TipCardList({ tips }: { tips: readonly TipEntry[] }) {
	return (
		<ul className="grid grid-cols-2 gap-4 rounded-md bg-transparent p-3 md:flex md:flex-col">
			{tips.map((tip) => (
				<li key={tip.slug} className="h-full">
					<TipCard tip={tip} />
				</li>
			))}
		</ul>
	)
}

/** 모바일: 클릭 토글·기본 펼침 (hover 로직 없음) */
function MobileTipCategoryCollapsible({ category, tips }: Omit<TipCategoryCollapsibleItemProps, 'isDesktop'>) {
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

/** 데스크탑: 트리거 hover/focus로 열고, 영역 leave/blur로 닫음 */
function DesktopTipCategoryCollapsible({ category, tips }: Omit<TipCategoryCollapsibleItemProps, 'isDesktop'>) {
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
			className="flex min-w-0 flex-col self-start"
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

function TipCategoryCollapsibleItem({ category, tips, isDesktop }: TipCategoryCollapsibleItemProps) {
	if (isDesktop) {
		return <DesktopTipCategoryCollapsible category={category} tips={tips} />
	}

	return <MobileTipCategoryCollapsible category={category} tips={tips} />
}

/**
 * 카테고리별 독립 Collapsible.
 * 모바일: 카테고리 flex-col · tipCard 2열 / md+: 카테고리 2·3열 · tipCard 세로 나열.
 */
function TipsCategoryCollapsible({ groups }: TipsCategoryCollapsibleProps) {
	const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY)

	return (
		<div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:items-start md:gap-4 lg:grid-cols-3 lg:gap-6">
			{groups.map(({ category, tips }) => (
				<TipCategoryCollapsibleItem key={category.id} category={category} tips={tips} isDesktop={isDesktop} />
			))}
		</div>
	)
}

export default TipsCategoryCollapsible
