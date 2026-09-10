'use client'

import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select'

import {
	GUILD_SHEET_FIELD_LABELS,
	GUILD_SHEET_KOREAN_NUMBER_PLACEHOLDERS,
	GUILD_SHEET_TAB_INPUT_FIELDS,
	type GuildSheetMemberTab,
	isGuildSheetKoreanNumberField
} from '@/features/guild/lib/sheet-form.schema'
import { EXPEDITION_GUILD_TIERS } from '@/libs/expedition-guild-tier.constants'
import { JOB_CLASS_LINE_ORDER, JOBS_BY_CLASS_LINE } from '@/libs/job-class.constants'

const JOB_OPTIONS = JOB_CLASS_LINE_ORDER.flatMap((classLine) => [...JOBS_BY_CLASS_LINE[classLine]])
const EXPEDITION_GRADE_OPTIONS = EXPEDITION_GUILD_TIERS.map((tier) => tier.rank)

type GuildSheetTabFieldInputsProps = {
	tab: GuildSheetMemberTab
	fields: Record<string, string>
	patchField: (field: string, value: string) => void
	isLoadingDefaults: boolean
}

/** 선택된 탭에 맞는 Sheet 입력 필드(job/grade Select, 숫자·한국어 숫자 Input) */
function GuildSheetTabFieldInputs({ tab, fields, patchField, isLoadingDefaults }: GuildSheetTabFieldInputsProps) {
	return (
		<>
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
		</>
	)
}

export default GuildSheetTabFieldInputs
