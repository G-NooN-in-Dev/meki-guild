import { NextResponse } from 'next/server'

import { MgfRequestError } from '@/libs/mgf.client.server'
import { loadMgfCharacterPortrait } from '@/libs/mgf-character-portrait.loader.server'

export const dynamic = 'force-dynamic'

/** mgf.gg 초상화 same-origin 프록시. 클라이언트는 이 경로만 이미지 src로 씁니다. */
async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const nickname = searchParams.get('n')?.trim() ?? ''

	if (!nickname) {
		return NextResponse.json({ message: '닉네임을 입력해 주세요.' }, { status: 400 })
	}

	try {
		const { body, contentType } = await loadMgfCharacterPortrait(nickname)

		return new NextResponse(body, {
			status: 200,
			headers: {
				'Content-Type': contentType,
				'Cache-Control': 'public, max-age=3600, s-maxage=3600',
				'Cross-Origin-Resource-Policy': 'same-origin'
			}
		})
	} catch (error) {
		if (error instanceof MgfRequestError) {
			return NextResponse.json({ message: error.message }, { status: error.status })
		}

		const message = error instanceof Error ? error.message : '초상화를 조회하지 못했습니다.'
		return NextResponse.json({ message }, { status: 502 })
	}
}

export { GET }
