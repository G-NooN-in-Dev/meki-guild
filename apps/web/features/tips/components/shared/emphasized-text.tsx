import { type ReactNode } from 'react'

type EmphasizedTextProps = {
	children: ReactNode
}

/** 규칙 요약 문구에서 수치·고유명사 등 강조할 텍스트. */
function EmphasizedText({ children }: EmphasizedTextProps) {
	return <span className="text-grayscale-900 font-medium">{children}</span>
}

export default EmphasizedText
