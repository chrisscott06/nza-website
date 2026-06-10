import { MaskReveal } from '../components/MaskReveal'
import {
  DecodeVisual,
  BuildVisual,
  PartnerVisual,
} from '../components/svg/HowWeWorkVisuals'

const VISUALS = {
  decode: <DecodeVisual />,
  build: <BuildVisual />,
  partner: <PartnerVisual />,
} as const

/**
 * "How we work" - cream section inserted between the client logo
 * strip and the products section per the v2 landing brief.
 *
 * Two-row composition:
 *   Row 1: section micro-label + specialist sentence (relocated from
 *          the hero per the brief's "hero simplification" change)
 *   Row 2: "This is how we work." sub-header + three navy cards in
 *          a horizontal row (Decode / Build / Partner). The cards
 *          carry SVG visualisations + phase copy.
 *
 * Chunk A scaffold - the three SVG cards land in chunk B.
 *
 * Brief: docs/briefs/nza-landing-page-v2-brief.md (Change 2)
 */

const PHASES: Array<{
  id: 'decode' | 'build' | 'partner'
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
  return (
    <section
      className="how-we-work canvas-paper"
      id="how-we-work"
      data-screen-label="How we work"
    >
      <div className="frame how-we-work-inner">
        {/* ===== ROW 1 - section intro ===== */}
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

        {/* ===== ROW 2 - dot-grid triptych ===== */}
        <div className="how-we-work-triptych">
          <MaskReveal as="p" className="how-we-work-subhead" delay={0}>
            This is how we work.
          </MaskReveal>

          <div className="how-we-work-cards">
            {PHASES.map((phase, i) => (
              <MaskReveal
                as="article"
                key={phase.id}
                className="how-we-work-card-wrap"
                delay={120 + i * 120}
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
              </MaskReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
