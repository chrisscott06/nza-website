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
 * AUTO-LOOPING ANIMATION per Chris's June 2026 round 8 direction.
 * Two-phase composition (Phase A comparison + Phase B 15yr
 * projection) - now driven by a timed loop instead of scroll.
 *
 *   t=0     comparison  Phase A bars grow up (Recharts ~600ms
 *                       per Bar + small staggered animationBegin)
 *   t=3500  projection  Phase A fades out, Phase B fades in +
 *                       bars grow ~1500ms + dashed line draws
 *                       in ~800ms + 2040 endpoint dot pops
 *   t=7500  outro       chart fades out
 *   t=8000  pre         invisible / reset
 *   t=8600  comparison  loop restarts
 *
 * prefers-reduced-motion holds the 'projection' state with no loop.
 */

type Phase = 'pre' | 'comparison' | 'projection' | 'outro'

const CYCLE = {
  comparison_at: 0,
  projection_at: 3500,
  outro_at:      7500,
  pre_at:        8000,
  next_loop_at:  8600,
} as const

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
  const loopStarted = useRef(false)
  const cycleTimers = useRef<number[]>([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* Entry trigger + auto-loop. */
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

    let cancelled = false

    const clearCycleTimers = () => {
      cycleTimers.current.forEach((t) => window.clearTimeout(t))
      cycleTimers.current = []
    }

    const schedule = (cb: () => void, delay: number) => {
      const t = window.setTimeout(() => {
        if (!cancelled) cb()
      }, delay)
      cycleTimers.current.push(t)
    }

    const runCycle = () => {
      if (cancelled) return
      clearCycleTimers()

      setPhase('comparison')
      schedule(() => setPhase('projection'), CYCLE.projection_at)
      schedule(() => setPhase('outro'),      CYCLE.outro_at)
      schedule(() => setPhase('pre'),        CYCLE.pre_at)
      schedule(runCycle,                     CYCLE.next_loop_at)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loopStarted.current) {
          loopStarted.current = true
          io.disconnect()
          runCycle()
        }
      },
      { threshold: 0, rootMargin: '-40% 0px -40% 0px' },
    )
    io.observe(block)
    return () => {
      cancelled = true
      io.disconnect()
      clearCycleTimers()
    }
  }, [stepIndex, reduced])

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

    </div>
  )
}
