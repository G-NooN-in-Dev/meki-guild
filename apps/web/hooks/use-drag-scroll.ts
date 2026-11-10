'use client'

import { type MouseEvent, type RefObject, useEffect, useRef } from 'react'

/** 이 거리(px) 이상 움직이면 드래그로 보고, pointerup 뒤 click을 막습니다. */
const DRAG_THRESHOLD_PX = 5

type UseDragScrollResult<T extends HTMLElement> = {
	ref: RefObject<T | null>
	/** 드래그 뒤 click이 버튼·팝오버로 전달되지 않게 캡처 단계에서 막습니다. */
	onClickCapture: (event: MouseEvent) => void
}

/**
 * overflow 가로 영역을 마우스(·펜) 드래그로 스크롤합니다.
 * pointerdown 직후엔 캡처하지 않아 클릭이 자식 버튼으로 전달되고,
 * 임계값 이상 움직인 뒤에만 드래그·click 억제를 켭니다. 터치는 네이티브 스크롤에 맡깁니다.
 */
function useDragScroll<T extends HTMLElement = HTMLDivElement>(): UseDragScrollResult<T> {
	const ref = useRef<T | null>(null)
	const dragRef = useRef({
		tracking: false,
		dragging: false,
		suppressClick: false,
		startX: 0,
		scrollLeft: 0,
		pointerId: -1
	})

	useEffect(() => {
		const el = ref.current
		if (!el) return

		const onPointerDown = (event: PointerEvent) => {
			// 터치는 overflow 네이티브 스크롤 유지. 주 버튼만.
			if (event.pointerType === 'touch' || event.button !== 0) return

			dragRef.current = {
				tracking: true,
				dragging: false,
				suppressClick: false,
				startX: event.clientX,
				scrollLeft: el.scrollLeft,
				pointerId: event.pointerId
			}
		}

		const onPointerMove = (event: PointerEvent) => {
			const drag = dragRef.current
			if (!drag.tracking || event.pointerId !== drag.pointerId) return

			const deltaX = event.clientX - drag.startX

			// 임계값 전에는 손대지 않음 — 클릭·포커스가 버튼에 정상 전달되게
			if (!drag.dragging) {
				if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) return
				drag.dragging = true
				drag.suppressClick = true
				el.setPointerCapture(event.pointerId)
				el.classList.add('cursor-grabbing')
			}

			el.scrollLeft = drag.scrollLeft - deltaX
		}

		const endDrag = (event: PointerEvent) => {
			const drag = dragRef.current
			if (!drag.tracking || event.pointerId !== drag.pointerId) return

			drag.tracking = false
			drag.dragging = false
			el.classList.remove('cursor-grabbing')
			if (el.hasPointerCapture(event.pointerId)) {
				el.releasePointerCapture(event.pointerId)
			}
		}

		el.addEventListener('pointerdown', onPointerDown)
		el.addEventListener('pointermove', onPointerMove)
		el.addEventListener('pointerup', endDrag)
		el.addEventListener('pointercancel', endDrag)

		return () => {
			el.removeEventListener('pointerdown', onPointerDown)
			el.removeEventListener('pointermove', onPointerMove)
			el.removeEventListener('pointerup', endDrag)
			el.removeEventListener('pointercancel', endDrag)
		}
	}, [])

	const onClickCapture = (event: MouseEvent) => {
		if (!dragRef.current.suppressClick) return
		event.preventDefault()
		event.stopPropagation()
		dragRef.current.suppressClick = false
	}

	return { ref, onClickCapture }
}

export default useDragScroll
