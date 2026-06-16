import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { MaskReveal } from '../MaskReveal'
import { BrowserFrame, type BrowserFrameScreen } from './BrowserFrame'
import { ProductStepsSection } from './ProductStepsSection'
import { ManifestoBlock, type ManifestoAccent } from './ManifestoBlock'
import {
  GoingFurtherSection,
  type GoingFurtherCard,
} from './GoingFurtherSection'
import { useContextClass } from '../../hooks/useContextClass'
import '../../styles/manifesto-block.css'
import '../../styles/going-further-section.css'

/**
 * The shared product page template. Renders five sections in order:
 *   1. Hero - micro label + name + tagline + one-liner + CTA + browser
 *      frame with cycling screens
 *   2. Centred transition headline with hard colour cut beneath
 *   3. "Let's show you [Request Demo] how we do it" inline-pill section
 *   4. Four numbered steps with sticky illustration column
 *   5. Closer - section label + headline + subhead + client logos (or
 *      pilot CTA) + Get-in-touch pill
 *
 * Per-product content + palette comes in via the config prop. Three
 * products use this: PABLO, NZ:AI, decodED. configs at
 * src/data/products/.
 *
 * Brief: docs/briefs/nza-product-page-template-brief.md
 */

export type ProductPageConfig = {
  slug: 'pablo' | 'nzai' | 'decoded'
  /** Body class for context-aware nav recolour. */
  contextClass: 'context-pablo' | 'context-nzai' | 'context-decoded'
  /** true for decodED (cream-warm canvas, no blob field, solid CTAs). */
  isLight: boolean
  /** Colour palette tokens. Inlined as CSS variables on the page root. */
  palette: {
    canvas: string
    cream: string
    accent: string
    accentLight: string
    canvasElevated: string
    /** Sets `--step-verb-colour`. For decodED this is ORANGE not green. */
    stepVerbColour: string
  }
  /** SECTION 1 - Hero */
  hero: {
    microLabel: string
    /** Plain-text product name. Used as the page heading + alt text
     *  on the logo image. Kept even when logoSrc is set so the
     *  document outline and accessibility still resolve to a real
     *  name. */
    name: string
    /** Path to the product's brand logo SVG (e.g. /assets/logos/pablo-logo.svg).
     *  When set, renders as the visual product name in the hero
     *  instead of the Stolzl text. */
    logoSrc?: string
    tagline: string
    oneLiner: string
    ctaLabel: string
    ctaHref: string
    /** Optional secondary CTA, rendered beside the primary. decodED
     *  uses this for "Join the waitlist" alongside the primary
     *  "Search your postcode" per the manifestos brief Movement 3.1.
     *  PABLO and NZ:AI don't set these and render a single CTA. */
    secondaryCtaLabel?: string
    secondaryCtaHref?: string
    screens: BrowserFrameScreen[]
  }
  /** SECTION 2 - Full-viewport manifesto block. Replaces the old
   *  `transition` field as of the manifestos brief
   *  (docs/briefs/nza-manifestos-and-solutions-brief.md, Movement 2).
   *  PABLO / decodED / NZ:AI each declare their own manifesto;
   *  rendered via the shared `ManifestoBlock` component. */
  manifesto: {
    microLabel: string
    headline: string | ReactNode
    body: string | ReactNode
    /* linkText + linkHref were removed per the
       manifesto-exit-mechanics brief (no useful destination yet);
       kept optional in the underlying ManifestoBlock component so a
       caller can reinstate the link without rewiring the type. */
    linkText?: string
    linkHref?: string
    accentColor: ManifestoAccent
  }
  /** SECTION 3 - "Let's show you" inline-pill section */
  letsShow: {
    leadingText: string
    pillLabel: string
    pillHref: string
    trailingText: string
  }
  /** SECTION 4 - Four numbered steps */
  steps: Array<{
    number: string
    iconName: string
    /** Optional single-string headline (PABLO June 2026 redesign).
     *  When provided, the renderer uses this directly and skips the
     *  prefix/verb/suffix highlight pattern below. Other products
     *  still use the three-part split for the coral-highlighted verb. */
    headline?: string
    /** Legacy three-part headline split. */
    headlinePrefix: string
    highlightedVerb: string
    headlineSuffix: string
    body: string
    illustrationConcept: string
    /** Opt this step into scrollytelling - text-block becomes 300vh
     *  tall and the animation's phases advance based on scroll
     *  progress through the block (per Chris's June 2026 direction). */
    scrollytell?: boolean
  }>
  /** SECTION 4.5 - Optional "Going Further with NZA" triptych. Used
   *  by decodED per the manifestos brief Movement 3.3 to frame the
   *  free digital twin as the foundation NZA can build further on.
   *  PABLO + NZ:AI don't set this and the section is skipped. */
  goingFurther?: {
    microLabel: string
    headline: string | ReactNode
    intro: string | ReactNode
    cards: [GoingFurtherCard, GoingFurtherCard, GoingFurtherCard]
    ctaText: string
    ctaHref: string
  }
  /** SECTION 5 - Closer */
  closer: {
    /** Optional - dropped from PABLO per the June 2026 redesign
     *  brief; NZ:AI and decodED still pass it through. */
    microLabel?: string
    headline: string
    subhead: string
    /** Plain logo row used by NZ:AI / decodED. Mutually exclusive
     *  with caseStudies - if both are provided the cases win. */
    clientLogos?: Array<{ src: string; alt: string }>
    /** Click-to-expand case-study cards used by PABLO per the June
     *  2026 redesign brief. Each card shows the logo at rest, expands
     *  on click to reveal the company name + body, and only one card
     *  can be open at a time. */
    caseStudies?: Array<{
      id: string
      logoSrc: string
      alt: string
      companyName: string
      body: string
    }>
    ctaLabel: string
    ctaHref: string
  }
}

export function ProductPage({ config }: { config: ProductPageConfig }) {
  useContextClass(config.contextClass)

  // Scroll to top on mount so navigating between products doesn't keep
  // the scroll position from the previous page.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [config.slug])

  /* Scroll-driven parallax on the Let's Show section's inner content.
     Per Chris's June 2026 ask: "the white card zooms in and scrolls
     in first, then the text scrolls in". The CARD (outer section)
     moves with natural scroll; the TEXT INSIDE translates at a
     slower rate so it lags during entry AND exit, creating the
     depth feel of card and text moving at different speeds.

     Formula: text translateY is positive (below card position) when
     the section is entering from below the viewport, returns to 0
     when fully in view, then goes positive again on the way out. */
  const letsShowRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const section = letsShowRef.current
    if (!section) return
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
        const vh = window.innerHeight
        let textY = 0
        if (rect.top > 0) {
          /* Entry phase - section's top is still below viewport top.
             textY starts at LETS_SHOW_TEXT_LAG when section is fresh
             below the viewport, eases toward 0 as section centres. */
          const t = Math.min(1, rect.top / vh)
          textY = t * 64
        } else if (rect.bottom < vh) {
          /* Exit phase - section's bottom has crossed above viewport
             bottom. Same magnitude lag in the opposite direction. */
          const t = Math.min(1, (vh - rect.bottom) / vh)
          textY = t * 64
        }
        section.style.setProperty('--lets-show-text-y', `${textY}px`)
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

  /* Case studies single-expand state - only one card open at a time.
     Null = all collapsed. Click the open card to collapse, click a
     different card to swap. Used only when config.closer.caseStudies
     is provided (currently just PABLO per the June 2026 redesign). */
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null)

  // Set the document title per product so browser tabs read the
  // product name. Restores on unmount.
  useEffect(() => {
    const previous = document.title
    document.title = `${config.hero.name.replace(/\.$/, '')} · Net Zero Advisory`
    return () => {
      document.title = previous
    }
  }, [config.hero.name])

  const rootStyle: CSSProperties = {
    // CSS variables that the product-page.css rules read.
    '--product-canvas': config.palette.canvas,
    '--product-accent': config.palette.accent,
    '--product-accent-light': config.palette.accentLight,
    '--product-cream': config.palette.cream,
    '--product-canvas-elevated': config.palette.canvasElevated,
    '--step-verb-colour': config.palette.stepVerbColour,
  } as CSSProperties

  return (
    <div
      className={'product-page' + (config.isLight ? ' is-light' : '')}
      style={rootStyle}
      data-product={config.slug}
    >
      {/* =========================================================
          SECTION 1 - HERO
          ========================================================= */}
      <section className="product-hero">
        {!config.isLight && (
          <div className="product-hero-blobs" aria-hidden="true">
            <span
              className="product-hero-blob product-hero-blob--1"
              style={{
                background: config.palette.canvas,
                left: '-10%',
                top: '20%',
                width: '40vw',
                height: '40vw',
                opacity: 0.6,
              }}
            />
            <span
              className="product-hero-blob product-hero-blob--2"
              style={{
                background: config.palette.accent,
                right: '-5%',
                top: '10%',
                width: '36vw',
                height: '36vw',
                opacity: 0.18,
              }}
            />
            <span
              className="product-hero-blob product-hero-blob--3"
              style={{
                background: config.palette.accentLight,
                left: '40%',
                bottom: '-10%',
                width: '30vw',
                height: '30vw',
                opacity: 0.12,
              }}
            />
            <span
              className="product-hero-blob product-hero-blob--4"
              style={{
                background: '#FFC775',
                right: '20%',
                top: '50%',
                width: '24vw',
                height: '24vw',
                opacity: 0.08,
              }}
            />
          </div>
        )}

        <div className="product-hero-inner">
          <div className="product-hero-text">
            <MaskReveal as="p" className="product-hero-micro" delay={100}>
              {config.hero.microLabel}
            </MaskReveal>
            {config.hero.logoSrc ? (
              <MaskReveal
                as="h1"
                className="product-hero-name product-hero-name--logo"
                delay={250}
              >
                <img
                  src={config.hero.logoSrc}
                  alt={config.hero.name}
                  className="product-hero-name-img"
                />
              </MaskReveal>
            ) : (
              <MaskReveal as="h1" className="product-hero-name" delay={250}>
                {config.hero.name}
              </MaskReveal>
            )}
            <MaskReveal as="p" className="product-hero-tagline" delay={450}>
              {config.hero.tagline}
            </MaskReveal>
            <MaskReveal as="p" className="product-hero-oneliner" delay={600}>
              {config.hero.oneLiner}
            </MaskReveal>
            <MaskReveal as="div" className="product-hero-cta-wrap" delay={800}>
              <a className="product-hero-cta" href={config.hero.ctaHref}>
                {config.hero.ctaLabel}
              </a>
              {config.hero.secondaryCtaLabel && config.hero.secondaryCtaHref && (
                <a
                  className="product-hero-cta product-hero-cta--secondary"
                  href={config.hero.secondaryCtaHref}
                >
                  {config.hero.secondaryCtaLabel}
                </a>
              )}
            </MaskReveal>
          </div>

          <div className="product-hero-frame-col">
            <BrowserFrame screens={config.hero.screens} />
          </div>
        </div>

        {/* Scroll-down affordance at the bottom of the hero. Subtle
            mono micro-label + chevron indicating there's more below. */}
        <div className="product-hero-scroll-hint" aria-hidden="true">
          <span className="product-hero-scroll-hint-label">Scroll</span>
          <svg
            className="product-hero-scroll-hint-chevron"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M6 9 L12 15 L18 9" />
          </svg>
        </div>
      </section>

      {/* =========================================================
          SECTION 2 - MANIFESTO BLOCK
          Full-viewport "why" takeover. Replaces the old centred
          `product-transition` two-liner per the manifestos brief.
          Per-product accent surface + curved-top anatomy mirrors
          the home page's coral "We are experts" block.
          ========================================================= */}
      <ManifestoBlock
        microLabel={config.manifesto.microLabel}
        headline={config.manifesto.headline}
        body={config.manifesto.body}
        linkText={config.manifesto.linkText}
        linkHref={config.manifesto.linkHref}
        accentColor={config.manifesto.accentColor}
      />

      {/* =========================================================
          SECTION 3 - LET'S SHOW YOU
          The standalone Request Demo pill used to live here under
          the headline. Per the manifesto-exit-mechanics brief
          it's been removed: the browser-frame CTA at the top-
          right of Section 04's shared frame already carries the
          contextual coral "Request Demo" button, so the inline
          one was duplicate. Headline now stands alone as the
          transition into the steps.
          ========================================================= */}
      <section ref={letsShowRef} className="product-lets-show">
        <div className="product-lets-show-inner">
          <LetsShowHeadline
            leadingText={config.letsShow.leadingText}
            trailingText={config.letsShow.trailingText}
          />
        </div>
      </section>

      {/* =========================================================
          SECTION 4 - FOUR STEPS
          ========================================================= */}
      <section className="product-steps">
        <div className="product-steps-inner">
          <ProductStepsSection
            steps={config.steps}
            requestDemoHref={config.letsShow.pillHref}
            requestDemoLabel={config.letsShow.pillLabel}
          />
        </div>
      </section>

      {/* =========================================================
          SECTION 4.5 - GOING FURTHER (optional)
          Currently only decodED uses this slot - the brief's
          triptych framing Decoded as a free foundation that NZA
          builds further on. PABLO + NZ:AI don't declare
          `goingFurther` and this section is skipped.
          ========================================================= */}
      {config.goingFurther && (
        <GoingFurtherSection
          microLabel={config.goingFurther.microLabel}
          headline={config.goingFurther.headline}
          intro={config.goingFurther.intro}
          cards={config.goingFurther.cards}
          ctaText={config.goingFurther.ctaText}
          ctaHref={config.goingFurther.ctaHref}
        />
      )}

      {/* =========================================================
          SECTION 5 - CLOSER / CREDIBILITY
          ========================================================= */}
      <section className="product-closer">
        {!config.isLight && (
          <div className="product-hero-blobs" aria-hidden="true">
            <span
              className="product-hero-blob product-hero-blob--1"
              style={{
                background: config.palette.canvas,
                left: '-10%',
                top: '20%',
                width: '40vw',
                height: '40vw',
                opacity: 0.6,
              }}
            />
            <span
              className="product-hero-blob product-hero-blob--2"
              style={{
                background: config.palette.accent,
                right: '-10%',
                top: '30%',
                width: '34vw',
                height: '34vw',
                opacity: 0.16,
              }}
            />
          </div>
        )}
        <div className="product-closer-inner">
          {/* microLabel is now optional. PABLO drops it per the
              June 2026 brief; NZ:AI and decodED still pass it. */}
          {config.closer.microLabel && (
            <MaskReveal as="p" className="product-closer-micro" delay={0}>
              {config.closer.microLabel}
            </MaskReveal>
          )}
          <MaskReveal as="h2" className="product-closer-headline" delay={150}>
            {config.closer.headline}
          </MaskReveal>
          <MaskReveal as="p" className="product-closer-subhead" delay={300}>
            {config.closer.subhead}
          </MaskReveal>

          {/* CASE STUDIES (new PABLO layout) - three click-to-expand
              cards. Single-expand pattern: clicking an unopened card
              opens it and closes any other open card; clicking the
              open card collapses it. */}
          {config.closer.caseStudies && config.closer.caseStudies.length > 0 && (
            <MaskReveal
              as="div"
              className="product-closer-cases"
              delay={500}
            >
              {config.closer.caseStudies.map((cs, i) => {
                const isOpen = expandedCaseId === cs.id
                const caseNum = String(i + 1).padStart(2, '0')
                return (
                  <button
                    key={cs.id}
                    type="button"
                    className={
                      'product-closer-case' +
                      (isOpen ? ' is-open' : '')
                    }
                    aria-expanded={isOpen}
                    aria-label={
                      isOpen
                        ? `Collapse ${cs.alt} case study`
                        : `Expand ${cs.alt} case study`
                    }
                    onClick={() =>
                      setExpandedCaseId((curr) =>
                        curr === cs.id ? null : cs.id,
                      )
                    }
                  >
                    {/* Logo stage is a FIXED-HEIGHT wrapper around the
                        img so the three logos (which have different
                        intrinsic aspect ratios) all consume the same
                        vertical slot. That means everything BELOW the
                        stage - the underline + the cue label - sits
                        at the exact same Y across all three cards.
                        The image itself scales to fit via
                        max-height/max-width + object-fit:contain. */}
                    <div className="product-closer-case-logo-stage">
                      <img
                        src={cs.logoSrc}
                        alt={cs.alt}
                        className="product-closer-case-logo"
                      />
                    </div>
                    {/* Click affordance cue - small mono micro-label
                        beneath the logo + underline. Per Chris ("it's
                        not a full case study; it's just a bit of
                        information ... 'Read more' or even just a
                        little arrow") - copy now "01 · READ MORE →"
                        rather than promising a full case study.
                        Quiet at rest, brightens + arrow nudges on
                        hover; arrow rotates 90deg down when open. */}
                    <span className="product-closer-case-cue" aria-hidden="true">
                      <span className="product-closer-case-cue-num">{caseNum}</span>
                      <span className="product-closer-case-cue-sep"> · </span>
                      <span className="product-closer-case-cue-label">
                        {isOpen ? 'Hide' : 'Read more'}
                      </span>
                      <span className="product-closer-case-cue-arrow" aria-hidden="true">
                        →
                      </span>
                    </span>
                    {/* Reveal panel - inner wrapper sits inside so the
                        grid-template-rows: 0fr -> 1fr accordion
                        animates smoothly from the body content's
                        natural height (no max-height interpolation
                        jitter). Company name dropped per Chris - all
                        three logos already include the wordmark, so
                        repeating it underneath was redundant. */}
                    <div
                      className="product-closer-case-reveal"
                      aria-hidden={!isOpen}
                    >
                      <div className="product-closer-case-reveal-inner">
                        <p className="product-closer-case-body">{cs.body}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </MaskReveal>
          )}

          {/* Plain logo row (existing NZ:AI / decodED layout). Only
              rendered if caseStudies isn't provided. */}
          {!config.closer.caseStudies &&
            config.closer.clientLogos &&
            config.closer.clientLogos.length > 0 && (
              <MaskReveal
                as="div"
                className="product-closer-clients"
                delay={500}
              >
                {config.closer.clientLogos.map((logo, i) => (
                  <img
                    key={i}
                    src={logo.src}
                    alt={logo.alt}
                    className="product-closer-client-logo"
                  />
                ))}
              </MaskReveal>
            )}

          <MaskReveal as="div" delay={650}>
            <a className="product-closer-cta" href={config.closer.ctaHref}>
              {config.closer.ctaLabel}
            </a>
          </MaskReveal>
        </div>
      </section>
    </div>
  )
}

/* =========================================================================
   LetsShowHeadline - word-by-word reveal for the "Let's show you how
   PABLO works" headline. Each word sits inside a clipping wrapper +
   masked inner span; when the h2 enters viewport the words rise
   into place with a small per-word delay. Per Chris's "can we come
   up with a clever animation for how that shows up" ask.
   ========================================================================= */
function LetsShowHeadline({
  leadingText,
  trailingText,
}: {
  leadingText: string
  trailingText: string
}) {
  const ref = useRef<HTMLHeadingElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
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
      { threshold: 0.35 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  /* Build the word list from leading + trailing copy. Empty strings
     filtered out so a config without a trailing fragment doesn't
     leave a phantom word with no content. */
  const words = `${leadingText} ${trailingText}`.split(/\s+/).filter(Boolean)

  return (
    <h2
      ref={ref}
      className={
        'product-lets-show-headline' + (revealed ? ' is-revealed' : '')
      }
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="lets-show-word">
          <span
            className="lets-show-word-inner"
            style={{ '--word-delay': `${i * 110}ms` } as CSSProperties}
          >
            {word}
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </h2>
  )
}
