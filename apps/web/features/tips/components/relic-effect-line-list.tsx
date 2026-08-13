/** %, 초, 중첩 등 단위가 붙은 수치를 본문에서 잘라 강조합니다. */
const EFFECT_NUMBER_PATTERN = /(\d+(?:\.\d+)?(?:%|초|중첩|명|개)?)/g

function emphasizeEffectNumbers(text: string) {
	return text.split(EFFECT_NUMBER_PATTERN).map((part, index) => {
		if (!part || !/^\d/.test(part)) {
			return part
		}

		return (
			<span key={`${part}-${index}`} className="text-grayscale-900 font-semibold tabular-nums">
				{part}
			</span>
		)
	})
}

type RelicEffectLineListProps = {
	lines: readonly string[]
	lineKeyPrefix: string
}

/** 장착·보유 효과 문장 목록. 수치가 없으면 대시만 보여줍니다. */
function RelicEffectLineList({ lines, lineKeyPrefix }: RelicEffectLineListProps) {
	if (!lines.length) {
		return <p className="text-grayscale-400 text-sm">—</p>
	}

	return (
		<ul className="text-grayscale-600 space-y-1 text-xs leading-snug break-keep sm:text-sm">
			{lines.map((line) => (
				<li key={`${lineKeyPrefix}-${line}`}>{emphasizeEffectNumbers(line)}</li>
			))}
		</ul>
	)
}

export default RelicEffectLineList
