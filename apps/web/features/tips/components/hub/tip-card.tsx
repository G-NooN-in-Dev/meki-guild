import { Badge } from '@shared/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'
import { cn } from '@shared/ui/utils'
import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'

import type { TipEntry } from '@/features/tips/types/tip.type'

type TipCardProps = {
	tip: TipEntry
}

/** 정보/팁 허브에서 상세 페이지로 이동하는 링크 카드 */
function TipCard({ tip }: TipCardProps) {
	const { href, tags, title, description } = tip

	return (
		<Link
			href={href}
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
						<div className="flex min-w-0 flex-wrap gap-1.5">
							{tags.map((tag) => (
								<Badge key={tag} variant="secondary">
									{tag}
								</Badge>
							))}
						</div>
						<ChevronRightIcon className="text-grayscale-400 group-hover:text-grayscale-600 size-4 shrink-0 transition-colors" />
					</div>
					<CardTitle className="text-grayscale-900 text-lg font-semibold">{title}</CardTitle>
					<CardDescription className="text-grayscale-600">{description}</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	)
}

export default TipCard
