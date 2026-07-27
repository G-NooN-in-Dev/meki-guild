import { buttonVariants } from '@shared/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@shared/ui/empty'
import { cn } from '@shared/ui/utils'
import { FileQuestionIcon } from 'lucide-react'
import Link from 'next/link'

import PageShell from '@/components/page-shell'

type NotFoundViewProps = {
	/** 큰 제목 — 기본은 공통 404 문구 */
	title?: string
	/** 안내 문장 */
	description?: string
	/** 주요 CTA 링크 */
	primaryHref: string
	primaryLabel: string
	/** 보조 CTA (선택) */
	secondaryHref?: string
	secondaryLabel?: string
}

/**
 * notFound()·미매칭 URL용 공통 UI.
 * 라우트별 not-found.tsx에서 문구·복귀 링크만 바꿔 씁니다.
 */
function NotFoundView({
	title = '페이지를 찾을 수 없습니다',
	description = '주소가 잘못되었거나, 삭제·이동된 페이지일 수 있습니다.',
	primaryHref,
	primaryLabel,
	secondaryHref,
	secondaryLabel
}: NotFoundViewProps) {
	return (
		<PageShell>
			<Empty className="border-grayscale-200 bg-card/50 shadow-soft min-h-[50vh] border border-dashed">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<FileQuestionIcon />
					</EmptyMedia>
					<EmptyTitle>{title}</EmptyTitle>
					<EmptyDescription>{description}</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<div className="flex flex-wrap items-center justify-center gap-2">
						<Link href={primaryHref} className={cn(buttonVariants())}>
							{primaryLabel}
						</Link>
						{secondaryHref && secondaryLabel ? (
							<Link href={secondaryHref} className={cn(buttonVariants({ variant: 'outline' }))}>
								{secondaryLabel}
							</Link>
						) : null}
					</div>
				</EmptyContent>
			</Empty>
		</PageShell>
	)
}

export default NotFoundView
