import { useEffect, useMemo } from 'react'
import { FloatingNav, WEBSITE_NAV_LINKS } from '../components/FloatingNav'
import { HomeScreen } from '../screens/HomeScreen'
import { ExpertiseScreen } from '../screens/ExpertiseScreen'
import { ApproachScreen } from '../screens/ApproachScreen'
import { ProductsScreen } from '../screens/ProductsScreen'
import { ClientsScreen } from '../screens/ClientsScreen'
import { useActiveScreen } from '../hooks/useActiveScreen'

/**
 * Website routing surface. Snap-paging has been removed per Chris's call
 * (May 2026 landing-page-brief) - the site now scrolls natively top-to-
 * bottom. The auto-transition out of the preloader handles the one
 * orchestrated scroll moment; everything else is the user's call.
 *
 * `useActiveScreen` keeps the nav pill in sync with whichever section
 * is on screen. The deep-link smooth-scroll is handled by the browser
 * via `behavior: smooth` so we don't need a custom rAF loop anymore.
 */
export function WebsitePage() {
  const screenIds = useMemo(() => WEBSITE_NAV_LINKS.map((l) => l.id), [])
  const activeId = useActiveScreen(screenIds)

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
      <FloatingNav
        activeId={activeId}
        onLinkClick={(link, e) => {
          // Native smooth-scroll via the anchor href - intercept just to
          // animate rather than the default instant jump.
          e.preventDefault()
          const el = document.getElementById(link.id)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          history.replaceState(null, '', `#${link.id}`)
        }}
      />
      <HomeScreen />
      <ExpertiseScreen />
      <ApproachScreen />
      <ProductsScreen />
      <ClientsScreen />
    </>
  )
}
