import { type PropsWithChildren } from 'react'

/** 컨설팅 등 본문 페이지의 공통 폭·여백 셸 */
function PageShell({ children }: PropsWithChildren) {
	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col px-4 py-8 md:px-6">{children}</div>
			</main>
		</div>
	)
}

export default PageShell
