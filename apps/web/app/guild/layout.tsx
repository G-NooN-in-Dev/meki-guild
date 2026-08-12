import type { PropsWithChildren } from 'react'

import GuildAccessGate from '@/features/guild/components/guild-access-gate'
import NameRevealProvider from '@/features/guild/context/name-reveal.context'

/** 길드 정보 구역 — 비밀번호 게이트와 실명 공개 상태를 공유합니다. */
function GuildLayout({ children }: PropsWithChildren) {
	return (
		<NameRevealProvider>
			<GuildAccessGate>{children}</GuildAccessGate>
		</NameRevealProvider>
	)
}

export default GuildLayout
