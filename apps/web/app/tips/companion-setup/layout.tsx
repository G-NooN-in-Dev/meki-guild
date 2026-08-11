import { type PropsWithChildren } from 'react'

import TipRenewalView from '@/features/tips/components/tip-renewal-view'

/**
 * 동료 세팅 구간의 레이아웃 경계.
 * 리뉴얼 중에는 하위 라우트(목록·상세·작성·수정) 접근을 막고 안내만 보여 줍니다.
 */
function CompanionSetupLayout(_props: PropsWithChildren) {
	return <TipRenewalView title="동료 세팅 컨설팅" />
}

export default CompanionSetupLayout
