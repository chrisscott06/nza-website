import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

/**
 * PABLO Section 02 ("Understand your demand") animation.
 *
 * SCROLL-DRIVEN per the parent brief + Chris's June 2026 redesign.
 * Same three-scroll-trigger model as Section 01:
 *
 *   Scroll 0 - 25%   pre   - text only, frame empty
 *   Scroll 25 - 55%  year  - chart appears with 1 year of hourly data
 *   Scroll 55 - 80%  month - line morphs to MARCH (744 hours)
 *   Scroll 80 - 100% week  - line morphs to WEEK OF 10 MAR (168 hrs)
 *
 * Phase transitions are MONOTONIC. The Recharts <Line> internal
 * animation (1200ms ease-in-out) handles the morph between data sets
 * - point-to-point interpolation. The Y domain is fixed at [0, 80]
 * across all three states so the kW scale stays consistent.
 *
 * State label (top-right of the chart): "1 YEAR" / "1 MONTH · MARCH"
 * / "1 WEEK · 10 MAR" in IBM Plex Mono-style micro-typography, with
 * a pulsing coral dot.
 *
 * Data loaded via fetch from /assets/data/pablo-load-data.json
 * (42KB; lazy-fetched so it doesn't slow first paint of the PABLO
 * hero - Section 02 is the second step, not above the fold).
 *
 * prefers-reduced-motion jumps straight to the week view.
 */

type DataPoint = { t: number; kw: number }
type Phase = 'pre' | 'year' | 'month' | 'week'

/* Scroll thresholds (fraction of progress through the parent
   text-block's scroll runway) at which each phase fires. */
const SCROLL_PHASE_YEAR_AT = 0.25
const SCROLL_PHASE_MONTH_AT = 0.55
const SCROLL_PHASE_WEEK_AT = 0.8

/* Date / index constants. Source data starts 2025-01-01T00:00 with
   hourly granularity (8760 points). March 1 is at the (31+28)*24 =
   1416th hour. 10 March is 9 days into March = 1416 + 9*24 = 1632nd
   hour. */
const START_OF_YEAR_MS = new Date('2025-01-01T00:00:00').getTime()
const MS_PER_HOUR = 60 * 60 * 1000
const HOURS_JAN_FEB = (31 + 28) * 24
const MARCH_HOURS = 31 * 24
const WEEK_HOURS = 7 * 24
const MARCH_10_HOUR_INDEX = HOURS_JAN_FEB + 9 * 24

export function PabloSection02Animation({
  stepIndex,
}: {
  stepIndex: number
}) {
  const [values, setValues] = useState<number[] | null>(null)
  const [phase, setPhase] = useState<Phase>('pre')
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* Lazy-fetch the data file. ~42KB, but no need to block the hero. */
  useEffect(() => {
    let cancelled = false
    fetch('/assets/data/pablo-load-data.json')
      .then((r) => r.json())
      .then((d: { values: number[] }) => {
        if (!cancelled) setValues(d.values)
      })
      .catch((err) => {
        console.warn('PABLO Section 02 - load data fetch failed', err)
      })
    return () => {
      cancelled = true
    }
  }, [])

  /* Scroll-driven phase trigger via RAF polling (same as Section 01).
     Polls the corresponding text-block's viewport position every
     frame and advances the phase as the user crosses thresholds.
     Monotonic. */
  useEffect(() => {
    if (reduced) {
      setPhase('week')
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
          setPhase((curr) => {
            /* Monotonic - never go back to an earlier phase. */
            if (progress >= SCROLL_PHASE_WEEK_AT) return 'week'
            if (progress >= SCROLL_PHASE_MONTH_AT && curr !== 'week') {
              return 'month'
            }
            if (
              progress >= SCROLL_PHASE_YEAR_AT &&
              curr !== 'week' &&
              curr !== 'month'
            ) {
              return 'year'
            }
            return curr
          })
        }
      }
      frameId = window.requestAnimationFrame(tick)
    }
    frameId = window.requestAnimationFrame(tick)
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [stepIndex, reduced])

  /* Build the current data subset based on the active phase. */
  const data = buildChartData(values, phase)

  const labelText =
    phase === 'year'
      ? '1 YEAR'
      : phase === 'month'
        ? '1 MONTH · MARCH'
        : phase === 'week'
          ? '1 WEEK · 10 MAR'
          : ''

  const chartIsIn = phase !== 'pre'

  return (
    <div className="pablo-s02">
      <div
        className={
          'pablo-s02-state-label' + (chartIsIn ? ' is-in' : '')
        }
        aria-hidden="true"
      >
        <span className="pablo-s02-state-dot" />
        <span className="pablo-s02-state-text" key={phase}>
          {labelText}
        </span>
      </div>
      <div
        className={
          'pablo-s02-chart' + (chartIsIn ? ' is-in' : '')
        }
        aria-hidden="true"
      >
        {data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 28, right: 24, bottom: 32, left: 8 }}
            >
              <CartesianGrid
                strokeDasharray="2 4"
                stroke="rgba(26, 37, 64, 0.08)"
                vertical={false}
              />
              <XAxis
                dataKey="t"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(t: number) => formatXTick(t, phase)}
                tick={{
                  fontSize: 10,
                  fill: 'rgba(26, 37, 64, 0.55)',
                  fontFamily:
                    'Stolzl, system-ui, sans-serif',
                  fontWeight: 300,
                }}
                axisLine={false}
                tickLine={false}
                minTickGap={20}
              />
              <YAxis
                domain={[0, 80]}
                tick={{
                  fontSize: 10,
                  fill: 'rgba(26, 37, 64, 0.55)',
                  fontFamily:
                    'Stolzl, system-ui, sans-serif',
                  fontWeight: 300,
                }}
                axisLine={false}
                tickLine={false}
                unit=" kW"
                width={56}
              />
              <Line
                dataKey="kw"
                stroke="#F75A55"
                strokeWidth={1.4}
                dot={false}
                fill="none"
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-in-out"
                /* Key change forces Recharts to remount the line when
                   phase changes, so it animates from its previous y
                   values to the new ones rather than swapping abruptly. */
                key={phase}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

/** Slice the source values down to whichever subset the current phase
 *  needs, then map each value to a {t, kw} point. */
function buildChartData(
  values: number[] | null,
  phase: Phase,
): DataPoint[] {
  if (!values || phase === 'pre') return []
  const toPoints = (slice: number[], startIndex: number): DataPoint[] =>
    slice.map((kw, i) => ({
      t: START_OF_YEAR_MS + (startIndex + i) * MS_PER_HOUR,
      kw,
    }))
  if (phase === 'year') return toPoints(values, 0)
  if (phase === 'month') {
    return toPoints(
      values.slice(HOURS_JAN_FEB, HOURS_JAN_FEB + MARCH_HOURS),
      HOURS_JAN_FEB,
    )
  }
  // phase === 'week'
  return toPoints(
    values.slice(
      MARCH_10_HOUR_INDEX,
      MARCH_10_HOUR_INDEX + WEEK_HOURS,
    ),
    MARCH_10_HOUR_INDEX,
  )
}

/** Per-phase X-axis tick formatter. */
function formatXTick(t: number, phase: Phase): string {
  const d = new Date(t)
  if (phase === 'year') {
    /* Short month name - Jan / Feb / ... / Dec. */
    return d.toLocaleString('en-GB', { month: 'short' })
  }
  if (phase === 'month') {
    /* Day of month as integer. */
    return String(d.getDate())
  }
  /* Week view - weekday short name (Mon / Tue / ...). */
  return d.toLocaleString('en-GB', { weekday: 'short' })
}
