import Image from 'next/image'

import EmphasizedText from '@/features/tips/components/shared/emphasized-text'

type MonsterNameLabelProps = {
	/** public 경로 (예: /monsters/mush-mom.webp) */
	src: string
	name: string
	/**
	 * 원본 픽셀 크기.
	 * 화면에서는 높이를 맞추고, 가로는 원본 비율을 유지합니다.
	 */
	width: number
	height: number
	/** 애니메이션 GIF처럼 이미지 최적화가 스프라이트를 깨뜨릴 때 */
	unoptimized?: boolean
}

/**
 * 규칙 문장 안에서 몬스터 이름 앞에 스프라이트를 붙입니다.
 * 이름이 바로 옆에 있으므로 이미지는 장식(alt 없음)으로 둡니다.
 * 스프라이트는 줄 높이보다 큽니다. 위아래 여백을 줄여 이름·주변 문장·글머리 기호가
 * 이미지가 없는 줄과 같은 기준선에 오게 합니다.
 */
function MonsterNameLabel({ src, name, width, height, unoptimized = false }: MonsterNameLabelProps) {
	return (
		<span className="inline-flex items-baseline gap-1">
			<Image
				src={src}
				alt=""
				width={width}
				height={height}
				unoptimized={unoptimized}
				draggable={false}
				className="my-[calc((1lh-1.75rem)/2)] h-7 w-auto shrink-0 self-center"
			/>
			<EmphasizedText>{name}</EmphasizedText>
		</span>
	)
}

export default MonsterNameLabel
export type { MonsterNameLabelProps }
