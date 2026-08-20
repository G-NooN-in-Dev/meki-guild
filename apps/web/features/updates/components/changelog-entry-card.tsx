import { Badge } from '@shared/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'
import { cn } from '@shared/ui/utils'

import ChangelogItemList from '@/features/updates/components/changelog-item-list'
import { formatChangelogDate } from '@/features/updates/lib/changelog.constants'
import type { ChangelogEntry } from '@/features/updates/types/changelog.type'
import { formatAppVersionLabel } from '@/libs/app-version.constants'

type ChangelogEntryCardProps = {
	entry: ChangelogEntry
	/** 목록 맨 위(최신) 버전인지 */
	isLatest: boolean
	className?: string
}

/** 버전 1건 — 요약·구역 제목·항목 */
function ChangelogEntryCard({ entry, isLatest, className }: ChangelogEntryCardProps) {
	const { version, date, summary, hotfix, sections } = entry

	return (
		<Card size="sm" className={cn('border-grayscale-200 shadow-soft', className)}>
			<CardHeader className="gap-2">
				<div className="flex flex-wrap items-center gap-2">
					<CardTitle className="text-grayscale-900 text-lg font-semibold tabular-nums">
						{formatAppVersionLabel(version)}
					</CardTitle>
					<time dateTime={date} className="text-grayscale-500 text-sm tabular-nums">
						{formatChangelogDate(date)}
					</time>
					{hotfix ? <Badge variant="destructive">HOTFIX</Badge> : null}
					{isLatest ? <Badge variant="secondary">현재</Badge> : null}
				</div>
				{summary ? (
					<CardDescription className="text-grayscale-600 text-sm md:text-base">{summary}</CardDescription>
				) : null}
			</CardHeader>

			<CardContent className="flex flex-col gap-5">
				{sections.map((section) => (
					<div key={section.title} className="flex flex-col gap-2">
						<h3 className="text-grayscale-900 text-sm font-semibold md:text-base">{section.title}</h3>
						<ChangelogItemList items={section.items} />
					</div>
				))}
			</CardContent>
		</Card>
	)
}

export default ChangelogEntryCard
