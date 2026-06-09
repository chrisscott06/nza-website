import { ProductPage } from '../components/product/ProductPage'
import { nzaiConfig } from '../data/products/nzaiConfig'

/**
 * /nz-ai - NZ:AI product page. Renders the shared product page template
 * with the NZ:AI config. The previous bespoke editorial NZ:AI page has
 * been replaced per the new product page template brief.
 *
 * Brief: docs/briefs/nza-product-page-template-brief.md
 * Config: src/data/products/nzaiConfig.ts
 */
export function NzAiPage() {
  return <ProductPage config={nzaiConfig} />
}
