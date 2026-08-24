import TipsHubFilteredList from '@/features/tips/components/hub/tips-hub-filtered-list.client'
import { TIP_ENTRIES, TIP_TAGS } from '@/features/tips/lib/tips-registry.constants'

function TipsHubSection() {
	return (
		<section className="flex w-full min-w-0 flex-col gap-4 md:gap-6">
			<header className="flex flex-col gap-2">
				<p className="text-grayscale-500 text-sm">메이플키우기 참고 자료</p>
				<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">정보 / 팁</h1>
				<p className="text-grayscale-600 max-w-2xl text-sm md:text-base">
					길드 운영·콘텐츠에 도움이 되는 정보와 팁을 모아둔 공간입니다.
				</p>
			</header>

			<TipsHubFilteredList tags={TIP_TAGS} tips={TIP_ENTRIES} />
		</section>
	)
}

export default TipsHubSection
