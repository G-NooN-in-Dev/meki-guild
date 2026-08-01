import { cn } from '@shared/ui/utils'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

import LinkPendingHint from '@/components/link-pending-hint'

type TipsBackLinkProps = {
	href: string
	children: ReactNode
	className?: string
	onClick?: ComponentProps<typeof Link>['onClick']
	/** pending 스피너 표시 여부. 폼 등에서 숨길 때 false */
	showPendingHint?: boolean
}

/**
 * tips 하위 페이지 공통 뒤로가기 링크.
 * 아이콘·스타일·pending 힌트를 한곳에서 맞춥니다.
 */
function TipsBackLink({ href, children, className, onClick, showPendingHint = true }: TipsBackLinkProps) {
	return (
		<Link
			href={href}
			onClick={onClick}
			className={cn(
				'text-grayscale-600 hover:text-grayscale-900 inline-flex w-fit items-center gap-1.5 text-sm font-medium transition-colors',
				className
			)}
		>
			<ArrowLeftIcon className="size-4" />
			{children}
			{showPendingHint ? <LinkPendingHint /> : null}
		</Link>
	)
}

export default TipsBackLink
