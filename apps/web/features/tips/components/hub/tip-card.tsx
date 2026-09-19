import { Card, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'
import { cn } from '@shared/ui/utils'
import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'

import type { TipEntry } from '@/features/tips/types/tip.type'

type TipCardProps = {
	tip: TipEntry
}

/** 정보/팁 허브에서 상세 페이지로 이동하는 링크 카드.
 * 좁은 화면은 2줄, 데스크탑은 1줄로 맞춰 카드 높이를 일정하게 유지합니다.
 */
function TipCard({ tip }: TipCardProps) {
	const { href, title, description } = tip

	return (
		<Link
			href={href}
			className={cn(
				'group focus-visible:ring-grayscale-900 block h-full cursor-pointer rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
			)}
		>
			<Card
				size="sm"
				className="border-grayscale-200 shadow-soft hover:border-grayscale-300 group-hover:bg-grayscale-50/50 h-full transition-colors"
			>
				<CardHeader className="gap-2">
					<div className="flex items-center justify-between gap-3">
						<CardTitle className="text-grayscale-900 line-clamp-1 min-h-7 min-w-0 text-lg leading-7 font-semibold">
							{title}
						</CardTitle>
						<ChevronRightIcon className="text-grayscale-400 group-hover:text-grayscale-600 size-4 shrink-0 transition-colors" />
					</div>
					<CardDescription className="text-grayscale-600 line-clamp-2 min-h-10 leading-5 md:line-clamp-1 md:min-h-5">
						{description}
					</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	)
}

export default TipCard
