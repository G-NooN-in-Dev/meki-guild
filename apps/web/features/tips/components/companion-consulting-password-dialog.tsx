'use client'

import { Button } from '@shared/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@shared/ui/dialog'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { useState } from 'react'

import {
	CONSULTING_PASSWORD_MAX_LENGTH,
	CONSULTING_PASSWORD_MIN_LENGTH
} from '@/features/tips/lib/companion-consulting.constants'

type CompanionConsultingPasswordDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	description: string
	confirmLabel: string
	/** destructive 스타일 (삭제 확인용) */
	destructive?: boolean
	isPending?: boolean
	onConfirm: (password: string) => void | Promise<void>
}

type PasswordDialogFormProps = Omit<CompanionConsultingPasswordDialogProps, 'open'>

/**
 * 다이얼로그가 열릴 때마다 마운트되어 비밀번호 입력을 처음부터 시작합니다.
 * open=false일 때 언마운트하므로 useEffect로 초기화할 필요가 없습니다.
 */
function PasswordDialogForm({
	onOpenChange,
	title,
	description,
	confirmLabel,
	destructive = false,
	isPending = false,
	onConfirm
}: PasswordDialogFormProps) {
	const [password, setPassword] = useState('')

	async function handleConfirm() {
		await onConfirm(password)
	}

	return (
		<>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
			</DialogHeader>

			<div className="flex flex-col gap-2">
				<Label htmlFor="consulting-cud-password">비밀번호</Label>
				<Input
					id="consulting-cud-password"
					type="password"
					autoComplete="off"
					value={password}
					onChange={(event) => setPassword(event.target.value.slice(0, CONSULTING_PASSWORD_MAX_LENGTH))}
					placeholder={`${CONSULTING_PASSWORD_MIN_LENGTH}자 이상`}
					onKeyDown={(event) => {
						if (event.key === 'Enter' && !isPending && password.trim().length > 0) {
							void handleConfirm()
						}
					}}
				/>
			</div>

			<DialogFooter>
				<Button type="button" variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>
					취소
				</Button>
				<Button
					type="button"
					variant={destructive ? 'destructive' : 'default'}
					disabled={isPending || password.trim().length < CONSULTING_PASSWORD_MIN_LENGTH}
					onClick={() => void handleConfirm()}
				>
					{isPending ? '처리 중…' : confirmLabel}
				</Button>
			</DialogFooter>
		</>
	)
}

/**
 * CUD용 비밀번호 확인 다이얼로그.
 * 계정 로그인이 아니라, 글/댓글을 수정·삭제할 때 쓰는 단순 키 입력입니다.
 */
function CompanionConsultingPasswordDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel,
	destructive = false,
	isPending = false,
	onConfirm
}: CompanionConsultingPasswordDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				{/* 열릴 때만 폼을 마운트해, 닫힌 뒤 비밀번호가 남지 않게 합니다. */}
				{open ? (
					<PasswordDialogForm
						onOpenChange={onOpenChange}
						title={title}
						description={description}
						confirmLabel={confirmLabel}
						destructive={destructive}
						isPending={isPending}
						onConfirm={onConfirm}
					/>
				) : null}
			</DialogContent>
		</Dialog>
	)
}

export default CompanionConsultingPasswordDialog
