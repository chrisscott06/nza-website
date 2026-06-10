/**
 * The three SVG visualisations inside the "How we work" cards.
 * Spec lifted verbatim from docs/briefs/nza-landing-page-v2-brief.md
 * (Change 2 - "The three SVG visualisations").
 *
 *   State 1 - Decode   pulsing blurred dot field, 5x5 grid
 *   State 2 - Build    16 perimeter dots + connecting square frame
 *                      + 9 outlined inner dots
 *   State 3 - Partner  two overlapping cream squares with a coral
 *                      overlap region
 *
 * All three SVGs use viewBox 0 0 200 200. Colours per brief:
 *   #EDE5D8 cream for dots, lines, frames
 *   #F75A55 coral for accent
 */

/* 5x5 grid dot coordinates - shared between Decode + Build. */
const GRID_X = [25, 62.5, 100, 137.5, 175]
const GRID_Y = [25, 62.5, 100, 137.5, 175]

/* Decode pulse variants distributed across the 25 dots.
   Pre-shuffled so the field reads as "random" without obvious
   stripes - same dot index always gets the same variant in a
   given session (deterministic by index, no random per render). */
const PULSE_VARIANTS = [0, 3, 1, 4, 2, 2, 4, 0, 3, 1, 1, 0, 4, 2, 3, 3, 2, 1, 0, 4, 4, 1, 3, 2, 0]

/* ============================================================
   State 1 - DECODE
   25 cream dots in a 5x5 grid, each blurred + opacity-pulsing
   at one of 5 staggered durations so the field has no obvious
   rhythm.
   ============================================================ */
export function DecodeVisual() {
  const dots: Array<{ cx: number; cy: number; variant: number }> = []
  let i = 0
  for (const cy of GRID_Y) {
    for (const cx of GRID_X) {
      dots.push({ cx, cy, variant: PULSE_VARIANTS[i % PULSE_VARIANTS.length] })
      i++
    }
  }
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {dots.map((d, idx) => (
        <circle
          key={idx}
          cx={d.cx}
          cy={d.cy}
          r="7"
          fill="#EDE5D8"
          className={'pulse-dot pulse-dot-' + d.variant}
        />
      ))}
    </svg>
  )
}

/* ============================================================
   State 2 - BUILD
   Outer 16 dots filled + connected by a square frame; inner 9
   dots outlined. Static, no animation - "the stable, structured
   state."
   ============================================================ */
export function BuildVisual() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Perimeter frame connecting the four corner dots */}
      <line x1="25" y1="25" x2="175" y2="25" stroke="#EDE5D8" strokeWidth="1.5" />
      <line x1="175" y1="25" x2="175" y2="175" stroke="#EDE5D8" strokeWidth="1.5" />
      <line x1="175" y1="175" x2="25" y2="175" stroke="#EDE5D8" strokeWidth="1.5" />
      <line x1="25" y1="175" x2="25" y2="25" stroke="#EDE5D8" strokeWidth="1.5" />

      {/* All 25 dots - outer 16 filled, inner 9 outlined */}
      {GRID_Y.map((cy, yi) =>
        GRID_X.map((cx, xi) => {
          const isPerimeter = yi === 0 || yi === 4 || xi === 0 || xi === 4
          if (isPerimeter) {
            return (
              <circle
                key={`${xi}-${yi}`}
                cx={cx}
                cy={cy}
                r="7"
                fill="#EDE5D8"
              />
            )
          }
          return (
            <circle
              key={`${xi}-${yi}`}
              cx={cx}
              cy={cy}
              r="7"
              fill="none"
              stroke="#EDE5D8"
              strokeWidth="1.5"
            />
          )
        }),
      )}
    </svg>
  )
}

/* ============================================================
   State 3 - PARTNER
   Two overlapping cream-stroked squares with a coral-tinted
   overlap region. No animation - "where the two organisations
   meet and the active work happens."
   ============================================================ */
export function PartnerVisual() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Bottom-right square first so the top-left renders ON TOP
          at the overlap edge - reads as "the existing org meets a
          partner being placed on top." Either order works
          aesthetically; this gets the top-left corner crisp. */}
      <rect
        x="65"
        y="65"
        width="115"
        height="115"
        fill="none"
        stroke="#EDE5D8"
        strokeWidth="2"
      />
      <rect
        x="20"
        y="20"
        width="115"
        height="115"
        fill="none"
        stroke="#EDE5D8"
        strokeWidth="2"
      />
      {/* Coral overlap - the active relationship marker */}
      <rect
        x="65"
        y="65"
        width="70"
        height="70"
        fill="rgba(247, 90, 85, 0.3)"
        stroke="#F75A55"
        strokeWidth="1.5"
      />
    </svg>
  )
}
