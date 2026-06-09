/**
 * Navy hero - the landing payoff that sits underneath the cream preloader.
 *
 * Layout (filled out across chunks 7-9):
 *   Left column   pinned headline + sub-line
 *                 "We _decode_ decarbonisation for your organisation."
 *                 (decode in Times New Roman italic coral)
 *   Right column  three-beat infographic SVG that plays once on entry
 *                 (Decode -> Build -> Partner) and holds in its final
 *                 state. Not a loop.
 *
 * Background carries a navy-tuned blob field (3 navy shades + coral +
 * cream accents) at heavy blur, co-prime durations matching the
 * preloader's calm-atmosphere feel.
 *
 * Brief: docs/briefs/landing-page-brief.md
 */
export function LandingHero() {
  return (
    <div className="landing-hero-inner">
      {/* Background blob field - chunk 9 */}

      {/* Left column - pinned headline + sub-line - chunk 7 */}
      <div className="landing-hero-text">
        <h1 className="landing-hero-headline">
          We <em>decode</em> decarbonisation for your organisation.
        </h1>
        <p className="landing-hero-sub">
          We figure out the unknown, then build the tools for your people to
          act on it.
        </p>
      </div>

      {/* Right column - three-beat infographic SVG - chunk 8 */}
      <div className="landing-hero-visual" aria-hidden="true">
        {/* SVG with three labelled beats lands in chunk 8 */}
      </div>
    </div>
  )
}
