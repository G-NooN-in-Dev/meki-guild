'use client'

import { cn } from '@shared/ui/utils'
import { type CSSProperties, type Ref, type RefObject, useLayoutEffect, useRef, useState } from 'react'

import JobBadge from '@/features/guild/components/job-badge'
import MemberDisplayName from '@/features/guild/components/member-display-name'
import { AWARD_SLOT_BG_CLASS_NAME } from '@/features/guild/lib/content-award-styles'
import type { ContentAwardSlot, ContentAwardWinner } from '@/features/guild/lib/select-content-award-winners'
import { formatDate } from '@/utils/dayjs'

/** 한 세그먼트(동일 복제 블록)가 지나가는 시간 */
const MARQUEE_LOOP_DURATION_S = 30

type ReadyAwardSlot = Extract<ContentAwardSlot, { status: 'ready' }>

type GuildGrowthPodiumMarqueeProps = {
	slots: ReadyAwardSlot[]
}

/** 순위 숫자 색 */
const RANK_TEXT_CLASS_NAME = {
	1: 'text-pastel-orange-500 dark:text-pastel-orange-400',
	2: 'text-grayscale-500 dark:text-grayscale-700',
	3: 'text-pastel-orange-800'
} as const

type PodiumPlaceProps = {
	winner: ContentAwardWinner
}

type PodiumCardProps = {
	slot: ReadyAwardSlot
}

type MarqueeSegmentProps = {
	slots: ReadyAwardSlot[]
	className?: string
	ariaHidden?: boolean
	ref?: Ref<HTMLDivElement>
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

/** 한 자리: 순위 · 이름 · 직업 · 성장 점수 */
function PodiumPlace({ winner }: PodiumPlaceProps) {
	const { job, name, rank, scoreLabel } = winner

	const rankClassName = RANK_TEXT_CLASS_NAME[rank as 1 | 2 | 3] ?? 'text-grayscale-500 dark:text-grayscale-700'

	return (
		<div className="flex w-22 flex-col items-center gap-1 sm:w-24">
			<p className={cn('text-xs font-bold tabular-nums', rankClassName)}>{rank}</p>
			<p className="text-grayscale-900 w-full truncate text-center text-xs font-semibold sm:text-sm">
				<MemberDisplayName name={name} />
			</p>
			<JobBadge job={job} className="max-w-full shrink-0 truncate text-[10px]" />
			<p className="text-success-700 dark:text-success-500 text-xs font-semibold tabular-nums">{scoreLabel}</p>
		</div>
	)
}

/** 부문 1장: 라벨 + 1등·2등·3등 순서 */
function PodiumCard({ slot }: PodiumCardProps) {
	const { criteriaDate, key, label, winners } = slot
	return (
		<article
			className={cn(
				'border-grayscale-100 flex shrink-0 flex-col gap-2 rounded-lg border px-3 py-2.5 shadow-sm',
				AWARD_SLOT_BG_CLASS_NAME[key]
			)}
		>
			<header className="flex items-baseline justify-between gap-3">
				<p className="text-grayscale-800 text-sm font-semibold">{label}</p>
				{criteriaDate ? (
					<p className="text-grayscale-400 dark:text-grayscale-700 text-xs tabular-nums">
						기준 {formatDate(criteriaDate, 'MM.DD')}
					</p>
				) : null}
			</header>

			<div className="flex items-start justify-center gap-1.5 sm:gap-2">
				{winners.map((winner) => (
					<PodiumPlace key={`${key}-${winner.rank}-${winner.name}`} winner={winner} />
				))}
			</div>
		</article>
	)
}

function MarqueeSegment({ slots, className, ariaHidden, ref }: MarqueeSegmentProps) {
	return (
		<div
			ref={ref}
			className={cn('flex shrink-0 items-stretch gap-3 pr-3', className)}
			aria-hidden={ariaHidden ? true : undefined}
		>
			{slots.map((slot) => (
				<PodiumCard key={slot.key} slot={slot} />
			))}
		</div>
	)
}

/**
 * 부문별 성장률 상위 3명 포디움을 가로 Marquee로 흘립니다.
 * 탭 선택과 무관하게 상세 상단에 고정 배치합니다.
 */
function GuildGrowthPodiumMarquee({ slots }: GuildGrowthPodiumMarqueeProps) {
	const segmentRef = useRef<HTMLDivElement>(null)
	const segmentWidth = useMarqueeSegmentWidth(segmentRef)
	const isMarqueeReady = segmentWidth > 0

	if (slots.length === 0) {
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
			aria-label="주간 성장 상위 포디움"
			className="border-grayscale-100 bg-card w-full min-w-0 overflow-hidden rounded-lg border"
		>
			<div
				className={cn(
					'flex w-max py-2 pl-2',
					isMarqueeReady && 'animate-marquee will-change-transform motion-reduce:animate-none'
				)}
				style={marqueeStyle}
			>
				<MarqueeSegment slots={slots} ref={segmentRef} />
				<MarqueeSegment slots={slots} ariaHidden />
			</div>
		</div>
	)
}

export default GuildGrowthPodiumMarquee
