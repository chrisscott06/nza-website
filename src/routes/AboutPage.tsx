import { useContextClass } from '../hooks/useContextClass'

/**
 * /about - "Who we are" stub. Cream context (NZA inner page treatment)
 * matching Approach + Expertise so the nav reads the right colours.
 * Replaced by the full About page (separate brief) later.
 */
export function AboutPage() {
  useContextClass('context-cream')

  return (
    <main className="stub-page stub-page--cream">
      <div className="stub-page-inner">
        <p className="stub-page-micro">/ABOUT</p>
        <h1 className="stub-page-headline">
          Who we are — coming soon.
        </h1>
      </div>
    </main>
  )
}
