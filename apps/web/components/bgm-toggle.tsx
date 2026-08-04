'use client'

import { Button } from '@shared/ui/button'
import { cn } from '@shared/ui/lib/utils'
import { Slider } from '@shared/ui/slider'
import { PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from 'lucide-react'

import { useBgm } from '@/components/bgm.context'

type BgmToggleProps = {
	/** header: 헤더 컴팩트 / sheet: 모바일 Sheet 하단 */
	variant?: 'header' | 'sheet'
	className?: string
}

/** 재생 중 막대 높이 애니메이션 (서로 다른 delay) */
const EQUALIZER_BARS = [
	{ delayMs: 0, idleHeight: '40%' },
	{ delayMs: 150, idleHeight: '70%' },
	{ delayMs: 75, idleHeight: '50%' },
	{ delayMs: 220, idleHeight: '85%' }
] as const

/**
 * 재생 중일 때 옆에 보이는 파동(이퀄라이저) 표시.
 * 정지 중에는 자리를 유지하되 흐리게 둡니다.
 */
function BgmEqualizer({ active, className }: { active: boolean; className?: string }) {
	return (
		<span
			className={cn(
				'text-grayscale-500 flex h-4 w-3.5 shrink-0 items-end justify-between gap-px',
				!active && 'opacity-35',
				className
			)}
			aria-hidden
		>
			{EQUALIZER_BARS.map((bar, index) => (
				<span
					key={index}
					className={cn('w-0.5 origin-bottom rounded-full bg-current', active && 'animate-bgm-bar')}
					style={{
						height: active ? '100%' : bar.idleHeight,
						animationDelay: active ? `${bar.delayMs}ms` : undefined
					}}
				/>
			))}
		</span>
	)
}

type VolumeSliderProps = {
	volume: number
	onVolumeChange(nextVolume: number): void
	className?: string
}

/** 0~1 볼륨을 0~100 슬라이더로 제어 */
function VolumeSlider({ volume, onVolumeChange, className }: VolumeSliderProps) {
	const percent = Math.round(volume * 100)
	const VolumeIcon = percent === 0 ? VolumeXIcon : Volume2Icon

	return (
		<div className={cn('flex min-w-0 flex-1 items-center gap-2', className)}>
			<VolumeIcon className="text-grayscale-500 size-4 shrink-0" aria-hidden />
			<Slider
				min={0}
				max={100}
				step={1}
				value={[percent]}
				aria-label="BGM 볼륨"
				className="min-w-0 flex-1"
				onValueChange={(nextValue) => {
					const raw = Array.isArray(nextValue) ? nextValue[0] : nextValue
					if (typeof raw !== 'number') return
					onVolumeChange(raw / 100)
				}}
			/>
		</div>
	)
}

/**
 * BGM 재생/정지 + 파동 + 볼륨.
 * 데스크탑은 헤더, 모바일은 Sheet 하단에 배치합니다.
 */
function BgmToggle({ variant = 'header', className }: BgmToggleProps) {
	const { isPlaying, volume, toggle, setVolume } = useBgm()
	const label = isPlaying ? 'BGM 일시정지' : 'BGM 재생'
	const Icon = isPlaying ? PauseIcon : PlayIcon

	return (
		<div
			className={cn(
				'flex items-center',
				variant === 'sheet' ? 'w-full flex-col items-stretch gap-2.5' : 'gap-1',
				className
			)}
		>
			<div className={cn('flex items-center gap-1', variant === 'sheet' && 'justify-center')}>
				<BgmEqualizer active={isPlaying} />
				<Button
					type="button"
					variant="ghost"
					size="icon-sm"
					className="text-grayscale-500 hover:text-grayscale-900"
					aria-pressed={isPlaying}
					aria-label={label}
					onClick={() => {
						void toggle()
					}}
				>
					<Icon className="size-4" />
				</Button>
				{variant === 'header' ? (
					<VolumeSlider volume={volume} onVolumeChange={setVolume} className="w-20 flex-none md:w-24" />
				) : null}
			</div>

			{variant === 'sheet' ? <VolumeSlider volume={volume} onVolumeChange={setVolume} /> : null}
		</div>
	)
}

export default BgmToggle
