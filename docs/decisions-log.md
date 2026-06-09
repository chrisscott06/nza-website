# Product page template — decisions log

Tracks places the implementation differs from the original brief, with
one-line rationale per decision. Reviewable in the morning.

## Investigation step

- **Skipped live Playwright inspection of impilo.health.** No headless
  browser tooling available in this session; WebFetch only returns parsed
  markdown. Documented as a limitation in `impilo-findings.md` and built
  using the brief's specifications + well-known modern web patterns.
  Every timing value is a CSS variable so refinement is one-line change
  per value when a live compare is possible.

## Template structure

- **Single `<ProductPage>` component reading a config object** as the
  brief recommends. Configs live in `src/data/products/{slug}Config.ts`.
- **Reused existing nav system** (`SiteNav`) — already context-aware via
  body class, no work needed at the page level.
- **Replaced existing `/pablo` and `/nz-ai` pages** with the new
  template per the brief. The previous bespoke PABLO charts page and
  NZ:AI page are gone from the user-facing routes; their components
  remain in git history if Chris wants to reference. **Flag for review:**
  this is a significant change from the earlier "leave PABLO and NZ:AI
  alone" instruction — the new brief explicitly says they should be
  populated using the template, so I followed the new brief.

## Hero

- **Browser frame chrome:** three grey dots (not the realistic Mac
  red/amber/green colours) per brief.
- **Screen cross-fade:** 600ms per brief, easing `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Hold:** 4500ms per brief.
- **Placeholder screens** rendered as accent-tinted rectangles with the
  screen's short label in mono — exactly per brief's first-build allowance.
- **No real screenshots loaded.** Path convention `/public/images/products/{slug}/screen-NN-{name}.png` matches the brief. When Chris drops real PNGs at those paths, they'll appear.

## Centred transition headline

- Implemented exactly as specified.
- **decodED:** uses a slightly different cream-warm shade for the section
  AFTER it (`#FAF5EB` cream, slightly distinct from `#F3EFE3` cream-warm
  canvas) so the cut is visible but not high-contrast — per brief
  Section 7.

## "Let's show you" pill section

- **Pill position:** `display: inline-flex` with `align-items: baseline`
  for proper inline alignment with surrounding text.
- **Pill text size:** 20px (vs 56px headline) so it reads as inset.
- **Mobile (<768):** brief calls for the pill to sit on its own line
  centred between two text lines. Implemented via flex-wrap.
- **Contact link:** `/contact?product={slug}` per brief.

## Four-step section

- **Scroll mechanic:** sticky illustration column inside each step row.
  Each step row is min-height 100vh, right column has
  `position: sticky; top: 22vh` so the illustration pins while the user
  scrolls the row's height.
- **Reasoning:** matches brief's "right column appears to be sticky/pinned
  during each step's scroll range" without needing scroll-driven JS
  (which would have been needed for a full Impilo-style scrollytelling).
- **Arrival animation:** IntersectionObserver via MaskReveal, 30% threshold.
  Icon + step number → headline → body → illustration, staggered as
  brief specifies.
- **Icons:** inline SVG paths (Tabler-style) instead of adding Tabler
  Icons as a dependency. Six icons hand-built: map, bolt, currency-pound,
  rocket, target, list-check, chart-line, map-pin, building, chart-pie,
  list-numbers, map-2.
- **Verb highlighting:** `<span class="step-verb">` with
  `var(--step-verb-colour)` set on the page-wide root via the config.

## Closer / credibility

- **PABLO + NZ:AI:** client logos pulled from `/public/assets/clients/*.svg`
  (the existing landing-page client library). Filter applied:
  `brightness(0) invert(1) opacity(0.6)` to render cream-monochrome.
- **decodED:** no client row, only pilot CTA per brief.

## Type scale

- Used existing `--font-display` (Stolzl), `--font-italic` (Times New Roman),
  `--font-body` (Inter via Inter Tight) tokens.
- Mono micro-labels use a stack: `IBM Plex Mono, ui-monospace, ...` since
  IBM Plex Mono isn't in the project's font files. Fallback is sensible.

## Colours

- All per-product palettes match the brief and the nav system's existing
  context CSS variables.
- decodED uses orange `#E8743C` for verb highlighting (not the deep green
  body colour) per brief Section 4 verb-highlighting rule.

## What I deferred

- **Real product screenshots** — ALL SHIPPED. Chris dropped PNGs into
  `/public/images/products/{slug}/` during the build and the configs
  were wired up as each arrived:
    - PABLO (4 screens): home / flow / financial / optimise
    - NZ:AI (4 screens): map / waterfall / data-quality / trajectory
    - decodED (3 screens): map / map-2 / dashboard
  All product pages now cycle real screens. No placeholders left
  rendering for first-build purposes.
- **Real step illustrations** — 12 placeholder line-art SVGs shipped
  in `ProductIllustrations.tsx` per brief allowance. Real artwork
  slots in by replacing the inline paths.
- **Demo capture form / contact flow** — out of scope per brief. The
  `/contact?product=...` stub uses mailto + a copy-email button as
  the bridge.
- **Site footer** — brief says inherit from existing component but
  no such component exists. Page ends after the closer section.
  Flag for follow-up.
- **Live Lighthouse run** — can't execute without a browser.

## Refactor history

- Per-element `MaskReveal`s in the four-step section gave bad
  arrival timing (each element's IntersectionObserver fired on its
  own viewport entry, dependent on scroll speed rather than the
  brief's intent). Refactored to a single observer per step row in
  `ProductStep.tsx` — when the row crosses 25% in viewport, the
  whole row's `.is-revealed` class fires all child arrival
  transitions with their own staggered transition-delays. Matches
  the brief's "icon at 0ms → headline at 120ms → body at 200ms →
  illustration at 400ms" intent precisely.

- BrowserFrame initially rendered placeholders only when `src` was
  missing in config. Added an `onError` handler that flags broken
  screens at runtime so the placeholder takes over the slot even if
  the PNG path is set but the file doesn't exist. Means the moment
  a PNG drops at the expected path it just works without code change.
