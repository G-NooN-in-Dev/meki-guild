import { type PropsWithChildren } from 'react'

/**
 * 유물 세팅 구간의 레이아웃 경계.
 * 같은 폴더의 not-found.tsx가 notFound() 시 이 구간 UI로 렌더되게 합니다.
 */
function RelicSetupLayout({ children }: PropsWithChildren) {
	return children
}

export default RelicSetupLayout
