/** Popover·Tooltip·HoverCard 등 Base UI Positioner side 옵션 */
export const positionerSideOptions = ['top', 'right', 'bottom', 'left'] as const

type PositionerSide = (typeof positionerSideOptions)[number]

/** Popover·Tooltip·HoverCard 등 Base UI Positioner align 옵션 */
export const positionerAlignOptions = ['start', 'center', 'end'] as const

type PositionerAlign = (typeof positionerAlignOptions)[number]

/** Tabs·Slider·ToggleGroup·Separator 등 가로/세로 배치 옵션 */
export const orientationOptions = ['horizontal', 'vertical'] as const

type Orientation = (typeof orientationOptions)[number]

export type { Orientation, PositionerAlign, PositionerSide }
