'use client'

import { Badge } from '@shared/ui/badge'
import { Button, buttonVariants } from '@shared/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@shared/ui/empty'
import { Input } from '@shared/ui/input'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from '@shared/ui/pagination'
import { cn } from '@shared/ui/utils'
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FormEvent, useMemo, useState, useTransition } from 'react'

import {
	buildConsultingPaginationItems,
	CONSULTING_SHORT_ID_LENGTH,
	getConsultingListPath,
	getConsultingPostPath
} from '@/features/tips/lib/companion-consulting.constants'
import type { CompanionConsultingPost } from '@/features/tips/types/companion-consulting.type'

type CompanionConsultingHubSectionProps = {
	posts: readonly CompanionConsultingPost[]
	page: number
	totalPages: number
	totalCount: number
	/** 서버에서 목록을 못 불러왔을 때 */
	loadError?: string | null
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

/** 동료 세팅 컨설팅 허브 — 목록 + ID로 열기 + 작성 */
function CompanionConsultingHubSection({
	posts,
	page,
	totalPages,
	totalCount,
	loadError = null
}: CompanionConsultingHubSectionProps) {
	const router = useRouter()
	const [lookupId, setLookupId] = useState('')
	const [lookupError, setLookupError] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()

	const normalizedLookup = useMemo(() => lookupId.trim().toUpperCase(), [lookupId])
	const paginationItems = useMemo(() => buildConsultingPaginationItems(page, totalPages), [page, totalPages])

	function handleLookup(event: FormEvent) {
		event.preventDefault()
		setLookupError(null)

		if (normalizedLookup.length !== CONSULTING_SHORT_ID_LENGTH) {
			setLookupError(`ID는 ${CONSULTING_SHORT_ID_LENGTH}자리입니다.`)
			return
		}

		startTransition(() => {
			router.push(getConsultingPostPath(normalizedLookup))
		})
	}

	return (
		<section className="flex w-full min-w-0 flex-col gap-4 md:gap-6">
			<div className="flex flex-col gap-3">
				<Link
					href="/tips"
					className={cn(
						'text-grayscale-600 hover:text-grayscale-900 inline-flex w-fit items-center gap-1.5 text-sm font-medium transition-colors'
					)}
				>
					<ArrowLeftIcon className="size-4" />
					정보 / 팁 목록
				</Link>

				<header className="flex flex-col gap-2">
					<Badge variant="secondary" className="w-fit">
						동료
					</Badge>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
						<div className="space-y-2">
							<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">동료 세팅 컨설팅</h1>
							<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">
								보유 현황과 현재 세팅을 올리면, 추천 세팅을 댓글로 받을 수 있습니다. ID·URL을 카톡 채널에 공유해보세요.
							</p>
						</div>
						<Link href="/tips/companion-setup/new" className={cn(buttonVariants(), 'shrink-0')}>
							<PlusIcon className="size-4" />
							컨설팅 요청하기
						</Link>
					</div>
				</header>
			</div>

			<form
				onSubmit={handleLookup}
				className="border-grayscale-200 bg-card shadow-soft flex flex-col gap-2 rounded-xl border p-4 sm:flex-row sm:items-end"
			>
				<div className="min-w-0 flex-1 space-y-1.5">
					<label htmlFor="consulting-lookup-id" className="text-grayscale-900 text-sm font-medium">
						ID로 열기
					</label>
					<Input
						id="consulting-lookup-id"
						value={lookupId}
						onChange={(event) => setLookupId(event.target.value)}
						placeholder="예: A3K7M2PQ"
						className="font-mono tracking-wider uppercase"
						autoComplete="off"
						spellCheck={false}
					/>
					{lookupError ? <p className="text-destructive text-xs">{lookupError}</p> : null}
				</div>
				<Button type="submit" variant="secondary" disabled={isPending} className="shrink-0">
					<SearchIcon className="size-4" />
					열기
				</Button>
			</form>

			{loadError ? (
				<p className="text-destructive text-sm">{loadError}</p>
			) : posts.length === 0 ? (
				<Empty className="border-grayscale-200 border border-dashed">
					<EmptyHeader>
						<EmptyTitle>아직 올라온 요청이 없습니다</EmptyTitle>
						<EmptyDescription>보유·세팅을 올리면 여기에서 목록으로 확인할 수 있습니다.</EmptyDescription>
					</EmptyHeader>
					<Link href="/tips/companion-setup/new" className={buttonVariants()}>
						첫 컨설팅 요청하기
					</Link>
				</Empty>
			) : (
				<div className="flex flex-col gap-4">
					<p className="text-grayscale-500 text-xs">
						전체 {totalCount}개 · {page}/{Math.max(totalPages, 1)}페이지
					</p>
					<ul className="flex flex-col gap-2">
						{posts.map((post) => (
							<li key={post.shortId}>
								<Link
									href={getConsultingPostPath(post.shortId)}
									className={cn(
										'border-grayscale-200 bg-card shadow-soft flex items-center gap-3 rounded-xl border p-4 transition-colors',
										'hover:border-grayscale-300 hover:bg-grayscale-50/70'
									)}
								>
									<div className="min-w-0 flex-1 space-y-1">
										<div className="flex flex-wrap items-center gap-2">
											<span className="text-grayscale-500 font-mono text-xs tracking-wider">{post.shortId}</span>
										</div>
										<p className="text-grayscale-900 truncate text-sm font-medium">{post.title}</p>
										<p className="text-grayscale-500 text-xs">
											{formatCreatedAt(post.createdAt)} · 댓글 {post.commentCount}개
										</p>
									</div>
									<ArrowRightIcon className="text-grayscale-400 size-4 shrink-0" />
								</Link>
							</li>
						))}
					</ul>

					{/* 2페이지 이상일 때만 @shared/ui Pagination을 노출합니다. */}
					{totalPages > 1 ? (
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href={getConsultingListPath(page - 1)}
										text="이전"
										aria-disabled={page <= 1}
										className={page <= 1 ? 'pointer-events-none opacity-50' : undefined}
									/>
								</PaginationItem>
								{paginationItems.map((item, index) =>
									item === 'ellipsis' ? (
										<PaginationItem key={`ellipsis-${index}`}>
											<PaginationEllipsis />
										</PaginationItem>
									) : (
										<PaginationItem key={item}>
											<PaginationLink href={getConsultingListPath(item)} isActive={item === page}>
												{item}
											</PaginationLink>
										</PaginationItem>
									)
								)}
								<PaginationItem>
									<PaginationNext
										href={getConsultingListPath(page + 1)}
										text="다음"
										aria-disabled={page >= totalPages}
										className={page >= totalPages ? 'pointer-events-none opacity-50' : undefined}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					) : null}
				</div>
			)}
		</section>
	)
}

export default CompanionConsultingHubSection
