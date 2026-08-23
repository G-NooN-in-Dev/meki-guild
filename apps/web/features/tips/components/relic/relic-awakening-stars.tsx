import { cn } from '@shared/ui/utils'
import { StarIcon } from 'lucide-react'

import { RELIC_MAX_AWAKENING_STAGE } from '@/features/tips/lib/relic.constants'

type RelicAwakeningStarsProps = {
	/** 표시할 각성 단계(0~5) */
	stage: number
	/**
	 * 항상 이 개수만큼 별을 그리고, stage만큼 왼쪽부터 채웁니다.
	 * 없으면 채워진 별만 표시하고, 0이면 아무것도 그리지 않습니다(슬롯·합산용).
	 */
	max?: number
	className?: string
	/** 별 아이콘 크기 클래스. 기본 size-3 */
	starClassName?: string
}

/**
 * 각성 단계를 별 아이콘으로 표시합니다.
 * max가 있으면 빈 별 트랙 + 왼쪽부터 채움, 없으면 채워진 별만 그립니다.
 */
function RelicAwakeningStars({ stage, max, className, starClassName }: RelicAwakeningStarsProps) {
	const filled = Math.min(max ?? RELIC_MAX_AWAKENING_STAGE, Math.max(0, Math.floor(stage)))

	if (max === undefined) {
		if (filled === 0) {
			return null
		}

		return (
			<span
				className={cn('inline-flex items-center gap-0.5', className)}
				aria-label={`각성 ${filled}`}
				title={`각성 ${filled}`}
			>
				{Array.from({ length: filled }, (_, index) => (
					<StarIcon
						key={index}
						aria-hidden
						className={cn('fill-warning text-warning size-3 shrink-0', starClassName)}
					/>
				))}
			</span>
		)
	}

	const total = Math.max(0, Math.floor(max))

	return (
		<span
			className={cn('inline-flex items-center gap-0.5', className)}
			aria-label={`각성 ${filled}/${total}`}
			title={`각성 ${filled}/${total}`}
		>
			{Array.from({ length: total }, (_, index) => {
				const isFilled = index < filled
				return (
					<StarIcon
						key={index}
						aria-hidden
						className={cn(
							'size-3 shrink-0',
							isFilled ? 'fill-warning text-warning' : 'text-grayscale-300 fill-transparent',
							starClassName
						)}
					/>
				)
			})}
		</span>
	)
}

export default RelicAwakeningStars
