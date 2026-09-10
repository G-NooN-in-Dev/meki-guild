'use client'

import JobBadge from '@/features/guild/components/job-badge'
import { buildCompareRows, CompareRowItem } from '@/features/guild/components/member-compare-rows'
import MemberDisplayName from '@/features/guild/components/member-display-name'
import { type MemberRankings } from '@/features/guild/lib/compute-member-rankings'
import type { MemberVsMemberComparison } from '@/features/guild/types/guild-snapshot.type'

type MemberComparePanelProps = {
	comparison: MemberVsMemberComparison
	rankings: MemberRankings
}

function MemberSummaryCard({ role, name, job }: { role: '나' | '상대방'; name: string; job: string }) {
	return (
		<div className="border-grayscale-200 bg-card shadow-soft min-w-0 rounded-xl border p-3 text-center md:p-4">
			<p className="text-grayscale-500 text-[11px] md:text-xs">{role}</p>
			{/* 잠금 시 별칭 — 비교 로직의 name 키는 실명 그대로 */}
			<p className="text-grayscale-900 mt-1 truncate text-base font-semibold md:text-xl">
				<MemberDisplayName name={name} />
			</p>
			{/* 멤버 테이블·상세와 동일하게 직업별 색상 Badge로 표시 */}
			<div className="mt-1.5 flex justify-center">
				<JobBadge job={job} />
			</div>
		</div>
	)
}

function MemberComparePanel({ comparison, rankings }: MemberComparePanelProps) {
	const rows = buildCompareRows(comparison, rankings)

	return (
		<div className="flex flex-col gap-3 md:gap-4">
			{/* 모바일: 2열 카드 / 데스크탑: 나 | VS | 상대방 */}
			<div className="grid grid-cols-2 gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
				<MemberSummaryCard role="나" name={comparison.left.name} job={comparison.left.job} />

				<div className="text-grayscale-400 hidden items-center justify-center text-sm font-semibold md:flex md:px-2">
					VS
				</div>

				<MemberSummaryCard role="상대방" name={comparison.right.name} job={comparison.right.job} />
			</div>

			<div className="border-grayscale-200 bg-card shadow-soft overflow-hidden rounded-xl border">
				<div className="bg-card min-w-0">
					{rows.map((row) => (
						<CompareRowItem key={row.label} row={row} />
					))}
				</div>
			</div>
		</div>
	)
}

export default MemberComparePanel
