# Plan: NZA site-wide type-scale recalibration

**Status:** Draft for review (not implemented yet)
**Date:** 11 May 2026
**Owner:** Chris (sign-off) / Co-Work (implementation when approved)
**Trigger:** Chris, on the Expertise page review — "overall the body text is too big anyway. If we are on the first page, the hero text is good because there's not much else going on on that page. On the other pages, I think we can drop down quite a few sizes for both body text and header text."

Also flagged in `expertise-page-brief.md`:
> The page headlines across the site are currently feeling too large. This is being addressed in a separate brief covering the site-wide type-scale recalibration.

This is that brief.

---

## Principle

**The Home hero is the loudest moment of the site. Every other screen has more going on, so its headline and body should sit a tier or two below the hero.**

Right now every screen shares the same global `.headline` clamp — `clamp(42px, 5vw, 76px)` — which is calibrated for the hero. On non-hero screens that scale crowds the rest of the content (Expertise has the GHG diagram fighting it; Approach has the 3×2 capability grid; Products has the 1×3 card row). The lede is similarly oversized on the inner screens; what reads as "editorial" on the hero reads as "shouty" on the inner pages.

The fix is **a tiered scale**, not an across-the-board shrink. Home keeps its current sizes. Inner screens drop to a smaller tier. The italic-on-key-word + coral fingerprint stays exactly the same — only the absolute pixel values change.

---

## Current state (desktop, ≥1100px)

| Token | Selector | Current clamp | Effective at 1440px |
|---|---|---|---|
| Headline | `.headline` | `clamp(42px, 5vw, 76px)` | ~72px |
| Lede | `.lede` | `clamp(17px, 1.3vw, 19px)` | ~19px |
| Body | `.body` | `15px` (fixed) | 15px |

iPad tier (600–1099px) already trims `.headline` to `clamp(32px, 5vw, 56px)` — that block stays, but the inner-screen tier below sits *inside* it (so on iPad, an inner-screen headline goes through *both* the iPad trim and the inner-screen trim).

Phone tier (<600px) already has per-screen trims at `clamp(24px, 7vw, 30px)` for Approach + Products. We'll extend the same pattern to Expertise + Clients.

---

## Proposed scale

### Two tiers of headline

| Tier | Screens | Desktop clamp | Effective at 1440px | Rationale |
|---|---|---|---|---|
| **Hero** | Home (`#home`) | `clamp(42px, 5vw, 76px)` *(unchanged)* | ~72px | Single bold statement, lots of whitespace. Stays loud. |
| **Inner** | Expertise, Approach, Products, Clients (+ PABLO sections after the hero) | `clamp(34px, 3.4vw, 52px)` | ~49px | One tier below — the screen has other content to share the spotlight with. |

The inner tier is roughly **−30% at 1440px** relative to hero. Same `line-height: 1.04`, same `letter-spacing`, same italic-em treatment — only the absolute size moves.

Note: I already applied a tighter version of this to `#capabilities .headline` (Expertise) as part of the panel iteration — `clamp(28px, 3vw, 42px)`. After review, we should either roll that back to the unified `clamp(34px, 3.4vw, 52px)` for consistency, *or* keep Expertise extra-trimmed because the GHG diagram is taking visual weight. **Worth eyeballing with Chris** before finalising.

### Lede

| Tier | Screens | Desktop clamp | Effective at 1440px |
|---|---|---|---|
| **Hero** | Home | `clamp(17px, 1.3vw, 19px)` *(unchanged)* | ~19px |
| **Inner** | Expertise, Approach, Products, Clients, PABLO sections | `clamp(15px, 1.05vw, 17px)` | ~17px |

Two-point drop on inner screens. Body copy still reads as editorial, but isn't competing with the headline at the same loudness.

### Body

| Selector | Current | Proposed | Why |
|---|---|---|---|
| `.body` | 15px | 14.5px | Across the board — affects card descriptions, footers, capability blurbs. Subtle but adds up. |
| `.eyebrow` | 12px | unchanged | Already at micro-tier. |

---

## How this is shipped

Single-commit CSS-only change (no JSX touches). Two new utility selectors added to `nza-website.css`:

```css
/* Inner-screen tier: headlines + lede sit one step below the Home hero
   so the rest of the screen's content can share the visual weight. */
#capabilities .headline,
#approach .headline,
#products .headline,
#clients .headline {
  font-size: clamp(34px, 3.4vw, 52px);
}
#capabilities .lede,
#approach .lede,
#products .lede,
#clients .lede {
  font-size: clamp(15px, 1.05vw, 17px);
  line-height: 1.55;
}
.body { font-size: 14.5px; }
```

If we want PABLO inner-screen sections to follow suit (likely yes), add the same rules in `pablo.css` for the relevant sections after the hero.

The existing iPad (`600–1099px`) and phone (`<600px`) blocks already cascade *after* the base — they continue to do their thing on top. The new inner-screen rules become the new desktop baseline they trim *from*.

---

## What stays exactly the same

- The italic-on-key-word + coral fingerprint. Word treatment unchanged, just smaller absolute size.
- The Home hero. No change.
- Phone tier headline clamps (`clamp(24px, 7vw, 30px)`) for Approach + Products. Add the same trim for Expertise + Clients in the same commit.
- Letter-spacing, line-height, font-weight, font-family on every text token.
- Eyebrow, eyebrow-hero, headline-second, all caption / chip styles.

---

## Verification

1. `npm run dev` — eyeball each screen at 1440×900 and confirm the inner screens feel one tier quieter than Home.
2. DevicePreview iPad portrait (768) — the iPad trim block still does its job; inner-screen headlines should land around 32–36px there.
3. DevicePreview iPhone SE (375) — confirm Expertise + Clients get the same phone trim as Approach + Products, no headline overshoot.
4. `npm run build` — clean.
5. STATUS.md updated.

---

## Decisions left to Chris

- **Locked sizes?** The numbers above are starting points; happy to nudge once we see them in browser.
- **Expertise extra trim.** Keep my already-applied `clamp(28px, 3vw, 42px)` on Expertise, or roll it back to the unified inner-tier `clamp(34px, 3.4vw, 52px)` for consistency? Vote: roll back for consistency once the diagram + text relationship feels right.
- **PABLO scope.** Apply the same inner-tier rules to PABLO sections-after-hero, or leave PABLO for a separate pass? Vote: include it here — same logic applies, and it's a 3-line addition in `pablo.css`.
- **Body 14.5px.** Borderline change; could leave `.body` at 15px and only trim the lede + headline tiers. Vote: do it — small but the cumulative effect on cards / blurbs is noticeable.

---

*End of plan.*
