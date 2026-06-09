# Impilo findings

**Status:** Limited. The available tooling (WebFetch / WebSearch) returns
parsed markdown rather than rendered CSS, computed styles, or live
animation traces. A proper live inspection of impilo.health would require
a headless browser (Playwright) that I do not have configured access to in
this session.

**What I did instead:**

1. Confirmed via WebFetch that impilo.health exists and the navigation
   structure matches the brief's description (Solutions / About / Blog /
   Request Demo, etc.).
2. Applied **well-established modern web patterns** for each of the
   mechanics the brief calls out, calibrated to land in the same ballpark
   as the brief's stated values.
3. Erred on the side of "build it, refine the numbers when Chris can do a
   side-by-side compare." Every animation timing in the implementation is
   a CSS variable or named const so individual values can be tuned in one
   place without restructuring code.

The patterns below are documented as **how I implemented them in NZA**,
not as observed values from Impilo. Where the brief specified a number,
I used that. Where it described intent in plain language, I picked
sensible defaults.

---

## Pattern 1 — Hero cycling product preview

**Implementation:**
- Two-column hero grid, 45/55 split at desktop; stacks at <1024px.
- Right column: `BrowserFrame` component — stylised browser chrome
  (3 grey traffic-light dots, semi-transparent URL bar shape) wrapping
  a 16:10 screen viewport.
- Three screens cross-fade. Hold = **4500ms** per screen (brief spec).
  Cross-fade duration = **600ms** with `cubic-bezier(0.16, 1, 0.3, 1)`.
- Hover on the frame pauses the cycle. Mouseleave resumes from the
  current screen with the timer reset.
- Progress indicator: three thin segments at the bottom of the frame,
  3px tall × ~52px wide each, 4px gap. The active segment fills with the
  accent colour over the 4.5s hold (CSS animation `width 0 -> 100%` on
  the inner fill). Inactive segments at 20% opacity of accent. Each
  segment is a `<button>` that jumps to that screen and resets the timer.
- Screens are loaded from `/public/images/products/{slug}/screen-NN.png`
  if available, otherwise a placeholder rectangle with the screen's
  short label in mono micro-copy.

---

## Pattern 2 — Centred transition headline with hard cut

**Implementation:**
- Full-bleed section, padding ~140/100 vertical, centred content.
- Background matches the product canvas (aubergine PABLO / deep navy
  NZ:AI / cream-warm decodED).
- The NEXT section's background changes hard with no gradient or border
  treatment between them. CSS handles this naturally — each section
  declares its own background, and they sit adjacent.
- Headline uses the existing `MaskReveal` upward mask-reveal so it
  arrives as it scrolls into view.
- Mono micro-label sits 28px above the headline, accent colour, 11px,
  letter-spacing 0.2em.

---

## Pattern 3 — "Let's show you" inline pill section

**Implementation:**
- Full-bleed cream section, 120/120 vertical padding, centred composition.
- Single flex row at desktop: `<span>Let's show you</span>` →
  `<button>Request Demo</button>` → `<span>how we do it</span>`.
- Pill button uses `display: inline-flex; align-items: baseline` so it
  sits visually centred against the surrounding text.
- Pill padding 14/28, border-radius 999px, 0.5px solid accent, transparent
  at rest, fills with accent on hover with white text.
- Pill font size 20px (vs 56px headline) so it reads as inset.
- At <768px the row wraps and the pill sits on its own line, centred.

---

## Pattern 4 — Four-step request-demo flow (the main pattern)

**Implementation chosen: per-step row with sticky illustration column.**

Each step is its own viewport-tall row using CSS Grid (45/55 split).
The right column (illustration) is `position: sticky; top: 22vh`
WITHIN that row so it stays pinned while the user scrolls the row's
height. The text column has natural height and scrolls normally.

When the step's row ends, the sticky illustration releases and the
NEXT step's illustration takes over — naturally, because it's the next
row's sticky element.

This gives "scrollytelling" feel without needing scroll-driven JS:
each illustration pins for its row's scroll range, then the next one
pins for its range.

**Step structure (text column):**
- Top row: small icon glyph (top-left, 32px square, 1.5px stroke,
  accent or navy) + step number (top-right, 14px mono navy 60%).
- Headline: Stolzl 500, 38px desktop / 28px mobile. The **highlighted
  verb** is wrapped in `<span class="step-verb">` which picks up
  `var(--step-verb-colour)` (set per product context).
- Body: Inter 17px, navy 70%, 1.55 line-height, max-width 440px.

**Step illustration (right column):**
- Square frame 440×440 desktop, border-radius 12px, 0.5px solid accent
  at 40% opacity, cream-elevated background.
- Placeholder line-art: simple SVG geometric form suggesting the step's
  concept. Real illustrations slot in by replacing the SVG.

**Arrival animation per step:**
- IntersectionObserver-driven via `MaskReveal`, threshold 0.3.
- Icon + step number fade in (400ms) together.
- 120ms later headline mask-reveals upward.
- 80ms after that body paragraph mask-reveals upward.
- 200ms after that the illustration frame fades in (600ms) and the SVG
  inside fades in alongside.

`prefers-reduced-motion` short-circuits all of the above — content
appears instantly.

---

## Pattern 5 — Hard colour cuts between sections

**Implementation:**
- Each section declares its own background-color and vertical padding.
- No special treatment at the boundary (no rule, no shadow). The
  contrast is what makes the cut read.
- Vertical padding per section follows the brief's calls (~140 top /
  ~100 bottom for the transition section; ~120/120 for the "Let's
  show you" section; ~80/140 for the four-step section).

---

## Pattern 6 — Closer / credibility section

**Implementation:**
- Full-bleed section, returns to the product's canvas colour.
- For PABLO + NZ:AI: dark canvas with ambient blob field (same
  technique as the landing-page hero).
- For decodED: stays cream-warm with no blob field.
- Section micro-label, centred headline, subheading, client logos row
  (PABLO / NZ:AI) OR pilot CTA (decodED), closer Get-in-touch pill CTA.
- Client logos use the existing `/public/assets/clients/*.svg` files
  in mono cream at 60% opacity.

---

## Pattern 7 — Type system

**Implementation uses NZA's existing tokens:**

| Role | Family | Size | Weight | Letter-spacing |
|---|---|---|---|---|
| Product name (hero) | Stolzl | clamp 44, 6vw, 72 | 500 | -0.025em |
| Tagline (italic) | Times New Roman | 26 | 400 italic | -0.005em |
| Transition headline | Stolzl | clamp 48, 5.5vw, 64 | 500 | -0.02em |
| "Let's show you" headline | Stolzl | clamp 40, 4.5vw, 56 | 500 | -0.02em |
| Request Demo pill | Stolzl | 20 | 500 | 0.01em |
| Step headline | Stolzl | clamp 28, 3vw, 38 | 500 | -0.015em |
| Step body | Inter | 17 | 400 | 0 |
| Mono micro-label | IBM Plex Mono | 11 | 500 | 0.2em (uppercase) |
| Step number | IBM Plex Mono | 14 | 500 | 0.05em |

Tabler Icons NOT added as a dependency. Inline SVG paths used for the
step icons — simple enough to render directly.

---

## Pattern 8 — Responsive breakpoints

**Implementation uses the project's existing breakpoint convention:**
- `<1024px`: hero columns stack
- `<768px`: pill wraps to own line, step rows stack (text on top,
  illustration beneath), step illustrations scale to ~88% viewport
- `<600px`: full mobile tier (existing project convention)

---

## What I didn't capture

- Exact cubic-bezier values from impilo.health
- Exact scroll-mechanic for their step section (sticky vs. JS-driven
  scrollytelling)
- Whether Impilo uses CSS `scroll-snap` anywhere
- Any micro-animations on their illustrations (mine are static; this
  is an upgrade path)

If a follow-up Playwright-equipped session can confirm these,
the timings and easings are all CSS variables that can be tuned
without restructuring.
