import { LandingPreloader } from '../components/LandingPreloader'
import { LandingHero } from '../components/LandingHero'

/**
 * Landing/home screen.
 *
 * Replaces the previous single-section "We decode decarbonisation for the
 * built environment" hero with a two-stage opening sequence per the
 * landing-page-brief (May 2026):
 *
 *   1. Cream preloader (LandingPreloader) - mark fills with navy, percentage
 *      counter, typewriter wordmark reveal, ~4s auto-transition or manual
 *      scroll
 *   2. Navy hero (LandingHero) - pinned headline + three-beat infographic
 *      (Decode -> Build -> Partner)
 *
 * The preloader is a fixed-position overlay that slides up when dismissed;
 * the navy hero is the underlying `.screen` so it's already there waiting
 * when the preloader clears.
 *
 * Brief: docs/briefs/landing-page-brief.md
 */
export function HomeScreen() {
  return (
    <section className="screen canvas-navy in-view landing-screen" id="home" data-screen-label="01 Home">
      <LandingPreloader />
      <LandingHero />
    </section>
  )
}
