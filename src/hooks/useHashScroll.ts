import { useCallback, useEffect } from 'react'

const SCROLL_MS = 700
const ease = (t: number) => 1 - Math.pow(1 - t, 3) // easeOutCubic

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Smoothly scroll the page to the element with the given id. Uses the same
 * 700ms easeOutCubic curve as the prototype (nza-website.html lines 1734-1773).
 * Falls back to instant scroll under prefers-reduced-motion.
 */
export function smoothScrollToId(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  const startY = window.scrollY
  const endY = target.offsetTop
  const dist = endY - startY
  if (Math.abs(dist) < 2) return
  if (prefersReducedMotion()) {
    window.scrollTo(0, endY)
    return
  }
  const t0 = performance.now()
  function step(t: number) {
    const p = Math.min(1, (t - t0) / SCROLL_MS)
    window.scrollTo(0, startY + dist * ease(p))
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/**
 * Returns a click handler that intercepts hash-link clicks and routes them
 * through the smooth-scroll function above. Use it on individual <a> elements.
 */
export function useHashScrollHandler() {
  return useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    const href = event.currentTarget.getAttribute('href')
    if (!href || !href.startsWith('#')) return
    const id = href.slice(1)
    if (!document.getElementById(id)) return
    event.preventDefault()
    smoothScrollToId(id)
    history.replaceState(null, '', `#${id}`)
  }, [])
}

/**
 * On mount, if the URL has a hash, scroll the matching element into view.
 * Useful for deep-links (e.g. /#capabilities). Defers one rAF tick so layout
 * has settled.
 */
export function useInitialHashScroll() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash || hash.length < 2) return
    const id = hash.slice(1)
    requestAnimationFrame(() => {
      const target = document.getElementById(id)
      if (target) {
        if (prefersReducedMotion()) {
          window.scrollTo(0, target.offsetTop)
        } else {
          smoothScrollToId(id)
        }
      }
    })
  }, [])
}
