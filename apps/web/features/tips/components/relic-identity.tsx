import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/utils'

import GradePortrait from '@/features/tips/components/grade-portrait'
import { ITEM_GRADE_BADGE_CLASS } from '@/features/tips/lib/item-grade.constants'
import { RELIC_GRADE_META } from '@/features/tips/lib/relic.constants'
import type { Relic } from '@/features/tips/types/relic.type'

type RelicIdentityProps = {
	relic: Relic
}

/** 유물 초상화 + 이름 + 등급. 표 셀·카드 헤더에서 같이 씁니다. */
function RelicIdentity({ relic }: RelicIdentityProps) {
	return (
		<div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
			<GradePortrait src={relic.imageSrc} alt={relic.name} grade={relic.grade} size="sm" className="shrink-0" />
			<div className="min-w-0 flex-1">
				<p className="text-grayscale-900 text-xs leading-snug font-medium break-keep sm:text-sm">{relic.name}</p>
				<Badge
					variant="secondary"
					className={cn('mt-1 px-1.5 py-0 text-[10px] font-medium', ITEM_GRADE_BADGE_CLASS[relic.grade])}
				>
					{RELIC_GRADE_META[relic.grade].label}
				</Badge>
			</div>
		</div>
	)
}

export default RelicIdentity
