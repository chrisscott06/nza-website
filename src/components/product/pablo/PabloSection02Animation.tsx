import { useEffect, useMemo, useRef, useState } from 'react'
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
 * AUTO-LOOPING ANIMATION per Chris's June 2026 round 8 direction.
 * Scroll-driven approach was abandoned in favour of a simple timed
 * loop. While the step is visible the line cycles through:
 *
 *   t=0     year   chart fades in with the 1-year shape
 *   t=2000  month  line MORPHS to MARCH (Recharts 900ms morph)
 *   t=4000  week   line MORPHS to WEEK OF 10 MAR
 *   t=6000  outro  chart fades back out
 *   t=6500  pre    invisible / reset
 *   t=7100  year   loop restarts
 *
 * The morph (squash and stretch) is still the existing trick:
 * resample all three source slices to N_POINTS=168 indexed points,
 * keep the <Line> element stable so Recharts' isAnimationActive
 * interpolates each point's y value over 900ms.
 *
 * Y domain is LOCKED at [0, 80] kW across all three states so the
 * scale stays consistent.
 *
 * prefers-reduced-motion holds the 'week' state with no loop.
 */

type Phase = 'pre' | 'year' | 'month' | 'week' | 'outro'

/* Common length for all three datasets - week stays at full hourly
   resolution (168 points), year + month get downsampled to fit. */
const N_POINTS = 168

/* Cycle timeline in ms. */
const CYCLE = {
  year_at:      0,
  month_at:     2000,
  week_at:      4000,
  outro_at:     6000,
  pre_at:       6500,
  next_loop_at: 7100,
} as const

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
function formatTick(
  index: number,
  phase: 'year' | 'month' | 'week',
): string {
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
function ticksFor(phase: 'year' | 'month' | 'week'): number[] {
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
  const loopStarted = useRef(false)
  const cycleTimers = useRef<number[]>([])

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

  /* Entry trigger + auto-loop. Same pattern as Section 01: IO on
     text-block crossing the active band kicks off a cycle that
     replays the year -> month -> week -> outro morph sequence
     indefinitely. */
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

      setPhase('year')
      schedule(() => setPhase('month'), CYCLE.month_at)
      schedule(() => setPhase('week'),  CYCLE.week_at)
      schedule(() => setPhase('outro'), CYCLE.outro_at)
      schedule(() => setPhase('pre'),   CYCLE.pre_at)
      schedule(runCycle,                CYCLE.next_loop_at)
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
     redrawing it from zero. Outro keeps showing the week dataset
     so the line doesn't reflow back to year as it fades. */
  const data = useMemo(() => {
    if (!datasets || phase === 'pre') return []
    const yArr =
      phase === 'year'
        ? datasets.year
        : phase === 'month'
          ? datasets.month
          : datasets.week /* week or outro */
    return yArr.map((v, i) => ({ t: i, kw: v }))
  }, [datasets, phase])

  /* Whichever named view the chart is currently showing - used for
     the X-axis tick labels + tick positions. 'outro' keeps showing
     the week dataset so the line doesn't snap back to year during
     the fade. */
  const namedView: 'year' | 'month' | 'week' =
    phase === 'month' ? 'month' : phase === 'year' ? 'year' : 'week'

  const labelText =
    phase === 'year'
      ? '1 YEAR'
      : phase === 'month'
        ? '1 MONTH · MARCH'
        : phase === 'week' || phase === 'outro'
          ? '1 WEEK · 10 MAR'
          : ''

  /* Chart is in view for every phase except pre and outro - those
     are the fade-in and fade-out moments. */
  const chartIsIn = phase !== 'pre' && phase !== 'outro'
  const xTicks =
    phase !== 'pre' && phase !== 'outro' ? ticksFor(namedView) : []

  const isOutro = phase === 'outro'

  return (
    <div className={'pablo-s02' + (isOutro ? ' is-outro' : '')}>
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
                tickFormatter={(t: number) => formatTick(t, namedView)}
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
