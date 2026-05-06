# STATUS.md

## Last completed chunk

**Stage 1 — Scaffold (commits `c0a47f8`, `938fa2c`)**

- `npm create vite@latest . -- --template react-ts` baseline
- Installed `react-router-dom`, `tailwindcss@4`, `@tailwindcss/vite`
- Source design bundle copied: `colors_and_type.css`, `nza-website.css`, `pablo.css` into `src/styles/`; 6 Stolzl OTFs into `public/fonts/`; logos, lens icons, three-lens-mark, GHG SVG, client logos into `public/assets/`
- Patched font URLs in `colors_and_type.css` to root-relative (`/fonts/…`) so Vite serves them
- Patched mask URL in `nza-website.css` to `/assets/nza-mark-clean.svg`
- Added `tailwind.css` with `@theme` block mirroring the design tokens
- Replaced default Vite `App.tsx` / `main.tsx` with router-aware versions and a placeholder home page
- `vercel.json` SPA rewrite added
- **Bug fix:** removed two orphan brace blocks in `nza-website.css` (`.headline em` and `.cap-expanded-close svg`) that browsers tolerated but Tailwind 4's Lightning CSS rejected

## Current state

- Dev server boots in ~400ms with no errors
- `/` and `/pablo` both return HTTP 200
- Stolzl, Inter Tight, DM Serif Display all serve correctly
- Placeholder home page renders the headline `NZA scaffold loaded.` with `loaded` in DM Serif italic coral — confirms tokens, fonts and CSS imports are wired
- Repo initialised on `main`, two commits, `origin` set to `https://github.com/chrisscott06/nza-website` (not yet pushed)

## Next chunk

**Stage 2 — Routing skeleton + nav shell**

- Replace placeholder `App.tsx` with proper layout that hosts the floating pill nav (`<FloatingNav />`)
- Build `WebsitePage.tsx` (5 stacked screen sections, anchor-scrolled)
- Build `PabloPage.tsx` shell (header + nav, no charts yet)
- Each screen rendered as a placeholder showing its eyebrow + headline + lede only — no SVG, no animation. Verifies nav anchors and the canvas-paper / canvas-navy alternation work end-to-end before any motion is added.
- Anchor links smoothly scroll between sections (basic — full snap-paging comes in stage 5)

## Known issues

- Lockfile review pending: `package-lock.json` was committed in stage 1 from Chris's Windows machine. Bible says don't push lockfile changes from Co-Work. Practically, this lockfile IS Windows-correct because the install ran locally — but the rule is the rule. Decision needed: leave as-is for the project's first commit, or remove and add to `.gitignore`.

## Suggestions (not implemented)

- Set up GitHub Actions: typecheck + build on every push.
- Add Lighthouse CI to PR previews once Vercel is connected.
- Consider importing the source design bundle (or at least the markdown briefs) into `docs/` as a long-term reference, separate from this repo's code.
