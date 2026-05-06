import { useEffect, useState } from 'react'

/**
 * Track which screen section is currently most-visible in the viewport.
 *
 * Mirrors the prototype's behaviour (see source nza-website.html lines 1697-1726):
 * pick the screen with the highest intersectionRatio, fall back to whichever
 * top is closest to the scroll position on a tie. This stops the active-nav
 * sticking on whichever section crossed the threshold last during load.
 *
 * Side effect: toggles `document.body.classList` to reflect the active
 * screen's canvas (`on-navy` when the active screen has `canvas-navy`).
 * The bespoke nav CSS uses that class to invert its colours.
 */
export function useActiveScreen(screenIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(screenIds[0] ?? null)

  useEffect(() => {
    if (screenIds.length === 0) return

    const elements = screenIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const ratios = new Map<HTMLElement, number>()

    function pickActive(): HTMLElement | null {
      let bestEl: HTMLElement | null = null
      let bestR = 0
      ratios.forEach((r, el) => {
        if (r > bestR + 0.01) {
          bestR = r
          bestEl = el
        } else if (Math.abs(r - bestR) <= 0.01 && bestEl) {
          const elTop = Math.abs(el.getBoundingClientRect().top)
          const bestTop = Math.abs(bestEl.getBoundingClientRect().top)
          if (elTop < bestTop) {
            bestEl = el
            bestR = r
          }
        }
      })
      return bestEl
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target as HTMLElement, entry.intersectionRatio)
        })
        const best = pickActive()
        if (best) {
          setActiveId(best.id)
          document.body.classList.toggle('on-navy', best.classList.contains('canvas-navy'))
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    )

    elements.forEach((el) => io.observe(el))

    // Seed the active state from initial layout — useful when the user lands
    // mid-page via a hash link.
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      const visible = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0))
      ratios.set(el, visible / Math.max(rect.height, 1))
    })
    const initial = pickActive()
    if (initial) {
      setActiveId(initial.id)
      document.body.classList.toggle('on-navy', initial.classList.contains('canvas-navy'))
    }

    return () => {
      io.disconnect()
      document.body.classList.remove('on-navy')
    }
  }, [screenIds])

  return activeId
}
