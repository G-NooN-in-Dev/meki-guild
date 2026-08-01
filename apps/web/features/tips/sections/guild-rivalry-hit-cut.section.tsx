import { Badge } from '@shared/ui/badge'

import GuildRivalryHitCutSummary from '@/features/tips/components/guild-rivalry-hit-cut-summary'
import GuildRivalryHitCutTable from '@/features/tips/components/guild-rivalry-hit-cut-table'
import TipsBackLink from '@/features/tips/components/tips-back-link'

function GuildRivalryHitCutSection() {
	return (
		<section className="flex w-full min-w-0 flex-col gap-6 md:gap-8">
			<div className="flex flex-col gap-3">
				<TipsBackLink href="/tips">정보 / 팁 목록</TipsBackLink>

				<header className="flex flex-col gap-2">
					<Badge variant="secondary" className="w-fit">
						대항전
					</Badge>
					<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">대항전 명중컷 · 버프 스택</h1>
					<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">
						길드 대항전 단계별 필요 명중과, 잡몹 처치로 쌓이는 보스 데미지 증가 스택을 확인해보세요.
					</p>
				</header>
			</div>

			<GuildRivalryHitCutSummary />
			<GuildRivalryHitCutTable />
		</section>
	)
}

export default GuildRivalryHitCutSection
