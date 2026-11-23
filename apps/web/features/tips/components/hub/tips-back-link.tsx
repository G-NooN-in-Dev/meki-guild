import { cn } from '@shared/ui/utils'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type TipsBackLinkProps = {
	href: string
	children: ReactNode
	className?: string
	onClick?: ComponentProps<typeof Link>['onClick']
}

/**
 * tips 하위 페이지 공통 뒤로가기 링크.
 * 아이콘·스타일을 한곳에서 맞춥니다.
 */
function TipsBackLink({ href, children, className, onClick }: TipsBackLinkProps) {
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
		</Link>
	)
}

export default TipsBackLink
