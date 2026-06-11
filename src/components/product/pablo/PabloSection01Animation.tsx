import { useEffect, useRef, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

/**
 * PABLO Section 01 ("Break down your bill") animation.
 *
 * Two-phase sequence per nza-pablo-section-01-animation-brief.md:
 *
 *   Phase A   inputs (bill icon + plus sign + load-shape mini chart)
 *              rise up together from below the frame, settle with a
 *              gentle overshoot. ~700ms.
 *   ~1500ms HOLD
 *   Phase B   inputs swipe left + fade out; donut chart slides in
 *              from the right (~100ms overlap with the swipe);
 *              Recharts handles its own clockwise sweep reveal of
 *              segments (~1.3s); labels around the donut fade in
 *              after the sweep.
 *
 * Plays ONCE per page load on viewport entry (IntersectionObserver).
 * Honours prefers-reduced-motion by jumping straight to the final
 * donut+labels state.
 *
 * The frame acts as a "screen-within-a-window" per Chris: an inner
 * clip wrapper (.product-steps-frame-clip) has overflow:hidden so
 * the inputs-from-below and donut-from-right entries are masked by
 * the frame's edges - they appear to emerge from inside the frame
 * rather than slide in from outside the page.
 */

/* Donut segment data from the brief. Order matters: starts at 12
   o'clock (Wholesale) and sweeps clockwise through each segment. */
const DONUT_DATA = [
  { name: 'Wholesale', value: 29, color: '#ECB01F' }, // yellow
  { name: 'DUoS', value: 23, color: '#E84393' }, // pink
  { name: 'TNUoS', value: 20, color: '#9B59B6' }, // purple
  { name: 'Cost Gap', value: 14, color: '#DC2626' }, // red
  { name: 'Levies', value: 9, color: '#27AE60' }, // green
  { name: 'Other', value: 5, color: '#E67E22' }, // orange
] as const

type Phase =
  | 'pre' /* before IO trip - nothing visible */
  | 'a_in' /* Phase A: inputs rising into place (0-700ms) */
  | 'a_hold' /* Phase A hold (700-2200ms) */
  | 'b_swipe' /* Phase B: inputs swiping out, donut starting to slide */
  | 'b_sweep' /* Donut visible + sweeping (3000-4300ms) */
  | 'b_labels' /* Labels fading in (4300-4900ms) */
  | 'done' /* Final state - donut + labels held */

/* Per-phase timeouts driving the cascade. Each entry: when we land
   in phase X, after Yms transition to phase Z. */
const PHASE_TIMINGS: Partial<Record<Phase, { next: Phase; afterMs: number }>> = {
  a_in: { next: 'a_hold', afterMs: 700 },
  a_hold: { next: 'b_swipe', afterMs: 1500 },
  /* Donut slide starts ~100ms after inputs begin swiping out
     (overlap for clean handoff). Inputs swipe takes 600ms; donut
     sweep begins after donut has slid in (700ms total = 100 delay
     + 600 slide -> donut visible at swipe+700). */
  b_swipe: { next: 'b_sweep', afterMs: 700 },
  /* Donut sweep is handled by Recharts internally (1300ms). Labels
     fade in once sweep completes. */
  b_sweep: { next: 'b_labels', afterMs: 1300 },
  b_labels: { next: 'done', afterMs: 600 },
}

export function PabloSection01Animation() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('pre')
  const [reduced, setReduced] = useState(false)

  /* Pick up the user's reduced-motion preference and react to live
     changes (rare, but supported). */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* Viewport-entry trigger. Once tripped, never re-arms (the brief
     says "plays once" - no replay if the user scrolls back up). */
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    if (phase !== 'pre') return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPhase(reduced ? 'done' : 'a_in')
            obs.disconnect()
            break
          }
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [phase, reduced])

  /* Cascade timer - each phase schedules its successor. */
  useEffect(() => {
    const timing = PHASE_TIMINGS[phase]
    if (!timing) return
    const t = window.setTimeout(() => setPhase(timing.next), timing.afterMs)
    return () => window.clearTimeout(t)
  }, [phase])

  /* Derive visual flags from the phase. */
  const inputsVisible = phase === 'a_in' || phase === 'a_hold'
  const inputsSwipingOut = phase === 'b_swipe'
  const donutVisible = phase === 'b_swipe' || phase === 'b_sweep' || phase === 'b_labels' || phase === 'done'
  const labelsVisible = phase === 'b_labels' || phase === 'done'

  return (
    <div ref={rootRef} className="pablo-s01">
      {/* PHASE A stage - inputs composition */}
      <div
        className={
          'pablo-s01-stage pablo-s01-stage--inputs' +
          (inputsVisible ? ' is-in' : '') +
          (inputsSwipingOut ? ' is-out' : '')
        }
        aria-hidden="true"
      >
        <InputsSvg />
      </div>

      {/* PHASE B stage - donut chart + labels */}
      <div
        className={
          'pablo-s01-stage pablo-s01-stage--donut' +
          (donutVisible ? ' is-in' : '')
        }
        aria-hidden="true"
      >
        <div className="pablo-s01-donut-frame">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={[...DONUT_DATA]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                startAngle={90}
                endAngle={-270}
                paddingAngle={1}
                stroke="#FFFFFF"
                strokeWidth={2}
                /* Sweep over 1.3s once the donut is visible. The
                   key change on donutVisible forces Recharts to
                   re-mount + replay its sweep when the stage flips
                   to visible. */
                isAnimationActive={donutVisible}
                animationDuration={1300}
                animationEasing="ease-out"
                key={donutVisible ? 'on' : 'off'}
              >
                {DONUT_DATA.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <DonutLabels visible={labelsVisible} />
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   Inputs SVG - bill + plus + load-shape mini chart, composed
   in a single viewBox so the whole thing animates as one block.
   Clean inline JSX rather than a verbatim extraction from the
   source SVG (which is an Illustrator export with 30+ cls-N
   classes); the brief's "extract or use" wording allows this.
   ============================================================ */
function InputsSvg() {
  return (
    <svg
      className="pablo-s01-inputs-svg"
      viewBox="0 0 700 320"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* BILL ICON - centred page outline with £ + lightning */}
      <g transform="translate(40 30)">
        {/* Page outline */}
        <rect
          x="0"
          y="0"
          width="180"
          height="240"
          rx="8"
          fill="#FFFFFF"
          stroke="#1F0F2E"
          strokeWidth="1.4"
        />
        {/* Header bar */}
        <rect x="14" y="18" width="100" height="6" rx="2" fill="#1F0F2E" opacity="0.6" />
        <rect x="14" y="32" width="64" height="4" rx="2" fill="#1F0F2E" opacity="0.35" />
        {/* Subtle horizontal "lines of text" */}
        <g stroke="#1F0F2E" opacity="0.18" strokeWidth="1">
          <line x1="14" y1="60" x2="166" y2="60" />
          <line x1="14" y1="72" x2="140" y2="72" />
          <line x1="14" y1="84" x2="160" y2="84" />
          <line x1="14" y1="96" x2="120" y2="96" />
        </g>
        {/* £ symbol in a coral circle */}
        <circle cx="56" cy="160" r="26" fill="#F75A55" />
        <text
          x="56"
          y="170"
          textAnchor="middle"
          fontFamily="Stolzl, system-ui, sans-serif"
          fontWeight="500"
          fontSize="28"
          fill="#FFFFFF"
        >
          £
        </text>
        {/* Lightning bolt next to £ - aubergine */}
        <path
          d="M118 134 L102 168 L114 168 L106 196 L138 156 L122 156 Z"
          fill="#1F0F2E"
        />
        {/* Bottom totals */}
        <rect x="14" y="208" width="80" height="4" rx="2" fill="#1F0F2E" opacity="0.35" />
        <rect x="14" y="220" width="60" height="4" rx="2" fill="#1F0F2E" opacity="0.25" />
      </g>

      {/* PLUS SIGN - centred between bill and load shape */}
      <g transform="translate(264 130)" stroke="#1F0F2E" strokeWidth="3" strokeLinecap="round">
        <line x1="0" y1="30" x2="60" y2="30" />
        <line x1="30" y1="0" x2="30" y2="60" />
      </g>

      {/* LOAD SHAPE MINI CHART - load curve over four days */}
      <g transform="translate(360 30)">
        {/* Frame */}
        <rect
          x="0"
          y="0"
          width="300"
          height="240"
          rx="8"
          fill="#FFFFFF"
          stroke="#1F0F2E"
          strokeWidth="1.4"
        />
        {/* Y-axis tick labels (0 / 200 / 400 / 600 / 800) */}
        <g
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fill="#1F0F2E"
          opacity="0.55"
          textAnchor="end"
        >
          <text x="34" y="50">800</text>
          <text x="34" y="90">600</text>
          <text x="34" y="130">400</text>
          <text x="34" y="170">200</text>
          <text x="34" y="210">0</text>
        </g>
        {/* Day separators (dashed vertical lines) */}
        <g stroke="#1F0F2E" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35">
          <line x1="100" y1="36" x2="100" y2="208" />
          <line x1="160" y1="36" x2="160" y2="208" />
          <line x1="220" y1="36" x2="220" y2="208" />
        </g>
        {/* X-axis baseline */}
        <line x1="40" y1="210" x2="284" y2="210" stroke="#1F0F2E" strokeWidth="1" />
        {/* Wavy load curve - hand-drawn-feeling cubic Bezier */}
        <path
          d="
            M 42 180
            C 60 110, 80 140, 100 110
            C 116 80, 130 130, 150 100
            C 168 80, 188 150, 200 120
            C 214 90, 234 140, 248 110
            C 264 80, 276 130, 284 100
          "
          fill="none"
          stroke="#F75A55"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Day labels (Mon / Tue / Wed / Thu) */}
        <g
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fill="#1F0F2E"
          opacity="0.7"
          textAnchor="middle"
        >
          <text x="70" y="226">Mon</text>
          <text x="130" y="226">Tue</text>
          <text x="190" y="226">Wed</text>
          <text x="252" y="226">Thu</text>
        </g>
      </g>
    </svg>
  )
}

/* ============================================================
   Donut labels - absolutely-positioned around the donut. Each
   label sits at the angular midpoint of its segment, offset to
   the OUTSIDE of the donut with a short connector line implied
   by the gap.
   ============================================================ */
function DonutLabels({ visible }: { visible: boolean }) {
  /* Compute midpoint angles. Recharts starts at 12 o'clock
     (angle 90 in its convention) and sweeps clockwise (negative
     end angle). We convert to standard math angles for our own
     label positioning - it's easier to reason about with
     0deg = 3 o'clock, sweeping counter-clockwise (CSS uses CW
     but we'll handle that in the calc). */
  let runningPct = 0
  const labels = DONUT_DATA.map((d) => {
    const midPct = runningPct + d.value / 2
    runningPct += d.value
    /* startAngle 90, sweeping clockwise. Mid angle in screen
       coords (0deg = up, clockwise positive): midPct * 3.6 degrees. */
    const angleDeg = midPct * 3.6
    /* Convert to standard math (0deg = right, ccw positive) for
       cos/sin: x = cos, y = -sin. Screen-up clockwise to math
       requires (90 - angleDeg) then sin/cos. */
    const radians = ((90 - angleDeg) * Math.PI) / 180
    /* Label radius - outside the 85% outer radius. Position values
       are percentage of container so they scale. */
    const r = 58 /* % of half-container */
    const x = 50 + r * Math.cos(radians)
    const y = 50 - r * Math.sin(radians)
    return { ...d, x, y, angleDeg }
  })

  return (
    <div
      className={
        'pablo-s01-donut-labels' + (visible ? ' is-in' : '')
      }
    >
      {labels.map((l, i) => (
        <span
          key={l.name}
          className="pablo-s01-donut-label"
          style={
            {
              left: `${l.x}%`,
              top: `${l.y}%`,
              color: l.color,
              transitionDelay: visible ? `${i * 80}ms` : '0ms',
            } as React.CSSProperties
          }
        >
          {l.name} {l.value}%
        </span>
      ))}
    </div>
  )
}
