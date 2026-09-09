'use client'

import { Button } from '@shared/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@shared/ui/dialog'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { toast } from '@shared/ui/sonner'
import { PlusIcon } from 'lucide-react'
import { useActionState, useCallback, useEffect, useMemo, useState } from 'react'

import MemberSelect, { type MemberSelectOption } from '@/features/guild/components/member-select'
import { loadGuildSheetRowFields } from '@/features/guild/lib/load-guild-sheet-row.action'
import {
	GUILD_SHEET_FIELD_LABELS,
	GUILD_SHEET_KOREAN_NUMBER_PLACEHOLDERS,
	GUILD_SHEET_MEMBER_TABS,
	GUILD_SHEET_TAB_INPUT_FIELDS,
	GUILD_SHEET_TAB_LABELS,
	type GuildSheetMemberTab,
	isGuildSheetKoreanNumberField
} from '@/features/guild/lib/sheet-form.schema'
import { getGuildSheetRoundOptions } from '@/features/guild/lib/sheet-form-rounds'
import { submitGuildSheetForm } from '@/features/guild/lib/submit-guild-sheet-form.action'
import { INITIAL_SUBMIT_GUILD_SHEET_FORM_STATE } from '@/features/guild/lib/submit-guild-sheet-form.state'
import type { GuildMemberInput } from '@/features/guild/types/guild-snapshot.type'
import { EXPEDITION_GUILD_TIERS } from '@/libs/expedition-guild-tier.constants'
import { JOB_CLASS_LINE_ORDER, JOBS_BY_CLASS_LINE } from '@/libs/job-class.constants'

type CombatPowerDefaults = {
	job: string
	level: string
	combatPower: string
}

type GuildSheetFormDialogProps = {
	members: MemberSelectOption[]
	/** 전투력 탭 프리필용 직전 주 원본 멤버 */
	previousMembers: GuildMemberInput[]
}

const JOB_OPTIONS = JOB_CLASS_LINE_ORDER.flatMap((classLine) => [...JOBS_BY_CLASS_LINE[classLine]])
const EXPEDITION_GRADE_OPTIONS = EXPEDITION_GUILD_TIERS.map((tier) => tier.rank)

function emptyFieldsForTab(tab: GuildSheetMemberTab): Record<string, string> {
	return Object.fromEntries(GUILD_SHEET_TAB_INPUT_FIELDS[tab].map((field) => [field, '']))
}

function getCombatPowerDefaults(
	name: string | null,
	previousByName: Map<string, GuildMemberInput>
): CombatPowerDefaults {
	if (!name) {
		return { job: '', level: '', combatPower: '' }
	}

	const previous = previousByName.get(name)

	if (!previous) {
		return { job: '', level: '', combatPower: '' }
	}

	return {
		job: previous.job ?? '',
		level: previous.level > 0 ? String(previous.level) : '',
		combatPower: previous.combatPower === undefined || previous.combatPower === null ? '' : String(previous.combatPower)
	}
}

type GuildSheetFormFieldsProps = {
	members: MemberSelectOption[]
	previousMembers: GuildMemberInput[]
	onSuccess: () => void
}

/** 제출 성공 시 부모에서 remount 해 action state 를 초기화합니다. */
function GuildSheetFormFields({ members, previousMembers, onSuccess }: GuildSheetFormFieldsProps) {
	const [tab, setTab] = useState<GuildSheetMemberTab>('combatPower')
	const [collectedAt, setCollectedAt] = useState(() => getGuildSheetRoundOptions('combatPower')[0]?.collectedAt ?? '')
	const [name, setName] = useState<string | null>(null)
	const [fields, setFields] = useState<Record<string, string>>(() => emptyFieldsForTab('combatPower'))
	const [hasExistingRow, setHasExistingRow] = useState(false)
	const [isLoadingDefaults, setIsLoadingDefaults] = useState(false)
	const [state, formAction, isPending] = useActionState(submitGuildSheetForm, INITIAL_SUBMIT_GUILD_SHEET_FORM_STATE)

	const previousByName = useMemo(
		() => new Map(previousMembers.map((member) => [member.name, member])),
		[previousMembers]
	)

	const roundOptions = useMemo(() => getGuildSheetRoundOptions(tab), [tab])

	useEffect(() => {
		if (!state.message) {
			return
		}

		if (state.ok) {
			toast.success(state.message)
			onSuccess()
			return
		}

		toast.error(state.message)
	}, [state.ok, state.message, onSuccess])

	/** 회차·길드원 선택 시 Sheet 기존 행 → 없으면 전투력 탭만 직전 주 값 */
	useEffect(() => {
		if (!name || !collectedAt) {
			return
		}

		let cancelled = false

		async function loadDefaults() {
			setIsLoadingDefaults(true)

			try {
				const existing = await loadGuildSheetRowFields({ tab, collectedAt, name: name! })

				if (cancelled) {
					return
				}

				if (existing) {
					setFields(existing)
					setHasExistingRow(true)
					return
				}

				setHasExistingRow(false)

				if (tab === 'combatPower') {
					const defaults = getCombatPowerDefaults(name, previousByName)
					setFields({
						job: defaults.job,
						level: defaults.level,
						combatPower: defaults.combatPower
					})
					return
				}

				setFields(emptyFieldsForTab(tab))
			} catch {
				if (cancelled) {
					return
				}

				setHasExistingRow(false)

				if (tab === 'combatPower') {
					const defaults = getCombatPowerDefaults(name, previousByName)
					setFields({
						job: defaults.job,
						level: defaults.level,
						combatPower: defaults.combatPower
					})
					return
				}

				setFields(emptyFieldsForTab(tab))
			} finally {
				if (!cancelled) {
					setIsLoadingDefaults(false)
				}
			}
		}

		void loadDefaults()

		return () => {
			cancelled = true
		}
	}, [tab, collectedAt, name, previousByName])

	function handleTabChange(nextTab: string | null) {
		if (!nextTab) {
			return
		}

		const tabValue = nextTab as GuildSheetMemberTab
		const nextRounds = getGuildSheetRoundOptions(tabValue)
		setTab(tabValue)
		setCollectedAt(nextRounds[0]?.collectedAt ?? '')
		setName(null)
		setHasExistingRow(false)
		setFields(emptyFieldsForTab(tabValue))
	}

	function handleNameChange(nextName: string) {
		setName(nextName)
		setHasExistingRow(false)
	}

	function patchField(field: string, value: string) {
		setFields((prev) => ({ ...prev, [field]: value }))
	}

	const canSubmit = Boolean(collectedAt && name && roundOptions.length > 0 && !isLoadingDefaults)

	return (
		<form action={formAction} className="flex flex-col gap-4">
			<input type="hidden" name="tab" value={tab} />
			<input type="hidden" name="collectedAt" value={collectedAt} />
			<input type="hidden" name="name" value={name ?? ''} />

			<div className="flex flex-col gap-2">
				<Label htmlFor="guild-sheet-tab">항목</Label>
				<Select value={tab} onValueChange={handleTabChange}>
					<SelectTrigger id="guild-sheet-tab" className="w-full">
						{/* Base UI SelectValue는 기본이 raw value라 한글 라벨을 직접 렌더합니다 */}
						<SelectValue>{() => GUILD_SHEET_TAB_LABELS[tab]}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{GUILD_SHEET_MEMBER_TABS.map((tabKey) => (
							<SelectItem key={tabKey} value={tabKey}>
								{GUILD_SHEET_TAB_LABELS[tabKey]}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="guild-sheet-round">회차</Label>
				{roundOptions.length === 0 ? (
					<p className="text-grayscale-500 text-sm">등록 가능한 이번 회차가 없습니다.</p>
				) : (
					<Select
						value={collectedAt || null}
						onValueChange={(value) => {
							if (value) {
								setCollectedAt(value)
								setHasExistingRow(false)
							}
						}}
					>
						<SelectTrigger id="guild-sheet-round" className="w-full">
							<SelectValue placeholder="회차를 선택하세요">
								{(value: string | null) => roundOptions.find((round) => round.collectedAt === value)?.label ?? null}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{roundOptions.map((round) => (
								<SelectItem key={round.collectedAt} value={round.collectedAt}>
									{round.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</div>

			<MemberSelect label="길드원" members={members} value={name} onValueChange={handleNameChange} />

			{isLoadingDefaults ? <p className="text-grayscale-500 text-sm">기존 데이터를 불러오는 중…</p> : null}

			{hasExistingRow && !isLoadingDefaults ? (
				<p className="text-grayscale-500 text-sm">이미 등록된 데이터가 있어 수정 모드로 열었습니다.</p>
			) : null}

			{GUILD_SHEET_TAB_INPUT_FIELDS[tab].map((field) => {
				const fieldId = `guild-sheet-field-${field}`
				const label = GUILD_SHEET_FIELD_LABELS[field as keyof typeof GUILD_SHEET_FIELD_LABELS]
				const value = fields[field] ?? ''

				if (field === 'job') {
					return (
						<div key={field} className="flex flex-col gap-2">
							<Label htmlFor={fieldId}>{label}</Label>
							<input type="hidden" name={field} value={value} />
							<Select
								value={value || null}
								onValueChange={(next) => {
									if (next) {
										patchField(field, next)
									}
								}}
								disabled={isLoadingDefaults}
							>
								<SelectTrigger id={fieldId} className="w-full">
									<SelectValue placeholder="직업을 선택하세요" />
								</SelectTrigger>
								<SelectContent className="max-h-72">
									{JOB_OPTIONS.map((job) => (
										<SelectItem key={job} value={job}>
											{job}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)
				}

				if (field === 'grade') {
					return (
						<div key={field} className="flex flex-col gap-2">
							<Label htmlFor={fieldId}>{label}</Label>
							<input type="hidden" name={field} value={value} />
							<Select
								value={value || null}
								onValueChange={(next) => {
									if (next) {
										patchField(field, next)
									}
								}}
								disabled={isLoadingDefaults}
							>
								<SelectTrigger id={fieldId} className="w-full">
									<SelectValue placeholder="등급을 선택하세요" />
								</SelectTrigger>
								<SelectContent className="max-h-72">
									{EXPEDITION_GRADE_OPTIONS.map((grade) => (
										<SelectItem key={grade} value={grade}>
											{grade}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)
				}

				const inputType = field === 'level' || field === 'placement' ? 'number' : 'text'
				const isKoreanNumberField = isGuildSheetKoreanNumberField(field)
				const placeholder = isKoreanNumberField ? GUILD_SHEET_KOREAN_NUMBER_PLACEHOLDERS[field] : label

				return (
					<div key={field} className="flex flex-col gap-2">
						<Label htmlFor={fieldId}>{label}</Label>
						<Input
							id={fieldId}
							name={field}
							type={inputType}
							inputMode={inputType === 'number' ? 'numeric' : undefined}
							min={inputType === 'number' ? 1 : undefined}
							value={value}
							placeholder={placeholder}
							onChange={(event) => patchField(field, event.target.value)}
							required
							disabled={isLoadingDefaults}
						/>
						{isKoreanNumberField ? (
							<p className="text-grayscale-500 text-xs">
								{field === 'training'
									? '게임에서 보여지는 형태 그대로 입력하세요.(예: 1000만 101, 9000000)'
									: '경/조/억/만 단위를 포함해 입력하세요.'}
							</p>
						) : null}
					</div>
				)
			})}

			{state.message ? (
				<p className={state.ok ? 'text-pastel-green-800 text-sm' : 'text-pastel-red-700 text-sm'} role="status">
					{state.message}
				</p>
			) : null}

			<DialogFooter className="gap-2 sm:justify-end">
				<Button type="submit" disabled={!canSubmit || isPending}>
					{isPending ? (hasExistingRow ? '수정 중…' : '등록 중…') : hasExistingRow ? '수정하기' : '제출하기'}
				</Button>
			</DialogFooter>
		</form>
	)
}

/**
 * 길드 메인 타이틀 옆 등록 Dialog.
 * 탭 1개 → 이번 회차 → 길드원 → 필드 입력 후 Sheet upsert.
 */
function GuildSheetFormDialog({ members, previousMembers }: GuildSheetFormDialogProps) {
	const [open, setOpen] = useState(false)
	const [formKey, setFormKey] = useState(0)

	const handleSuccess = useCallback(() => {
		setOpen(false)
		setFormKey((prev) => prev + 1)
	}, [])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button type="button" variant="outline" size="sm" className="shrink-0 gap-1.5" />}>
				<PlusIcon className="size-4" />
				데이터 등록
			</DialogTrigger>
			<DialogContent className="max-h-[90dvh] max-w-[calc(100%-(--spacing(4)))] gap-4 overflow-y-auto p-4 sm:max-w-lg sm:gap-5 sm:p-6">
				<DialogHeader>
					<DialogTitle>길드원 데이터 입력</DialogTitle>
					<DialogDescription>
						입력할 항목을 선택하고 데이터를 작성해주세요. 동기화는 추후 한꺼번에 진행됩니다.
					</DialogDescription>
				</DialogHeader>

				<GuildSheetFormFields
					key={formKey}
					members={members}
					previousMembers={previousMembers}
					onSuccess={handleSuccess}
				/>
			</DialogContent>
		</Dialog>
	)
}

export default GuildSheetFormDialog
