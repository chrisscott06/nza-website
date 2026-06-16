import { useEffect, useRef, useState } from 'react'
import { MaskReveal } from '../components/MaskReveal'
import {
  DecodeVisual,
  BuildVisual,
  PartnerVisual,
} from '../components/svg/HowWeWorkVisuals'

/**
 * "How we work" - HOT CORAL SCROLL-PINNED page per Chris's latest.
 *
 * Whole section sits on a saturated coral ground - "very clearly
 * different" from the navy hero above and the cream products section
 * below. The outer .how-we-work-page is 300vh tall with a sticky
 * inner pin so the user scrolls INTO the section, animations play
 * out, then they keep scrolling to leave it.
 *
 * Layout (Chris's restructure): two-column grid inside the pin.
 *
 *   LEFT  intro paragraphs - the specialist sentence with three
 *         underlined words ("buildings", "energy", "climate"), then
 *         the "Every engagement follows three phases" tagline. All
 *         white text on coral; underlines white.
 *
 *   RIGHT three phase blocks STACKED VERTICALLY (1 -> 2 -> 3). Each
 *         block is heading + body + a small (60px) SVG visual to the
 *         right of the text. Smaller than the old large square
 *         visuals - per Chris "the icons don't need to be so huge."
 *
 * Curved top edge (Impilo-style transition): the section gets a 32px
 * border-radius on its top corners. When the user scrolls down from
 * the navy hero, the coral section rises up with a soft curve before
 * the pin engages, then the curve scrolls past as the pinned layout
 * locks to the viewport.
 *
 * Mobile (<1024) drops the pin and the 2-column grid - the section
 * becomes content-tall with paragraphs at the top and phase blocks
 * stacked vertically below.
 *
 * Reveal trigger: a single IntersectionObserver fires when the
 * section TOP crosses the top 20% of the viewport (rootMargin
 * '0px 0px -80% 0px'). CSS handles the per-paragraph + per-phase
 * stagger via inline --reveal-delay vars.
 */

const VISUALS = {
  decode: <DecodeVisual />,
  build: <BuildVisual />,
  partner: <PartnerVisual />,
} as const

type PhaseId = 'decode' | 'build' | 'partner'

const PHASES: Array<{
  id: PhaseId
  number: string
  name: string
  body: string
}> = [
  {
    id: 'decode',
    number: '01',
    name: 'Decode',
    body:
      'Embed with your team. Uncover the data, the workflows, the truth of how your organisation runs.',
  },
  {
    id: 'build',
    number: '02',
    name: 'Build',
    body:
      'Use that data to create bespoke tools that help your people act.',
  },
  {
    id: 'partner',
    number: '03',
    name: 'Partner',
    body:
      'Stay alongside you as the work evolves.',
  },
]

/* Timed cascade. MaskReveal's CSS transition is 900ms transform +
   700ms opacity, so each MaskReveal "settles" ~900ms after its
   delay fires. Per Chris's June 2026 pacing ask ("just want it all
   to appear as if you didn't speak there, which you'd read it -
   nice order rather than a big gap between the two"), the reveal
   chain is tight:
     Sentence 1   delay   0ms,  settles ~900ms
     Sentence 2   delay 1300ms, settles ~2200ms      (~400ms gap)
     Tagline      delay 2500ms                       (right side opens)
     Phase 1      delay 3100ms
     Phase 2      delay 3700ms
     Phase 3      delay 4300ms
   Total to last phase: ~4.3s, ~5.2s including settle. */
const BLOCK_REVEAL_DELAYS_MS = [3100, 3700, 4300] as const

export function HowWeWorkSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  /* `revealed` tracks the section-level IO trigger - paragraphs +
     underlines + the timed phase cascade all key off this. */
  const [revealed, setRevealed] = useState(false)
  /* Each block flips to true on its own setTimeout once the section
     has been revealed - timed cascade replaces the previous
     scroll-driven thresholds. */
  const [blocksRevealed, setBlocksRevealed] = useState<boolean[]>([false, false, false])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            obs.disconnect()
            break
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -80% 0px' },
    )
    obs.observe(section)
    return () => obs.disconnect()
  }, [])

  /* Timed phase cascade. Fires once when the section is first
     revealed - each block flips to .is-revealed at its own offset.
     Phases are spaced 700ms apart so each gets its own moment
     before the next one slides in. */
  useEffect(() => {
    if (!revealed) return
    const timers = BLOCK_REVEAL_DELAYS_MS.map((delay, i) =>
      window.setTimeout(() => {
        setBlocksRevealed((curr) => {
          if (curr[i]) return curr
          const next = curr.slice()
          next[i] = true
          return next
        })
      }, delay),
    )
    return () => {
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [revealed])

  return (
    <section
      ref={sectionRef}
      className={
        'how-we-work-page' + (revealed ? ' is-revealed' : '')
      }
      id="how-we-work"
      data-screen-label="How we work"
    >
      <div className="how-we-work-page-pin">
        <div className="how-we-work-page-grid">
          {/* ===== LEFT - intro paragraphs =====
              Split into TWO sentences per Chris's June 2026 ask -
              "could we have the sentences appear one at a time" -
              so sentence 1 (the specialist statement) reveals first
              with its three underline animations, then sentence 2
              follows with its own MaskReveal a beat later. */}
          <div className="how-we-work-page-left">
            <MaskReveal as="p" className="how-we-work-page-para" delay={0}>
              We are specialists in{' '}
              {/* Each highlight word + its trailing punctuation sit in
                  a white-space: nowrap group so the comma after
                  "buildings" and the period after "climate" can never
                  fall to a new line on their own. The highlight-coral
                  words render in Stolzl 600 (bold) per Chris's June
                  2026 ask - the per-word underline draw animation that
                  used to live on these spans is gone. */}
              <span className="highlight-nobr">
                <span className="highlight-coral">buildings</span>,
              </span>{' '}
              <span className="highlight-coral">energy</span>
              {' '}and{' '}
              <span className="highlight-nobr">
                <span className="highlight-coral">climate</span>.
              </span>
            </MaskReveal>
            <MaskReveal
              as="p"
              className="how-we-work-page-para how-we-work-page-para--two"
              delay={1300}
            >
              We cut through the complexity of decarbonisation - and build
              the tools your people need to act on it.
            </MaskReveal>
          </div>

          {/* ===== RIGHT - small intro line + three phase blocks ===== */}
          <div className="how-we-work-page-right">
            {/* Tagline moved out of the left column per Chris - small
                body-sized line above the three blocks so it just frames
                the infographic. Trimmed from "Every engagement follows
                three phases - decode, build, partner." to the shorter
                "Every engagement follows three phases." */}
            <MaskReveal
              as="p"
              className="how-we-work-page-phases-intro"
              delay={2500}
            >
              Every engagement follows three phases.
            </MaskReveal>
            {PHASES.map((phase, i) => (
              <article
                key={phase.id}
                className={
                  'how-we-work-phase-block' +
                  (blocksRevealed[i] ? ' is-revealed' : '')
                }
              >
                <div className="how-we-work-phase-text">
                  <h3 className="how-we-work-phase-heading">
                    <span className="how-we-work-phase-number">
                      {phase.number}
                    </span>{' '}
                    <span className="how-we-work-phase-name">{phase.name}</span>
                  </h3>
                  <p className="how-we-work-phase-body">{phase.body}</p>
                </div>
                <div className="how-we-work-phase-visual" aria-hidden="true">
                  {VISUALS[phase.id]}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
