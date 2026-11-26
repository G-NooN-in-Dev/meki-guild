import { buttonVariants } from '@shared/ui/button'
import { cn } from '@shared/ui/utils'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

import GuildDashboardChartCard from '@/features/guild/components/guild-dashboard-chart-card'
import { buildGuildDetailHref, GUILD_REGISTER_PATH } from '@/features/guild/lib/guild-detail-nav'
import type { GuildDashboardData } from '@/features/guild/types/guild-dashboard.type'

type GuildDashboardSectionProps = {
	data: GuildDashboardData
}

/** 길드 대시보드. 최근 3주 차트 카드 + 인원 변동. */
function GuildDashboardSection({ data }: GuildDashboardSectionProps) {
	return (
		<section className="flex w-full min-w-0 flex-col gap-6">
			<header className="flex flex-col gap-2">
				<div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
					<h1 className="text-grayscale-900 text-3xl font-semibold">길드 종합 현황</h1>
					<div className="flex shrink-0 flex-wrap items-center gap-2">
						<Link
							href={GUILD_REGISTER_PATH}
							className={cn(
								buttonVariants({ variant: 'default', size: 'default' }),
								'bg-pastel-navy hover:bg-pastel-navy-700 gap-1.5 rounded-lg'
							)}
						>
							<PlusIcon className="size-4" />
							데이터 등록
						</Link>
						<Link
							href={buildGuildDetailHref()}
							className={cn(
								buttonVariants({ variant: 'outline', size: 'default' }),
								'border-pastel-navy-300 text-pastel-navy-800 hover:bg-pastel-navy-50 rounded-lg',
								'dark:border-pastel-navy-500 dark:bg-pastel-navy-950 dark:text-pastel-navy-100 dark:hover:bg-pastel-navy-900'
							)}
						>
							상세 보기
						</Link>
					</div>
				</div>
			</header>

			<div className="grid w-full min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
				{data.cards.map((card) => (
					<GuildDashboardChartCard key={card.id} card={card} />
				))}
			</div>
		</section>
	)
}

export default GuildDashboardSection
