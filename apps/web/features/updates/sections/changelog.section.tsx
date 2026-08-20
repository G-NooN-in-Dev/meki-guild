import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@shared/ui/empty'
import { cn } from '@shared/ui/utils'
import { ClipboardListIcon } from 'lucide-react'

import ChangelogEntryCard from '@/features/updates/components/changelog-entry-card'
import { CHANGELOG_ENTRIES } from '@/features/updates/lib/changelog.constants'

/**
 * 업데이트 일지 — 최신 버전이 위인 세로 타임라인.
 * 왼쪽 점·선으로 순서를 읽고, 오른쪽 카드에 구역별 변경을 둡니다.
 */
function ChangelogSection() {
	const hasEntries = CHANGELOG_ENTRIES.length > 0

	return (
		<section className="flex w-full min-w-0 flex-col gap-6 md:gap-8">
			<header className="flex flex-col gap-2">
				<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">업데이트 일지</h1>
				<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">사이트에 반영된 변경 사항 이력입니다.</p>
			</header>

			{hasEntries ? (
				<ol className="relative flex flex-col">
					{CHANGELOG_ENTRIES.map((entry, index) => {
						const isLatest = index === 0
						const isLast = index === CHANGELOG_ENTRIES.length - 1

						return (
							<li key={`${entry.version}-${entry.date}`} className="relative flex gap-4 md:gap-5">
								{/* 타임라인 축: 점 + 다음 항목까지 이어지는 선 */}
								<div className="relative flex w-3 shrink-0 flex-col items-center md:w-4" aria-hidden>
									<span
										className={cn(
											'border-grayscale-300 mt-5 size-2.5 shrink-0 rounded-full border-2 bg-white md:mt-6 md:size-3',
											isLatest && 'border-grayscale-900 bg-grayscale-900'
										)}
									/>
									{isLast ? null : <span className="bg-grayscale-200 mt-1 w-px flex-1" />}
								</div>

								<div className={cn('min-w-0 flex-1', isLast ? 'pb-0' : 'pb-5 md:pb-6')}>
									<ChangelogEntryCard entry={entry} isLatest={isLatest} />
								</div>
							</li>
						)
					})}
				</ol>
			) : (
				<Empty className="border-grayscale-200 bg-card/50 shadow-soft border border-dashed">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<ClipboardListIcon />
						</EmptyMedia>
						<EmptyTitle>아직 등록된 업데이트가 없습니다</EmptyTitle>
						<EmptyDescription>버전이 올라가면 이 목록에 변경 사항이 쌓입니다.</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}
		</section>
	)
}

export default ChangelogSection
