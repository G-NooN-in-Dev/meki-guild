import Link from 'next/link'

import Nav from '@/components/nav'

function Header() {
	return (
		<header className="shadow-soft z-sticky fixed inset-x-0 top-0 border-b border-white/40 bg-white/85 backdrop-blur-md">
			<div className="max-w-content container mx-auto flex h-14 w-full items-center gap-6 px-4 md:gap-8 md:px-6">
				<Link href="/" className="text-grayscale-900 shrink-0 text-base font-semibold md:text-lg">
					메이플키우기 게임즈 길드
				</Link>
				<Nav />
			</div>
		</header>
	)
}

export default Header
