/**
 * PABLO wordmark logo (gradient variant, swapped in May 2026).
 *
 * Single path filled with the brand linear-gradient (orange -> coral ->
 * pink -> purple), same colour story as the arrow on the GHG diagram.
 * The gradient is fixed regardless of host context, so the per-card
 * accent (e.g. PABLO violet on the Products card) sits on the
 * surrounding chrome (border, CTA, accent dot) while the logo itself
 * carries its own gradient identity.
 *
 * Source: public/assets/pablo-logo.svg
 *
 * Internal <style> wrapped in a JSX template literal so the literal
 * `{}` inside the CSS don't break JSX parsing. Inline gradient defs
 * scoped under the component so multiple instances on the same page
 * each render correctly (the id is unique within the doc tree).
 */
export function PabloLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 200" aria-hidden="true">
      <defs>
        <style>{`
          .pablo-logo-fill { fill: url(#pablo-logo-gradient); }
        `}</style>
        <linearGradient
          id="pablo-logo-gradient"
          x1="8.28"
          y1="100"
          x2="391.72"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fbb45d" />
          <stop offset=".12" stopColor="#f69247" />
          <stop offset=".24" stopColor="#f37a38" />
          <stop offset=".31" stopColor="#f27233" />
          <stop offset=".31" stopColor="#f17134" />
          <stop offset=".4" stopColor="#f16b55" />
          <stop offset=".49" stopColor="#f0666c" />
          <stop offset=".58" stopColor="#f0637b" />
          <stop offset=".65" stopColor="#f06380" />
          <stop offset="1" stopColor="#af5fa0" />
        </linearGradient>
      </defs>
      <path
        className="pablo-logo-fill"
        d="M196.7,114.64h-4.44c.75-.05,2.33-.13,4.44,0ZM389.22,57.56h-88.89c-.09,0-.17,0-.26,0-15.52.13-28.11,12.8-28.11,28.35s12.73,28.37,28.37,28.37,28.36-12.73,28.36-28.37c0-9.68-4.88-18.25-12.3-23.36h72.83c1.38,0,2.5-1.12,2.5-2.5s-1.12-2.5-2.5-2.5h0ZM323.69,85.92c0,12.89-10.48,23.37-23.36,23.37s-23.37-10.48-23.37-23.37,10.48-23.36,23.37-23.36,23.36,10.48,23.36,23.36ZM197.15,109.64h-5.12c1.14-.08,2.91-.13,5.12,0ZM283.27,109.64h-30.2V24.48c0-1.38-1.12-2.5-2.5-2.5s-2.5,1.12-2.5,2.5v85.16h-6.06c-1.27-15.94-14.66-28.54-30.94-28.54s-29.67,12.6-30.94,28.54h-14.6l-.16-49.84c0-.12,0-.24-.02-.36-.04-.32-.15-.63-.3-.9-.14-.24-.32-.46-.54-.65-.09-.09-.19-.16-.3-.23l-51.03-33.3c-.76-.5-1.75-.54-2.55-.1-.81.43-1.31,1.28-1.31,2.19v30.82H10.78c-1.38,0-2.5,1.12-2.5,2.5s1.12,2.5,2.5,2.5h98.54v95.85c0,1.16.79,2.16,1.91,2.43.19.05.39.07.59.07.91,0,1.78-.5,2.22-1.34l23.17-44.64h23.34l.14,43.49c0,1.38,1.12,2.49,2.5,2.49h0c1.38,0,2.49-1.12,2.49-2.5l-.14-43.48h14.88l7.76,43.92c.02.1.04.2.07.3,3.49,11.38,13.88,19.16,24.97,19.16,1.06,0,2.13-.07,3.2-.22,9.89-1.35,18.15-8.81,21.05-18.99.03-.11.06-.23.07-.34.5-3.58,2.25-22.17-12.18-36.51-3.19-3.17-6.58-5.55-9.94-7.32h67.84c1.38,0,2.5-1.12,2.5-2.5s-1.12-2.5-2.5-2.5h0ZM114.32,31.07l40.15,26.2h-40.15v-26.2ZM133.49,110.95h0l-19.17,36.93V62.27h44.44l-25.27,48.68ZM139.81,109.64l20.6-39.69.13,39.69h-20.73ZM221.85,125.5c12.69,12.62,11.11,29.49,10.77,32.11-2.39,8.19-9,14.16-16.87,15.24-9.79,1.33-19.51-5.24-22.67-15.31l-7.57-42.9h6.75c.75-.05,2.33-.13,4.44,0,6.05.35,16.55,2.31,25.15,10.86ZM185.16,109.64c1.26-13.19,12.39-23.54,25.91-23.54s24.66,10.35,25.92,23.54h-51.83Z"
      />
    </svg>
  )
}
