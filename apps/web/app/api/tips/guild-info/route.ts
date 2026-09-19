import { NextResponse } from 'next/server'

import { loadMgfGuildInfo, MgfGuildInfoError } from '@/libs/mgf-guild-info.loader.server'

export const dynamic = 'force-dynamic'

/** mgf.gg 길드 정보 프록시. 클라이언트는 이 경로만 호출합니다. */
async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const guildName = searchParams.get('g_name')?.trim() ?? ''

	if (!guildName) {
		return NextResponse.json({ message: '길드명을 입력해 주세요.' }, { status: 400 })
	}

	try {
		const data = await loadMgfGuildInfo(guildName)
		return NextResponse.json(data)
	} catch (error) {
		if (error instanceof MgfGuildInfoError) {
			return NextResponse.json({ message: error.message }, { status: error.status })
		}

		const message = error instanceof Error ? error.message : '길드 정보를 조회하지 못했습니다.'
		return NextResponse.json({ message }, { status: 502 })
	}
}

export { GET }
