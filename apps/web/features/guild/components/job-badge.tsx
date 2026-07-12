import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/lib/utils'

import { getJobBadgeClass } from '@/libs/job-class.constants'

type JobBadgeProps = {
	job: string
	className?: string
}

/** 직업명을 직업별 색상 Badge로 표시합니다. */
function JobBadge({ job, className }: JobBadgeProps) {
	return (
		<Badge variant="outline" className={cn(getJobBadgeClass(job), className)}>
			{job}
		</Badge>
	)
}

export default JobBadge
