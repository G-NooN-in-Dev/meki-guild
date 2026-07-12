'use client'

import { Button } from '@shared/ui/button'
import { cn } from '@shared/ui/lib/utils'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { MenuIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

type NavLinkItem = {
	type: 'link'
	href: string
	label: string
}

type NavComingSoonItem = {
	type: 'coming-soon'
	label: string
}

export type NavItem = NavLinkItem | NavComingSoonItem

/** 메뉴 추가 시 여기만 확장하면 인라인·모바일 Sheet에 함께 반영됩니다 */
export const NAV_ITEMS: NavItem[] = [
	{ type: 'link', href: '/', label: '메인' },
	{ type: 'coming-soon', label: '1 vs 1 비교' }
]

function isNavActive(pathname: string, href: string) {
	if (href === '/') {
		return pathname === '/'
	}

	return pathname === href || pathname.startsWith(`${href}/`)
}

type NavItemsProps = {
	/** horizontal: 데스크탑 헤더 / vertical: 모바일 Sheet */
	orientation: 'horizontal' | 'vertical'
	/** Sheet에서 링크 이동 후 패널을 닫을 때 사용 */
	onNavigate?: () => void
}

/** 인라인·Sheet 공용 메뉴 항목 렌더 */
function NavItems({ orientation, onNavigate }: NavItemsProps) {
	const pathname = usePathname()
	const isVertical = orientation === 'vertical'

	return (
		<>
			{NAV_ITEMS.map((item) => {
				if (item.type === 'coming-soon') {
					return (
						<button
							key={item.label}
							type="button"
							onClick={() => {
								window.alert('개발 예정입니다')
								onNavigate?.()
							}}
							className={cn(
								'hover:text-grayscale-900 cursor-pointer text-left transition-colors',
								isVertical && 'hover:bg-grayscale-50 w-full rounded-md px-3 py-2.5'
							)}
						>
							{item.label}
						</button>
					)
				}

				const active = isNavActive(pathname, item.href)

				return (
					<Link
						key={item.href}
						href={item.href}
						onClick={() => onNavigate?.()}
						className={cn(
							'relative transition-colors',
							isVertical
								? cn(
										'hover:bg-grayscale-50 w-full rounded-md px-3 py-2.5',
										active ? 'text-grayscale-900 bg-grayscale-50 font-semibold' : 'hover:text-grayscale-900'
									)
								: cn(
										'inline-block',
										active
											? 'text-grayscale-900 after:bg-grayscale-900 font-semibold after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:mt-1 after:block after:h-0.5 after:content-[""]'
											: 'hover:text-grayscale-900'
									)
						)}
					>
						{item.label}
					</Link>
				)
			})}
		</>
	)
}

/** 데스크탑 헤더용 가로 메뉴 (md 이상) */
function Nav() {
	return (
		<nav className="text-grayscale-500 hidden items-center gap-6 text-base font-medium md:flex md:text-lg">
			<NavItems orientation="horizontal" />
		</nav>
	)
}

/** 모바일 햄버거 → 왼쪽 Sheet 메뉴 (md 미만) */
function MobileNav() {
	const [open, setOpen] = useState(false)

	return (
		<>
			{/* 헤더(z-sticky)가 Sheet 오버레이보다 위에 있어, 같은 버튼으로 열고 닫을 수 있음 */}
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				className="text-grayscale-700 shrink-0 md:hidden"
				aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
				aria-expanded={open}
				onClick={() => setOpen((current) => !current)}
			>
				{open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
			</Button>

			<Sheet open={open} onOpenChange={setOpen}>
				<SheetContent side="left" className="w-[min(100%,20rem)] gap-0 sm:max-w-xs">
					<SheetHeader className="border-border border-b">
						<SheetTitle>메뉴</SheetTitle>
						<SheetDescription hidden />
					</SheetHeader>
					<nav className="text-grayscale-600 flex flex-col gap-1 p-3 text-base font-medium">
						<NavItems orientation="vertical" onNavigate={() => setOpen(false)} />
					</nav>
				</SheetContent>
			</Sheet>
		</>
	)
}

export { MobileNav }
export default Nav
