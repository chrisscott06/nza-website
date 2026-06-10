import type { CSSProperties } from 'react'

/**
 * The three SVG visualisations inside the "How we work" phase blocks.
 * Animations fire when the parent .how-we-work-page hits .is-revealed
 * AND each block's own --reveal-delay has elapsed - the visual sits
 * static until the block is mostly in view, then runs its sequence.
 *
 *   DECODE   25 dots fade in one by one in reading order, fast linear
 *            cascade. End state: full dot field, static.
 *   BUILD    all 25 dots appear as outlined circles. The perimeter 16
 *            then fill in. A single path traces a square clockwise
 *            around the perimeter dots, "drawing" the frame.
 *   PARTNER  two cream squares fly in from opposite corners, meet in
 *            the middle with a slight overshoot ("almost bouncing
 *            back from one another"), then settle. The coral overlap
 *            fades in once the squares are home.
 *
 * Trigger: the CSS keyframes live in landing.css and key off the
 * `.is-revealed` ancestor + the inline `--reveal-delay` set on each
 * .how-we-work-phase-block. Reduced-motion users see the final state
 * with no animation.
 */

/* 5x5 grid dot coordinates - shared between Decode + Build. */
const GRID_X = [25, 62.5, 100, 137.5, 175]
const GRID_Y = [25, 62.5, 100, 137.5, 175]

/* ============================================================
   DECODE - 25 cream dots fade in one by one. Linear cascade in
   reading order (top-left to bottom-right), 35ms per dot, 180ms
   fade per dot. Total field landed in ~1.05s.
   ============================================================ */
export function DecodeVisual() {
  const dots: Array<{ cx: number; cy: number }> = []
  for (const cy of GRID_Y) {
    for (const cx of GRID_X) {
      dots.push({ cx, cy })
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
          className="decode-dot"
          style={{ '--dot-index': idx } as CSSProperties}
        />
      ))}
    </svg>
  )
}

/* ============================================================
   BUILD - three-phase sequence:
     1. all 25 outlined circles fade in quickly (~300ms together)
     2. perimeter 16 fills appear over ~400ms
     3. clockwise square path draws around the perimeter dots
        (~1000ms via stroke-dashoffset)
   Total ~1.7s.
   ============================================================ */
export function BuildVisual() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* All 25 dots rendered as outlined circles - the "raw grid"
          start state. */}
      {GRID_Y.map((cy, yi) =>
        GRID_X.map((cx, xi) => (
          <circle
            key={`outline-${xi}-${yi}`}
            cx={cx}
            cy={cy}
            r="7"
            fill="none"
            stroke="#EDE5D8"
            strokeWidth="1.5"
            className="build-dot-outline"
          />
        )),
      )}

      {/* Perimeter 16 fills - cream filled circles overlaid on top of
          the outlined ones. opacity:0 at rest, animate to 1 once the
          outlines are in. */}
      {GRID_Y.map((cy, yi) =>
        GRID_X.map((cx, xi) => {
          const isPerimeter = yi === 0 || yi === 4 || xi === 0 || xi === 4
          if (!isPerimeter) return null
          return (
            <circle
              key={`fill-${xi}-${yi}`}
              cx={cx}
              cy={cy}
              r="7"
              fill="#EDE5D8"
              className="build-dot-fill"
            />
          )
        }),
      )}

      {/* Square path - one clockwise stroke from top-left. Perimeter
          = 4 * 150 = 600 SVG units; CSS uses that for the
          stroke-dasharray draw-in trick. */}
      <path
        d="M 25 25 L 175 25 L 175 175 L 25 175 Z"
        fill="none"
        stroke="#EDE5D8"
        strokeWidth="1.5"
        className="build-line"
      />
    </svg>
  )
}

/* ============================================================
   PARTNER - two cream squares fly in from opposite corners,
   slight overshoot, settle into final overlap. Coral overlap
   fades in after the squares are home.

   Final positions (matches the pre-animation layout):
     - Top-left square: x=20, y=20, 115x115
     - Bottom-right square: x=65, y=65, 115x115
     - Coral overlap: x=65, y=65, 70x70
   Off-stage starting offsets carried in CSS via --slide-from-*.
   ============================================================ */
export function PartnerVisual() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Bottom-right square - flies in from below-right. */}
      <g className="partner-square partner-square--br">
        <rect
          x="65"
          y="65"
          width="115"
          height="115"
          fill="none"
          stroke="#EDE5D8"
          strokeWidth="2"
        />
      </g>
      {/* Top-left square - flies in from above-left. Rendered after
          so its top-left corner stays crisp at the overlap edge. */}
      <g className="partner-square partner-square--tl">
        <rect
          x="20"
          y="20"
          width="115"
          height="115"
          fill="none"
          stroke="#EDE5D8"
          strokeWidth="2"
        />
      </g>
      {/* Coral overlap - fades in last, once the squares settle. */}
      <rect
        x="65"
        y="65"
        width="70"
        height="70"
        fill="rgba(247, 90, 85, 0.3)"
        stroke="#F75A55"
        strokeWidth="1.5"
        className="partner-overlap"
      />
    </svg>
  )
}
