import RelicConsultingNewSection from '@/features/tips/sections/relic-consulting-new.section'

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
