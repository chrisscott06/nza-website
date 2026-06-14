import { type ReactNode } from 'react'
import { MaskReveal } from '../MaskReveal'

/**
 * GoingFurtherSection - decodED's triptych section that sits between
 * the five "how it works" cards and the closing sign-off. Frames
 * Decoded as the free foundation and NZA as the partner that takes
 * it further.
 *
 * Currently only used by /decoded - the field is optional on the
 * product page config so PABLO + NZ:AI pass through unaffected.
 *
 * Structure (per manifestos brief Movement 3.3):
 *   - Micro-label
 *   - Headline
 *   - Intro paragraph
 *   - Three cards in a row (desktop), stacked vertically (phone)
 *   - CTA link beneath the cards (single-line link, not a button)
 *
 * Brief: docs/briefs/nza-manifestos-and-solutions-brief.md
 */

export interface GoingFurtherCard {
  /** Title of the card. e.g. "Estate data management". */
  title: string
  /** Body paragraph. ReactNode to support inline emphasis (e.g.
   *  the bold "PABLO" mention in Card 02). */
  body: ReactNode
}

export interface GoingFurtherSectionProps {
  microLabel: string
  headline: string | ReactNode
  intro: string | ReactNode
  cards: [GoingFurtherCard, GoingFurtherCard, GoingFurtherCard]
  ctaText: string
  ctaHref: string
}

export function GoingFurtherSection({
  microLabel,
  headline,
  intro,
  cards,
  ctaText,
  ctaHref,
}: GoingFurtherSectionProps) {
  return (
    <section
      className="going-further-section"
      data-screen-label="Going further with NZA"
    >
      <div className="going-further-inner">
        <MaskReveal as="p" className="going-further-micro" delay={0}>
          {microLabel}
        </MaskReveal>
        <MaskReveal as="h2" className="going-further-headline" delay={150}>
          {headline}
        </MaskReveal>
        <MaskReveal as="div" className="going-further-intro" delay={300}>
          {typeof intro === 'string' ? <p>{intro}</p> : intro}
        </MaskReveal>

        <div className="going-further-cards">
          {cards.map((card, i) => (
            <MaskReveal
              key={i}
              as="article"
              className="going-further-card"
              delay={450 + i * 150}
            >
              <p className="going-further-card-number">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="going-further-card-title">{card.title}</h3>
              <div className="going-further-card-body">{card.body}</div>
            </MaskReveal>
          ))}
        </div>

        <MaskReveal as="div" delay={900}>
          <a className="going-further-cta" href={ctaHref}>
            {ctaText}
            <span className="going-further-cta-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </MaskReveal>
      </div>
    </section>
  )
}
