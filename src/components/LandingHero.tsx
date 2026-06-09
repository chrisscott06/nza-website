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
          {/* Three-line centred headline. Each line is its own
              MaskReveal so they rise into view one after another
              ("the text appears a bit more slowly, maybe one line
              at a time" per Chris). The SlotMachineWord lives on
              its OWN line so the box's stretch/squash never nudges
              "We decode" or "for your organisation." - all three
              lines are independently centred to the page. */}
          <h1 className="landing-hero-headline">
            <MaskReveal as="span" className="landing-hero-headline-line" delay={200}>
              We <em>decode</em>
            </MaskReveal>
            <MaskReveal as="span" className="landing-hero-headline-line" delay={700}>
              <SlotMachineWord />
            </MaskReveal>
            <MaskReveal as="span" className="landing-hero-headline-line" delay={1200}>
              for your organisation.
            </MaskReveal>
          </h1>
          {/* Sub-line - fades in after the headline lines have
              landed. Hyphens not em-dashes per site convention. */}
          <MaskReveal as="p" className="landing-hero-sub" delay={1700}>
            We are specialists in buildings, energy and climate. We cut through
            the complexity of decarbonisation - and build the tools your people
            need to act on it.
          </MaskReveal>
        </div>
      </div>
    </>
  )
}
