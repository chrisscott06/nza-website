import { useEffect, useRef, useState } from 'react'

/**
 * PABLO Section 05 ("Build the investment case") - 25-year payback.
 *
 * Per nza-pablo-sections-03-04-05-brief.md: embed the source SVG
 * (pablo_05-payback.svg) DIRECTLY into the component and animate
 * the visible elements via CSS. No Recharts chart library here -
 * the SVG is a real PABLO cumulative-cashflow export that already
 * has the right styling (blue line + filled area, pink "Payback
 * ~7.5yr" marker, 25 dot markers, axis labels, grid lines).
 *
 * Single-play animation on viewport entry. Timeline:
 *
 *   t=0      gridlines + £0 baseline are already in the DOM but the
 *            wrapper hasn't been told to start the animation yet;
 *            all the animated paths are at their initial state
 *            (line invisible via full stroke-dashoffset, area
 *            clipped to nothing, payback marker scaleY 0, dots
 *            opacity 0, label opacity 0).
 *   +0      .is-in gets added to the wrapper. CSS kicks off
 *            staggered animations:
 *              200ms - 2200ms  line draws (stroke-dashoffset 720 -> 0)
 *              200ms - 2200ms  area fills (clip-path inset right
 *                              edge animates from 100% to 0)
 *              750ms - 1050ms  pink dashed payback line scales in
 *                              (transform: scaleY from 0 to 1)
 *               750ms - 1050ms  payback label opacity 0 -> 1
 *              1500ms - 2200ms 25 dots fade in with ~28ms per-dot
 *                              stagger (per-circle animation-delay
 *                              set inline)
 *   +2200    final state held forever
 *
 * The exact stroke-dashoffset start value is the line's pathLength
 * which we measure once at mount via getTotalLength(); the CSS uses
 * a custom property --line-length the component injects so the
 * keyframes can refer to it.
 *
 * prefers-reduced-motion shows the final state with no animation.
 */

export function PabloSection05Animation({
  stepIndex,
}: {
  stepIndex: number
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
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

  /* Measure the line path's total length so the stroke-dashoffset
     animation can use the exact value. Falls back to 720 (rough
     measure of the chart's horizontal span) if the path ref isn't
     mounted yet. */
  useEffect(() => {
    if (!lineRef.current || !wrapperRef.current) return
    try {
      const len = lineRef.current.getTotalLength()
      wrapperRef.current.style.setProperty('--line-length', String(len))
    } catch {
      wrapperRef.current.style.setProperty('--line-length', '720')
    }
  }, [])

  /* IO entry trigger - single play. */
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

  /* Per-dot stagger - 25 dots, ~28ms each. The CSS keyframe is
     applied via a class on each circle; the animation-delay is the
     per-dot offset (kept inline so the keyframe stays clean). */
  const dotPositions = DOT_POSITIONS

  return (
    <div
      ref={wrapperRef}
      className={'pablo-s05' + (entered ? ' is-in' : '')}
    >
      {/* State label - top-right per the brief's universal rules. */}
      <div
        className={'pablo-s05-state-label' + (entered ? ' is-in' : '')}
        aria-hidden="true"
      >
        <span className="pablo-s05-state-dot" />
        <span className="pablo-s05-state-text">25-YEAR FINANCIAL CASE</span>
      </div>

      {/* Inline SVG - copied verbatim from
          public/assets/infographics/pablo_05-payback.svg with class
          additions on the animated elements (line, area, payback
          marker, label, dots) so CSS keyframes can target them. The
          grid lines, axis labels, baseline are unchanged. */}
      <svg
        className="pablo-s05-svg"
        viewBox="270 150 800 545"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <style>{`
          .pablo-s05-svg .ax-line { stroke: #666; fill: none; }
          .pablo-s05-svg .grid    { stroke: #e6e6e6; stroke-dasharray: 3 3; fill: none; }
          .pablo-s05-svg .zero    { stroke: #95a5a6; fill: none; }
          .pablo-s05-svg .lbl     { fill: #95a5a6; font-family: Stolzl-Light, Stolzl, sans-serif; font-size: 9px; font-weight: 300; }
          .pablo-s05-svg .pay-lbl { fill: #e84393; font-family: Stolzl-Regular, Stolzl, sans-serif; font-size: 10px; }
        `}</style>

        {/* Horizontal grid lines */}
        <g>
          <line className="grid" x1="334.81" y1="669.11" x2="1048.81" y2="669.11" />
          <line className="grid" x1="334.81" y1="542.11" x2="1048.81" y2="542.11" />
          <line className="grid" x1="334.81" y1="415.11" x2="1048.81" y2="415.11" />
          <line className="grid" x1="334.81" y1="288.11" x2="1048.81" y2="288.11" />
          <line className="grid" x1="334.81" y1="161.11" x2="1048.81" y2="161.11" />
        </g>

        {/* Vertical year grid lines */}
        <g>
          {YEAR_X.map((x) => (
            <line key={x} className="grid" x1={x} y1="161.11" x2={x} y2="669.11" />
          ))}
        </g>

        {/* Pink dashed PAYBACK marker line - scales in vertically. */}
        <g className="pablo-s05-payback">
          <line
            className="pablo-s05-payback-line"
            x1="557.9" y1="161.11" x2="557.9" y2="669.11"
            stroke="#e84393" strokeWidth="1.5" strokeDasharray="4 4"
            fill="none"
          />
          <text
            className="pay-lbl pablo-s05-payback-label"
            transform="translate(561.9 173.11)"
          >
            Payback ~7.5yr
          </text>
        </g>

        {/* Blue filled area - clipped from the right edge. */}
        <path
          className="pablo-s05-area"
          d="M334.81,659.45c9.92-4.94,19.83-9.88,29.75-14.88,9.92-5,19.83-10.05,29.75-15.14,9.92-5.09,19.83-10.22,29.75-15.39s19.83-10.39,29.75-15.64c9.92-5.25,19.83-10.52,29.75-15.86,9.92-5.33,19.83-10.71,29.75-16.13,9.92-5.42,19.83-10.87,29.75-16.37,9.92-5.5,19.83-11.04,29.75-16.61,9.92-5.58,19.83-12.28,29.75-16.85,9.92-4.57,19.83-5.9,29.75-10.55,9.92-4.64,19.83-11.69,29.75-17.31,9.92-5.62,19.83-10.69,29.75-16.39s19.83-11.8,29.75-17.76c9.92-5.96,19.83-15.12,29.75-17.98s19.83-1.43,29.75-4.3c9.92-2.87,19.83-12.24,29.75-18.42,9.92-6.17,19.83-12.39,29.75-18.63s19.83-12.53,29.75-18.84c9.92-6.32,19.83-12.67,29.75-19.05s19.83-12.8,29.75-19.26c9.92-6.45,19.83-12.94,29.75-19.46,9.92-6.52,19.83-13.08,29.75-19.66,9.92-6.59,19.83-13.21,29.75-19.86,9.92-6.65,19.83-13.35,29.75-20.06v282.71H334.81v117.68Z"
          fill="rgba(0, 174, 239, 0.15)"
        />

        {/* Blue cumulative cashflow line - draws via stroke-dashoffset. */}
        <path
          ref={lineRef}
          className="pablo-s05-line"
          d="M334.81,659.45c9.92-4.94,19.83-9.88,29.75-14.88,9.92-5,19.83-10.05,29.75-15.14,9.92-5.09,19.83-10.22,29.75-15.39s19.83-10.39,29.75-15.64c9.92-5.25,19.83-10.52,29.75-15.86,9.92-5.33,19.83-10.71,29.75-16.13,9.92-5.42,19.83-10.87,29.75-16.37,9.92-5.5,19.83-11.04,29.75-16.61,9.92-5.58,19.83-12.28,29.75-16.85,9.92-4.57,19.83-5.9,29.75-10.55,9.92-4.64,19.83-11.69,29.75-17.31,9.92-5.62,19.83-10.69,29.75-16.39s19.83-11.8,29.75-17.76c9.92-5.96,19.83-15.12,29.75-17.98s19.83-1.43,29.75-4.3c9.92-2.87,19.83-12.24,29.75-18.42,9.92-6.17,19.83-12.39,29.75-18.63s19.83-12.53,29.75-18.84c9.92-6.32,19.83-12.67,29.75-19.05s19.83-12.8,29.75-19.26c9.92-6.45,19.83-12.94,29.75-19.46,9.92-6.52,19.83-13.08,29.75-19.66,9.92-6.59,19.83-13.21,29.75-19.86,9.92-6.65,19.83-13.35,29.75-20.06"
          stroke="#00aeef" strokeWidth="2" fill="none"
        />

        {/* £0 baseline */}
        <line className="zero" x1="334.81" y1="542.11" x2="1048.81" y2="542.11" />

        {/* Axes */}
        <g>
          <line className="ax-line" x1="334.81" y1="669.11" x2="1048.81" y2="669.11" />
          <line className="ax-line" x1="334.81" y1="161.11" x2="334.81" y2="669.11" />
        </g>

        {/* 25 dot markers - fade in with staggered animation-delay. */}
        <g>
          {dotPositions.map((d, i) => (
            <circle
              key={i}
              className="pablo-s05-dot"
              cx={d.cx}
              cy={d.cy}
              r="4"
              fill="#fff"
              stroke="#00aeef"
              strokeWidth="2"
              style={{ animationDelay: `${1500 + i * 28}ms` }}
            />
          ))}
        </g>

        {/* Selected axis labels - keep it light, the SVG had 25 year
            labels which would crowd a small chart card. Show every
            5th year + the £ values. */}
        <g>
          {[
            { x: 323.59, label: '2026' },
            { x: 472.84, label: '2030' },
            { x: 621.08, label: '2035' },
            { x: 769.74, label: '2040' },
            { x: 918.53, label: '2045' },
            { x: 1037.28, label: '2050' },
          ].map((t) => (
            <text key={t.label} className="lbl" x={t.x} y="683.5">
              {t.label}
            </text>
          ))}
        </g>
        <g>
          <text className="lbl" x="294.41" y="672.31">-£550k</text>
          <text className="lbl" x="314.31" y="545.31">£0</text>
          <text className="lbl" x="298.14" y="418.31">£550k</text>
          <text className="lbl" x="305.19" y="291.31">£1.1M</text>
          <text className="lbl" x="302" y="164.31">£1.6M</text>
        </g>
      </svg>
    </div>
  )
}

/* Per-dot cx/cy from the source SVG. 25 dots, one per year from 2026
   to 2050. */
const DOT_POSITIONS: Array<{ cx: number; cy: number }> = [
  { cx: 334.81, cy: 659.9 },
  { cx: 364.56, cy: 645.01 },
  { cx: 394.31, cy: 629.86 },
  { cx: 424.06, cy: 614.46 },
  { cx: 453.81, cy: 598.81 },
  { cx: 483.56, cy: 582.94 },
  { cx: 513.31, cy: 566.79 },
  { cx: 543.06, cy: 550.4 },
  { cx: 572.81, cy: 533.78 },
  { cx: 602.56, cy: 516.92 },
  { cx: 632.31, cy: 506.36 },
  { cx: 662.06, cy: 489.04 },
  { cx: 691.81, cy: 472.64 },
  { cx: 721.56, cy: 454.86 },
  { cx: 751.31, cy: 436.86 },
  { cx: 781.06, cy: 432.55 },
  { cx: 810.81, cy: 414.12 },
  { cx: 840.56, cy: 395.47 },
  { cx: 870.31, cy: 376.61 },
  { cx: 900.06, cy: 357.54 },
  { cx: 929.81, cy: 338.26 },
  { cx: 959.56, cy: 318.78 },
  { cx: 989.31, cy: 299.1 },
  { cx: 1019.06, cy: 279.22 },
  { cx: 1048.81, cy: 259.15 },
]

/* Vertical year grid line x positions from the source SVG. */
const YEAR_X = [
  334.81, 364.56, 394.31, 424.06, 453.81, 483.56, 513.31, 543.06, 572.81,
  602.56, 632.31, 662.06, 691.81, 721.56, 751.31, 781.06, 810.81, 840.56,
  870.31, 900.06, 929.81, 959.56, 989.31, 1019.06, 1048.81,
]
