import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import {
	getJobClassLine,
	JOB_CLASS_LINE_ORDER,
	JOBS_BY_CLASS_LINE,
	type JobClassLine
} from '@/libs/job-class.constants'

export type JobDistributionRow = {
	classLine: JobClassLine | '미분류'
	job: string
	count: number
}

export type JobDistribution = {
	totalMembers: number
	rows: JobDistributionRow[]
}

/**
 * 이번 주 길드원 직업 분포를 집계합니다.
 * 정의된 직업은 인원 0이어도 포함하고, 이탈(left) 멤버는 제외합니다.
 */
export function calculateJobDistribution(comparisons: GuildMemberComparison[]): JobDistribution {
	const counts = new Map<string, number>()

	for (const comparison of comparisons) {
		if (comparison.status === 'left') {
			continue
		}

		counts.set(comparison.job, (counts.get(comparison.job) ?? 0) + 1)
	}

	const rows: JobDistributionRow[] = []

	for (const classLine of JOB_CLASS_LINE_ORDER) {
		for (const job of JOBS_BY_CLASS_LINE[classLine]) {
			rows.push({
				classLine,
				job,
				count: counts.get(job) ?? 0
			})
		}
	}

	// 매핑에 없는 직업(미분류)은 별도 행으로 추가
	for (const [job, count] of counts.entries()) {
		if (getJobClassLine(job)) {
			continue
		}

		rows.push({ classLine: '미분류', job, count })
	}

	return {
		totalMembers: [...counts.values()].reduce((sum, count) => sum + count, 0),
		rows
	}
}

export type JobCountSortDirection = 'asc' | 'desc'

export function sortJobDistributionRows(
	rows: JobDistributionRow[],
	direction: JobCountSortDirection
): JobDistributionRow[] {
	return [...rows].sort((left, right) => {
		if (left.count === right.count) {
			return left.job.localeCompare(right.job, 'ko')
		}

		return direction === 'desc' ? right.count - left.count : left.count - right.count
	})
}
