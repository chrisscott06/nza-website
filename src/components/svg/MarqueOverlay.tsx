/**
 * Three-curve marque overlay laid over the home-screen hero-mark.
 * "Energy transition", "Climate change", "Digital intelligence" curves
 * converge on the bottom-vertex of the brand mark's top triangle.
 *
 * The wrapper sits in absolute position; the SVG is sized so the logo
 * region of the source artwork (548×298 viewBox) overlaps the hero-mark
 * (300×298 viewBox) exactly. preserveAspectRatio="xMaxYMid meet" right-
 * aligns the marque so the logo region of the SVG sits over the actual
 * hero-mark.
 *
 * Animation (fade in top→mid→bottom, hold, fade out) lands in stage 4
 * via a `useMarqueOverlay` hook that toggles a class on this element.
 */
export function MarqueOverlay() {
  return (
    <div className="hero-marque" aria-hidden="true">
      <svg viewBox="0 0 548 298" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMid meet">
        <defs>
          {/* Brand gradient: warm amber → coral → rose → purple */}
          <linearGradient id="marque-grad-top" x1="234.34" y1="92.85" x2="441.65" y2="92.85" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fbb45d" />
            <stop offset=".07" stopColor="#f7994b" />
            <stop offset=".14" stopColor="#f4833e" />
            <stop offset=".21" stopColor="#f27635" />
            <stop offset=".28" stopColor="#f27233" />
            <stop offset=".55" stopColor="#f06380" />
            <stop offset=".93" stopColor="#a75ea4" />
          </linearGradient>
          <linearGradient id="marque-grad-mid" x1="235.52" y1="161.95" x2="533.98" y2="161.95" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fbb45d" />
            <stop offset=".07" stopColor="#f7994b" />
            <stop offset=".14" stopColor="#f4833e" />
            <stop offset=".21" stopColor="#f27635" />
            <stop offset=".28" stopColor="#f27233" />
            <stop offset=".55" stopColor="#f06380" />
            <stop offset=".93" stopColor="#a75ea4" />
          </linearGradient>
          <linearGradient id="marque-grad-bot" x1="234.34" y1="241.57" x2="430.41" y2="241.57" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fbb45d" />
            <stop offset=".07" stopColor="#f7994b" />
            <stop offset=".14" stopColor="#f4833e" />
            <stop offset=".21" stopColor="#f27635" />
            <stop offset=".28" stopColor="#f27233" />
            <stop offset=".55" stopColor="#f06380" />
            <stop offset=".93" stopColor="#a75ea4" />
          </linearGradient>
        </defs>
        {/* Top: ENERGY TRANSITION (curve swooping up, lands at bottom-vertex of top triangle) */}
        <g className="marque-row marque-row-top">
          <text className="marque-label" x="231.48" y="66.89">ENERGY</text>
          <text className="marque-label" x="231.48" y="75.63">TRANSITION</text>
          <circle className="marque-dot" cx="234.34" cy="82.18" r="1.7" fill="url(#marque-grad-top)" />
          <path
            className="marque-curve"
            d="M234.34,82.18h46.04c15.29-.33,25.91,3.29,32.65,6.51,28.14,13.45,28.12,38.87,62.04,59.94,10.1,6.27,19.33,9.75,28.7,11.41,11.1,1.97,20.4,1.91,26.61,1.76L430.41,166"
            fill="none"
            stroke="url(#marque-grad-top)"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </g>
        {/* Middle: CLIMATE CHANGE (straight line through middle of top triangle) */}
        <g className="marque-row marque-row-mid">
          <text className="marque-label" x="231.48" y="154.14">CLIMATE</text>
          <text className="marque-label" x="259" y="154.14">CHANGE</text>
          <circle className="marque-dot" cx="234.34" cy="161.73" r="1.7" fill="url(#marque-grad-mid)" />
          <path
            className="marque-curve"
            d="M430.41,166H235.52"
            fill="none"
            stroke="url(#marque-grad-mid)"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </g>
        {/* Bottom: DIGITAL INTELLIGENCE (curve swooping down, lands at bottom-vertex of top triangle) */}
        <g className="marque-row marque-row-bot">
          <text className="marque-label" x="231.48" y="256.18">DIGITAL</text>
          <text className="marque-label" x="231.48" y="265.7">INTELLIGENCE</text>
          <circle className="marque-dot" cx="234.34" cy="241.7" r="1.7" fill="url(#marque-grad-bot)" />
          <path
            className="marque-curve"
            d="M234.34,241.57h46.04c15.29.33,25.91-3.29,32.65-6.51,28.14-13.45,28.12-38.87,62.04-59.94,10.1-6.27,19.33-9.75,28.7-11.41,2.86-.51,25.02-1.49,37.86-1.76L430.41,166"
            fill="none"
            stroke="url(#marque-grad-bot)"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  )
}
