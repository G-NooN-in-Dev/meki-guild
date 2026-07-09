import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'
import { type ComponentProps, type MouseEventHandler } from 'react'

import { Button } from './button'
import { cn } from './lib/utils'

function Pagination({ className, ...props }: ComponentProps<'nav'>) {
	return (
		<nav
			role="navigation"
			aria-label="pagination"
			data-slot="pagination"
			className={cn('mx-auto flex w-full justify-center', className)}
			{...props}
		/>
	)
}

function PaginationContent({ className, ...props }: ComponentProps<'ul'>) {
	return <ul data-slot="pagination-content" className={cn('flex items-center gap-1', className)} {...props} />
}

function PaginationItem({ ...props }: ComponentProps<'li'>) {
	return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
	isActive?: boolean
} & Pick<ComponentProps<typeof Button>, 'size'> &
	ComponentProps<'a'>

function PaginationLink({ className, isActive, size = 'icon', onClick, ...props }: PaginationLinkProps) {
	// Base UI Button은 render로 <a>를 합성하므로 onClick은 Button에 연결해야 클릭이 동작합니다.
	const handleClick: ComponentProps<typeof Button>['onClick'] = onClick
		? (event) => {
				onClick(event as unknown as Parameters<MouseEventHandler<HTMLAnchorElement>>[0])
			}
		: undefined

	return (
		<Button
			variant={isActive ? 'outline' : 'ghost'}
			size={size}
			className={cn(className)}
			nativeButton={false}
			onClick={handleClick}
			render={
				<a aria-current={isActive ? 'page' : undefined} data-slot="pagination-link" data-active={isActive} {...props} />
			}
		/>
	)
}

function PaginationPrevious({
	className,
	text = 'Previous',
	...props
}: ComponentProps<typeof PaginationLink> & { text?: string }) {
	return (
		<PaginationLink aria-label="Go to previous page" size="default" className={cn('pl-2!', className)} {...props}>
			<ChevronLeftIcon data-icon="inline-start" />
			<span className="hidden sm:block">{text}</span>
		</PaginationLink>
	)
}

function PaginationNext({
	className,
	text = 'Next',
	...props
}: ComponentProps<typeof PaginationLink> & { text?: string }) {
	return (
		<PaginationLink aria-label="Go to next page" size="default" className={cn('pr-2!', className)} {...props}>
			<span className="hidden sm:block">{text}</span>
			<ChevronRightIcon data-icon="inline-end" />
		</PaginationLink>
	)
}

function PaginationEllipsis({ className, ...props }: ComponentProps<'span'>) {
	return (
		<span
			aria-hidden
			data-slot="pagination-ellipsis"
			className={cn("flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4", className)}
			{...props}
		>
			<MoreHorizontalIcon />
			<span className="sr-only">More pages</span>
		</span>
	)
}

export {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
}
