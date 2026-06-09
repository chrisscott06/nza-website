import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useContextClass } from '../hooks/useContextClass'

/**
 * /contact - placeholder route per the product page template brief.
 *
 * The brief specifies the Request Demo pill on each product page links
 * to `/contact?product={slug}`. The real demo capture flow is a
 * separate brief; this stub just acknowledges the navigation and falls
 * back to the mailto pattern the rest of the site uses.
 *
 * If the URL carries ?product={slug}, the email subject is pre-filled
 * with that product context so Chris can see which page the lead came
 * from.
 */
export function ContactPage() {
  useContextClass('context-cream')
  const [params] = useSearchParams()
  const product = params.get('product') ?? ''

  const productLabel = (() => {
    if (product === 'pablo') return 'PABLO'
    if (product === 'nzai') return 'NZ:AI'
    if (product === 'decoded') return 'decodED'
    return null
  })()

  const subject = productLabel
    ? `${productLabel} - Demo request`
    : 'NZA - Get in touch'

  const mailto = `mailto:chrisscott@thenza.co.uk?subject=${encodeURIComponent(subject)}`

  // Reflect the chosen subject in the page title for a touch of polish.
  useEffect(() => {
    const prev = document.title
    document.title = productLabel
      ? `${productLabel} - Request demo · NZA`
      : 'Get in touch · NZA'
    return () => {
      document.title = prev
    }
  }, [productLabel])

  const [copied, setCopied] = useState(false)
  function copyEmail() {
    navigator.clipboard
      .writeText('chrisscott@thenza.co.uk')
      .then(() => {
        setCopied(true)
        window.setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  return (
    <main className="stub-page stub-page--cream">
      <div className="stub-page-inner contact-page-inner">
        <p className="stub-page-micro">
          {productLabel ? `/${product.toUpperCase()} REQUEST DEMO` : '/CONTACT'}
        </p>
        <h1 className="stub-page-headline">
          {productLabel ? (
            <>
              Let's talk about <em>{productLabel}</em>.
            </>
          ) : (
            <>
              Let's talk.
            </>
          )}
        </h1>
        <p className="contact-page-blurb">
          {productLabel
            ? `Drop a note about ${productLabel} and we'll be in touch. The full demo capture flow is on its way; for now an email gets to the right person fastest.`
            : 'Drop a note and we will be in touch. The full enquiry flow is on its way; for now an email gets to the right person fastest.'}
        </p>
        <div className="contact-page-actions">
          <a className="contact-page-action contact-page-action--primary" href={mailto}>
            Email us
          </a>
          <button
            type="button"
            className="contact-page-action contact-page-action--secondary"
            onClick={copyEmail}
          >
            {copied ? 'Copied' : 'Copy email'}
          </button>
        </div>
      </div>
    </main>
  )
}
