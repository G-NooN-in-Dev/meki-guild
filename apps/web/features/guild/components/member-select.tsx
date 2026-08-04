'use client'

import { cn } from '@shared/ui/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'

import JobBadge from '@/features/guild/components/job-badge'
import MemberDisplayName from '@/features/guild/components/member-display-name'

type MemberSelectOption = {
	name: string
	job: string
	combatPowerLabel: string
}

type MemberSelectProps = {
	label: string
	description?: string
	members: MemberSelectOption[]
	value: string | null
	onValueChange: (value: string) => void
	/** 상대방(또는 나)에서 이미 선택한 이름은 목록에서 제외 */
	excludeName?: string | null
	className?: string
}

function MemberSelect({
	label,
	description,
	members,
	value,
	onValueChange,
	excludeName,
	className
}: MemberSelectProps) {
	const options = excludeName ? members.filter((member) => member.name !== excludeName) : members

	return (
		<div className={cn('flex min-w-0 flex-col gap-2', className)}>
			<div>
				<p className="text-grayscale-900 text-sm font-medium">{label}</p>
				{description ? <p className="text-grayscale-500 mt-0.5 text-xs">{description}</p> : null}
			</div>

			<Select
				value={value}
				onValueChange={(nextValue) => {
					if (nextValue) {
						onValueChange(nextValue)
					}
				}}
			>
				<SelectTrigger className="w-full min-w-0">
					{/* 트리거에는 이름·직업 Badge·전투력을 한 줄로 압축해 표시 */}
					<SelectValue placeholder="길드원을 선택하세요">
						{(selectedName: string | null) => {
							const member = options.find((item) => item.name === selectedName)
							if (!member) {
								return null
							}

							return (
								<span className="flex min-w-0 items-center gap-1.5">
									{/* value는 실명 유지, 라벨만 잠금 시 별칭 */}
									<MemberDisplayName name={member.name} className="truncate font-medium" />
									<JobBadge job={member.job} className="max-w-[36%] truncate text-[11px]" />
									<span className="text-grayscale-500 truncate text-xs">{member.combatPowerLabel}</span>
								</span>
							)
						}}
					</SelectValue>
				</SelectTrigger>
				{/* 2줄 항목 기준 약 6명 노출, 이후 스크롤 */}
				<SelectContent
					alignItemWithTrigger={false}
					className="max-h-[min(calc(2.75rem*6+0.5rem),var(--available-height))] max-w-[calc(100vw-2rem)]"
				>
					{options.map((member) => (
						<SelectItem key={member.name} value={member.name} className="items-start whitespace-normal">
							<span className="flex min-w-0 flex-col gap-1">
								<MemberDisplayName name={member.name} className="font-medium break-keep" />
								<span className="flex min-w-0 flex-wrap items-center gap-1.5">
									<JobBadge job={member.job} className="text-[11px]" />
									<span className="text-grayscale-500 text-xs wrap-break-word">{member.combatPowerLabel}</span>
								</span>
							</span>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}

export default MemberSelect

export type { MemberSelectOption }
