'use client'

import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { cn } from '@shared/ui/utils'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { type ChangeEvent, type KeyboardEvent, useState } from 'react'

type RelicAwakeningStepperProps = {
	stage: number
	onStageChange: (stage: number) => void
	className?: string
}

const MAX_STAGE = 5

function parseStageDraft(raw: string) {
	const trimmed = raw.trim()
	if (trimmed === '') {
		return null
	}

	const parsed = Number(trimmed)
	if (!Number.isFinite(parsed)) {
		return null
	}

	return Math.min(MAX_STAGE, Math.max(0, Math.floor(parsed)))
}

/** 유물 각성 단계(0~5) 조절 UI */
function RelicAwakeningStepper({ stage, onStageChange, className }: RelicAwakeningStepperProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [draft, setDraft] = useState(String(stage))
	const canDecrease = stage > 0
	const canIncrease = stage < MAX_STAGE
	const displayValue = isEditing ? draft : String(stage)

	function commitDraft(raw: string) {
		const nextStage = parseStageDraft(raw)
		setIsEditing(false)

		if (nextStage === null) {
			return
		}

		if (nextStage !== stage) {
			onStageChange(nextStage)
		}
	}

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		const next = event.target.value
		if (next !== '' && !/^\d+$/.test(next)) {
			return
		}
		setDraft(next)
	}

	function handleInputFocus() {
		setIsEditing(true)
		setDraft(String(stage))
	}

	function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === 'Enter') {
			event.preventDefault()
			commitDraft(draft)
			event.currentTarget.blur()
		}
	}

	return (
		<div className={cn('flex items-center gap-1', className)}>
			<Button
				type="button"
				variant="outline"
				size="icon-xs"
				disabled={!canDecrease}
				aria-label="각성 단계 감소"
				onClick={() => onStageChange(stage - 1)}
			>
				<MinusIcon className="size-3" />
			</Button>

			<div className="flex items-center gap-0.5">
				<span className="text-grayscale-500 text-xs">각성</span>
				<Input
					type="text"
					inputMode="numeric"
					pattern="[0-9]*"
					value={displayValue}
					aria-label="각성 단계 입력 (0-5)"
					onChange={handleInputChange}
					onFocus={handleInputFocus}
					onBlur={() => commitDraft(draft)}
					onKeyDown={handleInputKeyDown}
					className="text-grayscale-900 h-6 w-9 min-w-0 px-1 text-center text-xs leading-none font-semibold tabular-nums shadow-none"
				/>
				<span className="text-grayscale-400 text-xs">/5</span>
			</div>

			<Button
				type="button"
				variant="outline"
				size="icon-xs"
				disabled={!canIncrease}
				aria-label="각성 단계 증가"
				onClick={() => onStageChange(stage + 1)}
			>
				<PlusIcon className="size-3" />
			</Button>

			<Button
				type="button"
				variant="secondary"
				size="xs"
				disabled={stage >= MAX_STAGE}
				aria-label="최대 각성 단계로 설정"
				className="px-1.5"
				onClick={() => onStageChange(MAX_STAGE)}
			>
				MAX
			</Button>
		</div>
	)
}

export default RelicAwakeningStepper
