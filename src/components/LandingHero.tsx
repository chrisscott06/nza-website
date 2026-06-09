import { MaskReveal } from './MaskReveal'
import { SlotMachineWord } from './SlotMachineWord'

/**
 * Navy hero - the landing payoff that sits underneath the cream preloader.
 *
 * Layout per the June 2026 landing brief (v2):
 *
 *   Left column   pinned headline + sub-line (mission statement)
 *                 Headline carries the SlotMachineWord that rotates
 *                 through four words: decarbonisation, climate
 *                 complexity, energy markets, digital intelligence.
 *                 "decode" stays italic coral.
 *
 *   Right column  intentionally empty - the three-beat infographic
 *                 has been removed from the landing per the v2 brief
 *                 ("let the background blob field and the slot-
 *                 machine motion carry the visual interest"). The
 *                 ThreeBeatInfographic component is retained in the
 *                 repo for use on the Approach page later.
 *
 * Background carries a navy-tuned blob field weighted on the right
 * with a mask gradient fading to clean navy on the left, so the
 * headline column sits on solid ground while the right side carries
 * the atmospheric motion.
 *
 * All text wrapped in <MaskReveal> for the site-wide upward-mask
 * arrival motion, staggered by ~200ms so the headline lands first
 * then the sub-line follows.
 *
 * Brief: docs/briefs/nza-landing-page-brief-v2.md
 */
export function LandingHero() {
  return (
    <>
      {/* Background blob field - sits as a sibling of .landing-hero-inner
          so it fills the full .landing-screen edge-to-edge. Mask
          gradient fades it to transparent on the left. */}
      <div className="landing-blobs landing-blobs--hero" aria-hidden="true">
        <span className="landing-blob landing-blob--hero-navy-1" />
        <span className="landing-blob landing-blob--hero-navy-2" />
        <span className="landing-blob landing-blob--hero-navy-3" />
        <span className="landing-blob landing-blob--hero-coral" />
        <span className="landing-blob landing-blob--hero-cream" />
      </div>

      <div className="landing-hero-inner">
        <div className="landing-hero-text">
          <MaskReveal as="h1" className="landing-hero-headline" delay={120}>
            We <em>decode</em>{' '}
            <SlotMachineWord />{' '}
            for your organisation.
          </MaskReveal>
          {/* Sub-line - the mission statement. Hyphens not em-dashes
              per Chris's standing site convention (brief copy used
              em-dashes which I'm converting on the way in). The
              max-width on .landing-hero-sub lets the line break
              naturally after "buildings, energy and climate." */}
          <MaskReveal as="p" className="landing-hero-sub" delay={320}>
            We are specialists in buildings, energy and climate. We cut through
            the complexity of decarbonisation - and build the tools your people
            need to act on it.
          </MaskReveal>
        </div>

        {/* Right column intentionally empty per v2 brief - the blob
            field and the slot-machine word swap carry the visual
            interest. Removed: ThreeBeatInfographic (moves to the
            Approach page in a follow-on brief). */}
        <div className="landing-hero-visual" aria-hidden="true" />
      </div>
    </>
  )
}
