import { useEffect, useMemo, useState } from 'react'
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
 * BIDIRECTIONAL SCROLL-SCRUBBED morph between three load-shape
 * states. Same scroll-as-control model as Section 01: phase is a
 * pure function of the user's scroll position inside the step's
 * 300vh-tall text-block.
 *
 *   0.00 - 0.20  pre    text only, frame empty
 *   0.20 - 0.45  year   chart shows a full year of hourly data
 *   0.45 - 0.70  month  line MORPHS to MARCH (in place, no redraw)
 *   0.70 - 1.00  week   line MORPHS to WEEK OF 10 MAR
 *
 * The morph (Chris's key request) is achieved by:
 *   1. Resampling all three source slices (year=8760 pts,
 *      month=744 pts, week=168 pts) to the SAME length (N_POINTS).
 *   2. Indexing the X axis on the integer 0..N_POINTS-1, not on
 *      timestamps - so all three datasets share the same X domain.
 *   3. Removing the key={phase} from <Line> so Recharts does NOT
 *      remount the line element when phase changes - instead its
 *      internal isAnimationActive interpolates each point's y value
 *      from the previous dataset to the new one over 900ms. Visually
 *      the line "squashes and stretches" between the shapes rather
 *      than redrawing left-to-right.
 *
 * Y domain is LOCKED at [0, 80] across all three states so the kW
 * scale stays consistent and peaks aren't normalised - you see the
 * actual kW values as we zoom in.
 *
 * Tick labels are formatted from index based on the active phase:
 *   year  -> month name  (Jan / Feb / ...)
 *   month -> day of march (1, 5, 10, 15, 20, 25, 30)
 *   week  -> weekday short (Mon / Tue / ...)
 *
 * Data loaded via fetch from /assets/data/pablo-load-data.json
 * (~42KB; lazy-fetched since Section 02 is not above the fold).
 *
 * prefers-reduced-motion jumps straight to the week view.
 */

type Phase = 'pre' | 'year' | 'month' | 'week'

/* Scroll-progress phase thresholds. */
const PHASE_BOUNDS = {
  preEnd: 0.2,
  yearEnd: 0.45,
  monthEnd: 0.7,
  /* >= monthEnd -> week */
} as const

function phaseFromProgress(p: number): Phase {
  if (p < PHASE_BOUNDS.preEnd) return 'pre'
  if (p < PHASE_BOUNDS.yearEnd) return 'year'
  if (p < PHASE_BOUNDS.monthEnd) return 'month'
  return 'week'
}

/* Common length for all three datasets - chosen so the week view
   (168 points = one point per hour) stays at full resolution and
   the year + month views get downsampled to fit. */
const N_POINTS = 168

/* Source data starts 2025-01-01T00:00 hourly. March 1 sits at hour
   (31 + 28) * 24 = 1416. 10 March is 9 days into March = 1416 + 9*24
   = 1632. */
const HOURS_JAN_FEB = (31 + 28) * 24
const MARCH_HOURS = 31 * 24
const WEEK_HOURS = 7 * 24
const MARCH_10_HOUR_INDEX = HOURS_JAN_FEB + 9 * 24

/** Average-downsample an array to exactly targetN points. Each
 *  output bucket is the mean of the source values that fall in
 *  its range. */
function resample(arr: number[], targetN: number): number[] {
  if (arr.length === targetN) return arr.slice()
  const result: number[] = []
  const step = arr.length / targetN
  for (let i = 0; i < targetN; i++) {
    const start = Math.floor(i * step)
    const end = Math.max(start + 1, Math.floor((i + 1) * step))
    let sum = 0
    let count = 0
    for (let j = start; j < end && j < arr.length; j++) {
      sum += arr[j]
      count++
    }
    result.push(count > 0 ? sum / count : 0)
  }
  return result
}

/** Format a tick (index 0..N_POINTS-1) into a human label based on
 *  the active phase. */
function formatTick(index: number, phase: Phase): string {
  if (phase === 'year') {
    const monthIdx = Math.floor((index / N_POINTS) * 12)
    return [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ][Math.min(11, monthIdx)]
  }
  if (phase === 'month') {
    const day = Math.floor((index / N_POINTS) * 31) + 1
    return String(Math.min(31, day))
  }
  /* week - 168 points = 7 days * 24h. */
  const dayIdx = Math.floor(index / 24)
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][
    Math.min(6, dayIdx)
  ]
}

/** Tick positions to show on the X axis per phase. */
function ticksFor(phase: Phase): number[] {
  if (phase === 'year') {
    return Array.from({ length: 12 }, (_, i) =>
      Math.floor((i * N_POINTS) / 12),
    )
  }
  if (phase === 'month') {
    return [1, 5, 10, 15, 20, 25, 30].map((d) =>
      Math.floor(((d - 1) / 31) * N_POINTS),
    )
  }
  return [0, 24, 48, 72, 96, 120, 144]
}

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

  /* Scroll-driven phase. Bidirectional - no monotonic guard, so
     scrolling back walks the phases in reverse and the Recharts
     line morphs back to its earlier shape. */
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
          setPhase(phaseFromProgress(progress))
        }
      }
      frameId = window.requestAnimationFrame(tick)
    }
    frameId = window.requestAnimationFrame(tick)
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [stepIndex, reduced])

  /* Pre-compute resampled datasets - all N_POINTS long. */
  const datasets = useMemo(() => {
    if (!values) return null
    const yearSlice = values
    const monthSlice = values.slice(
      HOURS_JAN_FEB,
      HOURS_JAN_FEB + MARCH_HOURS,
    )
    const weekSlice = values.slice(
      MARCH_10_HOUR_INDEX,
      MARCH_10_HOUR_INDEX + WEEK_HOURS,
    )
    return {
      year: resample(yearSlice, N_POINTS),
      month: resample(monthSlice, N_POINTS),
      week: resample(weekSlice, N_POINTS),
    }
  }, [values])

  /* Active dataset wrapped as Recharts row objects. All three
     datasets share the same integer X domain (0..N_POINTS-1) so
     Recharts morphs the line in place between phases instead of
     redrawing it from zero. */
  const data = useMemo(() => {
    if (!datasets || phase === 'pre') return []
    const yArr =
      phase === 'year'
        ? datasets.year
        : phase === 'month'
          ? datasets.month
          : datasets.week
    return yArr.map((v, i) => ({ t: i, kw: v }))
  }, [datasets, phase])

  const labelText =
    phase === 'year'
      ? '1 YEAR'
      : phase === 'month'
        ? '1 MONTH · MARCH'
        : phase === 'week'
          ? '1 WEEK · 10 MAR'
          : ''

  const chartIsIn = phase !== 'pre'
  const xTicks = phase !== 'pre' ? ticksFor(phase) : []

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
              margin={{ top: 24, right: 20, bottom: 14, left: 0 }}
            >
              {/* Dotted horizontal grid lines INSIDE the plot area.
                  Recharts naturally keeps these clear of the axis
                  label gutters (YAxis width + bottom margin push
                  the plot area inward). */}
              <CartesianGrid
                strokeDasharray="2 4"
                stroke="rgba(26, 37, 64, 0.12)"
                vertical={false}
              />
              <XAxis
                dataKey="t"
                type="number"
                domain={[0, N_POINTS - 1]}
                ticks={xTicks}
                tickFormatter={(t: number) => formatTick(t, phase)}
                tick={{
                  fontSize: 10,
                  fill: 'rgba(26, 37, 64, 0.62)',
                  fontFamily: 'Stolzl, system-ui, sans-serif',
                  fontWeight: 300,
                }}
                /* SOLID grey axis line, hairline weight. */
                axisLine={{
                  stroke: 'rgba(26, 37, 64, 0.45)',
                  strokeWidth: 1,
                }}
                tickLine={false}
                tickMargin={8}
                interval={0}
              />
              <YAxis
                domain={[0, 80]}
                ticks={[0, 20, 40, 60, 80]}
                tick={{
                  fontSize: 10,
                  fill: 'rgba(26, 37, 64, 0.62)',
                  fontFamily: 'Stolzl, system-ui, sans-serif',
                  fontWeight: 300,
                }}
                /* SOLID grey axis line on the left edge of the plot. */
                axisLine={{
                  stroke: 'rgba(26, 37, 64, 0.45)',
                  strokeWidth: 1,
                }}
                tickLine={false}
                /* Wider width gives the labels a clear gutter on the
                   cream frame background, away from the dotted grid
                   inside the plot. */
                width={56}
                tickMargin={6}
                unit=" kW"
              />
              {/* NB: NO key={phase} here. With a stable Line element
                  and same-length data across phases, Recharts uses
                  isAnimationActive to interpolate point-by-point from
                  the previous y values to the new ones - the line
                  appears to morph (squash + stretch) rather than
                  redraw from left to right. This is the Chris-PABLO
                  morph behaviour. */}
              <Line
                dataKey="kw"
                stroke="#F75A55"
                strokeWidth={1.4}
                dot={false}
                fill="none"
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
