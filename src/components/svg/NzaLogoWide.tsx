/**
 * NZA wide logo - mark + "NET ZERO ADVISORY" wordmark, composed as a
 * single inline SVG with four independently-styleable groups:
 *
 *   #nza-logo-mark      The geometric icon (circle + three triangles).
 *                       Composed of four child paths from the existing
 *                       nza-mark-thick-layered.svg.
 *   #nza-logo-net       The word "NET".
 *   #nza-logo-zero      The word "ZERO".
 *   #nza-logo-advisory  The word "ADVISORY".
 *
 * Per the navigation brief (docs/briefs/nza-navigation-brief.md
 * Section 1) `mark + net + zero` share one colour, and `advisory`
 * gets an accent that flips per page context. The CSS rules in
 * site-nav.css drive the recolour from `body.context-*` classes:
 *
 *   body.context-navy     mark/net/zero -> cream, advisory -> cream
 *   body.context-cream    mark/net/zero -> navy,  advisory -> coral
 *   body.context-pablo    mark/net/zero -> cream, advisory -> cream
 *   body.context-nzai     mark/net/zero -> cream, advisory -> cream
 *   body.context-decoded  mark/net/zero -> green, advisory -> orange
 *
 * The mark sits on the left (square aspect from the source viewBox
 * 267x267), the two-line wordmark on the right (NET ZERO on top,
 * ADVISORY below, from the source viewBox 472.7 x 154.91). The wide
 * composition matches what the brief calls "two-line logo" and is
 * sized via CSS height; width adjusts to maintain aspect ratio.
 *
 * On mobile the nav uses the mark only via `<NzaLogoMark />` (same
 * source paths, just the mark SVG rendered standalone). That keeps
 * the desktop wide logo and the mobile mark a single source of truth
 * for the geometric paths.
 */

type Props = {
  className?: string
}

/* Mark paths from public/assets/logos/nza-mark-thick-layered.svg */
const MARK_PATHS = (
  <>
    <path
      id="nza-logo-mark-circle"
      d="M133.49,267C59.88,267,0,207.11,0,133.5S59.88,0,133.49,0s133.5,59.89,133.5,133.5-59.89,133.5-133.5,133.5ZM133.49,9.98c-68.11,0-123.52,55.41-123.52,123.52s55.41,123.52,123.52,123.52,123.52-55.41,123.52-123.52S201.6,9.98,133.5,9.98h0Z"
    />
    <path
      id="nza-logo-mark-bottom-triangle"
      d="M196.16,151.02l-8.05-10-54.23-67.41c-.2-.25-.58-.25-.78,0l-54.23,67.41-8.05,10-36.7,45.61c-.26.33-.03.81.39.81h197.95c.42,0,.65-.49.39-.81l-36.7-45.61ZM55.39,187.44c-.42,0-.65-.49-.39-.81l28.65-35.61,8.05-10,41.4-51.46c.2-.25.58-.25.78,0l41.4,51.46,8.05,10,28.65,35.61c.26.33.03.81-.39.81H55.39Z"
    />
    <path
      id="nza-logo-mark-mid-triangle"
      d="M155.91,143.02h-12.84l-9.19-11.43c-.2-.25-.58-.25-.78,0l-9.19,11.43h-12.84l22.03-27.38c.2-.25.58-.25.78,0l22.03,27.38Z"
    />
    <path
      id="nza-logo-mark-top-triangle"
      d="M133.1,29.19l-98.98,123.01c-.26.33-.03.81.39.81h197.95c.42,0,.65-.49.39-.81L133.88,29.19c-.2-.25-.58-.25-.78,0ZM55,142.21l78.1-97.06c.2-.25.58-.25.78,0l78.1,97.06c.26.33.03.81-.39.81H55.39c-.42,0-.65-.49-.39-.81Z"
    />
  </>
)

/* Wordmark paths from public/assets/net-zero-advisory-layered.svg */
const NET_PATHS = (
  <>
    <path d="M44.6,65.79L13.77,22.36v43.43H0V1.13h14.17l29.97,41.88V1.13h13.78v64.7h-13.29l-.04-.04s0,0,0,0Z" />
    <path d="M73.07,65.8V1.14h45.78v11.84h-32v14.08h31.33v11.84h-31.33v15.02h32v11.9h-45.78v-.02h0Z" />
    <path d="M146.96,65.8V13.24h-18.92V1.14h51.6v12.1h-18.81v52.56h-13.87Z" />
  </>
)

const ZERO_PATHS = (
  <>
    <path d="M222.33,65.8v-11.16l30.56-41.4h-30.56V1.14h48.6v11.05l-30.56,41.51h31.24v12.1h-49.28Z" />
    <path d="M284.47,65.82V1.12h45.78v11.84h-32v14.08h31.33v11.84h-31.33v15.02h32v11.9h-45.78v.04-.02Z" />
    <path d="M379.99,65.82l-12.68-23.19h-10.1v23.19h-13.78V1.12h30.28c13.46,0,21.7,8.82,21.7,20.85s-7.16,17.53-14.17,19.19l14.54,24.66h-15.81.02ZM371.62,12.98h-14.45v17.84h14.45c5.52,0,9.7-3.49,9.7-8.92s-4.17-8.92-9.7-8.92h0Z" />
    <path d="M438.86,0c19.6,0,33.84,13.97,33.84,33.47s-14.24,33.47-33.84,33.47-33.74-13.97-33.74-33.47S419.36,0,438.86,0ZM438.86,12.22c-11.94,0-19.6,9.12-19.6,21.23s7.66,21.25,19.6,21.25,19.7-9.23,19.7-21.25-7.76-21.23-19.7-21.23Z" />
  </>
)

const ADVISORY_PATHS = (
  <>
    <path d="M53.98,153.77l-7.16-17.36H10.75l-7.16,17.36H0l26.96-64.7h3.7l26.96,64.7h-3.64ZM28.75,92.64l-16.85,40.82h33.74l-16.85-40.82h-.04Z" />
    <path d="M70.57,153.77v-64.7h19.19c20.07,0,32.17,15.13,32.17,32.38s-12.1,32.28-32.17,32.28h-19.19v.04ZM73.64,150.85h16.11c18.31,0,28.83-12.99,28.83-29.39s-10.48-29.5-28.83-29.5h-16.11v58.9h0Z" />
    <path d="M157.82,153.77l-26.96-64.7h3.59l25.22,61.11,25.22-61.11h3.59l-26.96,64.7h-3.72.02,0Z" />
    <path d="M201.49,153.77v-64.7h3.09v64.7h-3.09Z" />
    <path d="M223.19,142.42c3.96,4.85,10.79,9.61,20.07,9.61,14.96,0,18.71-8.55,18.71-14.64,0-10.48-9.4-13.29-19.02-16.01-9.99-2.82-20.28-5.63-20.28-16.85,0-10.48,9.61-16.51,20.28-16.51,9.5,0,16.4,3.49,20.95,9.12l-2.41,2.24c-4.55-5.93-11.05-8.44-18.51-8.44-9.4,0-16.85,5.63-16.85,13.57,0,8.72,8.72,11.16,17.95,13.78,10.37,2.99,21.36,6.31,21.36,19.09,0,7.26-4.64,17.53-22.11,17.53-10.1,0-17.95-4.38-22.59-10.27l2.52-2.24h-.04l-.04.07h0v-.04h0,.02Z" />
    <path d="M310.75,87.95c18.71,0,30.73,14.75,30.73,33.47s-12,33.47-30.73,33.47-30.76-14.75-30.76-33.47,11.9-33.47,30.76-33.47ZM310.75,90.87c-16.74,0-27.32,12.78-27.32,30.56s10.58,30.56,27.32,30.56,27.32-12.99,27.32-30.56-10.79-30.56-27.32-30.56Z" />
    <path d="M397.09,153.77l-19.7-27.94h-15.53v27.94h-3.09v-64.7h22.31c10.48,0,19.09,6.51,19.09,18.31s-8.61,18.42-19.09,18.42l19.98,27.94h-3.96v.04h-.01ZM381.08,92h-19.19v30.93h19.19c9.5,0,15.73-6.61,15.73-15.53s-6.2-15.43-15.73-15.43h0v.04h0Z" />
    <path d="M435.46,153.77v-28.04l-26.01-36.66h3.96l23.56,33.57,23.56-33.57h3.96l-26.01,36.66v28.04h-3.09.07Z" />
  </>
)

export function NzaLogoWide({ className }: Props) {
  return (
    <span className={'nza-logo-wide' + (className ? ' ' + className : '')}>
      {/* Mark - square aspect, viewBox sized to the source mark SVG. */}
      <svg
        className="nza-logo-wide-mark-svg"
        viewBox="0 0 267 267"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g id="nza-logo-mark">{MARK_PATHS}</g>
      </svg>

      {/* Two-line wordmark - NET ZERO on top, ADVISORY below. The
          source viewBox 472.7 x 154.91 keeps both lines naturally
          stacked. */}
      <svg
        className="nza-logo-wide-wordmark-svg"
        viewBox="0 0 472.7 154.91"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Net Zero Advisory"
      >
        <g id="nza-logo-net">{NET_PATHS}</g>
        <g id="nza-logo-zero">{ZERO_PATHS}</g>
        <g id="nza-logo-advisory">{ADVISORY_PATHS}</g>
      </svg>
    </span>
  )
}

/**
 * Mark-only variant for the mobile nav. Same paths as NzaLogoWide's
 * mark, rendered standalone so the mobile nav can show just the
 * icon without the wordmark beside it (per the brief's mobile rules
 * - the mark IS the menu trigger).
 */
export function NzaLogoMark({ className }: Props) {
  return (
    <svg
      className={'nza-logo-mark-only-svg' + (className ? ' ' + className : '')}
      viewBox="0 0 267 267"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="NZA"
    >
      <g id="nza-logo-mark-mobile">{MARK_PATHS}</g>
    </svg>
  )
}
