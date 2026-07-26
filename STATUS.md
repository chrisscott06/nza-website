# STATUS.md

## Last completed chunk

**decodED + landing polish (July 2026, Co-Work session).** Five requests
from Chris:
1. **Landing "How we work" — Decode infographic reworked.** The 5×5
   Decode grid no longer just fades in; the 25 dots start scattered
   (golden-angle offsets) and drift in from all directions to assemble
   into the grid with a staggered, eased cascade.
   `HowWeWorkVisuals.tsx` (dots are now `<g>` wrappers) + `landing.css`
   (`decode-dot-assemble` keyframe).
2. **decodED manifesto emphasis → orange.** `<em>right hands</em>` (was
   just "right") now renders in decodED orange `#E8743C` instead of the
   site-default coral, scoped via `.manifesto-block--decoded ... em`.
   Italic + Times fingerprint preserved. `decodedConfig.tsx` +
   `manifesto-block.css`.
3. **Tooltip redesigned.** The "climate action plan" trigger is now a
   button that opens an on-brand popover (cream card, green text, orange
   gov.uk link) on hover OR click/tap — and no longer navigates itself;
   only the in-popover link goes to gov.uk. Closes on outside-click /
   Escape; works on touch. `Tooltip.tsx` + `tooltip.css` (new API:
   `label` prop replaces the child `<a>`).
4. **Manifesto full-screen lock.** The coloured manifesto block now
   holds static + fully visible for a 60vh beat (runway 200vh→260vh)
   before the existing cream/parallax handoff runs, so it reads as a
   deliberate "snap and hold" like the landing between-screen snap.
   `ManifestoBlock.tsx` (LOCK phase in the text-y JS) +
   `manifesto-block.css` + `product-page.css` comment. Applies to all
   three product pages. *Lock duration is tunable — flag from Chris:
   he was unsure of the exact feel; may push toward a harder snap.*
5. **Landing solutions reorder + copy.** Order is now PABLO / NZ:AI /
   decodED (was PABLO / decodED / NZ:AI); intro reworded away from
   "Three tools we've built…" to "Different challenges call for
   different answers…". `ProductsScreen.tsx`.

Typecheck + prod build clean. Verified in-DOM (computed styles) — live
animation/IO couldn't be screenshotted in the headless pane.

---

## Previous chunk

**Product page template — overnight build, 3 pages live.** New shared
`<ProductPage>` template populates `/pablo`, `/nz-ai`, `/decoded` from
per-product config objects. All five sections per brief
(`docs/briefs/nza-product-page-template-brief.md`). All 11 product
screenshots Chris dropped during the build are wired up and cycling.
Companion Impilo investigation brief at
`docs/briefs/nza-impilo-investigation-brief.md` — see
`docs/impilo-findings.md` for the upfront limitation (no Playwright
available, built using brief specs + standard scrollytelling patterns).

What landed:
- `src/components/product/ProductPage.tsx` — config-driven five-section
  template (hero, transition headline, "Let's show you" inline-pill
  section, four-step scrollytelling, closer)
- `src/components/product/BrowserFrame.tsx` — cycling product preview:
  4.5s hold, 600ms cross-fade, hover-pause, progress segments
  click-to-jump, graceful PNG fallback via onError
- `src/components/product/ProductStep.tsx` — coordinated arrival on
  scroll-in (single observer per row → all children stagger from
  shared `.is-revealed` class with their own transition-delays)
- `src/components/product/ProductIcons.tsx` + `ProductIllustrations.tsx`
  — 12 inline Tabler-style icons + 12 placeholder line-art SVGs (one
  per step concept)
- `src/data/products/{pablo,nzai,decoded}Config.ts` — locked copy +
  per-product palette per brief
- `src/routes/ContactPage.tsx` — stub for the Request Demo flow
  (reads `?product=` and adapts the mailto)
- `src/components/SiteFooter.tsx` — site-wide footer (brief said
  inherit from existing component, but none existed)
- `src/styles/product-page.css` — ~700 lines covering all five
  sections + decodED light variant overrides
- `docs/impilo-findings.md` + `docs/decisions-log.md` — investigation
  notes, limitations, and every place the implementation differs
  from the brief

Real screenshots wired up by end of build:
- PABLO (4): home, flow, financial, optimise
- NZ:AI (4): map, waterfall, data-quality, trajectory
- decodED (3): map, map-2 (3D buildings), dashboard

Commits on `origin/main` (see git log for full list — roughly 20
commits across the night, each at most one logical change so the
morning review is reversible chunk-by-chunk if anything is off).

Heads-up flags for the morning review:
1. **/pablo + /nz-ai were full bespoke pages before tonight.** This
   brief explicitly says they should be populated using the template,
   so I replaced them. Earlier in the session Chris said "leave them
   alone" for the nav rebuild — I went with the *new* brief since
   it supersedes. Old route components still in git history if
   reverting is wanted.
2. **No live Impilo Playwright inspection happened** (no headless
   browser available). Animation timings + scroll mechanics are best-
   effort matches to the brief's stated values. All timings live as
   CSS variables / named consts so a side-by-side compare can re-tune
   them in one place.
3. **Real step illustrations are placeholder line-art** per brief
   first-build allowance. Real artwork from Leo Morgan / dawn.design
   slots in by replacing the SVG paths in `ProductIllustrations.tsx`.

## Previously completed (next-most-recent)

**Site-wide navigation system — 8 chunks landed.** New `SiteNav` mounted above every route. Sticky header, context-adaptive logo recolour, glassmorphic dropdowns, per-context CTA variants, mobile mark-as-trigger menu, three stub pages so all nav links resolve. Brief at `docs/briefs/nza-navigation-brief.md`.

Commits on `origin/main`:
- `fb9f256` — chunk 1: foundation (`NzaLogoWide` + `NzaLogoMark` SVG components, `useContextClass` hook, brief stored)
- `3ed9bd5` — chunk 2: `SiteNav` shell mounted in App.tsx, sticky positioning + layout, context body class plumbing per page, old FloatingNav unwired from PABLO + NZ:AI
- `ff50d6f` — chunk 3: logo per-group recolour (mark/net/zero + advisory separately) wired to `body.context-*` classes — the "signature move"
- `61466f5` — chunk 4: dropdowns (Our products + About us), glassmorphic panels with hairline coral border, hover-open + 150ms grace close, Escape dismiss, gradient/teal/green swatches per product
- `aaf1f7a` — chunk 5: CTA per-context variants (outlined coral/violet/teal on dark, solid coral/orange on light)
- `78434f4` — chunk 6: mobile menu — `NzaLogoMark` swapped in as the trigger, full-screen overlay slides down, flat layout with section labels + product swatches, body-scroll-locked while open, route-change auto-closes
- `8da9e95` — chunk 7: stub pages (`/decoded` context-decoded, `/about` + `/clients` context-cream), old `FloatingNav.tsx` + `MobileNavMenu.tsx` deleted
- (this) — chunk 8: a11y + verification — visible focus rings on every interactive element (previously suppressed by `outline: none`), 36px min nav touch targets, 44px min mobile menu items, `prefers-reduced-motion` swept across base, dropdowns, mobile menu, logo recolour transitions

## Previously completed

**NZ:AI product page — 8 chunks landed.** New `/nz-ai` product page mirroring `/pablo` structurally. Eight sections per the brief at `docs/briefs/nz-ai-page-brief.md`, copy from v8 at `docs/briefs/nz-ai-copy-v8.md`.

Commits on `origin/main`:
- `615d68f` — chunk 1: route + shell + brief/copy stored in docs
- `72998a1` — chunk 2: hero + closing CTA
- `cfb07e6` — chunk 3: Sections 2 (Opportunity) + 3 (What It Is)
- `295ca27` — chunk 4: Section 4 (How It Works) with Discovery weighted
- `c1ef2c4` — chunks 5–7: What It Does + Who It's For + Why Now
- (this) — chunk 8: Products card rewire to `/nz-ai`, voice audit, verification

**Voice rewrite pass:** all v8 "we"/"us"/"our" instances rewritten to third-person; final audit (`grep -nwE "we|us|our"` excluding JSX comments) returns zero in user-facing copy. Two notable rewrites flagged:
- Closing CTA: rewritten to preserve "together" warmth without "we" — *"…to work out together whether a discovery sprint suits, or something else fits the situation better."*
- Quiet link to Clients: brief specified *"See who we work with →"* verbatim — rewrote to *"See NZA's clients →"* to keep the no-first-person rule.

**AI mention budget:** exactly three on the page — Discovery card *"AI accelerates the build"*, Stewardship card *"rate at which AI is changing what's possible"*, plus the brand name "NZ:AI" itself. No extras.

**Italic emphasis** rendered via the existing site convention (Times New Roman italic, coral) rather than the brief's DM Serif Display — keeps the typographic fingerprint consistent across the website. Words italicised per brief: *act on* (hero), *see* (S2), *your* (S3, instead of "you" since v8 has no standalone "you"), *you* (S4), *questions* (S5), *more* (S6), *caught up* (S7), *fit* (S8).

**Visual placeholders:** every section's visual is a navy card with a thin coral rule and a monospace label, aspect-ratio-matched to the final asset so layout doesn't shift on delivery — hero animation, before/after, configuration sequence (4 client frames with gradient-sampled border colours), three-phase diagram (inline SVG), three screenshot tiles for What It Does.

**Products card** on the home page rewired: NZ:AI card now `<Link to="/nz-ai">` (was `<a href="#">`). PABLO card was already wired.

**Out of scope (per brief):** final hero animation, demo screenshots, configuration sequence visuals, three-phase diagram production version, Calendly/contact form (CTA uses `mailto:chrisscott@thenza.co.uk` for launch), SEO meta, Open Graph cards. All scaffolded so visual delivery is a one-for-one swap.

## Previously completed

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
