# Brief: Impilo investigation (overnight task)

**For:** Claude Code (research task, runs alongside the product page template build)
**Scope:** Investigate `impilo.health` to extract precise animation, layout, and interaction mechanics. Use findings to refine the implementation of the product page template.
**Companion to:** `nza-product-page-template-brief.md` (the product page template — PABLO, NZ:AI, decodED)
**Date:** 9 June 2026

---

## Why this brief exists

The product page template brief specifies the *structure* and *intent* of each section, borrowing patterns observed in Impilo's website. Several of those patterns (scroll-pinning mechanics, animation timings, transition easings, micro-interactions) are difficult to specify precisely from screenshots alone.

This brief asks Claude Code to **inspect Impilo's live site in a browser**, document the exact mechanics, and use those findings to refine the implementation. The goal is not to clone Impilo — NZA's visual identity, palette, type system, and content are entirely our own. The goal is to learn how Impilo achieves the *feel* (precision of motion, polish of transitions) and apply equivalent technique to NZA's product pages.

This task can run **overnight**, in parallel with — or before — the product page template implementation begins. It is bounded, has clear deliverables, and should not consume more than ~2 hours of Claude Code's working time.

---

## What to do

### Step 1 — Inspect Impilo in a browser

Use Playwright (already a common dependency in modern web projects; install if not already present). Open `https://impilo.health/` and a representative use-case sub-page (`https://impilo.health/use-cases/virtual-care-companies/` is a good one — it has the four-step request-demo flow that mirrors what NZA's product pages will use).

For each of the patterns below, inspect:
- Computed CSS values on the relevant DOM elements
- Animation properties (duration, easing, delay)
- Transform values during animation
- Scroll-triggered behaviour (when does each transition fire?)
- Hover state changes
- Responsive behaviour at standard breakpoints

Take screenshots of each pattern at default state, mid-animation, and final state for visual reference.

### Step 2 — Document findings

Produce a markdown file at `/docs/impilo-findings.md` (or equivalent location) with one section per pattern below. Each section should include:

- **What it does** (one-line description)
- **DOM structure** (the relevant HTML pattern — describe, don't copy)
- **CSS / animation values** (concrete numbers — durations, easings, transforms, etc.)
- **Trigger / interaction** (what causes it to fire — scroll position, hover, page load, etc.)
- **Screenshots** (references to captured images at key states)
- **Notes for NZA implementation** (anything specific to consider when applying this to NZA's design system)

### Step 3 — Refine the product page template brief

Where the existing product page template brief specifies a value that Impilo's measured value differs from (e.g. my brief says "cross-fade ~600ms" and Impilo's actual value is 450ms), use the measured value if it's better. Where my brief describes a mechanic in plain English and Impilo's measured implementation is more precise, use the measured implementation.

**Maintain a `decisions-log.md` file** capturing every place the implementation differs from the original brief, with a one-line rationale per decision. This makes the changes reviewable in the morning.

### Step 4 — Proceed with the build using refined values

Once the findings are documented and the brief refined, begin (or continue) the product page template build using the improved values.

---

## Patterns to investigate

### 1. The hero word-rotation mechanic (slot-machine)

Impilo's hero headline reads *"Making at home healthcare [manageable / powerful / easy / personalized]."* with the bracketed word rotating inside a dotted-outline frame.

**What to extract:**
- The exact HTML/CSS structure of the dotted-outline frame
- How the rotating word is masked (so it slides upward cleanly without spilling outside the frame)
- The hold duration per word (how long each word is visible)
- The transition duration when swapping (how long the slide-and-fade lasts)
- The easing curve
- Whether the frame width is fixed or whether it animates to match the new word's width
- Behaviour on `prefers-reduced-motion`

**Why this matters for NZA:** The NZA *landing page* uses the same mechanic for *"We decode [decarbonisation / climate complexity / energy markets / digital intelligence] for your organisation."* The landing-page brief specifies this but the precise mechanics are valuable. Note: the slot-machine is **not** used on the product pages themselves — it's exclusive to the landing page — but the findings will improve the landing page implementation if/when it gets revisited.

### 2. The cycling product preview in the hero

Impilo's hero right-column shows their dashboard card with a small ECG pulse line, and the data on the card shifts subtly over time.

**What to extract:**
- How the card is composited (browser frame chrome + inner UI)
- Whether the data inside is animated or static, and how transitions happen if animated
- The pulse line animation — duration, path, easing
- Any hover-pause behaviour
- The shadow / depth treatment that makes the card feel like an object on the canvas

**Why this matters for NZA:** The product page template specifies a browser-frame with rotating screenshots inside. Impilo's chrome treatment, shadow depth, and cycling mechanics will inform how convincing the NZA equivalent feels.

### 3. The "Let's show you how we do it" inline-pill headline

Impilo has a section where the headline reads *"Let's show you [REQUEST DEMO PILL] how we do it"* — the pill button is set inline within the headline.

**What to extract:**
- How the pill aligns with the surrounding text vertically (baseline? optical centre?)
- The pill's exact dimensions, padding, border style, font-weight
- Hover state — fill colour, transform, text colour change
- Responsive behaviour — does the pill stay inline or wrap to its own line on narrow screens?
- The headline's font size relative to the pill text (the pill text reads as smaller)

**Why this matters for NZA:** Section 3 of the product page template uses this exact device. The brief specifies it but the precise visual relationship between pill and headline is hard to articulate. Measured values will produce a more confident replica.

### 4. The four-step request-demo flow (the main investigation)

This is the most important pattern. Impilo's flow has four steps (01. Identifies and qualifies → 02. Pack and ship → 03. ... → 04. ...), each with:
- Step number in the top-right of the text column
- Small icon glyph in the top-left
- Bold headline with verbs highlighted in the accent colour
- Body paragraph
- Line-art illustration on the right in a (roughly) square frame
- The right column appears to be sticky/pinned during each step's scroll range

**What to extract:**
- **Scroll mechanics:** how exactly does the left text column transition between steps as the user scrolls? Is each step its own "viewport-pinned" section that the user scrolls through? Or does the text column update in place while the right illustration also updates?
- **Trigger thresholds:** at what scroll position does step 02 take over from step 01? Is it when 02 enters the viewport (top), when it crosses the middle, when 01 fully exits?
- **Transition between steps:** does the previous step fade out and the next fade in, or do they cross-fade, or does one slide out as the other slides in?
- **Illustration animation:** does the line-art illustration animate when it enters? Does it have an ongoing micro-animation while displayed?
- **Verb highlighting:** is the verb in a `<span>` with a coloured class, or done with another technique? Are the highlight colours different across the four steps (Step 01 cyan, Step 02 mint per the screenshots) — is this a deliberate per-step palette, or is it tied to which step is active?
- **Sticky behaviour:** is the right column `position: sticky` with the left column scrolling, or vice versa, or are both scrolling with one fixed?
- **Request Demo pill in the corner:** stays visible throughout this section — how is it pinned and at what z-index?

**Why this matters for NZA:** Section 4 of the product page template is this exact pattern, applied to three products. The mechanics need to be precise enough that the flow feels deliberate. My brief describes the pattern correctly in principle but the implementation has subtleties only visible in the live site.

### 5. The hard colour cuts between sections

Impilo's page transitions from dark violet sections to light pearl sections to dark again, with **hard cuts** (no gradient).

**What to extract:**
- How the cuts are implemented (full-bleed background-coloured sections stacked, or something else?)
- Whether there's any visual treatment at the boundary (a thin line, a shadow, nothing at all?)
- How content positioned at the boundary handles the transition (does any text or graphic span across the cut?)
- Per-section padding values — how much breathing room is given above and below the headline content in each section?

**Why this matters for NZA:** Section 2 of the product page template uses hard cuts as a structural device. The brief specifies the rule (no gradient) but the per-section padding and any boundary treatment will be informative.

### 6. The closer / credibility section

The "Patient care, our integrations. It's a perfect match." section near the bottom of Impilo's homepage.

**What to extract:**
- Composition — is it strictly centred? Are the badges (HIPAA, SOC 2) in a contained block?
- The ECG pulse motif that sits above some headlines as a small badge — how is it implemented and styled?
- The "carousel arrows" pattern (the article navigation) — how is the carousel built? Touch / swipe / button-click behaviour on mobile?

**Why this matters for NZA:** Section 5 of the product page template is the closer, replicating this structure with NZA's content. Some specifics (the carousel mechanics in particular, for sections that may need rotating content) will inform implementation.

### 7. Type system specifics

**What to extract:**
- Exact font sizes for each role (display, headline, sub-headline, body, micro-label)
- Exact line-heights
- Letter-spacing values (especially on the uppercase mono labels and the display type)
- Font-weight system (Impilo uses Gilroy 500 and 600 only — confirm)
- Negative letter-spacing on the display type (visible in their headlines — confirm exact `letter-spacing` values)

**Why this matters for NZA:** NZA uses Stolzl and Inter rather than Gilroy, but the *proportional system* (how the type sizes relate, the spacing rhythm) is transferable. The brief specifies approximate values; measured Impilo values will sharpen the calibration.

### 8. Responsive breakpoints

**What to extract:**
- At what viewport widths do their breakpoints fire?
- How does the four-step section behave on mobile — does the sticky column system still apply, or does it stack with both columns visible at once?
- How does the inline-pill headline behave on narrow screens?

**Why this matters for NZA:** The brief specifies general mobile behaviour but real responsive logic is best learned from a working example.

---

## Guardrails

**1. Do not copy Impilo's compiled code, JavaScript bundles, CSS files, fonts, or licensed assets.** Read the rendered DOM and computed styles. Document patterns and values. Re-implement using NZA's own code in NZA's own design system. This is the difference between *learning from a competitor* and *plagiarising one*.

**2. Use Impilo's findings to refine the brief, not to override its decisions.** The structural choices in the product page template brief (five sections, the order, the verb-highlighting pattern, the per-product palette adaptation) are NZA's, not Impilo's. Where Impilo's mechanics improve the *execution* of those decisions, use them. Where Impilo's choices would change the *structure* of NZA's page in ways that don't suit NZA's brand, ignore them.

**3. Do not over-fit to Impilo's specific aesthetic.** Impilo is a health-tech product. Their illustrations (medical devices, patient avatars), their colour story (deep iris violet + clinical cyan + mint health-positive), their tone of voice (clinical-confidence) are wrong for NZA. NZA is built-environment / energy / climate advisory. Take *technique*, not *identity*.

**4. Maintain a decisions log.** Every place the implementation differs from the original brief — whether it's a refined animation duration, a different scroll mechanic, or a new pattern that wasn't in the brief — gets a one-line entry in `decisions-log.md`. This makes the work reviewable tomorrow.

**5. Flag anything genuinely uncertain.** If Impilo's implementation of a pattern looks complex enough that re-implementing faithfully would take more than ~2 hours, flag it and use the brief's original (simpler) specification instead. The goal is a polished build, not a 1:1 replica.

---

## Deliverables, by tomorrow morning

1. **`/docs/impilo-findings.md`** — markdown document with one section per pattern investigated, including DOM structure, CSS values, screenshots, and notes for NZA implementation
2. **`/docs/decisions-log.md`** — running log of any places the implementation differs from the original brief, with rationale
3. **Refined implementation of the product page template** — with the improved values applied (within the bounded scope: the patterns specifically listed above)
4. **Screenshots of investigated states** — saved to `/docs/impilo-references/` for visual reference during the build

---

## Out of scope

- Investigating Impilo's *backend / API / data layer*. We only care about the front-end behaviour.
- Investigating Impilo's *analytics / tracking / privacy* implementations.
- Investigating sub-pages beyond the homepage and one representative use-case page.
- Replicating Impilo's actual content, copy, illustrations, fonts, or colours. The template brief defines NZA's content; this investigation only informs the mechanics.
- Investigating *other* sites for comparison. This is a focused Impilo task.

---

## When to stop investigating and start building

The investigation should take ~1.5 to 2 hours of focused work. If after that time some patterns are still unclear, **use the original brief's specifications for those patterns and proceed with the build**. We have a directionally-correct brief — incomplete findings should not block implementation.

The order of work, ideally:

1. Quick browser session — get the site loaded, take initial screenshots of each section (~20 min)
2. Document Patterns 1-4 (the highest-value ones for the product page template) — (~45 min)
3. Document Patterns 5-8 (supporting) — (~30 min)
4. Refine the product page template brief based on findings — (~15 min)
5. Begin / continue the build with refined values

If you hit ~2 hours and haven't finished documenting Patterns 5-8, that's fine — the first four are the critical ones for the product page template.

---

## A note on tone

This is an investigation task, not a structural decision-making task. The goal is to *measure* and *document* — not to invent new architectural choices. If something Impilo does is genuinely better than what the brief specifies, capture it. If something Impilo does is just *different*, capture the difference but don't change the brief's direction without flagging it for human review.

---

*End of brief.*
