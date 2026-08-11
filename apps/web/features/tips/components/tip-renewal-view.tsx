import { buttonVariants } from '@shared/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@shared/ui/empty'
import { cn } from '@shared/ui/utils'
import { ConstructionIcon } from 'lucide-react'
import Link from 'next/link'

import PageShell from '@/components/page-shell'

type TipRenewalViewProps = {
	/** 페이지 제목 (예: 동료 세팅 컨설팅) */
	title: string
}

/**
 * 리뉴얼 중인 팁 라우트용 안내 UI.
 * companion-setup / relic-setup 레이아웃에서 children 대신 렌더합니다.
 */
function TipRenewalView({ title }: TipRenewalViewProps) {
	return (
		<PageShell>
			<Empty className="border-grayscale-200 bg-card/50 shadow-soft min-h-[50vh] border border-dashed">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<ConstructionIcon />
					</EmptyMedia>
					<EmptyTitle>{title}</EmptyTitle>
					<EmptyDescription>페이지 리뉴얼 진행중</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Link href="/tips" className={cn(buttonVariants())}>
						정보 / 팁으로
					</Link>
				</EmptyContent>
			</Empty>
		</PageShell>
	)
}

export default TipRenewalView
