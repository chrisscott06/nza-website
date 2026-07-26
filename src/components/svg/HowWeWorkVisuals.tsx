import type { CSSProperties } from 'react'

/**
 * The three SVG visualisations inside the "How we work" phase blocks.
 * All shapes now use `currentColor` so the parent's `color` decides
 * what they paint with - on the new coral page they read as white;
 * on a navy ground they'd read as cream. Only the PARTNER overlap
 * carries its own hard colour (navy at 30%) so it stays a distinct
 * accent regardless of the surrounding palette.
 *
 * Animations fire when the parent .how-we-work-page hits .is-revealed
 * AND each block's own --reveal-delay has elapsed.
 *
 *   DECODE   25 dots start scattered off their grid positions, then
 *            drift in from all directions and lock into a clean 5x5
 *            grid - "the unknown, pieced together into structure."
 *            Each dot is a <g> wrapper (transform: translate) with the
 *            circle at its FINAL grid cell inside; the wrapper animates
 *            from a per-dot scatter offset back to (0,0) so the circle
 *            lands exactly on its cell. Same technique as the landing
 *            hero's three-beat converge. Staggered so the grid assembles
 *            in a flowing cascade rather than snapping all at once.
 *   BUILD    all 25 outlined circles appear, perimeter 16 fill in, then
 *            the square path traces clockwise around the perimeter.
 *   PARTNER  two squares fly in from opposite corners with overshoot,
 *            settle, then the navy overlap fades in.
 */

const GRID_X = [25, 62.5, 100, 137.5, 175]
const GRID_Y = [25, 62.5, 100, 137.5, 175]

/* Deterministic scatter offset for dot `idx` - the vector the dot
   travels FROM as it assembles into the grid. Golden-angle spread so
   the 25 dots arrive from evenly-distributed directions (no clustering),
   with a distance that varies per index so they don't all travel the
   same length. Stable across renders - purely a function of the index. */
function scatterOffset(idx: number): { dx: number; dy: number } {
  const angle = idx * 2.399963 // golden angle in radians (~137.5deg)
  const distance = 34 + ((idx * 53) % 66) // 34-100 user units
  return {
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance,
  }
}

export function DecodeVisual() {
  const dots: Array<{ cx: number; cy: number }> = []
  for (const cy of GRID_Y) {
    for (const cx of GRID_X) {
      dots.push({ cx, cy })
    }
  }
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {dots.map((d, idx) => {
        const { dx, dy } = scatterOffset(idx)
        return (
          <g
            key={idx}
            className="decode-dot"
            style={
              {
                '--dot-index': idx,
                '--from-x': `${dx}px`,
                '--from-y': `${dy}px`,
              } as CSSProperties
            }
          >
            <circle cx={d.cx} cy={d.cy} r="7" fill="currentColor" />
          </g>
        )
      })}
    </svg>
  )
}

export function BuildVisual() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {GRID_Y.map((cy, yi) =>
        GRID_X.map((cx, xi) => (
          <circle
            key={`outline-${xi}-${yi}`}
            cx={cx}
            cy={cy}
            r="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="build-dot-outline"
          />
        )),
      )}
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
              fill="currentColor"
              className="build-dot-fill"
            />
          )
        }),
      )}
      <path
        d="M 25 25 L 175 25 L 175 175 L 25 175 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="build-line"
      />
    </svg>
  )
}

export function PartnerVisual() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g className="partner-square partner-square--br">
        <rect
          x="65"
          y="65"
          width="115"
          height="115"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>
      <g className="partner-square partner-square--tl">
        <rect
          x="20"
          y="20"
          width="115"
          height="115"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </g>
      {/* Partner overlap - navy accent so it reads against the
          white squares regardless of surrounding palette. Was coral
          when the visual lived on a navy card; on the new coral
          page coral-on-coral would disappear. */}
      <rect
        x="65"
        y="65"
        width="70"
        height="70"
        fill="rgba(14, 17, 32, 0.35)"
        stroke="#0E1120"
        strokeWidth="1.5"
        className="partner-overlap"
      />
    </svg>
  )
}
