'use client'

import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { cn } from '@shared/ui/utils'

import {
	CONSULTING_PRESET_STAT_GROUPS,
	formatPresetStatValue,
	getPresetStatFieldsByGroup
} from '@/features/tips/lib/companion-consulting.constants'
import type { ConsultingPresetStatId, ConsultingPresetStats } from '@/features/tips/types/companion-consulting.type'

type CompanionPresetStatsFieldsProps = {
	stats: ConsultingPresetStats
	onStatsChange?: (next: ConsultingPresetStats) => void
	readOnly?: boolean
	className?: string
}

/**
 * 현재 프리셋 기준 전투 수치.
 * 세트 구분 카드 없이, 행 배치만 세트 단위로 맞춥니다.
 */
function CompanionPresetStatsFields({
	stats,
	onStatsChange,
	readOnly = false,
	className
}: CompanionPresetStatsFieldsProps) {
	function handleChange(id: ConsultingPresetStatId, raw: string) {
		if (readOnly || !onStatsChange) {
			return
		}

		// 입력 중 빈 값은 0으로 두고, 숫자만 반영합니다.
		if (raw.trim() === '') {
			onStatsChange({ ...stats, [id]: 0 })
			return
		}

		const parsed = Number(raw)
		if (!Number.isFinite(parsed)) {
			return
		}

		onStatsChange({ ...stats, [id]: parsed })
	}

	return (
		<div className={cn('flex flex-col gap-3', className)}>
			<div>
				<h2 className="text-grayscale-900 font-semibold">현재 프리셋 스탯</h2>
				<p className="text-grayscale-500 text-sm">게임에 표시된 프리셋 기준 수치(소수점 제외) 를 입력해 주세요. </p>
			</div>

			<div className="border-grayscale-200 bg-card shadow-soft flex flex-col gap-3 rounded-xl border p-4">
				{CONSULTING_PRESET_STAT_GROUPS.map((group) => {
					const fields = getPresetStatFieldsByGroup(group.id)
					const columnClass = fields.length === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'

					return (
						<div key={group.id} className={cn('grid gap-3', columnClass)}>
							{fields.map((field) => {
								const value = stats[field.id]
								const inputId = `preset-stat-${field.id}`

								if (readOnly) {
									return (
										<div key={field.id} className="flex items-baseline justify-between gap-2">
											<span className="text-grayscale-600 text-sm">{field.label}</span>
											<span className="text-grayscale-900 text-sm font-semibold tabular-nums">
												{formatPresetStatValue(value, field.unit)}
											</span>
										</div>
									)
								}

								return (
									<div key={field.id} className="flex flex-col gap-1.5">
										<Label htmlFor={inputId}>{field.label}</Label>
										<div className="relative">
											<Input
												id={inputId}
												type="text"
												inputMode="decimal"
												value={value === 0 ? '' : String(value)}
												placeholder="0"
												onChange={(event) => handleChange(field.id, event.target.value)}
												className={cn('tabular-nums', field.unit === 'percent' && 'pr-8')}
												autoComplete="off"
											/>
											{field.unit === 'percent' ? (
												<span className="text-grayscale-400 pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-sm">
													%
												</span>
											) : null}
										</div>
									</div>
								)
							})}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default CompanionPresetStatsFields
