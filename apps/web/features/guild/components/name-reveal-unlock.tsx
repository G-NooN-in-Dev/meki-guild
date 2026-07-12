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
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react'
import { type FormEvent, useState } from 'react'

import { useNameReveal } from '@/features/guild/context/name-reveal.context'

/**
 * 헤더에서 비밀번호로 길드원 실명을 공개/숨김 전환합니다.
 * unlock 상태는 NameRevealProvider(localStorage)에 저장됩니다.
 */
function NameRevealUnlock() {
	const { isUnlocked, lock, unlock } = useNameReveal()
	const [open, setOpen] = useState(false)
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const ok = unlock(password.trim())

		if (!ok) {
			setError('비밀번호가 올바르지 않습니다.')
			return
		}

		setPassword('')
		setError(null)
		setOpen(false)
	}

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen)

		if (!nextOpen) {
			setPassword('')
			setError(null)
		}
	}

	// 이미 해제된 경우: 한 번에 다시 가리기
	if (isUnlocked) {
		return (
			<Button
				type="button"
				variant="outline"
				size="sm"
				className="text-grayscale-600 gap-1.5"
				onClick={lock}
				aria-label="길드원 이름 숨기기"
			>
				<EyeOffIcon className="size-3.5" />
				<span className="xs:inline hidden">이름 숨기기</span>
			</Button>
		)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger
				render={
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="text-grayscale-600 gap-1.5"
						aria-label="길드원 이름 보기"
					>
						<LockIcon className="size-3.5" />
						<span className="xs:inline hidden">이름 보기</span>
					</Button>
				}
			/>
			<DialogContent className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<EyeIcon className="size-4" />
						길드원 이름 보기
					</DialogTitle>
					{/* DialogDescription은 기본이 <p>라서 안에 또 <p>를 넣으면 hydration 오류가 난다 */}
					<DialogDescription>비밀번호를 아는 사람에게만 그 자격이 주어집니다.</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="name-reveal-password">비밀번호</Label>
						<Input
							id="name-reveal-password"
							type="password"
							autoComplete="current-password"
							placeholder="비밀번호 입력"
							value={password}
							onChange={(event) => {
								setPassword(event.target.value)
								if (error) {
									setError(null)
								}
							}}
							aria-invalid={Boolean(error)}
						/>
						{error ? <p className="text-destructive text-xs">{error}</p> : null}
					</div>
					<DialogFooter>
						<Button type="submit" className="w-full sm:w-auto">
							확인
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}

export default NameRevealUnlock
