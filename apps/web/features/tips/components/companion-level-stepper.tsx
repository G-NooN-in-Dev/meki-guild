'use client'

import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { cn } from '@shared/ui/utils'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { type ChangeEvent, type KeyboardEvent, useState } from 'react'

type CompanionLevelStepperProps = {
	level: number
	maxLevel: number
	onLevelChange: (level: number) => void
	/** 슬롯 카드 안에서 쓸 때 부모 클릭(슬롯 선택)과 충돌하지 않도록 */
	compact?: boolean
	className?: string
}

/** 입력값을 1~maxLevel 정수로 보정합니다. 비어 있거나 잘못된 값이면 null */
function parseLevelDraft(raw: string, maxLevel: number) {
	const trimmed = raw.trim()
	if (trimmed === '') {
		return null
	}

	const parsed = Number(trimmed)
	if (!Number.isFinite(parsed)) {
		return null
	}

	return Math.min(maxLevel, Math.max(1, Math.floor(parsed)))
}

/**
 * 동료 레벨 조절.
 * +/−뿐 아니라 숫자 직접 입력·MAX 바로가기로 높은 레벨도 빠르게 맞출 수 있습니다.
 */
function CompanionLevelStepper({
	level,
	maxLevel,
	onLevelChange,
	compact = false,
	className
}: CompanionLevelStepperProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [draft, setDraft] = useState(String(level))
	const canDecrease = level > 1
	const canIncrease = level < maxLevel
	const displayValue = isEditing ? draft : String(level)

	function commitDraft(raw: string) {
		const nextLevel = parseLevelDraft(raw, maxLevel)
		setIsEditing(false)

		if (nextLevel === null) {
			return
		}

		if (nextLevel !== level) {
			onLevelChange(nextLevel)
		}
	}

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		// 숫자만 허용 (빈 문자열은 입력 중 삭제용으로 유지)
		const next = event.target.value
		if (next !== '' && !/^\d+$/.test(next)) {
			return
		}
		setDraft(next)
	}

	function handleInputFocus() {
		setIsEditing(true)
		setDraft(String(level))
	}

	function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === 'Enter') {
			event.preventDefault()
			commitDraft(draft)
			event.currentTarget.blur()
		}
	}

	return (
		<div
			className={cn('flex flex-wrap items-center', compact ? 'gap-0.5' : 'gap-1', className)}
			onClick={(event) => event.stopPropagation()}
			onKeyDown={(event) => event.stopPropagation()}
		>
			<Button
				type="button"
				variant="outline"
				size="icon-xs"
				disabled={!canDecrease}
				aria-label="레벨 감소"
				onClick={() => onLevelChange(level - 1)}
			>
				<MinusIcon className="size-3" />
			</Button>

			<div className="flex items-center gap-0.5">
				<span className="text-grayscale-500 text-xs">Lv.</span>
				{/* type=number 스피너가 글자를 가려서 text + inputMode로 처리 */}
				<Input
					type="text"
					inputMode="numeric"
					pattern="[0-9]*"
					value={displayValue}
					aria-label={`레벨 입력 (1–${maxLevel})`}
					onChange={handleInputChange}
					onFocus={handleInputFocus}
					onBlur={() => commitDraft(draft)}
					onKeyDown={handleInputKeyDown}
					className={cn(
						'text-grayscale-900 h-6 w-9 min-w-0 px-1 text-center text-xs leading-none font-semibold tabular-nums shadow-none md:text-xs'
					)}
				/>
				<span className="text-grayscale-400 text-xs tabular-nums">/{maxLevel}</span>
			</div>

			<Button
				type="button"
				variant="outline"
				size="icon-xs"
				disabled={!canIncrease}
				aria-label="레벨 증가"
				onClick={() => onLevelChange(level + 1)}
			>
				<PlusIcon className="size-3" />
			</Button>

			<Button
				type="button"
				variant="secondary"
				size="xs"
				disabled={level >= maxLevel}
				aria-label={`최대 레벨 ${maxLevel}로 설정`}
				className="px-1.5"
				onClick={() => onLevelChange(maxLevel)}
			>
				MAX
			</Button>
		</div>
	)
}

export default CompanionLevelStepper
