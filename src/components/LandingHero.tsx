import { ThreeBeatInfographic } from './ThreeBeatInfographic'
import { MaskReveal } from './MaskReveal'

/**
 * Navy hero - the landing payoff that sits underneath the cream preloader.
 *
 *   Left column   pinned headline + sub-line
 *                 "We _decode_ decarbonisation for your organisation."
 *                 (decode in Times New Roman italic coral)
 *   Right column  three-beat infographic SVG that plays once on entry
 *                 (Decode -> Build -> Partner) and holds in its final
 *                 state. Not a loop.
 *
 * Background carries a navy-tuned blob field (3 navy shades + coral +
 * cream accents) at heavy blur, co-prime durations matching the
 * preloader's calm-atmosphere feel. Mask gradient fades the field to
 * transparent on the left so the headline column reads on clean navy.
 *
 * Brief: docs/briefs/landing-page-brief.md
 */
export function LandingHero() {
  return (
    <>
      {/* Background blob field - navy-tuned (3 navy shades + coral
          + cream accents) at heavy blur with co-prime durations.
          Sits as a sibling of .landing-hero-inner so it fills the
          full .landing-screen (the inner is max-width 1280 - bounded
          - which previously cropped the motion). A mask gradient
          fades the field to transparent on the left so the blob
          motion lives on the right while the headline column reads
          on a clean navy ground. */}
      <div className="landing-blobs landing-blobs--hero" aria-hidden="true">
        <span className="landing-blob landing-blob--hero-navy-1" />
        <span className="landing-blob landing-blob--hero-navy-2" />
        <span className="landing-blob landing-blob--hero-navy-3" />
        <span className="landing-blob landing-blob--hero-coral" />
        <span className="landing-blob landing-blob--hero-cream" />
      </div>

      <div className="landing-hero-inner">
      {/* Left column - pinned headline + sub-line. Each text element
          wrapped in <MaskReveal> for the site-wide upward-mask
          arrival motion. Staggered delays so the headline lands
          first, then the sub-line follows. */}
      <div className="landing-hero-text">
        <MaskReveal as="h1" className="landing-hero-headline" delay={120}>
          We <em>decode</em> decarbonisation for your organisation.
        </MaskReveal>
        <MaskReveal as="p" className="landing-hero-sub" delay={320}>
          We figure out the unknown, then build the tools for your people to
          act on it.
        </MaskReveal>
      </div>

      {/* Right column - three-beat infographic. Plays once when the
          hero enters the viewport (IntersectionObserver-triggered)
          and holds in its final state. */}
      <div className="landing-hero-visual">
        <ThreeBeatInfographic />
      </div>
      </div>
    </>
  )
}
