'use client'

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react'
import { type CSSProperties } from 'react'
import { toast, Toaster as Sonner, type ToasterProps } from 'sonner'

type SharedToasterProps = ToasterProps & {
	/** 앱 테마 프로바이더에서 주입. next-themes 등 프레임워크 의존은 패키지 밖에서 처리한다. */
	theme?: ToasterProps['theme']
}

function Toaster({ theme = 'system', ...props }: SharedToasterProps) {
	return (
		<Sonner
			theme={theme}
			richColors
			className="toaster group"
			icons={{
				success: <CircleCheckIcon className="size-4" />,
				info: <InfoIcon className="size-4" />,
				warning: <TriangleAlertIcon className="size-4" />,
				error: <OctagonXIcon className="size-4" />,
				loading: <Loader2Icon className="size-4 animate-spin" />
			}}
			style={
				{
					// Tailwind v4 @theme 토큰명(--color-*)에 맞춤
					'--normal-bg': 'var(--color-popover)',
					'--normal-text': 'var(--color-popover-foreground)',
					'--normal-border': 'var(--color-border)',
					'--border-radius': 'var(--radius-md)',
					'--success-bg': 'var(--color-success-50)',
					'--success-border': 'var(--color-success-100)',
					'--success-text': 'var(--color-success-700)',
					'--error-bg': 'var(--color-danger-50)',
					'--error-border': 'var(--color-danger-100)',
					'--error-text': 'var(--color-danger-700)'
				} as CSSProperties
			}
			toastOptions={{
				classNames: {
					toast: 'cn-toast'
				}
			}}
			{...props}
		/>
	)
}

export { toast, Toaster }
