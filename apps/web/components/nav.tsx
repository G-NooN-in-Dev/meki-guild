'use client'

import { cn } from '@shared/ui/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type NavLinkItem = {
	type: 'link'
	href: string
	label: string
}

type NavComingSoonItem = {
	type: 'coming-soon'
	label: string
}

type NavItem = NavLinkItem | NavComingSoonItem

const NAV_ITEMS: NavItem[] = [
	{ type: 'link', href: '/', label: '메인' },
	{ type: 'coming-soon', label: '1 vs 1 비교' }
]

function isNavActive(pathname: string, href: string) {
	if (href === '/') {
		return pathname === '/'
	}

	return pathname === href || pathname.startsWith(`${href}/`)
}

function Nav() {
	const pathname = usePathname()

	return (
		<nav className="text-grayscale-500 flex items-center gap-6 text-base font-medium md:text-lg">
			{NAV_ITEMS.map((item) => {
				if (item.type === 'coming-soon') {
					return (
						<button
							key={item.label}
							type="button"
							onClick={() => window.alert('개발 예정입니다')}
							className="hover:text-grayscale-900 cursor-pointer transition-colors"
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
						className={cn(
							'relative inline-block transition-colors',
							active
								? 'text-grayscale-900 after:bg-grayscale-900 font-semibold after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:mt-1 after:block after:h-0.5 after:content-[""]'
								: 'hover:text-grayscale-900'
						)}
					>
						{item.label}
					</Link>
				)
			})}
		</nav>
	)
}

export default Nav
