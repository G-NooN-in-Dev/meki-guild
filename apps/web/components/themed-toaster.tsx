'use client'

import { Toaster } from '@shared/ui/sonner'
import { useTheme } from 'next-themes'

/** next-themes 현재 테마를 Sonner Toaster에 전달 */
function ThemedToaster() {
	const { resolvedTheme } = useTheme()
	const theme = resolvedTheme === 'dark' ? 'dark' : 'light'

	return <Toaster richColors position="top-center" theme={theme} />
}

export default ThemedToaster
