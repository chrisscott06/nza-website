# STATUS.md

## Last completed chunk

**End-to-end port — all 7 staged chunks landed in one autonomous session.**

Commits on `origin/main`:
- `c0a47f8` — stage 1 scaffold
- `938fa2c` — fix orphan brace blocks in nza-website.css
- `224fd6f` — CLAUDE.md + STATUS.md
- `317dac5` — design briefs into docs/
- `a8c930a` — stage 2 routing + nav + 5 placeholder screens
- `f24ab3c` — snap-paging (wheel + key + smooth-scroll)
- `e01e1e9` — fix `.headline em` font-family to DM Serif Display
- `c198afd` — stage 3 full screen content (static)
- `3111f66` — stages 4 + 5: animations and clients carousel
- (pending) PABLO page + production build hygiene

## Current state

The site mirrors the Claude Design prototype end-to-end. All five website screens and the eight-section PABLO page are live. `npm run build` is green.

### What's working

- **Routing** — `/` (5-screen website) and `/pablo` (8-section product page). React-router with SPA rewrite for Vercel.
- **Floating pill nav** with NZA wordmark — inverts colour on navy screens, highlights the active section, smooth-scrolls between screens.
- **Snap-paging** — wheel/arrow keys/Page/Space step one screen at a time over 700ms easeOutCubic. Bypassed when an Approach card is open, on viewports ≤720px, and on `prefers-reduced-motion`.
- **Home** — hero text reveal, hero-mark watermark, three-curve marque overlay (energy transition · climate change · digital intelligence) fades in/out via CSS animation off `#home.in-view`.
- **Expertise** — full GHG Protocol value-chain diagram (~920-line SVG, JSX-camelcased) with the 6-layer sequenced reveal animation (~3.8s) on first view.
- **Approach** — 6-card capability grid. Click any card → in-place expand to a panel showing lead text, body, and three lens columns (Data / Tools / Strategy). Card #6 ("Co-built platforms") wears the navy disrupt register. Esc and × both close.
- **Products** — three product cards (PABLO, NZ:AI, decodED) with proper logos, taglines, and CTAs. PABLO card routes to `/pablo`.
- **Clients** — auto-rotating logo ribbon at 24px/s, hover pauses, manual prev/next nudges by one cell. Click any logo → popover modal with sector, context, what-we-did, capability chips, period · engagement · scope chips. Esc and backdrop close.
- **PABLO** — 8 sections (hero with bill-explosion SVG, decomposition stack, strategic transition, test-an-intervention with toggles + load + battery charts, lifecycle case with assumption sliders, breadth canvas auto-cycle, why PABLO, who-it's-for, CTA). Hand-built SVG charts driven by `pablo-charts.js` (62KB IIFE), injected via dynamic `<script>` in a useEffect after the React DOM mounts.

### Known gaps / things I made calls on

- **PABLO chart engine** is loaded as the original IIFE (in `public/pablo-charts.js`) injected via script tag. It works because useEffect runs after React commits the DOM, so the chart targets exist when the IIFE queries them. If user navigates between `/` ↔ `/pablo` repeatedly, the script re-injects and re-runs each time — IO observers from previous mounts will be GC'd as their target elements unmount, but if you notice memory creep we should refactor the IIFE into named exports later.
- **GHG Protocol diagram** carries `// @ts-nocheck` — the source SVG uses the `isolation` presentation attribute which is valid SVG2 but isn't in React's static SVG types. Runtime is fine.
- **`@import` order in colors_and_type.css** — Google Fonts `@import` is now first in the file (PostCSS strict), with the comment moved alongside.
- **ProductsScreen.tsx** has Tweaks panel removed entirely (was a Claude Design host UI, not production).

## Next chunk (when Chris is back)

**QA pass and Vercel deploy:**

1. **Browser verification scenarios** for each screen — see CLAUDE.md.
2. **Lighthouse audit** on localhost, then again on a Vercel preview URL.
3. **Connect repo to Vercel**, configure custom domain.
4. **Confirm `prefers-reduced-motion: reduce`** behaviour on every animation hook.
5. **Mobile behaviour** at ≤720px — snap-paging disabled, native scroll, nav links wrap.

After QA / launch, **stage 6** would be:
- Refactoring `pablo-charts.js` into typed ESM modules under `src/pablo/charts/` so future React PABLO components (the ones Chris has elsewhere) can import individual chart functions and pass real data.
- Wiring real client logo data when full SVGs land.

## Known issues

- **Multiple background dev server instances** from sessions held ports 5173–5179. Harmless, but `taskkill /im node.exe /f` between sessions clears the slate.
- **Line-ending warnings** on every commit (LF→CRLF). A `.gitattributes` would silence them; not blocking.
- **GhgProtocolDiagram.tsx is `// @ts-nocheck`-d** — only on that file. The rest of the codebase passes strict typecheck.

## Suggestions (not implemented)

- Add `.gitattributes` with `* text=auto eol=lf` and OTF/PNG/SVG marked as binary.
- GitHub Actions: `tsc --noEmit` + `vite build` on every PR.
- Once Vercel is live, set up Lighthouse CI on previews.
- Consider extracting `pablo-charts.js` into typed ESM modules so each chart is its own React component (post-launch).
