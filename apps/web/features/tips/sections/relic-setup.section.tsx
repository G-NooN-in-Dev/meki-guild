'use client'

import { Badge } from '@shared/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'

import RelicEffectTable from '@/features/tips/components/relic-effect-table'
import RelicSetupSimulator from '@/features/tips/components/relic-setup-simulator'
import TipsBackLink from '@/features/tips/components/tips-back-link'
import { getTipTagsBySlug } from '@/features/tips/lib/tips-registry.constants'

/**
 * 유물 장착 효과 정보 페이지.
 * 효과 표 / 세팅 보드 탭으로 유물·잠재 정보를 비교할 수 있습니다.
 */
function RelicSetupSection() {
	const tags = getTipTagsBySlug('relic-setup')

	return (
		<section className="flex w-full min-w-0 flex-col gap-6 md:gap-8">
			<div className="flex flex-col gap-3">
				<TipsBackLink href="/tips">정보 / 팁 목록</TipsBackLink>

				<header className="flex flex-col gap-2">
					<div className="flex flex-wrap gap-1.5">
						{tags.map((tag) => (
							<Badge key={tag} variant="secondary">
								{tag}
							</Badge>
						))}
					</div>
					<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">유물 장착 효과</h1>
					<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">
						유물별 각성 효과와 잠재옵션을 확인하거나, 세팅 보드로 장착 합산을 시뮬레이션해 보세요.
					</p>
				</header>
			</div>

			<Tabs defaultValue="table" className="gap-4">
				<TabsList className="grid w-full max-w-md grid-cols-2">
					<TabsTrigger value="table">효과 표</TabsTrigger>
					<TabsTrigger value="simulation">세팅 보드</TabsTrigger>
				</TabsList>

				<TabsContent value="table" className="mt-0">
					<RelicEffectTable />
				</TabsContent>

				<TabsContent value="simulation" className="mt-0">
					<RelicSetupSimulator />
				</TabsContent>
			</Tabs>
		</section>
	)
}

export default RelicSetupSection
