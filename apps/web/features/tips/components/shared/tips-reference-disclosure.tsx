'use client'

import { Button } from '@shared/ui/button'
import { Card } from '@shared/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog'
import { cn } from '@shared/ui/utils'
import { ChevronDownIcon, CircleHelpIcon } from 'lucide-react'
import { type ReactNode } from 'react'

import useMediaQuery from '@/hooks/use-media-query'

/** 코딩 가이드 lg 기준 — 데스크탑 Collapsible / 미만 Dialog */
const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)'

type TipsReferenceDisclosureProps = {
	title: string
	description: string
	children: ReactNode
}

const triggerClassName = cn(
	'group flex w-full cursor-pointer items-center justify-between bg-transparent px-4 py-3 text-left md:py-4',
	'text-grayscale-900 text-base font-semibold md:text-lg',
	'focus-visible:ring-grayscale-900 rounded-md focus-visible:ring-2 focus-visible:outline-none'
)

/**
 * tips 보조 참고 표용 Disclosure.
 * lg+: Collapsible(기본 접힘) / 그 미만: Dialog — 본문 스크롤을 줄입니다.
 */
function TipsReferenceDisclosure({ title, description, children }: TipsReferenceDisclosureProps) {
	const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY)

	if (isDesktop) {
		return (
			<Card size="sm" className="border-grayscale-200 shadow-soft data-[size=sm]:gap-0 data-[size=sm]:py-0">
				<Collapsible className="flex flex-col">
					<CollapsibleTrigger className={triggerClassName}>
						{title}
						<ChevronDownIcon
							aria-hidden
							className="size-4 shrink-0 transition-transform duration-200 group-aria-expanded:rotate-180"
						/>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<div className="border-grayscale-200 flex flex-col gap-3 border-t px-4 py-3 md:py-4">
							<p className="text-grayscale-600 text-sm break-keep md:text-base">{description}</p>
							{children}
						</div>
					</CollapsibleContent>
				</Collapsible>
			</Card>
		)
	}

	return (
		<Dialog>
			<DialogTrigger
				render={
					<Button
						variant="outline"
						className="border-grayscale-200 text-grayscale-900 shadow-soft h-auto w-full justify-between gap-2 rounded-xl px-4 py-3 text-left text-base font-semibold"
						aria-label={title}
					>
						<span className="flex min-w-0 items-center gap-1.5">
							<CircleHelpIcon className="text-grayscale-500 size-4 shrink-0" />
							{title}
						</span>
						<ChevronDownIcon className="text-grayscale-400 size-4 shrink-0" />
					</Button>
				}
			/>
			<DialogContent className="max-h-[90dvh] max-w-[calc(100%-(--spacing(4)))] gap-4 overflow-hidden p-4 sm:max-w-lg sm:gap-6 sm:p-6">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription className="text-grayscale-600 break-keep">{description}</DialogDescription>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	)
}

export default TipsReferenceDisclosure
