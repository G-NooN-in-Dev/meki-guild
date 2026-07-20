import { cn } from '@shared/ui/utils'
import Image from 'next/image'

import type { CompanionGrade } from '@/features/tips/types/companion.type'

type CompanionPortraitSize = 'sm' | 'md' | 'lg'

type CompanionPortraitProps = {
	/** public 경로 (예: /tips/companions/hero.png) */
	src: string
	alt: string
	/** 있으면 등급색 테두리 */
	grade?: CompanionGrade
	size?: CompanionPortraitSize
	className?: string
}

/** 슬롯·선택 그리드에서 쓰는 동료 초상화 */
const SIZE_CLASS = {
	sm: 'size-8',
	md: 'size-11',
	lg: 'size-14'
} as const satisfies Record<CompanionPortraitSize, string>

/** 등급별 초상화 테두리 — Badge 파스텔 톤과 맞춤 */
const GRADE_RING_CLASS = {
	legendary: 'ring-pastel-green-400',
	unique: 'ring-pastel-yellow-400',
	epic: 'ring-pastel-purple-400'
} as const satisfies Record<CompanionGrade, string>

/** 원본 PNG 비율 (105×104). 화면 크기는 SIZE_CLASS로 맞춤 */
const PORTRAIT_WIDTH = 105
const PORTRAIT_HEIGHT = 104

function CompanionPortrait({ src, alt, grade, size = 'md', className }: CompanionPortraitProps) {
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
				'bg-grayscale-50 border-grayscale-200 inline-block shrink-0 cursor-pointer rounded-lg border object-contain',
				SIZE_CLASS[size],
				grade && 'ring-2 ring-offset-1',
				grade && GRADE_RING_CLASS[grade],
				className
			)}
		/>
	)
}

export default CompanionPortrait
