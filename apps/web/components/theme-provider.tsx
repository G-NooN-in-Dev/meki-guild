'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ComponentProps } from 'react'

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>

/** next-themes 래퍼 — class 기반 다크 모드, localStorage에 light/dark만 유지 */
function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="meki-theme" {...props}>
			{children}
		</NextThemesProvider>
	)
}

export default ThemeProvider
