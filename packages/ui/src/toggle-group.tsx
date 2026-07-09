'use client'

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'
import { type VariantProps } from 'class-variance-authority'
import { createContext, type CSSProperties, useContext } from 'react'

import { cn } from './lib/utils'
import { togglePressedClassName, toggleVariants } from './toggle'

/** Tailwind `data-horizontal:` / `data-vertical:` 변형이 인식하는 data 속성 */
function orientationDataAttributes(orientation: 'horizontal' | 'vertical') {
	return orientation === 'horizontal' ? { 'data-horizontal': '' } : { 'data-vertical': '' }
}

const ToggleGroupContext = createContext<
	VariantProps<typeof toggleVariants> & {
		spacing?: number
		orientation?: 'horizontal' | 'vertical'
	}
>({
	size: 'default',
	variant: 'default',
	spacing: 2,
	orientation: 'horizontal'
})

function ToggleGroup({
	className,
	variant,
	size,
	spacing = 2,
	orientation = 'horizontal',
	children,
	...props
}: ToggleGroupPrimitive.Props &
	VariantProps<typeof toggleVariants> & {
		spacing?: number
		orientation?: 'horizontal' | 'vertical'
	}) {
	return (
		<ToggleGroupPrimitive
			data-slot="toggle-group"
			data-variant={variant}
			data-size={size}
			data-spacing={spacing}
			data-orientation={orientation}
			{...orientationDataAttributes(orientation)}
			style={{ '--gap': spacing } as CSSProperties}
			className={cn(
				'group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-md data-horizontal:flex-row data-vertical:flex-col data-vertical:items-stretch data-[spacing=0]:data-[variant=outline]:shadow-xs',
				className
			)}
			{...props}
		>
			<ToggleGroupContext.Provider value={{ variant, size, spacing, orientation }}>
				{children}
			</ToggleGroupContext.Provider>
		</ToggleGroupPrimitive>
	)
}

function ToggleGroupItem({
	className,
	children,
	variant = 'default',
	size = 'default',
	...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
	const context = useContext(ToggleGroupContext)

	return (
		<TogglePrimitive
			data-slot="toggle-group-item"
			data-variant={context.variant || variant}
			data-size={context.size || size}
			data-spacing={context.spacing}
			className={(state) =>
				cn(
					'shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 group-data-[spacing=0]/toggle-group:shadow-none focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-md group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-md group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-md group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-md group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t',
					toggleVariants({
						variant: context.variant || variant,
						size: context.size || size
					}),
					state.pressed && togglePressedClassName,
					typeof className === 'function' ? className(state) : className
				)
			}
			{...props}
		>
			{children}
		</TogglePrimitive>
	)
}

export { ToggleGroup, ToggleGroupItem }
