import { Skeleton } from '@shared/ui/skeleton'
import { Spinner } from '@shared/ui/spinner'
import { cn } from '@shared/ui/utils'
import { type ReactNode } from 'react'

/** 반투명 배경 위에서도 과하지 않은 스켈레톤 본 색 */
const bone = 'bg-grayscale-100'

type PageLoadingProps = {
	/**
	 * hub: 목록 페이지 골격
	 * hub-body: 헤더가 이미 보일 때(Suspense) 폼·목록만
	 * detail: 상세/수정 페이지 골격
	 */
	variant?: 'hub' | 'hub-body' | 'detail'
}

/** 카드형 스켈레톤 컨테이너 — 실제 tip 카드(border + bg-card)와 맞춤 */
function SkeletonCard({ className, children }: { className?: string; children: ReactNode }) {
	return (
		<div className={cn('border-grayscale-200/80 bg-card/80 shadow-soft rounded-xl border p-4', className)}>
			{children}
		</div>
	)
}

function HubHeaderSkeleton() {
	return (
		<div className="flex flex-col gap-3">
			<Skeleton className={cn(bone, 'h-4 w-28')} />
			<div className="flex flex-col gap-2">
				<Skeleton className={cn(bone, 'h-5 w-12 rounded-full')} />
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
					<div className="space-y-2">
						<Skeleton className={cn(bone, 'h-8 w-52 max-w-full')} />
						<Skeleton className={cn(bone, 'h-4 w-full max-w-md')} />
					</div>
					<Skeleton className={cn(bone, 'h-9 w-36 shrink-0 rounded-lg')} />
				</div>
			</div>
		</div>
	)
}

function HubBodySkeleton() {
	return (
		<>
			{/* ID로 열기 폼 */}
			<SkeletonCard className="flex flex-col gap-3 sm:flex-row sm:items-end">
				<div className="min-w-0 flex-1 space-y-2">
					<Skeleton className={cn(bone, 'h-4 w-20')} />
					<Skeleton className={cn(bone, 'h-9 w-full rounded-lg')} />
				</div>
				<Skeleton className={cn(bone, 'h-9 w-20 shrink-0 rounded-lg')} />
			</SkeletonCard>

			{/* 목록 행 */}
			<div className="flex flex-col gap-2">
				<Skeleton className={cn(bone, 'h-3 w-28')} />
				{Array.from({ length: 3 }, (_, index) => (
					<SkeletonCard key={index} className="flex items-center gap-3">
						<div className="min-w-0 flex-1 space-y-2">
							<Skeleton className={cn(bone, 'h-3 w-16')} />
							<Skeleton className={cn(bone, 'h-4 w-48 max-w-full')} />
							<Skeleton className={cn(bone, 'h-3 w-40')} />
						</div>
						<Skeleton className={cn(bone, 'size-4 shrink-0 rounded-full')} />
					</SkeletonCard>
				))}
			</div>
		</>
	)
}

function DetailBodySkeleton() {
	return (
		<>
			<div className="flex flex-col gap-3">
				<Skeleton className={cn(bone, 'h-4 w-28')} />
				<div className="flex flex-col gap-2">
					<Skeleton className={cn(bone, 'h-5 w-12 rounded-full')} />
					<Skeleton className={cn(bone, 'h-8 w-64 max-w-full')} />
					<Skeleton className={cn(bone, 'h-4 w-40')} />
				</div>
			</div>

			{/* 세팅 보드 영역 */}
			<SkeletonCard className="space-y-3">
				<Skeleton className={cn(bone, 'h-4 w-24')} />
				<div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
					{Array.from({ length: 6 }, (_, index) => (
						<Skeleton key={index} className={cn(bone, 'aspect-square w-full rounded-lg')} />
					))}
				</div>
			</SkeletonCard>

			{/* 댓글/추천 영역 */}
			<div className="flex flex-col gap-2">
				<Skeleton className={cn(bone, 'h-4 w-20')} />
				<SkeletonCard className="space-y-2">
					<Skeleton className={cn(bone, 'h-4 w-48 max-w-full')} />
					<Skeleton className={cn(bone, 'h-3 w-full')} />
					<Skeleton className={cn(bone, 'h-3 w-56 max-w-full')} />
				</SkeletonCard>
			</div>
		</>
	)
}

/**
 * 라우트 loading.tsx · Suspense fallback 공용 UI.
 * 실제 허브/상세 레이아웃에 맞춰 카드형 골격 + Spinner로 전환 중임을 알립니다.
 */
function PageLoading({ variant = 'hub' }: PageLoadingProps) {
	return (
		<div className="flex w-full min-w-0 flex-col gap-4 md:gap-6" aria-busy="true" aria-live="polite">
			<div className="flex items-center gap-2">
				<Spinner className="text-grayscale-500 size-4" />
				<p className="text-grayscale-500 text-sm">불러오는 중…</p>
			</div>

			{variant === 'hub' ? (
				<>
					<HubHeaderSkeleton />
					<HubBodySkeleton />
				</>
			) : null}

			{variant === 'hub-body' ? <HubBodySkeleton /> : null}

			{variant === 'detail' ? <DetailBodySkeleton /> : null}
		</div>
	)
}

export default PageLoading
