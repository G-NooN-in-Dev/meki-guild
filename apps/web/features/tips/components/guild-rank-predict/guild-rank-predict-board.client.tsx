'use client'

import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Spinner } from '@shared/ui/spinner'
import { cn } from '@shared/ui/utils'
import { type ComponentType, type ReactNode, useState } from 'react'

import { RANK_PREDICT_MIN_GUILDS } from '@/features/tips/lib/guild-rank-predict.constants'
import {
	collectGuildNames,
	fetchGuildInfo,
	toPredictMembers,
	wait
} from '@/features/tips/lib/guild-rank-predict.helpers'
import type { RankPredictMember } from '@/features/tips/types/guild-rank-predict.type'

type RankPredictResultBase = {
	members: readonly unknown[]
	guilds: readonly unknown[]
}

type PredictPhase<TResult> =
	| { type: 'idle' }
	| { type: 'fetching'; guildName: string }
	| { type: 'sorting' }
	| { type: 'predicting' }
	| { type: 'done'; result: TResult }
	| { type: 'error'; message: string }

type GuildRankPredictBoardProps<TResult extends RankPredictResultBase> = {
	maxGuilds: number
	/** 기본: RANK_PREDICT_MIN_GUILDS */
	minGuilds?: number
	/** input/label id 접두사. 예: `rivalry-predict-guild` */
	inputIdPrefix: string
	/** 길드 입력 그리드 className */
	inputGridClassName?: string
	hint: ReactNode
	memberTableTitle?: string
	guildTableTitle: string
	buildResult: (members: RankPredictMember[]) => TResult
	MemberTable: ComponentType<{ rows: TResult['members'] }>
	GuildTable: ComponentType<{ rows: TResult['guilds'] }>
}

/** 길드 입력 → 조회 → 정렬·합산 → 결과 표. 대항전·수련장 공통 보드 */
function GuildRankPredictBoard<TResult extends RankPredictResultBase>({
	maxGuilds,
	minGuilds = RANK_PREDICT_MIN_GUILDS,
	inputIdPrefix,
	inputGridClassName,
	hint,
	memberTableTitle = '참가자 전투력 순위',
	guildTableTitle,
	buildResult,
	MemberTable,
	GuildTable
}: GuildRankPredictBoardProps<TResult>) {
	const [guildInputs, setGuildInputs] = useState(() => Array.from({ length: maxGuilds }, () => ''))
	const [phase, setPhase] = useState<PredictPhase<TResult>>({ type: 'idle' })

	const isBusy = phase.type === 'fetching' || phase.type === 'sorting' || phase.type === 'predicting'

	async function handlePredict() {
		const names = collectGuildNames(guildInputs)

		if (names.length < minGuilds) {
			setPhase({
				type: 'error',
				message: `길드명을 최소 ${minGuilds}개 이상 입력해 주세요.`
			})
			return
		}

		const unique = new Set(names)
		if (unique.size !== names.length) {
			setPhase({ type: 'error', message: '같은 길드명을 중복으로 입력할 수 없습니다.' })
			return
		}

		try {
			const allMembers: RankPredictMember[] = []

			for (let index = 0; index < names.length; index += 1) {
				const guildName = names[index]!
				setPhase({ type: 'fetching', guildName })
				const info = await fetchGuildInfo(guildName)
				allMembers.push(...toPredictMembers(index, info.guildName, info))
			}

			setPhase({ type: 'sorting' })
			await wait(400)

			setPhase({ type: 'predicting' })
			await wait(400)

			const result = buildResult(allMembers)
			setPhase({ type: 'done', result })
		} catch (error) {
			const message = error instanceof Error ? error.message : '순위 예측 중 오류가 발생했습니다.'
			setPhase({ type: 'error', message })
		}
	}

	function handleReset() {
		setGuildInputs(Array.from({ length: maxGuilds }, () => ''))
		setPhase({ type: 'idle' })
	}

	const loadingMessage =
		phase.type === 'fetching'
			? `${phase.guildName} 길드의 정보를 조회중입니다`
			: phase.type === 'sorting'
				? '참가자의 순위를 정렬중입니다'
				: phase.type === 'predicting'
					? '길드 순위를 예측중입니다.'
					: null

	return (
		<div className="flex w-full min-w-0 flex-col gap-6">
			<div className="border-grayscale-200 bg-grayscale-50/60 flex flex-col gap-4 rounded-xl border p-4 md:p-5">
				<div className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-3', inputGridClassName)}>
					{guildInputs.map((value, index) => (
						<div key={index} className="flex flex-col gap-1.5">
							<Label htmlFor={`${inputIdPrefix}-${index}`}>길드 {index + 1}</Label>
							<Input
								id={`${inputIdPrefix}-${index}`}
								value={value}
								disabled={isBusy}
								placeholder="길드명 입력"
								onChange={(event) => {
									const next = [...guildInputs]
									next[index] = event.target.value
									setGuildInputs(next)
								}}
							/>
						</div>
					))}
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<Button type="button" disabled={isBusy} onClick={() => void handlePredict()}>
						순위 예측하기
					</Button>
					{(phase.type === 'done' || phase.type === 'error') && (
						<Button type="button" variant="outline" disabled={isBusy} onClick={handleReset}>
							다시 입력
						</Button>
					)}
				</div>

				<p className="text-grayscale-500 text-xs">{hint}</p>
			</div>

			{loadingMessage && (
				<div
					className="border-grayscale-200 bg-background flex items-center justify-center gap-3 rounded-xl border px-4 py-16"
					role="status"
					aria-live="polite"
				>
					<Spinner className="size-5" />
					<p className="text-grayscale-700 text-sm font-medium md:text-base">{loadingMessage}</p>
				</div>
			)}

			{phase.type === 'error' && (
				<div className="border-pastel-red-200 bg-pastel-red-50 text-pastel-red-800 rounded-xl border px-4 py-3 text-sm">
					{phase.message}
				</div>
			)}

			{phase.type === 'done' && (
				<div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
					<div className="order-2 flex min-w-0 flex-col gap-3 lg:order-1">
						<h2 className="text-grayscale-900 text-base font-semibold">{memberTableTitle}</h2>
						<MemberTable rows={phase.result.members} />
					</div>

					<aside className="order-1 flex min-w-0 flex-col gap-3 lg:sticky lg:top-24 lg:order-2">
						<h2 className="text-grayscale-900 text-base font-semibold">{guildTableTitle}</h2>
						<GuildTable rows={phase.result.guilds} />
					</aside>
				</div>
			)}
		</div>
	)
}

export default GuildRankPredictBoard
