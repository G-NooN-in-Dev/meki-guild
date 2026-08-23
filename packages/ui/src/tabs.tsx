'use client'

import { Tabs as TabsPrimitive } from '@base-ui/react/tabs'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from './lib/utils'

/** Tailwind `data-horizontal:` / `data-vertical:` 변형이 인식하는 data 속성 */
function orientationDataAttributes(orientation: 'horizontal' | 'vertical') {
	return orientation === 'horizontal' ? { 'data-horizontal': '' } : { 'data-vertical': '' }
}

function Tabs({ className, orientation = 'horizontal', ...props }: TabsPrimitive.Root.Props) {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			orientation={orientation}
			data-orientation={orientation}
			{...orientationDataAttributes(orientation)}
			className={cn('group/tabs flex gap-2 data-horizontal:flex-col data-vertical:flex-row', className)}
			{...props}
		/>
	)
}

const tabsListVariants = cva(
	'group/tabs-list relative inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none',
	{
		variants: {
			variant: {
				default: 'bg-muted',
				line: 'gap-1 bg-transparent'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	}
)

function TabsList({
	className,
	variant = 'default',
	children,
	...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			data-variant={variant}
			className={cn(tabsListVariants({ variant }), className)}
			{...props}
		>
			{children}
			{/* 활성 탭 하이라이트 — CSS 변수로 위치·크기를 따라 미끄러짐 */}
			<TabsIndicator />
		</TabsPrimitive.List>
	)
}

function TabsIndicator({ className, ...props }: TabsPrimitive.Indicator.Props) {
	return (
		<TabsPrimitive.Indicator
			data-slot="tabs-indicator"
			renderBeforeHydration
			className={cn(
				'pointer-events-none absolute top-0 left-0 z-0 transition-[translate,width,height] duration-200 ease-out motion-reduce:transition-none',
				'h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top)',
				// default: 배경 pill
				'group-data-[variant=default]/tabs-list:bg-background group-data-[variant=default]/tabs-list:rounded-md group-data-[variant=default]/tabs-list:shadow-sm',
				'dark:group-data-[variant=default]/tabs-list:border-input dark:group-data-[variant=default]/tabs-list:bg-input/30 dark:group-data-[variant=default]/tabs-list:border',
				// line: 하단/측면 인디케이터
				'group-data-[variant=line]/tabs-list:bg-foreground group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:shadow-none',
				'group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:top-auto group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:bottom-[-5px] group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:h-0.5 group-data-horizontal/tabs:group-data-[variant=line]/tabs-list:translate-y-0',
				'group-data-vertical/tabs:group-data-[variant=line]/tabs-list:-right-1 group-data-vertical/tabs:group-data-[variant=line]/tabs-list:left-auto group-data-vertical/tabs:group-data-[variant=line]/tabs-list:w-0.5 group-data-vertical/tabs:group-data-[variant=line]/tabs-list:translate-x-0',
				className
			)}
			{...props}
		/>
	)
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
	return (
		<TabsPrimitive.Tab
			data-slot="tabs-trigger"
			className={cn(
				"text-foreground/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:text-muted-foreground dark:hover:text-foreground relative z-10 inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
				'group-data-[variant=line]/tabs-list:bg-transparent dark:group-data-[variant=line]/tabs-list:border-transparent',
				'data-active:text-foreground dark:data-active:text-foreground',
				className
			)}
			{...props}
		/>
	)
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
	return (
		<TabsPrimitive.Panel data-slot="tabs-content" className={cn('flex-1 text-sm outline-none', className)} {...props} />
	)
}

type TabsListVariant = NonNullable<VariantProps<typeof tabsListVariants>['variant']>

export const tabsListVariantOptions = ['default', 'line'] as const satisfies readonly TabsListVariant[]

export { Tabs, TabsContent, TabsIndicator, TabsList, tabsListVariants, TabsTrigger }
