import { useEffect } from 'react'
import { HomeScreen } from '../screens/HomeScreen'
import { ProductsScreen } from '../screens/ProductsScreen'
import { ClientsScreen } from '../screens/ClientsScreen'
import { GetInTouchScreen } from '../screens/GetInTouchScreen'

/**
 * Website homepage flow. Reshaped per Chris (May 2026):
 *
 *   home    -> landing (preloader + navy "decode" hero with blob field)
 *   clients -> cream horizontal logo slider (fast, just logos, no copy)
 *   products-> existing card row, will redesign in a follow-up
 *   contact -> Get in touch closing CTA
 *
 * Expertise + Approach moved off the homepage flow into their own
 * routes (/expertise, /approach) - the screens render unchanged there,
 * just no longer part of the main scroll.
 *
 * FloatingNav intentionally disabled - Chris is redesigning the global
 * nav. Direct URLs still work for /expertise, /approach, /pablo,
 * /nz-ai during this transition.
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
      <ClientsScreen />
      <ProductsScreen />
      <GetInTouchScreen />
    </>
  )
}
