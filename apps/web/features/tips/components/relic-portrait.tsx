'use client'

import { cn } from '@shared/ui/utils'
import Image from 'next/image'

import type { RelicGrade } from '@/features/tips/types/relic.type'

type RelicPortraitSize = 'sm' | 'md' | 'lg'

type RelicPortraitProps = {
	src: string
	alt: string
	grade?: RelicGrade
	size?: RelicPortraitSize
	className?: string
}

const SIZE_CLASS = {
	sm: 'size-8',
	md: 'size-11',
	lg: 'size-14'
} as const satisfies Record<RelicPortraitSize, string>

const GRADE_RING_CLASS = {
	legendary: 'ring-pastel-green-400',
	unique: 'ring-pastel-yellow-400',
	epic: 'ring-pastel-purple-400'
} as const satisfies Record<RelicGrade, string>

const PORTRAIT_WIDTH = 116
const PORTRAIT_HEIGHT = 120

/** 슬롯·선택 그리드에서 공통으로 쓰는 유물 아이콘 */
function RelicPortrait({ src, alt, grade, size = 'md', className }: RelicPortraitProps) {
	if (!src) {
		return (
			<span
				aria-hidden
				className={cn(
					'bg-grayscale-100 border-grayscale-200 inline-block shrink-0 rounded-lg border',
					SIZE_CLASS[size],
					className
				)}
			/>
		)
	}

	return (
		<Image
			src={src}
			alt={alt}
			width={PORTRAIT_WIDTH}
			height={PORTRAIT_HEIGHT}
			draggable={false}
			className={cn(
				'bg-grayscale-50 border-grayscale-200 inline-block shrink-0 rounded-lg border object-contain',
				SIZE_CLASS[size],
				grade && 'ring-2 ring-offset-1',
				grade && GRADE_RING_CLASS[grade],
				className
			)}
		/>
	)
}

export default RelicPortrait
