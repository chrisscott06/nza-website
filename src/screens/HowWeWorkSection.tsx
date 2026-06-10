import { useEffect, useRef, useState } from 'react'
import { MaskReveal } from '../components/MaskReveal'
import {
  DecodeVisual,
  BuildVisual,
  PartnerVisual,
} from '../components/svg/HowWeWorkVisuals'

/**
 * "How we work" - scrollytelling section between client strip + products.
 *
 * Per Chris's revision (he flagged the previous big-square row as too
 * big and the cards repeating themselves):
 *   - Section is tall (~260vh) but the visible content is sticky-
 *     locked to the viewport during scroll
 *   - The user scrolls down to "see, read, see, read" through each
 *     phase one at a time
 *   - The three cards are smaller + cascade in slowly (1.1s each)
 *     as the user crosses each scroll threshold inside the section
 *   - Text intro stays pinned above the cards throughout
 *   - Final scroll past the last threshold releases the lock and the
 *     user continues to products
 *
 * Mobile (<1024): page-lock disabled, normal stacked layout, each
 * card reveals via its own IntersectionObserver as it enters viewport.
 *
 * Brief: docs/briefs/nza-landing-page-v2-brief.md (Change 2)
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
  const sectionRef = useRef<HTMLElement | null>(null)
  const [revealedCount, setRevealedCount] = useState(0)

  /* Scroll-driven reveal for desktop scrollytelling.
     Three thresholds within the section's scroll range trigger
     each card. Disabled on phone via a media-query check so the
     stacked mobile layout uses its own IntersectionObserver path
     (see effect below). */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const desktopQuery = window.matchMedia('(min-width: 1024px)')

    let rafPending = false
    function onScroll() {
      if (rafPending) return
      rafPending = true
      window.requestAnimationFrame(() => {
        rafPending = false
        if (!section) return
        if (!desktopQuery.matches) return // mobile uses observer path
        const rect = section.getBoundingClientRect()
        const usable = section.offsetHeight - window.innerHeight
        if (usable <= 0) return
        const scrolled = -rect.top
        const progress = Math.max(0, Math.min(1, scrolled / usable))
        // Thresholds: card 1 reveals at 8% scrolled, card 2 at 32%,
        // card 3 at 56%. Each card has ~25% scroll range to settle
        // before the next begins, giving the "see + read" pacing
        // Chris asked for.
        let target = 0
        if (progress >= 0.55) target = 3
        else if (progress >= 0.31) target = 2
        else if (progress >= 0.08) target = 1
        setRevealedCount((curr) => (curr === target ? curr : target))
      })
    }

    function onResize() {
      // Re-evaluate on resize / orientation change in case desktop
      // <-> mobile boundary is crossed.
      onScroll()
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  /* Mobile fallback - one IntersectionObserver per card so each
     reveals naturally as it scrolls into view (no sticky page-lock
     on phone). Only attaches when below the desktop breakpoint. */
  const mobileCardRefs = useRef<Array<HTMLElement | null>>([])
  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    if (desktopQuery.matches) return // desktop uses scroll path

    const observers: IntersectionObserver[] = []
    mobileCardRefs.current.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setRevealedCount((curr) => Math.max(curr, i + 1))
              obs.disconnect()
              break
            }
          }
        },
        { threshold: 0.35 },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <section
      ref={sectionRef}
      className="how-we-work"
      id="how-we-work"
      data-screen-label="How we work"
    >
      <div className="how-we-work-pin">
        <div className="frame how-we-work-pin-inner">
          <div className="how-we-work-intro">
            <MaskReveal as="p" className="how-we-work-micro" delay={0}>
              HOW WE WORK
            </MaskReveal>
            <MaskReveal as="h2" className="how-we-work-specialist" delay={120}>
              We are specialists in buildings, energy and climate. We cut through
              the complexity of decarbonisation - and build the tools your people
              need to act on it.
            </MaskReveal>
          </div>

          <p className="how-we-work-subhead">This is how we work.</p>

          <div className="how-we-work-cards">
            {PHASES.map((phase, i) => {
              const isRevealed = revealedCount >= i + 1
              return (
                <article
                  key={phase.id}
                  ref={(el) => {
                    mobileCardRefs.current[i] = el
                  }}
                  className={
                    'how-we-work-card-wrap' +
                    (isRevealed ? ' is-revealed' : '')
                  }
                >
                  <div
                    className={'how-we-work-card how-we-work-card--' + phase.id}
                    aria-hidden="true"
                  >
                    {VISUALS[phase.id]}
                  </div>
                  <p className="how-we-work-card-label">
                    {phase.number} · {phase.name.toUpperCase()}
                  </p>
                  <h3 className="how-we-work-card-name">{phase.name}</h3>
                  <p className="how-we-work-card-body">{phase.body}</p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
