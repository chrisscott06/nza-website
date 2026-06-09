import { ProductPage } from '../components/product/ProductPage'
import { pabloConfig } from '../data/products/pabloConfig'

/**
 * /pablo - PABLO product page. Renders the shared product page template
 * with the PABLO config. The previous bespoke editorial PABLO page (with
 * the custom charts engine) has been replaced per the new product page
 * template brief - the new template is the marketing-front-door page for
 * the product.
 *
 * Brief: docs/briefs/nza-product-page-template-brief.md
 * Config: src/data/products/pabloConfig.ts
 */
export function PabloPage() {
  return <ProductPage config={pabloConfig} />
}
