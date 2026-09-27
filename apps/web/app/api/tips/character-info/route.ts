import { NextResponse } from 'next/server'

import { MgfRequestError } from '@/libs/mgf.client.server'
import { loadMgfCharacter } from '@/libs/mgf-character.loader.server'

export const dynamic = 'force-dynamic'

/** mgf.gg 캐릭터 정보 프록시. 클라이언트는 이 경로만 호출합니다. */
async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const nickname = searchParams.get('n')?.trim() ?? ''

	if (!nickname) {
		return NextResponse.json({ message: '닉네임을 입력해 주세요.' }, { status: 400 })
	}

	try {
		const data = await loadMgfCharacter(nickname)
		return NextResponse.json(data)
	} catch (error) {
		if (error instanceof MgfRequestError) {
			return NextResponse.json({ message: error.message }, { status: error.status })
		}

		const message = error instanceof Error ? error.message : '캐릭터 정보를 조회하지 못했습니다.'
		return NextResponse.json({ message }, { status: 502 })
	}
}

export { GET }
