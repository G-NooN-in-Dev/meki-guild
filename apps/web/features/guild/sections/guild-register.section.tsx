'use client'

import { Card, CardContent } from '@shared/ui/card'
import Link from 'next/link'

import GuildRegisterForm from '@/features/guild/components/guild-register-form'
import type { MemberSelectOption } from '@/features/guild/components/member-select'
import type { GuildMemberInput } from '@/features/guild/types/guild-snapshot.type'

type GuildRegisterSectionProps = {
	members: MemberSelectOption[]
	previousMembers: GuildMemberInput[]
}

/**
 * 길드 데이터 등록.
 * 길드원 → 항목(회차) → 필드 순으로 입력합니다.
 */
function GuildRegisterSection({ members, previousMembers }: GuildRegisterSectionProps) {
	return (
		<section className="flex w-full min-w-0 flex-col gap-6">
			<header className="flex flex-col gap-2">
				<p className="text-grayscale-500 text-sm">
					<Link href="/guild" className="hover:text-grayscale-800 underline-offset-2 hover:underline">
						← 대시보드
					</Link>
				</p>
				<h1 className="text-grayscale-900 text-3xl font-semibold">길드원 데이터 입력</h1>
				<p className="text-grayscale-500 text-sm">
					길드원과 항목을 선택한 뒤 데이터를 작성해주세요. 동기화는 추후 한꺼번에 진행됩니다.
				</p>
			</header>

			{/* 페이지 배경 이미지 위에서 입력 영역 대비를 확보합니다. */}
			<Card className="shadow-soft w-full max-w-lg">
				<CardContent className="pt-0">
					<GuildRegisterForm members={members} previousMembers={previousMembers} />
				</CardContent>
			</Card>
		</section>
	)
}

export default GuildRegisterSection
