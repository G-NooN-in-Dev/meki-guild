import { cn } from '@shared/ui/utils'
import Image from 'next/image'

import { type GameItemId, getGameItemMeta } from '@/libs/game-item.constants'

type GameItemIconSize = 'sm' | 'md'

type GameItemIconProps = {
	itemId: GameItemId
	size?: GameItemIconSize
	className?: string
}

const SIZE_CLASS = {
	sm: 'size-4',
	md: 'size-5'
} as const satisfies Record<GameItemIconSize, string>

const SIZE_PX = {
	sm: 16,
	md: 20
} as const satisfies Record<GameItemIconSize, number>

/**
 * 공용 재화·소모품 아이콘.
 * 이미지가 없는 아이템은 null을 반환합니다.
 */
function GameItemIcon({ itemId, size = 'sm', className }: GameItemIconProps) {
	const meta = getGameItemMeta(itemId)

	if (!meta.imageSrc) {
		return null
	}

	const px = SIZE_PX[size]

	return (
		<Image
			src={meta.imageSrc}
			alt={meta.label}
			width={px}
			height={px}
			draggable={false}
			className={cn('shrink-0 object-contain', SIZE_CLASS[size], className)}
		/>
	)
}

export default GameItemIcon
