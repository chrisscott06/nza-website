import { useContextClass } from '../hooks/useContextClass'

/**
 * /clients - "Who we work with" stub. Cream context (NZA inner page
 * treatment). Replaced by the Our Work / case studies page (separate
 * brief) later. For now this is just a placeholder so the
 * "Who we work with" link in the site nav resolves to a real route.
 */
export function ClientsPage() {
  useContextClass('context-cream')

  return (
    <main className="stub-page stub-page--cream">
      <div className="stub-page-inner">
        <p className="stub-page-micro">/CLIENTS</p>
        <h1 className="stub-page-headline">
          Who we work with — coming soon.
        </h1>
      </div>
    </main>
  )
}
