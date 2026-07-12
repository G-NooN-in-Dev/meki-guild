'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { cn } from '@shared/ui/lib/utils'
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger
} from '@shared/ui/popover'
import { Separator } from '@shared/ui/separator'
import { Slider } from '@shared/ui/slider'
import { FilterIcon, XIcon } from 'lucide-react'
import { useMemo } from 'react'

import JobBadge from '@/features/guild/components/job-badge'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { EXPEDITION_GUILD_TIERS } from '@/libs/expedition-guild-tier.constants'
import { JOB_CLASS_LINE_ORDER, JOBS_BY_CLASS_LINE } from '@/libs/job-class.constants'
import {
	countActiveGuildMemberFilters,
	createEmptyGuildMemberFilter,
	type GuildMemberFilterState,
	type NumberRange
} from '@/utils/filter-guild-members'
import { formatKoreanNumber, formatTrainingScore } from '@/utils/format-korean-number'

type GuildMemberFiltersProps = {
	comparisons: GuildMemberComparison[]
	filter: GuildMemberFilterState
	onFilterChange: (next: GuildMemberFilterState) => void
}

type SliderFieldKey = Exclude<keyof GuildMemberFilterState, 'jobs' | 'expeditionGradeRank'>

type RangeBounds = {
	min: number
	max: number
}

const SLIDER_FIELDS = [
	{ key: 'level', label: '레벨' },
	{ key: 'combatPower', label: '전투력' },
	{ key: 'expeditionScore', label: '토벌전 (점수)' },
	{ key: 'rivalry', label: '대항전' },
	{ key: 'training', label: '수련장' },
	{ key: 'guildBoss', label: '길드보스' }
] as const satisfies ReadonlyArray<{ key: SliderFieldKey; label: string }>

/** 토벌 등급 슬라이더 전체 구간 (1=챌린저1 … 15=마스터5) */
const EXPEDITION_GRADE_BOUNDS = {
	min: 1,
	max: EXPEDITION_GUILD_TIERS.length
} as const satisfies RangeBounds

function getSliderFieldValue(member: GuildMemberComparison, key: SliderFieldKey): number | null {
	switch (key) {
		case 'level':
			return member.level.hasValue ? member.level.current : null
		case 'combatPower':
			return member.combatPower.hasValue ? Number(member.combatPower.current) : null
		case 'expeditionScore':
			return member.expeditionScore.hasValue ? Number(member.expeditionScore.current) : null
		case 'rivalry':
			return member.rivalry.hasValue ? Number(member.rivalry.current) : null
		case 'training':
			return member.training.hasValue ? Number(member.training.current) : null
		case 'guildBoss':
			return member.guildBoss.hasValue ? Number(member.guildBoss.current) : null
	}
}

/** 현재 멤버 데이터에서 슬라이더 min/max 경계를 계산합니다. */
function getSliderBounds(comparisons: GuildMemberComparison[], key: SliderFieldKey): RangeBounds | null {
	let min = Number.POSITIVE_INFINITY
	let max = Number.NEGATIVE_INFINITY

	for (const member of comparisons) {
		const value = getSliderFieldValue(member, key)

		if (value === null) {
			continue
		}

		min = Math.min(min, value)
		max = Math.max(max, value)
	}

	if (!Number.isFinite(min) || !Number.isFinite(max)) {
		return null
	}

	// Slider는 min !== max 가 필요해, 값이 하나뿐일 때 1칸 여유를 둡니다
	if (min === max) {
		return { min, max: min + 1 }
	}

	return { min, max }
}

function getSliderStep({ min, max }: RangeBounds): number {
	const span = max - min

	if (span <= 100) {
		return 1
	}

	if (span <= 10_000) {
		return 10
	}

	if (span <= 1_000_000) {
		return 1_000
	}

	return Math.max(1, Math.round(span / 200))
}

/** 슬라이더 표시값 — 테이블과 같은 한국어 단위(만/억/조)로 맞춰 가독성을 높입니다. */
function formatSliderBound(key: SliderFieldKey, value: number): string {
	const rounded = Math.round(value)

	switch (key) {
		case 'level':
			return `Lv.${rounded}`
		case 'training':
			return formatTrainingScore(BigInt(rounded))
		case 'combatPower':
		case 'expeditionScore':
		case 'rivalry':
		case 'guildBoss':
			return formatKoreanNumber(BigInt(rounded))
	}
}

/** 양쪽 끝이 데이터 경계면 null(필터 없음)로 되돌립니다. */
function sliderValuesToRange(values: readonly number[], bounds: RangeBounds): NumberRange {
	const low = values[0] ?? bounds.min
	const high = values[1] ?? bounds.max

	return {
		min: low <= bounds.min ? null : low,
		max: high >= bounds.max ? null : high
	}
}

function rangeToSliderValues(range: NumberRange, bounds: RangeBounds): [number, number] {
	return [range.min ?? bounds.min, range.max ?? bounds.max]
}

/** 등급 순위(1~15) → 챌린저1 등 표시명 */
function formatGradeRank(rank: number): string {
	return EXPEDITION_GUILD_TIERS[Math.round(rank) - 1]?.rank ?? String(Math.round(rank))
}

/** 계열을 n개씩 묶어 그리드 행으로 씁니다. (예: 3 → 전사·마법사·궁수 / 도적·해적) */
function chunkClassLines<T>(items: readonly T[], size: number): T[][] {
	const chunks: T[][] = []

	for (let index = 0; index < items.length; index += size) {
		chunks.push([...items.slice(index, index + size)])
	}

	return chunks
}

/** 길드원 테이블용 필터 패널(직업 다중 선택 + 점수/등급 range) */
function GuildMemberFilters({ comparisons, filter, onFilterChange }: GuildMemberFiltersProps) {
	const activeCount = countActiveGuildMemberFilters(filter)

	const sliderBoundsByKey = useMemo(() => {
		const next = {} as Record<SliderFieldKey, RangeBounds | null>

		for (const { key } of SLIDER_FIELDS) {
			next[key] = getSliderBounds(comparisons, key)
		}

		return next
	}, [comparisons])

	function patchSliderRange(key: SliderFieldKey, patch: Partial<NumberRange>) {
		onFilterChange({
			...filter,
			[key]: { ...filter[key], ...patch }
		})
	}

	function patchGradeRange(patch: Partial<NumberRange>) {
		onFilterChange({
			...filter,
			expeditionGradeRank: { ...filter.expeditionGradeRank, ...patch }
		})
	}

	function toggleJob(job: string, checked: boolean) {
		const { jobs } = filter
		const nextJobs = checked ? [...jobs, job] : jobs.filter((item) => item !== job)

		onFilterChange({ ...filter, jobs: nextJobs })
	}

	function handleReset() {
		onFilterChange(createEmptyGuildMemberFilter())
	}

	const gradeSliderValue = rangeToSliderValues(filter.expeditionGradeRank, EXPEDITION_GRADE_BOUNDS)
	const gradeLow = gradeSliderValue[0] ?? EXPEDITION_GRADE_BOUNDS.min
	const gradeHigh = gradeSliderValue[1] ?? EXPEDITION_GRADE_BOUNDS.max

	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button variant="outline" size="sm" className="text-grayscale-600 gap-1.5">
						<FilterIcon className="size-4" />
						필터
						{activeCount > 0 ? (
							<Badge variant="secondary" className="h-5 min-w-5 justify-center px-1.5">
								{activeCount}
							</Badge>
						) : null}
					</Button>
				}
			/>
			{/* 헤더(h-14) 아래로 여유를 두고, sticky보다 높은 z-modal에서 표시 */}
			<PopoverContent
				align="end"
				side="bottom"
				sideOffset={8}
				collisionPadding={{ top: 72, bottom: 16, left: 16, right: 16 }}
				className="relative w-88 gap-3 p-4 sm:w-104"
			>
				<PopoverHeader className="flex-row items-start justify-between gap-2 pr-8">
					<div className="flex flex-col gap-0.5">
						<PopoverTitle>필터</PopoverTitle>
						<PopoverDescription hidden />
					</div>
					<Button
						type="button"
						variant="ghost"
						size="xs"
						disabled={activeCount === 0}
						onClick={handleReset}
						className="text-grayscale-500"
					>
						초기화
					</Button>
				</PopoverHeader>
				{/* 수동 닫기 — Dialog와 같은 X 버튼 */}
				<PopoverClose render={<Button variant="ghost" size="icon-sm" className="absolute top-3 right-3" />}>
					<XIcon />
					<span className="sr-only">닫기</span>
				</PopoverClose>

				<div className="max-h-[min(70vh,32rem)] space-y-4 overflow-y-auto pr-1">
					<section className="space-y-2">
						<p className="text-grayscale-700 text-sm font-medium">직업</p>
						<p className="text-grayscale-400 text-xs">여러 개 선택 가능 · 선택 없으면 전체</p>
						<div className="space-y-3">
							{/* 계열 3열 → 그 아래 직업 세로 나열 (전사·마법사·궁수 / 도적·해적) */}
							{chunkClassLines(JOB_CLASS_LINE_ORDER, 3).map((classLines) => (
								<div key={classLines.join('-')} className="grid grid-cols-3 gap-x-2 gap-y-1">
									{classLines.map((classLine) => (
										<div key={classLine} className="flex flex-col gap-1.5">
											<p className="text-grayscale-500 text-xs font-medium">{classLine}</p>
											<div className="flex flex-col gap-1">
												{JOBS_BY_CLASS_LINE[classLine].map((job) => {
													const checked = filter.jobs.includes(job)
													// 직업 선택이 없으면 전체 활성처럼 보이게, 하나라도 고르면 선택분만 강조
													const isDimmed = filter.jobs.length > 0 && !checked

													return (
														<button
															key={job}
															type="button"
															aria-pressed={checked}
															onClick={() => toggleJob(job, !checked)}
															className={cn(
																'rounded-md text-left transition-opacity hover:cursor-pointer',
																isDimmed && 'opacity-35 hover:opacity-70'
															)}
														>
															<JobBadge
																job={job}
																className={cn(
																	'w-full justify-center truncate px-1.5 text-[11px] sm:text-xs',
																	checked && 'ring-primary/40 ring-2 ring-offset-1'
																)}
															/>
														</button>
													)
												})}
											</div>
										</div>
									))}
								</div>
							))}
						</div>
					</section>

					<Separator />

					<section className="space-y-2">
						<div className="flex items-center justify-between gap-2">
							<p className="text-grayscale-700 text-sm font-medium">토벌전 (등급)</p>
							<p className="text-grayscale-500 max-w-[55%] truncate text-right text-xs tabular-nums">
								{formatGradeRank(gradeLow)} ~ {formatGradeRank(gradeHigh)}
							</p>
						</div>
						<Slider
							min={EXPEDITION_GRADE_BOUNDS.min}
							max={EXPEDITION_GRADE_BOUNDS.max}
							step={1}
							minStepsBetweenValues={0}
							value={gradeSliderValue}
							onValueChange={(nextValue) => {
								if (!Array.isArray(nextValue) || nextValue.length < 2) {
									return
								}

								patchGradeRange(sliderValuesToRange(nextValue, EXPEDITION_GRADE_BOUNDS))
							}}
						/>
					</section>

					{SLIDER_FIELDS.map(({ key, label }) => {
						const bounds = sliderBoundsByKey[key]
						const range = filter[key]

						if (bounds === null) {
							return (
								<section key={key} className="space-y-1">
									<p className="text-grayscale-700 text-sm font-medium">{label}</p>
									<p className="text-grayscale-400 text-xs">입력된 값이 없어 조절할 수 없습니다.</p>
								</section>
							)
						}

						const sliderValue = rangeToSliderValues(range, bounds)
						const step = getSliderStep(bounds)

						return (
							<section key={key} className="space-y-2">
								<div className="flex items-center justify-between gap-2">
									<p className="text-grayscale-700 text-sm font-medium">{label}</p>
									<p className="text-grayscale-500 max-w-[70%] truncate text-right text-xs tabular-nums">
										{formatSliderBound(key, sliderValue[0] ?? bounds.min)} ~{' '}
										{formatSliderBound(key, sliderValue[1] ?? bounds.max)}
									</p>
								</div>
								<Slider
									min={bounds.min}
									max={bounds.max}
									step={step}
									minStepsBetweenValues={1}
									value={sliderValue}
									onValueChange={(nextValue) => {
										if (!Array.isArray(nextValue) || nextValue.length < 2) {
											return
										}

										patchSliderRange(key, sliderValuesToRange(nextValue, bounds))
									}}
								/>
							</section>
						)
					})}
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default GuildMemberFilters
