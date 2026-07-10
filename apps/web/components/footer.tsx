// 사이트 하단 공통 푸터 — 외부 참고 링크와 저작권 문구를 표시한다.
const FOOTER_LINKS = [
	{
		label: '공식 사이트',
		href: 'https://forum.nexon.com/maplestoryidle-kr/'
	},
	{
		label: '메키 갤러리',
		href: 'https://gall.dcinside.com/mgallery/board/lists/?id=maplerpg'
	}
] as const

function Footer() {
	return (
		<footer className="shadow-soft mt-auto border-t border-white/40 bg-white/85 backdrop-blur-md">
			<div className="max-w-content container mx-auto flex w-full flex-col gap-4 px-4 py-6 md:px-6">
				<nav aria-label="관련 링크" className="flex flex-wrap items-center gap-x-6 gap-y-2">
					{FOOTER_LINKS.map((link) => (
						<a
							key={link.href}
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							className="text-grayscale-600 hover:text-grayscale-900 text-sm font-medium transition-colors"
						>
							{link.label}
						</a>
					))}
				</nav>

				<p className="text-grayscale-400 text-xs">2026 G-NooN All Rights Reserved.</p>
			</div>
		</footer>
	)
}

export default Footer
