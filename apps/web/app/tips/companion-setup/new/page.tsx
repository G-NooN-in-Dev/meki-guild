import CompanionConsultingNewSection from '@/features/tips/sections/companion-consulting-new.section'

function CompanionConsultingNewPage() {
	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col px-4 py-8 md:px-6">
					<CompanionConsultingNewSection />
				</div>
			</main>
		</div>
	)
}

export default CompanionConsultingNewPage
