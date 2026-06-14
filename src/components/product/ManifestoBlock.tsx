import { type ReactNode } from 'react'

/**
 * ManifestoBlock - full-viewport "why" takeover that sits between the
 * hero and the "Let's show you" section on each of the three product
 * pages (PABLO, decodED, NZ:AI).
 *
 * Anatomy mirrors the home page's coral "We are experts in buildings,
 * energy, and climate" block (`HowWeWorkSection` in
 * `src/screens/HowWeWorkSection.tsx`) - full-bleed saturated accent
 * colour, curved top corners, centred content. Code is NOT shared with
 * HowWeWorkSection per the architecture decision (HowWeWorkSection has
 * three phase blocks + 300vh scroll choreography that aren't needed
 * here; ManifestoBlock is a simpler sibling).
 *
 * This is Chunk 2 of the manifestos brief: STATIC SCAFFOLD ONLY.
 * No animation, no parallax, no scroll prompt, no colour transition
 * yet. Those land in Chunk 4 once Chris signs off the anatomy.
 *
 * Brief: docs/briefs/nza-manifestos-and-solutions-brief.md (Movement 2)
 *
 * Replaces the old `product-transition` section that previously sat in
 * the same slot. PABLO / decodED / NZ:AI configs no longer carry a
 * `transition` field - the manifesto is the new, much bigger version
 * of that "why" beat.
 */

export type ManifestoAccent = 'pablo' | 'decoded' | 'nzai'

export interface ManifestoBlockProps {
  /** Eyebrow above the headline. e.g. "WHY PABLO". Mono uppercase. */
  microLabel: string
  /** Display headline. Supports `<em>` for italic-coral emphasis. */
  headline: string | ReactNode
  /** Body paragraph(s). string for simple cases; ReactNode for cases
   *  that need inline JSX (e.g. decodED's gov.uk hyperlink + tooltip
   *  on "climate action plan"). */
  body: string | ReactNode
  /** Small link beneath the body. e.g. "Read our full mission". The
   *  arrow glyph is appended by the component. */
  linkText: string
  /** Where the link points. e.g. "/about#mission". */
  linkHref: string
  /** Drives the background colour + frame styling. */
  accentColor: ManifestoAccent
}

export function ManifestoBlock({
  microLabel,
  headline,
  body,
  linkText,
  linkHref,
  accentColor,
}: ManifestoBlockProps) {
  return (
    <section
      className={`manifesto-block manifesto-block--${accentColor}`}
      data-screen-label="Manifesto"
    >
      <div className="manifesto-block-inner">
        <p className="manifesto-block-micro">{microLabel}</p>
        <h2 className="manifesto-block-headline">{headline}</h2>
        {/* Body wrapper accepts both plain strings (most products)
            and ReactNode (decodED's inline gov.uk link case). */}
        <div className="manifesto-block-body">
          {typeof body === 'string' ? <p>{body}</p> : body}
        </div>
        <a className="manifesto-block-link" href={linkHref}>
          {linkText}
          <span className="manifesto-block-link-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </section>
  )
}
