import { useEffect, useRef, useState } from 'react'
import { MaskReveal } from '../components/MaskReveal'
import {
  DecodeVisual,
  BuildVisual,
  PartnerVisual,
} from '../components/svg/HowWeWorkVisuals'

/**
 * "How we work" - TWO bands per Chris's latest revision:
 *
 *   1. CREAM intro band - just the specialist sentence, sits as a
 *      quiet continuation of the client logo strip.
 *   2. NAVY cards band - scrollytelling section ~260vh tall with a
 *      sticky pin and the three Decode/Build/Partner cards
 *      cascading in slowly as the user scrolls through the
 *      thresholds.
 *
 * The cream-navy boundary between the two bands is the hard colour
 * cut that gives the page its alternating rhythm (per Chris:
 *   navy hero -> cream specialists -> navy infographic -> cream
 *   products -> navy let's talk).
 *
 * Mobile (<1024): no page-lock; each card reveals via its own
 * IntersectionObserver as it enters viewport.
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
  /* Ref is on the NAVY cards band - that's the section the
     scrollytelling pin lives inside. */
  const cardsBandRef = useRef<HTMLElement | null>(null)
  const [revealedCount, setRevealedCount] = useState(0)

  /* Scroll-driven reveal for desktop scrollytelling. */
  useEffect(() => {
    const section = cardsBandRef.current
    if (!section) return

    const desktopQuery = window.matchMedia('(min-width: 1024px)')

    let rafPending = false
    function onScroll() {
      if (rafPending) return
      rafPending = true
      window.requestAnimationFrame(() => {
        rafPending = false
        if (!section) return
        if (!desktopQuery.matches) return
        const rect = section.getBoundingClientRect()
        const usable = section.offsetHeight - window.innerHeight
        if (usable <= 0) return
        const scrolled = -rect.top
        const progress = Math.max(0, Math.min(1, scrolled / usable))
        let target = 0
        if (progress >= 0.55) target = 3
        else if (progress >= 0.31) target = 2
        else if (progress >= 0.08) target = 1
        setRevealedCount((curr) => (curr === target ? curr : target))
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

  /* Mobile fallback - per-card IntersectionObserver. */
  const mobileCardRefs = useRef<Array<HTMLElement | null>>([])
  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    if (desktopQuery.matches) return

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
        </div>
      </section>

      {/* ===== NAVY cards band - scrollytelling ===== */}
      <section
        ref={cardsBandRef}
        className="how-we-work-cards-band"
        data-screen-label="How we work cards"
      >
        <div className="how-we-work-pin">
          <div className="frame how-we-work-pin-inner">
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
    </>
  )
}
