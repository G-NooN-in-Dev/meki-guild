'use client'

import { Button } from '@shared/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@shared/ui/input-group'
import { Label } from '@shared/ui/label'
import { EyeIcon, EyeOffIcon, LockIcon } from 'lucide-react'
import { type FormEvent, type PropsWithChildren, useState } from 'react'

import { useNameReveal } from '@/features/guild/context/name-reveal.context'

/**
 * 길드 정보 구역 진입 게이트.
 * 기존 이름 공개 비밀번호·localStorage 키를 재사용합니다.
 */
function GuildAccessGate({ children }: PropsWithChildren) {
	const { isUnlocked, unlock } = useNameReveal()
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [showPassword, setShowPassword] = useState(false)

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const ok = unlock(password.trim())

		if (!ok) {
			setError('비밀번호가 올바르지 않습니다.')
			return
		}

		setPassword('')
		setError(null)
		setShowPassword(false)
	}

	if (isUnlocked) {
		return children
	}

	return (
		<div className="min-h-screen-safe flex w-full flex-1 items-center justify-center px-4 py-10 font-sans md:px-6">
			<Card className="border-grayscale-200 shadow-soft w-full max-w-md">
				<CardHeader className="gap-2">
					<CardTitle className="text-grayscale-900 flex items-center gap-2 text-xl font-semibold">
						<LockIcon className="size-5" />
						길드 정보
					</CardTitle>
					<CardDescription className="text-grayscale-600">
						비밀번호를 아는 사람에게만 그 자격이 주어집니다.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="guild-access-password">비밀번호</Label>
							<InputGroup>
								<InputGroupInput
									id="guild-access-password"
									type={showPassword ? 'text' : 'password'}
									autoComplete="current-password"
									placeholder="비밀번호 입력"
									value={password}
									autoFocus
									onChange={(event) => {
										setPassword(event.target.value)
										if (error) {
											setError(null)
										}
									}}
									aria-invalid={Boolean(error)}
								/>
								<InputGroupAddon align="inline-end">
									<InputGroupButton
										type="button"
										size="icon-xs"
										aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
										aria-pressed={showPassword}
										onClick={() => setShowPassword((prev) => !prev)}
									>
										{showPassword ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
									</InputGroupButton>
								</InputGroupAddon>
							</InputGroup>
							{error ? <p className="text-destructive text-xs">{error}</p> : null}
						</div>
						<Button type="submit" className="w-full">
							입장하기
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

export default GuildAccessGate
