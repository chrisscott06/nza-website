# Brief: NZA landing page — preloader and hero sequence

**For:** Claude Code (implementation)
**Page:** `/` (homepage / landing — full-screen takeover)
**Date:** 11 May 2026
**Status:** Concept locked, ready for build
**Scope:** Full landing experience covering two stacked full-screen sections — cream preloader and navy hero — with auto-transition between them.

---

## What you're building

A full-screen landing experience that opens with a cinematic preloader (cream background, NZA mark fills in, wordmark types in beneath, ambient colour motion throughout), then auto-transitions into a navy hero with a two-column layout (pinned headline left, three-beat infographic right). The whole opening sequence runs roughly 4 seconds before the user lands on the hero.

The page should also respond naturally to manual scroll at any time — the auto-transition is a fallback, not a lock.

---

## Visual system reminders

Use NZA's existing design system tokens — **do not** match the placeholder colours I've used in prototypes during the conversation. Specifically:

- **Cream** — actual NZA cream from the design system (the canonical brand cream, not a warmer variant)
- **Navy** — the deeper canonical navy from the design system (deeper than `#1a2540` placeholder, closer to the locked brand navy)
- **Coral** — `#F75A55` (canonical)
- **Typography** — Stolzl for display, DM Serif Display italic for accents, Inter / Inter Tight for body, IBM Plex Mono for mono. Times New Roman Italic reserved for page-level headline emphasis if needed.

All animation easings should use the locked design-system curve (cubic-bezier roughly `(0.16, 1, 0.3, 1)` — the brand's "settled arrival" easing). Use existing tokens; don't invent new ones.

---

## Screen 1 — Cream preloader

### Layout
- Full viewport height, full viewport width
- Cream background
- NZA mark centred, large (roughly 280–320px diameter on desktop, scaling appropriately on mobile)
- Percentage counter and wordmark appear below the mark in sequence

### Background motion
A subtle blurry blob field drifts behind the mark across the entire viewport:

- 4 soft-edged blobs at heavy blur (~110px)
- Two primary blobs in slightly warmer/cooler shades of the cream itself (so they read as texture, not colour)
- One coral blob at ~8% opacity drifting through occasionally
- One navy blob at ~6% opacity drifting through occasionally
- Each blob has its own animation duration (~28s, 34s, 30s, 38s — co-prime so the combined pattern never loops visibly)
- Motion is calm and feels like atmosphere, not animation

### Logo fill-up animation
The NZA mark (the full mark from `nza-mark-thick-layered.svg`) starts in a **hollow / outlined state** and fills with navy from the bottom upward, like a glass filling with ink.

Implementation approach: use an SVG mask or a `<clipPath>` that animates upward, revealing a navy-filled version of the mark progressively. The fill should:
- Start at the baseline of the mark (bottom edge)
- Rise to the top edge over **2 seconds**
- Have a slight horizontal wobble or soft edge (~2px feather) so it doesn't look like a hard horizontal sweep
- Use the locked NZA navy

The mark should be the actual layered SVG with the circle and three triangles — but **the four shapes do not animate independently** in this version. They're filled in as one unit by the rising navy.

### Percentage counter
- Below the mark, centred
- Counts from 0% to 100% over the same 2 seconds as the fill
- Mono font (IBM Plex Mono), ~13px, navy at 55% opacity, letter-spacing ~0.18em
- When the count hits 100%, the number disappears (replaced by the wordmark sequence in the same space)

### Wordmark reveal (starts at 2.0s, finishes around 3.5s)
Below where the percentage counter was, the words "NET ZERO" and "ADVISORY" appear in sequence:

**"NET ZERO"** — typewriter reveal in navy
- Use the `net` and `zero` groups from `net-zero-advisory-layered.svg`
- Letters appear one at a time, left to right
- ~80–100ms per letter (roughly 0.7s total to complete "NET ZERO")
- Use a clip-path or character-by-character DOM technique — whichever produces the cleanest character-by-character reveal of the SVG paths

**"ADVISORY"** — typewriter reveal in coral, after "NET ZERO" finishes
- Use the `advisory` group from the same SVG, recoloured to coral
- Begins ~150ms after "NET ZERO" completes
- Same letter timing (~80–100ms per letter)
- Sits below or to the right of "NET ZERO" — designer's call on which composition reads cleaner; horizontal side-by-side (NET ZERO ADVISORY on one line) is preferred unless space is tight

### Auto-transition trigger (around 4.0s)
Roughly 500ms after the wordmark completes:
- The cream Screen 1 slides upward smoothly (transform: translateY)
- The navy Screen 2 enters from below as Screen 1 exits
- Transition duration: ~800ms with the standard easing curve
- The page is now sitting on the navy hero

### Manual scroll override
At any point during Screen 1 (loader, wordmark reveal, or before auto-transition), if the user scrolls, the auto-transition is cancelled and the user controls the scroll naturally. No scroll-jacking, no aggressive intervention. The auto-transition is a fallback for users who don't act.

### Scroll affordance
A small "scroll ↓" indicator (mono font, navy at low opacity) appears in the lower portion of Screen 1 starting at ~2.5s. Subtle bounce animation on the chevron. Optional — Claude Code's judgement on whether it adds value or feels redundant with the auto-transition.

---

## Screen 2 — Navy hero

### Layout
- Full viewport height
- Two-column grid (50/50 on desktop, stacks on mobile with infographic above text)
- Generous padding (~96px vertical, ~64px horizontal on desktop)

### Background motion
Same blob-field technique as Screen 1, but tuned for navy:

- 3 navy blobs in different shades (deep navy, mid-navy, lighter blue-grey) — these do the visible work
- 1 coral blob at ~18% opacity
- 1 cream blob at ~14% opacity
- Heavy blur (~100px)
- Same co-prime animation durations approach

Navy leads; coral and cream are subtle accents that drift through. **Important:** the navy here should be the locked NZA brand navy, deeper than my prototype showed.

### Left column — pinned headline
Static, no animation beyond the standard text fade-in on scroll-into-view:

> **We _decode_ decarbonisation for your organisation.**

- Stolzl display weight, ~44px desktop, scaling appropriately
- *decode* in DM Serif Display italic, coral
- 28px gap beneath

Sub-line:
> _We figure out the unknown, then build the tools for your people to act on it._

- Inter, ~17px, cream at ~78% opacity
- Max-width ~460px

### Right column — three-beat infographic
A single SVG that transforms through three beats as one continuous animation. Plays once when Screen 2 enters the viewport, takes roughly 4 seconds, then holds in its final state. **It does not loop.**

The same element carries through all three beats — it never resets. It evolves.

#### Beat 1 — DECODE (0s – 1.3s)
- Starts as ~24 scattered dots drifting at random positions within the SVG canvas
- Dots are small (1–3px radius), cream-coloured, varied opacity (0.6–1.0)
- After ~0.6s, the dots converge to form a single clean horizontal line (all dots align at y-centre, evenly spaced left to right)
- Label fades in below the infographic: **Decode** _— the unknown, made clear._
- Coral dot, coral "Decode" word, cream body text

#### Beat 2 — BUILD (1.3s – 2.6s)
**This is the bridge between Beat 1 (a line) and Beat 3 (a network).**

The line gains anchor points along it. Specifically:
- Small nodes (slightly larger circles, ~4px) appear at regular intervals along the line — perhaps 6 evenly spaced anchor points
- The line itself remains but becomes a structural spine
- Each anchor lights up in sequence (left to right, ~80ms apart) so the structure is being *built* visibly
- Optional subtle pulse on each anchor as it appears
- Label fades in: **Build** _— the tool, made yours._

The visual reading should be: *the line is being given structure*. From a single signal, a system. This Beat is the conceptual hinge — Beat 1's "data made clear" becomes Beat 2's "structure put on it" becomes Beat 3's "the structure connecting people."

**Do not** add a chart, dashboard, frame, or any realistic UI element. Beat 2 must remain abstract and visually consistent with Beats 1 and 3. The anchor-points-along-the-line approach keeps the visual language coherent.

#### Beat 3 — PARTNER (2.6s – 4.0s)
- From each of the anchor points (or a subset of them) on the line, thin connecting lines branch outward at varied angles
- Each line terminates in a small coral node (~5px)
- The branching happens progressively — one node every ~100ms, edges drawn first, then the node appears at the terminus
- Final composition: the original line is still visible as the spine, with ~6 branched nodes around it forming a small network
- Label fades in: **Partner** _— acting on it, together._

### Final held state
After Beat 3 completes:
- The line + anchor points + branched nodes all remain visible
- All three labels (Decode · Build · Partner) are visible together beneath the infographic
- Slight idle motion is acceptable (subtle pulse on one random node every few seconds) but optional
- No looping of the main animation

### Labels styling
Below the infographic SVG, stacked vertically with ~12px gap between them:
- Each label has a coral 6px dot, then "**Beat name**" in coral 600 weight, then "— body text" in cream at 65% opacity, non-uppercase
- Mono font (IBM Plex Mono), ~12px, letter-spacing ~0.15em on the beat name, normal spacing on the body text
- Fade-in transition as each beat completes (~500ms)

---

## Mobile behaviour

The full sequence should work on mobile, with two adaptations:

1. **Preloader scales down proportionally** — mark is smaller (~200px), wordmark scales appropriately
2. **Screen 2 stacks** — infographic above, headline text below, all single column; same animation logic, same timing

The auto-transition behaviour remains the same on mobile.

---

## Performance and constraints

- No video assets. Everything is built in code (SVG, CSS, lightweight JS where needed).
- Total motion file weight should be negligible — all animations driven by CSS transitions and small JS event handlers
- Use `transform` and `opacity` for all animation properties (GPU-accelerated)
- The blob fields use CSS `filter: blur()` — test on lower-end devices and reduce blur intensity if performance suffers
- Respect `prefers-reduced-motion` — if set, skip the preloader fill animation and jump directly to the wordmark + auto-transition with minimal motion

---

## Files referenced

- `nza-mark-thick-layered.svg` — the canonical mark with `circle`, `bottom-triangle`, `mid-triangle`, `top-triangle` groups (already in the design system)
- `net-zero-advisory-layered.svg` — the wordmark with `net`, `zero`, `advisory` groups (already in the design system)
- Existing colour and type tokens from the NZA Studio design system — use these directly, do not duplicate

---

## What's out of scope

These are intentionally NOT in this brief:

- **Navigation chrome** — header nav, logo in nav, contact button etc. all stay as currently configured on the existing landing page
- **The pages below Screen 2** — capabilities, expertise, products, clients, footer all stay as currently built
- **Site-wide type scale recalibration** — separate brief, in progress
- **Capability rename propagation** — separate brief

---

## Acceptance criteria

A working implementation should pass these checks:

1. On initial page load, the user sees a cream screen with subtle blob motion in the background
2. The NZA mark is centred at ~280–320px and fills with navy from the bottom upward over ~2 seconds, in time with the percentage counter
3. "NET ZERO" types in left-to-right in navy after the loader completes; "ADVISORY" types in coral after "NET ZERO" finishes
4. ~500ms after the wordmark completes, the page auto-transitions upward to reveal the navy hero
5. The navy hero has the locked headline left (with italic coral *decode*), the three-beat infographic right
6. The infographic plays once when Screen 2 enters the viewport and holds in its final state
7. Beat 2 is the line-gains-anchor-points version, **not** a chart or dashboard
8. The user can scroll at any time during the preloader and the auto-transition will be cancelled
9. The page respects `prefers-reduced-motion`
10. Mobile layout works — preloader scales, hero stacks, animation logic preserved
11. All colours used are the canonical NZA design system tokens, not approximations from the prototypes

---

*End of brief.*
