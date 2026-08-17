'use client'

import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible'

import { cn } from './lib/utils'

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
	return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ ...props }: CollapsiblePrimitive.Trigger.Props) {
	return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
}

/** 높이는 Panel에서 transition. Base UI가 --collapsible-panel-height와 data-starting/ending-style을 여기에 둡니다 */
function CollapsibleContent({ className, children, ...props }: CollapsiblePrimitive.Panel.Props) {
	return (
		<CollapsiblePrimitive.Panel
			data-slot="collapsible-content"
			className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
			{...props}
		>
			<div className={cn(className)}>{children}</div>
		</CollapsiblePrimitive.Panel>
	)
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger }
