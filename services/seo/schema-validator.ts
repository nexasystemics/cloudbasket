// services/seo/schema-validator.ts
export type SchemaValidationResult = { valid: boolean; errors: { field: string; message: string }[]; score: number }
export function validateProductSchema(schema: Record<string, unknown>): SchemaValidationResult {
  const errors: { field: string; message: string }[] = []
  if (schema['@context'] !== 'https://schema.org') errors.push({ field: '@context', message: 'Must be https://schema.org' })
  if (schema['@type'] !== 'Product') errors.push({ field: '@type', message: 'Must be Product' })
  if (!schema.name) errors.push({ field: 'name', message: 'Required' })
  if (!schema.image) errors.push({ field: 'image', message: 'Required' })
  if (!schema.offers) errors.push({ field: 'offers', message: 'Required' })
  const offers = schema.offers as any
  if (offers?.priceCurrency !== 'INR') errors.push({ field: 'offers.priceCurrency', message: 'Must be INR' })
  return { valid: errors.length === 0, errors, score: Math.max(0, 100 - errors.length * 20) }
}
export function autoFixProductSchema(productId: string, name: string, price: number, brand: string, image: string): Record<string, unknown> {
  return { '@context': 'https://schema.org', '@type': 'Product', name, image, brand: { '@type': 'Brand', name: brand }, offers: { '@type': 'Offer', price, priceCurrency: 'INR', availability: 'https://schema.org/InStock', url: `https://cloudbasket.in/product/${productId}` } }
}