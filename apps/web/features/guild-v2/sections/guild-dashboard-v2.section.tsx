import { buttonVariants } from '@shared/ui/button'
import { cn } from '@shared/ui/utils'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'

import GuildDashboardChartCard from '@/features/guild-v2/components/guild-dashboard-chart-card'
import { buildGuildDetailHref, GUILD_REGISTER_PATH } from '@/features/guild-v2/lib/guild-detail-nav'
import type { GuildV2DashboardData } from '@/features/guild-v2/types/guild-v2-dashboard.type'

type GuildDashboardV2SectionProps = {
	data: GuildV2DashboardData
}

/**
 * 길드 정보 v2 대시보드.
 * 최근 3주 차트 카드 + 인원 변동. 운영 `/guild` UI와 분리됩니다.
 */
function GuildDashboardV2Section({ data }: GuildDashboardV2SectionProps) {
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
								'border-pastel-navy-300 text-pastel-navy-800 hover:bg-pastel-navy-50 rounded-lg'
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

export default GuildDashboardV2Section
