'use client'

import { Button } from '@shared/ui/button'
import { Label } from '@shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'
import { toast } from '@shared/ui/sonner'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useMemo, useState } from 'react'

import GuildSheetTabFieldInputs from '@/features/guild/components/guild-sheet-form-fields'
import MemberSelect, { type MemberSelectOption } from '@/features/guild/components/member-select'
import { loadGuildSheetRowFields } from '@/features/guild/lib/load-guild-sheet-row.action'
import { GUILD_SHEET_TAB_INPUT_FIELDS, type GuildSheetMemberTab } from '@/features/guild/lib/sheet-form.schema'
import { submitGuildSheetForm } from '@/features/guild/lib/submit-guild-sheet-form.action'
import { INITIAL_SUBMIT_GUILD_SHEET_FORM_STATE } from '@/features/guild/lib/submit-guild-sheet-form.state'
import type { GuildMemberInput } from '@/features/guild/types/guild-snapshot.type'
import {
	getGuildRegisterItemOptions,
	type GuildRegisterItemOption
} from '@/features/guild-v2/lib/guild-register-item-options'

type GuildRegisterFormProps = {
	members: MemberSelectOption[]
	previousMembers: GuildMemberInput[]
}

function emptyFieldsForTab(tab: GuildSheetMemberTab): Record<string, string> {
	return Object.fromEntries(GUILD_SHEET_TAB_INPUT_FIELDS[tab].map((field) => [field, '']))
}

/** 기존 행이 없을 때 현상수배 클리어 단계 초기값 = 직전 기록 */
function getBountyDefault(name: string | null, previousByName: Map<string, GuildMemberInput>): string {
	if (!name) {
		return ''
	}

	const previous = previousByName.get(name)
	const bounty = previous?.bounty

	if (bounty === undefined || bounty === null || !Number.isFinite(bounty) || bounty <= 0) {
		return ''
	}

	return String(bounty)
}

/**
 * v2 데이터 등록 폼.
 * 길드원 → 항목(회차 포함) → 필드. 제출·프리필은 운영 Sheet 폼과 동일합니다.
 */
function GuildRegisterForm({ members, previousMembers }: GuildRegisterFormProps) {
	const router = useRouter()
	const itemOptions = useMemo(() => getGuildRegisterItemOptions(), [])
	const [name, setName] = useState<string | null>(null)
	const [selectedTab, setSelectedTab] = useState<GuildSheetMemberTab | null>(null)
	const [fields, setFields] = useState<Record<string, string>>({})
	const [hasExistingRow, setHasExistingRow] = useState(false)
	const [isLoadingDefaults, setIsLoadingDefaults] = useState(false)
	const [state, formAction, isPending] = useActionState(submitGuildSheetForm, INITIAL_SUBMIT_GUILD_SHEET_FORM_STATE)

	const previousByName = useMemo(
		() => new Map(previousMembers.map((member) => [member.name, member])),
		[previousMembers]
	)

	const selectedOption: GuildRegisterItemOption | null =
		itemOptions.find((option) => option.tab === selectedTab && !option.disabled) ?? null

	const tab = selectedOption?.tab ?? null
	const collectedAt = selectedOption?.collectedAt ?? ''

	useEffect(() => {
		if (!state.message) {
			return
		}

		if (state.ok) {
			toast.success(state.message)
			router.push('/guild/v2')
			return
		}

		toast.error(state.message)
	}, [state.ok, state.message, router])

	/** 길드원·항목 선택 시 Sheet 기존 행 → 없으면 현상수배만 직전 기록 값 */
	useEffect(() => {
		if (!name || !tab || !collectedAt) {
			return
		}

		let cancelled = false

		async function loadDefaults() {
			setIsLoadingDefaults(true)

			try {
				const existing = await loadGuildSheetRowFields({ tab: tab!, collectedAt, name: name! })

				if (cancelled) {
					return
				}

				if (existing) {
					setFields(existing)
					setHasExistingRow(true)
					toast.info('기존에 등록된 데이터가 존재합니다. 수정 모드로 전환합니다.')
					return
				}

				setHasExistingRow(false)

				if (tab === 'bounty') {
					setFields({ bounty: getBountyDefault(name, previousByName) })
					return
				}

				setFields(emptyFieldsForTab(tab!))
			} catch {
				if (cancelled) {
					return
				}

				setHasExistingRow(false)

				if (tab === 'bounty') {
					setFields({ bounty: getBountyDefault(name, previousByName) })
					return
				}

				setFields(emptyFieldsForTab(tab!))
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

	function handleNameChange(nextName: string) {
		setName(nextName)
		setHasExistingRow(false)
	}

	function handleItemChange(nextTab: string | null) {
		if (!nextTab) {
			return
		}

		const option = itemOptions.find((item) => item.tab === nextTab)

		if (!option || option.disabled) {
			return
		}

		setSelectedTab(option.tab)
		setHasExistingRow(false)
		setFields(emptyFieldsForTab(option.tab))
	}

	function patchField(field: string, value: string) {
		setFields((prev) => ({ ...prev, [field]: value }))
	}

	const canSubmit = Boolean(name && selectedOption && !isLoadingDefaults)

	return (
		<form action={formAction} className="flex flex-col gap-4">
			<input type="hidden" name="tab" value={tab ?? ''} />
			<input type="hidden" name="collectedAt" value={collectedAt} />
			<input type="hidden" name="name" value={name ?? ''} />

			<MemberSelect label="길드원" members={members} value={name} onValueChange={handleNameChange} />

			<div className="flex flex-col gap-2">
				<Label htmlFor="guild-register-item">항목</Label>
				{itemOptions.length === 0 ? (
					<p className="text-grayscale-500 text-sm">등록 가능한 항목이 없습니다.</p>
				) : (
					<Select value={selectedTab} onValueChange={handleItemChange} disabled={!name}>
						<SelectTrigger id="guild-register-item" className="w-full">
							<SelectValue placeholder={name ? '항목을 선택하세요' : '길드원을 먼저 선택하세요'}>
								{(value: string | null) => itemOptions.find((option) => option.tab === value)?.label ?? null}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{itemOptions.map((option) => {
								const { tab, label, disabled } = option
								return (
									<SelectItem key={tab} value={tab} disabled={disabled}>
										{label}
										{disabled ? ' (예정)' : ''}
									</SelectItem>
								)
							})}
						</SelectContent>
					</Select>
				)}
			</div>

			{selectedOption ? (
				<>
					{isLoadingDefaults ? <p className="text-grayscale-500 text-sm">기존 데이터를 불러오는 중…</p> : null}

					{hasExistingRow && !isLoadingDefaults ? (
						<p className="text-grayscale-500 text-sm">기존에 등록된 데이터가 존재합니다. 수정 모드로 전환합니다.</p>
					) : null}

					<GuildSheetTabFieldInputs
						tab={selectedOption.tab}
						fields={fields}
						patchField={patchField}
						isLoadingDefaults={isLoadingDefaults}
					/>

					{state.message ? (
						<p className={state.ok ? 'text-pastel-green-800 text-sm' : 'text-pastel-red-700 text-sm'} role="status">
							{state.message}
						</p>
					) : null}

					<div className="flex justify-end">
						<Button type="submit" disabled={!canSubmit || isPending}>
							{isPending ? (hasExistingRow ? '수정 중…' : '등록 중…') : hasExistingRow ? '수정하기' : '제출하기'}
						</Button>
					</div>
				</>
			) : null}
		</form>
	)
}

export default GuildRegisterForm
