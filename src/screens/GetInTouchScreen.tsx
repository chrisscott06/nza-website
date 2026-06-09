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
