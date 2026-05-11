/**
 * Four zones on the Expertise GHG-protocol diagram.
 *
 * Each zone occupies a vertical slice of the SVG (viewBox width 1289.12).
 * The xMin/xMax values match the four vertical dividers inside the
 * `_6_-_annotation` group of the SVG - they define where the coral
 * radial glow overlay should clip to when a zone is active.
 *
 * Source: docs/briefs/expertise-page-brief.md
 */

export const EXPERTISE_VIEWBOX_W = 1289.12

export type ZoneId = 'operations' | 'energy' | 'supply' | 'influence'

export type ExpertiseZone = {
  id: ZoneId
  label: string
  xMin: number
  xMax: number
  body: string
  /**
   * Accent colour for the panel border + heading + glow. Sampled from
   * the GHG diagram's arrow gradient (`linear-gradient1` in the SVG)
   * at each zone's centre point along the arrow's x-span.
   *
   * Sequence: orange (Operations) -> coral (Energy) -> pink (Supply
   * chain) -> purple (Influence). Maps left-to-right across the four
   * zones to echo the gradient on the arrow above.
   */
  accent: string
  /** Space-separated R G B for the same `accent`, used inside `rgb(... / a)` for the glow. */
  accentRgb: string
}

export const EXPERTISE_ZONES: ExpertiseZone[] = [
  {
    id: 'operations',
    label: 'Operations',
    xMin: 0,
    xMax: 327,
    body: 'How a building actually uses energy. Fabric, controls, occupancy patterns, wasted energy - the most controllable part of the picture, and the cheapest place to start cutting carbon and cost.',
    accent: '#f69247',
    accentRgb: '246 146 71',
  },
  {
    id: 'energy',
    label: 'Energy',
    xMin: 327,
    xMax: 649,
    body: 'Generation, storage, tariffs, grid constraints, flexibility. The systems behind the meter and the markets in front of it - and how those two relationships shape what\'s worth investing in.',
    accent: '#f16b55',
    accentRgb: '241 107 85',
  },
  {
    id: 'supply',
    label: 'Supply chain',
    xMin: 649,
    xMax: 969,
    body: 'Embodied carbon, procurement routes, supplier engagement, materials, equipment. The supply chain shapes how decisions account for cost and carbon together - and what\'s actually possible downstream.',
    accent: '#f0637b',
    accentRgb: '240 99 123',
  },
  {
    id: 'influence',
    label: 'Influence',
    xMin: 969,
    xMax: 1289,
    body: 'Design specification, governance, user behaviour, policy. Beyond the value chain is often where you can shape the most change.',
    accent: '#c46094',
    accentRgb: '196 96 148',
  },
]

/** Centre-x of a zone as a percentage of the SVG container width. */
export function zoneCenterPct(zone: ExpertiseZone): number {
  return ((zone.xMin + zone.xMax) / 2 / EXPERTISE_VIEWBOX_W) * 100
}

/** Left edge of a zone as a percentage. */
export function zoneLeftPct(zone: ExpertiseZone): number {
  return (zone.xMin / EXPERTISE_VIEWBOX_W) * 100
}

/** Right edge of a zone as a percentage. */
export function zoneRightPct(zone: ExpertiseZone): number {
  return (zone.xMax / EXPERTISE_VIEWBOX_W) * 100
}
