import CompanionConsultingHubSection from '@/features/tips/sections/companion-consulting-hub.section'
import { listConsultingPosts } from '@/libs/companion-consulting.server'

export const dynamic = 'force-dynamic'

async function CompanionSetupTipPage() {
	let posts: Awaited<ReturnType<typeof listConsultingPosts>> = []
	let loadError: string | null = null

	try {
		posts = await listConsultingPosts()
	} catch (error) {
		console.error('[companion-consulting] list failed', error)
		loadError = '목록을 불러오지 못했습니다. MongoDB 연결(MONGODB_URI)을 확인해 주세요.'
	}

	return (
		<div className="min-h-screen-safe flex w-full flex-1 font-sans">
			<main className="flex w-full flex-1">
				<div className="max-w-content container mx-auto flex w-full flex-col px-4 py-8 md:px-6">
					<CompanionConsultingHubSection posts={posts} loadError={loadError} />
				</div>
			</main>
		</div>
	)
}

export default CompanionSetupTipPage
