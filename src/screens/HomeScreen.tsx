import { LandingPreloader } from '../components/LandingPreloader'
import { LandingHero } from '../components/LandingHero'
import { ClientsStrip } from '../components/ClientsStrip'

/**
 * Landing/home screen.
 *
 * Composes the cream preloader (overlay), the navy hero (with
 * slot-machine word swap + blob field), and the cream client strip
 * pinned at the bottom of the landing viewport.
 *
 * Per Chris's revised layout (June 2026): the cream client carousel
 * lives at the bottom of THIS screen rather than as its own scroll
 * section. So when the user lands on the page they see hero + clients
 * within the same viewport-tall block, then scroll past it to the
 * next section.
 *
 * Layout: .landing-screen is a flex column - the LandingHero (its
 * .landing-hero-inner) grows to fill the available space (flex: 1)
 * while the ClientsStrip sits as a thin strip at the bottom.
 *
 * Brief: docs/briefs/nza-landing-page-brief-v2.md
 */
export function HomeScreen() {
  return (
    <section
      className="screen canvas-navy in-view landing-screen"
      id="home"
      data-screen-label="01 Home"
    >
      <LandingPreloader />
      <LandingHero />
      <ClientsStrip variant="landing" />
    </section>
  )
}
