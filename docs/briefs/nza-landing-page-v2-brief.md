# Brief: NZA landing page v2 — refinements

**For:** Claude Code (implementation)
**Scope:** Refinements to the existing landing page — hero simplification, new "How we work" section, products section inversion to navy, closer redesign, footer collapse
**Date:** 10 June 2026
**Status:** Concept locked, ready for build
**Companion to:** `nza-landing-page-brief.md` (original landing page brief — this brief supersedes specific sections of it)

This brief refines the *currently shipped* NZA landing page. It does not start from scratch. Claude Code should treat this as a series of targeted modifications to the existing implementation. Where this brief contradicts the original landing page brief, **this brief wins.**

---

## What's changing

Five specific changes:

1. **Hero** — remove the sub-line beneath the slot-machine headline
2. **New section** — insert "How we work" between the client logo strip and the products section
3. **Products section** — invert from cream to navy background
4. **Closer ("Let's talk")** — refine copy, refine layout, add contact icons inside the section
5. **Footer** — collapse to a single tiny legal strip

Everything else on the page (preloader, slot-machine hero mechanic, client logo strip behaviour, nav system) stays as-is.

---

## Change 1 — Hero simplification

### Current state
The hero has the slot-machine headline (*"We decode [rotating word] for your organisation."*) followed by a two-sentence sub-line (*"We are specialists in buildings, energy and climate. We cut through the complexity of decarbonisation — and build the tools your people need to act on it."*).

### Change
**Remove the sub-line entirely from the hero.** The hero now contains only:
- The micro-label (if present)
- The slot-machine headline (rotating word inside dotted-outline frame)
- Nothing else

The slot-machine motion carries the hero. The sub-line moves to the new "How we work" section (see Change 2).

### Why
The hero currently has two competing focal points — the rotating word and the static sub-line. Removing the sub-line lets the slot-machine claim the screen. The hero becomes cleaner, more confident, and the visitor moves to the next section ready for substance rather than already saturated with text.

### Implementation
- Locate the existing hero section component
- Remove the sub-line text element (the two-sentence specialist paragraph)
- Keep all other hero elements untouched (headline, slot-machine animation, dotted-outline frame, background blob field)
- Verify the hero still feels balanced at all breakpoints — if needed, slightly increase vertical centring of the headline to compensate for the removed sub-line

---

## Change 2 — New "How we work" section

### Position
Insert between the **client logo strip** and the **products section**.

### Background
**Cream** (`#FAF5EB` — same cream as the client logo strip above). The section flows visually from the client strip into the new section; the dark navy products section sits beneath as a hard colour cut.

### Layout
Two-row composition (not two-column):

**Row 1 (top half) — section intro, centred:**
- Section micro-label in mono uppercase, coral, ~11px, letter-spacing 0.22em
  > *HOW WE WORK*
- Specialist sentence in Stolzl 500, ~36-44px desktop / 28-32px mobile, deep navy:
  > *"We are specialists in buildings, energy and climate. We cut through the complexity of decarbonisation — and build the tools your people need to act on it."*
- Maximum width on the sentence: ~720px, centred. Allow it to wrap into 2-3 lines naturally.
- Vertical padding above section header: ~120px

**Row 2 (bottom half) — the dot-grid triptych:**
- Centred sub-header in mono uppercase, navy at 60% opacity, ~11px, letter-spacing 0.22em
  > *This is how we work.*
- Beneath the sub-header, three navy cards in a horizontal row showing the three phases (Decode · Build · Partner)

### The three cards

Three cards in a `grid-template-columns: 1fr 1fr 1fr` layout with ~24px gap. On mobile, stack vertically.

Each card:
- Background: `#1a2540` (deep navy)
- Border-radius: 20px
- Padding: 36px
- Aspect ratio: 1:1 (square)
- Box-shadow: `0 12px 36px -16px rgba(0, 0, 0, 0.15)` (lighter shadow than dark sections, suits cream surrounding)
- Inside each card: an SVG visualisation (see specs below)
- Below each card (in the body of the section, not inside the card):
  - Small mono number/label: `01 · DECODE` / `02 · BUILD` / `03 · PARTNER`, ~11px, coral, letter-spacing 0.18em
  - Phase name: `Decode` / `Build` / `Partner` in Inter 500, 20px, deep navy
  - Body copy: Inter regular, 12-13px, deep navy at 65% opacity, max-width 260px, centred under each card

### The three SVG visualisations

All three SVGs live inside the navy cards. Each SVG uses a `viewBox="0 0 200 200"` so the contents scale cleanly. Colours:
- Cream `#EDE5D8` for dots, lines, and frame elements
- Coral `#F75A55` for accent elements

#### State 1 — Decode (pulsing blurred dots)

A 5×5 grid of cream dots (7px radius each), positioned at:
- Row 1 (y=25): x positions 25, 62.5, 100, 137.5, 175
- Row 2 (y=62.5): same x positions
- Row 3 (y=100): same
- Row 4 (y=137.5): same
- Row 5 (y=175): same

Each dot has a CSS class `pulse-dot` with `filter: blur(2px)` applied. Animate the blur and opacity:

```css
@keyframes pulseBlur {
  0%, 100% { filter: blur(2.5px); opacity: 0.7; }
  50% { filter: blur(1px); opacity: 1; }
}
```

Apply five variant animations with different durations and delays so dots are out of sync:
- `.pulse-dot-0 { animation: pulseBlur 3.4s ease-in-out infinite; }`
- `.pulse-dot-1 { animation: pulseBlur 3.8s ease-in-out infinite 0.4s; }`
- `.pulse-dot-2 { animation: pulseBlur 3.2s ease-in-out infinite 0.8s; }`
- `.pulse-dot-3 { animation: pulseBlur 4.1s ease-in-out infinite 0.2s; }`
- `.pulse-dot-4 { animation: pulseBlur 3.6s ease-in-out infinite 1.1s; }`

Distribute the five variants across the 25 dots roughly evenly so the field has a varied, alive rhythm without any pattern being obvious.

#### State 2 — Build (outer connected, inner outlined)

Same 5×5 grid coordinates as State 1.

**The outer 16 dots** (perimeter) are filled cream (`fill: #EDE5D8`), 7px radius, no blur, no animation.

**A perimeter line** connects the four corner dots, forming a clean square frame:
```svg
<line x1="25" y1="25" x2="175" y2="25" stroke="#EDE5D8" stroke-width="1.5"/>
<line x1="175" y1="25" x2="175" y2="175" stroke="#EDE5D8" stroke-width="1.5"/>
<line x1="175" y1="175" x2="25" y2="175" stroke="#EDE5D8" stroke-width="1.5"/>
<line x1="25" y1="175" x2="25" y2="25" stroke="#EDE5D8" stroke-width="1.5"/>
```

**The inner 9 dots** are outlined only — `fill: none; stroke: #EDE5D8; stroke-width: 1.5; r: 7`.

No animation on State 2 — it is the stable, structured state.

#### State 3 — Partner (two overlapping squares)

No dots in State 3. Two clean cream-stroked squares overlapping diagonally.

- **First square** (top-left): `<rect x="20" y="20" width="115" height="115" fill="none" stroke="#EDE5D8" stroke-width="2"/>`
- **Second square** (bottom-right): `<rect x="65" y="65" width="115" height="115" fill="none" stroke="#EDE5D8" stroke-width="2"/>`
- **Coral overlap region**: `<rect x="65" y="65" width="70" height="70" fill="rgba(247, 90, 85, 0.3)" stroke="#F75A55" stroke-width="1.5"/>`

The overlap reads as "where the two organisations meet — and where the active work happens." The coral signals *active relationship*, consistent with how coral is used across the site (the active CTA, the active rotating headline, the active hover state).

No animation on State 3.

### Phase copy (beneath each card)

**01 · DECODE — Decode**
> *Embed with your team. Uncover the data, the workflows, the truth of how your organisation runs.*

**02 · BUILD — Build**
> *Use that data to create bespoke tools that help your people act.*

**03 · PARTNER — Partner**
> *Stay alongside you as the work evolves.*

### Section motion

The section uses the site-wide upward mask-reveal animation when it enters the viewport (specialist sentence reveals, then the row of cards reveals with a stagger of ~120ms between cards).

### Mobile behaviour
Below 768px, the three cards stack vertically. Each card maintains its 1:1 aspect ratio. The specialist sentence reduces to ~28-32px. The "This is how we work." sub-header stays consistent at ~11px.

---

## Change 3 — Products section inversion

### Current state
The "Our products" section currently sits on a **cream background** with three product marks floating in space, hover-revealing bounding boxes with copy on hover.

### Change
**Invert the section to navy.**

### Specific changes

**Background:** Deep navy `#1a2540` with the standard NZA ambient blob field (same blob system as the hero — three navy tones + coral at low opacity + cream at low opacity, heavy blur). Continuous visual language with the hero. The section above (How we work) ends on cream; this section begins on navy — **hard colour cut, no gradient.**

**Section header:**
- Micro-label: *OUR PRODUCTS* — mono, coral, ~11px, letter-spacing 0.22em (was on cream → now on navy, stays coral)
- Headline (currently on cream): *"Our products"* — change from coral-on-cream to **cream-on-navy with the word in DM Serif Display italic, coral**. Same word-treatment pattern as the rest of the site.

Actually, simpler: keep the headline as "Our products" in Stolzl, cream on navy. No italic accent. The hero already has the italic accent treatment; products doesn't need to repeat it.

**Intro paragraph beneath the headline:**
*"Three tools we've built to help organisations move on net zero — each one solving a different piece of the puzzle."*
- Change colour from navy-on-cream to **cream at 75% opacity on navy**
- Type and size stay the same (~24px Inter regular)

**Sub-line (currently in coral mono):**
*"Hover to see what each does. Click to dive in."*
- Stays coral. Stays mono. Stays the same size.

**Product marks:**
- All three marks (PABLO with gradient, NZ:AI with teal ring, decodED with green mark) work better on navy than cream — they were designed for dark backgrounds
- Position and size unchanged
- No other changes to the marks themselves

**Hover-revealed bounding box (per mark on hover):**
- Background: `rgba(255, 255, 255, 0.04)` (very subtle cream wash — much lighter than the navy)
- Border: hairline coral `0.5px solid rgba(247, 90, 85, 0.4)`
- Border-radius: 14px
- Inner content stays the same structurally:
  - Question (serif italic, ~17px, cream)
  - Promise (~13px, cream at 65% opacity)
  - Explore link (mono, coral, ~11px, with arrow)

The reveal behaviour (other marks recede, focused mark grows) stays unchanged.

**Section background motion:**
Continuous with the hero — the blob field extends through both sections, broken only by the cream "How we work" section between them. The user scrolls from navy hero → cream client strip → cream how-we-work → navy products → navy closer. Two navy bands and two cream bands. The motion language is continuous within each navy band.

---

## Change 4 — Closer ("Let's talk") refinement

### Current state
A full-viewport closer section with a large *"Let's talk."* headline and *"Half an hour to understand..."* sub-line, with a single Get in touch button. Currently ~85% of viewport height.

### Change
Refine to a more focused, tighter section that *includes the contact icons inside it* (replacing the footer's contact icon role).

### New layout

**Background:** Continue the navy + blob field from the products section. The two sections share a continuous navy band with no colour cut between them (just the natural visual break of new content arriving).

**Section height:** ~65% viewport (down from 85%). The section closes the page without dominating it.

**Vertical composition** (top to bottom):

1. **Section micro-label** in mono uppercase, coral, ~11px, letter-spacing 0.22em:
   > *READY WHEN YOU ARE*

2. **Headline** in Stolzl 500, ~64-72px desktop / 44-52px mobile, cream:
   > *"Let's talk."*

   The `.` is in DM Serif Display italic, coral (existing pattern — keep as is).

3. **Body copy** in Inter regular, ~18px, cream at 75% opacity, centred, max-width ~580px:
   > *"We'd be delighted to hear from you. Whether you want a quick demo, a longer conversation, or just to ask questions."*

4. **Primary CTA button** — solid coral filled, white text, large:
   - Background: `#F75A55`
   - Text: `GET IN TOUCH →` in Stolzl 500, ~14px, uppercase, letter-spacing 0.12em, white
   - Padding: 14px 32px (slightly bigger than nav button)
   - Border-radius: 999px (full pill)
   - Box-shadow: `0 8px 24px -8px rgba(247, 90, 85, 0.4)` (soft coral glow)
   - On hover: background darkens to `#DC4844`, slight `translateY(-1px)`
   - Above the row of contact icons, ~48px gap

5. **Contact icons row** — three icons centred horizontally:

   Three icons, ~44px square each, with ~80px horizontal gap between them.
   
   Each icon is:
   - **Icon glyph** (outline style, cream stroke 1.5px, ~36px) — Tabler Icons or similar
     - Email icon
     - LinkedIn icon  
     - Phone icon
   - **Label** beneath the icon, in mono uppercase, ~11px, cream at 70% opacity, letter-spacing 0.15em:
     - `EMAIL`
     - `LINKEDIN`
     - `CALL`
   - **Behaviour:** each icon is a real link:
     - Email → `mailto:[Chris's NZA email]`
     - LinkedIn → NZA company LinkedIn URL
     - Phone → `tel:[NZA contact number]`
   - **On hover:** icon stroke turns coral, label turns coral (~250ms transition)

   The icons sit roughly ~40px below the CTA button.

### Section motion

Continue the blob field from the products section. The same ambient navy/coral/cream blob system, slowly drifting. Continuous motion language.

### Mobile behaviour
- Headline reduces to ~44-52px
- Body copy stays ~16px
- CTA button stays the same proportions
- Contact icons stack vertically (one per row) below the CTA, ~24px vertical gap

---

## Change 5 — Footer collapse

### Current state
The current footer has its own section with contact icons (Email, LinkedIn, Phone), labels, and a separate legal strip beneath.

### Change
**Collapse the footer to a single tiny legal strip.** All contact functionality now lives in the closer section (Change 4).

### New footer

A single horizontal band at the very bottom of the page. Approximately 60-80px tall. Background: continues the navy from the closer above.

**Layout:** Single line of text, centred, very small.

```
© 2026 Net Zero Advisory Ltd.  ·  Privacy  ·  Terms  ·  Cookies
```

**Specifics:**
- Font: Inter 500, ~11-12px
- Colour: cream at 40% opacity (deliberately quiet)
- Letter-spacing: normal
- "Privacy", "Terms", "Cookies" are three small text links — same colour, with a subtle coral underline on hover
- The middle dot separators are at slightly lower opacity (cream at 25%) for visual rhythm
- Padding: ~24px top and bottom

**If on mobile (<768px):** the line wraps to two lines if needed, with the copyright on top and the links beneath, both centred. Don't break by trying to fit on one line at very narrow widths.

### What's NOT in the footer
- No contact icons (those moved to the closer)
- No nav links (the nav is sticky and always available)
- No "registered office address" (covered by "Net Zero Advisory Ltd")
- No "Get in touch" anywhere (the closer's CTA + the sticky nav button cover this)

---

## Section sequence (final)

The page now flows as:

1. **Hero** (navy) — slot-machine headline only, no sub-line
2. **Client logo strip** (cream) — unchanged
3. **How we work** (cream) — NEW: specialist sentence + Decode/Build/Partner triptych
4. **Products** (navy) — INVERTED from cream to navy
5. **Closer "Let's talk"** (navy) — REFINED with contact icons inside
6. **Footer** (navy) — COLLAPSED to single legal line

The colour rhythm reads: navy → cream → cream → navy → navy → navy.

There are two cream bands at the top (logos + how-we-work) and three navy bands at the bottom (products + closer + footer). Each hard cut between cream and navy is intentional — it breaks the page into sections without need for visual separators.

---

## Acceptance criteria

A successful implementation passes all of these:

1. The hero no longer contains the *"We are specialists in buildings, energy and climate..."* sub-line — only the slot-machine headline remains
2. A new "How we work" section sits between the client strip and products section, on a cream background
3. The "How we work" section contains the specialist sentence (now relocated here), the "This is how we work." sub-header, and three navy cards with the three SVG visualisations (Decode pulsing dots / Build framed grid / Partner overlapping squares)
4. The three phase copy blocks beneath the cards are exactly as specified
5. The products section background has changed from cream to navy
6. The products section text colours have inverted appropriately (cream on navy)
7. The product marks render correctly on the new navy background
8. The hover-revealed bounding boxes on each product mark use the dark-background styling (`rgba(255,255,255,0.04)` background, hairline coral border)
9. The closer section copy reads: *"READY WHEN YOU ARE"* (micro-label) → *"Let's talk."* (headline) → *"We'd be delighted to hear from you. Whether you want a quick demo, a longer conversation, or just to ask questions."* (body)
10. Three contact icons (Email, LinkedIn, Call) appear inside the closer section, beneath the CTA button, with the correct labels and links
11. The footer has been collapsed to a single tiny line of text containing copyright + three legal links
12. No "Get in touch" / contact icon redundancy between the closer and footer — the contact mechanics live in the closer only
13. The page section sequence reads: hero → logos → how-we-work → products → closer → footer
14. All section transitions use hard colour cuts (no gradients)
15. Mobile breakpoints render correctly across all changed sections
16. `prefers-reduced-motion` is respected — pulsing dots in State 1 of the dot triptych settle to a static state if requested

---

## Files referenced

**Existing (already shipped):**
- NZA design tokens (colours, type stack)
- Slot-machine hero component
- Client logo strip component
- Products section component (will be modified, not replaced)
- Nav system
- Preloader

**Pending — nothing.** This brief uses only existing assets and tokens. No new image files, no new product marks, no new content beyond the locked copy in this brief.

---

## Out of scope

These are not part of this brief:

- Changes to the navigation (already shipped per `nza-navigation-brief.md`)
- Changes to the preloader (unchanged)
- Changes to product page content (covered by `nza-product-page-template-brief.md`)
- Changes to About, Approach, Expertise, or Who-we-work-with pages (separate briefs)
- The mission statements for the About page (separate brief, not yet written)

---

## Questions Claude Code should raise rather than guess

- The exact email address and phone number for the closer section's contact icons (use `mailto:hello@nza.consulting` and `tel:+44...` placeholders if not specified)
- Whether existing Tabler Icons are installed (referenced for the contact icons)
- Whether there are any tracking events attached to the current footer that need to be migrated to the closer's contact icons
- Whether the existing "Let's talk." section name in the codebase is the same as what's being modified — confirm before making changes
- The exact registered office address line — if Claude Code finds a current address in the codebase footer, ask before changing or removing it

---

*End of brief.*
