import { useEffect, useMemo } from 'react'
import { FloatingNav, WEBSITE_NAV_LINKS } from '../components/FloatingNav'
import { HomeScreen } from '../screens/HomeScreen'
import { ExpertiseScreen } from '../screens/ExpertiseScreen'
import { ApproachScreen } from '../screens/ApproachScreen'
import { ProductsScreen } from '../screens/ProductsScreen'
import { ClientsScreen } from '../screens/ClientsScreen'
import { useActiveScreen } from '../hooks/useActiveScreen'
import { useSnapPaging } from '../hooks/useSnapPaging'

export function WebsitePage() {
  const screenIds = useMemo(() => WEBSITE_NAV_LINKS.map((l) => l.id), [])
  const activeId = useActiveScreen(screenIds)
  const { scrollToId, navClickHandler } = useSnapPaging(screenIds)

  // First-paint deep-link: if the URL has a hash, jump to that screen once
  // the screen elements are mounted. Defer one rAF tick so layout is settled.
  useEffect(() => {
    const hash = window.location.hash
    if (!hash || hash.length < 2) return
    requestAnimationFrame(() => scrollToId(hash.slice(1)))
  }, [scrollToId])

  return (
    <>
      <FloatingNav activeId={activeId} onLinkClick={(_link, e) => navClickHandler(e)} />
      <HomeScreen />
      <ExpertiseScreen />
      <ApproachScreen />
      <ProductsScreen />
      <ClientsScreen />
    </>
  )
}
