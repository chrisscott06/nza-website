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
 * SCROLL-DRIVEN PHASES per Chris's June 2026 round 4 direction:
 *
 *   - 300vh runway (block --scrollytell).
 *   - The user scrolls THROUGH the section and the chart progresses
 *     phase by phase. Each phase gets ~25% of the runway = ~50vh of
 *     scroll, so a single firm wheel push doesn't blow through it.
 *
 *   0.00 - 0.15  pre    chart empty (frame still has its dots)
 *   0.15 - 0.40  year   chart fades in with the 1-year shape
 *   0.40 - 0.60  month  line MORPHS in place to MARCH
 *   0.60 - 0.85  week   line MORPHS in place to WEEK OF 10 MAR
 *   0.85 - 1.00  outro  chart fades back out before next step
 *
 * The morph (squash and stretch) is achieved by resampling all
 * three source slices to the same length (N_POINTS=168) and keeping
 * the <Line> element stable - Recharts' isAnimationActive
 * interpolates each point's y value over 900ms.
 *
 * Y domain is LOCKED at [0, 80] kW across all three states so the
 * scale stays consistent and peaks aren't normalised.
 *
 * Pills [1 YEAR] [1 MONTH] [1 WEEK] snap the phase to that view.
 * The next wheel event lets scroll take over again.
 *
 * prefers-reduced-motion jumps straight to the week view.
 */

type Phase = 'pre' | 'year' | 'month' | 'week' | 'outro'

/* Common length for all three datasets - chosen so the week view
   (168 points = one point per hour) stays at full resolution and
   the year + month views get downsampled to fit. */
const N_POINTS = 168

/* Scroll-progress phase thresholds (upper bound of each phase).
   'pre' fires on initial mount; 'year' is set by the IO entry
   trigger when the step's text-block enters the active band -
   user shouldn't have to scroll AGAIN to see the chart. From
   yearEnd onwards, scroll drives the morph between time-windows. */
const PHASE_BOUNDS = {
  yearEnd:  0.35,
  monthEnd: 0.62,
  weekEnd:  0.88,
  /* >= weekEnd -> outro */
} as const

function phaseFromProgress(p: number): Phase {
  if (p < PHASE_BOUNDS.yearEnd) return 'year'
  if (p < PHASE_BOUNDS.monthEnd) return 'month'
  if (p < PHASE_BOUNDS.weekEnd) return 'week'
  return 'outro'
}

/* Entry timing - same pattern as Section 01. */
const ENTRY_LOCK_MS = 1500

/* Per-phase animation lock. When phase enters 'month' or 'week'
   the Recharts <Line> is mid-morph (squashes-and-stretches over
   900ms via isAnimationActive). If we let scroll advance the
   phase again during that window the morph never completes -
   Chris's exact complaint. Locking for ~1100ms (Recharts 900ms +
   small buffer) lets each morph finish before scroll can push to
   the next time-window. */
const ANIMATION_LOCK_MS: Partial<Record<Phase, number>> = {
  month: 1100,
  week: 1100,
}

const PHASE_ORDER: Phase[] = ['pre', 'year', 'month', 'week', 'outro']

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
  /* Pill override - takes precedence over the scroll-derived phase
     until the next scroll event clears it. */
  const pillOverride = useRef<Phase | null>(null)
  /* Monotonic - highest scroll progress reached. Scrolling back UP
     doesn't drag the phase backwards; the chart sits at whichever
     view the user last reached. Per Chris's June 2026 round 5:
     "on the way back up, it just leaves it on whatever the final
     bit of the graphic was". */
  const maxProgressRef = useRef(0)
  /* Entry state - phase becomes 'year' (chart fades in) the moment
     the text-block crosses the active band; soft lock for
     ENTRY_LOCK_MS so scroll can't immediately blow past it. */
  const entryFired = useRef(false)
  const entryUnlocked = useRef(false)
  const entryTimers = useRef<number[]>([])
  /* Per-phase morph lock. */
  const animationLockedPhase = useRef<Phase | null>(null)

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

  /* Entry trigger - fires once when the step's text-block crosses
     the active band. Sets phase to 'year' so the chart fades in
     IMMEDIATELY when the user lands on the step (no extra scroll
     needed). Soft lock for ENTRY_LOCK_MS so a fast wheel push
     can't morph straight to month/week before the user has even
     seen the 1-year shape. */
  useEffect(() => {
    if (reduced) {
      entryFired.current = true
      entryUnlocked.current = true
      setPhase('week')
      return
    }
    const blocks = document.querySelectorAll<HTMLElement>(
      '.product-step-text-block',
    )
    const block = blocks[stepIndex]
    if (!block) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !entryFired.current) {
          entryFired.current = true
          io.disconnect()
          setPhase('year')
          const t = window.setTimeout(() => {
            entryUnlocked.current = true
            maxProgressRef.current = Math.max(
              maxProgressRef.current,
              PHASE_BOUNDS.yearEnd - 0.001,
            )
          }, ENTRY_LOCK_MS)
          entryTimers.current.push(t)
        }
      },
      { threshold: 0, rootMargin: '-40% 0px -40% 0px' },
    )
    io.observe(block)
    return () => io.disconnect()
  }, [stepIndex, reduced])

  /* Monotonic scroll-driven phase. RAF polls the text-block.
     While the entry lock is active scroll moves but the phase
     stays at 'year'. */
  useEffect(() => {
    if (reduced) return
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
          if (pillOverride.current !== null) pillOverride.current = null
          if (entryFired.current && entryUnlocked.current) {
            if (progress > maxProgressRef.current) {
              maxProgressRef.current = progress
            }
            /* Same one-step + lock guard as Section 01. Locks make
               sure each morph completes before the next can start. */
            const computedPhase = phaseFromProgress(maxProgressRef.current)
            setPhase((curr) => {
              if (computedPhase === curr) return curr
              if (animationLockedPhase.current !== null) return curr
              const currIdx = PHASE_ORDER.indexOf(curr)
              const targetIdx = PHASE_ORDER.indexOf(computedPhase)
              if (targetIdx > currIdx + 1) {
                return PHASE_ORDER[currIdx + 1]
              }
              return computedPhase
            })
          }
        }
      }
      frameId = window.requestAnimationFrame(tick)
    }
    frameId = window.requestAnimationFrame(tick)
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [stepIndex, reduced])

  /* Clear entry timers on unmount. */
  useEffect(() => {
    return () => {
      entryTimers.current.forEach((t) => window.clearTimeout(t))
      entryTimers.current = []
    }
  }, [])

  /* Animation lock per phase. */
  useEffect(() => {
    const lockMs = ANIMATION_LOCK_MS[phase]
    if (lockMs && lockMs > 0) {
      animationLockedPhase.current = phase
      const t = window.setTimeout(() => {
        animationLockedPhase.current = null
      }, lockMs)
      return () => {
        window.clearTimeout(t)
        animationLockedPhase.current = null
      }
    }
    animationLockedPhase.current = null
    return undefined
  }, [phase])

  /* Pill click - snap to that phase. Scroll overwrites this on the
     next wheel event. */
  const onPillClick = (target: 'year' | 'month' | 'week') => {
    pillOverride.current = target
    setPhase(target)
  }

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

  /* Pill highlight - 'outro' = "last seen view is week", so we keep
     [1 Week] active during the fade. */
  const pillView: 'year' | 'month' | 'week' =
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
    phase !== 'pre' && phase !== 'outro' ? ticksFor(pillView) : []

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
                tickFormatter={(t: number) => formatTick(t, pillView)}
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

      {/* Tab pills at the bottom of the frame - snap to a phase.
          Scroll takes over again on the next wheel event. */}
      <div className="pablo-tab-pills">
        <button
          type="button"
          className={
            'pablo-tab-pill' + (pillView === 'year' ? ' is-active' : '')
          }
          onClick={() => onPillClick('year')}
        >
          1 Year
        </button>
        <button
          type="button"
          className={
            'pablo-tab-pill' + (pillView === 'month' ? ' is-active' : '')
          }
          onClick={() => onPillClick('month')}
        >
          1 Month
        </button>
        <button
          type="button"
          className={
            'pablo-tab-pill' + (pillView === 'week' ? ' is-active' : '')
          }
          onClick={() => onPillClick('week')}
        >
          1 Week
        </button>
      </div>
    </div>
  )
}
