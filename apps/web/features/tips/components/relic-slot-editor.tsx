'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@shared/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@shared/ui/tabs'
import { cn } from '@shared/ui/utils'
import { useEffect, useState } from 'react'

import RelicAwakeningStepper from '@/features/tips/components/relic-awakening-stepper'
import RelicPortrait from '@/features/tips/components/relic-portrait'
import RelicPotentialEditor from '@/features/tips/components/relic-potential-editor'
import {
	getRelicActivationCondition,
	getRelicsByGrade,
	RELIC_GRADE_BADGE_CLASS,
	RELIC_GRADE_META,
	RELIC_GRADE_ORDER,
	RELIC_GRADE_TAB_CLASS,
	resolveRelicEffects
} from '@/features/tips/lib/relic.constants'
import type { Relic, RelicGrade } from '@/features/tips/types/relic.type'
import useMediaQuery from '@/hooks/use-media-query'

type RelicSlotEditorProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	slotLabel: string | null
	relic: Relic | null
	stage: number
	potentialIds: readonly string[]
	excludedIds: ReadonlySet<string>
	/** 보유 유물만 선택 (컨설팅용). 없으면 전체 */
	allowedIds?: ReadonlySet<string> | null
	/** 보유 각성에 맞춰 슬롯 각성 고정 */
	lockStage?: boolean
	onSelect: (relic: Relic) => void
	onClear: () => void
	onStageChange: (stage: number) => void
	onPotentialChange: (potentialIds: readonly string[]) => void
}

/** Sheet 너비와 맞춰 본문을 밀어 보드가 가려지지 않게 합니다 (sm:max-w-md = 28rem) */
const RELIC_SHEET_WIDTH = '28rem'

function isRelicGrade(value: string | number | null): value is RelicGrade {
	return typeof value === 'string' && (RELIC_GRADE_ORDER as readonly string[]).includes(value)
}

/** Sheet가 열리거나 슬롯이 바뀔 때만 등급 탭을 맞추기 위한 키 */
function getOpenSlotKey(open: boolean, slotLabel: string | null) {
	return open ? (slotLabel ?? 'open') : null
}

function RelicSlotEditor({
	open,
	onOpenChange,
	slotLabel,
	relic,
	stage,
	potentialIds,
	excludedIds,
	allowedIds = null,
	lockStage = false,
	onSelect,
	onClear,
	onStageChange,
	onPotentialChange
}: RelicSlotEditorProps) {
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const openSlotKey = getOpenSlotKey(open, slotLabel)
	const [gradeTab, setGradeTab] = useState<RelicGrade>('legendary')
	// Sheet를 열거나 슬롯이 바뀔 때만 탭을 맞추고, 유물 선택 중에는 건드리지 않습니다.
	const [syncedOpenSlotKey, setSyncedOpenSlotKey] = useState<string | null>(null)
	const resolved = relic ? resolveRelicEffects(relic.id, stage) : null
	const activationCondition = relic ? getRelicActivationCondition(relic.id) : undefined

	// 데스크탑에서 오른쪽 Sheet가 열릴 때 본문이 가려지지 않게 여백을 둡니다.
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
		body.style.paddingRight = RELIC_SHEET_WIDTH
		return clearPush
	}, [open, isDesktop])

	if (openSlotKey !== syncedOpenSlotKey) {
		setSyncedOpenSlotKey(openSlotKey)
		if (openSlotKey !== null) {
			setGradeTab(relic?.grade ?? 'legendary')
		}
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange} modal={false} disablePointerDismissal>
			<SheetContent
				side={isDesktop ? 'right' : 'bottom'}
				showOverlay={false}
				className={cn(
					'z-modal gap-0 p-0',
					isDesktop
						? 'w-full data-[side=right]:inset-y-auto data-[side=right]:top-14 data-[side=right]:right-0 data-[side=right]:bottom-0 data-[side=right]:h-auto sm:max-w-md'
						: 'max-h-[85dvh] rounded-t-2xl'
				)}
			>
				<SheetHeader className="border-grayscale-200 border-b">
					<SheetTitle>{slotLabel ?? '유물 슬롯'}</SheetTitle>
					<SheetDescription>
						등급을 고른 뒤 유물을 선택하고 각성·잠재옵션을 조절하세요.
						{lockStage ? ' 각성은 보유 현황에 맞춰 고정됩니다.' : ''}
					</SheetDescription>
				</SheetHeader>

				<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
					{relic ? (
						<div className="border-grayscale-200 bg-grayscale-50 flex flex-col gap-3 rounded-xl border p-3">
							<div className="flex items-center gap-3">
								<RelicPortrait src={relic.imageSrc} alt={relic.name} grade={relic.grade} size="lg" />
								<div className="min-w-0 space-y-1">
									<Badge className={RELIC_GRADE_BADGE_CLASS[relic.grade]}>{RELIC_GRADE_META[relic.grade].label}</Badge>
									<p className="text-grayscale-900 font-semibold">{relic.name}</p>
									{activationCondition ? (
										<p className="text-grayscale-600 text-xs">발동 조건: {activationCondition}</p>
									) : null}
								</div>
							</div>

							<RelicAwakeningStepper stage={stage} onStageChange={onStageChange} disabled={lockStage} />

							<ul className="text-grayscale-700 list-inside list-disc text-sm">
								{resolved?.lines.map((line) => (
									<li key={line}>{line}</li>
								))}
							</ul>

							<div className="border-grayscale-200 border-t pt-3">
								<RelicPotentialEditor
									relicGrade={relic.grade}
									potentialIds={potentialIds}
									onChange={onPotentialChange}
								/>
							</div>
						</div>
					) : (
						<p className="text-grayscale-500 text-sm">아직 비어 있습니다. 아래에서 유물을 골라 주세요.</p>
					)}

					<Tabs
						value={gradeTab}
						onValueChange={(value) => {
							if (isRelicGrade(value)) {
								setGradeTab(value)
							}
						}}
						className="gap-3"
					>
						<TabsList className="grid w-full grid-cols-3">
							{RELIC_GRADE_ORDER.map((grade) => (
								<TabsTrigger
									key={grade}
									value={grade}
									className={cn('text-xs md:text-sm', RELIC_GRADE_TAB_CLASS[grade])}
								>
									{RELIC_GRADE_META[grade].label}
								</TabsTrigger>
							))}
						</TabsList>

						{RELIC_GRADE_ORDER.map((grade) => (
							<TabsContent key={grade} value={grade} className="mt-0">
								<div className="grid grid-cols-2 gap-1.5">
									{getRelicsByGrade(grade).map((item) => {
										const excluded = excludedIds.has(item.id)
										const notAllowed = allowedIds !== null && !allowedIds.has(item.id)
										const selected = relic?.id === item.id
										const disabled = (excluded && !selected) || (notAllowed && !selected)

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
													selected && 'border-grayscale-900 bg-grayscale-50 ring-grayscale-900/10 ring-1'
												)}
											>
												<RelicPortrait src={item.imageSrc} alt={item.name} grade={item.grade} size="sm" />
												<span className="text-grayscale-800 truncate">{item.name}</span>
											</button>
										)
									})}
								</div>
							</TabsContent>
						))}
					</Tabs>
				</div>

				{relic ? (
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

export default RelicSlotEditor
