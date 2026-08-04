'use client'

import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/lib/utils'
import type { ReactNode } from 'react'

import { GUILD_ZERO_DELTA_LABEL } from '@/features/guild/types/guild-snapshot.type'

type GrowthDeltaProps = {
	value: string | null
	/** 이전 값 대비 증감 비율. value 옆에 함께 표시 */
	percentLabel?: string | null
	className?: string
	/** true면 증감량 텍스트는 숨기고 증감율만 표시(요약 카드처럼 값이 이미 따로 있을 때) */
	hideValue?: boolean
}

function isZeroDelta(
	value: string | null
): value is null | typeof GUILD_ZERO_DELTA_LABEL | '0' | '+0' | '-0' | '▲0' | '▼0' {
	if (!value) {
		return true
	}

	// formatKoreanDelta 등이 반환하는 '변화 없음' 표기와 +0/-0 계열을 동일 취급
	return (
		value === GUILD_ZERO_DELTA_LABEL ||
		value === '0' ||
		value === '+0' ||
		value === '-0' ||
		value === '▲0' ||
		value === '▼0'
	)
}

function formatDeltaDisplayValue(value: string | null): string {
	if (isZeroDelta(value)) {
		return GUILD_ZERO_DELTA_LABEL
	}

	return value
}

function getDeltaTone(value: string | null): 'positive' | 'negative' | 'neutral' | 'muted' {
	if (isZeroDelta(value)) {
		return 'muted'
	}

	if (value.startsWith('+') || value.startsWith('▲')) {
		return 'positive'
	}

	if (value.startsWith('-') || value.startsWith('▼')) {
		return 'negative'
	}

	return 'neutral'
}

const toneClassNames = {
	positive: 'text-success-700',
	negative: 'text-danger-700',
	neutral: 'text-grayscale-600',
	muted: 'text-grayscale-400'
} as const

function GrowthDelta({ value, percentLabel, className, hideValue = false }: GrowthDeltaProps) {
	const tone = getDeltaTone(value)

	return (
		<span className={cn('text-xs font-medium', toneClassNames[tone], className)}>
			{hideValue ? null : formatDeltaDisplayValue(value)}
			{percentLabel ? <span className={cn(!hideValue && 'ml-1', 'opacity-80')}>({percentLabel})</span> : null}
		</span>
	)
}

type MemberStatusBadgeProps = {
	status: 'active' | 'new' | 'left'
}

function MemberStatusBadge({ status }: MemberStatusBadgeProps) {
	if (status === 'active') {
		return null
	}

	const labelMap = {
		new: '신규',
		left: '이탈'
	} as const

	const variantMap = {
		new: 'secondary',
		left: 'outline'
	} as const

	return (
		<Badge variant={variantMap[status]} className="ml-2">
			{labelMap[status]}
		</Badge>
	)
}

type ChangedBadgeProps = {
	changed: boolean
	children: ReactNode
}

function ChangedBadge({ changed, children }: ChangedBadgeProps) {
	return (
		<span className={cn(changed && 'text-info-700 font-medium')}>
			{children}
			{changed ? <span className="text-info-500 ml-1 text-xs">변동</span> : null}
		</span>
	)
}

export default GrowthDelta
export { ChangedBadge, MemberStatusBadge }
