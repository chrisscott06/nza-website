# Brief: NZA Expertise page — interactive zone reveal

**For:** Claude Code (implementation), via Kerry / NZA team
**Page:** `/expertise` (page 02 in the site sequence)
**Date:** 11 May 2026
**Status:** Copy locked, interaction logic locked, implementation ready

---

## What you're building

The Expertise page makes one argument: *NZA's expertise spans the whole picture, from how a building uses energy through to the decisions and governance that shape what gets built.* It does this through an SVG cityscape illustration that maps four zones — **Operations**, **Energy**, **Supply chain**, **Influence** — left to right across a spectrum from *most controllable* to *most influenceable*.

On desktop, hovering or tapping any of the four zone labels triggers two things simultaneously: (a) a coral radial glow appears behind the corresponding zone of the illustration, picking out the parts of the picture that belong to that zone; (b) a panel appears anchored to the zone, containing the NZA expertise description.

On mobile, the illustration is dropped entirely. Mobile users get the headline, body, and four expandable cards with the same panel content.

---

## Files involved

- **SVG asset:** `ghg-protocol-square-NZA.svg` — already on the page, already styled correctly for navy background (cream strokes). No edits to the SVG file itself.
- **Expertise page component:** wherever the page currently lives in the codebase (the existing version with the muted illustration and the headline *Buildings expertise, systems thinking*).

---

## Locked copy

### Page headline (unchanged)
> Buildings expertise, *systems thinking.*

(*systems thinking* in DM Serif Display italic, coral #F75A55, ~1.10× cap-height bump per the design system rule.)

### Body paragraph (under headline, replaces current body)

> NZA's foundation is in building physics, systems engineering and energy markets. From there we work outward — across the wider networks, decisions and markets that shape every estate — with the digital tools to model all of it together.

Two sentences. No third sentence — the previous *One practice…* close has been dropped.

### Four zone labels (above the arrow in the SVG)

> **Operations** · **Energy** · **Supply chain** · **Influence**

Sentence case (not full caps as in the SVG source). Coral (#F75A55). Small caps tracking optional but the casing should be Title-case rather than all-caps.

### Four panel bodies (revealed on zone hover/tap)

**Operations**
> How a building actually uses energy. Fabric, controls, occupancy patterns, wasted energy — the most controllable part of the picture, and the cheapest place to start cutting carbon and cost.

**Energy**
> Generation, storage, tariffs, grid constraints, flexibility. The systems behind the meter and the markets in front of it — and how those two relationships shape what's worth investing in.

**Supply chain**
> Embodied carbon, procurement governance, supplier engagement, materials, equipment. The chain shapes how decisions account for cost and carbon together — and what's actually possible downstream.

**Influence**
> Specification, governance, occupant decisions, policy. Beyond the value chain is often where you can shape the most change.

Panel headings (the zone names at the top of each panel) take a single-word coral DM Serif italic accent if natural — but if the heading is just the zone name, plain coral sans is fine. Use designer judgement.

---

## Desktop interaction spec

### Default state

- Headline + body on the right column.
- SVG illustration on the left column at full resolution.
- Four zone labels visible above the gradient arrow at the top of the SVG, in HTML (not in SVG `<text>`).
- The four in-SVG labels (OPERATIONS / ENERGY SYSTEMS / SUPPLY CHAIN / INFLUENCE inside `_6_-_annotation`) hidden via CSS (`display: none` on those specific `<text>` elements, or by giving `_6_-_text` minus the arrow a hidden class).
- Line art stroke weight bumped on `.st0` paths from 1px to ~2px for stronger presence on navy. (Adjust by eye — the goal is the illustration reading clearly without becoming heavy.)
- The coral → magenta gradient arrow at the top stays as-is. The magenta dashed lines from the people-illustration also stay — both are doing diagrammatic colour-coding work.

### Hover/tap interaction

When a user hovers a zone label on desktop (or taps on touch devices that support hover-via-tap):

1. **Coral radial glow appears behind the relevant zone of the illustration.** Achieved via a coral overlay clipped to the zone's x-coordinate boundary, with a soft radial gradient (coral at ~25–35% opacity in the centre, fading to transparent at the edges). Blur the overlay edge so it doesn't feel like a hard rectangle.

2. **A panel slides/fades in, anchored to the zone.** Panel style mirrors the Molson "Scope 3 · Value Chain" callout pattern: cream background (#EDE5D8), navy text, narrow coral accent on the zone-name heading at the top. Panel width roughly 280–320px. Vertical position: roughly centred against the upper half of the illustration so it doesn't obscure the buildings/cityscape below. The panel should clearly *belong to* the zone — placed inside or immediately adjacent to the zone's x-coordinate slice.

3. **Transition timing:** 200–250ms ease-out for both the glow appearance and the panel reveal. The glow should appear *slightly before* the panel, so the user's eye is drawn to the illustration zone first, then the panel arrives.

4. **Dismiss:** When the user moves off the label (or taps elsewhere), the panel and glow fade out with a slightly faster transition (~150ms) so dismissal feels responsive. If another zone is hovered before dismissal completes, the panel content should cross-fade rather than fully dismissing and re-appearing — feels smoother.

### Zone x-coordinate boundaries

The SVG `viewBox` is `0 0 1289.12 933.75`. The four vertical dividers inside `_6_-_annotation` divide it as:

| Zone | x-min | x-max |
|---|---|---|
| Operations | 0 | 327 |
| Energy | 327 | 649 |
| Supply chain | 649 | 969 |
| Influence | 969 | 1289 |

The radial glow overlay should clip to these slices. The panel anchor for each zone should sit roughly centred on its slice, with the top of the panel around y=160 (above the cityscape line).

### Keyboard and accessibility

- Each of the four zone labels must be a focusable element (button or anchor with appropriate ARIA).
- Keyboard focus on a label triggers the same hover state (glow + panel reveal).
- `Tab` cycles through the four labels in left-to-right order.
- `Escape` while focused dismisses any open panel.
- Each panel should have `aria-labelledby` pointing to its zone label.
- Stroke-only line art needs sufficient contrast — the 2px bump on cream against navy should clear WCAG AA for non-text contrast (3:1). Test if uncertain.

---

## Mobile interaction spec

Below ~768px viewport:

- The SVG cityscape is hidden (`display: none`).
- Headline and body display as normal at the top.
- Below the body, four expandable cards stack vertically — one per zone.
- Each card shows the zone name in coral as the card heading, with an expand/collapse affordance (chevron or plus icon).
- Tapping a card expands it to reveal the panel body. Tapping again collapses it.
- Multiple cards can be open simultaneously (don't force accordion-style single-open behaviour — users may want to compare).
- Card visual style should match the panel style on desktop: cream background, navy text, coral accent on the heading.

The mobile page does **not** show the arrow, the gradient, or any visual remnant of the illustration. It's a clean expandable-list experience.

---

## What stays untouched

- The SVG file itself is not edited. All visual changes (stroke weight bump, label hiding) are done in CSS overriding the SVG's existing classes.
- The page's headline copy is unchanged in content (just the italic word treatment — already locked).
- The site's overall navigation, footer, page numbering (02 · EXPERTISE) all stay.

---

## Type scale note

The page headlines across the site are currently feeling too large. **This is being addressed in a separate brief covering the site-wide type scale recalibration** — do not make ad-hoc size changes to the Expertise headline in this brief. If the headline appears too large after this work is complete, that's expected and will be resolved by the type-scale pass.

---

## Decisions left to Claude Code's judgement

- Exact CSS values for transition timing curves (ease-out flavour, exact ms)
- Exact radial gradient opacity, blur radius, and falloff
- Exact panel width, padding, border-radius
- Whether to use CSS-only or include a small JS state machine for the hover/focus/cross-fade logic
- Mobile breakpoint exact value (768px is a starting suggestion)
- Accessibility implementation details (specific ARIA patterns, focus ring styling)

The brief is opinionated about *what* should happen and *roughly how*. Make sensible implementation calls on the details and surface anything that needs a design decision back to Chris.

---

## Acceptance criteria

A working implementation should pass these tests:

1. On desktop, hovering Operations causes a coral glow over the leftmost zone of the illustration and reveals a panel containing the Operations copy.
2. Moving from Operations to Energy cross-fades the glow and the panel — no flicker, no full dismiss-and-reappear.
3. Moving off all labels dismisses the glow and panel within ~150ms.
4. Keyboard users can tab through the four labels and trigger the same reveal behaviour via focus.
5. Escape dismisses any open panel.
6. On mobile, no SVG appears; four expandable cards stack below the body text with the same content.
7. The body copy is the two-sentence version above. The previous three-sentence version is gone.
8. The four zone labels are sentence case, not all-caps.
9. The line art reads clearly on navy — visible from normal viewing distance, not faint.

---

*End of brief.*
