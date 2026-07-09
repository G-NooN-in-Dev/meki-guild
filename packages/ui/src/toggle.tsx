'use client'

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from './lib/utils'

/**
 * Toggle on(pressed) 상태 — Base UI state.pressed 기준 배경.
 * accent(grayscale-100)는 앱 body(bg-grayscale-100)와 동일해 pressed가 보이지 않으므로 grayscale-200 사용.
 */
const togglePressedClassName = 'bg-grayscale-200 text-foreground hover:bg-grayscale-200 hover:text-foreground'

const toggleVariants = cva(
	"group/toggle cursor-pointer inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none hover:bg-grayscale-100 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default: '',
				outline: 'border border-input bg-transparent shadow-xs hover:bg-grayscale-100'
			},
			size: {
				default: 'h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
				sm: 'h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5',
				lg: 'h-10 min-w-10 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	}
)

function Toggle({
	className,
	variant = 'default',
	size = 'default',
	...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
	return (
		<TogglePrimitive
			data-slot="toggle"
			className={(state) =>
				cn(
					toggleVariants({ variant, size }),
					// Base UI state.pressed 기준 — Tailwind data-pressed variant 대신 함수형 className 사용
					state.pressed && togglePressedClassName,
					typeof className === 'function' ? className(state) : className
				)
			}
			{...props}
		/>
	)
}

type ToggleVariant = NonNullable<VariantProps<typeof toggleVariants>['variant']>
type ToggleSize = NonNullable<VariantProps<typeof toggleVariants>['size']>

export const toggleVariantOptions = ['default', 'outline'] as const satisfies readonly ToggleVariant[]

export const toggleSizeOptions = ['default', 'sm', 'lg'] as const satisfies readonly ToggleSize[]

export { Toggle, togglePressedClassName, toggleVariants }
