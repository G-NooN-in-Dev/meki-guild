'use client'

import { createContext, type PropsWithChildren, useCallback, useContext, useMemo, useSyncExternalStore } from 'react'

import { NAME_REVEAL_PASSWORD, NAME_REVEAL_STORAGE_KEY } from '@/features/guild/lib/name-reveal.constants'

type NameRevealContextValue = {
	/** 비밀번호로 실명 공개가 풀렸는지 */
	isUnlocked: boolean
	/** 비밀번호가 맞으면 unlock 하고 true, 틀리면 false */
	unlock: (password: string) => boolean
	/** 다시 이름을 가립니다 */
	lock: () => void
}

const NameRevealContext = createContext<NameRevealContextValue | null>(null)

/** 같은 탭에서 unlock/lock 시 구독자에게 알리기 위한 리스너 */
const listeners = new Set<() => void>()

function emitChange() {
	for (const listener of listeners) {
		listener()
	}
}

function subscribe(listener: () => void) {
	listeners.add(listener)

	// 다른 탭에서 localStorage가 바뀌면 동기화
	const onStorage = (event: StorageEvent) => {
		if (event.key === NAME_REVEAL_STORAGE_KEY || event.key === null) {
			listener()
		}
	}

	window.addEventListener('storage', onStorage)

	return () => {
		listeners.delete(listener)
		window.removeEventListener('storage', onStorage)
	}
}

function readUnlockedFromStorage(): boolean {
	try {
		return window.localStorage.getItem(NAME_REVEAL_STORAGE_KEY) === '1'
	} catch {
		return false
	}
}

function writeUnlockedToStorage(unlocked: boolean) {
	try {
		if (unlocked) {
			window.localStorage.setItem(NAME_REVEAL_STORAGE_KEY, '1')
			return
		}

		window.localStorage.removeItem(NAME_REVEAL_STORAGE_KEY)
	} catch {
		// private mode 등에서 실패해도 UI 상태는 유지
	}
}

/** 클라이언트 스냅샷 — localStorage 기준 */
function getClientSnapshot() {
	return readUnlockedFromStorage()
}

/** 서버/SSR은 항상 잠금 상태로 맞춤 (하이드레이션 일치) */
function getServerSnapshot() {
	return false
}

/**
 * 메인·1vs1 비교 등 전체 페이지에서 이름 공개 상태를 공유합니다.
 * 브라우저에 unlock 여부를 기억해, 다음 방문에도 유지됩니다.
 */
function NameRevealProvider({ children }: PropsWithChildren) {
	// effect + setState 대신 external store로 localStorage와 동기화
	const isUnlocked = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)

	const unlock = useCallback((password: string) => {
		if (password !== NAME_REVEAL_PASSWORD) {
			return false
		}

		writeUnlockedToStorage(true)
		emitChange()
		return true
	}, [])

	const lock = useCallback(() => {
		writeUnlockedToStorage(false)
		emitChange()
	}, [])

	const value = useMemo(
		() =>
			({
				isUnlocked,
				unlock,
				lock
			}) satisfies NameRevealContextValue,
		[isUnlocked, lock, unlock]
	)

	return <NameRevealContext.Provider value={value}>{children}</NameRevealContext.Provider>
}

function useNameReveal() {
	const context = useContext(NameRevealContext)

	if (!context) {
		throw new Error('useNameReveal는 NameRevealProvider 안에서만 사용할 수 있습니다.')
	}

	return context
}

export { NameRevealProvider, useNameReveal }
