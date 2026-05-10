import { useEffect, useState } from 'react'

/**
 * Subscribe to a CSS media query. Returns the live boolean.
 *
 * Used to drive viewport-conditional rendering (the hamburger nav
 * vs the pill nav, the in-place Approach expand vs the mobile
 * modal). Uses matchMedia + change listener so the result updates
 * when the user resizes the window or rotates the device.
 *
 * Server-side / pre-paint: returns false until the first effect
 * runs (one render). React hydration is unaffected.
 *
 * Example:
 *   const isPhone = useMediaQuery('(max-width: 599px)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
      return false
    }
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return
    const mql = window.matchMedia(query)
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    // Sync the initial value (catches the case where the query value
    // was different at first render).
    setMatches(mql.matches)
    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [query])

  return matches
}
