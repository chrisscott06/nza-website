/**
 * Icons used by the Approach grid.
 *
 * The six capability icons themselves now ship as bespoke SVG assets in
 * public/assets/{estate-strategy,smart-energy,financial,carbon-pathways,
 * climate-resilience,co-built}.svg — wired up via `<img>` tags in
 * ApproachGrid (filename mapped from CAPABILITIES[i].icon). This file
 * keeps only the small chrome icons that the grid still needs.
 */

export function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}
