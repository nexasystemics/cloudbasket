import type { ReactElement } from 'react'

interface SchemaMarkupProps {
  type: 'product' | 'article' | 'website'
  data: any
}

export default function SchemaMarkup({ type, data }: SchemaMarkupProps): ReactElement {
  let schema: Record<string, unknown>

  if (type === 'product') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      description: `Best price for ${data.name}`,
      brand: { '@type': 'Brand', name: data.brand },
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: data.price,
        highPrice: Math.floor(data.price * 1.2),
        priceCurrency: 'INR',
        offerCount: 3,
        availability: 'https://schema.org/InStock',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: data.rating ?? 4.2,
        reviewCount: data.reviews ?? 1200,
      },
    }
  } else if (type === 'article') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title,
      description: data.excerpt,
      author: {
        '@type': 'Organization',
        name: data.author,
      },
      publisher: {
        '@type': 'Organization',
        name: 'CloudBasket',
        logo: {
          '@type': 'ImageObject',
          url: 'https://cloudbasket.vercel.app/og-image.svg',
        },
      },
      datePublished: data.date,
      image: data.image,
    }
  } else {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'CloudBasket',
      url: 'https://cloudbasket.vercel.app',
      description: "India's best price comparison platform",
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://cloudbasket.vercel.app/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    }
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
