import { useEffect } from 'react'
import { HomeScreen } from '../screens/HomeScreen'
import { HowWeWorkSection } from '../screens/HowWeWorkSection'
import { ProductsScreen } from '../screens/ProductsScreen'
import { GetInTouchScreen } from '../screens/GetInTouchScreen'

/**
 * Website homepage flow. Reshaped per Chris (June 2026):
 *
 *   home    -> landing (preloader + navy "decode" hero with the cream
 *              client strip pinned at the bottom of the same viewport)
 *   products-> existing card row, redesign pending
 *   contact -> Get in touch closing CTA
 *
 * The cream client strip now lives INSIDE HomeScreen at the bottom of
 * the landing viewport rather than as its own scroll section, so
 * ClientsScreen is no longer in this flow.
 *
 * Expertise + Approach moved off the homepage flow into their own
 * routes (/expertise, /approach). FloatingNav intentionally disabled
 * - Chris is redesigning the global nav. Direct URLs still work for
 * the off-flow pages.
 *
 * Native scroll throughout; the only orchestrated motion is the
 * preloader -> hero auto-transition handled inside HomeScreen.
 */
export function WebsitePage() {
  // First-paint deep-link: jump to the URL hash once sections are mounted.
  useEffect(() => {
    const hash = window.location.hash
    if (!hash || hash.length < 2) return
    requestAnimationFrame(() => {
      const el = document.getElementById(hash.slice(1))
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  return (
    <>
      <HomeScreen />
      <HowWeWorkSection />
      <ProductsScreen />
      <GetInTouchScreen />
    </>
  )
}
