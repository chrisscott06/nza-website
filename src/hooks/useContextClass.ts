import { useEffect } from 'react'

/**
 * Adds one (or more) classes to <body> while the calling component is
 * mounted, removing them on unmount. Used by pages to declare their
 * visual context to the site-wide navigation:
 *
 *   useContextClass('context-pablo')
 *   useContextClass(['context-cream', 'on-paper'])
 *
 * The site-wide nav's logo recolour, CTA variant (outlined vs filled),
 * and background tint all read off these classes via CSS, so a page
 * can declare its context once at the top of its component and the
 * nav adapts automatically.
 *
 * Context classes by page (per docs/briefs/nza-navigation-brief.md):
 *
 *   context-navy     - default for navy NZA sections (landing hero, GIT)
 *   context-cream    - cream NZA sections (Expertise, Approach, etc.)
 *   context-pablo    - PABLO product page (aubergine + violet)
 *   context-nzai     - NZ:AI product page (deep navy + teal)
 *   context-decoded  - decodED product page (cream-warm + green/orange)
 *
 * Multi-class behaviour: the homepage transitions context-navy ->
 * context-cream as the user scrolls from the navy hero into the cream
 * client strip. That's handled by an IntersectionObserver-driven
 * effect in HomeScreen (separate from this hook), not by useContextClass.
 * This hook handles the simple per-page case.
 *
 * Safe to call multiple times in the same component - classList.add
 * is idempotent. Calling with the same class from two components
 * simultaneously is also fine; the cleanup removes the class only
 * once per mount, so the other component's class persists.
 */
export function useContextClass(className: string | string[]) {
  useEffect(() => {
    const classes = Array.isArray(className) ? className : [className]
    document.body.classList.add(...classes)
    return () => {
      document.body.classList.remove(...classes)
    }
  }, [Array.isArray(className) ? className.join(' ') : className])
}
