# STATUS.md

## Last completed chunk

**Stage 2 — Routing skeleton + nav shell + 5 placeholder screens**

- `FloatingNav` component (`src/components/FloatingNav.tsx`) — pill-shaped nav with inline NZA wordmark, link list, accepts `activeId`, `onLinkClick`, custom `hrefFor` and `links` props so PABLO can override
- `NzaWordmark` SVG component (`src/components/svg/NzaWordmark.tsx`) — inline so `fill="currentColor"` inherits the host's text colour
- `useActiveScreen` hook (`src/hooks/useActiveScreen.ts`) — IntersectionObserver picks the most-visible screen, mirrors the prototype's tie-breaker logic, toggles `body.on-navy` so the nav inverts on navy screens
- `useHashScrollHandler` + `useInitialHashScroll` (`src/hooks/useHashScroll.ts`) — 700ms eased smooth-scroll on `#` link clicks; respects `prefers-reduced-motion`; also handles deep-links like `/#capabilities`
- 5 placeholder screen components (`src/screens/`) — eyebrow, headline (with italic-coral `<em>`), lede only. Real SVGs/animations/grids deferred to later stages
- `WebsitePage` route (`src/routes/WebsitePage.tsx`) — stitches them together
- `PabloPage` route (`src/routes/PabloPage.tsx`) — same nav shell, but link hrefs point back to `/#anchor`, "Products" link forced active
- `App.tsx` now routes `/` → WebsitePage and `/pablo` → PabloPage

## Current state

- Three commits on `origin/main`: `c0a47f8`, `938fa2c`, `224fd6f`, `317dac5` (docs/), and stage 2 commit pending
- `npx tsc --noEmit` passes clean
- Dev server boots in ~370ms; `/`, `/pablo`, and `/#capabilities` all return HTTP 200
- Active-section detection runs on scroll; nav highlights track the visible screen
- Hash links on the nav smooth-scroll between sections with a 700ms easeOutCubic curve
- Body class flips between default (paper) and `on-navy` automatically as the user scrolls between screens

## Next chunk

**Stage 3 — Port full screen content (still without animation/interactivity)**

- Home: hero text complete, hero-mark watermark `<div>`, marque overlay SVG (paths only — no animation), reveal-layer markers in place
- Expertise: GHG Protocol value-chain SVG ported into `<GhgProtocolDiagram>` component (~920 lines, JSX-camelcased, IDs preserved). No animation yet — just static render
- Approach: 6-card grid (closed state only — no expand interaction). Three-lens-mark image. Card #6 navy register
- Products: 3 product cards (PABLO / NZ:AI / decodED) with proper logos, taglines, CTAs
- Clients: static row of client logos (no carousel motion yet). Footer with NZA wordmark
- All copy lifted verbatim from the prototype HTML

After stage 3 the site should look pixel-identical to the source `nza-website.html`, but stand-still — no animations, no card-expand, no carousel rotation. Stage 4 then layers motion on top.

## Known issues

- Multiple background dev servers from earlier sessions are holding ports 5173–5177; new runs land on 5178+. Harmless, but worth `taskkill /im node.exe /f` before next session if the count keeps creeping. (Or leave it — Vite picks the next free port.)
- `package-lock.json` decision: tracked, will stay tracked. The bible's anti-lockfile rule is specifically about Linux Co-Work VMs polluting the file with Linux binaries; we install on Chris's Windows machine so the lockfile is correct. Future agents running outside this setup must follow the bible — edit `package.json` only and ask Chris to install.

## Suggestions (not implemented)

- Line endings: every commit produces "LF will be replaced by CRLF" warnings. Add a `.gitattributes` with `* text=auto` and `*.{ts,tsx,js,jsx,css,html,md,json} text eol=lf` to lock line endings to LF on disk regardless of OS.
- Once Vercel is connected, set up preview deploys on push so each chunk has a live URL for verification.
- Consider GitHub Actions: `tsc --noEmit` + `vite build` on every PR / push.
