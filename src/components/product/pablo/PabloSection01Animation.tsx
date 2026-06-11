import { useEffect, useRef, useState } from 'react'

/**
 * PABLO Section 01 ("Break down your bill") animation.
 *
 * AUTO-PLAY ON VIEW + click-through PILLS per Chris's June 2026
 * round 3. The previous scroll-scrubbed model locked the user
 * inside the section (300vh runway) which was wrong - he wants
 * users to be able to scroll past anytime, AND to be able to
 * replay the transition via a clearly clickable button.
 *
 * Mechanic:
 *   1. The step's text-block enters the viewport (IO threshold 0.4).
 *   2. Auto-play kicks off:
 *        view='inputs'   inputs (bill + load shape) slide up,
 *                        spring-bounce
 *        +1500ms         view='donut' - inputs swipe off left,
 *                        donut slides in from the right
 *        +900ms          segments cascade in clockwise, one per
 *                        220ms, all 6 visible at the end
 *   3. After auto-play settles, two pills are visible at the
 *      bottom of the frame:
 *        [YOUR BILL]   sets view='inputs'
 *        [BREAKDOWN]   sets view='donut'
 *      Clicking either replays the inputs<->donut transition. The
 *      first user click cancels any in-flight auto-play timers so
 *      we don't fight the user's input.
 *
 * The donut segments are pre-built and stay built once the cascade
 * has run - re-entering 'donut' after a pill click shows them all
 * at once (not a re-cascade). This matches the intent: the segment
 * pop is part of the FIRST viewing's story, the pills just toggle
 * which composition is on stage.
 *
 * prefers-reduced-motion jumps straight to the final donut+segments
 * state. Pills are still clickable in that case.
 */

const DONUT_DATA = [
  { name: 'Wholesale', value: 29, color: '#ECB01F' },
  { name: 'DUoS', value: 23, color: '#E84393' },
  { name: 'TNUoS', value: 20, color: '#9B59B6' },
  { name: 'Cost Gap', value: 14, color: '#DC2626' },
  { name: 'Levies', value: 9, color: '#27AE60' },
  { name: 'Other', value: 5, color: '#E67E22' },
] as const

/* SVG donut geometry. ViewBox 0..200 in both axes; donut centred at
   (100, 100) with inner radius 38 and outer radius 64 (= 38% and 64%
   of the half-viewBox). Labels sit at radius 86 (just outside outer)
   in the polar calc. */
const VIEWBOX = 200
const CENTER = VIEWBOX / 2
const INNER_R = 38
const OUTER_R = 64
const LABEL_R = 86 /* radius for label centres, % of half-viewBox */

/** Convert degrees-from-12-o'clock-clockwise to {x, y} on a circle of
 *  radius r centred at (CENTER, CENTER). */
function polar(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CENTER + r * Math.cos(rad),
    y: CENTER + r * Math.sin(rad),
  }
}

/** SVG path d for one donut wedge between startAngle and endAngle
 *  (both in degrees-clockwise from 12). */
function arcPath(startAngle: number, endAngle: number): string {
  const o1 = polar(startAngle, OUTER_R)
  const o2 = polar(endAngle, OUTER_R)
  const i2 = polar(endAngle, INNER_R)
  const i1 = polar(startAngle, INNER_R)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${o1.x} ${o1.y}`,
    `A ${OUTER_R} ${OUTER_R} 0 ${largeArc} 1 ${o2.x} ${o2.y}`,
    `L ${i2.x} ${i2.y}`,
    `A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${i1.x} ${i1.y}`,
    'Z',
  ].join(' ')
}

/* Pre-compute each segment's path + label position. Same data flow
   on every render so this lives outside the component. */
const SEGMENTS = (() => {
  let runningAngle = 0
  return DONUT_DATA.map((d) => {
    const startAngle = runningAngle
    const endAngle = runningAngle + d.value * 3.6
    const midAngle = (startAngle + endAngle) / 2
    runningAngle = endAngle
    const labelPos = polar(midAngle, LABEL_R)
    return {
      ...d,
      path: arcPath(startAngle, endAngle),
      /* Label position as percentage of viewBox so they scale with
         CSS, used as left/top % on the absolute-positioned span. */
      labelLeftPct: (labelPos.x / VIEWBOX) * 100,
      labelTopPct: (labelPos.y / VIEWBOX) * 100,
    }
  })
})()

type View = 'pre' | 'inputs' | 'donut'

/* Auto-play durations.
     INPUTS_HOLD_MS - how long the inputs sit on stage before the
                      transition to donut fires (so the user has
                      time to read the bill + load shape pair)
     DONUT_IN_MS    - how long the donut slide-in takes (matches
                      the CSS transition + 100ms delay), after
                      which the segment cascade can start
     SEGMENT_STAGGER_MS - delay between consecutive segment pops */
const INPUTS_HOLD_MS = 1500
const DONUT_IN_MS = 900
const SEGMENT_STAGGER_MS = 220

export function PabloSection01Animation({
  stepIndex,
}: {
  stepIndex: number
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<View>('pre')
  /* How many segments have popped in so far (0 -> 6). Segments use
     this as a count: segment i is .is-in if visibleSegments > i. */
  const [visibleSegments, setVisibleSegments] = useState(0)
  const [reduced, setReduced] = useState(false)

  /* Has the IO entered the viewport at least once? Auto-play only
     fires on the first entry; later viewport entries (or pill
     clicks before the IO fires) shouldn't re-trigger the cascade. */
  const autoPlayStarted = useRef(false)
  /* Has the user clicked a pill? Once true, we cancel any pending
     auto-play timers and let the user drive the view. */
  const userInteracted = useRef(false)
  /* Active timer ids so we can clear them on unmount or user click. */
  const timers = useRef<number[]>([])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* On enter viewport (via IO on the matching text-block), kick off
     the auto-play timer cascade: inputs -> hold -> donut -> segments. */
  useEffect(() => {
    if (reduced) {
      setView('donut')
      setVisibleSegments(DONUT_DATA.length)
      return
    }
    const blocks = document.querySelectorAll<HTMLElement>(
      '.product-step-text-block',
    )
    const block = blocks[stepIndex]
    if (!block) return

    const clearTimers = () => {
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current = []
    }

    const startAutoPlay = () => {
      autoPlayStarted.current = true
      setView('inputs')
      /* After the inputs have been on stage for INPUTS_HOLD_MS,
         swap to donut view. */
      const t1 = window.setTimeout(() => {
        if (userInteracted.current) return
        setView('donut')
        /* After the donut finishes its slide-in (DONUT_IN_MS), kick
           off the segment cascade. */
        const t2 = window.setTimeout(() => {
          if (userInteracted.current) return
          let i = 0
          const tickSegment = () => {
            if (userInteracted.current) return
            i += 1
            setVisibleSegments(i)
            if (i < DONUT_DATA.length) {
              const tNext = window.setTimeout(tickSegment, SEGMENT_STAGGER_MS)
              timers.current.push(tNext)
            }
          }
          tickSegment()
        }, DONUT_IN_MS)
        timers.current.push(t2)
      }, INPUTS_HOLD_MS)
      timers.current.push(t1)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !autoPlayStarted.current) {
          startAutoPlay()
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(block)

    return () => {
      io.disconnect()
      clearTimers()
    }
  }, [stepIndex, reduced])

  /* Pill click - user takes over. Cancel pending auto-play timers,
     jump to the requested view. If jumping to donut from a state
     where segments haven't all built yet, snap them all visible so
     the user sees the full breakdown. */
  const onPillClick = (target: 'inputs' | 'donut') => {
    userInteracted.current = true
    autoPlayStarted.current = true
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
    setView(target)
    if (target === 'donut') {
      setVisibleSegments(DONUT_DATA.length)
    }
  }

  /* Derived visibility - inputs visible when view==='inputs', swiping
     out when view==='donut'. Donut visible when view==='donut'. */
  const inputsVisible = view === 'inputs'
  const inputsSwipingOut = view === 'donut'
  const donutVisible = view === 'donut'

  return (
    <div ref={rootRef} className="pablo-s01">
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

      <div
        className={
          'pablo-s01-stage pablo-s01-stage--donut' +
          (donutVisible ? ' is-in' : '')
        }
        aria-hidden="true"
      >
        <div className="pablo-s01-donut-frame">
          <svg
            className="pablo-s01-donut-svg"
            viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {SEGMENTS.map((seg, i) => (
              <path
                key={seg.name}
                d={seg.path}
                fill={seg.color}
                stroke="#FFFFFF"
                strokeWidth={1.2}
                className={
                  'pablo-s01-donut-seg' +
                  (visibleSegments > i ? ' is-in' : '')
                }
              />
            ))}
          </svg>
          {/* Labels: one per segment, positioned via inline left/top % */}
          <div className="pablo-s01-donut-labels">
            {SEGMENTS.map((seg, i) => (
              <span
                key={seg.name}
                className={
                  'pablo-s01-donut-label' +
                  (visibleSegments > i ? ' is-in' : '')
                }
                style={{
                  left: `${seg.labelLeftPct}%`,
                  top: `${seg.labelTopPct}%`,
                  color: seg.color,
                }}
              >
                {seg.name} {seg.value}%
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab pills at the bottom of the frame - user can replay the
          transition any number of times after the auto-play settles. */}
      <div className="pablo-tab-pills">
        <button
          type="button"
          className={
            'pablo-tab-pill' + (view === 'inputs' ? ' is-active' : '')
          }
          onClick={() => onPillClick('inputs')}
        >
          Your bill
        </button>
        <button
          type="button"
          className={
            'pablo-tab-pill' + (view === 'donut' ? ' is-active' : '')
          }
          onClick={() => onPillClick('donut')}
        >
          Breakdown
        </button>
      </div>
    </div>
  )
}

/* ============================================================
   Inputs SVG - source SVG paths kept verbatim. ViewBox crops the
   1280x800 canvas to the bill + plus + load-shape region; the
   donut on the right of the source SVG is NOT shown here (the
   custom SVG donut above handles Phase B).
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

      <path
        className="ipt-coral-rule"
        d="M248.17,295.23v126.39c-2.45-1.12-4.95-2.04-7.55-2.76v-119.96c-.05-2.4-.97-2.76-3.11-2.86-.25-.05-1.38-.1-1.63-.1-8.42,0-16.02-.1-24.39-.1,0,38.98-.31,80.82-.46,122.46-2.45.56-4.8,1.28-7.09,2.19v-137.3c0-.31.05-.66.05-.97-.1-2.4-.97-3.47-3.06-3.62h-.77c-35.67,0-71.18,0-106.84.05,0,.15.36.31.36.46v8.01c0,5.26-4.95,9.59-10.26,9.59h-7.19c-.51,0-.15.36-.66.26,0,25.36,1.02,50.46,1.02,75.77v91.64c.1,2.09.92,2.5,2.45,2.5l88.42.15c-.36,2.4-.51,4.85-.51,7.35v1.43h-56.64c0,.82-.2,1.48-.2,2.25v1.73c.1,2.09,1.68,2.65,3.47,3.11.51.15,1.07.2,1.63.2h52.4c.46,2.96,1.12,5.87,1.99,8.67-19.29,0-38.62,0-57.91.05-4.24,0-8.01-3.78-8.01-9.29v-6.74h-28.67c-4.24.05-7.96-3.72-7.96-9.24.1-31.23.1-62.5.1-93.78,0-27.45.1-54.9.1-82.3l20.72-20.56h116.49c4.75,0,8.78,3.67,8.78,9.08v7.45h27.04c4.69,0,7.91,3.37,7.91,8.78Z"
      />
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
      <path
        className="ipt-coral"
        d="M155.84,364.05l-17.73,56.92c-.15.54-.66.89-1.2.89-.08,0-.13,0-.2-.03-.61-.08-1.07-.61-1.07-1.25v-42.55h-11.05c-.41,0-.79-.2-1.02-.54-.26-.33-.31-.77-.18-1.15,7.07-20.51,17.63-51.76,17.96-54.06v-.03c0-.71.56-1.22,1.28-1.22s1.28.61,1.28,1.33v40.03h10.74c.38,0,.77.18,1.02.51.23.33.31.74.18,1.15Z"
      />
      <path
        className="ipt-coral"
        d="M340.42,421.32v-22.22s23.21,0,23.21,0c1.51,0,2.74-1.23,2.74-2.74v-7.07c0-1.51-1.22-2.74-2.74-2.74h-23.21s0-22.22,0-22.22c0-1.51-1.22-2.74-2.74-2.74h-6.63c-1.51,0-2.74,1.23-2.74,2.74v22.22s-23.44,0-23.44,0c-1.51,0-2.74,1.23-2.74,2.74v7.07c0,1.51,1.22,2.74,2.74,2.74h23.44s0,22.22,0,22.22c0,1.51,1.23,2.74,2.74,2.74h6.63c1.51,0,2.74-1.23,2.74-2.74Z"
      />
      <g>
        <line className="ipt-grid" x1="449.05" y1="228.16" x2="449.05" y2="524.38" />
        <line className="ipt-grid" x1="521.08" y1="228.16" x2="521.08" y2="524.38" />
        <line className="ipt-grid" x1="593.12" y1="228.16" x2="593.12" y2="524.38" />
        <line className="ipt-grid" x1="665.16" y1="228.16" x2="665.16" y2="524.38" />
        <line className="ipt-grid" x1="737.2" y1="228.16" x2="737.2" y2="524.38" />
      </g>
      <path
        className="ipt-curve"
        d="M449.05,411.17c.33-1.67.67-3.33,1-3.33s.67,3.85,1,5.53c.33,1.68.67,4.54,1,4.54s.67-1.98,1-5.92c.33-3.95.67-10.79,1-19.87.33-9.08.67-25.93,1-34.61.33-8.68.67-13.17,1-17.45.33-4.28.67-4.47,1-8.24s.67-12.57,1-14.42c.33-1.84.67-1.82,1-2.76.33-.94.67-2.89,1-2.89s.67,12.7,1,13.58c.33.87.67.44,1,1.31.33.87.67,8.62,1,11.92.33,3.3.67,6.31,1,7.87.33,1.56.67,1.93,1,2.34.33.41.67.62,1,.62s.67-3.7,1-3.7.67,14.39,1,21.25c.33,6.87.67,14.55,1,19.94.33,5.39.67,7.07,1,12.42.33,5.35.67,19.67,1,19.67s.67-.32,1-.96c.33-.64.67-7.73,1-7.73s.67,1,1,1.33c.33.33.67.21,1,.64.33.43.67,7.63,1,7.63s.67-1.16,1-3.48c.33-2.32.67-15.87,1-25.3.33-9.43.67-23.73,1-31.3.33-7.57.67-10.51,1-14.14.33-3.64.67-4.95,1-7.68.33-2.73.67-6.02,1-8.69.33-2.67.67-5.71,1-7.36s.67-2.52,1-2.52.67,3.62,1,6c.33,2.38.67,5.87,1,8.27.33,2.4.67,3.95,1,6.15.33,2.2.67,7.03,1,7.03s.67-3.18,1-3.18.67,4.64,1,4.64.67-.3,1-.3.67,11.54,1,18.44.67,16.23,1,22.98c.33,6.76.67,12.1,1,17.55.33,5.45.67,15.13,1,15.13s.67-.2,1-.59c.33-.4.67-11.45,1-11.53.33-.08.67-.12,1-.12s.67,2.6,1,3.46c.33.86.67,1.7,1,1.7s.67-.56,1-1.68c.33-1.12.67-11.29,1-20.29.33-9,.67-25.82,1-33.72.33-7.9.67-9.82,1-13.68.33-3.85.67-5.8,1-9.45.33-3.66.67-12.49,1-12.49s.67.43,1,.67c.33.24.67.25,1,.77.33.51.67,4.22,1,6.1.33,1.87.67,3.35,1,5.13.33,1.78.67,5.55,1,5.55s.67-.91,1-.91.67.77,1,.77.67-4.3,1-4.3.67,1.27,1,3.8c.33,2.53.67,8.48,1,16.22.33,7.73.67,21.44,1,30.19.33,8.75.67,15.92,1,22.29.33,6.37.67,15.92,1,15.92s.67-3.8,1-5.83c.33-2.03.67-4.42,1-6.34.33-1.92.67-5.18,1-5.18s.67,1.44,1,2.67c.33,1.23.67,4.69,1,4.69s.67-2.34,1-7.03c.33-4.69.67-12.75,1-21.25.33-8.5.67-21.95,1-29.77.33-7.82.67-11.56,1-17.16.33-5.6.67-14.61,1-16.44.33-1.83.67-2.74,1-2.74s.67,1.37,1,3.16c.33,1.79.67,5.84,1,7.6.33,1.76.67,1,1,2.99.33,1.99.67,13.63,1,13.63s.67-1.23,1-1.23.67,9.87,1,9.87.67-.45,1-1.36c.33-.91.67-4.52,1-4.52s.67,1.54,1,4.62c.33,3.08.67,13.7,1,20.59.33,6.89.67,14.79,1,20.76.33,5.97.67,9.95,1,15.03.33,5.09.67,15.48,1,15.48s.67-2.04,1-3.85c.33-1.81.67-5.21,1-6.99.33-1.77.67-3.65,1-3.65s.67.25,1,.76c.33.51.67,7.75,1,7.75s.67-1.75,1-5.26c.33-3.51.67-17.88,1-25.1.33-7.22.67-11.76,1-18.24.33-6.48.67-18.66,1-20.64.33-1.97.67-2.18,1-2.96.33-.78.67-1.18,1-1.73.33-.55.67-.63,1-1.58.33-.95.67-4.1,1-4.1s.67,5.73,1,7.63c.33,1.9.67,3.78,1,3.78s.67-.89,1-.89.67,1.93,1,3.13c.33,1.21.67,4.12,1,4.12s.67-7.16,1-7.16.67,3.83,1,9.4c.33,5.57.67,17.46,1,24.02.33,6.56.67,9.26,1,15.35.33,6.09.67,16.39,1,21.2.33,4.81.67,7.65,1,7.65s.67-2.5,1-5.68c.33-3.18.67-13.4,1-13.4s.67.14,1,.42c.33.28.67.78,1,2.34.33,1.56.67,9.85,1,9.85s.67-1.06,1-3.18c.33-2.12.67-5.9,1-10.54.33-4.64.67-12.21,1-17.33.33-5.12.67-13.38,1-13.38s.67,3.16,1,3.16.67-.1,1-.3c.33-.2.67-1.76,1-3.01.33-1.26.67-4.52,1-4.52s.67,3.01,1,3.01.67-3.25,1-5.6c.33-2.35.67-7.06,1-8.49.33-1.43.67-2.15,1-2.15s.67.26,1,.79c.33.53.67,1.04,1,3.13.33,2.09.67,8.01,1,13.58.33,5.56.67,14.32,1,19.8.33,5.48.67,9.94,1,13.08.33,3.14.67,4.2,1,5.78.33,1.58.67,3.68,1,3.68s.67-.28,1-.84c.33-.56.67-21.18,1-21.18s.67,8.09,1,10.47c.33,2.38.67,2.02,1,3.8.33,1.78.67,6.11,1,6.89.33.77.67,1.16,1,1.16s.67-11.02,1-18.66c.33-7.64.67-19.97,1-27.18.33-7.20.67-15.29,1-16.05.33-.76.67-.38,1-1.14.33-.76.67-5.46,1-5.46s.67.05,1,.05.67-6.47,1-6.47.67.59,1,.59.67-1.97,1-1.97.67.07,1,.2c.33.13.67.79,1,.79s.67-4.96,1-4.96.67,4.76,1,4.76.67-.64,1-.64.67,10.75,1,16.44c.33,5.69.67,13.51,1,17.67.33,4.16.67,4.79,1,7.28.33,2.49.67,5.06,1,7.68.33,2.62.67,8.02,1,8.02s.67-4.25,1-4.25.67,1.55,1,2.71c.33,1.16.67,2.83,1,4.25s.67,4.27,1,4.27.67-.93,1-2.79c.33-1.86.67-16.44,1-26.41.33-9.97.67-24.18,1-33.42.33-9.24.67-14.73,1-22.02.33-7.29.67-16.44,1-21.70.33-5.26.67-9.85,1-9.85s.67,4.27,1,4.27.67-2.89,1-2.89.67.73,1,2.1c.33,1.37.67,4.19,1,6.12.33,1.93.67,3.95,1,5.46.33,1.51.67,3.41,1,3.58.33.16.67.08,1,.25.33.16.67.35,1,1.04.33.69.67,6.48,1,11.9.33,5.41.67,13.19,1,20.59.33,7.40.67,17.38,1,23.82.33,6.44.67,9.52,1,14.84.33,5.31.67,13.97,1,17.03.33,3.06.67,4.59,1,4.59s.67-1.52,1-2.17c.33-.65.67-1.73,1-1.73s.67.76,1,2.27c.33,1.51.67,7.53,1,7.53s.67-1.13,1-3.38c.33-2.25.67-21.90,1-31.67.33-9.77.67-20.23,1-26.93.33-6.70.67-8.15,1-13.26.33-5.10.67-12.28,1-17.35.33-5.08.67-10.15,1-13.11.33-2.96.67-4.64,1-4.64s.67,1.01,1,1.01.67-.62,1-.62.67,1.58,1,2.89c.33,1.31.67,4.99,1,4.99s.67-4.81,1-4.81.67,2.99,1,3.48c.33.49.67.25,1,.74.33.49.67,2.02,1,6.05.33,4.03.67,12.44,1,21.45.33,9.01.67,24.12,1,32.61.33,8.49.67,12.72,1,18.32.33,5.60.67,13.85,1,15.28.33,1.43.67,2.15,1,2.15s.67-7.01,1-7.01.67,1.44,1,2.79c.33,1.35.67,3.66,1,5.33.33,1.67.67,4.71,1,4.71s.67-.72,1-2.17c.33-1.45.67-21.32,1-31.52.33-10.21.67-21.90,1-29.72.33-7.82.67-11.87,1-17.21.33-5.34.67-9.76,1-14.84.33-5.07.67-15.60,1-15.60s.67,4.81,1,4.81.67-2.69,1-2.69.67.91,1,2.25c.33,1.33.67,3.54,1,5.75.33,2.21.67,7.50,1,7.50s.67-6.71,1-6.71.67.52,1,.52.67-.44,1-.44.67,5.64,1,11.06c.33,5.41.67,12.97,1,21.43.33,8.45.67,21.60,1,29.30.33,7.70.67,10.88,1,16.88s.67,19.16,1,19.16.67-3.32,1-4.71c.33-1.39.67-3.65,1-3.65s.67.22,1,.67c.33.44.67.81,1,2.12.33,1.31.67,5.73,1,5.73s.67-1.71,1-5.13c.33-3.42.67-17.75,1-27.77.33-10.02.67-23.13,1-32.36.33-9.24.67-15.84,1-23.06.33-7.22.67-18.28,1-20.24.33-1.96.67-2.94,1-2.94s.67,5.97,1,5.97.67-5.80,1-5.80.67.05,1,.15c.33.10.67,9.71,1,10.91.33,1.20.67.6,1,1.80.33,1.20.67,19.60,1,19.60s.67-8.11,1-9.33c.33-1.22.67-1.83,1-1.83s.67,6.95,1,12.89c.33,5.93.67,14.81,1,22.71.33,7.90.67,17.59,1,24.66.33,7.07.67,12.82,1,17.77.33,4.95.67,11.11,1,11.95.33.84.67,1.26,1,1.26s.67-11.13,1-11.13.67,4.35,1,4.35.67-.62,1-.62.67,5.36,1,5.36.67-2.35,1-7.06c.33-4.71.67-18.38,1-26.51.33-8.13.67-15.26,1-22.29.33-7.03.67-18.27,1-19.87s.67-.95,1-2.39c.33-1.44.67-4.54,1-6.25.33-1.70.67-3.97,1-3.97s.67,6,1,6,.67-1.31,1-1.31.67,9.70,1,9.70.67-2.14,1-3.23c.33-1.09.67-1.89,1-3.33.33-1.44.67-2.88,1-5.31.33-2.43.67-9.26,1-9.26s.67,14.41,1,22.56c.33,8.15.67,19.37,1,26.36.33,6.99.67,11.33,1,15.58.33,4.25.67,5.22,1,9.90.33,4.68.67,17.30,1,18.17.33.87.67,1.31,1,1.31s.67-10.39,1-10.39.67,1.32,1,2.05c.33.73.67.78,1,2.34.33,1.56.67,9.55,1,9.55"
      />
      <g>
        <line className="ipt-axis" x1="449.05" y1="228.16" x2="449.05" y2="524.38" />
        <polyline className="ipt-axis" points="444.37 524.38 449.05 524.38 748.08 524.38" fill="none" />
        <line className="ipt-axis" x1="444.37" y1="450.32" x2="449.05" y2="450.32" />
        <line className="ipt-axis" x1="444.37" y1="376.27" x2="449.05" y2="376.27" />
        <line className="ipt-axis" x1="444.37" y1="302.22" x2="449.05" y2="302.22" />
        <line className="ipt-axis" x1="444.37" y1="228.16" x2="449.05" y2="228.16" />
      </g>
      <text className="ipt-tick" x="431.1" y="526.86">0</text>
      <text className="ipt-tick" x="422.16" y="452.81">200</text>
      <text className="ipt-tick" x="422.18" y="378.76">400</text>
      <text className="ipt-tick" x="422.18" y="304.7">600</text>
      <text className="ipt-tick" x="422.77" y="230.65">800</text>
      <text className="ipt-tick" x="511.6" y="533.67">Mon</text>
      <text className="ipt-tick" x="585.07" y="533.67">Tue</text>
      <text className="ipt-tick" x="654.91" y="533.67">Wed</text>
      <text className="ipt-tick" x="728.63" y="533.67">Thu</text>
    </svg>
  )
}
