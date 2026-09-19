'use client'

import { cn } from '@shared/ui/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

type PredictMemberPortraitProps = {
	name: string
	src: string | null
	className?: string
}

/** mgf 초상화. 실패·없으면 닉네임 이니셜로 대체합니다. */
function PredictMemberPortrait({ name, src, className }: PredictMemberPortraitProps) {
	const [hasError, setHasError] = useState(false)
	const [loadedSrc, setLoadedSrc] = useState(src)

	if (loadedSrc !== src) {
		setLoadedSrc(src)
		setHasError(false)
	}

	const initial = name.normalize('NFC').trim()[0] ?? '?'
	const showImage = Boolean(src) && !hasError

	return (
		<div
			className={cn(
				'bg-grayscale-50 border-grayscale-200 relative size-10 shrink-0 overflow-hidden rounded-lg border',
				className
			)}
		>
			{showImage && src ? (
				<Image
					src={src}
					alt=""
					width={40}
					height={40}
					unoptimized
					draggable={false}
					className="size-full origin-center object-cover"
					style={{ transform: 'scale(2.25)' }}
					onError={() => setHasError(true)}
				/>
			) : (
				<span className="text-grayscale-400 flex size-full items-center justify-center text-xs font-medium select-none">
					{initial}
				</span>
			)}
		</div>
	)
}

export default PredictMemberPortrait
