import type { ContentDifficulty, ContentKind, ContentStageCutEntry } from '@/features/tips/types/content-stage-cut.type'

/**
 * 난이도 범례·셀 스타일.
 * 동료·유물 등급 톤과 맞춤 — 쉬움=레전더리, 보통=유니크, 어려움=미스틱, 카오스=에픽.
 */
export const CONTENT_DIFFICULTIES = [
	{
		key: 'easy',
		label: '쉬움',
		chipClassName: 'bg-pastel-green-200 text-pastel-green-900'
	},
	{
		key: 'normal',
		label: '보통',
		chipClassName: 'bg-pastel-yellow-200 text-pastel-yellow-900'
	},
	{
		key: 'hard',
		label: '어려움',
		chipClassName: 'bg-pure-red/20 text-danger-700'
	},
	{
		key: 'chaos',
		label: '카오스',
		chipClassName: 'bg-pastel-purple-200 text-pastel-purple-900'
	}
] as const satisfies readonly {
	key: ContentDifficulty
	label: string
	chipClassName: string
}[]

/** 컨텐츠 종류 표시 라벨 */
export const CONTENT_KIND_LABELS = {
	'party-quest': '파티퀘스트',
	'boss-raid': '보스레이드'
} as const satisfies Record<ContentKind, string>

/**
 * 컨텐츠별 스테이지컷 원본 데이터.
 * 배열 순서가 타임라인 열 순서입니다.
 * 표기 `스테이지-컷` (예: 7-5). 카오스가 없는 컨텐츠는 chaos = null.
 */
export const CONTENT_STAGE_CUTS = [
	{
		name: '첫 번째 동행',
		rewards: ['반지'],
		kind: 'party-quest',
		stageCuts: { easy: '7-5', normal: '12-5', hard: '19-5', chaos: '26-5' }
	},
	{
		name: '차원의 균열',
		rewards: ['목걸이'],
		kind: 'party-quest',
		stageCuts: { easy: '15-5', normal: '20-5', hard: '25-5', chaos: '30-5' }
	},
	{
		name: '자쿰',
		rewards: ['모자', '눈장식'],
		kind: 'boss-raid',
		stageCuts: { easy: '13-10', normal: '18-10', hard: '25-10', chaos: '31-15' }
	},
	{
		name: '여신의 흔적',
		rewards: ['얼굴장식'],
		kind: 'party-quest',
		stageCuts: { easy: '17-10', normal: '23-10', hard: '28-10', chaos: '33-15' }
	},
	{
		name: '로미오와 줄리엣',
		rewards: ['반지2'],
		kind: 'party-quest',
		stageCuts: { easy: '22-10', normal: '27-10', hard: '32-15', chaos: null }
	},
	{
		name: '혼테일',
		rewards: ['귀걸이', '목걸이'],
		kind: 'boss-raid',
		stageCuts: { easy: '26-10', normal: '31-15', hard: '36-15', chaos: '41-20' }
	}
] as const satisfies readonly ContentStageCutEntry[]

/** 파싱된 스테이지컷 한 칸 */
export type ParsedStageCut = {
	/** "7-5" 원문 (= 행 키) */
	raw: string
	stage: number
	cut: number
	difficulty: ContentDifficulty
}

/** 타임라인 세로 행 — 스테이지 다음 컷 순 */
export type StageCutRow = {
	raw: string
	stage: number
	cut: number
}

/** "7-5" → 스테이지·컷 숫자. 형식이 아니면 null */
export function parseStageCut(raw: string): { stage: number; cut: number } | null {
	const match = /^(\d+)-(\d+)$/.exec(raw)

	if (!match) {
		return null
	}

	const [, stageText, cutText] = match

	return {
		stage: Number(stageText),
		cut: Number(cutText)
	}
}

/** 스테이지 우선, 같으면 컷 오름차순 (25-5가 25-10보다 위) */
export function compareStageCut(left: { stage: number; cut: number }, right: { stage: number; cut: number }) {
	if (left.stage !== right.stage) {
		return left.stage - right.stage
	}

	return left.cut - right.cut
}

/** 열 목록 — CONTENT_STAGE_CUTS 선언 순서를 그대로 사용합니다. */
export const CONTENT_STAGE_CUT_COLUMNS = CONTENT_STAGE_CUTS

/** 한 컨텐츠의 raw("25-5") → 파싱된 컷 */
function buildStageCutByRaw(entry: ContentStageCutEntry) {
	const map = new Map<string, ParsedStageCut>()

	for (const { key } of CONTENT_DIFFICULTIES) {
		const raw = entry.stageCuts[key]

		if (raw === null) {
			continue
		}

		const parsed = parseStageCut(raw)

		if (!parsed) {
			continue
		}

		const { stage, cut } = parsed

		map.set(raw, {
			raw,
			stage,
			cut,
			difficulty: key
		})
	}

	return map
}

/** 열별 raw 맵 (렌더에서 셀 조회) */
export const CONTENT_STAGE_CUT_COLUMN_MAPS = CONTENT_STAGE_CUT_COLUMNS.map((entry) => ({
	entry,
	byRaw: buildStageCutByRaw(entry)
}))

/**
 * 전체 타임라인 행.
 * 같은 스테이지라도 컷이 다르면 별도 행 (예: 25-5 → 25-10).
 */
export const CONTENT_STAGE_ROWS: StageCutRow[] = [
	...new Map(
		CONTENT_STAGE_CUT_COLUMN_MAPS.flatMap(({ byRaw }) =>
			[...byRaw.values()].map((cut) => [cut.raw, { raw: cut.raw, stage: cut.stage, cut: cut.cut }])
		)
	).values()
].sort(compareStageCut)

/** 표시용 라벨 — "7-5" → "7 - 5" */
export function formatStageCutLabel(raw: string) {
	const parsed = parseStageCut(raw)

	if (!parsed) {
		return raw
	}

	const { stage, cut } = parsed

	return `${stage} - ${cut}`
}

export function getDifficultyChipClassName(difficulty: ContentDifficulty) {
	return (
		CONTENT_DIFFICULTIES.find((item) => item.key === difficulty)?.chipClassName ?? 'bg-grayscale-200 text-grayscale-800'
	)
}
