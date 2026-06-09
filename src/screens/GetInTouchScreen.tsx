/**
 * Get in Touch - closing CTA on the homepage flow.
 *
 * Final section after Clients + Products. Single CTA pointing at the
 * NZA mailbox; replaced with Calendly or contact form when those
 * decisions land.
 *
 * Scaffolded in chunk A; content + final styling lands in chunk B.
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
          <h2 className="get-in-touch-headline">
            Let's <em>talk</em>.
          </h2>
          <p className="get-in-touch-body">
            Half an hour to understand where you are, what you have, and what
            you're aiming for.
          </p>
          <a
            className="get-in-touch-cta"
            href="mailto:chrisscott@thenza.co.uk?subject=Conversation%20with%20NZA"
          >
            Get in touch
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
