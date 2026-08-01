import { Badge } from '@shared/ui/badge'
import { buttonVariants } from '@shared/ui/button'
import { cn } from '@shared/ui/utils'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

import LinkPendingHint from '@/components/link-pending-hint'
import TipsBackLink from '@/features/tips/components/tips-back-link'

type ConsultingHubHeaderProps = {
	badge: string
	title: string
	description: string
	newHref: string
}

/**
 * 컨설팅 허브의 고정 헤더(서버 컴포넌트).
 * Suspense 바깥에 두어 DB 목록이 오기 전에 제목·CTA를 먼저 보여 줍니다.
 */
function ConsultingHubHeader({ badge, title, description, newHref }: ConsultingHubHeaderProps) {
	return (
		<div className="flex flex-col gap-3">
			<TipsBackLink href="/tips">정보 / 팁 목록</TipsBackLink>

			<header className="flex flex-col gap-2">
				<Badge variant="secondary" className="w-fit">
					{badge}
				</Badge>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div className="space-y-2">
						<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">{title}</h1>
						<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">{description}</p>
					</div>
					<Link href={newHref} className={cn(buttonVariants(), 'inline-flex shrink-0 items-center gap-1.5')}>
						<PlusIcon className="size-4" />
						컨설팅 요청하기
						<LinkPendingHint className="text-primary-foreground" />
					</Link>
				</div>
			</header>
		</div>
	)
}

export default ConsultingHubHeader
