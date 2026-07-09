'use client'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@shared/ui/empty'
import { Spinner } from '@shared/ui/spinner'
import { Swords } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import MemberComparePanel from '@/features/guild/components/member-compare-panel'
import MemberSelect, { type MemberSelectOption } from '@/features/guild/components/member-select'
import type { GuildMemberInput, MemberVsMemberComparison } from '@/features/guild/types/guild-snapshot.type'
import { formatGuildContentDate } from '@/libs/guild-content-dates.constants'
import { compareMembers } from '@/utils/compare-members'
import { parseGuildMember } from '@/utils/compare-snapshots'

type MemberCompareSectionProps = {
	updatedAt: string
	members: GuildMemberInput[]
}

/** 비교 계산을 비동기로 감싸 로딩 UI를 보여줍니다. 추후 API 연동 시에도 동일 패턴을 유지합니다. */
async function loadMemberComparison(selfName: string, opponentName: string, members: GuildMemberInput[]) {
	await new Promise((resolve) => {
		window.setTimeout(resolve, 280)
	})

	const memberMap = new Map(members.map((member) => [member.name, parseGuildMember(member)]))
	const self = memberMap.get(selfName)
	const opponent = memberMap.get(opponentName)

	if (!self || !opponent) {
		return null
	}

	return compareMembers(self, opponent)
}

type LoadedComparison = {
	selfName: string
	opponentName: string
	members: GuildMemberInput[]
	comparison: MemberVsMemberComparison | null
}

function MemberCompareSection({ updatedAt, members }: MemberCompareSectionProps) {
	const [selfName, setSelfName] = useState<string | null>(null)
	const [opponentName, setOpponentName] = useState<string | null>(null)
	const [loadedComparison, setLoadedComparison] = useState<LoadedComparison | null>(null)

	const memberOptions = useMemo<MemberSelectOption[]>(
		() =>
			members.map((member) => ({
				name: member.name,
				job: member.job,
				combatPowerLabel:
					typeof member.combatPower === 'number' ? member.combatPower.toLocaleString('ko-KR') : member.combatPower
			})),
		[members]
	)

	const canCompare = Boolean(selfName && opponentName)

	// effect 안에서 setState를 동기 호출하지 않고, 렌더 시점에 로딩 여부를 파생합니다.
	const isComparisonStale =
		canCompare &&
		(loadedComparison === null ||
			loadedComparison.selfName !== selfName ||
			loadedComparison.opponentName !== opponentName ||
			loadedComparison.members !== members)

	const isLoading = isComparisonStale
	const comparison = canCompare && !isComparisonStale && loadedComparison ? loadedComparison.comparison : null

	// 나와 상대방 선택이 바뀔 때마다 비교 데이터를 다시 계산합니다.
	useEffect(() => {
		if (!canCompare || !selfName || !opponentName) {
			return
		}

		let cancelled = false

		loadMemberComparison(selfName, opponentName, members).then((result) => {
			if (cancelled) {
				return
			}

			setLoadedComparison({
				selfName,
				opponentName,
				members,
				comparison: result
			})
		})

		return () => {
			cancelled = true
		}
	}, [canCompare, selfName, opponentName, members])

	return (
		<section className="flex w-full min-w-0 flex-col gap-4 md:gap-6">
			<header className="flex flex-col gap-2">
				<p className="text-grayscale-500 text-sm">길드원 스펙 비교</p>
				<h1 className="text-grayscale-900 text-2xl font-semibold md:text-3xl">1 vs 1 비교</h1>
				<p className="text-grayscale-600 text-sm">최근 업데이트 : {formatGuildContentDate(updatedAt)}</p>
			</header>

			<div className="border-grayscale-200 bg-card shadow-soft grid gap-3 rounded-xl border p-3 md:grid-cols-[1fr_auto_1fr] md:items-end md:gap-4 md:p-4">
				<MemberSelect
					label="나"
					members={memberOptions}
					value={selfName}
					onValueChange={setSelfName}
					excludeName={opponentName}
				/>

				<div className="text-grayscale-400 flex items-center justify-center py-0.5 text-sm font-semibold md:pb-2">
					VS
				</div>

				<MemberSelect
					label="상대방"
					members={memberOptions}
					value={opponentName}
					onValueChange={setOpponentName}
					excludeName={selfName}
				/>
			</div>

			{!canCompare ? (
				<Empty className="border-grayscale-200 bg-card shadow-soft border border-dashed">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<Swords />
						</EmptyMedia>
						<EmptyTitle>비교할 길드원을 선택하세요</EmptyTitle>
						<EmptyDescription>나와 상대방을 각각 선택하면 아래에 상세 스펙 비교가 표시됩니다.</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : null}

			{canCompare && isLoading ? (
				<div className="border-grayscale-200 bg-card shadow-soft flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border">
					<Spinner className="text-grayscale-500 size-6" />
					<p className="text-grayscale-500 text-sm">비교 데이터를 불러오는 중...</p>
				</div>
			) : null}

			{canCompare && !isLoading && comparison ? <MemberComparePanel comparison={comparison} /> : null}
		</section>
	)
}

export default MemberCompareSection
