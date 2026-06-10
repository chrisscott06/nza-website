import { useEffect, useRef, useState } from 'react'
import { MaskReveal } from '../components/MaskReveal'
import { useMediaQuery } from '../hooks/useMediaQuery'
import {
  DecodeVisual,
  BuildVisual,
  PartnerVisual,
} from '../components/svg/HowWeWorkVisuals'

/**
 * "How we work" - TWO bands per Chris's latest revision:
 *
 *   1. CREAM intro band - the specialist sentence + a follow-up
 *      "Every engagement follows three phases" tagline. Taller now
 *      so the white reads as a deliberate breather, not a margin.
 *   2. SPLIT cards band - exactly one viewport tall (locked). Top
 *      half cream, bottom half navy, hard horizontal divide at 50%.
 *      Per phase: number + name + body sit in the cream half (navy
 *      text), the SVG visual sits in the navy half (cream-on-navy).
 *      Each "column" reads as one phase, the divide line is the
 *      thing that gives the section its visual identity.
 *
 * Mobile (<1024): the split doesn't work in a narrow column - the
 * cards stack vertically on solid navy, same single-card layout
 * the old code used.
 *
 * Reveal: IntersectionObserver fires once when the section enters
 * viewport; CSS handles the per-column stagger via nth-child delays.
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
  const cardsBandRef = useRef<HTMLElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  /* Single IntersectionObserver on the cards band. When 25% of the
     section enters viewport we fire the reveal once - CSS handles
     the per-column stagger from there. */
  useEffect(() => {
    const section = cardsBandRef.current
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
    <>
      {/* ===== CREAM intro band ===== */}
      <section
        className="how-we-work-intro-band"
        id="how-we-work"
        data-screen-label="How we work"
      >
        <div className="frame how-we-work-intro-frame">
          <MaskReveal as="h2" className="how-we-work-specialist" delay={0}>
            We are specialists in buildings, energy and climate. We cut through
            the complexity of decarbonisation - and build the tools your people
            need to act on it.
          </MaskReveal>
          <MaskReveal as="p" className="how-we-work-tagline" delay={260}>
            Every engagement follows three phases - decode, build, partner.
          </MaskReveal>
        </div>
      </section>

      {/* ===== SPLIT cards band - top half cream, bottom half navy ===== */}
      <section
        ref={cardsBandRef}
        className={
          'how-we-work-cards-band' +
          (revealed ? ' is-revealed' : '')
        }
        data-screen-label="How we work cards"
      >
        {isDesktop ? (
          <>
            {/* CREAM HALF - text blocks (number / name / body) sit at
                the bottom of this half so they sit just above the
                divide line. */}
            <div className="how-we-work-half how-we-work-half--top">
              <div className="how-we-work-half-grid">
                {PHASES.map((phase, i) => (
                  <div
                    key={phase.id}
                    className="how-we-work-text-block"
                    style={{ '--reveal-delay': `${i * 220}ms` } as React.CSSProperties}
                  >
                    <p className="how-we-work-card-label">
                      {phase.number} - {phase.name.toUpperCase()}
                    </p>
                    <h3 className="how-we-work-card-name">{phase.name}</h3>
                    <p className="how-we-work-card-body">{phase.body}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* NAVY HALF - SVG visuals sit at the top of this half so
                they sit just below the divide line. Each visual lines
                up with its text block in the cream half above. */}
            <div className="how-we-work-half how-we-work-half--bot">
              <div className="how-we-work-half-grid">
                {PHASES.map((phase, i) => (
                  <div
                    key={phase.id}
                    className="how-we-work-visual-block"
                    style={{ '--reveal-delay': `${i * 220}ms` } as React.CSSProperties}
                  >
                    <div className="how-we-work-card" aria-hidden="true">
                      {VISUALS[phase.id]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // ===== MOBILE - simple stacked layout, solid navy bg =====
          <div className="how-we-work-mobile-stack">
            {PHASES.map((phase, i) => (
              <article
                key={phase.id}
                className="how-we-work-card-wrap-mobile"
                style={{ '--reveal-delay': `${i * 220}ms` } as React.CSSProperties}
              >
                <div className="how-we-work-card" aria-hidden="true">
                  {VISUALS[phase.id]}
                </div>
                <p className="how-we-work-card-label">
                  {phase.number} - {phase.name.toUpperCase()}
                </p>
                <h3 className="how-we-work-card-name">{phase.name}</h3>
                <p className="how-we-work-card-body">{phase.body}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
