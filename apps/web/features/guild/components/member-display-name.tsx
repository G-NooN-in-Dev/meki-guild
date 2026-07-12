'use client'

import { cn } from '@shared/ui/lib/utils'

import { useNameReveal } from '@/features/guild/context/name-reveal.context'
import { getMemberDisplayName } from '@/features/guild/lib/member-display-name'

type MemberDisplayNameProps = {
	/** 내부 식별용 실명 (조인·Select value와 동일) */
	name: string
	className?: string
}

/**
 * 잠금 시 별칭, 해제 시 실명을 표시합니다.
 * 비교·정렬 키는 건드리지 않고, 화면에 보이는 텍스트만 바꿉니다.
 */
function MemberDisplayName({ name, className }: MemberDisplayNameProps) {
	const { isUnlocked } = useNameReveal()
	const displayName = getMemberDisplayName(name, isUnlocked)

	return (
		<span
			className={cn(!isUnlocked && 'select-none', className)}
			title={isUnlocked ? undefined : '길드원에게만 실명이 공개됩니다'}
		>
			{displayName}
		</span>
	)
}

/** 문자열만 필요할 때 (aria-label 등) */
function useMemberDisplayName(name: string) {
	const { isUnlocked } = useNameReveal()
	return getMemberDisplayName(name, isUnlocked)
}

export { useMemberDisplayName }
export default MemberDisplayName
