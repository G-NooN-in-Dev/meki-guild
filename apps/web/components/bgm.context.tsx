'use client'

import {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
	useRef,
	useState,
	useSyncExternalStore
} from 'react'

import { BGM_DEFAULT_VOLUME, BGM_SRC, BGM_VOLUME_STORAGE_KEY } from '@/libs/bgm.constants'

/** BGM 컨트롤 클릭은 제스처 자동재생과 겹치지 않도록 이 속성을 둡니다. */
const BGM_CONTROLS_SELECTOR = '[data-bgm-controls]'

type BgmContextValue = {
	/** 현재 재생 중인지 */
	isPlaying: boolean
	/** 현재 볼륨 (0~1) */
	volume: number
	/** 재생/일시정지 토글 (사용자 제스처에서 호출) */
	toggle: () => Promise<void>
	/** 볼륨 설정 (0~1). localStorage에도 저장합니다. */
	setVolume(nextVolume: number): void
}

const BgmContext = createContext<BgmContextValue | null>(null)

/** 같은 탭에서 볼륨 변경 시 구독자에게 알리기 위한 리스너 */
const volumeListeners = new Set<() => void>()

function emitVolumeChange() {
	for (const listener of volumeListeners) {
		listener()
	}
}

function subscribeVolume(listener: () => void) {
	volumeListeners.add(listener)

	const onStorage = (event: StorageEvent) => {
		if (event.key === BGM_VOLUME_STORAGE_KEY || event.key === null) {
			listener()
		}
	}

	window.addEventListener('storage', onStorage)

	return () => {
		volumeListeners.delete(listener)
		window.removeEventListener('storage', onStorage)
	}
}

function clampVolume(value: number) {
	if (Number.isNaN(value)) return BGM_DEFAULT_VOLUME
	return Math.min(1, Math.max(0, value))
}

function readStoredVolume(): number {
	try {
		const raw = window.localStorage.getItem(BGM_VOLUME_STORAGE_KEY)
		if (raw == null) return BGM_DEFAULT_VOLUME
		return clampVolume(Number(raw))
	} catch {
		return BGM_DEFAULT_VOLUME
	}
}

function writeStoredVolume(volume: number) {
	try {
		window.localStorage.setItem(BGM_VOLUME_STORAGE_KEY, String(volume))
	} catch {
		// private mode 등에서 실패해도 세션 내 볼륨은 유지
	}
}

function getVolumeSnapshot() {
	return readStoredVolume()
}

function getServerVolumeSnapshot() {
	return BGM_DEFAULT_VOLUME
}

function isEventFromBgmControls(event: Event) {
	const target = event.target
	return target instanceof Element && Boolean(target.closest(BGM_CONTROLS_SELECTOR))
}

/**
 * 사이트 전역 BGM 상태를 공유합니다.
 * Audio 인스턴스는 Provider에 하나만 두고, 헤더·모바일 Sheet 버튼이 같은 상태를 씁니다.
 */
function BgmProvider({ children }: PropsWithChildren) {
	const audioRef = useRef<HTMLAudioElement | null>(null)
	/** 자동재생 실패 시 붙인 제스처 리스너를 toggle에서도 해제할 수 있게 보관 */
	const removeUnlockListenersRef = useRef<(() => void) | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const volume = useSyncExternalStore(subscribeVolume, getVolumeSnapshot, getServerVolumeSnapshot)

	useEffect(() => {
		const audio = new Audio(BGM_SRC)
		audio.loop = true
		audio.preload = 'auto'
		audio.volume = readStoredVolume()
		audioRef.current = audio

		const unlockEvents = ['pointerdown', 'keydown', 'touchstart'] as const

		function removeUnlockListeners() {
			for (const eventName of unlockEvents) {
				window.removeEventListener(eventName, tryPlayOnGesture)
			}
			removeUnlockListenersRef.current = null
		}

		function tryPlayOnGesture(event: Event) {
			// 재생 버튼과 동시에 play→pause 되는 레이스를 막습니다
			if (isEventFromBgmControls(event)) return
			if (!audio.paused) {
				removeUnlockListeners()
				return
			}

			void audio.play().catch(() => {
				// 제스처 후에도 실패하면 리스너는 유지해 다음 입력을 기다립니다
			})
		}

		function armGestureUnlock() {
			removeUnlockListenersRef.current = removeUnlockListeners
			for (const eventName of unlockEvents) {
				window.addEventListener(eventName, tryPlayOnGesture, { passive: true })
			}
		}

		const handlePlay = () => {
			setIsPlaying(true)
			removeUnlockListeners()
		}
		const handlePause = () => setIsPlaying(false)

		audio.addEventListener('play', handlePlay)
		audio.addEventListener('pause', handlePause)

		// 기본은 재생 — Chrome 등은 자동재생을 막을 수 있어, 실패 시 첫 제스처에서 이어서 켭니다
		void audio.play().catch(() => {
			armGestureUnlock()
		})

		return () => {
			removeUnlockListeners()
			audio.removeEventListener('play', handlePlay)
			audio.removeEventListener('pause', handlePause)
			audio.pause()
			audio.src = ''
			audioRef.current = null
		}
	}, [])

	// localStorage·슬라이더로 볼륨이 바뀌면 Audio 인스턴스에 반영
	useEffect(() => {
		const audio = audioRef.current
		if (audio) {
			audio.volume = volume
		}
	}, [volume])

	async function toggle() {
		const audio = audioRef.current
		if (!audio) return

		// 버튼 조작이 제스처 자동재생과 겹치지 않게 먼저 해제
		removeUnlockListenersRef.current?.()

		if (!audio.paused) {
			audio.pause()
			return
		}

		try {
			await audio.play()
		} catch {
			// 자동재생 정책·로드 실패 등은 UI를 유지한 채 무시
			setIsPlaying(false)
		}
	}

	function setVolume(nextVolume: number) {
		writeStoredVolume(clampVolume(nextVolume))
		emitVolumeChange()
	}

	return <BgmContext.Provider value={{ isPlaying, volume, toggle, setVolume }}>{children}</BgmContext.Provider>
}

function useBgm() {
	const context = useContext(BgmContext)

	if (!context) {
		throw new Error('useBgm은 BgmProvider 안에서만 사용할 수 있습니다.')
	}

	return context
}

export { BgmProvider, useBgm }
