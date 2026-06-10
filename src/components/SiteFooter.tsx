import { Link } from 'react-router-dom'

/**
 * Site footer.
 *
 * v2 brief Change 5 - COLLAPSED to a single tiny legal strip. The
 * contact icons that used to live here are now inside the closer
 * ("Let's talk") section above per v2 Change 4 - the footer's role
 * is now just the legal one-line.
 *
 *   © 2026 Net Zero Advisory Ltd.  ·  Privacy  ·  Terms  ·  Cookies
 *
 * Background continues the navy from the closer (no colour cut).
 * Text is cream at 40% opacity, separators at 25%, links underline-
 * coral on hover.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer-inner">
        <p className="site-footer-legal">
          <span>© 2026 Net Zero Advisory Ltd.</span>
          <span className="site-footer-sep" aria-hidden="true">·</span>
          <Link to="/privacy" className="site-footer-link">Privacy</Link>
          <span className="site-footer-sep" aria-hidden="true">·</span>
          <Link to="/terms" className="site-footer-link">Terms</Link>
          <span className="site-footer-sep" aria-hidden="true">·</span>
          <Link to="/cookies" className="site-footer-link">Cookies</Link>
        </p>
      </div>
    </footer>
  )
}
