import { MaskReveal } from '../components/MaskReveal'

/**
 * Get in Touch - closing CTA on the homepage flow.
 *
 * Final section after Clients + Products. Single CTA pointing at the
 * NZA mailbox; replaced with Calendly or contact form when those
 * decisions land.
 *
 * All text wrapped in <MaskReveal> for the site-wide upward arrival
 * motion - staggered delays so the headline lands first, then the
 * body, then the CTA.
 */
export function GetInTouchScreen() {
  return (
    <section
      className="screen canvas-navy in-view get-in-touch-screen"
      id="get-in-touch"
      data-screen-label="Get in touch"
    >
      {/* Ambient blob field - same technique as the landing-page hero
          but MIRRORED. Visual weight on the LEFT, mask gradient fades
          to clean navy on the RIGHT, so the closer reads as the
          flipped book-end to the opening hero on the homepage. */}
      <div className="landing-blobs landing-blobs--git" aria-hidden="true">
        <span className="landing-blob landing-blob--git-navy-1" />
        <span className="landing-blob landing-blob--git-navy-2" />
        <span className="landing-blob landing-blob--git-navy-3" />
        <span className="landing-blob landing-blob--git-coral" />
        <span className="landing-blob landing-blob--git-cream" />
      </div>

      <div className="frame">
        <div className="get-in-touch-inner">
          <MaskReveal as="h2" className="get-in-touch-headline" delay={0}>
            Let's <em>talk</em>.
          </MaskReveal>
          <MaskReveal as="p" className="get-in-touch-body" delay={150}>
            Half an hour to understand where you are, what you have, and what
            you're aiming for.
          </MaskReveal>
          <MaskReveal delay={300}>
            <a
              className="get-in-touch-cta"
              href="mailto:chrisscott@thenza.co.uk?subject=Conversation%20with%20NZA"
            >
              Get in touch
              <span aria-hidden="true">→</span>
            </a>
          </MaskReveal>
        </div>
      </div>
    </section>
  )
}
