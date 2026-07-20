import { cn } from '@shared/ui/utils'
import { StarIcon } from 'lucide-react'

type RelicAwakeningStarsProps = {
	/** 표시할 각성 단계(0~5). 단계 수만큼 노란 별을 그립니다. */
	stage: number
	className?: string
	/** 별 아이콘 크기 클래스. 기본 size-3 */
	starClassName?: string
}

/** 각성 단계를 '각성 N' 텍스트 대신 노란 별 개수로 표시 */
function RelicAwakeningStars({ stage, className, starClassName }: RelicAwakeningStarsProps) {
	const count = Math.max(0, Math.floor(stage))

	if (count === 0) {
		return null
	}

	return (
		<span
			className={cn('inline-flex items-center gap-0.5', className)}
			aria-label={`각성 ${count}`}
			title={`각성 ${count}`}
		>
			{Array.from({ length: count }, (_, index) => (
				<StarIcon key={index} aria-hidden className={cn('fill-warning text-warning size-3 shrink-0', starClassName)} />
			))}
		</span>
	)
}

export default RelicAwakeningStars
