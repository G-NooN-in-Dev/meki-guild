import { type ComponentProps } from 'react'

import { cn } from './lib/utils'

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
	// grayscale-100: 반투명·카드 배경 위에서 과하게 진하지 않은 기본 톤
	return <div data-slot="skeleton" className={cn('bg-grayscale-100 animate-pulse rounded-md', className)} {...props} />
}

export { Skeleton }
