'use client'

import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { CheckIcon, CopyIcon, LinkIcon } from 'lucide-react'
import { useState } from 'react'

type ConsultingShareBarProps = {
	shortId: string
	/** 게시글 path (예: /tips/companion-consulting/abc) — origin은 클라이언트에서 붙입니다. */
	path: string
}

/**
 * 게시글 ID·URL 복사 바.
 * 동료/유물 컨설팅 상세에서 공통으로 씁니다.
 */
function ConsultingShareBar({ shortId, path }: ConsultingShareBarProps) {
	const [copied, setCopied] = useState<'id' | 'url' | null>(null)

	async function copyText(kind: 'id' | 'url', value: string) {
		try {
			await navigator.clipboard.writeText(value)
			setCopied(kind)
			window.setTimeout(() => setCopied(null), 1600)
		} catch {
			window.alert('복사에 실패했습니다. 직접 선택해 복사해 주세요.')
		}
	}

	function resolveUrl() {
		if (typeof window === 'undefined') {
			return path
		}
		return `${window.location.origin}${path}`
	}

	return (
		<div className="border-grayscale-200 bg-grayscale-50 flex flex-col gap-3 rounded-xl border p-4">
			<div>
				<p className="text-grayscale-900 text-sm font-semibold">공유 ID</p>
				<p className="text-grayscale-500 text-xs">카톡 채널에 ID 또는 URL을 붙여 넣으면 됩니다.</p>
			</div>

			<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
				<Input readOnly value={shortId} className="font-mono tracking-wider uppercase" aria-label="게시글 ID" />
				<Button type="button" variant="outline" className="shrink-0" onClick={() => void copyText('id', shortId)}>
					{copied === 'id' ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
					{copied === 'id' ? '복사됨' : 'ID 복사'}
				</Button>
				<Button
					type="button"
					variant="secondary"
					className="shrink-0"
					onClick={() => void copyText('url', resolveUrl())}
				>
					{copied === 'url' ? <CheckIcon className="size-4" /> : <LinkIcon className="size-4" />}
					{copied === 'url' ? '복사됨' : 'URL 복사'}
				</Button>
			</div>
		</div>
	)
}

export default ConsultingShareBar
