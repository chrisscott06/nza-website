import { useEffect, useRef } from 'react'

/**
 * Auto-rotating client logo ribbon driven by translate3d. Doubles the
 * track in the DOM (caller is expected to render the list twice) and
 * loops by resetting position when half the track has scrolled past.
 *
 * Source: nza-website.html lines 2185-2228.
 *
 *  - Hover pauses (CSS or via `setPaused`).
 *  - Manual prev/next nudges position by one cell width.
 *  - Honors prefers-reduced-motion (no auto rotation, but manual still works).
 */
export function useClientCarousel({
  trackId = 'clientsTrack',
  viewportId = 'clientsViewport',
  prevId = 'clientsPrev',
  nextId = 'clientsNext',
  speed = 24, // px per second
  cellWidth = 240,
}: {
  trackId?: string
  viewportId?: string
  prevId?: string
  nextId?: string
  speed?: number
  cellWidth?: number
} = {}) {
  const posRef = useRef(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const track = document.getElementById(trackId) as HTMLElement | null
    const viewport = document.getElementById(viewportId) as HTMLElement | null
    const prev = document.getElementById(prevId)
    const next = document.getElementById(nextId)
    if (!track || !viewport) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function step(now: number, lastT: number) {
      if (cancelled) return
      const dt = (now - lastT) / 1000
      if (!pausedRef.current && !reduced) {
        posRef.current += speed * dt
        const half = track!.scrollWidth / 2
        if (half > 0 && posRef.current >= half) posRef.current -= half
        if (posRef.current < 0) posRef.current += half
        track!.style.transform = 'translate3d(' + -posRef.current + 'px, 0, 0)'
      }
      requestAnimationFrame((t) => step(t, now))
    }
    let cancelled = false
    requestAnimationFrame((t) => step(t, t))

    function nudge(delta: number) {
      const half = track!.scrollWidth / 2
      posRef.current += delta
      if (half > 0 && posRef.current >= half) posRef.current -= half
      if (posRef.current < 0) posRef.current += half
      track!.style.transform = 'translate3d(' + -posRef.current + 'px, 0, 0)'
    }

    function onPrev() {
      nudge(-cellWidth)
    }
    function onNext() {
      nudge(cellWidth)
    }
    function onEnter() {
      pausedRef.current = true
    }
    function onLeave() {
      pausedRef.current = false
    }

    prev?.addEventListener('click', onPrev)
    next?.addEventListener('click', onNext)
    viewport.addEventListener('mouseenter', onEnter)
    viewport.addEventListener('mouseleave', onLeave)

    return () => {
      cancelled = true
      prev?.removeEventListener('click', onPrev)
      next?.removeEventListener('click', onNext)
      viewport.removeEventListener('mouseenter', onEnter)
      viewport.removeEventListener('mouseleave', onLeave)
    }
  }, [trackId, viewportId, prevId, nextId, speed, cellWidth])
}
