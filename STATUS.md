# STATUS.md

## Last completed chunk

**Expertise: Molson-style zone panel + hoverable quadrants + type-scale plan** (`7109e33`).

Iteration on the Expertise interactive (built in `9691bba`) per Chris's review:

- Zone panel restyled to feel like a Molson Scope 3 callout — upright Stolzl Medium coral title (was DM Serif italic), body text dropped 13 to 11.25px, width trimmed 312 to 216px so the panel fits inside its zone slice. Background is now translucent cream (rgba 0.94) with backdrop-blur, so the illustration shows through faintly.
- Hoverable quadrants: new `.ghg-zone-hits` overlay layer adds four invisible buttons over each zone's x-slice. Hovering anywhere within a zone triggers the same panel reveal as the label button above. Z-stack: SVG (0) → glow (1) → hits (3) → panel (4).
- Right-column squeeze fix on Expertise: `#capabilities`-scoped overrides shrink the text column max-width 480 to 360, headline to `clamp(28px, 3vw, 42px)`, lede to `clamp(14.5px, 1vw, 16px)`. The diagram size is unchanged — just less weight on the right.
- Type-scale plan drafted at `docs/briefs/type-scale-recalibration-plan.md`. Two-tier proposal (Hero / Inner-screen). Home unchanged; Expertise / Approach / Products / Clients drop ~30% on headline + lede. Awaiting Chris sign-off before implementing.

## Previously completed

**Phone redesign — 4 commits.** Two-tier responsive system with the boundary at 600px. iPad and half-screen browsers ride the desktop layout; phones get a properly-designed experience.

Commits on `origin/main`:
- `3bcdaf4` — phone redesign 1/4: foundation. Breakpoint migration to 599px, `useMediaQuery` hook, `useSnapPaging.shouldSnap()` gate (mouse-primary only), `.screen` min-height removed at <600.
- `311e89a` — phone redesign 2/4: hamburger nav for <600px. `MobileNavMenu` portal-rendered overlay, `FloatingNav` viewport-switch.
- `b84b52f` — phone redesign 3/4: full-screen Approach modal. `MobileApproachModal` slide-up panel with header / coral icon disc / lead / body / 3 stacked lens sections; back button + Esc + swipe-down + backdrop tap close. `ApproachGrid` viewport-switch.
- (this) — phone redesign 4/4: docs.

Earlier work (preserved):
- 28+ commits since the initial scaffold. The full prototype is ported with 5 screens, GHG reveal, marque overlay, capability grid expand, clients carousel + popover, and the 8-section PABLO page.

## Current state

The site renders three coherent experiences:

| Viewport | Layout | Snap-paging | Approach detail | Nav |
|---|---|---|---|---|
| Desktop ≥600 + mouse | Full editorial multi-column | On | In-place expand | Pill |
| iPad / touch ≥600 | Full editorial multi-column | Off (touch) | In-place expand | Pill |
| Phone <600 | Single-column, content-tall sections | Off | MobileApproachModal | Hamburger → MobileNavMenu |

Two CSS breakpoints in active use: `(max-width: 599px)` for phone, `(max-width: 1023px)` for two documented exceptions (the marque overlay and the product cards 3-col).

`npm run build` green. Typecheck green.

## What's working

- **Routing** — `/` and `/pablo`. SPA rewrite for Vercel via `vercel.json`.
- **FloatingNav** — pill at ≥600 (logo + 5 link pills), hamburger at <600 (logo + 3-line button).
- **MobileNavMenu** — portal-rendered full-screen overlay, dark navy ground with backdrop-blur, 5 large editorial-type links. Esc / backdrop / link / × all close. Body scroll-locked while open. Reduced-motion respects.
- **Snap-paging** — mouse-primary desktop only via `shouldSnap()` (innerWidth ≥600 AND `(hover: hover)` AND `(pointer: fine)`).
- **Home / Expertise / Approach (closed) / Products / Clients** — all five screens render correctly across viewports. Phone sections are content-tall.
- **ApproachGrid** — desktop expands in-place; phone opens MobileApproachModal. Same state machine.
- **MobileApproachModal** — slide-up panel, sticky header with circular back button, coral icon disc, lead in DM Serif 24px, body, 3 lens sections stacked. Disrupt variant (card #6) goes navy. Swipe-down dismisses.
- **Clients carousel** — auto-rotates, hover-pauses on desktop. (Touch-pause + arrow hide on phone still pending — was deferred from this chunk.)
- **DevicePreview** — bottom-right floating phone-icon button (dev-only, tree-shaken from prod). Opens an iframe at preset device sizes for verification.

## Known gaps / things still to do

- **Carousel touch-pause + swipe** — deferred from the responsive plan; needed so phone users can pause auto-rotation by holding the carousel.
- **PABLO chart sections on phone** — currently still render but the hardcoded 1100×400 viewBox SVGs squash badly at phone widths. Plan calls for a "view on a larger screen" placeholder card on phone for the 4 chart-heavy sections (Decomposition, Test, Lifecycle, Breadth). Not yet implemented.
- **GHG diagram on phone** — currently still renders. Likely should be hidden or shown smaller; defer the call until eyes-on the phone hero+section.
- **Phone landscape special-casing** — sections are content-tall now, so should self-resolve. Eyeball after wider testing.
- **Touch targets** — popover close (Clients) and PABLO pause button still small. Bump to 44×44 next pass.
- **GhgProtocolDiagram.tsx** still carries `// @ts-nocheck` for the SVG2 `isolation` attribute. Rest of codebase passes strict typecheck.

## Next chunk (when Chris is back)

In rough priority order:
1. Carousel touch-pause / swipe support (mobile clients screen).
2. PABLO chart sections phone fallback card.
3. GHG diagram phone treatment decision.
4. Touch target audit (PABLO pause button, popover close).
5. Vercel deploy + custom domain wiring.

## Suggestions (not implemented)

- `.gitattributes` to silence the LF→CRLF commit warnings.
- GitHub Actions: `tsc --noEmit` + `vite build` on every PR.
- Once on Vercel, Lighthouse CI on preview URLs.
- Eventually refactor `pablo-charts.js` into typed ESM chart modules so future React PABLO components can import individual charts.
