import { useEffect, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { MaskReveal } from '../MaskReveal'
import { BrowserFrame, type BrowserFrameScreen } from './BrowserFrame'
import { ProductStepsSection } from './ProductStepsSection'
import { useContextClass } from '../../hooks/useContextClass'

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
    screens: BrowserFrameScreen[]
  }
  /** SECTION 2 - Centred transition headline */
  transition: {
    microLabel: string
    headline: string
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
    /** Full headline. The highlighted verb is wrapped via highlightedVerb. */
    headlinePrefix: string
    highlightedVerb: string
    headlineSuffix: string
    body: string
    illustrationConcept: string
  }>
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
          SECTION 2 - CENTRED TRANSITION HEADLINE
          ========================================================= */}
      <section className="product-transition">
        <div className="product-transition-inner">
          <MaskReveal as="p" className="product-transition-micro" delay={0}>
            {config.transition.microLabel}
          </MaskReveal>
          <MaskReveal as="h2" className="product-transition-headline" delay={200}>
            {config.transition.headline}
          </MaskReveal>
        </div>
      </section>

      {/* =========================================================
          SECTION 3 - LET'S SHOW YOU
          ========================================================= */}
      <section className="product-lets-show">
        <div className="product-lets-show-inner">
          {/* Headline now stands alone - the Request Demo pill is no
              longer inline. Per Chris: a single confident statement,
              then the CTA beneath it. */}
          <h2 className="product-lets-show-headline">
            {`${config.letsShow.leadingText} ${config.letsShow.trailingText}`}
          </h2>
          <Link
            to={config.letsShow.pillHref}
            className="product-lets-show-pill product-lets-show-pill--standalone"
          >
            {config.letsShow.pillLabel}
          </Link>
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
              {config.closer.caseStudies.map((cs) => {
                const isOpen = expandedCaseId === cs.id
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
                    <img
                      src={cs.logoSrc}
                      alt={cs.alt}
                      className="product-closer-case-logo"
                    />
                    {/* Chevron rotates 180deg when open via CSS. */}
                    <span
                      className="product-closer-case-chevron"
                      aria-hidden="true"
                    />
                    {/* Reveal panel - rendered in the DOM always so
                        the max-height transition has content to size
                        to; opacity + max-height animate together. */}
                    <div
                      className="product-closer-case-reveal"
                      aria-hidden={!isOpen}
                    >
                      <p className="product-closer-case-name">{cs.companyName}</p>
                      <p className="product-closer-case-body">{cs.body}</p>
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
