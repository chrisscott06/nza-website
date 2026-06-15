import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bar,
  ComposedChart,
  Legend,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'

/**
 * PABLO Section 03 ("Find the cost drivers") - BAU Trajectory.
 *
 * Per nza-pablo-sections-03-04-05-brief.md (which SUPERSEDES the
 * earlier Section 03 brief): the Phase A "Your Bill vs Your
 * Breakdown" comparison is DROPPED. Section 03 is now JUST the
 * 15-year projection chart. The "your rate isn't one number"
 * claim lives in the body copy alone.
 *
 * Single play on viewport entry (NOT a loop - unlike Sections 01
 * and 02 which Chris asked to loop). Timeline:
 *
 *   t=0      bars         15 stacked bars (2026-2040) grow up
 *                          from baseline simultaneously
 *   t=1500   line drawn    coral dashed total-trajectory line
 *                          draws in left-to-right via Recharts
 *                          (animationDuration 800, animationBegin
 *                          1500)
 *   t=2100   dot pop       2040 endpoint marker scales in
 *                          (CSS keyframe at 2100ms)
 *   t=2400   held          final state, holds forever
 *
 * Y-axis ticks are HARDCODED round multiples (per the brief's
 * "round axis values, always" rule): £0, £500k, £1M, £1.5M, £2M,
 * £2.5M, £3M, £3.5M.
 *
 * The chart shows what PABLO does, not "Hartpury's data" - no
 * client name appears anywhere per the brief's universal rule.
 *
 * prefers-reduced-motion skips to the final state with no animation.
 */

/* === DATA ============================================================
   Shape reference: pablo-bau-trajectory-data.json (Hartpury 2026-2040
   reconstructed view). Values rounded slightly for visual cleanness;
   exact pounds aren't part of the message. Cost Gap is a synthetic
   ~5% layer on top per the brief - the source data doesn't include
   it but the visual is richer with it. */

const COMPONENTS = [
  { key: 'Wholesale', fill: '#ECB01F', fillOpacity: 1 },
  { key: 'DUoS',      fill: '#E84393', fillOpacity: 1 },
  { key: 'TNUoS',     fill: '#9B59B6', fillOpacity: 1 },
  { key: 'Levies',    fill: '#27AE60', fillOpacity: 1 },
  { key: 'Other',     fill: '#E67E22', fillOpacity: 1 },
  { key: 'Cost Gap',  fill: '#ED6359', fillOpacity: 0.65 },
] as const

type Row = {
  year: number
  Wholesale: number
  DUoS: number
  TNUoS: number
  Levies: number
  Other: number
  'Cost Gap': number
  total: number
}

/* Per-year breakdown (rounded to k). Wholesale/DUoS/TNUoS/Levies/Other
   follow the BAU shape from the data file; Cost Gap is a flat ~5% of
   the year's running subtotal so it grows in step. */
const RAW: Array<Omit<Row, 'Cost Gap' | 'total'>> = [
  { year: 2026, Wholesale: 432, DUoS: 184, TNUoS: 245, Levies: 561, Other: 177 },
  { year: 2027, Wholesale: 470, DUoS: 200, TNUoS: 267, Levies: 610, Other: 192 },
  { year: 2028, Wholesale: 521, DUoS: 222, TNUoS: 296, Levies: 677, Other: 213 },
  { year: 2029, Wholesale: 553, DUoS: 236, TNUoS: 314, Levies: 717, Other: 226 },
  { year: 2030, Wholesale: 588, DUoS: 251, TNUoS: 334, Levies: 764, Other: 241 },
  { year: 2031, Wholesale: 616, DUoS: 263, TNUoS: 350, Levies: 800, Other: 252 },
  { year: 2032, Wholesale: 645, DUoS: 275, TNUoS: 366, Levies: 837, Other: 264 },
  { year: 2033, Wholesale: 674, DUoS: 287, TNUoS: 383, Levies: 875, Other: 276 },
  { year: 2034, Wholesale: 705, DUoS: 300, TNUoS: 400, Levies: 915, Other: 288 },
  { year: 2035, Wholesale: 736, DUoS: 314, TNUoS: 418, Levies: 955, Other: 301 },
  { year: 2036, Wholesale: 768, DUoS: 327, TNUoS: 436, Levies: 997, Other: 314 },
  { year: 2037, Wholesale: 801, DUoS: 341, TNUoS: 455, Levies: 1040, Other: 328 },
  { year: 2038, Wholesale: 835, DUoS: 356, TNUoS: 474, Levies: 1084, Other: 342 },
  { year: 2039, Wholesale: 870, DUoS: 371, TNUoS: 494, Levies: 1130, Other: 356 },
  { year: 2040, Wholesale: 907, DUoS: 386, TNUoS: 515, Levies: 1177, Other: 371 },
]

const PROJECTION_DATA: Row[] = RAW.map((r) => {
  const subtotal = r.Wholesale + r.DUoS + r.TNUoS + r.Levies + r.Other
  const costGap = Math.round(subtotal * 0.05)
  const total = subtotal + costGap
  return {
    ...r,
    'Cost Gap': costGap,
    total,
  }
})

const TOTAL_2040 = PROJECTION_DATA[PROJECTION_DATA.length - 1].total

/* Y-axis is in thousands of pounds (the data values are k). Round
   ticks every £500k from £0 to £3.5M. */
const Y_TICKS_K = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500]
const formatYTick = (v: number) =>
  v === 0 ? '£0' : v >= 1000 ? `£${v / 1000}M` : `£${v}k`

const X_TICKS = [2026, 2028, 2030, 2032, 2034, 2036, 2038, 2040]

const AXIS_TICK = {
  fontSize: 10,
  fill: 'rgba(26, 37, 64, 0.62)',
  fontFamily: 'Stolzl, system-ui, sans-serif',
  fontWeight: 300,
}

/* === COMPONENT ======================================================= */

export function PabloSection03Animation({
  stepIndex,
}: {
  stepIndex: number
}) {
  const [entered, setEntered] = useState(false)
  const [reduced, setReduced] = useState(false)
  const ioFired = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* IO trigger - single play on first viewport entry. No loop. */
  useEffect(() => {
    if (reduced) {
      setEntered(true)
      return
    }
    const blocks = document.querySelectorAll<HTMLElement>(
      '.product-step-text-block',
    )
    const block = blocks[stepIndex]
    if (!block) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !ioFired.current) {
          ioFired.current = true
          io.disconnect()
          setEntered(true)
        }
      },
      { threshold: 0, rootMargin: '-40% 0px -40% 0px' },
    )
    io.observe(block)
    return () => io.disconnect()
  }, [stepIndex, reduced])

  const projectionData = useMemo(() => PROJECTION_DATA, [])

  return (
    <div className={'pablo-s03' + (entered ? ' is-in' : '')}>
      {/* State label - top-right of frame. */}
      <div
        className={
          'pablo-s03-state-label' + (entered ? ' is-in' : '')
        }
        aria-hidden="true"
      >
        <span className="pablo-s03-state-dot" />
        <span className="pablo-s03-state-text">
          PROJECTED · 2026 — 2040
        </span>
      </div>

      <div
        className={
          'pablo-s03-chart pablo-s03-chart--projection' +
          (entered ? ' is-in' : '')
        }
        aria-hidden="true"
      >
        {entered && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={projectionData}
              /* Extra bottom margin leaves room for the Legend
                 below the X axis. */
              margin={{ top: 28, right: 24, bottom: 32, left: 0 }}
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
                ticks={X_TICKS}
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                interval={0}
              />
              {/* Legend at the bottom showing each component's
                  colour + name. Recharts uses the Bar dataKey as
                  the label by default. */}
              <Legend
                verticalAlign="bottom"
                iconType="square"
                iconSize={10}
                wrapperStyle={{
                  paddingTop: 8,
                  fontSize: 10,
                  fontFamily: 'Stolzl, system-ui, sans-serif',
                  color: 'rgba(26, 37, 64, 0.7)',
                }}
              />
              <YAxis
                /* Values in this dataset are already in thousands -
                   the domain + ticks are kept in those units and
                   the formatter pretties them up to £0/£500k/£1M
                   etc. */
                domain={[0, 3500]}
                ticks={Y_TICKS_K}
                tickFormatter={formatYTick}
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
                width={56}
                tickMargin={6}
              />
              {/* Stacked components - bottom-up Wholesale, DUoS,
                  TNUoS, Levies, Other, Cost Gap. Recharts native
                  bar animation is DISABLED so a CSS keyframe can
                  grow each year's column from the bottom AND
                  stagger them right-to-left (2040 first, 2026
                  last) per Chris's "growing upwards and then
                  growing horizontally to the left" ask. The
                  stagger lives in product-page.css against
                  .pablo-s03 .recharts-bar-rectangle:nth-child(N). */}
              {COMPONENTS.map((c) => (
                <Bar
                  key={c.key}
                  dataKey={c.key}
                  stackId="proj"
                  fill={c.fill}
                  fillOpacity={c.fillOpacity}
                  isAnimationActive={false}
                />
              ))}
              {/* Dashed coral total-trajectory line - draws in after
                  the bars settle. animationBegin 1500ms means it
                  starts the moment the bar growth finishes. */}
              <Line
                dataKey="total"
                stroke="#ED6359"
                strokeWidth={1.8}
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive={!reduced}
                animationDuration={800}
                animationBegin={1500}
                animationEasing="ease-out"
              />
              {/* 2040 endpoint marker - hairline white-outlined
                  coral dot. CSS keyframe pops it in around 2100ms
                  via the .pablo-s03 .recharts-reference-dot rule. */}
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
