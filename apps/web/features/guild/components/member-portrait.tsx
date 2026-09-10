import { cn } from '@shared/ui/lib/utils'
import Image from 'next/image'

import { getMemberPortraitSrc } from '@/features/guild/lib/member-portrait'

type MemberPortraitSize = 'sm' | 'md' | 'lg'

type MemberPortraitProps = {
	name: string
	/** 접근성용. 장식용이면 빈 문자열 */
	alt?: string
	size?: MemberPortraitSize
	className?: string
	/**
	 * 원본 PNG는 캐릭터가 작게 중앙에 있어 기본으로 가운데를 확대합니다.
	 * `true`(기본)=1.85, `false`=확대 없음, number=커스텀 scale.
	 */
	zoom?: boolean | number
}

const SIZE_CLASS = {
	sm: 'size-12',
	md: 'size-16',
	lg: 'size-24'
} as const satisfies Record<MemberPortraitSize, string>

const SIZE_PX = {
	sm: 48,
	md: 64,
	lg: 96
} as const satisfies Record<MemberPortraitSize, number>

const DEFAULT_ZOOM_SCALE = 1.85

/** zoom prop → CSS scale. false면 확대하지 않습니다. */
function resolveZoomScale(zoom: boolean | number): number | null {
	if (zoom === false) {
		return null
	}

	if (zoom === true) {
		return DEFAULT_ZOOM_SCALE
	}

	return zoom
}

/** 길드원 초상화. 밝은 배경 + 캐릭터 중앙 확대를 공통으로 맞춥니다. */
function MemberPortrait({ name, alt = '', size = 'md', className, zoom = true }: MemberPortraitProps) {
	const px = SIZE_PX[size]
	const zoomScale = resolveZoomScale(zoom)

	return (
		<div
			className={cn(
				'bg-grayscale-50 border-grayscale-200 shrink-0 overflow-hidden rounded-xl border',
				SIZE_CLASS[size],
				className
			)}
		>
			<Image
				src={getMemberPortraitSrc(name)}
				alt={alt}
				width={px}
				height={px}
				draggable={false}
				className="size-full origin-center object-cover"
				style={zoomScale != null ? { transform: `scale(${zoomScale})` } : undefined}
			/>
		</div>
	)
}

export default MemberPortrait
export type { MemberPortraitProps, MemberPortraitSize }
