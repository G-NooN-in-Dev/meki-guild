import { Card, CardContent } from '@shared/ui/card'
import { Skeleton } from '@shared/ui/skeleton'

/**
 * 상세 `[section]` 전환 중 본문 placeholder.
 * layout 셸(Marquee·탭)은 유지되고 children만 교체됩니다.
 */
function GuildDetailSectionSkeleton() {
	return (
		<div className="flex w-full min-w-0 flex-col gap-4" aria-hidden>
			<Card size="sm" className="min-w-0">
				<CardContent className="pt-4">
					<Skeleton className="h-52 w-full" />
				</CardContent>
			</Card>
			z
			<div className="flex min-w-0 flex-col gap-3">
				<div className="flex flex-wrap items-center justify-end gap-2">
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-8 w-20" />
				</div>

				<ul className="flex min-w-0 flex-col gap-2 lg:hidden">
					{Array.from({ length: 4 }, (_, index) => (
						<li key={index}>
							<Skeleton className="h-14 w-full" />
						</li>
					))}
				</ul>

				<div className="hidden min-w-0 gap-4 lg:grid lg:grid-cols-3">
					<Card size="sm" className="min-w-0 py-0 lg:col-span-1">
						<CardContent className="flex flex-col gap-2 p-2">
							{Array.from({ length: 6 }, (_, index) => (
								<Skeleton key={index} className="h-12 w-full" />
							))}
						</CardContent>
					</Card>
					<Card size="sm" className="min-w-0 lg:col-span-2">
						<CardContent className="pt-4">
							<Skeleton className="h-64 w-full" />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}

export default GuildDetailSectionSkeleton
