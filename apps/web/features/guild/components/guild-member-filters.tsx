'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { cn } from '@shared/ui/lib/utils'
import { Separator } from '@shared/ui/separator'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { Slider } from '@shared/ui/slider'
import { FilterIcon, XIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import JobBadge from '@/features/guild/components/job-badge'
import type { GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import useMediaQuery from '@/hooks/use-media-query'
import { EXPEDITION_GUILD_TIERS } from '@/libs/expedition-guild-tier.constants'
import {
	getJobClassLine,
	JOB_CLASS_LINE_ORDER,
	type JobClassLine,
	JOBS_BY_CLASS_LINE
} from '@/libs/job-class.constants'
import {
	countActiveGuildMemberFilters,
	createEmptyGuildMemberFilter,
	type GuildMemberFilterState,
	isJobTaxonomyFilterActive,
	type NumberRange
} from '@/utils/filter-guild-members'
import { formatKoreanNumber, formatTrainingScore } from '@/utils/format-korean-number'

type GuildMemberFiltersProps = {
	comparisons: GuildMemberComparison[]
	filter: GuildMemberFilterState
	onFilterChange: (next: GuildMemberFilterState) => void
}

type SliderFieldKey = Exclude<keyof GuildMemberFilterState, 'classLines' | 'jobs' | 'expeditionGradeRank'>

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

/** Tailwind `md` 브레이크포인트와 동일 (768px) */
const DESKTOP_MEDIA_QUERY = '(min-width: 768px)'

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

/** 직업군을 n개씩 묶어 그리드 행으로 씁니다. (예: 3 → 전사·마법사·궁수 / 도적·해적) */
function chunkClassLines<T>(items: readonly T[], size: number): T[][] {
	const chunks: T[][] = []

	for (let index = 0; index < items.length; index += size) {
		chunks.push([...items.slice(index, index + size)])
	}

	return chunks
}

type FilterPanelBodyProps = {
	comparisons: GuildMemberComparison[]
	filter: GuildMemberFilterState
	onFilterChange: (next: GuildMemberFilterState) => void
}

/** Sheet/Drawer 공통 — 직업 선택 + range 슬라이더 본문 */
function FilterPanelBody({ comparisons, filter, onFilterChange }: FilterPanelBodyProps) {
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
		const { jobs, classLines } = filter
		let nextJobs = checked ? [...jobs, job] : jobs.filter((item) => item !== job)
		let nextClassLines = classLines

		const classLine = getJobClassLine(job)
		if (classLine !== null) {
			const jobsInClassLine = JOBS_BY_CLASS_LINE[classLine]
			const areAllJobsInClassLinePicked = jobsInClassLine.every((jobName) => nextJobs.includes(jobName))

			// 직업군의 모든 직업이 선택되면 직업 개별 선택을 정리하고 직업군만 선택된 상태로 승격
			if (areAllJobsInClassLinePicked) {
				nextJobs = nextJobs.filter((jobName) => !jobsInClassLine.includes(jobName))
				nextClassLines = classLines.includes(classLine) ? classLines : [...classLines, classLine]
			}
		}

		onFilterChange({ ...filter, jobs: nextJobs, classLines: nextClassLines })
	}

	function toggleClassLine(classLine: JobClassLine, checked: boolean) {
		const { classLines } = filter
		const nextClassLines = checked ? [...classLines, classLine] : classLines.filter((item) => item !== classLine)

		onFilterChange({ ...filter, classLines: nextClassLines })
	}

	/**
	 * 표시용 하이라이트 계산.
	 * 직업이 직접 선택됐거나, 해당 직업군이 선택된 경우 활성으로 보여줍니다.
	 */
	function isJobHighlighted(job: string, classLine: JobClassLine): boolean {
		if (filter.jobs.includes(job)) {
			return true
		}

		// 같은 직업군에 선택 직업이 있으면, 해당 직업군은 선택 직업만 강조해 실제 필터 결과와 맞춥니다.
		const hasPickedJobsInClassLine = filter.jobs.some((pickedJob) => getJobClassLine(pickedJob) === classLine)
		if (filter.classLines.includes(classLine) && hasPickedJobsInClassLine) {
			return false
		}

		return filter.classLines.includes(classLine)
	}

	const hasJobTaxonomyFilter = isJobTaxonomyFilterActive(filter)

	const gradeSliderValue = rangeToSliderValues(filter.expeditionGradeRank, EXPEDITION_GRADE_BOUNDS)
	const gradeLow = gradeSliderValue[0] ?? EXPEDITION_GRADE_BOUNDS.min
	const gradeHigh = gradeSliderValue[1] ?? EXPEDITION_GRADE_BOUNDS.max

	return (
		<div className="min-w-0 space-y-4">
			<section className="min-w-0 space-y-2">
				<p className="text-grayscale-700 text-sm font-medium">직업군</p>
				<div className="flex flex-wrap gap-1.5">
					{JOB_CLASS_LINE_ORDER.map((classLine) => {
						const checked = filter.classLines.includes(classLine)
						const isDimmed = hasJobTaxonomyFilter && !checked

						return (
							<button
								key={classLine}
								type="button"
								aria-pressed={checked}
								onClick={() => toggleClassLine(classLine, !checked)}
								className={cn(
									'rounded-md text-left transition-opacity hover:cursor-pointer',
									isDimmed && 'opacity-35 hover:opacity-70'
								)}
							>
								<Badge
									variant="outline"
									className={cn('px-2 py-0.5 text-xs font-medium', checked && 'ring-primary/40 ring-2 ring-offset-1')}
								>
									{classLine}
								</Badge>
							</button>
						)
					})}
				</div>
			</section>

			<section className="min-w-0 space-y-2">
				<p className="text-grayscale-700 text-sm font-medium">직업</p>
				<div className="min-w-0 space-y-3">
					{/* 직업군 3열 → 그 아래 직업 세로 나열 (전사·마법사·궁수 / 도적·해적) */}
					{chunkClassLines(JOB_CLASS_LINE_ORDER, 3).map((classLines) => (
						<div key={classLines.join('-')} className="grid min-w-0 grid-cols-3 gap-x-2 gap-y-1">
							{classLines.map((classLine) => (
								<div key={classLine} className="flex min-w-0 flex-col gap-1.5">
									<p className="text-grayscale-500 truncate text-xs font-medium">{classLine}</p>
									<div className="flex min-w-0 flex-col gap-1">
										{JOBS_BY_CLASS_LINE[classLine].map((job) => {
											const checked = filter.jobs.includes(job)
											const isHighlighted = isJobHighlighted(job, classLine)
											// 직업군·직업 선택이 없으면 전체 활성처럼 보이게, 하나라도 고르면 선택분만 강조
											const isDimmed = hasJobTaxonomyFilter && !isHighlighted

											return (
												<button
													key={job}
													type="button"
													aria-pressed={checked}
													onClick={() => toggleJob(job, !checked)}
													className={cn(
														'min-w-0 rounded-md text-left transition-opacity hover:cursor-pointer',
														isDimmed && 'opacity-35 hover:opacity-70'
													)}
												>
													<JobBadge
														job={job}
														className={cn(
															'w-full max-w-full justify-center truncate px-1.5 text-[11px] sm:text-xs',
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
	)
}

type FilterChromeProps = {
	activeCount: number
	onReset: () => void
}

/** 패널 상단 — 제목 / 초기화 / 닫기 (absolute 닫기는 가려질 수 있어 헤더에 직접 배치) */
function FilterChrome({ activeCount, onReset }: FilterChromeProps) {
	return (
		<div className="flex flex-row items-center justify-between gap-2">
			<SheetTitle>필터</SheetTitle>
			<div className="flex shrink-0 items-center gap-1">
				<Button
					type="button"
					variant="ghost"
					size="xs"
					disabled={activeCount === 0}
					onClick={onReset}
					className="text-grayscale-500"
				>
					초기화
				</Button>
				<SheetClose render={<Button type="button" variant="ghost" size="icon-sm" aria-label="필터 닫기" />}>
					<XIcon className="size-4" />
					<span className="sr-only">닫기</span>
				</SheetClose>
			</div>
		</div>
	)
}

/** Sheet 너비와 맞춰 본문을 밀어 데이터가 가려지지 않게 합니다 (max-w-md = 28rem) */
const FILTER_SHEET_WIDTH = '28rem'

/** 길드원 테이블용 필터 — 모바일 하단 / 데스크탑 오른쪽 Sheet (Base UI) */
function GuildMemberFilters({ comparisons, filter, onFilterChange }: GuildMemberFiltersProps) {
	const [open, setOpen] = useState(false)
	// md 이상은 오른쪽, 미만은 아래에서 올라오는 Sheet
	const isDesktop = useMediaQuery(DESKTOP_MEDIA_QUERY)
	const activeCount = countActiveGuildMemberFilters(filter)
	const sheetSide = isDesktop ? 'right' : 'bottom'

	function handleReset() {
		onFilterChange(createEmptyGuildMemberFilter())
	}

	// 데스크탑에서 오른쪽 Sheet가 열리면 body만 밀어 테이블이 가려지지 않게 함
	// 사이트 헤더는 건드리지 않음 — Sheet는 헤더(h-14) 아래에서 열려 네비 연속성을 유지
	useEffect(() => {
		const { body } = document

		function clearPush() {
			body.style.removeProperty('padding-right')
			body.style.removeProperty('transition')
		}

		if (!open || !isDesktop) {
			clearPush()
			return clearPush
		}

		body.style.transition = 'padding-right 200ms ease-in-out'
		body.style.paddingRight = FILTER_SHEET_WIDTH

		return clearPush
	}, [open, isDesktop])

	return (
		<>
			<Button
				type="button"
				variant="outline"
				size="sm"
				className="text-grayscale-600 gap-1.5"
				aria-expanded={open}
				onClick={() => setOpen(true)}
			>
				<FilterIcon className="size-4" />
				필터
				{activeCount > 0 ? (
					<Badge variant="secondary" className="h-5 min-w-5 justify-center px-1.5">
						{activeCount}
					</Badge>
				) : null}
			</Button>

			{/*
			  modal=false: 뒤 테이블 스크롤·확인 가능
			  disablePointerDismissal: 테이블 클릭해도 패널이 바로 닫히지 않음
			  showOverlay=false: 딤/블러 없이 데이터를 선명하게 봄
			*/}
			<Sheet open={open} onOpenChange={setOpen} modal={false} disablePointerDismissal>
				<SheetContent
					side={sheetSide}
					showOverlay={false}
					showCloseButton={false}
					className={cn(
						'max-w-full min-w-0 gap-0 overflow-x-hidden',
						// 모바일: 하단 시트 / 데스크탑: 사이트 헤더(h-14) 아래에서 열어 상단 네비가 잘리지 않게 함
						// inset-y-0·h-full과 충돌하지 않도록 top/bottom·height를 개별 지정
						isDesktop
							? 'w-full data-[side=right]:inset-y-auto data-[side=right]:top-14 data-[side=right]:right-0 data-[side=right]:bottom-0 data-[side=right]:h-auto sm:max-w-md'
							: 'h-auto max-h-[50vh] w-full overflow-hidden'
					)}
				>
					<SheetHeader className="border-border shrink-0 border-b">
						<FilterChrome activeCount={activeCount} onReset={handleReset} />
						<SheetDescription hidden />
					</SheetHeader>
					{/* min-h-0: flex 자식이 max-h 안에서 줄어들며 overflow-y 스크롤이 생기게 함 */}
					<div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-4">
						<FilterPanelBody comparisons={comparisons} filter={filter} onFilterChange={onFilterChange} />
					</div>
				</SheetContent>
			</Sheet>
		</>
	)
}

export default GuildMemberFilters
