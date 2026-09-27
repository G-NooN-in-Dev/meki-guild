'use client'

import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'
import { Spinner } from '@shared/ui/spinner'
import { useState } from 'react'

import ExpeditionTierGuide from '@/features/guild/components/expedition-tier-guide'
import WorldBossTierGuide from '@/features/guild/components/world-boss-tier-guide'
import CharacterCompareResultBoard from '@/features/tips/components/character-compare/character-compare-result-board'
import { compareCharacters, fetchCharacterInfo, wait } from '@/features/tips/lib/character-compare.helpers'
import type { CharacterCompareResult } from '@/features/tips/types/character-compare.type'

type ComparePhase =
	| { type: 'idle' }
	| { type: 'fetching'; nickname: string }
	| { type: 'comparing' }
	| { type: 'done'; result: CharacterCompareResult }
	| { type: 'error'; message: string }

/** 닉네임 2개 입력 → mgf 캐릭터 조회 → 1 vs 1 비교 */
function CharacterCompareBoard() {
	const [selfName, setSelfName] = useState('')
	const [opponentName, setOpponentName] = useState('')
	const [phase, setPhase] = useState<ComparePhase>({ type: 'idle' })

	const isBusy = phase.type === 'fetching' || phase.type === 'comparing'

	async function handleCompare() {
		const self = selfName.trim()
		const opponent = opponentName.trim()

		if (!self || !opponent) {
			setPhase({ type: 'error', message: '나와 상대방 닉네임을 모두 입력해 주세요.' })
			return
		}

		if (self.toLowerCase() === opponent.toLowerCase()) {
			setPhase({ type: 'error', message: '서로 다른 닉네임을 입력해 주세요.' })
			return
		}

		try {
			setPhase({ type: 'fetching', nickname: self })
			const left = await fetchCharacterInfo(self)

			setPhase({ type: 'fetching', nickname: opponent })
			const right = await fetchCharacterInfo(opponent)

			setPhase({ type: 'comparing' })
			await wait(300)

			setPhase({ type: 'done', result: compareCharacters(left, right) })
		} catch (error) {
			const message = error instanceof Error ? error.message : '캐릭터 비교 중 오류가 발생했습니다.'
			setPhase({ type: 'error', message })
		}
	}

	function handleReset() {
		setSelfName('')
		setOpponentName('')
		setPhase({ type: 'idle' })
	}

	const loadingMessage =
		phase.type === 'fetching'
			? `「${phase.nickname}」 캐릭터 정보를 조회중입니다`
			: phase.type === 'comparing'
				? '스펙을 비교중입니다'
				: null

	return (
		<div className="flex w-full min-w-0 flex-col gap-6">
			<div className="border-grayscale-200 bg-grayscale-50/60 flex flex-col gap-4 rounded-xl border p-4 md:p-5">
				<div className="grid gap-3 sm:grid-cols-2">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="character-compare-self">나</Label>
						<Input
							id="character-compare-self"
							value={selfName}
							disabled={isBusy}
							placeholder="내 닉네임"
							onChange={(event) => setSelfName(event.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="character-compare-opponent">상대방</Label>
						<Input
							id="character-compare-opponent"
							value={opponentName}
							disabled={isBusy}
							placeholder="상대 닉네임"
							onChange={(event) => setOpponentName(event.target.value)}
						/>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<Button type="button" disabled={isBusy} onClick={() => void handleCompare()}>
						비교하기
					</Button>
					{(phase.type === 'done' || phase.type === 'error') && (
						<Button type="button" variant="outline" disabled={isBusy} onClick={handleReset}>
							다시 입력
						</Button>
					)}
				</div>

				<div className="text-grayscale-500 flex flex-wrap items-center justify-between gap-2 text-xs">
					<span>나와 상대방의 닉네임을 차례대로 입력하세요. 데이터는 MGF.GG 기준입니다.</span>
					<div className="flex flex-wrap items-center gap-2">
						<ExpeditionTierGuide compactMobileLabel={false} showPoints={false} />
						<WorldBossTierGuide compactMobileLabel={false} />
					</div>
				</div>
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

			{phase.type === 'done' && <CharacterCompareResultBoard comparison={phase.result} />}
		</div>
	)
}

export default CharacterCompareBoard
