'use client'

import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Spinner } from '@shared/ui/spinner'
import { useState } from 'react'

import {
	TRAINING_PREDICT_MAX_GUILDS,
	TRAINING_PREDICT_MIN_GUILDS
} from '@/features/tips/lib/guild-training-rank-predict.constants'
import { buildTrainingPredictResult, collectGuildNames } from '@/features/tips/lib/guild-training-rank-predict.helpers'
import type { MgfGuildInfoResponse } from '@/features/tips/types/guild-rivalry-rank-predict.type'
import type {
	TrainingPredictMember,
	TrainingPredictResult
} from '@/features/tips/types/guild-training-rank-predict.type'

import TrainingPredictGuildTable from './training-predict-guild-table'
import TrainingPredictMemberTable from './training-predict-member-table'

type PredictPhase =
	| { type: 'idle' }
	| { type: 'fetching'; guildName: string }
	| { type: 'sorting' }
	| { type: 'predicting' }
	| { type: 'done'; result: TrainingPredictResult }
	| { type: 'error'; message: string }

function createEmptyGuildInputs(): string[] {
	return Array.from({ length: TRAINING_PREDICT_MAX_GUILDS }, () => '')
}

function wait(ms: number) {
	return new Promise<void>((resolve) => {
		setTimeout(resolve, ms)
	})
}

async function fetchGuildInfo(guildName: string): Promise<MgfGuildInfoResponse> {
	const response = await fetch(`/api/tips/guild-info?g_name=${encodeURIComponent(guildName)}`)
	const body = (await response.json()) as MgfGuildInfoResponse & { message?: string }

	if (!response.ok) {
		throw new Error(body.message ?? `「${guildName}」 길드 정보를 조회하지 못했습니다.`)
	}

	return body
}

function toPredictMembers(
	guildIndex: number,
	guildName: string,
	response: MgfGuildInfoResponse
): TrainingPredictMember[] {
	return response.members.map((member) => ({
		name: member.name,
		job: member.job,
		level: member.level,
		combatPower: BigInt(member.combatPower),
		combatPowerLabel: member.combatPowerLabel,
		portraitUrl: member.portraitUrl,
		guildName,
		serverLabel: response.serverLabel,
		guildIndex
	}))
}

/** 길드 입력 → 조회 → 정렬·합산 → 결과 표 */
function GuildTrainingRankPredictBoard() {
	const [guildInputs, setGuildInputs] = useState(createEmptyGuildInputs)
	const [phase, setPhase] = useState<PredictPhase>({ type: 'idle' })

	const isBusy = phase.type === 'fetching' || phase.type === 'sorting' || phase.type === 'predicting'

	async function handlePredict() {
		const names = collectGuildNames(guildInputs)

		if (names.length < TRAINING_PREDICT_MIN_GUILDS) {
			setPhase({
				type: 'error',
				message: `길드명을 최소 ${TRAINING_PREDICT_MIN_GUILDS}개 이상 입력해 주세요.`
			})
			return
		}

		const unique = new Set(names)
		if (unique.size !== names.length) {
			setPhase({ type: 'error', message: '같은 길드명을 중복으로 입력할 수 없습니다.' })
			return
		}

		try {
			const allMembers: TrainingPredictMember[] = []

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

			const result = buildTrainingPredictResult(allMembers)
			setPhase({ type: 'done', result })
		} catch (error) {
			const message = error instanceof Error ? error.message : '순위 예측 중 오류가 발생했습니다.'
			setPhase({ type: 'error', message })
		}
	}

	function handleReset() {
		setGuildInputs(createEmptyGuildInputs())
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
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{guildInputs.map((value, index) => (
						<div key={index} className="flex flex-col gap-1.5">
							<Label htmlFor={`training-predict-guild-${index}`}>길드 {index + 1}</Label>
							<Input
								id={`training-predict-guild-${index}`}
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

				<p className="text-grayscale-500 text-xs">
					수련장에 매칭된 길드명을 순서대로 입력하세요. 전투력 데이터는 MGF.GG 기준입니다. <br />
					단순 전투력 기준 비교이므로 실제 결과와 다를 수 있습니다.
				</p>
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
						<h2 className="text-grayscale-900 text-base font-semibold">참가자 전투력 순위</h2>
						<TrainingPredictMemberTable rows={phase.result.members} />
					</div>

					<aside className="order-1 flex min-w-0 flex-col gap-3 lg:sticky lg:top-24 lg:order-2">
						<h2 className="text-grayscale-900 text-base font-semibold">길드 수련장 예측 순위</h2>
						<TrainingPredictGuildTable rows={phase.result.guilds} />
					</aside>
				</div>
			)}
		</div>
	)
}

export default GuildTrainingRankPredictBoard
