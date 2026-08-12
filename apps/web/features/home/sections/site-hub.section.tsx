import { Card, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'
import { cn } from '@shared/ui/utils'
import { BookOpenIcon, ChevronRightIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'

const HUB_ENTRIES = [
	{
		href: '/guild',
		title: '길드 정보',
		description: '길드 현황·1 vs 1 내전 결과를 확인합니다. 비밀번호를 모르신다구요? 저리 가세요.',
		icon: UsersIcon
	},
	{
		href: '/tips',
		title: '정보 / 팁',
		description: '동료·유물·스테이지 등 길드 운영과 성장에 도움이 되는 참고 자료입니다.',
		icon: BookOpenIcon
	}
] as const

/** 사이트 진입 허브 — 길드 정보와 정보/팁을 큰 카드로 나눕니다. */
function SiteHubSection() {
	return (
		<section className="flex w-full min-w-0 flex-1 flex-col justify-center gap-8 py-6 md:gap-10 md:py-10">
			<header className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">메이플키우기 1서버 게임즈 길드입니다.</h1>
				<p className="text-grayscale-600 max-w-xl text-sm md:text-base">원하시는 공간을 선택해 주세요.</p>
			</header>

			<div className="mx-auto grid w-full max-w-3xl gap-4 md:grid-cols-2 md:gap-6">
				{HUB_ENTRIES.map((entry) => {
					const Icon = entry.icon

					return (
						<Link
							key={entry.href}
							href={entry.href}
							className={cn(
								'group focus-visible:ring-grayscale-900 block cursor-pointer rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'
							)}
						>
							<Card
								className={cn(
									'border-grayscale-200 shadow-soft h-full transition-colors',
									'hover:border-grayscale-300 group-hover:bg-grayscale-50/50'
								)}
							>
								<CardHeader className="gap-3 p-6 md:gap-4 md:p-8">
									<div className="flex items-start justify-between gap-3">
										<span className="bg-grayscale-100 text-grayscale-700 flex size-11 items-center justify-center rounded-xl md:size-12">
											<Icon className="size-5 md:size-6" aria-hidden />
										</span>
										<ChevronRightIcon className="text-grayscale-400 group-hover:text-grayscale-600 size-5 shrink-0 transition-colors" />
									</div>
									<CardTitle className="text-grayscale-900 text-xl font-semibold md:text-2xl">{entry.title}</CardTitle>
									<CardDescription className="text-grayscale-600 text-sm md:text-base">
										{entry.description}
									</CardDescription>
								</CardHeader>
							</Card>
						</Link>
					)
				})}
			</div>
		</section>
	)
}

export default SiteHubSection
