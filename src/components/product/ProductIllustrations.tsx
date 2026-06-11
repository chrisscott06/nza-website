/**
 * Placeholder line-art illustrations for the four-step section.
 *
 * Per the brief, real illustrations are pending from Leo Morgan /
 * dawn.design. Until those land, these placeholders give each step a
 * credible line-art visual in the product's accent colour that hints at
 * the concept (a site map, a payback curve, a 3D building stack, etc.).
 *
 * Each illustration is referenced by the `illustrationConcept` string in
 * the per-product config. Real SVGs slot in by adding new entries here
 * (or by replacing the placeholder paths with the real artwork).
 *
 * All illustrations use stroke-only paths so they inherit the parent
 * step-illustration's `stroke` colour (set per product accent).
 */

import type { ReactNode } from 'react'
import { PabloSection01Animation } from './pablo/PabloSection01Animation'
import { PabloSection02Animation } from './pablo/PabloSection02Animation'
import { PabloSection03Animation } from './pablo/PabloSection03Animation'
import { PabloSection04Animation } from './pablo/PabloSection04Animation'
import { PabloSection05Animation } from './pablo/PabloSection05Animation'

const ILLUSTRATIONS: Record<string, ReactNode> = {
  // ============================================================
  // PABLO — site map + meters
  // ============================================================
  'site-boundary-with-meters': (
    <svg viewBox="0 0 280 280">
      {/* Site boundary - irregular rounded shape */}
      <path d="M30 60 Q40 30 90 35 L180 30 Q230 35 245 80 L250 180 Q240 230 200 240 L80 245 Q35 235 30 195 Z" />
      {/* Buildings */}
      <rect x="70" y="80" width="60" height="40" rx="2" />
      <rect x="150" y="80" width="40" height="40" rx="2" />
      <rect x="70" y="150" width="40" height="60" rx="2" />
      <rect x="140" y="160" width="70" height="50" rx="2" />
      {/* Connection dots */}
      <circle cx="100" cy="100" r="3" fill="currentColor" />
      <circle cx="170" cy="100" r="3" fill="currentColor" />
      <circle cx="90" cy="180" r="3" fill="currentColor" />
      <circle cx="175" cy="185" r="3" fill="currentColor" />
      <circle cx="225" cy="135" r="3" fill="currentColor" />
      {/* Faint connecting lines */}
      <path d="M100 100 L170 100 M170 100 L225 135 M225 135 L175 185 M175 185 L90 180 M90 180 L100 100" opacity="0.4" />
    </svg>
  ),
  // PABLO — solar + battery + load
  'solar-battery-load': (
    <svg viewBox="0 0 280 280">
      {/* Solar panels - grid */}
      <g transform="translate(30 30)">
        <rect x="0" y="0" width="80" height="50" rx="2" />
        <path d="M0 25 L80 25 M20 0 L20 50 M40 0 L40 50 M60 0 L60 50" opacity="0.6" />
      </g>
      {/* Battery */}
      <g transform="translate(180 30)">
        <rect x="0" y="0" width="70" height="50" rx="4" />
        <rect x="70" y="15" width="6" height="20" rx="1" fill="currentColor" />
        <rect x="10" y="14" width="14" height="22" fill="currentColor" opacity="0.5" />
        <rect x="28" y="14" width="14" height="22" fill="currentColor" opacity="0.5" />
        <rect x="46" y="14" width="14" height="22" fill="currentColor" opacity="0.5" />
      </g>
      {/* Connecting lines */}
      <path d="M110 55 Q140 55 140 100" />
      <path d="M215 80 Q215 100 180 110" />
      {/* Load curve at the bottom */}
      <g transform="translate(40 160)">
        <path d="M0 60 L200 60" opacity="0.5" />
        <path d="M0 0 L0 60" opacity="0.5" />
        <path d="M0 50 Q25 30 50 35 T100 20 T150 25 T200 10" />
      </g>
    </svg>
  ),
  // PABLO — payback curve with break-even
  'payback-curve-breakeven': (
    <svg viewBox="0 0 280 280">
      {/* Axes */}
      <path d="M40 220 L240 220" />
      <path d="M40 220 L40 40" />
      {/* Zero line */}
      <path d="M40 150 L240 150" opacity="0.3" stroke-dasharray="3 4" />
      {/* Negative dip then rise across break-even */}
      <path d="M40 150 L60 175 L80 200 L100 200 L120 195 L140 175 L155 150 L180 110 L210 70 L240 50" />
      {/* Break-even marker */}
      <circle cx="155" cy="150" r="5" fill="currentColor" />
      <path d="M155 150 L155 220 M155 220 L160 215 M155 220 L150 215" opacity="0.5" />
      {/* Labels - micro tick marks */}
      <path d="M40 220 L40 224 M120 220 L120 224 M200 220 L200 224" opacity="0.5" />
      <path d="M40 150 L36 150 M40 100 L36 100 M40 50 L36 50" opacity="0.5" />
    </svg>
  ),
  // PABLO — building with energy flows
  'building-energy-flows': (
    <svg viewBox="0 0 280 280">
      {/* Building */}
      <path d="M90 220 L90 80 L140 50 L190 80 L190 220 Z" />
      <path d="M90 80 L190 80" />
      {/* Windows */}
      <rect x="105" y="95" width="20" height="20" />
      <rect x="155" y="95" width="20" height="20" />
      <rect x="105" y="130" width="20" height="20" />
      <rect x="155" y="130" width="20" height="20" />
      <rect x="105" y="165" width="20" height="20" />
      <rect x="155" y="165" width="20" height="20" />
      {/* Door */}
      <rect x="130" y="190" width="20" height="30" />
      {/* Energy flow arrows around */}
      <path d="M50 120 Q70 120 80 130" opacity="0.7" />
      <path d="M75 125 L80 130 L75 134" opacity="0.7" />
      <path d="M230 140 Q210 140 200 150" opacity="0.7" />
      <path d="M205 145 L200 150 L205 154" opacity="0.7" />
      <path d="M140 30 Q140 45 145 55" opacity="0.7" />
      <path d="M141 50 L145 55 L150 51" opacity="0.7" />
      {/* Faint orbit lines */}
      <ellipse cx="140" cy="140" rx="100" ry="60" opacity="0.2" stroke-dasharray="3 5" />
    </svg>
  ),

  // ============================================================
  // NZ:AI — world map with emission dots
  // ============================================================
  'world-map-emission-dots': (
    <svg viewBox="0 0 280 280">
      {/* Stylised continents */}
      <path d="M40 90 Q50 80 70 85 L100 100 L95 130 L60 140 L45 125 Z" />
      <path d="M115 70 L160 75 L170 95 L155 115 L130 110 L120 90 Z" />
      <path d="M180 90 L220 88 L235 110 L225 140 L195 145 L185 120 Z" />
      <path d="M105 155 L140 152 L155 180 L130 200 L100 195 L95 170 Z" />
      <path d="M175 165 L215 162 L230 195 L205 215 L175 210 L165 185 Z" />
      {/* Emission dots */}
      <circle cx="75" cy="110" r="4" fill="currentColor" />
      <circle cx="135" cy="92" r="6" fill="currentColor" />
      <circle cx="200" cy="115" r="5" fill="currentColor" />
      <circle cx="120" cy="175" r="3" fill="currentColor" />
      <circle cx="195" cy="190" r="4" fill="currentColor" />
      <circle cx="160" cy="100" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="90" cy="120" r="2" fill="currentColor" opacity="0.5" />
      {/* Connection lines */}
      <path d="M75 110 L135 92 L200 115 L195 190 L120 175 Z" opacity="0.2" stroke-dasharray="2 4" />
    </svg>
  ),
  // NZ:AI — downward trajectory with milestones
  'trajectory-chart-milestones': (
    <svg viewBox="0 0 280 280">
      {/* Axes */}
      <path d="M40 40 L40 240 L240 240" />
      {/* Trajectory line - declining */}
      <path d="M50 60 L100 100 L150 145 L200 195 L235 225" />
      {/* Milestones - circles on the line */}
      <circle cx="100" cy="100" r="6" fill="currentColor" />
      <circle cx="150" cy="145" r="6" fill="currentColor" />
      <circle cx="200" cy="195" r="6" fill="currentColor" />
      <circle cx="100" cy="100" r="11" />
      <circle cx="150" cy="145" r="11" />
      <circle cx="200" cy="195" r="11" />
      {/* Labels - tick marks */}
      <path d="M40 240 L36 240 M40 180 L36 180 M40 120 L36 120 M40 60 L36 60" opacity="0.5" />
      <path d="M100 240 L100 244 M150 240 L150 244 M200 240 L200 244" opacity="0.5" />
      {/* Net-zero callout */}
      <path d="M235 225 L260 225" opacity="0.5" stroke-dasharray="2 3" />
    </svg>
  ),
  // NZ:AI — waterfall / cascade chart
  'waterfall-cascade-chart': (
    <svg viewBox="0 0 280 280">
      {/* Axes */}
      <path d="M40 40 L40 220 L240 220" />
      {/* Baseline */}
      <rect x="50" y="60" width="30" height="160" />
      {/* Step-down bars */}
      <rect x="90" y="100" width="30" height="120" />
      <rect x="130" y="135" width="30" height="85" />
      <rect x="170" y="165" width="30" height="55" />
      <rect x="210" y="190" width="30" height="30" />
      {/* Connecting dotted lines between bars */}
      <path d="M80 60 L90 60 M80 100 L90 100" opacity="0.5" stroke-dasharray="2 3" />
      <path d="M120 100 L130 100 M120 135 L130 135" opacity="0.5" stroke-dasharray="2 3" />
      <path d="M160 135 L170 135 M160 165 L170 165" opacity="0.5" stroke-dasharray="2 3" />
      <path d="M200 165 L210 165 M200 190 L210 190" opacity="0.5" stroke-dasharray="2 3" />
    </svg>
  ),
  // NZ:AI — multi-year tracking chart
  'multi-year-tracking-chart': (
    <svg viewBox="0 0 280 280">
      {/* Axes */}
      <path d="M40 40 L40 220 L240 220" />
      {/* Grid lines */}
      <path d="M40 80 L240 80 M40 120 L240 120 M40 160 L240 160 M40 200 L240 200" opacity="0.2" />
      {/* Target line - flat declining */}
      <path d="M50 90 L240 195" opacity="0.4" stroke-dasharray="4 4" />
      {/* Actual data - jagged downward path */}
      <path d="M50 100 L80 115 L110 100 L140 140 L170 155 L200 175 L230 195" />
      {/* Data points */}
      <circle cx="50" cy="100" r="3" fill="currentColor" />
      <circle cx="80" cy="115" r="3" fill="currentColor" />
      <circle cx="110" cy="100" r="3" fill="currentColor" />
      <circle cx="140" cy="140" r="3" fill="currentColor" />
      <circle cx="170" cy="155" r="3" fill="currentColor" />
      <circle cx="200" cy="175" r="3" fill="currentColor" />
      <circle cx="230" cy="195" r="3" fill="currentColor" />
      {/* Year ticks */}
      <path d="M50 220 L50 224 M110 220 L110 224 M170 220 L170 224 M230 220 L230 224" opacity="0.5" />
    </svg>
  ),

  // ============================================================
  // decodED — postcode pin on UK
  // ============================================================
  'postcode-pin-uk': (
    <svg viewBox="0 0 280 280">
      {/* Stylised UK outline */}
      <path d="M120 40 Q140 35 150 50 L160 70 L175 85 L185 100 L185 130 L175 155 L180 180 L170 210 L160 235 L140 245 L115 240 L100 220 L95 195 L100 175 L90 160 L95 140 L90 120 L100 100 L105 80 L115 60 Z" />
      {/* Pin dropping in */}
      <circle cx="140" cy="120" r="14" />
      <path d="M140 134 L140 160 M140 155 L132 165 M140 155 L148 165" />
      <circle cx="140" cy="120" r="5" fill="currentColor" />
      {/* Pin shadow */}
      <ellipse cx="140" cy="165" rx="12" ry="3" opacity="0.3" />
    </svg>
  ),
  // decodED — axonometric buildings cluster
  'building-cluster-axonometric': (
    <svg viewBox="0 0 280 280">
      {/* Ground plane */}
      <path d="M40 200 L140 240 L240 200 L140 160 Z" opacity="0.3" />
      {/* Buildings at different heights - axonometric */}
      {/* Building 1 - tallest */}
      <path d="M90 105 L120 95 L150 105 L150 195 L120 205 L90 195 Z" />
      <path d="M120 95 L120 205" />
      <path d="M90 105 L150 105" />
      {/* Building 2 - medium */}
      <path d="M155 130 L180 120 L205 130 L205 205 L180 215 L155 205 Z" />
      <path d="M180 120 L180 215" />
      <path d="M155 130 L205 130" />
      {/* Building 3 - short */}
      <path d="M60 175 L80 168 L100 175 L100 215 L80 222 L60 215 Z" />
      <path d="M80 168 L80 222" />
      <path d="M60 175 L100 175" />
    </svg>
  ),
  // decodED — three intersecting circles
  'three-circles-impact': (
    <svg viewBox="0 0 280 280">
      <circle cx="115" cy="115" r="65" />
      <circle cx="175" cy="115" r="65" />
      <circle cx="145" cy="175" r="65" />
      {/* Small dots labelling intersections */}
      <circle cx="145" cy="115" r="3" fill="currentColor" />
      <circle cx="130" cy="155" r="3" fill="currentColor" />
      <circle cx="160" cy="155" r="3" fill="currentColor" />
      <circle cx="145" cy="148" r="4" fill="currentColor" />
    </svg>
  ),
  // decodED — sequenced list with checkboxes
  'sequenced-checkbox-list': (
    <svg viewBox="0 0 280 280">
      {/* Five rows */}
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 60 + i * 38
        return (
          <g key={i}>
            <rect x="50" y={y} width="22" height="22" rx="3" />
            <path d="M40 70 L240 70" transform={`translate(40 ${y - 70 + 32}) scale(1 0)`} opacity="0" />
            <path d={`M88 ${y + 6} L220 ${y + 6}`} opacity="0.6" />
            <path d={`M88 ${y + 14} L180 ${y + 14}`} opacity="0.4" />
            {i < 2 && (
              <path
                d={`M54 ${y + 11} L60 ${y + 16} L70 ${y + 6}`}
                opacity="1"
              />
            )}
          </g>
        )
      })}
    </svg>
  ),
}

/* Animated concepts now take a stepIndex prop so the component can
   find its corresponding .product-step-text-block in the DOM and
   subscribe to scroll progress through it (the scrollytelling
   pattern Chris asked for in June 2026 - phases advance with
   user scroll, not on a timer). */
const ANIMATED_CONCEPTS: Record<
  string,
  (props: { stepIndex: number }) => ReactNode
> = {
  'bill-decomposition': ({ stepIndex }) => (
    <PabloSection01Animation stepIndex={stepIndex} />
  ),
  'demand-profile-half-hourly': ({ stepIndex }) => (
    <PabloSection02Animation stepIndex={stepIndex} />
  ),
  'charges-stack': ({ stepIndex }) => (
    <PabloSection03Animation stepIndex={stepIndex} />
  ),
  'options-sandbox': ({ stepIndex }) => (
    <PabloSection04Animation stepIndex={stepIndex} />
  ),
  'investment-case-stack': ({ stepIndex }) => (
    <PabloSection05Animation stepIndex={stepIndex} />
  ),
}

export function ProductIllustration({
  concept,
  stepIndex,
}: {
  concept: string
  stepIndex?: number
}) {
  const animated = ANIMATED_CONCEPTS[concept]
  if (animated && stepIndex !== undefined) {
    return animated({ stepIndex })
  }
  const illustration = ILLUSTRATIONS[concept]
  if (!illustration) return null
  return illustration
}
