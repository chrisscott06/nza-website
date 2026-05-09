import { useCallback, useEffect, useRef } from 'react'

const SCROLL_MS = 700
const WHEEL_DEBOUNCE_MS = 750
const COMPACT_BREAKPOINT = 720

const ease = (t: number) => 1 - Math.pow(1 - t, 3) // easeOutCubic

function isCompactViewport() {
  return window.innerWidth <= COMPACT_BREAKPOINT
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Page-flip snap navigation. One viewport-tall scroll per wheel tick / arrow
 * key, with a 700ms eased animation. Mirrors the prototype's behaviour
 * (nza-website.html lines 1734-1828).
 *
 * Returns a `scrollToId` function for programmatic navigation and a
 * `navClickHandler` ready to drop onto `<a href="#…">` elements. Both share
 * an internal `animating` flag so concurrent inputs don't fight.
 *
 * Disabled on:
 *   · viewports ≤ 720px (mobile uses native scroll)
 *   · `prefers-reduced-motion: reduce` (instant scroll, no wheel hijack)
 *   · screens with class `screen-scrolls` whose content overflows the
 *     viewport (e.g. Approach with the inset panel open) - the wheel is
 *     allowed to flow naturally inside the screen until it hits a boundary.
 */
export function useSnapPaging(screenIds: string[]) {
  const animatingRef = useRef(false)
  const lastWheelRef = useRef(0)
  const screensRef = useRef<HTMLElement[]>([])
  const reducedMotionRef = useRef(false)

  // Refresh the screen-element refs whenever the id list changes or the DOM
  // settles. Cheap to recompute.
  useEffect(() => {
    screensRef.current = screenIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
  }, [screenIds])

  const scrollToIndex = useCallback((i: number) => {
    const screens = screensRef.current
    const target = screens[i]
    if (!target) return
    const startY = window.scrollY
    const endY = target.offsetTop
    const dist = endY - startY
    if (Math.abs(dist) < 2) return

    if (reducedMotionRef.current) {
      window.scrollTo(0, endY)
      return
    }

    animatingRef.current = true
    const t0 = performance.now()
    function step(t: number) {
      const p = Math.min(1, (t - t0) / SCROLL_MS)
      window.scrollTo(0, startY + dist * ease(p))
      if (p < 1) requestAnimationFrame(step)
      else animatingRef.current = false
    }
    requestAnimationFrame(step)
  }, [])

  const scrollToId = useCallback(
    (id: string) => {
      const idx = screenIds.indexOf(id)
      if (idx >= 0) scrollToIndex(idx)
    },
    [scrollToIndex, screenIds],
  )

  const navClickHandler = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const href = event.currentTarget.getAttribute('href')
      if (!href || !href.startsWith('#')) return
      const id = href.slice(1)
      if (screenIds.indexOf(id) < 0) return
      event.preventDefault()
      scrollToId(id)
      history.replaceState(null, '', `#${id}`)
    },
    [scrollToId, screenIds],
  )

  useEffect(() => {
    reducedMotionRef.current = prefersReducedMotion()

    function targetIndex() {
      const screens = screensRef.current
      const y = window.scrollY
      let nearest = 0
      let nearestD = Infinity
      screens.forEach((s, i) => {
        const d = Math.abs(s.offsetTop - y)
        if (d < nearestD) {
          nearestD = d
          nearest = i
        }
      })
      return nearest
    }

    function isExempt(i: number) {
      const screens = screensRef.current
      const s = screens[i]
      // Approach screen with its inset panel open carries .screen-scrolls
      // and grows beyond viewport; let the wheel scroll within it naturally
      // until we hit the top/bottom boundary.
      return s && s.classList.contains('screen-scrolls') && s.offsetHeight > window.innerHeight + 40
    }

    function onWheel(e: WheelEvent) {
      if (isCompactViewport()) return
      if (reducedMotionRef.current) return
      // Bail when a cap-card is expanded - let the user scroll inside the
      // panel naturally without triggering a page-flip.
      if (document.body.dataset.capOpen === 'true') return
      if (animatingRef.current) {
        e.preventDefault()
        return
      }
      const idx = targetIndex()
      if (isExempt(idx)) {
        const screens = screensRef.current
        const s = screens[idx]
        const top = s.offsetTop
        const bottom = top + s.offsetHeight - window.innerHeight
        const y = window.scrollY
        if ((e.deltaY > 0 && y < bottom - 4) || (e.deltaY < 0 && y > top + 4)) return
      }
      const now = performance.now()
      if (now - lastWheelRef.current < WHEEL_DEBOUNCE_MS) {
        e.preventDefault()
        return
      }
      e.preventDefault()
      lastWheelRef.current = now
      const dir = e.deltaY > 0 ? 1 : -1
      const screens = screensRef.current
      const next = Math.max(0, Math.min(screens.length - 1, idx + dir))
      if (next !== idx) scrollToIndex(next)
    }

    function onKey(e: KeyboardEvent) {
      if (isCompactViewport()) return
      if (reducedMotionRef.current) return
      if (document.body.dataset.capOpen === 'true') return
      const tag = (e.target as HTMLElement | null)?.tagName ?? ''
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return
      if ((e.target as HTMLElement | null)?.isContentEditable) return

      const screens = screensRef.current
      let next: number | null = null
      const idx = targetIndex()
      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          next = Math.min(screens.length - 1, idx + 1)
          break
        case 'ArrowUp':
        case 'PageUp':
          next = Math.max(0, idx - 1)
          break
        case 'Home':
          next = 0
          break
        case 'End':
          next = screens.length - 1
          break
      }
      if (next == null) return
      e.preventDefault()
      if (animatingRef.current) return
      if (next !== idx) scrollToIndex(next)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [scrollToIndex])

  return { scrollToId, navClickHandler }
}
