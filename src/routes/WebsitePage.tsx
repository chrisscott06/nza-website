import { useMemo } from 'react'
import { FloatingNav, WEBSITE_NAV_LINKS } from '../components/FloatingNav'
import { HomeScreen } from '../screens/HomeScreen'
import { ExpertiseScreen } from '../screens/ExpertiseScreen'
import { ApproachScreen } from '../screens/ApproachScreen'
import { ProductsScreen } from '../screens/ProductsScreen'
import { ClientsScreen } from '../screens/ClientsScreen'
import { useActiveScreen } from '../hooks/useActiveScreen'
import { useHashScrollHandler, useInitialHashScroll } from '../hooks/useHashScroll'

export function WebsitePage() {
  const screenIds = useMemo(() => WEBSITE_NAV_LINKS.map((l) => l.id), [])
  const activeId = useActiveScreen(screenIds)
  const handleHashClick = useHashScrollHandler()
  useInitialHashScroll()

  return (
    <>
      <FloatingNav activeId={activeId} onLinkClick={(_link, e) => handleHashClick(e)} />
      <HomeScreen />
      <ExpertiseScreen />
      <ApproachScreen />
      <ProductsScreen />
      <ClientsScreen />
    </>
  )
}
