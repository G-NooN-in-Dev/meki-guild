import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import {
	getJobClassLine,
	JOB_CLASS_LINE_ORDER,
	type JobClassLine,
	JOBS_BY_CLASS_LINE
} from '@/libs/job-class.constants'

type JobDistributionRow = {
	classLine: JobClassLine | '미분류'
	job: string
	/** 이번 주 인원 (이탈 제외) */
	count: number
	/** 직전 주 인원 (신규 제외). 직업 변경·가입·이탈을 반영합니다 */
	previousCount: number
}

type JobDistribution = {
	totalMembers: number
	rows: JobDistributionRow[]
}

/**
 * 이번 주·직전 주 길드원 직업 분포를 집계합니다.
 * 정의된 직업은 인원 0이어도 포함하고, 이탈(left)은 이번 주에서만 제외합니다.
 */
function calculateJobDistribution(comparisons: GuildMemberComparison[]): JobDistribution {
	const counts = new Map<string, number>()
	const previousCounts = new Map<string, number>()

	for (const comparison of comparisons) {
		// 이번 주: 남아 있는 멤버만 (이탈 제외)
		if (comparison.status !== 'left') {
			counts.set(comparison.job, (counts.get(comparison.job) ?? 0) + 1)
		}

		// 직전 주: 그때 길드에 있던 멤버만 (신규 제외)
		if (comparison.status !== 'new') {
			const previousJob = comparison.previousJob ?? comparison.job
			previousCounts.set(previousJob, (previousCounts.get(previousJob) ?? 0) + 1)
		}
	}

	const rows: JobDistributionRow[] = []
	const knownJobs = new Set<string>()

	for (const classLine of JOB_CLASS_LINE_ORDER) {
		for (const job of JOBS_BY_CLASS_LINE[classLine]) {
			knownJobs.add(job)
			rows.push({
				classLine,
				job,
				count: counts.get(job) ?? 0,
				previousCount: previousCounts.get(job) ?? 0
			})
		}
	}

	// 매핑에 없는 직업(미분류) — 이번 주·직전 주 모두 포함
	const unclassifiedJobs = new Set([...counts.keys(), ...previousCounts.keys()])

	for (const job of unclassifiedJobs) {
		if (knownJobs.has(job) || getJobClassLine(job)) {
			continue
		}

		rows.push({
			classLine: '미분류',
			job,
			count: counts.get(job) ?? 0,
			previousCount: previousCounts.get(job) ?? 0
		})
	}

	return {
		totalMembers: [...counts.values()].reduce((sum, count) => sum + count, 0),
		rows
	}
}

type JobCountSortDirection = 'asc' | 'desc'

function sortJobDistributionRows(rows: JobDistributionRow[], direction: JobCountSortDirection): JobDistributionRow[] {
	return [...rows].sort((left, right) => {
		if (left.count === right.count) {
			return left.job.localeCompare(right.job, 'ko')
		}

		return direction === 'desc' ? right.count - left.count : left.count - right.count
	})
}

export { calculateJobDistribution, sortJobDistributionRows }
export type { JobCountSortDirection, JobDistribution, JobDistributionRow }
