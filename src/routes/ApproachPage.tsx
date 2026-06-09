import { ApproachScreen } from '../screens/ApproachScreen'
import { useContextClass } from '../hooks/useContextClass'

/**
 * Standalone Approach page at /approach.
 *
 * Moved off the homepage flow per Chris's call (May 2026) - landing
 * now reads landing -> clients -> products -> get in touch, with
 * Expertise + Approach living on their own routes pending a fresh
 * design pass.
 *
 * The existing ApproachScreen renders unchanged - 3x2 capability
 * grid, expanded panel on desktop, MobileApproachModal on phone, all
 * keep working. Just no longer part of the main scroll flow.
 *
 * Nav is intentionally absent for now (Chris is redesigning the nav).
 * Users reach this page via direct URL until that work lands.
 */
export function ApproachPage() {
  useContextClass(['approach-page', 'context-cream'])

  return (
    <main>
      <ApproachScreen />
    </main>
  )
}
