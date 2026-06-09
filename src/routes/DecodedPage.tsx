import { useContextClass } from '../hooks/useContextClass'

/**
 * /decoded - decodED product page stub. Cream-warm ground, deep
 * green headline + orange micro-label per brief Section 5. Full
 * product page template (separate brief) replaces this stub later;
 * for now its purpose is to demonstrate the site nav adapting to
 * context-decoded (green logo recolour + orange advisory + solid-
 * orange CTA + cream nav bg tint).
 *
 * Brief: docs/briefs/nza-navigation-brief.md Section 5
 */
export function DecodedPage() {
  useContextClass('context-decoded')

  return (
    <main className="stub-page stub-page--decoded">
      <div className="stub-page-inner">
        <p className="stub-page-micro">/DECODED</p>
        <h1 className="stub-page-headline">
          decodED — coming soon.
        </h1>
      </div>
    </main>
  )
}
