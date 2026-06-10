import { MaskReveal } from '../components/MaskReveal'

/**
 * Get in Touch - closing CTA on the homepage flow.
 *
 * v2 brief Change 4 refinements:
 *   - New micro label "READY WHEN YOU ARE"
 *   - New copy ("We'd be delighted to hear from you...")
 *   - Primary CTA button (solid coral) above the icons
 *   - Contact icons (Email / LinkedIn / Call) moved INTO the closer
 *     section so the footer can collapse to a single legal strip
 *   - Section height reduced from full-viewport to ~65vh so the
 *     closer focuses rather than dominates
 *   - Blob field continues the navy band from products above (no
 *     colour cut between the two)
 *
 * Brief: docs/briefs/nza-landing-page-v2-brief.md (Change 4)
 */

const EMAIL = 'chrisscott@thenza.co.uk'
const LINKEDIN = 'https://www.linkedin.com/company/netzero-advisory'
/* Phone placeholder per brief - Chris to swap in the real number. */
const PHONE = '+44 7000 000000'

const CONTACT_HREF = `mailto:${EMAIL}?subject=NZA%20-%20Let%27s%20talk`

export function GetInTouchScreen() {
  return (
    <section
      className="screen canvas-navy in-view get-in-touch-screen"
      id="get-in-touch"
      data-screen-label="Let's talk"
    >
      {/* Ambient blob field - continues the navy band from the
          products section above (per v2 brief: "no colour cut
          between the two, just the natural visual break of new
          content arriving"). Same five-blob spec as products. */}
      <div
        className="landing-blobs landing-blobs--git"
        aria-hidden="true"
      >
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
          <MaskReveal as="p" className="get-in-touch-body" delay={120}>
            We'd be delighted to hear from you. Whether you want a quick demo,
            a longer conversation, or just to ask questions.
          </MaskReveal>
          <MaskReveal as="div" className="get-in-touch-cta-wrap" delay={240}>
            <a className="get-in-touch-cta" href={CONTACT_HREF}>
              Get in touch
              <span aria-hidden="true"> →</span>
            </a>
          </MaskReveal>

          {/* CONTACT ICONS ROW - moved inside the closer per v2 brief.
              Three real links: Email, LinkedIn, Call. Hover flips
              stroke + label to coral. */}
          <MaskReveal as="div" className="get-in-touch-contacts" delay={380}>
            <a
              className="get-in-touch-contact"
              href={`mailto:${EMAIL}`}
              aria-label={`Email Net Zero Advisory at ${EMAIL}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                <path d="M3 7l9 7l9-7" />
              </svg>
              <span className="get-in-touch-contact-label">EMAIL</span>
            </a>
            <a
              className="get-in-touch-contact"
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Net Zero Advisory on LinkedIn"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M8 11l0 5" />
                <path d="M8 8l0 .01" />
                <path d="M12 16l0 -5" />
                <path d="M16 16v-3a2 2 0 0 0 -4 0" />
              </svg>
              <span className="get-in-touch-contact-label">LINKEDIN</span>
            </a>
            <a
              className="get-in-touch-contact"
              href={`tel:${PHONE.replace(/\s+/g, '')}`}
              aria-label={`Call Net Zero Advisory at ${PHONE}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
              </svg>
              <span className="get-in-touch-contact-label">CALL</span>
            </a>
          </MaskReveal>
        </div>
      </div>
    </section>
  )
}
