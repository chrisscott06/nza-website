import { useEffect, useRef, useState } from 'react'
import { MaskReveal } from '../components/MaskReveal'
import { useMediaQuery } from '../hooks/useMediaQuery'
import {
  DecodeVisual,
  BuildVisual,
  PartnerVisual,
} from '../components/svg/HowWeWorkVisuals'

/**
 * "How we work" - ONE page per Chris's latest. The section is a
 * single 100vh slot with a hard horizontal divide:
 *
 *   TOP HALF (cream): the two intro paragraphs. Both Stolzl Medium
 *     at the same size for consistency. They sit centred horizontally
 *     and aligned to the bottom of the cream half so they hover just
 *     above the divide line. They pop in via MaskReveal on stagger.
 *
 *   BOTTOM HALF (navy): three phase blocks (Decode / Build / Partner)
 *     in a row. Each block is one atomic unit - heading, body, visual -
 *     and fades in as a block, not piece by piece. The old coral
 *     "01 - DECODE" mono label is gone; the number is folded into the
 *     heading itself ("01 Decode") in big Stolzl, all white-on-navy.
 *
 * Mobile (<1024) ditches the 100vh split - the section just stacks
 * vertically (cream zone with the two paragraphs, hard cut to navy
 * zone with the three blocks stacked).
 *
 * Reveal: a single IntersectionObserver on the section trips
 * .is-revealed once the section is 25% in view; CSS then drives the
 * per-block stagger via inline --reveal-delay vars.
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

export function HowWeWorkSection() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const sectionRef = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)

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
      { threshold: 0.25 },
    )
    obs.observe(section)
    return () => obs.disconnect()
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
      {/* ===== CREAM TOP HALF - two intro paragraphs ===== */}
      <div className="how-we-work-page-half how-we-work-page-half--cream">
        <div className="how-we-work-page-intro">
          {/* Paragraph 1 slides in via MaskReveal (transform 0-900ms).
              After the slide settles, the three highlight words each
              get a coral-slab wipe in sequence (one at a time) -
              same effect as the "ADVISORY" treatment on the preloader.
              The slab grows L->R across the word; the white text is
              clip-path-revealed in sync so it only appears against
              the coral. Each word ends up Medium white on a coral
              highlight - a permanent mark, not a passing slab. */}
          <MaskReveal as="p" className="how-we-work-page-para" delay={0}>
            We are specialists in{' '}
            <span
              className="highlight-coral"
              style={{ '--highlight-delay': '950ms' } as React.CSSProperties}
            >
              buildings
            </span>
            ,{' '}
            <span
              className="highlight-coral"
              style={{ '--highlight-delay': '1300ms' } as React.CSSProperties}
            >
              energy
            </span>
            {' '}and{' '}
            <span
              className="highlight-coral"
              style={{ '--highlight-delay': '1650ms' } as React.CSSProperties}
            >
              climate
            </span>
            . We cut through the complexity of decarbonisation - and build
            the tools your people need to act on it.
          </MaskReveal>
          {/* Paragraph 2 waits for the three highlight wipes to
              finish (last one ends ~2150ms) before sliding in. */}
          <MaskReveal as="p" className="how-we-work-page-para" delay={2200}>
            Every engagement follows three phases - decode, build, partner.
          </MaskReveal>
        </div>
      </div>

      {/* ===== NAVY BOTTOM HALF - three phase blocks ===== */}
      <div className="how-we-work-page-half how-we-work-page-half--navy">
        <div
          className={
            'how-we-work-page-phases' +
            (isDesktop ? '' : ' how-we-work-page-phases--stack')
          }
        >
          {PHASES.map((phase, i) => (
            <article
              key={phase.id}
              className="how-we-work-phase-block"
              style={
                {
                  /* Per-block stagger - the cream-half intro now runs
                     a longer sequence (slide para 1, three coral
                     wipes, slide para 2), so the phase blocks wait
                     until para 2 is settled before they begin:
                       Decode  at 3300ms (150ms after para 2 done)
                       Build   at 3950ms (650ms after Decode)
                       Partner at 4600ms (650ms after Build)
                     800ms transition each - clear L-to-R cascade,
                     same as before, just shifted later. */
                  '--reveal-delay': `${3300 + i * 650}ms`,
                } as React.CSSProperties
              }
            >
              <h3 className="how-we-work-phase-heading">
                <span className="how-we-work-phase-number">
                  {phase.number}
                </span>{' '}
                <span className="how-we-work-phase-name">{phase.name}</span>
              </h3>
              <p className="how-we-work-phase-body">{phase.body}</p>
              <div className="how-we-work-phase-visual" aria-hidden="true">
                {VISUALS[phase.id]}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
