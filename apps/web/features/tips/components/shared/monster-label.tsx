import { cn } from '@shared/ui/utils'
import Image from 'next/image'

import EmphasizedText from '@/features/tips/components/shared/emphasized-text'

/**
 * 스프라이트 표시 크기.
 * - inline: 규칙 문장 안 (기본)
 * - table: 표 셀 옆 작은 아이콘
 * - card: 패턴/요약 카드 헤더
 * - header: 팁 페이지 히어로 옆
 * - panel: 보스 선택·잠금 안내 등 패널
 */
type MonsterLabelSize = 'inline' | 'table' | 'card' | 'header' | 'panel'

type MonsterLabelProps = {
	/** public 경로 (예: /monsters/mush-mom.webp) */
	src: string
	/**
	 * 몬스터 이름.
	 * 있으면 EmphasizedText로 붙이고, 없으면 스프라이트만 그립니다.
	 */
	name?: string
	/**
	 * 원본 픽셀 크기.
	 * 화면에서는 높이를 맞추고, 가로는 원본 비율을 유지합니다.
	 */
	width: number
	height: number
	/** 애니메이션 GIF처럼 이미지 최적화가 스프라이트를 깨뜨릴 때 */
	unoptimized?: boolean
	/** 스프라이트 크기 preset. 기본은 문장 인라인 */
	size?: MonsterLabelSize
	/** size 위에 덮어쓸 이미지 className */
	imageClassName?: string
	/** 래퍼 span className. name이 없고 className도 없으면 Image만 반환합니다. */
	className?: string
	/**
	 * name이 없을 때 접근성용 alt.
	 * name이 있으면 이름 텍스트가 있으므로 이미지는 장식(alt="")으로 둡니다.
	 */
	alt?: string
}

const IMAGE_SIZE_CLASS_NAME = {
	inline: 'my-[calc((1lh-1.75rem)/2)] h-7 w-auto shrink-0 self-center',
	table: 'h-6 w-auto shrink-0 object-contain mix-blend-darken md:h-7',
	card: 'h-14 w-auto shrink-0 object-contain mix-blend-darken md:h-16',
	header: 'xs:h-20 h-16 w-auto shrink-0 object-contain mix-blend-darken md:h-28',
	panel:
		'h-auto max-h-16 w-auto max-w-24 min-w-6 shrink rounded-lg object-contain md:max-h-24 md:max-w-40 md:min-w-0 md:shrink-0'
} as const satisfies Record<MonsterLabelSize, string>

/**
 * 몬스터 스프라이트(+선택적 이름) 라벨.
 * 규칙 문장·페이지 헤더·카드·표 셀에서 같은 API로 재사용합니다.
 * 이름이 있을 때 스프라이트는 줄 높이보다 큽니다. 위아래 여백을 줄여 이름·주변 문장·글머리 기호가
 * 이미지가 없는 줄과 같은 기준선에 오게 합니다.
 */
function MonsterLabel({
	src,
	name,
	width,
	height,
	unoptimized = false,
	size = 'inline',
	imageClassName,
	className,
	alt = ''
}: MonsterLabelProps) {
	const image = (
		<Image
			src={src}
			alt={name ? '' : alt}
			width={width}
			height={height}
			unoptimized={unoptimized}
			draggable={false}
			loading="lazy"
			decoding="async"
			className={cn(IMAGE_SIZE_CLASS_NAME[size], imageClassName)}
		/>
	)

	if (!name) {
		if (!className) {
			return image
		}

		return <span className={className}>{image}</span>
	}

	return (
		<span className={cn('inline-flex items-baseline gap-1', className)}>
			{image}
			<EmphasizedText>{name}</EmphasizedText>
		</span>
	)
}

export default MonsterLabel
export type { MonsterLabelProps, MonsterLabelSize }
