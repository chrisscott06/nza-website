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
}

export const EXPERTISE_ZONES: ExpertiseZone[] = [
  {
    id: 'operations',
    label: 'Operations',
    xMin: 0,
    xMax: 327,
    body: 'How a building actually uses energy. Fabric, controls, occupancy patterns, wasted energy - the most controllable part of the picture, and the cheapest place to start cutting carbon and cost.',
  },
  {
    id: 'energy',
    label: 'Energy',
    xMin: 327,
    xMax: 649,
    body: 'Generation, storage, tariffs, grid constraints, flexibility. The systems behind the meter and the markets in front of it - and how those two relationships shape what\'s worth investing in.',
  },
  {
    id: 'supply',
    label: 'Supply chain',
    xMin: 649,
    xMax: 969,
    body: 'Embodied carbon, procurement governance, supplier engagement, materials, equipment. The chain shapes how decisions account for cost and carbon together - and what\'s actually possible downstream.',
  },
  {
    id: 'influence',
    label: 'Influence',
    xMin: 969,
    xMax: 1289,
    body: 'Specification, governance, occupant decisions, policy. Beyond the value chain is often where you can shape the most change.',
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
