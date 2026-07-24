'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'
import { cn } from '@shared/ui/utils'
import { useEffect, useState } from 'react'

import CompanionLevelStepper from '@/features/tips/components/companion-level-stepper'
import CompanionPortrait from '@/features/tips/components/companion-portrait'
import {
	COMPANION_GRADE_BADGE_CLASS,
	COMPANION_GRADE_MAX_LEVEL,
	COMPANION_GRADE_META,
	COMPANION_GRADE_ORDER,
	COMPANION_GRADE_TAB_CLASS,
	COMPANIONS,
	resolveEquipEffects
} from '@/features/tips/lib/companion-setup.constants'
import type { Companion, CompanionGrade, CompanionSetupSlot } from '@/features/tips/types/companion.type'
import useMediaQuery from '@/hooks/use-media-query'

type CompanionSlotEditorProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	slot: CompanionSetupSlot | null
	companion: Companion | null
	level: number
	excludedIds: ReadonlySet<string>
	/**
	 * 있으면 이 집합에 있는 동료만 선택 가능 (보유 현황 제한).
	 * null/undefined면 전체 카탈로그.
	 */
	allowedIds?: ReadonlySet<string> | null
	/** 보유 레벨이 고정일 때 레벨 조절 UI 숨김 */
	lockLevel?: boolean
	onSelect: (companion: Companion) => void
	onClear: () => void
	onLevelChange: (level: number) => void
}

/** Sheet 너비와 맞춰 본문을 밀어 보드가 가려지지 않게 합니다 (sm:max-w-md = 28rem) */
const COMPANION_SHEET_WIDTH = '28rem'

/** Sheet가 열린 슬롯 id. 닫히면 null — 열릴 때마다 등급 탭을 다시 맞출 때 씁니다. */
function getOpenSlotKey(open: boolean, slot: CompanionSetupSlot | null) {
	return open && slot ? slot.id : null
}

function isCompanionGrade(value: string | number | null): value is CompanionGrade {
	return typeof value === 'string' && (COMPANION_GRADE_ORDER as readonly string[]).includes(value)
}

/** 슬롯 클릭 시 열리는 동료 선택·레벨 조절 패널 */
function CompanionSlotEditor({
	open,
	onOpenChange,
	slot,
	companion,
	level,
	excludedIds,
	allowedIds = null,
	lockLevel = false,
	onSelect,
	onClear,
	onLevelChange
}: CompanionSlotEditorProps) {
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const openSlotKey = getOpenSlotKey(open, slot)
	const [gradeTab, setGradeTab] = useState<CompanionGrade>('legendary')
	// Sheet를 열거나 슬롯이 바뀔 때만 탭을 맞추고, 동료 선택 중에는 건드리지 않습니다.
	const [syncedOpenSlotKey, setSyncedOpenSlotKey] = useState<string | null>(null)
	const equipEffects = companion ? resolveEquipEffects(companion.job, companion.grade, level) : []

	// 데스크탑에서 오른쪽 Sheet가 열리면 body만 밀어 세팅 보드가 가려지지 않게 함
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
		body.style.paddingRight = COMPANION_SHEET_WIDTH

		return clearPush
	}, [open, isDesktop])

	if (openSlotKey !== syncedOpenSlotKey) {
		setSyncedOpenSlotKey(openSlotKey)
		if (openSlotKey !== null) {
			setGradeTab(companion?.grade ?? 'legendary')
		}
	}

	return (
		/*
		  modal=false: 뒤 보드 클릭·스크롤 가능
		  disablePointerDismissal: 보드 클릭해도 패널이 바로 닫히지 않음 (다른 슬롯으로 전환 가능)
		  showOverlay=false: 딤/블러 없이 보드를 선명하게 봄
		*/
		<Sheet open={open} onOpenChange={onOpenChange} modal={false} disablePointerDismissal>
			<SheetContent
				side={isDesktop ? 'right' : 'bottom'}
				showOverlay={false}
				className={cn(
					'z-modal gap-0 p-0',
					// 데스크탑: 사이트 헤더(h-14) 아래에서 열어 상단 네비가 잘리지 않게 함
					isDesktop
						? 'w-full data-[side=right]:inset-y-auto data-[side=right]:top-14 data-[side=right]:right-0 data-[side=right]:bottom-0 data-[side=right]:h-auto sm:max-w-md'
						: 'max-h-[85dvh] rounded-t-2xl'
				)}
			>
				<SheetHeader className="border-grayscale-200 border-b">
					<SheetTitle>{slot?.label ?? '동료 슬롯'}</SheetTitle>
					<SheetDescription>
						{allowedIds
							? '보유한 동료만 선택할 수 있습니다. 등급을 고른 뒤 동료를 선택하세요.'
							: '등급을 고른 뒤 동료를 선택하고 레벨을 조절하세요.'}
					</SheetDescription>
				</SheetHeader>

				<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
					{companion ? (
						<div className="border-grayscale-200 bg-grayscale-50 flex flex-col gap-3 rounded-xl border p-3">
							<div className="flex items-center gap-3">
								<CompanionPortrait src={companion.imageSrc} alt={companion.name} grade={companion.grade} size="lg" />
								<div className="min-w-0 space-y-1">
									<Badge className={COMPANION_GRADE_BADGE_CLASS[companion.grade]}>
										{COMPANION_GRADE_META[companion.grade].tierLabel} ({COMPANION_GRADE_META[companion.grade].label})
									</Badge>
									<p className="text-grayscale-900 font-semibold">{companion.name}</p>
									{lockLevel ? <p className="text-grayscale-600 text-sm tabular-nums">Lv.{level}</p> : null}
								</div>
							</div>
							{!lockLevel ? (
								<CompanionLevelStepper
									level={level}
									maxLevel={COMPANION_GRADE_MAX_LEVEL[companion.grade]}
									onLevelChange={onLevelChange}
								/>
							) : null}
							<ul className="text-grayscale-700 list-inside list-disc text-sm">
								{equipEffects.map((effect) => (
									<li key={effect.label}>{effect.displayText}</li>
								))}
							</ul>
						</div>
					) : (
						<p className="text-grayscale-500 text-sm">아직 비어 있습니다. 아래에서 동료를 골라 주세요.</p>
					)}

					{/* 제어 Tabs — 동료 선택으로 grade가 바뀌어도 defaultValue를 바꾸지 않습니다. */}
					<Tabs
						value={gradeTab}
						onValueChange={(value) => {
							if (isCompanionGrade(value)) {
								setGradeTab(value)
							}
						}}
						className="gap-3"
					>
						<TabsList className="grid w-full grid-cols-3">
							{COMPANION_GRADE_ORDER.map((grade) => (
								<TabsTrigger
									key={grade}
									value={grade}
									className={cn('text-xs md:text-sm', COMPANION_GRADE_TAB_CLASS[grade])}
								>
									{COMPANION_GRADE_META[grade].label}
								</TabsTrigger>
							))}
						</TabsList>

						{COMPANION_GRADE_ORDER.map((grade) => (
							<TabsContent key={grade} value={grade} className="mt-0">
								<CompanionGradeOptions
									grade={grade}
									excludedIds={excludedIds}
									allowedIds={allowedIds}
									selectedCompanionId={companion?.id ?? null}
									onSelect={onSelect}
								/>
							</TabsContent>
						))}
					</Tabs>
				</div>

				{companion ? (
					<SheetFooter className="border-grayscale-200 border-t">
						<Button type="button" variant="outline" className="w-full" onClick={onClear}>
							슬롯 비우기
						</Button>
						<Button type="button" className="w-full" onClick={() => onOpenChange(false)}>
							완료
						</Button>
					</SheetFooter>
				) : null}
			</SheetContent>
		</Sheet>
	)
}

type CompanionGradeOptionsProps = {
	grade: CompanionGrade
	excludedIds: ReadonlySet<string>
	allowedIds?: ReadonlySet<string> | null
	selectedCompanionId: string | null
	onSelect: (companion: Companion) => void
}

function CompanionGradeOptions({
	grade,
	excludedIds,
	allowedIds = null,
	selectedCompanionId,
	onSelect
}: CompanionGradeOptionsProps) {
	const companions = COMPANIONS.filter((item) => item.grade === grade)

	return (
		// Sheet 폭이 좁아 데스크탑에서도 2열 유지
		<div className="grid grid-cols-2 gap-1.5">
			{companions.map((item) => {
				const excluded = excludedIds.has(item.id)
				const notAllowed = allowedIds ? !allowedIds.has(item.id) : false
				const selected = selectedCompanionId === item.id
				const disabled = (excluded || notAllowed) && !selected

				return (
					<button
						key={item.id}
						type="button"
						disabled={disabled}
						onClick={() => onSelect(item)}
						className={cn(
							'border-grayscale-200 flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-sm font-medium transition-colors',
							'hover:border-grayscale-300 hover:bg-grayscale-50',
							'focus-visible:ring-grayscale-900 focus-visible:ring-2 focus-visible:outline-none',
							'disabled:cursor-not-allowed disabled:opacity-35',
							notAllowed && !selected && 'opacity-40 grayscale',
							selected && 'border-grayscale-900 bg-grayscale-50 ring-grayscale-900/10 ring-1'
						)}
					>
						<CompanionPortrait src={item.imageSrc} alt={item.name} grade={item.grade} size="sm" />
						<span className="text-grayscale-800 truncate">{item.name}</span>
					</button>
				)
			})}
		</div>
	)
}

export default CompanionSlotEditor
