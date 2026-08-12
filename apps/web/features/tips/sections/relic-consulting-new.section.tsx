'use client'

import { Badge } from '@shared/ui/badge'
import { Button, buttonVariants } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { toast } from '@shared/ui/sonner'
import { Textarea } from '@shared/ui/textarea'
import { cn } from '@shared/ui/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useSyncExternalStore } from 'react'

import CompanionPresetStatsFields from '@/features/tips/components/companion-preset-stats-fields'
import ConsultingPasswordDialog from '@/features/tips/components/consulting-password-dialog'
import RelicOwnershipGrid from '@/features/tips/components/relic-ownership-grid'
import RelicSetupBoard from '@/features/tips/components/relic-setup-board'
import TipsBackLink from '@/features/tips/components/tips-back-link'
import {
	CONSULTING_CONTENT_MAX_LENGTH,
	CONSULTING_PASSWORD_MAX_LENGTH,
	CONSULTING_PASSWORD_MIN_LENGTH,
	CONSULTING_TITLE_MAX_LENGTH,
	createEmptyPresetStats
} from '@/features/tips/lib/consulting.constants'
import {
	clearConsultingEditPassword,
	readConsultingEditPassword,
	storeConsultingEditPassword
} from '@/features/tips/lib/consulting-edit-password'
import {
	createRelicConsultingPostAction,
	updateRelicConsultingPostAction,
	verifyRelicConsultingPostPasswordAction
} from '@/features/tips/lib/relic-consulting.actions'
import {
	createDefaultRelicOwnershipStateMap,
	createEmptyRelicConsultingLoadout,
	getRelicConsultingPostPath,
	relicOwnershipEntriesToAllowedIds,
	relicOwnershipEntriesToStageMap,
	relicOwnershipEntriesToStateMap,
	relicOwnershipStateToEntries,
	syncRelicLoadoutWithOwnership
} from '@/features/tips/lib/relic-consulting.constants'
import type { ConsultingPresetStats } from '@/features/tips/types/consulting-preset.type'
import type {
	RelicConsultingLoadout,
	RelicConsultingPost,
	RelicOwnershipStateMap
} from '@/features/tips/types/relic-consulting.type'

type RelicConsultingNewSectionProps = {
	/** 있으면 수정 모드 — 초기값으로 채우고 update action을 씁니다. */
	initialPost?: RelicConsultingPost
}

/** sessionStorage는 같은 탭 안에서만 쓰므로 구독할 이벤트가 없습니다. */
function subscribeRelicConsultingEditPassword() {
	return () => {}
}

/** 현황 게시글 작성·수정: 제목·내용 + 프리셋 + 보유 + 세팅 + CUD 비밀번호 */
function RelicConsultingNewSection({ initialPost }: RelicConsultingNewSectionProps) {
	const router = useRouter()
	const isEdit = Boolean(initialPost)
	const shortId = initialPost?.shortId

	const [title, setTitle] = useState(initialPost?.title ?? '')
	const [content, setContent] = useState(initialPost?.content ?? '')
	const [presetStats, setPresetStats] = useState<ConsultingPresetStats>(
		() => initialPost?.presetStats ?? createEmptyPresetStats()
	)
	const [ownership, setOwnership] = useState<RelicOwnershipStateMap>(() =>
		initialPost ? relicOwnershipEntriesToStateMap(initialPost.ownership) : createDefaultRelicOwnershipStateMap()
	)
	const [loadouts, setLoadouts] = useState<RelicConsultingLoadout>(
		() => initialPost?.loadout ?? createEmptyRelicConsultingLoadout()
	)
	const [createPassword, setCreatePassword] = useState('')
	const [verifiedPassword, setVerifiedPassword] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [isPending, setIsPending] = useState(false)

	const storedPassword = useSyncExternalStore(
		subscribeRelicConsultingEditPassword,
		() => (shortId ? readConsultingEditPassword('relic', shortId) : null),
		() => null
	)

	const password = isEdit ? (verifiedPassword ?? storedPassword ?? '') : createPassword
	const editUnlocked = !isEdit || verifiedPassword !== null || Boolean(storedPassword)
	const unlockDialogOpen = isEdit && !editUnlocked

	const ownershipEntries = relicOwnershipStateToEntries(ownership)
	const allowedIds = relicOwnershipEntriesToAllowedIds(ownershipEntries)
	const stageByRelicId = relicOwnershipEntriesToStageMap(ownershipEntries)

	const backHref = initialPost ? getRelicConsultingPostPath(initialPost.shortId) : '/tips/relic-setup'

	function handleOwnershipChange(next: RelicOwnershipStateMap) {
		setOwnership(next)
		const entries = relicOwnershipStateToEntries(next)
		setLoadouts((current) => syncRelicLoadoutWithOwnership(current, entries))
	}

	async function handleUnlockEdit(nextPassword: string) {
		if (!initialPost) {
			return
		}

		setIsPending(true)
		try {
			const result = await verifyRelicConsultingPostPasswordAction({
				shortId: initialPost.shortId,
				password: nextPassword
			})
			if (!result.ok) {
				toast.error(result.error)
				return
			}

			storeConsultingEditPassword('relic', initialPost.shortId, nextPassword)
			setVerifiedPassword(nextPassword)
		} finally {
			setIsPending(false)
		}
	}

	function handleUnlockDialogChange(open: boolean) {
		if (!open && !editUnlocked && initialPost) {
			router.replace(getRelicConsultingPostPath(initialPost.shortId))
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
				? await updateRelicConsultingPostAction({ shortId: initialPost!.shortId, ...payload })
				: await createRelicConsultingPostAction(payload)

			if (!result.ok) {
				setError(result.error)
				toast.error(result.error)
				return
			}

			if (isEdit && initialPost) {
				clearConsultingEditPassword('relic', initialPost.shortId)
			}
			toast.success(isEdit ? '현황이 수정되었습니다.' : `현황이 등록되었습니다. ID: ${result.data.shortId}`)
			router.push(getRelicConsultingPostPath(result.data.shortId))
		} finally {
			setIsPending(false)
		}
	}

	if (isEdit && !editUnlocked) {
		return (
			<section className="flex w-full min-w-0 flex-col gap-4 md:gap-6">
				<div className="flex flex-col gap-3">
					<TipsBackLink href={backHref} showPendingHint={false}>
						게시글로 돌아가기
					</TipsBackLink>
					<header className="flex flex-col gap-2">
						<Badge variant="secondary" className="w-fit">
							유물
						</Badge>
						<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">유물 현황 수정</h1>
						<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">
							비밀번호를 확인한 뒤에 수정할 수 있습니다.
						</p>
					</header>
				</div>

				<ConsultingPasswordDialog
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
				<TipsBackLink
					href={backHref}
					showPendingHint={false}
					onClick={() => {
						if (initialPost) {
							clearConsultingEditPassword('relic', initialPost.shortId)
						}
					}}
				>
					{isEdit ? '게시글로 돌아가기' : '목록으로 돌아가기'}
				</TipsBackLink>

				<header className="flex flex-col gap-2">
					<Badge variant="secondary" className="w-fit">
						유물
					</Badge>
					<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">
						{isEdit ? '유물 현황 수정' : '유물 현황 올리기'}
					</h1>
					<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">
						{isEdit ? '내용을 수정한 뒤 저장하면 반영됩니다.' : '제목·내용(선택)·프리셋 스탯·현재 세팅을 입력하세요.'}
					</p>
				</header>
			</div>

			<div className="border-grayscale-200 bg-card shadow-soft flex flex-col gap-3 rounded-xl border p-4">
				<div className={cn('flex flex-col gap-3', !isEdit && 'md:flex-row md:items-start')}>
					<div className="flex min-w-0 flex-1 flex-col gap-2">
						<Label htmlFor="relic-consulting-title">제목</Label>
						<Input
							id="relic-consulting-title"
							value={title}
							onChange={(event) => setTitle(event.target.value.slice(0, CONSULTING_TITLE_MAX_LENGTH))}
							placeholder="예: 월드보스용 잠재 봐주세요"
							autoComplete="off"
						/>
						<p className="text-grayscale-400 text-xs tabular-nums">
							{title.length}/{CONSULTING_TITLE_MAX_LENGTH}
						</p>
					</div>

					{!isEdit ? (
						<div className="flex w-full flex-col gap-2 md:w-44 md:shrink-0">
							<Label htmlFor="relic-consulting-password">비밀번호</Label>
							<Input
								id="relic-consulting-password"
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
					<Label htmlFor="relic-consulting-content">내용 (선택)</Label>
					<Textarea
						id="relic-consulting-content"
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

			<RelicOwnershipGrid ownership={ownership} onOwnershipChange={handleOwnershipChange} />

			<RelicSetupBoard
				title="현재 세팅"
				loadouts={loadouts}
				onLoadoutsChange={setLoadouts}
				allowedIds={allowedIds}
				stageByRelicId={stageByRelicId}
			/>

			{error ? <p className="text-destructive text-sm">{error}</p> : null}

			<div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
				<Link
					href={backHref}
					className={cn(buttonVariants({ variant: 'outline' }), 'justify-center')}
					onClick={() => {
						if (initialPost) {
							clearConsultingEditPassword('relic', initialPost.shortId)
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

export default RelicConsultingNewSection
