'use client'

import { Button } from '@shared/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@shared/ui/collapsible'
import { cn } from '@shared/ui/lib/utils'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { ChevronDownIcon, MenuIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import LinkPendingHint from '@/components/link-pending-hint'
import { TIP_ENTRIES } from '@/features/tips/lib/tips-registry.constants'

type NavChildLink = {
	href: string
	label: string
}

type NavLinkItem = {
	type: 'link'
	href: string
	label: string
	/** 있으면 모바일 Sheet에서만 하위 링크로 표시 */
	children?: readonly NavChildLink[]
}

type NavComingSoonItem = {
	type: 'coming-soon'
	label: string
}

type NavItem = NavLinkItem | NavComingSoonItem

/** 메뉴 추가 시 여기만 확장하면 인라인·모바일 Sheet에 함께 반영됩니다 */
export const NAV_ITEMS: NavItem[] = [
	{ type: 'link', href: '/', label: '메인' },
	{ type: 'link', href: '/compare', label: '1 vs 1 비교' },
	{
		type: 'link',
		href: '/tips',
		label: '정보/팁',
		// 팁 허브 레지스트리와 동기화 — 새 팁 추가 시 모바일 하위 메뉴도 함께 갱신됩니다
		children: TIP_ENTRIES.map((tip) => ({
			href: tip.href,
			label: tip.title
		}))
	}
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

/**
 * Sheet를 링크 클릭과 동시에 닫으면 포커스 트랩이 라우팅을 가로챌 수 있어
 * 다음 프레임으로 미룹니다.
 */
function closeSheetAfterNavigate(onNavigate?: () => void) {
	requestAnimationFrame(() => {
		onNavigate?.()
	})
}

/** 모바일 Sheet 전용 — 부모 링크 + 펼칠 수 있는 하위 메뉴 */
function MobileNavGroup({
	item,
	onNavigate
}: {
	item: NavLinkItem & { children: readonly NavChildLink[] }
	onNavigate?: () => void
}) {
	const pathname = usePathname()
	const parentActive = isNavActive(pathname, item.href)
	// 정보/팁 경로에 있으면 기본으로 펼쳐 하위 메뉴를 바로 보이게 합니다
	const [open, setOpen] = useState(parentActive)
	const [seenPathname, setSeenPathname] = useState(pathname)

	// 경로가 팁 구간으로 바뀌면 렌더 중 펼침 상태를 맞춤 (effect setState 린트 회피)
	if (pathname !== seenPathname) {
		setSeenPathname(pathname)
		if (isNavActive(pathname, item.href)) {
			setOpen(true)
		}
	}

	return (
		<Collapsible open={open} onOpenChange={setOpen} className="flex flex-col">
			<div className="flex items-center gap-0.5">
				<Link
					href={item.href}
					onClick={() => closeSheetAfterNavigate(onNavigate)}
					className={cn(
						'hover:bg-grayscale-50 inline-flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-3 py-2.5 transition-colors',
						parentActive ? 'text-grayscale-900 bg-grayscale-50 font-semibold' : 'hover:text-grayscale-900'
					)}
				>
					{item.label}
					<LinkPendingHint />
				</Link>
				<CollapsibleTrigger
					aria-label={`${item.label} 하위 메뉴 ${open ? '접기' : '펼치기'}`}
					className={cn(
						'text-grayscale-500 hover:bg-grayscale-50 hover:text-grayscale-900 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors',
						'focus-visible:ring-grayscale-900 focus-visible:ring-2 focus-visible:outline-none'
					)}
				>
					<ChevronDownIcon className={cn('size-4 transition-transform', open && 'rotate-180')} />
				</CollapsibleTrigger>
			</div>

			<CollapsibleContent className="flex flex-col gap-0.5 pb-1 pl-3">
				{item.children.map((child) => {
					const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`)

					return (
						<Link
							key={child.href}
							href={child.href}
							onClick={() => closeSheetAfterNavigate(onNavigate)}
							className={cn(
								'hover:bg-grayscale-50 inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm transition-colors',
								childActive
									? 'text-grayscale-900 bg-grayscale-50 font-semibold'
									: 'text-grayscale-600 hover:text-grayscale-900'
							)}
						>
							{child.label}
							<LinkPendingHint />
						</Link>
					)
				})}
			</CollapsibleContent>
		</Collapsible>
	)
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

				// 모바일 Sheet에서만 하위 메뉴를 펼칩니다
				if (isVertical && item.children && item.children.length > 0) {
					return <MobileNavGroup key={item.href} item={{ ...item, children: item.children }} onNavigate={onNavigate} />
				}

				const active = isNavActive(pathname, item.href)

				return (
					<Link
						key={item.href}
						href={item.href}
						onClick={() => {
							if (isVertical) {
								closeSheetAfterNavigate(onNavigate)
								return
							}
							onNavigate?.()
						}}
						className={cn(
							'relative inline-flex items-center gap-1.5 transition-colors',
							isVertical
								? cn(
										'hover:bg-grayscale-50 w-full rounded-md px-3 py-2.5',
										active ? 'text-grayscale-900 bg-grayscale-50 font-semibold' : 'hover:text-grayscale-900'
									)
								: active
									? 'text-grayscale-900 after:bg-grayscale-900 font-semibold after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:mt-1 after:block after:h-0.5 after:content-[""]'
									: 'hover:text-grayscale-900'
						)}
					>
						{item.label}
						<LinkPendingHint />
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

export type { NavItem }
