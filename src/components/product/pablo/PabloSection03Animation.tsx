import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'

/**
 * PABLO Section 03 ("See what's actually driving cost").
 *
 * Two-phase scroll-driven animation per
 * nza-pablo-section-03-animation-brief.md:
 *
 *   Phase A "comparison"  - two stacked bars side by side:
 *                            "Your Bill"      = Retail Tariff + DUoS
 *                                                (the visitor's mental
 *                                                 model of their bill)
 *                            "Your Breakdown" = the actual six-component
 *                                                breakdown PABLO sees
 *                            Both sum to the same total. The point:
 *                            same total, very different inside.
 *
 *   Phase B "projection"  - 15-year stacked bar projection
 *                            (2026 - 2040) with a dashed total-trajectory
 *                            line across the top and a red marker on
 *                            the 2040 endpoint. Each component grows at
 *                            its own escalation rate (DUoS + TNUoS
 *                            rising fastest at 3% pa).
 *
 * Scroll-progress phases (same model as Sections 01 + 02):
 *
 *   0.00 - 0.10  pre          frame empty
 *   0.10 - 0.45  comparison   Phase A visible
 *   0.45 - 0.85  projection   Phase A fades out, Phase B fades in
 *                              + line draws in + endpoint dot pops
 *   0.85 - 1.00  outro        chart fades out before next step
 *
 * Pills [Comparison] [Projection] snap the phase. Scroll takes over
 * on the next wheel event.
 *
 * prefers-reduced-motion jumps straight to the projection state.
 */

type Phase = 'pre' | 'comparison' | 'projection' | 'outro'

const PHASE_BOUNDS = {
  preEnd:        0.10,
  comparisonEnd: 0.45,
  projectionEnd: 0.85,
  /* >= projectionEnd -> outro */
} as const

function phaseFromProgress(p: number): Phase {
  if (p < PHASE_BOUNDS.preEnd) return 'pre'
  if (p < PHASE_BOUNDS.comparisonEnd) return 'comparison'
  if (p < PHASE_BOUNDS.projectionEnd) return 'projection'
  return 'outro'
}

/* === DATA ============================================================ */

/* The 6-component cost stack, plus the simpler Retail-Tariff-only view
   that the visitor THINKS they have. Order in the array sets the stack
   order in the chart (first = bottom). */
const COMPONENTS = [
  { key: 'Wholesale',    fill: '#ECB01F', fillOpacity: 1 },
  { key: 'DUoS',         fill: '#E84393', fillOpacity: 1 },
  { key: 'TNUoS',        fill: '#9B59B6', fillOpacity: 1 },
  { key: 'Levies',       fill: '#27AE60', fillOpacity: 1 },
  { key: 'Other',        fill: '#E67E22', fillOpacity: 1 },
  { key: 'Cost Gap',     fill: '#ED6359', fillOpacity: 0.65 },
] as const
const RETAIL_TARIFF = { key: 'Retail Tariff', fill: '#3498DB', fillOpacity: 1 }

/* Phase A: two stacked bars. "Your Bill" only has Retail Tariff +
   DUoS populated; "Your Breakdown" only has the six components. Both
   sum to approximately the same total (~£83,977). */
const COMPARISON_DATA = [
  {
    name: 'Your Bill',
    'Retail Tariff': 58220,
    DUoS:            25065,
    Wholesale:           0,
    TNUoS:               0,
    Levies:              0,
    Other:               0,
    'Cost Gap':          0,
  },
  {
    name: 'Your Breakdown',
    'Retail Tariff':     0,
    Wholesale:       24074,
    DUoS:            19557,
    TNUoS:           16634,
    Levies:           7876,
    Other:            3751,
    'Cost Gap':      11392,
  },
]

/* Phase B: 15-year projection. Each component starts at its 2026
   baseline and compounds at its own escalation rate. */
const BASE_2026 = {
  Wholesale:  24074,
  DUoS:       19557,
  TNUoS:      16634,
  Levies:      7876,
  Other:       3751,
  'Cost Gap': 11392,
} as const
const ESCALATION_RATES = {
  Wholesale:  0.015, /* relatively stable */
  DUoS:       0.030, /* rising fastest */
  TNUoS:      0.030, /* rising fastest */
  Levies:     0.010, /* stable */
  Other:      0.015,
  'Cost Gap': 0.012,
} as const

/* Pre-compute the projection at module load. 15 rows = 2026..2040
   inclusive. Each row also gets a `total` field used by the dashed
   trajectory line at the top of the stack. */
type ProjectionRow = {
  year: number
  Wholesale: number
  DUoS: number
  TNUoS: number
  Levies: number
  Other: number
  'Cost Gap': number
  total: number
}
const PROJECTION_DATA: ProjectionRow[] = Array.from(
  { length: 15 },
  (_, i) => {
    const year = 2026 + i
    const row: Record<string, number> = { year }
    ;(Object.keys(BASE_2026) as Array<keyof typeof BASE_2026>).forEach((key) => {
      row[key] = Math.round(
        BASE_2026[key] * Math.pow(1 + ESCALATION_RATES[key], i),
      )
    })
    row.total =
      row.Wholesale +
      row.DUoS +
      row.TNUoS +
      row.Levies +
      row.Other +
      row['Cost Gap']
    return row as ProjectionRow
  },
)

const TOTAL_2040 = PROJECTION_DATA[PROJECTION_DATA.length - 1].total

const AXIS_TICK = {
  fontSize: 10,
  fill: 'rgba(26, 37, 64, 0.62)',
  fontFamily: 'Stolzl, system-ui, sans-serif',
  fontWeight: 300,
}
const AXIS_LINE = {
  stroke: 'rgba(26, 37, 64, 0.45)',
  strokeWidth: 1,
}
const formatPounds = (v: number) => '£' + Math.round(v / 1000) + 'k'

/* === COMPONENT ======================================================= */

export function PabloSection03Animation({
  stepIndex,
}: {
  stepIndex: number
}) {
  const [phase, setPhase] = useState<Phase>('pre')
  const [reduced, setReduced] = useState(false)
  const pillOverride = useRef<Phase | null>(null)
  /* Monotonic - highest progress reached. Scroll-back leaves the
     graphic at whichever phase the user got the furthest into. */
  const maxProgressRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* Scroll-driven phase. RAF polling on the matching text-block,
     bidirectional, pill overrides cleared on next scroll. */
  useEffect(() => {
    if (reduced) {
      setPhase('projection')
      return
    }
    const blocks = document.querySelectorAll<HTMLElement>(
      '.product-step-text-block',
    )
    const block = blocks[stepIndex]
    if (!block) return

    let frameId = 0
    let lastProgress = -1
    const tick = () => {
      const rect = block.getBoundingClientRect()
      const scrollRange = rect.height - window.innerHeight
      if (scrollRange > 0) {
        const scrolled = -rect.top
        const progress = Math.max(0, Math.min(1, scrolled / scrollRange))
        if (Math.abs(progress - lastProgress) > 0.002) {
          lastProgress = progress
          if (progress > maxProgressRef.current) {
            maxProgressRef.current = progress
          }
          if (pillOverride.current !== null) pillOverride.current = null
          setPhase(phaseFromProgress(maxProgressRef.current))
        }
      }
      frameId = window.requestAnimationFrame(tick)
    }
    frameId = window.requestAnimationFrame(tick)
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [stepIndex, reduced])

  const onPillClick = (target: 'comparison' | 'projection') => {
    pillOverride.current = target
    setPhase(target)
  }

  /* Active pill - reflects whichever composition is on stage. Outro
     keeps showing Projection (it was the last seen view) so the pill
     doesn't jump back to Comparison during the fade. */
  const pillView: 'comparison' | 'projection' =
    phase === 'comparison' ? 'comparison' : 'projection'

  /* Both charts mount only when their phase is the active one, so
     Recharts replays its bar animations every time the user crosses
     into that phase (forward OR backward). */
  const showA = phase === 'comparison'
  const showB = phase === 'projection'
  const labelText =
    phase === 'comparison'
      ? 'ONE BILL · MANY CHARGES'
      : phase === 'projection' || phase === 'outro'
        ? 'PROJECTED · 2026 — 2040'
        : ''
  const labelIsIn = phase !== 'pre' && phase !== 'outro'
  const isOutro = phase === 'outro'

  /* Memoize the projection so the references stay stable across
     renders (avoids spurious Recharts animation restarts). */
  const projectionData = useMemo(() => PROJECTION_DATA, [])

  return (
    <div className={'pablo-s03' + (isOutro ? ' is-outro' : '')}>
      {/* State label - top-right of the frame, mono micro-typography
          matching Sections 01 + 02. */}
      <div
        className={
          'pablo-s03-state-label' + (labelIsIn ? ' is-in' : '')
        }
        aria-hidden="true"
      >
        <span className="pablo-s03-state-dot" />
        <span className="pablo-s03-state-text" key={phase}>
          {labelText}
        </span>
      </div>

      {/* Phase A: comparison bars */}
      <div
        className={
          'pablo-s03-chart pablo-s03-chart--a' +
          (showA ? ' is-in' : '')
        }
        aria-hidden="true"
      >
        {showA && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={COMPARISON_DATA}
              margin={{ top: 28, right: 24, bottom: 18, left: 0 }}
              barCategoryGap="32%"
            >
              <CartesianGrid
                strokeDasharray="2 4"
                stroke="rgba(26, 37, 64, 0.12)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={AXIS_TICK}
                axisLine={AXIS_LINE}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis
                domain={[0, 100000]}
                ticks={[0, 20000, 40000, 60000, 80000, 100000]}
                tickFormatter={formatPounds}
                tick={AXIS_TICK}
                axisLine={AXIS_LINE}
                tickLine={false}
                width={56}
                tickMargin={6}
              />
              {/* Bottom layer first. Retail Tariff is only used by
                  Your Bill; the six PABLO components are only used
                  by Your Breakdown. Each row puts zero in the slots
                  it doesn't fill, so the stacks render cleanly. */}
              <Bar
                dataKey={RETAIL_TARIFF.key}
                stackId="bill"
                fill={RETAIL_TARIFF.fill}
                isAnimationActive
                animationDuration={600}
                animationBegin={0}
                animationEasing="ease-out"
              />
              {COMPONENTS.map((c, idx) => (
                <Bar
                  key={c.key}
                  dataKey={c.key}
                  stackId="bill"
                  fill={c.fill}
                  fillOpacity={c.fillOpacity}
                  isAnimationActive
                  animationDuration={600}
                  animationBegin={idx * 60}
                  animationEasing="ease-out"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Phase B: 15-year projection with dashed total line + 2040
          endpoint dot. */}
      <div
        className={
          'pablo-s03-chart pablo-s03-chart--b' +
          (showB ? ' is-in' : '')
        }
        aria-hidden="true"
      >
        {showB && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={projectionData}
              margin={{ top: 28, right: 24, bottom: 18, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="2 4"
                stroke="rgba(26, 37, 64, 0.12)"
                vertical={false}
              />
              <XAxis
                dataKey="year"
                type="number"
                domain={[2026, 2040]}
                ticks={[2026, 2028, 2030, 2032, 2034, 2036, 2038, 2040]}
                tick={AXIS_TICK}
                axisLine={AXIS_LINE}
                tickLine={false}
                tickMargin={8}
                interval={0}
              />
              <YAxis
                domain={[0, 150000]}
                ticks={[0, 50000, 100000, 150000]}
                tickFormatter={formatPounds}
                tick={AXIS_TICK}
                axisLine={AXIS_LINE}
                tickLine={false}
                width={56}
                tickMargin={6}
              />
              {COMPONENTS.map((c) => (
                <Bar
                  key={c.key}
                  dataKey={c.key}
                  stackId="proj"
                  fill={c.fill}
                  fillOpacity={c.fillOpacity}
                  isAnimationActive
                  animationDuration={1500}
                  animationBegin={0}
                  animationEasing="ease-out"
                />
              ))}
              {/* Dashed total-trajectory line - draws across the top
                  of each stack once the bars have finished growing. */}
              <Line
                dataKey="total"
                stroke="#ED6359"
                strokeWidth={1.8}
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive
                animationDuration={800}
                animationBegin={1500}
                animationEasing="ease-out"
              />
              {/* 2040 endpoint marker - filled coral circle with
                  white outline, sits at the very top of the line. */}
              <ReferenceDot
                x={2040}
                y={TOTAL_2040}
                r={5}
                fill="#ED6359"
                stroke="#FFFFFF"
                strokeWidth={2}
                isFront
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pills */}
      <div className="pablo-tab-pills">
        <button
          type="button"
          className={
            'pablo-tab-pill' +
            (pillView === 'comparison' ? ' is-active' : '')
          }
          onClick={() => onPillClick('comparison')}
        >
          Comparison
        </button>
        <button
          type="button"
          className={
            'pablo-tab-pill' +
            (pillView === 'projection' ? ' is-active' : '')
          }
          onClick={() => onPillClick('projection')}
        >
          Projection
        </button>
      </div>
    </div>
  )
}
