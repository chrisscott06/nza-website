import { ProductPage } from '../components/product/ProductPage'
import { decodedConfig } from '../data/products/decodedConfig'

/**
 * /decoded - decodED product page. Renders the shared product page
 * template with the decodED config. Previously a stub; now populated
 * per the product page template brief.
 *
 * decodED uses the light-canvas variant of the template (cream-warm
 * throughout, no blob fields, solid-filled CTAs) - Section 7 of the
 * brief.
 *
 * Brief: docs/briefs/nza-product-page-template-brief.md
 * Config: src/data/products/decodedConfig.ts
 */
export function DecodedPage() {
  return <ProductPage config={decodedConfig} />
}
