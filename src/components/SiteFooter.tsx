/**
 * Site-wide footer. Sits below every route's content.
 *
 * Minimal: three contact icons (email / LinkedIn / phone) above a
 * legal strip. Background adapts to the page context via the same
 * body.context-* classes the nav uses, so the footer sits as a
 * natural continuation of the section above it on dark pages, and
 * flips to a quiet cream on light pages.
 *
 * The product page brief calls for this footer pattern but didn't
 * point at a specific design. Kept it small + sober so it doesn't
 * distract from the page's closer CTA which is doing the heavy
 * conversion work.
 */

import { Link } from 'react-router-dom'

const EMAIL = 'chrisscott@thenza.co.uk'
const LINKEDIN = 'https://www.linkedin.com/company/netzero-advisory'

export function SiteFooter() {
  const year = '2026'
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer-inner">
        <div className="site-footer-contacts">
          <a
            className="site-footer-contact"
            href={`mailto:${EMAIL}`}
            aria-label={`Email Net Zero Advisory at ${EMAIL}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
              <path d="M3 7l9 7l9-7" />
            </svg>
            <span>Email</span>
          </a>
          <a
            className="site-footer-contact"
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
            <span>LinkedIn</span>
          </a>
          <Link
            className="site-footer-contact"
            to="/contact"
            aria-label="Get in touch with Net Zero Advisory"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
            </svg>
            <span>Get in touch</span>
          </Link>
        </div>

        <div className="site-footer-legal">
          <span>© {year} Net Zero Advisory.</span>
          <span className="site-footer-legal-sep" aria-hidden="true">·</span>
          <span>All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
