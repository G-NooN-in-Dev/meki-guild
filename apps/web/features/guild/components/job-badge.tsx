import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/utils'

import { getJobBadgeClass, resolveJobKey } from '@/libs/job-class.constants'

type JobBadgeProps = {
	job: string
	className?: string
}

/** 직업명을 직업별 색상 Badge로 표시합니다. (MGF 전체 표기는 썬콜/불독 등으로 정규화) */
function JobBadge({ job, className }: JobBadgeProps) {
	const displayJob = resolveJobKey(job)

	return (
		<Badge variant="outline" className={cn(getJobBadgeClass(job), className)}>
			{displayJob}
		</Badge>
	)
}

export default JobBadge
