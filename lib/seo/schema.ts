// F78: Schema Markup for SEO + Voice Search
export function generateProductSchema(product: { id: string; name: string; price: number; originalPrice?: number; brand: string; image: string; description?: string; rating?: number; reviewCount?: number }) {
  return {
    '@context': 'https://schema.org', '@type': 'Product',
    name: product.name, brand: { '@type': 'Brand', name: product.brand },
    image: product.image, description: product.description || `Buy ${product.name} at the best price in India`,
    offers: { '@type': 'Offer', url: `https://cloudbasket.co/products/${product.id}`, priceCurrency: 'INR', price: product.price, priceValidUntil: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], availability: 'https://schema.org/InStock', seller: { '@type': 'Organization', name: 'CloudBasket' } },
    ...(product.rating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount || 1, bestRating: 5, worstRating: 1 } } : {})
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: `https://cloudbasket.co${item.url}` }))
  }
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } }))
  }
}

export function generateSiteSearchSchema() {
  return {
    '@context': 'https://schema.org', '@type': 'WebSite', name: 'CloudBasket', url: 'https://cloudbasket.co',
    potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: 'https://cloudbasket.co/search?q={search_term_string}' }, 'query-input': 'required name=search_term_string' }
  }
}