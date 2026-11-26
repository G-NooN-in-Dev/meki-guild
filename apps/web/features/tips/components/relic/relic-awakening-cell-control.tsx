'use client'

import { Button } from '@shared/ui/button'
import { cn } from '@shared/ui/utils'
import { MinusIcon, PlusIcon } from 'lucide-react'

import RelicAwakeningStars from '@/features/tips/components/relic/relic-awakening-stars'

type RelicAwakeningCellControlProps = {
	stage: number
	/** 등급별 각성 상한 (레전드리 7, 유니크·에픽 5) */
	maxStage: number
	onStageChange: (stage: number) => void
	/** row: 별과 −/+를 한 줄에 (모바일 카드 헤더) */
	layout?: 'stack' | 'row'
}

/** 효과 표·카드 각성 조절 — stack은 별 아래 −/+, row는 한 줄 */
function RelicAwakeningCellControl({
	stage,
	maxStage,
	onStageChange,
	layout = 'stack'
}: RelicAwakeningCellControlProps) {
	const canDecrease = stage > 0
	const canIncrease = stage < maxStage

	return (
		<div className={cn('flex items-center gap-1.5', layout === 'stack' && 'flex-col')}>
			<RelicAwakeningStars stage={stage} max={maxStage} />
			<div className="flex items-center gap-1">
				<Button
					type="button"
					variant="outline"
					size="icon-xs"
					disabled={!canDecrease}
					aria-label="각성 단계 감소"
					onClick={() => onStageChange(stage - 1)}
				>
					<MinusIcon className="size-3" />
				</Button>
				<Button
					type="button"
					variant="outline"
					size="icon-xs"
					disabled={!canIncrease}
					aria-label="각성 단계 증가"
					onClick={() => onStageChange(stage + 1)}
				>
					<PlusIcon className="size-3" />
				</Button>
			</div>
		</div>
	)
}

export default RelicAwakeningCellControl
