'use client'

import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { cn } from '@shared/ui/utils'
import { useState } from 'react'

import {
	CONSULTING_PRESET_STAT_GROUPS,
	formatPresetStatDelta,
	formatPresetStatValue,
	getPresetStatFieldsByGroup
} from '@/features/tips/lib/consulting.constants'
import type { ConsultingPresetStatId, ConsultingPresetStats } from '@/features/tips/types/companion-consulting.type'

type CompanionPresetStatsFieldsProps = {
	stats: ConsultingPresetStats
	onStatsChange?: (next: ConsultingPresetStats) => void
	readOnly?: boolean
	className?: string
	/** 기본: 현재 프리셋 스탯 */
	title?: string
	/** 기본: 게임 프리셋 입력 안내. 예상 프리셋 등에서 덮어씁니다. */
	description?: string
	/** 있으면 읽기 전용 행에 현재 대비 증감 표시 (예상 프리셋용) */
	baseStats?: ConsultingPresetStats
}

/** 숫자·소수점 최대 1자리. 입력 중 `12.` 같은 중간 상태도 통과시킵니다. */
function isPresetStatDraft(raw: string) {
	return raw === '' || /^\d*\.?\d{0,1}$/.test(raw)
}

/**
 * 현재 프리셋 기준 전투 수치.
 * 세트 구분 카드 없이, 행 배치만 세트 단위로 맞춥니다.
 */
function CompanionPresetStatsFields({
	stats,
	onStatsChange,
	readOnly = false,
	className,
	title = '현재 프리셋 스탯',
	description = '게임에 표시된 프리셋 기준 수치를 입력해 주세요.',
	baseStats
}: CompanionPresetStatsFieldsProps) {
	// Number("12.") → 12가 되어 소수점이 사라지므로, 타이핑 중인 문자열을 따로 둡니다.
	const [drafts, setDrafts] = useState<Partial<Record<ConsultingPresetStatId, string>>>({})

	function handleChange(id: ConsultingPresetStatId, raw: string) {
		if (readOnly || !onStatsChange) {
			return
		}

		if (!isPresetStatDraft(raw)) {
			return
		}

		setDrafts((current) => ({ ...current, [id]: raw }))

		if (raw.trim() === '' || raw === '.') {
			onStatsChange({ ...stats, [id]: 0 })
			return
		}

		const parsed = Number(raw)
		if (!Number.isFinite(parsed)) {
			return
		}

		onStatsChange({ ...stats, [id]: parsed })
	}

	function handleBlur(id: ConsultingPresetStatId) {
		setDrafts((current) => {
			if (current[id] === undefined) {
				return current
			}

			const next = { ...current }
			delete next[id]
			return next
		})
	}

	return (
		<div className={cn('flex flex-col gap-3', className)}>
			<div>
				<h2 className="text-grayscale-900 font-semibold">{title}</h2>
				{description ? <p className="text-grayscale-500 text-sm">{description}</p> : null}
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
								const draft = drafts[field.id]
								const displayValue = draft !== undefined ? draft : value === 0 ? '' : String(value)

								if (readOnly) {
									// 예상 프리셋만 baseStats를 넘겨 현재 대비 증감을 옆에 붙입니다.
									const delta = baseStats !== undefined ? value - baseStats[field.id] : 0
									const deltaLabel = baseStats !== undefined ? formatPresetStatDelta(delta, field.unit) : null

									return (
										<div key={field.id} className="flex items-baseline justify-between gap-2">
											<span className="text-grayscale-600 text-sm">{field.label}</span>
											<span className="flex items-baseline gap-1.5 tabular-nums">
												<span className="text-grayscale-900 text-sm font-semibold">
													{formatPresetStatValue(value, field.unit)}
												</span>
												{deltaLabel ? (
													<span
														className={cn(
															'text-xs font-medium',
															delta > 0 && 'text-success-700',
															delta < 0 && 'text-danger-700'
														)}
													>
														({deltaLabel})
													</span>
												) : null}
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
												value={displayValue}
												placeholder="0"
												onChange={(event) => handleChange(field.id, event.target.value)}
												onBlur={() => handleBlur(field.id)}
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
