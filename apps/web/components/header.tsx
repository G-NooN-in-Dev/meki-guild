import Link from 'next/link'

import Nav, { MobileNav } from '@/components/nav'
import NameRevealUnlock from '@/features/guild/components/name-reveal-unlock'
import { formatAppVersionLabel } from '@/libs/app-version.constants'

function Header() {
	return (
		<header className="shadow-soft z-sticky fixed inset-x-0 top-0 border-b border-white/40 bg-white/85 backdrop-blur-md">
			{/* min-w-0: 좁은 화면에서 브랜드+메뉴가 뷰포트를 넘기지 않도록 */}
			<div className="max-w-content container mx-auto flex h-14 w-full min-w-0 items-center gap-3 px-4 md:gap-8 md:px-6">
				<div className="flex min-w-0 flex-1 items-center gap-2 md:gap-8">
					<MobileNav />
					<Link href="/" className="text-grayscale-900 min-w-0 truncate text-base font-semibold md:shrink-0 md:text-lg">
						메이플키우기 게임즈 길드
					</Link>
					<Nav />
				</div>
				<div className="flex shrink-0 items-center gap-2 md:gap-3">
					{/* 대외 공개 시 실명 가림 / 길드원 비밀번호로 해제 */}
					<NameRevealUnlock />
					<span
						className="text-grayscale-400 shrink-0 text-xs font-medium tabular-nums md:text-sm"
						aria-label={`현재 버전 ${formatAppVersionLabel()}`}
					>
						{formatAppVersionLabel()}
					</span>
				</div>
			</div>
		</header>
	)
}

export default Header
