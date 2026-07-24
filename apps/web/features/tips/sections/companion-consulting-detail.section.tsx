'use client'

import { Badge } from '@shared/ui/badge'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { toast } from '@shared/ui/sonner'
import { Textarea } from '@shared/ui/textarea'
import { cn } from '@shared/ui/utils'
import { ArrowLeftIcon, PencilIcon, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import CompanionOwnershipGrid from '@/features/tips/components/companion-ownership-grid'
import CompanionPresetStatsFields from '@/features/tips/components/companion-preset-stats-fields'
import CompanionSetupBoard from '@/features/tips/components/companion-setup-board'
import ConsultingPasswordDialog from '@/features/tips/components/consulting-password-dialog'
import ConsultingShareBar from '@/features/tips/components/consulting-share-bar'
import {
	createConsultingCommentAction,
	deleteConsultingCommentAction,
	deleteConsultingPostAction,
	updateConsultingCommentAction,
	verifyConsultingCommentPasswordAction,
	verifyConsultingPostPasswordAction
} from '@/features/tips/lib/companion-consulting.actions'
import {
	createEmptyConsultingLoadout,
	getConsultingPostPath,
	ownershipEntriesToAllowedIds,
	ownershipEntriesToLevelMap,
	ownershipEntriesToStateMap
} from '@/features/tips/lib/companion-consulting.constants'
import {
	CONSULTING_NOTE_MAX_LENGTH,
	CONSULTING_PASSWORD_MAX_LENGTH,
	CONSULTING_PASSWORD_MIN_LENGTH
} from '@/features/tips/lib/consulting.constants'
import { storeConsultingEditPassword } from '@/features/tips/lib/consulting-edit-password'
import { projectCompanionPresetStats } from '@/features/tips/lib/consulting-preset-projection'
import type {
	CompanionConsultingComment,
	CompanionConsultingLoadout,
	CompanionConsultingPost
} from '@/features/tips/types/companion-consulting.type'

type CompanionConsultingDetailSectionProps = {
	post: CompanionConsultingPost
	comments: readonly CompanionConsultingComment[]
}

function formatCreatedAt(iso: string) {
	const date = new Date(iso)
	if (Number.isNaN(date.getTime())) {
		return iso
	}

	return new Intl.DateTimeFormat('ko-KR', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(date)
}

/** 게시글 상세: 조회 + 추천 작성 + 비밀번호 기반 수정·삭제 */
function CompanionConsultingDetailSection({ post, comments }: CompanionConsultingDetailSectionProps) {
	const router = useRouter()
	const ownershipState = useMemo(() => ownershipEntriesToStateMap(post.ownership), [post.ownership])
	const allowedIds = useMemo(() => ownershipEntriesToAllowedIds(post.ownership), [post.ownership])
	const levelByCompanionId = useMemo(() => ownershipEntriesToLevelMap(post.ownership), [post.ownership])

	const [recommendLoadouts, setRecommendLoadouts] = useState<CompanionConsultingLoadout>(() =>
		createEmptyConsultingLoadout()
	)
	const [recommendNote, setRecommendNote] = useState('')
	const [recommendPassword, setRecommendPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	/** Server Action 대기용. async + startTransition 조합을 피해 피드백이 안정적으로 보이게 합니다. */
	const [isPending, setIsPending] = useState(false)

	const [editPostOpen, setEditPostOpen] = useState(false)
	const [deletePostOpen, setDeletePostOpen] = useState(false)
	const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null)
	/** 수정 진입용 — 비밀번호 Dialog로 연 뒤 shortId를 담습니다. */
	const [editCommentId, setEditCommentId] = useState<string | null>(null)

	const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
	const [editNote, setEditNote] = useState('')
	const [editLoadouts, setEditLoadouts] = useState<CompanionConsultingLoadout>(() => createEmptyConsultingLoadout())
	/** Dialog에서 검증된 비밀번호 — 저장 시 재사용 */
	const [verifiedCommentPassword, setVerifiedCommentPassword] = useState('')
	const [editError, setEditError] = useState<string | null>(null)

	// 추천 작성 중에도 적용 후 프리셋을 바로 보여 줍니다.
	const recommendProjectedPresetStats = useMemo(
		() => projectCompanionPresetStats(post.presetStats, post.loadout, recommendLoadouts),
		[post.presetStats, post.loadout, recommendLoadouts]
	)

	const editProjectedPresetStats = useMemo(
		() => projectCompanionPresetStats(post.presetStats, post.loadout, editLoadouts),
		[post.presetStats, post.loadout, editLoadouts]
	)

	async function handleSubmitRecommend() {
		setError(null)
		setIsPending(true)

		try {
			const result = await createConsultingCommentAction({
				postShortId: post.shortId,
				note: recommendNote,
				loadout: recommendLoadouts,
				password: recommendPassword
			})

			if (!result.ok) {
				setError(result.error)
				toast.error(result.error)
				return
			}

			setRecommendLoadouts(createEmptyConsultingLoadout())
			setRecommendNote('')
			setRecommendPassword('')
			toast.success('추천 세팅이 등록되었습니다.')
			router.refresh()
		} finally {
			setIsPending(false)
		}
	}

	async function handleUnlockPostEdit(password: string) {
		setIsPending(true)
		try {
			const result = await verifyConsultingPostPasswordAction({ shortId: post.shortId, password })
			if (!result.ok) {
				toast.error(result.error)
				return
			}

			// 수정 페이지에서 저장할 때 쓰도록 잠깐 보관 (URL에는 넣지 않음)
			storeConsultingEditPassword('companion', post.shortId, password)
			setEditPostOpen(false)
			router.push(`${getConsultingPostPath(post.shortId)}/edit`)
		} finally {
			setIsPending(false)
		}
	}

	async function handleDeletePost(password: string) {
		setIsPending(true)
		try {
			const result = await deleteConsultingPostAction({ shortId: post.shortId, password })
			if (!result.ok) {
				toast.error(result.error)
				return
			}

			setDeletePostOpen(false)
			toast.success('게시글이 삭제되었습니다.')
			router.push('/tips/companion-setup')
			router.refresh()
		} finally {
			setIsPending(false)
		}
	}

	async function handleDeleteComment(password: string) {
		if (!deleteCommentId) {
			return
		}

		setIsPending(true)
		try {
			const result = await deleteConsultingCommentAction({ shortId: deleteCommentId, password })
			if (!result.ok) {
				toast.error(result.error)
				return
			}

			setDeleteCommentId(null)
			if (editingCommentId === deleteCommentId) {
				cancelEditComment()
			}
			toast.success('추천 세팅이 삭제되었습니다.')
			router.refresh()
		} finally {
			setIsPending(false)
		}
	}

	async function handleUnlockCommentEdit(password: string) {
		if (!editCommentId) {
			return
		}

		const comment = comments.find((item) => item.shortId === editCommentId)
		if (!comment) {
			setEditCommentId(null)
			return
		}

		setIsPending(true)
		try {
			const result = await verifyConsultingCommentPasswordAction({ shortId: comment.shortId, password })
			if (!result.ok) {
				toast.error(result.error)
				return
			}

			setEditCommentId(null)
			setEditingCommentId(comment.shortId)
			setEditNote(comment.note)
			setEditLoadouts(comment.loadout)
			setVerifiedCommentPassword(password)
			setEditError(null)
		} finally {
			setIsPending(false)
		}
	}

	function cancelEditComment() {
		setEditingCommentId(null)
		setEditNote('')
		setEditLoadouts(createEmptyConsultingLoadout())
		setVerifiedCommentPassword('')
		setEditError(null)
	}

	async function handleSaveComment(shortId: string) {
		setEditError(null)
		setIsPending(true)

		try {
			const result = await updateConsultingCommentAction({
				shortId,
				note: editNote,
				loadout: editLoadouts,
				password: verifiedCommentPassword
			})

			if (!result.ok) {
				setEditError(result.error)
				toast.error(result.error)
				return
			}

			cancelEditComment()
			toast.success('추천 세팅이 수정되었습니다.')
			router.refresh()
		} finally {
			setIsPending(false)
		}
	}

	return (
		<section className="flex w-full min-w-0 flex-col gap-4 md:gap-6">
			<div className="flex flex-col gap-3">
				<Link
					href="/tips/companion-setup"
					className={cn(
						'text-grayscale-600 hover:text-grayscale-900 inline-flex w-fit items-center gap-1.5 text-sm font-medium transition-colors'
					)}
				>
					<ArrowLeftIcon className="size-4" />
					목록으로 돌아가기
				</Link>

				<header className="flex flex-col gap-2">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary">동료</Badge>
						<span className="text-grayscale-500 font-mono text-xs tracking-wider">{post.shortId}</span>
					</div>
					<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">{post.title}</h1>
					{post.content ? (
						<p className="text-grayscale-700 max-w-2xl text-sm whitespace-pre-wrap md:text-base">{post.content}</p>
					) : null}
					<p className="text-grayscale-500 text-sm">{formatCreatedAt(post.createdAt)}</p>
				</header>

				{post.hasPassword ? (
					<div className="flex flex-wrap gap-2">
						<Button type="button" variant="outline" size="sm" onClick={() => setEditPostOpen(true)}>
							<PencilIcon className="size-3.5" />
							수정
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="text-destructive hover:text-destructive"
							onClick={() => setDeletePostOpen(true)}
						>
							<Trash2Icon className="size-3.5" />
							삭제
						</Button>
					</div>
				) : null}
			</div>

			<ConsultingShareBar shortId={post.shortId} path={getConsultingPostPath(post.shortId)} />

			{/* ── 현황: 프리셋·보유·현재 세팅을 한 구역으로 묶습니다 ── */}
			<div className="flex flex-col gap-4 md:gap-5">
				<header className="flex flex-col gap-1">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary">현황</Badge>
						<h2 className="text-grayscale-900 text-lg font-semibold md:text-xl">현재 세팅</h2>
					</div>
					<p className="text-grayscale-500 text-sm">이 글에 등록된 프리셋·보유·현재 장착 조합입니다.</p>
				</header>

				<CompanionPresetStatsFields stats={post.presetStats} readOnly />
				<CompanionOwnershipGrid ownership={ownershipState} readOnly />
				<CompanionSetupBoard title="현재 장착" loadouts={post.loadout} readOnly />
			</div>

			{/* 현황 / 추천 경계 */}
			<div className="border-grayscale-200 border-t pt-2 md:pt-4" aria-hidden />

			{/* ── 추천 세팅: 톤·헤더로 현황과 구분합니다 ── */}
			<div className="bg-grayscale-50/80 border-grayscale-200 flex flex-col gap-4 rounded-2xl border border-dashed p-4 md:gap-5 md:p-5">
				<header className="flex flex-col gap-1">
					<div className="flex flex-wrap items-end justify-between gap-2">
						<div className="flex flex-wrap items-center gap-2">
							<Badge>추천</Badge>
							<h2 className="text-grayscale-900 text-lg font-semibold md:text-xl">추천 세팅</h2>
						</div>
						<p className="text-grayscale-500 text-sm tabular-nums">{comments.length}개</p>
					</div>
					<p className="text-grayscale-500 text-sm">다른 사람이 제안한 세팅입니다. 현재 세팅과 비교해 보세요.</p>
				</header>

				{comments.length === 0 ? (
					<p className="text-grayscale-400 border-grayscale-200 bg-card rounded-xl border border-dashed p-4 text-sm">
						아직 추천 세팅이 없습니다. 아래에서 첫 추천을 남겨 보세요.
					</p>
				) : (
					<ul className="flex flex-col gap-4">
						{comments.map((comment) => {
							const isEditing = editingCommentId === comment.shortId

							return (
								<li
									key={comment.shortId}
									className="border-grayscale-200 bg-card shadow-soft flex flex-col gap-3 rounded-xl border p-4"
								>
									<div className="flex flex-wrap items-center justify-between gap-2">
										<div className="flex flex-wrap items-center gap-2">
											<Badge variant="outline" className="text-xs">
												추천
											</Badge>
											<span className="text-grayscale-500 font-mono text-xs tracking-wider">{comment.shortId}</span>
											<span className="text-grayscale-400 text-xs">{formatCreatedAt(comment.createdAt)}</span>
										</div>
										{comment.hasPassword && !isEditing ? (
											<div className="flex flex-wrap gap-1.5">
												<Button
													type="button"
													variant="ghost"
													size="sm"
													onClick={() => setEditCommentId(comment.shortId)}
												>
													<PencilIcon className="size-3.5" />
													수정
												</Button>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="text-destructive hover:text-destructive"
													onClick={() => setDeleteCommentId(comment.shortId)}
												>
													<Trash2Icon className="size-3.5" />
													삭제
												</Button>
											</div>
										) : null}
									</div>

									{isEditing ? (
										<div className="flex flex-col gap-3">
											<div className="flex flex-col gap-2">
												<Label htmlFor={`edit-note-${comment.shortId}`}>한 줄 코멘트 (선택)</Label>
												<Textarea
													id={`edit-note-${comment.shortId}`}
													className="resize-none"
													value={editNote}
													onChange={(event) => setEditNote(event.target.value.slice(0, CONSULTING_NOTE_MAX_LENGTH))}
													rows={2}
												/>
											</div>

											<CompanionSetupBoard
												title="추천 조합"
												loadouts={editLoadouts}
												onLoadoutsChange={setEditLoadouts}
												allowedIds={allowedIds}
												levelByCompanionId={levelByCompanionId}
											/>

											<CompanionPresetStatsFields
												title="예상 프리셋 스탯"
												description="현재 프리셋에서 장착 효과를 바꾼 예상치입니다. 기본 공격·스킬 데미지 등 프리셋에 없는 효과는 반영되지 않습니다."
												stats={editProjectedPresetStats}
												baseStats={post.presetStats}
												readOnly
											/>

											{editError ? <p className="text-destructive text-sm">{editError}</p> : null}

											<div className="flex flex-wrap justify-end gap-2">
												<Button type="button" variant="outline" disabled={isPending} onClick={cancelEditComment}>
													취소
												</Button>
												<Button
													type="button"
													disabled={isPending}
													onClick={() => void handleSaveComment(comment.shortId)}
												>
													{isPending ? '저장 중…' : '수정'}
												</Button>
											</div>
										</div>
									) : (
										<>
											{comment.note ? <p className="text-grayscale-700 text-sm">{comment.note}</p> : null}
											<CompanionSetupBoard title="추천 조합" loadouts={comment.loadout} readOnly />
											<CompanionPresetStatsFields
												title="예상 프리셋 스탯"
												description="현재 프리셋에서 장착 효과를 바꾼 예상치입니다. 기본 공격·스킬 데미지 등 프리셋에 없는 효과는 반영되지 않습니다."
												stats={projectCompanionPresetStats(post.presetStats, post.loadout, comment.loadout)}
												baseStats={post.presetStats}
												readOnly
											/>
										</>
									)}
								</li>
							)
						})}
					</ul>
				)}

				<div className="border-grayscale-200 bg-card shadow-soft flex flex-col gap-4 rounded-xl border p-4">
					<div>
						<h3 className="text-grayscale-900 font-semibold">추천 세팅 남기기</h3>
						<p className="text-grayscale-500 text-sm">게시글에 적힌 보유 동료만 장착할 수 있습니다.</p>
					</div>

					{/* 코멘트 + 비밀번호를 한 줄에 두고, 비밀번호는 좁게 */}
					<div className="flex flex-col gap-3 md:flex-row md:items-start">
						<div className="flex min-w-0 flex-1 flex-col gap-2">
							<Label htmlFor="recommend-note">한 줄 코멘트 (선택)</Label>
							<Textarea
								id="recommend-note"
								className="resize-none"
								value={recommendNote}
								onChange={(event) => setRecommendNote(event.target.value.slice(0, CONSULTING_NOTE_MAX_LENGTH))}
								placeholder="예: 메인만 교체해 보세요"
								rows={2}
							/>
						</div>

						<div className="flex w-full flex-col gap-2 md:w-40 md:shrink-0">
							<Label htmlFor="recommend-password">비밀번호</Label>
							<Input
								id="recommend-password"
								type="password"
								autoComplete="new-password"
								value={recommendPassword}
								onChange={(event) => setRecommendPassword(event.target.value.slice(0, CONSULTING_PASSWORD_MAX_LENGTH))}
								placeholder={`${CONSULTING_PASSWORD_MIN_LENGTH}자 이상`}
							/>
							<p className="text-grayscale-500 text-xs">수정·삭제용</p>
						</div>
					</div>

					<CompanionSetupBoard
						title="추천 조합"
						loadouts={recommendLoadouts}
						onLoadoutsChange={setRecommendLoadouts}
						allowedIds={allowedIds}
						levelByCompanionId={levelByCompanionId}
					/>

					<CompanionPresetStatsFields
						title="예상 프리셋 스탯"
						description="현재 프리셋에서 장착 효과를 바꾼 예상치입니다. 기본 공격·스킬 데미지 등 프리셋에 없는 효과는 반영되지 않습니다."
						stats={recommendProjectedPresetStats}
						baseStats={post.presetStats}
						readOnly
					/>

					{error ? <p className="text-destructive text-sm">{error}</p> : null}

					<div className="flex justify-end">
						<Button type="button" disabled={isPending} onClick={handleSubmitRecommend}>
							{isPending ? '등록 중…' : '추천 세팅 등록'}
						</Button>
					</div>
				</div>
			</div>

			<ConsultingPasswordDialog
				open={editPostOpen}
				onOpenChange={setEditPostOpen}
				title="게시글 수정"
				description="비밀번호를 입력하세요."
				confirmLabel="수정하기"
				isPending={isPending}
				onConfirm={handleUnlockPostEdit}
			/>

			<ConsultingPasswordDialog
				open={deletePostOpen}
				onOpenChange={setDeletePostOpen}
				title="게시글 삭제"
				description="비밀번호를 입력하세요."
				confirmLabel="삭제"
				destructive
				isPending={isPending}
				onConfirm={handleDeletePost}
			/>

			<ConsultingPasswordDialog
				open={editCommentId !== null}
				onOpenChange={(open) => {
					if (!open) {
						setEditCommentId(null)
					}
				}}
				title="추천 세팅 수정"
				description="비밀번호를 입력하세요."
				confirmLabel="수정하기"
				isPending={isPending}
				onConfirm={handleUnlockCommentEdit}
			/>

			<ConsultingPasswordDialog
				open={deleteCommentId !== null}
				onOpenChange={(open) => {
					if (!open) {
						setDeleteCommentId(null)
					}
				}}
				title="추천 세팅 삭제"
				description="비밀번호를 입력하세요."
				confirmLabel="삭제"
				destructive
				isPending={isPending}
				onConfirm={handleDeleteComment}
			/>
		</section>
	)
}

export default CompanionConsultingDetailSection
