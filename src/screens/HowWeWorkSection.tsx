import { useEffect, useRef, useState } from 'react'
import { MaskReveal } from '../components/MaskReveal'
import { useMediaQuery } from '../hooks/useMediaQuery'
import {
  DecodeVisual,
  BuildVisual,
  PartnerVisual,
} from '../components/svg/HowWeWorkVisuals'

/**
 * "How we work" - SCROLL-PINNED page per Chris's latest.
 *
 * The outer .how-we-work-page is tall (300vh on desktop) and the
 * inner .how-we-work-page-pin is position: sticky; top: 0 with
 * height 100vh, so as the user scrolls down through the section
 * the pin LOCKS the cream-half / navy-half layout to the viewport
 * for ~200vh of scroll. They scroll into the section, the animations
 * play out while the pin holds, then they keep scrolling to leave it.
 *
 *   TOP HALF (cream): two intro paragraphs in Stolzl Book navy.
 *     The three words "buildings", "energy", "climate" get a coral
 *     underline that draws L->R one at a time (.highlight-coral).
 *
 *   BOTTOM HALF (navy): three phase blocks (Decode / Build / Partner)
 *     in a row. Each block fades in as one atomic unit, staggered
 *     L->R. Each block's SVG visual then animates inside the block
 *     (DecodeVisual / BuildVisual / PartnerVisual).
 *
 * Mobile (<1024) drops the pin - the section becomes content-tall
 * and stacks vertically (cream zone with the paragraphs, hard cut
 * to navy zone with the three blocks stacked).
 *
 * Reveal trigger: a single IntersectionObserver fires when the
 * section TOP reaches the top ~20% of the viewport - this is the
 * moment the pin is about to engage, so animations start in sync
 * with the user actually scrolling INTO the locked view. Without
 * the rootMargin tweak, the old threshold:0.25 IO triggered when
 * the section was just barely in view (cream half at viewport
 * bottom) and most animations played out before the user could
 * see them. CSS then drives the per-block stagger via inline
 * --reveal-delay vars and the per-word --highlight-delay vars.
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
      {
        threshold: 0,
        /* Root rect shrunk to the top 20% of viewport. IO fires
           when the section's bounding rect intersects that strip -
           i.e., when section's TOP crosses y=20% of viewport,
           which is the moment the sticky pin is about to engage.
           Without this, the default-threshold IO fired when the
           section was just barely in view at the viewport bottom,
           which on a fresh page load meant animations had played
           out by the time Chris had scrolled enough to see them. */
        rootMargin: '0px 0px -80% 0px',
      },
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
      {/* PIN WRAPPER - position: sticky; top: 0; height: 100vh on
          desktop so the cream / navy split layout LOCKS to the
          viewport while the parent section (300vh tall) scrolls
          past underneath. Mobile drops sticky and just stacks. */}
      <div className="how-we-work-page-pin">
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
      </div>{/* end .how-we-work-page-pin */}
    </section>
  )
}
