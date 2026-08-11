'use client'

import { Badge } from '@shared/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'
import { cn } from '@shared/ui/utils'
import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'

import { LinkPendingIcon } from '@/components/link-pending-hint'
import type { TipEntry } from '@/features/tips/types/tip.type'

type TipCardProps = {
	tip: TipEntry
}

/** 정보/팁 허브에서 상세 페이지로 이동하는 링크 카드 */
function TipCard({ tip }: TipCardProps) {
	const { href, tags, title, description, disabled } = tip

	const card = (
		<Card
			size="sm"
			className={cn(
				'border-grayscale-200 shadow-soft h-full transition-colors',
				disabled
					? 'bg-grayscale-50/80 cursor-not-allowed opacity-70'
					: 'hover:border-grayscale-300 group-hover:bg-grayscale-50/50'
			)}
		>
			<CardHeader className="gap-2">
				<div className="flex items-start justify-between gap-3">
					<div className="flex min-w-0 flex-wrap gap-1.5">
						{tags.map((tag) => (
							<Badge key={tag} variant="secondary">
								{tag}
							</Badge>
						))}
					</div>
					{disabled ? null : (
						<LinkPendingIcon>
							<ChevronRightIcon className="text-grayscale-400 group-hover:text-grayscale-600 size-4 shrink-0 transition-colors" />
						</LinkPendingIcon>
					)}
				</div>
				<CardTitle className="text-grayscale-900 text-lg font-semibold">{title}</CardTitle>
				<CardDescription className={cn(disabled ? 'text-grayscale-500' : 'text-grayscale-600')}>
					{description}
				</CardDescription>
			</CardHeader>
		</Card>
	)

	if (disabled) {
		return (
			<div aria-disabled="true" className="block rounded-xl" title="페이지 리뉴얼 진행중">
				{card}
			</div>
		)
	}

	return (
		<Link
			href={href}
			className={cn(
				'group focus-visible:ring-grayscale-900 block cursor-pointer rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
			)}
		>
			{card}
		</Link>
	)
}

export default TipCard
