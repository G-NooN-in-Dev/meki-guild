'use client'

import { Button } from '@shared/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger
} from '@shared/ui/popover'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { CalendarClockIcon } from 'lucide-react'

import {
	formatGuildContentDateOrNone,
	GUILD_CONTENT_UPDATED_AT,
	type GuildContentDateRange
} from '@/libs/guild-content-dates.constants'
import { getGuildContentsOrder } from '@/libs/guild-contents-order.constants'

/** 팝오버 테이블에 보여줄 컨텐츠 행 (라벨 + 수집일). 표시 순서 컨텐츠는 상수 순서 */
const CONTENT_UPDATED_AT_ROWS: { label: string; dates: GuildContentDateRange }[] = [
	{ label: '전투력 · 레벨', dates: GUILD_CONTENT_UPDATED_AT.combatPower },
	{ label: '토벌전', dates: GUILD_CONTENT_UPDATED_AT.expedition },
	{ label: '대항전', dates: GUILD_CONTENT_UPDATED_AT.rivalry },
	...getGuildContentsOrder().map(({ key, label }) => ({
		label,
		dates: GUILD_CONTENT_UPDATED_AT[key]
	}))
]

function ContentUpdatedAtGuide() {
	return (
		<Popover>
			<PopoverTrigger
				render={
					<Button
						variant="outline"
						size="sm"
						className="text-grayscale-600 shrink-0 gap-1.5"
						aria-label="업데이트 기준일"
					>
						<CalendarClockIcon className="size-4" />
						<span className="hidden lg:inline">업데이트 기준일</span>
					</Button>
				}
			/>
			{/* 기본 w-72는 표에 좁아서 약간 넓힘 */}
			<PopoverContent align="end" className="w-80 gap-3 p-3">
				<PopoverHeader>
					<PopoverTitle>업데이트 기준일</PopoverTitle>
					<PopoverDescription>항목별 직전·최신 수집일</PopoverDescription>
				</PopoverHeader>
				<div className="border-grayscale-200 overflow-hidden rounded-lg border">
					<Table>
						<TableHeader>
							<TableRow className="bg-grayscale-50 hover:bg-grayscale-50">
								<TableHead className="text-grayscale-500 h-8 px-2 text-xs">항목</TableHead>
								<TableHead className="text-grayscale-500 h-8 px-2 text-center text-xs">직전</TableHead>
								<TableHead className="text-grayscale-500 h-8 px-2 text-center text-xs">최신</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{CONTENT_UPDATED_AT_ROWS.map((row) => (
								<TableRow key={row.label}>
									<TableCell className="px-2 py-1.5 text-xs font-medium">{row.label}</TableCell>
									<TableCell className="text-grayscale-700 px-2 py-1.5 text-center text-xs tabular-nums">
										{formatGuildContentDateOrNone(row.dates.previous)}
									</TableCell>
									<TableCell className="text-grayscale-900 px-2 py-1.5 text-center text-xs font-semibold tabular-nums">
										{formatGuildContentDateOrNone(row.dates.current)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default ContentUpdatedAtGuide
