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
                /* Shrunk from 55%/85% to 30%/48% per Chris ("it's too
                   big, so we can't see the annotations coming off it").
                   The smaller outerRadius leaves a generous margin
                   (~26% on each side) for the labels to sit OUTSIDE
                   the donut with their connector lines visible
                   without overflowing the frame. */
                innerRadius="30%"
                outerRadius="48%"
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
   Inputs SVG - uses the actual paths from
   public/assets/infographics/pablo_01-bill-breakdown.svg per Chris
   ("we have a load shape and an icon for a bell. That works fine.
   How come we're not using that?"). viewBox crops the source's
   1280x800 canvas to the bill + plus + load-shape region only
   (the donut on the right of the source SVG is rendered by Recharts
   in Phase B). All paths are coral (cls-19 / cls-25) and aubergine
   (cls-23) on the existing class system; embedded <style> block
   keeps the cls-* names so the markup matches the source 1:1.
   ============================================================ */
function InputsSvg() {
  return (
    <svg
      className="pablo-s01-inputs-svg"
      viewBox="60 210 720 340"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <style>{`
        .pablo-s01 .ipt-grid { fill: none; stroke: #e6e6e6; stroke-dasharray: 2.34 2.34; stroke-width: .78px; }
        .pablo-s01 .ipt-axis { fill: none; stroke: #666; stroke-width: .78px; }
        .pablo-s01 .ipt-curve { fill: none; stroke: #ed6359; stroke-miterlimit: 10; }
        .pablo-s01 .ipt-coral { fill: #ed6359; }
        .pablo-s01 .ipt-coral-rule { fill: #ed6359; fill-rule: evenodd; }
        .pablo-s01 .ipt-tick { fill: #95a5a6; font-family: Stolzl-Light, Stolzl, sans-serif; font-weight: 300; font-size: 9px; }
      `}</style>

      {/* BILL ICON outer - coral page outline shape */}
      <path
        className="ipt-coral-rule"
        d="M248.17,295.23v126.39c-2.45-1.12-4.95-2.04-7.55-2.76v-119.96c-.05-2.4-.97-2.76-3.11-2.86-.25-.05-1.38-.1-1.63-.1-8.42,0-16.02-.1-24.39-.1,0,38.98-.31,80.82-.46,122.46-2.45.56-4.8,1.28-7.09,2.19v-137.3c0-.31.05-.66.05-.97-.1-2.4-.97-3.47-3.06-3.62h-.77c-35.67,0-71.18,0-106.84.05,0,.15.36.31.36.46v8.01c0,5.26-4.95,9.59-10.26,9.59h-7.19c-.51,0-.15.36-.66.26,0,25.36,1.02,50.46,1.02,75.77v91.64c.1,2.09.92,2.5,2.45,2.5l88.42.15c-.36,2.4-.51,4.85-.51,7.35v1.43h-56.64c0,.82-.2,1.48-.2,2.25v1.73c.1,2.09,1.68,2.65,3.47,3.11.51.15,1.07.2,1.63.2h52.4c.46,2.96,1.12,5.87,1.99,8.67-19.29,0-38.62,0-57.91.05-4.24,0-8.01-3.78-8.01-9.29v-6.74h-28.67c-4.24.05-7.96-3.72-7.96-9.24.1-31.23.1-62.5.1-93.78,0-27.45.1-54.9.1-82.3l20.72-20.56h116.49c4.75,0,8.78,3.67,8.78,9.08v7.45h27.04c4.69,0,7.91,3.37,7.91,8.78Z"
      />
      {/* £ symbol pair (two paths from source) */}
      <g>
        <path
          className="ipt-coral"
          d="M202.82,465.27h11.43c-1.61-5.77-2.51-9.18-2.69-10.24-.33-1.71-.49-3.34-.49-4.87,0-4.03,1.56-7.51,4.7-10.44,3.13-2.93,7-4.4,11.61-4.4,3.01,0,5.59.64,7.74,1.92,2.15,1.28,3.92,3.13,5.31,5.55,1.38,2.42,2.24,5.69,2.57,9.81h-6.13c-.12-3.64-1.01-6.42-2.67-8.34-1.66-1.92-3.87-2.89-6.65-2.89-3.04,0-5.5.85-7.37,2.55-1.87,1.7-2.8,3.93-2.8,6.7,0,2.44.43,4.89,1.3,7.35l.31.81,2.02,6.49h14.5v5.82h-12.98c1.1,3.79,1.66,7.76,1.66,11.91,0,3.22-.33,6.04-.99,8.48,1.84,1.53,4.35,3.26,7.53,5.19,1.81,1.08,3.48,1.62,4.99,1.62,2.87,0,4.47-3.49,4.81-10.46h6.36c.03,3.52-.48,6.7-1.52,9.54-1.04,2.84-2.32,4.83-3.82,5.95-1.51,1.13-3.2,1.69-5.07,1.69-2.02,0-4.21-.53-6.56-1.58-3.26-1.44-6.23-3.32-8.92-5.64-2.5,4.81-6.06,7.22-10.69,7.22-2.89,0-5.18-.76-6.88-2.28-1.7-1.52-2.55-3.59-2.55-6.2,0-2.89.99-5.35,2.98-7.4,1.98-2.04,4.33-3.07,7.03-3.07,2.01,0,4.18.59,6.49,1.76.21-2.01.32-3.61.32-4.78,0-4.24-.67-8.22-2.02-11.95h-12.87v-5.82ZM215.67,494c-2.04-1.23-3.76-1.85-5.14-1.85-.99,0-1.82.33-2.48.99s-.99,1.49-.99,2.48.29,1.77.88,2.41c.59.65,1.3.97,2.14.97,2.25,0,4.12-1.67,5.59-5.01Z"
        />
        <path
          className="ipt-coral"
          d="M247.43,419.61c-2.45-1.12-4.95-2.04-7.55-2.76-5.05-1.48-10.41-2.25-15.92-2.25-4.69,0-9.29.56-13.67,1.68-2.45.56-4.8,1.28-7.09,2.19-19.44,7.45-33.83,25.21-36.48,46.53-.36,2.4-.51,4.85-.51,7.35v1.43c.1,2.5.31,4.95.66,7.3.46,2.96,1.12,5.87,1.99,8.67,7.4,23.37,29.29,40.31,55.1,40.31,31.89,0,57.71-25.82,57.71-57.71,0-23.52-14.08-43.78-34.24-52.76ZM223.96,522.88c-21.79,0-40.36-13.78-47.45-33.11-1.02-2.76-1.79-5.66-2.3-8.67-.41-2.4-.66-4.8-.71-7.3-.05-.46-.05-.97-.05-1.43,0-2.5.2-4.95.51-7.35,2.55-17.3,13.83-31.74,29.24-38.68,2.24-1.07,4.59-1.89,7.04-2.55,4.34-1.28,8.98-1.94,13.73-1.94,5.56,0,10.92.92,15.92,2.6,2.65.82,5.15,1.94,7.55,3.21,16.07,8.42,27.04,25.26,27.04,44.7,0,27.91-22.6,50.51-50.51,50.51Z"
        />
      </g>
      {/* Lightning bolt */}
      <path
        className="ipt-coral"
        d="M155.84,364.05l-17.73,56.92c-.15.54-.66.89-1.2.89-.08,0-.13,0-.2-.03-.61-.08-1.07-.61-1.07-1.25v-42.55h-11.05c-.41,0-.79-.2-1.02-.54-.26-.33-.31-.77-.18-1.15,7.07-20.51,17.63-51.76,17.96-54.06v-.03c0-.71.56-1.22,1.28-1.22s1.28.61,1.28,1.33v40.03h10.74c.38,0,.77.18,1.02.51.23.33.31.74.18,1.15Z"
      />
      {/* Plus sign */}
      <path
        className="ipt-coral"
        d="M340.42,421.32v-22.22s23.21,0,23.21,0c1.51,0,2.74-1.23,2.74-2.74v-7.07c0-1.51-1.22-2.74-2.74-2.74h-23.21s0-22.22,0-22.22c0-1.51-1.22-2.74-2.74-2.74h-6.63c-1.51,0-2.74,1.23-2.74,2.74v22.22s-23.44,0-23.44,0c-1.51,0-2.74,1.23-2.74,2.74v7.07c0,1.51,1.22,2.74,2.74,2.74h23.44s0,22.22,0,22.22c0,1.51,1.23,2.74,2.74,2.74h6.63c1.51,0,2.74-1.23,2.74-2.74Z"
      />
      {/* Load-shape grid - dashed vertical day separators */}
      <g>
        <line className="ipt-grid" x1="449.05" y1="228.16" x2="449.05" y2="524.38" />
        <line className="ipt-grid" x1="521.08" y1="228.16" x2="521.08" y2="524.38" />
        <line className="ipt-grid" x1="593.12" y1="228.16" x2="593.12" y2="524.38" />
        <line className="ipt-grid" x1="665.16" y1="228.16" x2="665.16" y2="524.38" />
        <line className="ipt-grid" x1="737.2" y1="228.16" x2="737.2" y2="524.38" />
      </g>
      {/* Load curve - the hand-traced half-hourly load shape from source */}
      <path
        className="ipt-curve"
        d="M449.05,411.17c.33-1.67.67-3.33,1-3.33s.67,3.85,1,5.53c.33,1.68.67,4.54,1,4.54s.67-1.98,1-5.92c.33-3.95.67-10.79,1-19.87.33-9.08.67-25.93,1-34.61.33-8.68.67-13.17,1-17.45.33-4.28.67-4.47,1-8.24s.67-12.57,1-14.42c.33-1.84.67-1.82,1-2.76.33-.94.67-2.89,1-2.89s.67,12.7,1,13.58c.33.87.67.44,1,1.31.33.87.67,8.62,1,11.92.33,3.3.67,6.31,1,7.87.33,1.56.67,1.93,1,2.34.33.41.67.62,1,.62s.67-3.7,1-3.7.67,14.39,1,21.25c.33,6.87.67,14.55,1,19.94.33,5.39.67,7.07,1,12.42.33,5.35.67,19.67,1,19.67s.67-.32,1-.96c.33-.64.67-7.73,1-7.73s.67,1,1,1.33c.33.33.67.21,1,.64.33.43.67,7.63,1,7.63s.67-1.16,1-3.48c.33-2.32.67-15.87,1-25.3.33-9.43.67-23.73,1-31.3.33-7.57.67-10.51,1-14.14.33-3.64.67-4.95,1-7.68.33-2.73.67-6.02,1-8.69.33-2.67.67-5.71,1-7.36s.67-2.52,1-2.52.67,3.62,1,6c.33,2.38.67,5.87,1,8.27.33,2.4.67,3.95,1,6.15.33,2.2.67,7.03,1,7.03s.67-3.18,1-3.18.67,4.64,1,4.64.67-.3,1-.3.67,11.54,1,18.44.67,16.23,1,22.98c.33,6.76.67,12.1,1,17.55.33,5.45.67,15.13,1,15.13s.67-.2,1-.59c.33-.4.67-11.45,1-11.53.33-.08.67-.12,1-.12s.67,2.6,1,3.46c.33.86.67,1.7,1,1.7s.67-.56,1-1.68c.33-1.12.67-11.29,1-20.29.33-9,.67-25.82,1-33.72.33-7.9.67-9.82,1-13.68.33-3.85.67-5.8,1-9.45.33-3.66.67-12.49,1-12.49s.67.43,1,.67c.33.24.67.25,1,.77.33.51.67,4.22,1,6.1.33,1.87.67,3.35,1,5.13.33,1.78.67,5.55,1,5.55s.67-.91,1-.91.67.77,1,.77.67-4.3,1-4.3.67,1.27,1,3.8c.33,2.53.67,8.48,1,16.22.33,7.73.67,21.44,1,30.19.33,8.75.67,15.92,1,22.29.33,6.37.67,15.92,1,15.92s.67-3.8,1-5.83c.33-2.03.67-4.42,1-6.34.33-1.92.67-5.18,1-5.18s.67,1.44,1,2.67c.33,1.23.67,4.69,1,4.69s.67-2.34,1-7.03c.33-4.69.67-12.75,1-21.25.33-8.5.67-21.95,1-29.77.33-7.82.67-11.56,1-17.16.33-5.6.67-14.61,1-16.44.33-1.83.67-2.74,1-2.74s.67,1.37,1,3.16c.33,1.79.67,5.84,1,7.6.33,1.76.67,1,1,2.99.33,1.99.67,13.63,1,13.63s.67-1.23,1-1.23.67,9.87,1,9.87.67-.45,1-1.36c.33-.91.67-4.52,1-4.52s.67,1.54,1,4.62c.33,3.08.67,13.7,1,20.59.33,6.89.67,14.79,1,20.76.33,5.97.67,9.95,1,15.03.33,5.09.67,15.48,1,15.48s.67-2.04,1-3.85c.33-1.81.67-5.21,1-6.99.33-1.77.67-3.65,1-3.65s.67.25,1,.76c.33.51.67,7.75,1,7.75s.67-1.75,1-5.26c.33-3.51.67-17.88,1-25.1.33-7.22.67-11.76,1-18.24.33-6.48.67-18.66,1-20.64.33-1.97.67-2.18,1-2.96.33-.78.67-1.18,1-1.73.33-.55.67-.63,1-1.58.33-.95.67-4.1,1-4.1s.67,5.73,1,7.63c.33,1.9.67,3.78,1,3.78s.67-.89,1-.89.67,1.93,1,3.13c.33,1.21.67,4.12,1,4.12s.67-7.16,1-7.16.67,3.83,1,9.4c.33,5.57.67,17.46,1,24.02.33,6.56.67,9.26,1,15.35.33,6.09.67,16.39,1,21.2.33,4.81.67,7.65,1,7.65s.67-2.5,1-5.68c.33-3.18.67-13.4,1-13.4s.67.14,1,.42c.33.28.67.78,1,2.34.33,1.56.67,9.85,1,9.85s.67-1.06,1-3.18c.33-2.12.67-5.9,1-10.54.33-4.64.67-12.21,1-17.33.33-5.12.67-13.38,1-13.38s.67,3.16,1,3.16.67-.1,1-.3c.33-.2.67-1.76,1-3.01.33-1.26.67-4.52,1-4.52s.67,3.01,1,3.01.67-3.25,1-5.6c.33-2.35.67-7.06,1-8.49.33-1.43.67-2.15,1-2.15s.67.26,1,.79c.33.53.67,1.04,1,3.13.33,2.09.67,8.01,1,13.58.33,5.56.67,14.32,1,19.8.33,5.48.67,9.94,1,13.08.33,3.14.67,4.2,1,5.78.33,1.58.67,3.68,1,3.68s.67-.28,1-.84c.33-.56.67-21.18,1-21.18s.67,8.09,1,10.47c.33,2.38.67,2.02,1,3.8.33,1.78.67,6.11,1,6.89.33.77.67,1.16,1,1.16s.67-11.02,1-18.66c.33-7.64.67-19.97,1-27.18.33-7.2.67-15.29,1-16.05.33-.76.67-.38,1-1.14.33-.76.67-5.46,1-5.46s.67.05,1,.05.67-6.47,1-6.47.67.59,1,.59.67-1.97,1-1.97.67.07,1,.2c.33.13.67.79,1,.79s.67-4.96,1-4.96.67,4.76,1,4.76.67-.64,1-.64.67,10.75,1,16.44c.33,5.69.67,13.51,1,17.67.33,4.16.67,4.79,1,7.28.33,2.49.67,5.06,1,7.68.33,2.62.67,8.02,1,8.02s.67-4.25,1-4.25.67,1.55,1,2.71c.33,1.16.67,2.83,1,4.25s.67,4.27,1,4.27.67-.93,1-2.79c.33-1.86.67-16.44,1-26.41.33-9.97.67-24.18,1-33.42.33-9.24.67-14.73,1-22.02.33-7.29.67-16.44,1-21.7.33-5.26.67-9.85,1-9.85s.67,4.27,1,4.27.67-2.89,1-2.89.67.73,1,2.1c.33,1.37.67,4.19,1,6.12.33,1.93.67,3.95,1,5.46.33,1.51.67,3.41,1,3.58.33.16.67.08,1,.25.33.16.67.35,1,1.04.33.69.67,6.48,1,11.9.33,5.41.67,13.19,1,20.59.33,7.4.67,17.38,1,23.82.33,6.44.67,9.52,1,14.84.33,5.31.67,13.97,1,17.03.33,3.06.67,4.59,1,4.59s.67-1.52,1-2.17c.33-.65.67-1.73,1-1.73s.67.76,1,2.27c.33,1.51.67,7.53,1,7.53s.67-1.13,1-3.38c.33-2.25.67-21.9,1-31.67.33-9.77.67-20.23,1-26.93.33-6.7.67-8.15,1-13.26.33-5.1.67-12.28,1-17.35.33-5.08.67-10.15,1-13.11.33-2.96.67-4.64,1-4.64s.67,1.01,1,1.01.67-.62,1-.62.67,1.58,1,2.89c.33,1.31.67,4.99,1,4.99s.67-4.81,1-4.81.67,2.99,1,3.48c.33.49.67.25,1,.74.33.49.67,2.02,1,6.05.33,4.03.67,12.44,1,21.45.33,9.01.67,24.12,1,32.61.33,8.49.67,12.72,1,18.32.33,5.6.67,13.85,1,15.28.33,1.43.67,2.15,1,2.15s.67-7.01,1-7.01.67,1.44,1,2.79c.33,1.35.67,3.66,1,5.33.33,1.67.67,4.71,1,4.71s.67-.72,1-2.17c.33-1.45.67-21.32,1-31.52.33-10.21.67-21.9,1-29.72.33-7.82.67-11.87,1-17.21.33-5.34.67-9.76,1-14.84.33-5.07.67-15.6,1-15.6s.67,4.81,1,4.81.67-2.69,1-2.69.67.91,1,2.25c.33,1.33.67,3.54,1,5.75.33,2.21.67,7.5,1,7.5s.67-6.71,1-6.71.67.52,1,.52.67-.44,1-.44.67,5.64,1,11.06c.33,5.41.67,12.97,1,21.43.33,8.45.67,21.6,1,29.3.33,7.7.67,10.88,1,16.88s.67,19.16,1,19.16.67-3.32,1-4.71c.33-1.39.67-3.65,1-3.65s.67.22,1,.67c.33.44.67.81,1,2.12.33,1.31.67,5.73,1,5.73s.67-1.71,1-5.13c.33-3.42.67-17.75,1-27.77.33-10.02.67-23.13,1-32.36.33-9.24.67-15.84,1-23.06.33-7.22.67-18.28,1-20.24.33-1.96.67-2.94,1-2.94s.67,5.97,1,5.97.67-5.8,1-5.8.67.05,1,.15c.33.1.67,9.71,1,10.91.33,1.2.67.6,1,1.8.33,1.2.67,19.6,1,19.6s.67-8.11,1-9.33c.33-1.22.67-1.83,1-1.83s.67,6.95,1,12.89c.33,5.93.67,14.81,1,22.71.33,7.9.67,17.59,1,24.66.33,7.07.67,12.82,1,17.77.33,4.95.67,11.11,1,11.95.33.84.67,1.26,1,1.26s.67-11.13,1-11.13.67,4.35,1,4.35.67-.62,1-.62.67,5.36,1,5.36.67-2.35,1-7.06c.33-4.71.67-18.38,1-26.51.33-8.13.67-15.26,1-22.29.33-7.03.67-18.27,1-19.87s.67-.95,1-2.39c.33-1.44.67-4.54,1-6.25.33-1.7.67-3.97,1-3.97s.67,6,1,6,.67-1.31,1-1.31.67,9.7,1,9.7.67-2.14,1-3.23c.33-1.09.67-1.89,1-3.33.33-1.44.67-2.88,1-5.31.33-2.43.67-9.26,1-9.26s.67,14.41,1,22.56c.33,8.15.67,19.37,1,26.36.33,6.99.67,11.33,1,15.58.33,4.25.67,5.22,1,9.9.33,4.68.67,17.3,1,18.17.33.87.67,1.31,1,1.31s.67-10.39,1-10.39.67,1.32,1,2.05c.33.73.67.78,1,2.34.33,1.56.67,9.55,1,9.55"
      />
      {/* Y-axis line + ticks */}
      <g>
        <line className="ipt-axis" x1="449.05" y1="228.16" x2="449.05" y2="524.38" />
        <polyline className="ipt-axis" points="444.37 524.38 449.05 524.38 748.08 524.38" fill="none" />
        <line className="ipt-axis" x1="444.37" y1="450.32" x2="449.05" y2="450.32" />
        <line className="ipt-axis" x1="444.37" y1="376.27" x2="449.05" y2="376.27" />
        <line className="ipt-axis" x1="444.37" y1="302.22" x2="449.05" y2="302.22" />
        <line className="ipt-axis" x1="444.37" y1="228.16" x2="449.05" y2="228.16" />
      </g>
      {/* Y-axis tick labels (0 / 200 / 400 / 600 / 800) */}
      <text className="ipt-tick" x="431.1" y="526.86">0</text>
      <text className="ipt-tick" x="422.16" y="452.81">200</text>
      <text className="ipt-tick" x="422.18" y="378.76">400</text>
      <text className="ipt-tick" x="422.18" y="304.7">600</text>
      <text className="ipt-tick" x="422.77" y="230.65">800</text>
      {/* Day labels */}
      <text className="ipt-tick" x="511.6" y="533.67">Mon</text>
      <text className="ipt-tick" x="585.07" y="533.67">Tue</text>
      <text className="ipt-tick" x="654.91" y="533.67">Wed</text>
      <text className="ipt-tick" x="728.63" y="533.67">Thu</text>
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
    /* Label radius - now ~42% from centre (was 58%) since the donut
       was shrunk from outerRadius 85% to 48% to leave room for the
       labels. With the smaller donut, labels at r=42 sit comfortably
       in the margin between the donut's outer edge and the frame's
       edge, with ~8% of frame width spare for label text bounds. */
    const r = 42 /* % of frame width / height */
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
