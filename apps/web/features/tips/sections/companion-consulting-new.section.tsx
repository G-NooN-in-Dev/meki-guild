'use client'

import { Badge } from '@shared/ui/badge'
import { Button, buttonVariants } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { toast } from '@shared/ui/sonner'
import { Textarea } from '@shared/ui/textarea'
import { cn } from '@shared/ui/utils'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useSyncExternalStore } from 'react'

import CompanionConsultingPasswordDialog from '@/features/tips/components/companion-consulting-password-dialog'
import CompanionOwnershipGrid from '@/features/tips/components/companion-ownership-grid'
import CompanionPresetStatsFields from '@/features/tips/components/companion-preset-stats-fields'
import CompanionSetupBoard from '@/features/tips/components/companion-setup-board'
import {
	createConsultingPostAction,
	updateConsultingPostAction,
	verifyConsultingPostPasswordAction
} from '@/features/tips/lib/companion-consulting.actions'
import {
	CONSULTING_CONTENT_MAX_LENGTH,
	CONSULTING_PASSWORD_MAX_LENGTH,
	CONSULTING_PASSWORD_MIN_LENGTH,
	CONSULTING_TITLE_MAX_LENGTH,
	createDefaultOwnershipStateMap,
	createEmptyConsultingLoadout,
	createEmptyPresetStats,
	getConsultingPostPath,
	ownershipEntriesToAllowedIds,
	ownershipEntriesToLevelMap,
	ownershipEntriesToStateMap,
	ownershipStateToEntries,
	syncLoadoutWithOwnership
} from '@/features/tips/lib/companion-consulting.constants'
import {
	clearConsultingPostEditPassword,
	readConsultingPostEditPassword,
	storeConsultingPostEditPassword
} from '@/features/tips/lib/companion-consulting-edit-password'
import type {
	CompanionConsultingLoadout,
	CompanionConsultingPost,
	CompanionOwnershipStateMap,
	ConsultingPresetStats
} from '@/features/tips/types/companion-consulting.type'

type CompanionConsultingNewSectionProps = {
	/** 있으면 수정 모드 — 초기값으로 채우고 update action을 씁니다. */
	initialPost?: CompanionConsultingPost
}

/** sessionStorage는 같은 탭 안에서만 쓰므로 구독할 이벤트가 없습니다. */
function subscribeConsultingEditPassword() {
	return () => {}
}

/** 현황 게시글 작성·수정: 제목·내용 + 프리셋 + 보유 + 세팅 + CUD 비밀번호 */
function CompanionConsultingNewSection({ initialPost }: CompanionConsultingNewSectionProps) {
	const router = useRouter()
	const isEdit = Boolean(initialPost)
	const shortId = initialPost?.shortId

	const [title, setTitle] = useState(initialPost?.title ?? '')
	const [content, setContent] = useState(initialPost?.content ?? '')
	const [presetStats, setPresetStats] = useState<ConsultingPresetStats>(
		() => initialPost?.presetStats ?? createEmptyPresetStats()
	)
	const [ownership, setOwnership] = useState<CompanionOwnershipStateMap>(() =>
		initialPost ? ownershipEntriesToStateMap(initialPost.ownership) : createDefaultOwnershipStateMap()
	)
	const [loadouts, setLoadouts] = useState<CompanionConsultingLoadout>(
		() => initialPost?.loadout ?? createEmptyConsultingLoadout()
	)
	/** 작성 모드에서만 쓰는 새 비밀번호 입력값 */
	const [createPassword, setCreatePassword] = useState('')
	/** Dialog로 직접 검증한 비밀번호 (sessionStorage에 없을 때) */
	const [verifiedPassword, setVerifiedPassword] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	/** Server Action 대기용. async를 startTransition에 넣으면 push가 씹힐 수 있어 분리합니다. */
	const [isPending, setIsPending] = useState(false)

	// 상세 → 수정 진입 시 sessionStorage에 남은 비밀번호를 effect 없이 읽습니다.
	const storedPassword = useSyncExternalStore(
		subscribeConsultingEditPassword,
		() => (shortId ? readConsultingPostEditPassword(shortId) : null),
		() => null
	)

	const password = isEdit ? (verifiedPassword ?? storedPassword ?? '') : createPassword
	const editUnlocked = !isEdit || verifiedPassword !== null || Boolean(storedPassword)
	const unlockDialogOpen = isEdit && !editUnlocked

	const ownershipEntries = useMemo(() => ownershipStateToEntries(ownership), [ownership])
	const allowedIds = useMemo(() => ownershipEntriesToAllowedIds(ownershipEntries), [ownershipEntries])
	const levelByCompanionId = useMemo(() => ownershipEntriesToLevelMap(ownershipEntries), [ownershipEntries])

	const backHref = initialPost ? getConsultingPostPath(initialPost.shortId) : '/tips/companion-setup'

	function handleOwnershipChange(next: CompanionOwnershipStateMap) {
		setOwnership(next)
		const entries = ownershipStateToEntries(next)
		setLoadouts((current) => syncLoadoutWithOwnership(current, entries))
	}

	async function handleUnlockEdit(nextPassword: string) {
		if (!initialPost) {
			return
		}

		setIsPending(true)
		try {
			const result = await verifyConsultingPostPasswordAction({
				shortId: initialPost.shortId,
				password: nextPassword
			})
			if (!result.ok) {
				toast.error(result.error)
				return
			}

			storeConsultingPostEditPassword(initialPost.shortId, nextPassword)
			setVerifiedPassword(nextPassword)
		} finally {
			setIsPending(false)
		}
	}

	function handleUnlockDialogChange(open: boolean) {
		// Dialog를 닫고 아직 잠금이면 상세로 되돌립니다.
		if (!open && !editUnlocked && initialPost) {
			router.replace(getConsultingPostPath(initialPost.shortId))
		}
	}

	async function handleSubmit() {
		setError(null)
		setIsPending(true)

		const payload = {
			title,
			content,
			presetStats,
			ownership: ownershipEntries,
			loadout: loadouts,
			password
		}

		try {
			const result = isEdit
				? await updateConsultingPostAction({ shortId: initialPost!.shortId, ...payload })
				: await createConsultingPostAction(payload)

			if (!result.ok) {
				setError(result.error)
				toast.error(result.error)
				return
			}

			// 생성과 동일: toast → soft navigate. refresh는 push와 경합해 수정 페이지에 남을 수 있어 쓰지 않습니다.
			if (isEdit && initialPost) {
				clearConsultingPostEditPassword(initialPost.shortId)
			}
			toast.success(isEdit ? '현황이 수정되었습니다.' : `현황이 등록되었습니다. ID: ${result.data.shortId}`)
			router.push(getConsultingPostPath(result.data.shortId))
		} finally {
			setIsPending(false)
		}
	}

	// 수정인데 아직 비밀번호 미확인이면 폼을 가리고 Dialog만 둡니다.
	if (isEdit && !editUnlocked) {
		return (
			<section className="flex w-full min-w-0 flex-col gap-4 md:gap-6">
				<div className="flex flex-col gap-3">
					<Link
						href={backHref}
						className={cn(
							'text-grayscale-600 hover:text-grayscale-900 inline-flex w-fit items-center gap-1.5 text-sm font-medium transition-colors'
						)}
					>
						<ArrowLeftIcon className="size-4" />
						게시글로 돌아가기
					</Link>
					<header className="flex flex-col gap-2">
						<Badge variant="secondary" className="w-fit">
							동료
						</Badge>
						<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">동료 현황 수정</h1>
						<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">
							비밀번호를 확인한 뒤에 수정할 수 있습니다.
						</p>
					</header>
				</div>

				<CompanionConsultingPasswordDialog
					open={unlockDialogOpen}
					onOpenChange={handleUnlockDialogChange}
					title="게시글 수정"
					description="비밀번호를 입력하세요."
					confirmLabel="수정하기"
					isPending={isPending}
					onConfirm={handleUnlockEdit}
				/>
			</section>
		)
	}

	return (
		<section className="flex w-full min-w-0 flex-col gap-4 md:gap-6">
			<div className="flex flex-col gap-3">
				<Link
					href={backHref}
					className={cn(
						'text-grayscale-600 hover:text-grayscale-900 inline-flex w-fit items-center gap-1.5 text-sm font-medium transition-colors'
					)}
					onClick={() => {
						if (initialPost) {
							clearConsultingPostEditPassword(initialPost.shortId)
						}
					}}
				>
					<ArrowLeftIcon className="size-4" />
					{isEdit ? '게시글로 돌아가기' : '목록으로 돌아가기'}
				</Link>

				<header className="flex flex-col gap-2">
					<Badge variant="secondary" className="w-fit">
						동료
					</Badge>
					<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">
						{isEdit ? '동료 현황 수정' : '동료 현황 올리기'}
					</h1>
					<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">
						{isEdit ? '내용을 수정한 뒤 저장하면 반영됩니다.' : '제목·내용(선택)·프리셋 스탯·현재 세팅을 입력하세요.'}
					</p>
				</header>
			</div>

			{/* 작성: 제목·내용 + 비밀번호 / 수정: 이미 Dialog로 확인했으므로 제목·내용만 */}
			<div className="border-grayscale-200 bg-card shadow-soft flex flex-col gap-3 rounded-xl border p-4">
				<div className={cn('flex flex-col gap-3', !isEdit && 'md:flex-row md:items-start')}>
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<Label htmlFor="consulting-title">제목</Label>
						<Input
							id="consulting-title"
							value={title}
							onChange={(event) => setTitle(event.target.value.slice(0, CONSULTING_TITLE_MAX_LENGTH))}
							placeholder="예: 사냥용 세팅 봐주세요"
							autoComplete="off"
						/>
						<p className="text-grayscale-400 text-xs tabular-nums">
							{title.length}/{CONSULTING_TITLE_MAX_LENGTH}
						</p>
					</div>

					{!isEdit ? (
						<div className="flex w-full flex-col gap-2 md:w-44 md:shrink-0">
							<Label htmlFor="consulting-password">비밀번호</Label>
							<Input
								id="consulting-password"
								type="password"
								autoComplete="new-password"
								value={createPassword}
								onChange={(event) => setCreatePassword(event.target.value.slice(0, CONSULTING_PASSWORD_MAX_LENGTH))}
								placeholder={`${CONSULTING_PASSWORD_MIN_LENGTH}자 이상`}
							/>
							<p className="text-grayscale-500 text-xs">수정·삭제용</p>
						</div>
					) : null}
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="consulting-content">내용 (선택)</Label>
					<Textarea
						id="consulting-content"
						className="resize-none"
						value={content}
						onChange={(event) => setContent(event.target.value.slice(0, CONSULTING_CONTENT_MAX_LENGTH))}
						placeholder="원하는 방향, 참고할 점 등을 적어 주세요."
						rows={4}
					/>
					<p className="text-grayscale-400 text-xs tabular-nums">
						{content.length}/{CONSULTING_CONTENT_MAX_LENGTH}
					</p>
				</div>
			</div>

			<CompanionPresetStatsFields stats={presetStats} onStatsChange={setPresetStats} />

			<CompanionOwnershipGrid ownership={ownership} onOwnershipChange={handleOwnershipChange} />

			<CompanionSetupBoard
				title="현재 세팅"
				loadouts={loadouts}
				onLoadoutsChange={setLoadouts}
				allowedIds={allowedIds}
				levelByCompanionId={levelByCompanionId}
			/>

			{error ? <p className="text-destructive text-sm">{error}</p> : null}

			<div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
				<Link
					href={backHref}
					className={cn(buttonVariants({ variant: 'outline' }), 'justify-center')}
					onClick={() => {
						if (initialPost) {
							clearConsultingPostEditPassword(initialPost.shortId)
						}
					}}
				>
					취소
				</Link>
				<Button type="button" disabled={isPending} onClick={handleSubmit}>
					{isPending ? (isEdit ? '저장 중…' : '올리는 중…') : isEdit ? '수정' : '올리기'}
				</Button>
			</div>
		</section>
	)
}

export default CompanionConsultingNewSection
