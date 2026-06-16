import { useEffect, useRef, useState, type ReactNode } from 'react'
import { MaskReveal } from '../MaskReveal'

/**
 * ManifestoBlock - full-viewport "why" takeover that sits between the
 * hero and the "Let's show you" section on each of the three product
 * pages (PABLO, decodED, NZ:AI).
 *
 * Anatomy mirrors the home page's coral "We are experts in buildings,
 * energy, and climate" block (`HowWeWorkSection` in
 * `src/screens/HowWeWorkSection.tsx`) - full-bleed saturated accent
 * colour, curved top corners, centred content. Code is NOT shared
 * with HowWeWorkSection per the architecture decision.
 *
 * Animations (Chunk 4 of the manifestos brief):
 *   - Staggered fade-up reveal via MaskReveal: micro (0ms),
 *     headline (150ms), body (300ms), link (450ms). Each element
 *     starts 16px lower than final position and fades 0->1 over
 *     ~600ms.
 *   - Background parallax: the saturated colour layer (rendered via
 *     `::before` pseudo on .manifesto-block) translates upward at
 *     0.3x scroll speed. rAF-throttled. Updates the CSS var
 *     `--manifesto-parallax-y` on the section root.
 *   - Scroll prompt: small "Scroll" mono label + bouncing chevron
 *     at the bottom of the section. Fades out once the user is
 *     past ~30% of the manifesto's scroll progress.
 *   - Phone: parallax + scroll prompt suppressed in CSS via the
 *     `@media (max-width: 599px)` block. Staggered reveal still
 *     works (cheap visual win).
 *   - prefers-reduced-motion: all motion short-circuits in CSS;
 *     MaskReveal already respects the preference.
 *
 * Cross-section colour transition (manifesto -> cream let's-show)
 * is in the brief but deferred - the section's natural hard cut
 * paired with a small bottom gradient blend reads cleanly enough
 * for launch. Flag if you want the observer-driven 600ms fade.
 *
 * Brief: docs/briefs/nza-manifestos-and-solutions-brief.md (Movement 2)
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

/* Scroll progress at which the bottom scroll prompt has fully faded
   out. Below this, the prompt is at full opacity (bouncing); at this
   threshold and above, it's invisible. 30% per the brief. */
const SCROLL_PROMPT_FADE_THRESHOLD = 0.30
/* Parallax rate: bg layer scrolls UP at this fraction of the user's
   scroll speed. 0.3x per the brief - subtle depth without ostentatious
   motion. */
const PARALLAX_RATE = 0.3

export function ManifestoBlock({
  microLabel,
  headline,
  body,
  linkText,
  linkHref,
  accentColor,
}: ManifestoBlockProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [promptOpacity, setPromptOpacity] = useState(1)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    /* Respect prefers-reduced-motion: skip the parallax + scroll
       prompt fade entirely. Static layout with revealed content. */
    if (typeof window === 'undefined' || !window.matchMedia) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) return

    let rafPending = false

    const onScroll = () => {
      if (rafPending) return
      rafPending = true
      window.requestAnimationFrame(() => {
        rafPending = false
        const rect = section.getBoundingClientRect()
        /* Section's visual centre relative to viewport top, normalised
           into roughly -1..1 across the section's traverse of the
           viewport. We feed this into the parallax translateY so the
           bg layer drifts upward as the section moves up. */
        const viewportH = window.innerHeight
        const sectionCentreFromViewportTop = rect.top + rect.height / 2
        const offsetFromViewportCentre =
          sectionCentreFromViewportTop - viewportH / 2
        /* Negative because we want the bg to move UP as the user
           scrolls down. Capped at +/- 200px so the parallax never
           exceeds the section's overflow:hidden bounds even on tall
           viewports. */
        const parallaxY = Math.max(
          -200,
          Math.min(200, -offsetFromViewportCentre * PARALLAX_RATE),
        )
        section.style.setProperty(
          '--manifesto-parallax-y',
          `${parallaxY}px`,
        )

        /* Text parallax - the inner content gets an additional
           translateY relative to the card on entry and exit, so
           the text appears to lag behind the card edge (which is
           moving at natural scroll). Per Chris's June 2026 ask
           for the "card and text at different speeds" effect. The
           manifesto's inner is sticky-pinned during its 60vh hold
           so during the hold the formula resolves to 0px and the
           sticky pin remains correct. */
        let textY = 0
        if (rect.top > 0) {
          /* Entry - section's top is below viewport top, text lags
             behind the card. */
          const t = Math.min(1, rect.top / viewportH)
          textY = t * 56
        } else if (rect.bottom < viewportH) {
          /* Exit - section's bottom has scrolled past viewport
             bottom edge, text lags behind the card on the way out. */
          const t = Math.min(1, (viewportH - rect.bottom) / viewportH)
          textY = t * 56
        }
        section.style.setProperty('--manifesto-text-y', `${textY}px`)

        /* Scroll prompt fade: when the user has scrolled past
           SCROLL_PROMPT_FADE_THRESHOLD of the section's height, the
           prompt is fully invisible. Linear fade between 0 and the
           threshold. */
        const sectionH = rect.height
        const scrolledIntoSection = Math.max(0, -rect.top)
        const progress = Math.min(1, scrolledIntoSection / sectionH)
        const nextOpacity =
          progress >= SCROLL_PROMPT_FADE_THRESHOLD
            ? 0
            : 1 - progress / SCROLL_PROMPT_FADE_THRESHOLD
        setPromptOpacity((curr) => {
          /* Don't trigger re-renders for sub-percent differences. */
          if (Math.abs(curr - nextOpacity) < 0.02) return curr
          return nextOpacity
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
      className={`manifesto-block manifesto-block--${accentColor}`}
      data-screen-label="Manifesto"
    >
      <div className="manifesto-block-inner">
        <MaskReveal as="p" className="manifesto-block-micro" delay={0}>
          {microLabel}
        </MaskReveal>
        <MaskReveal as="h2" className="manifesto-block-headline" delay={150}>
          {headline}
        </MaskReveal>
        <MaskReveal as="div" className="manifesto-block-body" delay={300}>
          {typeof body === 'string' ? <p>{body}</p> : body}
        </MaskReveal>
        <MaskReveal as="div" delay={450}>
          <a className="manifesto-block-link" href={linkHref}>
            {linkText}
            <span className="manifesto-block-link-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </MaskReveal>
      </div>

      {/* Scroll-down affordance, fades out as the user scrolls into
          the section. Hidden on phone via CSS (the cards below are
          already in view there). */}
      <div
        className="manifesto-block-scroll-prompt"
        aria-hidden="true"
        style={{ opacity: promptOpacity }}
      >
        <span className="manifesto-block-scroll-prompt-label">Scroll</span>
        <svg
          className="manifesto-block-scroll-prompt-chevron"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M6 9 L12 15 L18 9" />
        </svg>
      </div>
    </section>
  )
}
