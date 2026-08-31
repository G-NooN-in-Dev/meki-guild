'use client'

import { cn } from '@shared/ui/lib/utils'
import { type CSSProperties, type Ref, type RefObject, useLayoutEffect, useRef, useState } from 'react'

import {
	ANNOUNCEMENT_BANNER_ITEMS,
	type AnnouncementBannerItem,
	hasAnnouncementBanner
} from '@/libs/announcement-banner.constants'

/** 한 세그먼트 안에서 항목을 반복해 짧은 문구도 화면을 채웁니다 */
const MARQUEE_SEGMENT_REPEATS = 4

/** 한 세그먼트(동일 복제 블록)가 지나가는 시간 */
const MARQUEE_LOOP_DURATION_S = 60

type AnnouncementBannerItemViewProps = {
	item: AnnouncementBannerItem
}

function AnnouncementBannerItemView({ item }: AnnouncementBannerItemViewProps) {
	if (item.kind === 'link') {
		return (
			<a
				href={item.href}
				target="_blank"
				rel="noopener noreferrer"
				className="underline underline-offset-2 hover:opacity-90"
			>
				{item.label}
			</a>
		)
	}

	return <span>{item.label}</span>
}

type AnnouncementBannerSegmentProps = {
	items: AnnouncementBannerItem[]
	className?: string
	ariaHidden?: boolean
	ref?: Ref<HTMLDivElement>
}

function AnnouncementBannerSegment({ items, className, ariaHidden, ref }: AnnouncementBannerSegmentProps) {
	const repeatedEntries = Array.from({ length: MARQUEE_SEGMENT_REPEATS }, (_, repeatIndex) =>
		items.map((item, itemIndex) => ({
			item,
			key: `${repeatIndex}-${item.kind}-${itemIndex}`
		}))
	).flat()

	return (
		<div
			ref={ref}
			className={cn('flex shrink-0 items-center whitespace-nowrap', className)}
			aria-hidden={ariaHidden ? true : undefined}
		>
			{repeatedEntries.map(({ item, key }, index) => (
				<span key={key} className="flex shrink-0 items-center">
					{index > 0 ? (
						<span className="px-4" aria-hidden>
							·
						</span>
					) : null}
					<AnnouncementBannerItemView item={item} />
				</span>
			))}
			<span className="px-4" aria-hidden>
				·
			</span>
		</div>
	)
}

function useMarqueeSegmentWidth(segmentRef: RefObject<HTMLDivElement | null>) {
	const [width, setWidth] = useState(0)

	useLayoutEffect(() => {
		const element = segmentRef.current
		if (!element) {
			return
		}

		const updateWidth = () => {
			setWidth(element.offsetWidth)
		}

		updateWidth()

		const resizeObserver = new ResizeObserver(updateWidth)
		resizeObserver.observe(element)

		return () => resizeObserver.disconnect()
	}, [segmentRef])

	return width
}

function AnnouncementBanner() {
	const segmentRef = useRef<HTMLDivElement>(null)
	const segmentWidth = useMarqueeSegmentWidth(segmentRef)
	const isMarqueeReady = segmentWidth > 0

	if (!hasAnnouncementBanner()) {
		return null
	}

	const marqueeStyle = isMarqueeReady
		? ({
				'--marquee-distance': `${segmentWidth}px`,
				animationDuration: `${MARQUEE_LOOP_DURATION_S}s`
			} as CSSProperties)
		: undefined

	return (
		<div
			role="region"
			aria-label="공지"
			className="border-grayscale-700 z-sticky bg-grayscale-100 text-grayscale-900 fixed inset-x-0 top-14 h-8 overflow-hidden border-b text-sm"
		>
			<div
				className={cn(
					'flex h-full',
					isMarqueeReady && 'animate-marquee will-change-transform motion-reduce:animate-none'
				)}
				style={marqueeStyle}
				aria-live="polite"
			>
				<AnnouncementBannerSegment items={ANNOUNCEMENT_BANNER_ITEMS} ref={segmentRef} />
				<AnnouncementBannerSegment items={ANNOUNCEMENT_BANNER_ITEMS} ariaHidden />
			</div>
		</div>
	)
}

export default AnnouncementBanner
