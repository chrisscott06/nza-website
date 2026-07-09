# NZA Website — CLAUDE.md

The NZA marketing site. Five-screen editorial single-page site (Home, Expertise, Approach, Products, Clients) plus a PABLO product page. Ported from a Claude Design HTML/CSS/JS prototype into a Vite + React 19 + TypeScript + Tailwind 4 stack so PABLO React components can be embedded later.

## Environment

- **Project folder (Chris's Windows machine):** `C:\Users\ChrisScott\Dev\nza-website`
- **GitHub:** `https://github.com/chrisscott06/nza-website` (`origin/main`)
- **Stack:** Vite 8 + React 19 + TypeScript 5 + Tailwind 4 + react-router-dom 6
- **Dev server:** `npm run dev` → http://localhost:5173 (5174 if 5173 is busy)
- **Build:** `npm run build` (output: `dist/`)
- **Hosting target:** Vercel, custom domain TBC. SPA rewrite is in `vercel.json` so `/pablo` survives a refresh.
- **Source design bundle:** `C:\Users\CHRISS~1\AppData\Local\Temp\design-extracted\nza-design-system\project\` (read-only reference; do not edit). The locked spec is `uploads/nza-design-system.md` in that bundle.

## Responsive rules

Two tiers. The boundary is **600px** (one CSS variable: `--bp-phone`).

- **≥600px** — desktop / iPad / half-screen browser. Full editorial layout: multi-column hero, Capabilities with the GHG diagram, 3×2 capability grid, pill nav, in-place Approach card expand. Sizes scale via `clamp()`.
- **<600px** — phone. Redesigned, not stretched. Hamburger nav (`MobileNavMenu`), single-column sections, `MobileApproachModal` for capability detail, sections are content-tall (no `100dvh` lock).

**Snap-paging** is gated by `useSnapPaging.shouldSnap()`: viewport ≥600 AND `(hover: hover)` AND `(pointer: fine)`. Mouse-driven desktop only. iPad and phone scroll natively.

**Documented exceptions** (justify in a CSS comment if you add another):
- `.hero-marque` — hidden below 1024px (needs full desktop room).
- `.product-cards` — 3-col only at ≥1024px (cards too wide for 3-col on iPad portrait).

**Rules for new components:**
- Mobile-first. Build the single-column / phone layout first, layer multi-column on at `min-width: 600px`.
- Default new `@media` queries to `(max-width: 599px)`. Anything else needs a comment.
- Use `useMediaQuery` for JS-driven viewport-conditional rendering.
- Type via `clamp()` for anything bigger than body (16px). Body and small text use fixed px.
- Touch targets ≥44px on phone — no exceptions on interactive elements.
- Hover states gated by `@media (hover: hover)` when they convey information.
- Heavy graphics need a phone fallback: smaller variant, placeholder, or hidden.

The in-app **DevicePreview** widget (bottom-right floating button, dev-only) opens an iframe at preset device sizes for verification. Use it before opening a PR.

## Non-negotiable technical rules

- **Preserve the prototype CSS verbatim.** `colors_and_type.css` and `nza-website.css` encode the v2 design system spec — do not refactor into Tailwind utilities. Only add to Tailwind via `@theme` for *new* component work.
- **Italic emphasis pattern is the typographic fingerprint.** Every headline `<em>` renders as DM Serif Display italic in coral (`#F75A55`), bumped 1.10–1.15em. Never break this rule.
- **No first-person "we"** in any user-facing copy. Speak about the work, the data, the client. **One sanctioned exception: `/nz-ai`** — the v9 partnership reframe (see `NZ_AI_Web_Page_Copy_v9.md`) explicitly uses "we" for the human-led Decode/Build/Partner voice. Approved by Chris. The rule still holds everywhere else.
- **No emoji.** Anywhere — chrome, copy, comments visible to the user.
- **No gradients in UI chrome.** The NZA logo gradient (orange → pink → purple) is logo-only.
- **Coral is for moments, never surfaces.** Italic emphasis, the rule lines, accent dots, active-state underlines. Never as a button fill, never as a card or section background. Card #6 on Approach is the *only* sanctioned navy+coral disruption on the paper canvas.
- **Lucide-style line icons only.** 1.35–2px stroke, 11–18px sizes. No icon font, no fill icons, no decorative unicode.
- **Anchor-based nav within `/`.** `#home`, `#capabilities`, `#approach`, `#products`, `#clients` are the in-page routes. The router separates `/` from `/pablo`.

## Process rules (Co-Work)

- **Never run `npm install` and push the lockfile from a Linux VM.** Windows has different binaries. If a new dependency is needed: edit `package.json` only, then ask Chris to run `npm install --force` locally and commit the resulting `package-lock.json`.
- **Stay on `main`.** Worktrees are allowed for parallel chunks if they merge back same-session; no long-lived branches.
- **Commit and push after every meaningful chunk.** Descriptive messages, one chunk per commit where possible.
- **Never force-push, never `git reset --hard`** without Chris's explicit approval.
- **Diagnose before fixing.** When something doesn't work and the cause isn't obvious: add diagnostic logging, reproduce, read the output, *then* decide on the fix. Don't guess.
- **Delete old code before writing new.** When replacing a function/component, search the codebase for references to the old name and remove them in the same commit.
- **Try up to 3 approaches when stuck, then escalate** — describe what was tried, what happened, what the options are. Don't keep guessing.

## What not to touch

- `public/fonts/` — Stolzl OTFs are licensed assets. Don't replace, don't modify, don't move.
- `public/assets/clients/` and `public/assets/clients/coral/` — client logos. They appear at runtime in the carousel and popover; renaming files breaks the data lookup in `src/data/clients.ts`.
- `src/styles/colors_and_type.css` and `src/styles/nza-website.css` — the locked design system. Patches only for parser bugs (already-fixed orphan brace blocks in commit `938fa2c`); no restyling.
- The GHG Protocol value-chain SVG in `src/components/svg/GhgProtocolDiagram.tsx` — its element IDs (`_1_-_front`, `_2_-_mid`, `_3_-_back`, `_4_-_BVCM`, `_5_-_lines_and_clouds`, `_6_-_annotation`, `_6_-_text`) are the contract the reveal animation depends on. Don't rename.

## Post-task safety checks

After every chunk:

1. `npm run dev` boots without console errors (browser DevTools clean).
2. Side-by-side compare against the source `nza-website.html` (open the file directly from the design bundle in a browser tab) — visual diff should be zero on the screens in scope.
3. `prefers-reduced-motion: reduce` short-circuits all animations to their final state.
4. `npm run build` produces a clean `dist/`.
5. STATUS.md updated with the completed chunk and the next one.

## Roles for this project

- **Chris** — product owner, final sign-off.
- **Co-Work (Claude Code, this session)** — primary builder. Codes, commits, pushes.
- **Tony** — not yet wired in for this project. Until then, Chris does verification himself or the architect verifies on GitHub.
- **Claude Chat / Claude Design** — already produced the source brief (`nza-design-system.md`, `nza-handoff.md`) and the prototype. May be re-engaged for new screens or design iterations.

## API keys / environment

No external APIs — no keys or environment variables required to build or run this
project.
