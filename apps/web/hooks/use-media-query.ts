'use client'

import { useEffect, useState } from 'react'

/**
 * `window.matchMedia`로 뷰포트 조건을 구독합니다.
 * SSR/첫 페인트에서는 `defaultValue`(기본 false)를 쓰고, mount 후 실제 값으로 맞춥니다.
 */
function useMediaQuery(query: string, defaultValue = false): boolean {
	const [matches, setMatches] = useState(defaultValue)

	useEffect(() => {
		const media = window.matchMedia(query)
		const update = () => setMatches(media.matches)

		update()
		media.addEventListener('change', update)

		return () => media.removeEventListener('change', update)
	}, [query])

	return matches
}

export default useMediaQuery
