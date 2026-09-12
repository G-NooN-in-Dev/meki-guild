import { cn } from '@shared/ui/utils'
import Image from 'next/image'

type MonsterPortraitSize = 'sm' | 'md' | 'lg'

type MonsterPortraitProps = {
	/** public 경로 (예: /monsters/eliza.gif) */
	src: string
	/** 접근성용. 장식용이면 빈 문자열 */
	alt?: string
	size?: MonsterPortraitSize
	className?: string
}

const SIZE_CLASS = {
	sm: 'size-12',
	md: 'size-16',
	lg: 'size-24'
} as const satisfies Record<MonsterPortraitSize, string>

const SIZE_PX = {
	sm: 48,
	md: 64,
	lg: 96
} as const satisfies Record<MonsterPortraitSize, number>

function isAnimatedSrc(src: string): boolean {
	const path = src.split('?')[0]?.toLowerCase() ?? ''
	return path.endsWith('.gif') || path.endsWith('.webp')
}

/**
 * 몬스터·보스 스프라이트 초상화.
 * 원본 GIF(흰/검정 배경)도 프레임 안에서 자연스럽게 보이도록 맞춥니다.
 */
function MonsterPortrait({ src, alt = '', size = 'md', className }: MonsterPortraitProps) {
	const px = SIZE_PX[size]

	return (
		<div
			className={cn(
				'bg-grayscale-50 border-grayscale-200 shrink-0 overflow-hidden rounded-xl border',
				SIZE_CLASS[size],
				className
			)}
		>
			<Image
				src={src}
				alt={alt}
				width={px}
				height={px}
				unoptimized={isAnimatedSrc(src)}
				draggable={false}
				className="size-full object-contain"
			/>
		</div>
	)
}

export default MonsterPortrait
export type { MonsterPortraitProps, MonsterPortraitSize }
