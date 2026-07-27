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
	return (
		<Link
			href={tip.href}
			className={cn(
				'group focus-visible:ring-grayscale-900 block cursor-pointer rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
			)}
		>
			<Card
				size="sm"
				className="border-grayscale-200 shadow-soft hover:border-grayscale-300 group-hover:bg-grayscale-50/50 h-full transition-colors"
			>
				<CardHeader className="gap-2">
					<div className="flex items-start justify-between gap-3">
						<Badge variant="secondary">{tip.category}</Badge>
						<LinkPendingIcon>
							<ChevronRightIcon className="text-grayscale-400 group-hover:text-grayscale-600 size-4 transition-colors" />
						</LinkPendingIcon>
					</div>
					<CardTitle className="text-grayscale-900 text-lg font-semibold">{tip.title}</CardTitle>
					<CardDescription className="text-grayscale-600">{tip.description}</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	)
}

export default TipCard
