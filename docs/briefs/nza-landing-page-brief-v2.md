# Brief: NZA landing page (full)

**For:** Claude Code (implementation)
**Page:** `/` (homepage)
**Date:** 9 June 2026
**Status:** Concept locked, ready for build
**Scope:** Full landing page covering hero, mission, client strip, three products section, footer. Plus updated site-wide navigation and type scale.

This brief **replaces** the earlier landing-page brief (cream preloader + navy hero with three-beat infographic). The preloader animation itself is retained as briefed separately — only the post-preloader landing page is rewritten here.

---

## What you're building

A simpler, more confident NZA landing page that lets the design system do the work. Less text, bigger type, a small set of high-impact moments. The page sits inside the same dark navy / cream design language already in place. Motion is restrained and deliberate — animations exist to engage, not to entertain.

The page sequence: preloader (already built) → slot-machine hero → mission statement → client strip → three products section → footer.

---

## Visual system reminders

Use the existing NZA design system tokens. **Do not invent new colours or type tokens.**

- **Cream** — canonical NZA cream
- **Navy** — canonical NZA navy (deep, not the lighter prototype variant)
- **Coral** — `#F75A55`
- **Typography** — Stolzl for display, DM Serif Display italic for accents, Inter / Inter Tight for body, IBM Plex Mono for mono, Times New Roman Italic reserved for page-level headline emphasis

All animation easings should use the locked design-system curve (approximately `cubic-bezier(0.16, 1, 0.3, 1)` — the brand's "settled arrival" easing). Use existing tokens.

---

## Type scale — recalibrated

The current page renders headlines around 60-72px. The new scale pushes the landing hero into proper display territory, with each subsequent step proportionally larger than current:

| Role | Target size | Notes |
|---|---|---|
| Landing hero | 96px | Big and confident. The slot-machine word swap sits at this size. |
| Page hero | 72px | One step down. Used on Approach / Expertise / product pages. |
| Section heading | 40px | Used for in-page section titles like *Our products*. |
| Sub-heading | 24px | Used for sub-lines beneath hero / section headings. |
| Body | 18px | Modest bump from the current 16px for breathing room. |

These are starting points. Fine-tune ±10% once rendered with real copy. Apply the scale across the site, not just the landing page.

---

## Site-wide text motion

Implement an **upward mask-reveal** for all text blocks across the site. Each line of text is initially hidden behind an invisible mask. As the section enters the viewport, the mask moves upward and the text becomes visible from bottom to top. Lines stagger ~80–120ms apart.

- This is the same motion mechanic as the slot-machine word swap in the hero — applied across the site at every scale
- Motion happens once, on first viewport entry per section; text sits still afterward
- Respect `prefers-reduced-motion` — disable mask reveal and show text immediately

This is a foundational motion behaviour, not a per-section animation. Implement as a reusable utility that wraps any heading/paragraph and triggers the mask reveal when scrolled into view.

---

## Section 1 — Hero

### Layout
- Full viewport height (~92vh, leaving room for the persistent nav at top)
- Two-column on desktop, single column stacked on mobile
- Headline left, illustrative space right (currently the three-beat infographic — that gets removed; see below)

### Headline
> *"We decode **[X]** for your organisation."*

Where **[X]** is a single word slotted inside a dotted-outline frame that rotates through four locked words:

1. decarbonisation
2. climate complexity
3. energy markets
4. digital intelligence

Each word holds for ~2.5 seconds. Transition is **slot-machine style**: the outgoing word slides upward and out of the frame; the incoming word slides upward into position from below. The dotted frame itself stays static. Loops continuously.

Type sizing for the headline: ~96px desktop. The word *"decode"* is set in DM Serif Display italic in coral, as it currently is. The rotating word inside the dotted frame is set in the same display weight as the rest of the headline, in cream.

### Sub-headline (the mission statement)

Beneath the headline, smaller, in two sentences:

> *"We are specialists in buildings, energy and climate. We cut through the complexity of decarbonisation — and build the tools your people need to act on it."*

Type sizing: ~24px desktop. Inter regular. Cream at ~85% opacity. Max-width ~520px so the line breaks read naturally — break after *"buildings, energy and climate."* on the first sentence, allow the second sentence to wrap as needed.

### Right column
**Remove the three-beat infographic from the landing page.** The right side of the hero is now empty space — let the background blob field and the slot-machine motion in the headline carry the visual interest. The infographic moves to the Approach page where it has more conceptual weight.

If the right column feeling empty is awkward, allow Claude Code to use it for additional negative space or a very small visual element (e.g. a single subtle decorative line or anchor mark) — but **do not add a chart, dashboard, or graphic** that competes with the hero text.

### Background
Continue the existing navy ambient blob field — three navy tones + coral at ~18% opacity + cream at ~14% opacity, heavy blur (~100px), co-prime animation durations. Already implemented.

### Hero motion summary
- Slot-machine word swap (existing pattern): locked
- Site-wide upward mask-reveal: applied to headline lines and sub-line on viewport entry
- Background blob field: continuous, calm
- No other motion in the hero

---

## Section 2 — Client strip

Beneath the hero. Cream-on-navy band (or navy-on-cream — match existing implementation).

### Behaviour
- Horizontal auto-scrolling row of client logos (existing implementation)
- **Make the strip thinner than current** — reduce vertical padding by ~30%, so the strip takes less vertical real estate
- **Hover behaviour:** when the cursor enters the strip, the scroll **pauses**. When the cursor leaves, the scroll resumes.
- **Per-logo behaviour:**
  - On hover of a specific logo, that logo glows **coral** (subtle background tint or filter shift, ~250ms)
  - On click of a logo, a small **inline summary panel** appears beneath the strip showing one sentence about that client engagement and a *"See the case study"* link
  - The summary panel slides down beneath the strip; the strip itself remains visible above it
  - Clicking the *"See the case study"* link navigates to the Our Work / case studies page for that client (page may not exist yet — link to a placeholder destination; see out-of-scope)

### Client list
Current logos remain — Hartpury, IVG (Inspired Villages), Molson Group, EOC, RWGC, Zeal, plus any others currently in the strip. The summary panel content is a single sentence per client; placeholder text is acceptable for the first build and can be refined later.

---

## Section 3 — Mission section (between client strip and products)

This is a **new section** the brief introduces, between the client strip and the products section. Purpose: a short pause in the page where NZA states what it does, in plain language.

### Layout
- Centred, single column
- Generous vertical padding (~120px above and below)
- Max width for the text block ~720px

### Content
A single paragraph, in larger type than body (~28-32px), serif italic or display weight:

> *"NZA exists to help organisations move past climate ambition and into climate action. We bring deep expertise in the systems that matter — buildings, energy, and carbon — and pair it with the tools your team will actually use. We're a small, AI-native team building real things for serious work."*

This is **proposed copy** — Claude Code should treat it as locked, but the client may iterate on the wording later. The structure (3 sentences, ~28-32px display weight, centred, generous vertical breathing room) is what's locked.

**If this feels redundant with the mission statement in the hero, raise it as a question and we'll resolve before implementation.** It's possible the page works better without it — going straight from client strip to products. Use judgement; default to including it.

---

## Section 4 — Our products

This is the section that does the most new work. Replaces any existing "products" section on the landing page.

### Layout
- Full-width section, generous vertical padding (~120px top, ~120px bottom)
- Two-column grid: **left column ~40%, right column ~60%**
- On mobile, stacks vertically — left text on top, products beneath

### Left column — static text block

Section heading:
> **Our products**

Type: ~40px section heading sizing, Stolzl display weight, cream.

Intro paragraph beneath:
> *"Three tools we've built to help organisations move on net zero — each one solving a different piece of the puzzle."*

Type: ~24px sub-heading sizing, Inter regular, cream at ~75% opacity, max-width ~420px.

Sub-line beneath, in mono:
> *Hover to see what each does. Click to dive in.*

Type: ~13px IBM Plex Mono, coral at ~85% opacity, letter-spacing ~0.15em, max-width ~320px.

### Right column — three product marks

Three marks arranged in a horizontal row. Each mark sits in its own area; **no card chrome at rest** — the marks float on the navy canvas.

**Product order (left to right):**
1. PABLO
2. NZ:AI
3. decodED

(Order is by maturity — PABLO is most established, decodED is concept-stage.)

**Real product marks are pending from Chris.** Use placeholder marks for the first build (similar to the prototype). When real marks arrive, swap them in 1:1.

#### At-rest state

- Each mark renders at ~100-120px square
- Product name appears as a small label beneath each mark (~14-16px, Inter medium, letter-spacing ~0.05em)
- No background, no border, no bounding box — the mark and label float on the navy canvas
- Each mark has a **subtle idle motion** — gentle continuous animation that doesn't loop visibly (e.g. ~2% breathing on a 6s cycle, staggered between marks so they don't pulse in sync). The specific idle motion per mark can be designed when the real marks arrive — for the first build, generic breathing is acceptable.

#### On-hover state (per mark)

When the user hovers any one mark:

**The hovered mark:**
- Scales up subtly (~108%)
- A soft tinted bounding container materialises around it — `background: rgba(255, 255, 255, 0.04)`, hairline coral border (`border: 0.5px solid rgba(247, 90, 85, 0.35)`), border-radius ~14px
- A **reveal panel** grows downward from the mark, containing:
  - A short *question* in serif italic (e.g. *"Want to cut your electricity costs?"*) — ~17px
  - A one-sentence *promise* (e.g. *"PV, battery and load optimisation modelling for sites that want to spend less on energy."*) — ~13px
  - An *"Explore PABLO →"* link styled as mono coral with a hairline underline — ~11px
- All reveal content fades in and slides up ~8px with a stagger of ~80ms between elements
- Total expand animation duration: ~460ms

**The other two marks:**
- Fade to 40% opacity
- Shrink to 94% scale
- Recede visually so the focused mark owns the space

#### Per-product reveal copy (locked)

**PABLO:**
- Question: *"Want to cut your electricity costs?"*
- Promise: *"PV, battery and load optimisation modelling for sites that want to spend less on energy."*
- Link: *"Explore PABLO →"*

**NZ:AI:**
- Question: *"Want to make sense of complex carbon data?"*
- Promise: *"An AI advisory partnership for teams who have client relationships but need net zero depth."*
- Link: *"Explore NZ:AI →"*

**decodED:**
- Question: *"Running climate action in education?"*
- Promise: *"A hosted platform helping schools, universities and trusts move from carbon data to climate strategy."*
- Link: *"Explore decodED →"*

#### Click behaviour

Clicking the *Explore* link (or anywhere on the active mark) navigates to the corresponding product page via the page-transition loader (separate brief — line-drawn NZA mark animation between pages). Product pages may not yet exist; link to placeholder destinations if so.

#### Section height behaviour

The reveal panel adds vertical height to the active mark area. The section's overall height **adjusts responsively** — when one mark is expanded, the section is taller; at rest, the section is shorter. This is intentional. **Do not fix the section to the expanded height** (which would leave empty space at rest) and do not allow the layout to jitter — the height transition should feel smooth.

### Section background
Continue the navy ambient blob field — same blob system as the hero, with the blobs positioned differently in this section so the field feels continuous but visually distinct. The blob field carries through the entire navy section of the landing page (hero → mission → products), broken only by the cream client strip.

---

## Section 5 — Footer

Compact and minimal — the opposite of the typical SaaS footer wall.

### Layout
- Full-width band, navy background (or cream, designer's call)
- Horizontal layout on desktop, stacks on mobile
- Three columns: contact icons (left), navigation links (centre), copyright + legal (right)

### Contact icons (left)
Three large icons, ~36px each, displayed horizontally with ~24px gap:
- Email icon (links to `mailto:` Chris's NZA email)
- LinkedIn icon (links to NZA company LinkedIn)
- Phone icon (links to `tel:` NZA contact number)

Icons should be **outline style** (Tabler Icons or similar). On hover, each icon picks up coral. Each is a real link, not decorative.

### Navigation links (centre)
A short repeat of the primary navigation as text links:
- Products
- About
- Get in touch

Inter regular, ~14px, cream at ~70% opacity. Vertical stack or horizontal — designer's call based on the column width.

### Copyright and legal (right)
Small print, ~12-13px IBM Plex Mono, cream at ~50% opacity:
- NZA Consultancy Ltd
- Registered office address (Chris to confirm — use placeholder for first build)
- *© 2026 NZA Consultancy Ltd*
- Three text links: Privacy · Terms · Cookies (linked to placeholder destinations)

---

## Section 6 — Navigation (site-wide, sticky)

This applies to **all pages on the site**, not just the landing page. The navigation system is locked here so Claude Code can implement it once.

### Layout
- Sticky positioning, pinned to the top of the viewport as the user scrolls
- Slim — ~64-72px height
- Three primary items + one button
- NZA wordmark on the left, navigation centred or right-aligned, *Get in touch* button at the far right

### Navigation items

**1. Products ▾** — dropdown menu
- NZ:AI
- PABLO
- decodED

**2. About ▾** — dropdown menu
- Our approach
- Our expertise
- Our clients
- Who we are

**3. Get in touch** — button, not a link
- Sits at the far right
- Styled as a pill button — coral background, cream text, ~12-13px, letter-spacing ~0.12em, uppercase, padding ~10px 20px
- On hover: subtle lift, slight scale (~102%), tinted border or shadow
- Clicking opens a contact modal or routes to a contact page (TBD — link to placeholder for now)

### Dropdown behaviour

Modelled on the Impilo pattern observed in the reference video:
- Trigger on hover (desktop) or tap (mobile)
- **Glassmorphic / semi-transparent panel** — no heavy card background; the dropdown floats over the page content with a subtle dark tint and a hairline coral border
- Items in cream, ~15-16px, Inter medium
- On hover of an item, the item picks up coral
- Subtle slide-down + fade-in animation (~200ms)
- Closes when the cursor leaves the dropdown area, with a small grace period (~150ms) so the user doesn't lose it on the way down

### Sticky behaviour
- The nav stays visible at all times while scrolling
- The nav's background acquires a subtle backdrop blur or slight opacity change once the user has scrolled past the hero (so it remains readable over varying content beneath)

---

## Performance and constraints

- No video assets. All motion is built in code (SVG, CSS, lightweight JS).
- All blob fields use CSS `filter: blur()` — performance-test on lower-end devices and reduce blur intensity if needed.
- Use `transform` and `opacity` for animation properties (GPU-accelerated).
- Respect `prefers-reduced-motion` throughout — slot-machine word swap shows just one word, mask-reveals show text immediately, blob field animations slow significantly or pause, hover transitions reduce to opacity-only.
- Lighthouse target: 90+ across performance, accessibility, best practices, SEO.

---

## Files and assets referenced

**Already in the design system:**
- NZA mark and wordmark SVGs (layered, with named groups)
- Existing colour and type tokens
- Existing blob field implementation
- Existing slot-machine word swap component (if not yet built, this brief specifies it; see Section 1 hero)

**Pending from Chris:**
- PABLO product mark (SVG preferred)
- NZ:AI product mark (SVG preferred)
- decodED product mark (SVG preferred)
- NZA registered office address (for footer)
- Phone number (for footer contact)

For the first build, use placeholder marks similar to those in the prototype. Real marks will be swapped in by direct file replacement — design the implementation so the marks are isolated assets, not baked into other components.

---

## Out of scope (explicitly)

These are not part of this brief and should not be touched as a side effect:

- **The preloader animation** — already briefed and built separately; this brief assumes it exists upstream
- **The Approach page** — separate brief; the three-beat infographic moves here
- **The Expertise page** — separate brief
- **The About / Our clients / Who we are pages** — separate briefs (the About dropdown links to them but they exist independently)
- **The product pages themselves** (NZ:AI, PABLO, decodED) — separate template brief plus three population briefs
- **The page-transition loader** between pages — separate brief
- **The case study / Our Work page** linked from the client strip — separate brief

If Claude Code encounters a routing question about destinations for any of the above, link to a placeholder route and flag it. **Do not invent the destination pages as a side effect of building this landing page.**

---

## Acceptance criteria

A working implementation should pass these checks:

1. The preloader completes and auto-transitions to the new hero (existing behaviour, preserved)
2. The slot-machine word swap rotates through the four locked words: decarbonisation · climate complexity · energy markets · digital intelligence
3. The hero headline is set at ~96px on desktop and reads cleanly across breakpoints
4. The mission statement reads correctly with the locked two-sentence copy
5. The three-beat infographic has been removed from the landing page (moved to Approach page if not yet there, but its removal here is required)
6. The client strip is thinner than the current implementation, pauses on hover, glows coral per-logo on hover, and reveals an inline summary panel on click
7. The new mission section sits between the client strip and the products section, with the locked copy
8. The three products section shows three marks at rest with no card chrome
9. Hovering a mark triggers the bounding-box reveal with question + promise + Explore link
10. The other two marks recede (fade + scale down) when one is active
11. Each mark links to its product page (or placeholder destination) on click
12. The footer shows three large contact icons + minimal legal text in small print
13. The navigation is sticky, contains Products ▾ + About ▾ + Get in touch button
14. Both dropdowns work with glassmorphic styling and the locked menu items
15. The type scale has been recalibrated (96px landing hero / 72px page hero / 40px section / 24px sub / 18px body)
16. The site-wide upward mask-reveal motion is applied to text blocks on viewport entry
17. The page respects `prefers-reduced-motion`
18. Mobile breakpoints render correctly — hero stacks, products stack, footer stacks, dropdown becomes tappable

---

## Questions Claude Code should raise rather than guess

If any of the following is unclear, **pause and ask** rather than improvise:

- Whether the mission section between client strip and products should be included (Section 3) — the brief says yes by default, but flag if it feels redundant
- The exact registered office address and phone number for the footer
- The destination URLs for: case study links from client strip, Explore links from product marks, Get in touch button
- Whether the preloader auto-transition behaviour should be modified given the new hero structure
- Anything related to navigation dropdown behaviour on mobile (touch vs hover, swipe vs tap)

---

*End of brief.*
