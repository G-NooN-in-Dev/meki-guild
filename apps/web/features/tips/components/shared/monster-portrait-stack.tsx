import { cn } from '@shared/ui/utils'
import Image from 'next/image'

import type { MonsterPortraitSize } from '@/features/tips/components/shared/monster-portrait'

type MonsterPortraitStackItem = {
	src: string
	alt: string
}

type MonsterPortraitStackProps = {
	items: readonly MonsterPortraitStackItem[]
	/** 그룹 접근성 라벨 (개별 이미지는 장식 처리) */
	label: string
	size?: MonsterPortraitSize
	className?: string
}

/** 높이는 MonsterPortrait와 동일, 가로는 겹침용으로 조금 더 넓게 */
const SIZE_CLASS = {
	sm: 'h-12 w-16',
	md: 'h-16 w-22',
	lg: 'h-24 w-32'
} as const satisfies Record<MonsterPortraitSize, string>

const SIZE_PX = {
	sm: 48,
	md: 64,
	lg: 96
} as const satisfies Record<MonsterPortraitSize, number>

/** 프레임은 유지하고 스프라이트만 확대해 크롭 (원본 디테일에 가깝게) */
const SPRITE_SCALE = 1.2

function isAnimatedSrc(src: string): boolean {
	const path = src.split('?')[0]?.toLowerCase() ?? ''
	return path.endsWith('.gif') || path.endsWith('.webp')
}

/**
 * 투명 배경 몬스터 초상화를 한 프레임 안에 겹쳐 배치.
 * 가로는 높이보다 조금 긴 직사각형. 각 GIF는 확대해 overflow로 자릅니다.
 * 좌·우는 뒤, 가운데가 앞에 옵니다.
 */
function MonsterPortraitStack({ items, label, size = 'md', className }: MonsterPortraitStackProps) {
	const px = SIZE_PX[size]

	return (
		<div
			role="img"
			aria-label={label}
			className={cn(
				'bg-grayscale-50 border-grayscale-200 shrink-0 overflow-hidden rounded-xl border',
				SIZE_CLASS[size],
				className
			)}
		>
			{/* 프레임 전체 기준으로 배치 후 scale로만 확대. */}
			<div className="relative size-full">
				{items.map((item, index) => {
					const offsetPercent = (index - (items.length - 1) / 2) * (100 / 3)

					return (
						<div
							key={item.src}
							aria-hidden
							className="absolute inset-0 origin-bottom"
							style={{
								zIndex: index + 1,
								transform: `translateX(${offsetPercent}%) scale(${SPRITE_SCALE})`
							}}
						>
							<Image
								src={item.src}
								alt=""
								width={px}
								height={px}
								unoptimized={isAnimatedSrc(item.src)}
								draggable={false}
								className="size-full object-contain object-bottom"
							/>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default MonsterPortraitStack
export type { MonsterPortraitStackItem, MonsterPortraitStackProps }
