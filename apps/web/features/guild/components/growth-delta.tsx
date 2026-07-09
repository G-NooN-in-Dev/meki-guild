'use client'

import { Badge } from '@shared/ui/badge'
import { cn } from '@shared/ui/lib/utils'
import type { ReactNode } from 'react'

type GrowthDeltaProps = {
	value: string | null
	className?: string
}

function getDeltaTone(value: string | null): 'positive' | 'negative' | 'neutral' | 'muted' {
	if (!value || value === '0' || value === '+0' || value === '-0') {
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

function GrowthDelta({ value, className }: GrowthDeltaProps) {
	const tone = getDeltaTone(value)

	return <span className={cn('text-xs font-medium', toneClassNames[tone], className)}>{value ?? '-'}</span>
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

export { ChangedBadge, GrowthDelta, MemberStatusBadge }
