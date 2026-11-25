'use client'

import { Button } from '@shared/ui/button'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

/** 헤더용 라이트↔다크 토글. 클라이언트 마운트 전에는 자리만 잡아 hydration mismatch를 피한다. */
function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme()
	const mounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false
	)

	if (!mounted) {
		return <span className="size-8 shrink-0" aria-hidden />
	}

	const isDark = resolvedTheme === 'dark'

	return (
		<Button
			type="button"
			variant="outline"
			size="icon-sm"
			onClick={() => setTheme(isDark ? 'light' : 'dark')}
			className="bg-card text-grayscale-500 hover:text-grayscale-900 hover:bg-grayscale-100"
			aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
		>
			{isDark ? <SunIcon className="size-4" aria-hidden /> : <MoonIcon className="size-4" aria-hidden />}
		</Button>
	)
}

export default ThemeToggle
