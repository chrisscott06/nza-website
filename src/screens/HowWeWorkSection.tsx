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

/* Scroll thresholds (as fraction of progress through the 300vh
   section) at which each phase block reveals. Tuned so the user
   sees block 1 just after the pin engages, then blocks 2 + 3 over
   the next stretch of scroll. Per Chris: "have them come up as part
   of the scroll" rather than fire on a timer the user can outrun. */
const BLOCK_REVEAL_THRESHOLDS = [0.30, 0.48, 0.66] as const

export function HowWeWorkSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  /* `revealed` still tracks the section-level IO trigger - paragraphs
     and underlines use it (their MaskReveal + .highlight-coral
     animations fire on a timeline once the section enters view, and
     Chris said "the animation on the text with the underlinings is
     good"). */
  const [revealed, setRevealed] = useState(false)
  /* The three phase blocks are now SCROLL-DRIVEN - each block flips
     to true as the user passes its threshold within the pinned
     section. They reveal IN STEP with the scroll instead of waiting
     on the old time-based --reveal-delay cascade, so the user can
     never scroll past them before they've shown. */
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

  /* Scroll listener for the per-block reveals. Runs from mount;
     RAF-throttled so we don't thrash on fast scrolls. Progress is
     measured against the section's full scrollable range (its height
     minus the viewport), so 0 = section's top at viewport top,
     1 = section's bottom at viewport bottom. */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    let rafPending = false
    const onScroll = () => {
      if (rafPending) return
      rafPending = true
      window.requestAnimationFrame(() => {
        rafPending = false
        const rect = section.getBoundingClientRect()
        const scrollRange = rect.height - window.innerHeight
        if (scrollRange <= 0) return
        const scrolled = -rect.top
        const progress = Math.max(0, Math.min(1, scrolled / scrollRange))
        setBlocksRevealed((curr) => {
          /* Monotonic: blocks only go false -> true. Once a block has
             revealed it STAYS revealed even if the user scrolls back
             up past its threshold - prevents the animation from
             playing in reverse and matches expected UX. */
          const next = BLOCK_REVEAL_THRESHOLDS.map(
            (t, i) => curr[i] || progress >= t,
          )
          if (curr[0] === next[0] && curr[1] === next[1] && curr[2] === next[2]) {
            return curr
          }
          return next
        })
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

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
          {/* ===== LEFT - intro paragraphs ===== */}
          <div className="how-we-work-page-left">
            <MaskReveal as="p" className="how-we-work-page-para" delay={0}>
              We are specialists in{' '}
              {/* Each highlight word is wrapped together with its
                  trailing punctuation in a white-space: nowrap group
                  so the comma after "buildings" and the period after
                  "climate" can never fall to a new line on their own
                  (Chris flagged the orphan comma after "buildings"). */}
              <span className="highlight-nobr">
                <span
                  className="highlight-coral"
                  style={{ '--highlight-delay': '950ms' } as React.CSSProperties}
                >
                  buildings
                </span>
                ,
              </span>{' '}
              <span
                className="highlight-coral"
                style={{ '--highlight-delay': '1300ms' } as React.CSSProperties}
              >
                energy
              </span>
              {' '}and{' '}
              <span className="highlight-nobr">
                <span
                  className="highlight-coral"
                  style={{ '--highlight-delay': '1650ms' } as React.CSSProperties}
                >
                  climate
                </span>
                .
              </span>{' '}
              We cut through the complexity of decarbonisation - and build
              the tools your people need to act on it.
            </MaskReveal>
            <MaskReveal as="p" className="how-we-work-page-para" delay={2200}>
              Every engagement follows three phases - decode, build, partner.
            </MaskReveal>
          </div>

          {/* ===== RIGHT - three phase blocks stacked vertically ===== */}
          <div className="how-we-work-page-right">
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
