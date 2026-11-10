import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table'
import { cn } from '@shared/ui/utils'

import { HIT_CUT_CELL_BASE_CLASS_NAME, HitCutTableShell } from '@/features/tips/components/shared/hit-cut-table-shell'
import { GUILD_BOSS_DEFENSE, GUILD_BOSS_REQUIRED_HIT } from '@/features/tips/lib/guild-boss.constants'
import { formatLocaleNumber } from '@/utils/format-korean-number'

/** 긴 헤더가 모바일에서 칸 밖으로 나가지 않도록 줄바꿈을 허용합니다. */
const HEAD_CLASS_NAME =
	'h-auto px-1 py-2 text-center text-xs leading-tight break-keep whitespace-normal xs:px-2 md:px-3 md:text-sm'

/**
 * 길드 보스대전 필요 명중·방어력 표.
 * 단계가 없어 한 줄로 강조합니다.
 */
function GuildBossStatsTable() {
	return (
		<HitCutTableShell scrollable={false}>
			<TableHeader>
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableHead className={cn(HEAD_CLASS_NAME, 'bg-pastel-blue-100 text-pastel-blue-900 w-1/2')}>
						필요 명중
					</TableHead>
					<TableHead className={cn(HEAD_CLASS_NAME, 'bg-pastel-orange-100 text-pastel-orange-900 w-1/2')}>
						방어력
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow className="border-grayscale-200 hover:bg-transparent">
					<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-pastel-blue-50 text-grayscale-900')}>
						{formatLocaleNumber(GUILD_BOSS_REQUIRED_HIT)}
					</TableCell>
					<TableCell className={cn(HIT_CUT_CELL_BASE_CLASS_NAME, 'bg-pastel-orange-50 text-grayscale-900')}>
						{formatLocaleNumber(GUILD_BOSS_DEFENSE)}
					</TableCell>
				</TableRow>
			</TableBody>
		</HitCutTableShell>
	)
}

export default GuildBossStatsTable
