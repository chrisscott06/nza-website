import { useEffect, useRef, useState } from 'react'

/**
 * Three-beat hero infographic: Decode → Build → Partner.
 *
 * A single SVG that evolves through three beats as one continuous
 * animation. Plays once when the component enters the viewport
 * (IntersectionObserver-triggered), then holds in its final state.
 * Not a loop.
 *
 *   Beat 1 — DECODE   (0.0s – 1.3s)
 *     24 dots scattered at deterministic-pseudo-random positions
 *     drift for ~0.6s, then converge into a single clean horizontal
 *     line at the SVG centre. "Decode — the unknown, made clear."
 *
 *   Beat 2 — BUILD    (1.3s – 2.6s)
 *     6 anchor points appear along the line in sequence (~80ms apart,
 *     left to right). The line is still there; it now has structure.
 *     "Build — the tool, made yours."
 *
 *   Beat 3 — PARTNER  (2.6s – 4.0s)
 *     From each anchor, a thin branch grows outward at a varied angle,
 *     ending in a small coral node. Edges draw first, nodes appear at
 *     the terminus. The original line stays visible as the spine.
 *     "Partner — acting on it, together."
 *
 *   Held state (4.0s+)  - all three labels visible together, network
 *   frozen. Optional subtle idle pulse on a random node every few
 *   seconds (left out for now to keep the SVG calm).
 *
 * Per brief: docs/briefs/landing-page-brief.md - "the same element
 * carries through all three beats - it never resets. It evolves."
 *
 * Animation driven entirely by CSS keyframes with per-element delays;
 * the only state this component manages is whether the master class
 * has been added to kick off the timeline. Respects
 * prefers-reduced-motion (snaps to final state).
 */

const VIEWBOX_W = 500
const VIEWBOX_H = 320
const LINE_Y = 160
const DOT_COUNT = 24
const ANCHOR_COUNT = 6

// Deterministic pseudo-random scatter positions for the 24 dots -
// hash-ish functions of the index so the scatter pattern looks
// natural but is stable across paints.
function scatterX(i: number) {
  return 25 + ((i * 47 + 13) % (VIEWBOX_W - 50))
}
function scatterY(i: number) {
  return 30 + ((i * 73 + 41) % (VIEWBOX_H - 60))
}
function lineX(i: number) {
  return ((i + 0.5) / DOT_COUNT) * VIEWBOX_W
}
function anchorX(i: number) {
  return ((i + 0.5) / ANCHOR_COUNT) * VIEWBOX_W
}

// Hand-tuned branch geometry per anchor - alternating up/down with
// varied angles and lengths so the final network reads as organic
// rather than symmetric.
const BRANCHES: Array<{ angleDeg: number; length: number }> = [
  { angleDeg: -55, length: 80 },
  { angleDeg: 50, length: 70 },
  { angleDeg: -68, length: 90 },
  { angleDeg: 58, length: 75 },
  { angleDeg: -45, length: 72 },
  { angleDeg: 62, length: 82 },
]

function branchEnd(i: number) {
  const ax = anchorX(i)
  const ay = LINE_Y
  const { angleDeg, length } = BRANCHES[i]
  const rad = (angleDeg * Math.PI) / 180
  return { tx: ax + Math.cos(rad) * length, ty: ay + Math.sin(rad) * length }
}

export function ThreeBeatInfographic() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)

  // Trigger once on intersection (default threshold 0.3 so the user
  // is actually looking at the hero, not just scrolled into the top
  // edge of it).
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPlaying(true)
            obs.disconnect()
            break
          }
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={'three-beat' + (playing ? ' is-playing' : '')}
      aria-label="Decode, Build, Partner — three-beat brand infographic"
    >
      <svg
        className="three-beat-svg"
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* SPINE - thin horizontal line drawn left-to-right at the
            tail-end of Beat 1 once the dots have converged. Sits
            behind the anchors so it reads as the structure they
            inherit. */}
        <line
          className="three-beat-spine"
          x1="0"
          y1={LINE_Y}
          x2={VIEWBOX_W}
          y2={LINE_Y}
        />

        {/* DOTS - Beat 1. Each is a <g> wrapper so transform-translate
            animates the scatter -> converge cleanly without fighting
            the circle's cx/cy attributes. */}
        {Array.from({ length: DOT_COUNT }, (_, i) => {
          const sx = scatterX(i)
          const sy = scatterY(i)
          const tx = lineX(i)
          return (
            <g
              key={`dot-${i}`}
              className="three-beat-dot"
              style={
                {
                  '--from-x': `${sx}px`,
                  '--from-y': `${sy}px`,
                  '--to-x': `${tx}px`,
                  '--to-y': `${LINE_Y}px`,
                } as React.CSSProperties
              }
            >
              <circle cx="0" cy="0" r={1 + (i % 3) * 0.4} />
            </g>
          )
        })}

        {/* BRANCHES - Beat 3. Drawn first (stroke-dashoffset 100% ->
            0%) so the line reaches out from the anchor and the node
            appears at the terminus. */}
        {Array.from({ length: ANCHOR_COUNT }, (_, i) => {
          const ax = anchorX(i)
          const { tx, ty } = branchEnd(i)
          return (
            <line
              key={`branch-${i}`}
              className="three-beat-branch"
              x1={ax}
              y1={LINE_Y}
              x2={tx}
              y2={ty}
              style={{ animationDelay: `${2600 + i * 100}ms` }}
            />
          )
        })}

        {/* ANCHORS - Beat 2. Appear in sequence left-to-right. */}
        {Array.from({ length: ANCHOR_COUNT }, (_, i) => (
          <circle
            key={`anchor-${i}`}
            className="three-beat-anchor"
            cx={anchorX(i)}
            cy={LINE_Y}
            r="3.5"
            style={{ animationDelay: `${1300 + i * 80}ms` }}
          />
        ))}

        {/* NODES - Beat 3. Small coral discs at each branch terminus.
            Appear ~120ms after their branch starts drawing so the
            node lands as the line completes. */}
        {Array.from({ length: ANCHOR_COUNT }, (_, i) => {
          const { tx, ty } = branchEnd(i)
          return (
            <circle
              key={`node-${i}`}
              className="three-beat-node"
              cx={tx}
              cy={ty}
              r="4"
              style={{ animationDelay: `${2700 + i * 100}ms` }}
            />
          )
        })}
      </svg>

      {/* LABELS - stacked below the SVG. Each fades in after its
          beat completes. */}
      <div className="three-beat-labels">
        <div className="three-beat-label" style={{ animationDelay: '900ms' }}>
          <span className="three-beat-label-dot" aria-hidden="true" />
          <span className="three-beat-label-name">Decode</span>
          <span className="three-beat-label-body"> — the unknown, made clear.</span>
        </div>
        <div className="three-beat-label" style={{ animationDelay: '2100ms' }}>
          <span className="three-beat-label-dot" aria-hidden="true" />
          <span className="three-beat-label-name">Build</span>
          <span className="three-beat-label-body"> — the tool, made yours.</span>
        </div>
        <div className="three-beat-label" style={{ animationDelay: '3400ms' }}>
          <span className="three-beat-label-dot" aria-hidden="true" />
          <span className="three-beat-label-name">Partner</span>
          <span className="three-beat-label-body"> — acting on it, together.</span>
        </div>
      </div>
    </div>
  )
}
