// lib/voice-search/optimisation.ts
export const HINDI_TO_ENGLISH: Record<string, string> = { 'sabse sasta': 'cheapest', 'best wala': 'best', 'sasta': 'cheap', 'accha': 'good', 'kahan milega': 'where to buy', 'kitne ka': 'price of' }
export function normaliseVoiceQuery(query: string): string {
  let n = query.toLowerCase(); Object.entries(HINDI_TO_ENGLISH).forEach(([h, e]) => { n = n.replace(new RegExp(h, 'gi'), e) }); return n.trim()
}
export function generateConversationalSchema(productId: string, productName: string, price: number, brand: string): Record<string, unknown> {
  return { '@context': 'https://schema.org', '@type': 'QAPage', mainEntity: [{ '@type': 'Question', name: `Where can I buy ${productName} cheapest?`, acceptedAnswer: { '@type': 'Answer', text: `Buy ${productName} by ${brand} at ₹${price.toLocaleString('en-IN')} on CloudBasket. Compare prices: cloudbasket.co/product/${productId}` } }] }
}
