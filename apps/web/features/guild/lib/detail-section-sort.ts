import type { GuildMemberSortKey } from '@/features/guild/lib/sort-guild-members'
import type { GuildRosterSectionId } from '@/features/guild/types/guild-dashboard.type'
import { GUILD_EMPTY_VALUE_LABEL, type GuildMemberComparison } from '@/features/guild/types/guild-snapshot.type'

/**
 * 상세 항목별 정렬 기준.
 * 전투력·레벨=전투력, 그 외=점수(현상수배는 클리어 단계 기반 bounty 키 — 사냥 점수와 동일 순서).
 */
const DETAIL_SECTION_SORT_KEY = {
	overview: 'combatPower',
	bounty: 'bounty',
	expedition: 'expeditionScore',
	rivalry: 'rivalry',
	training: 'training',
	'guild-boss': 'guildBoss'
} as const satisfies Record<GuildRosterSectionId, GuildMemberSortKey>

/** 로스터 카드에 보여줄 항목 최신 수치·증감 */
type DetailSectionMetricDisplay = {
	/** 최신 절대값 라벨 */
	valueLabel: string
	/** 증감량 (▲/▼·한국어 단위). 없으면 null */
	changeDeltaLabel: string | null
	/** 증감율 (%). 레벨·단계처럼 %가 없으면 null */
	changePercentLabel: string | null
}

function getDetailSectionSortKey(sectionId: GuildRosterSectionId): GuildMemberSortKey {
	return DETAIL_SECTION_SORT_KEY[sectionId]
}

/**
 * 선택한 상세 항목의 최신 수치·증감 라벨.
 * 증감율 스위치 ON일 때 카드에 percent/delta를 붙일 때 사용합니다.
 */
function getDetailSectionMetricDisplay(
	comparison: GuildMemberComparison,
	sectionId: GuildRosterSectionId
): DetailSectionMetricDisplay {
	switch (sectionId) {
		case 'overview': {
			const { combatPower } = comparison
			return {
				valueLabel: combatPower.hasValue ? combatPower.currentLabel : GUILD_EMPTY_VALUE_LABEL,
				changeDeltaLabel: combatPower.diffLabel,
				changePercentLabel: combatPower.diffPercentLabel
			}
		}
		case 'expedition': {
			const { expeditionScore } = comparison
			return {
				valueLabel: expeditionScore.hasValue ? expeditionScore.currentLabel : GUILD_EMPTY_VALUE_LABEL,
				changeDeltaLabel: expeditionScore.diffLabel,
				changePercentLabel: expeditionScore.diffPercentLabel
			}
		}
		case 'rivalry': {
			const { rivalry } = comparison
			return {
				valueLabel: rivalry.hasValue ? rivalry.currentLabel : GUILD_EMPTY_VALUE_LABEL,
				changeDeltaLabel: rivalry.diffLabel,
				changePercentLabel: rivalry.diffPercentLabel
			}
		}
		case 'training': {
			const { training } = comparison
			return {
				valueLabel: training.hasValue ? training.currentLabel : GUILD_EMPTY_VALUE_LABEL,
				changeDeltaLabel: training.diffLabel,
				changePercentLabel: training.diffPercentLabel
			}
		}
		case 'guild-boss': {
			const { guildBoss } = comparison
			return {
				valueLabel: guildBoss.hasValue ? guildBoss.currentLabel : GUILD_EMPTY_VALUE_LABEL,
				changeDeltaLabel: guildBoss.diffLabel,
				changePercentLabel: guildBoss.diffPercentLabel
			}
		}
		case 'bounty': {
			const { bounty } = comparison
			// currentLabel 이 이미 "N단계" 형태
			return {
				valueLabel: bounty.hasValue ? bounty.currentLabel : GUILD_EMPTY_VALUE_LABEL,
				changeDeltaLabel: bounty.diffLabel,
				/** 클리어 단계는 %가 없어 증감량만 */
				changePercentLabel: null
			}
		}
	}
}

export { DETAIL_SECTION_SORT_KEY, getDetailSectionMetricDisplay, getDetailSectionSortKey }
export type { DetailSectionMetricDisplay }
