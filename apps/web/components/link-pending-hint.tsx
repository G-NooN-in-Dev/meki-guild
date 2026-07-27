'use client'

import { Spinner } from '@shared/ui/spinner'
import { cn } from '@shared/ui/utils'
import { useLinkStatus } from 'next/link'
import { type ReactNode } from 'react'

type LinkPendingHintProps = {
	className?: string
}

/**
 * Link 자손에서만 동작합니다. 클릭 직후~라우트 전환 완료까지 Spinner를 보여
 * loading.tsx / Suspense가 뜨기 전 짧은 공백을 메웁니다.
 * 빠른 전환에서는 100ms delay로 깜빡임을 줄입니다.
 */
function LinkPendingHint({ className }: LinkPendingHintProps) {
	const { pending } = useLinkStatus()

	return (
		<span
			aria-hidden={!pending}
			className={cn(
				'inline-flex shrink-0 items-center justify-center overflow-hidden transition-[width,opacity,margin] duration-150',
				pending ? 'ml-0.5 size-3.5 opacity-100 delay-100' : 'size-0 opacity-0'
			)}
		>
			<Spinner className={cn('text-grayscale-500 size-3.5', className)} />
		</span>
	)
}

type LinkPendingIconProps = {
	/** pending이 아닐 때 보여줄 아이콘(화살표 등) */
	children: ReactNode
	className?: string
}

/** 목록·카드 trailing 아이콘을 pending 중 Spinner로 교체합니다(레이아웃 고정). */
function LinkPendingIcon({ children, className }: LinkPendingIconProps) {
	const { pending } = useLinkStatus()

	return (
		<span className={cn('relative inline-flex size-4 shrink-0 items-center justify-center', className)}>
			<span className={cn('inline-flex transition-opacity duration-150', pending && 'opacity-0')}>{children}</span>
			<Spinner
				aria-hidden={!pending}
				className={cn(
					'text-grayscale-500 absolute inset-0 size-4 opacity-0 transition-opacity duration-150',
					pending && 'opacity-100 delay-100'
				)}
			/>
		</span>
	)
}

export { LinkPendingIcon }
export default LinkPendingHint
