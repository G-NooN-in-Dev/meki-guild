import Link from 'next/link'

import BgmToggle from '@/components/bgm-toggle'
import Nav, { MobileNav } from '@/components/nav'
import { formatAppVersionLabel } from '@/libs/app-version.constants'

function Header() {
	return (
		<header className="shadow-soft z-sticky fixed inset-x-0 top-0 border-b border-white/40 bg-white/85 backdrop-blur-md">
			{/* min-w-0: 좁은 화면에서 브랜드+메뉴가 뷰포트를 넘기지 않도록 */}
			<div className="max-w-content container mx-auto flex h-14 w-full min-w-0 items-center gap-3 px-4 md:px-6 lg:gap-8">
				<div className="flex min-w-0 flex-1 items-center gap-2 lg:gap-8">
					<MobileNav />
					{/* 가로 메뉴는 lg부터 — 그 전에는 햄버거라 브랜드가 폭을 더 써도 됨 */}
					<Link href="/" className="text-grayscale-900 min-w-0 truncate text-base font-semibold md:text-lg lg:shrink-0">
						메이플키우기 게임즈 길드
					</Link>
					<Nav />
				</div>
				<div className="flex shrink-0 items-center gap-2 md:gap-3">
					<span
						className="text-grayscale-400 shrink-0 text-xs font-medium tabular-nums md:text-sm"
						aria-label={`현재 버전 ${formatAppVersionLabel()}`}
					>
						{formatAppVersionLabel()}
					</span>
					{/* 허브에서는 모바일 메뉴가 없어 헤더에서 항상 BGM을 노출합니다 */}
					<BgmToggle />
				</div>
			</div>
		</header>
	)
}

export default Header
