'use client'

import { useSyncExternalStore } from 'react'

/**
 * `window.matchMedia`로 뷰포트 조건을 구독합니다.
 * SSR/첫 페인트에서는 `defaultValue`(기본 false)를 쓰고, 클라이언트에서 실제 값으로 맞춥니다.
 */
function useMediaQuery(query: string, defaultValue = false): boolean {
	return useSyncExternalStore(
		(onStoreChange) => {
			const media = window.matchMedia(query)
			media.addEventListener('change', onStoreChange)
			return () => media.removeEventListener('change', onStoreChange)
		},
		() => window.matchMedia(query).matches,
		() => defaultValue
	)
}

export default useMediaQuery
