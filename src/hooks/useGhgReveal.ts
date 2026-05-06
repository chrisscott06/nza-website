import { useEffect } from 'react'

/**
 * GHG Protocol illustration — 6-layer sequenced reveal.
 *
 * Each top-level <g id="_X_-_…"> in the SVG fades in with a staggered
 * start and a small translateY easing, building the diagram back-to-
 * front, then surfacing the value-chain frame text. Total runtime ~3.8s.
 *
 * Triggered when the Capabilities (Expertise) section enters the viewport;
 * plays once per page load. Source: nza-website.html lines 1572-1665.
 *
 * Mechanism:
 *   1. host (.diagram-ghg) is hidden synchronously, every layer is set to
 *      opacity 0. This must happen before first paint so the eye never
 *      sees the finished image.
 *   2. When the section enters viewport, host becomes visible and one
 *      requestAnimationFrame loop drives every layer's opacity + translate
 *      over time using cubic ease-out: 1 - (1-t)^3.
 */
const LAYERS: { id: string; translateY: number; delay: number; duration: number }[] = [
  { id: '_3_-_back', translateY: 160, delay: 250, duration: 2250 },
  { id: '_2_-_mid', translateY: 120, delay: 800, duration: 2100 },
  { id: '_1_-_front', translateY: 130, delay: 1200, duration: 2250 },
  { id: '_5_-_lines_and_clouds', translateY: 0, delay: 1700, duration: 2100 },
  { id: '_4_-_BVCM', translateY: 30, delay: 1850, duration: 1800 },
  { id: '_6_-_annotation', translateY: 0, delay: 3000, duration: 1800 },
  { id: '_6_-_text', translateY: 0, delay: 3000, duration: 1800 },
]

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useGhgReveal({
  triggerSectionId = 'capabilities',
  svgId = 'ghgArt',
  hostSelector = '.diagram-ghg',
  threshold = 0.25,
}: {
  triggerSectionId?: string
  svgId?: string
  hostSelector?: string
  threshold?: number
} = {}) {
  useEffect(() => {
    const svg = document.getElementById(svgId)
    if (!svg) return
    const host = svg.closest(hostSelector) as HTMLElement | null
    if (!host) return

    // Pre-state: host hidden, every animated layer at opacity 0. Set
    // before any paint so the eye never sees the finished image.
    host.style.visibility = 'hidden'
    LAYERS.forEach(({ id }) => {
      const el = svg.querySelector('#' + CSS.escape(id))
      if (el) el.setAttribute('opacity', '0')
    })

    // Reduced motion: skip the staged reveal — show the final state
    // immediately when the section comes into view.
    const reduced = prefersReducedMotion()

    function showFinal() {
      LAYERS.forEach(({ id }) => {
        const el = svg!.querySelector('#' + CSS.escape(id))
        if (el) {
          el.setAttribute('opacity', '1')
          el.removeAttribute('transform')
        }
      })
      host!.style.visibility = 'visible'
    }

    function runReveal() {
      // 1. Reset every layer to opacity 0 + clear any old transform.
      LAYERS.forEach(({ id }) => {
        const el = svg!.querySelector('#' + CSS.escape(id))
        if (!el) return
        el.setAttribute('opacity', '0')
        el.removeAttribute('transform')
      })
      // 2. CRITICAL — host becomes visible AFTER every layer is at opacity 0.
      //    Order reversed = one-frame flash of the finished SVG.
      host!.style.visibility = 'visible'

      // 3. One rAF timeline per layer. Each ticks against a shared
      //    startTime minus its own delay.
      const startTime = performance.now()
      LAYERS.forEach(({ id, translateY, delay, duration }) => {
        const el = svg!.querySelector('#' + CSS.escape(id))
        if (!el) return
        function tick(now: number) {
          const elapsed = now - startTime - delay
          if (elapsed < 0) {
            el!.setAttribute('opacity', '0')
            requestAnimationFrame(tick)
            return
          }
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          el!.setAttribute('opacity', String(eased))
          if (translateY) {
            const y = translateY * (1 - eased)
            el!.setAttribute('transform', 'translate(0,' + y + ')')
          }
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
    }

    const trigger = document.getElementById(triggerSectionId)
    if (!trigger) return

    let played = false
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !played) {
            played = true
            if (reduced) {
              showFinal()
            } else {
              // Defer one frame so initial paint settles before the
              // animation kicks off — avoids first-frame jank.
              requestAnimationFrame(() => requestAnimationFrame(runReveal))
            }
            obs.disconnect()
            break
          }
        }
      },
      { threshold },
    )
    obs.observe(trigger)

    return () => {
      obs.disconnect()
    }
  }, [triggerSectionId, svgId, hostSelector, threshold])
}
