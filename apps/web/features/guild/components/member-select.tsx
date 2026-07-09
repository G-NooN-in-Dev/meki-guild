'use client'

import { cn } from '@shared/ui/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'

export type MemberSelectOption = {
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
					<SelectValue placeholder="길드원을 선택하세요" />
				</SelectTrigger>
				{/* 2줄 항목 기준 약 6명 노출, 이후 스크롤 */}
				<SelectContent
					alignItemWithTrigger={false}
					className="max-h-[min(calc(2.75rem*6+0.5rem),var(--available-height))] max-w-[calc(100vw-2rem)]"
				>
					{options.map((member) => (
						<SelectItem key={member.name} value={member.name} className="items-start whitespace-normal">
							<span className="flex min-w-0 flex-col gap-0.5">
								<span className="font-medium break-keep">{member.name}</span>
								<span className="text-grayscale-500 text-xs break-words">
									{member.job} · {member.combatPowerLabel}
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
