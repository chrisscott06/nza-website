import { useEffect } from 'react'
import { ExpertiseScreen } from '../screens/ExpertiseScreen'

/**
 * Standalone Expertise page at /expertise.
 *
 * Moved off the homepage flow per Chris's call (May 2026) - landing
 * now reads landing -> clients -> products -> get in touch, with
 * Expertise + Approach living on their own routes pending a fresh
 * design pass.
 *
 * The existing ExpertiseScreen renders unchanged - all the zone
 * reveal interactions, GHG diagram, panels and mobile cards keep
 * working. Just no longer part of the main scroll flow.
 *
 * Nav is intentionally absent for now (Chris is redesigning the nav).
 * Users reach this page via direct URL until that work lands.
 */
export function ExpertisePage() {
  useEffect(() => {
    document.body.classList.add('expertise-page')
    return () => document.body.classList.remove('expertise-page')
  }, [])

  return (
    <main>
      <ExpertiseScreen />
    </main>
  )
}
