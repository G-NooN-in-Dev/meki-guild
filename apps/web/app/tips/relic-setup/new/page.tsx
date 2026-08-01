import type { Metadata } from 'next'

import RelicConsultingNewSection from '@/features/tips/sections/relic-consulting-new.section'

export const metadata: Metadata = {
	title: '유물 현황 올리기',
	description: '제목·내용(선택)·프리셋 스탯·현재 세팅을 입력해 유물 세팅 컨설팅 현황을 올립니다.'
}

function RelicConsultingNewPage() {
	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col px-4 py-8 md:px-6">
					<RelicConsultingNewSection />
				</div>
			</main>
		</div>
	)
}

export default RelicConsultingNewPage
