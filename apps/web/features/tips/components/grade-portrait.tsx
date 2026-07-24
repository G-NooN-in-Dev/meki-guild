import { cn } from '@shared/ui/utils'
import Image from 'next/image'

import { ITEM_GRADE_RING_CLASS } from '@/features/tips/lib/item-grade.constants'
import type { ItemGrade } from '@/features/tips/types/item-grade.type'

type GradePortraitSize = 'sm' | 'md' | 'lg'

type GradePortraitProps = {
	/** public 경로 (예: /tips/companions/hero.png) */
	src: string
	alt: string
	/** 있으면 등급색 테두리 */
	grade?: ItemGrade
	size?: GradePortraitSize
	/**
	 * Next Image intrinsic 크기 — 도메인 원본 비율용.
	 * 화면 표시 크기는 size CSS로 맞춥니다.
	 */
	width?: number
	height?: number
	className?: string
}

const SIZE_CLASS = {
	sm: 'size-8',
	md: 'size-11',
	lg: 'size-14'
} as const satisfies Record<GradePortraitSize, string>

/** 기본 intrinsic — 동료/유물 원본 비율의 중간값에 가깝게 */
const DEFAULT_PORTRAIT_WIDTH = 112
const DEFAULT_PORTRAIT_HEIGHT = 112

/**
 * 슬롯·선택 그리드에서 쓰는 등급 초상화.
 * 동료·유물 UI에서 공통으로 씁니다.
 */
function GradePortrait({
	src,
	alt,
	grade,
	size = 'md',
	width = DEFAULT_PORTRAIT_WIDTH,
	height = DEFAULT_PORTRAIT_HEIGHT,
	className
}: GradePortraitProps) {
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
			width={width}
			height={height}
			draggable={false}
			className={cn(
				'bg-grayscale-50 border-grayscale-200 inline-block shrink-0 rounded-lg border object-contain',
				SIZE_CLASS[size],
				grade && 'ring-2 ring-offset-1',
				grade && ITEM_GRADE_RING_CLASS[grade],
				className
			)}
		/>
	)
}

export default GradePortrait
export type { ItemGrade }
