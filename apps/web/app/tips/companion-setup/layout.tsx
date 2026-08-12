import { type PropsWithChildren } from 'react'

/**
 * 동료 세팅 구간의 레이아웃 경계.
 * 같은 폴더의 not-found.tsx가 notFound() 시 이 구간 UI로 렌더되게 합니다.
 */
function CompanionSetupLayout({ children }: PropsWithChildren) {
	return children
}

export default CompanionSetupLayout
