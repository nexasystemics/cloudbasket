import type { ReactElement } from 'react'

type ProductSchemaData = {
  name: string
  brand: string
  price: number
  rating?: number
  reviews?: number
}

type ArticleSchemaData = {
  title: string
  excerpt: string
  author: string
  date: string
  image: string
}

type WebsiteSchemaProps = {
  type: 'website'
  data?: Record<string, never>
}

type ProductSchemaProps = {
  type: 'product'
  data: ProductSchemaData
}

type ArticleSchemaProps = {
  type: 'article'
  data: ArticleSchemaData
}

type SchemaMarkupProps = WebsiteSchemaProps | ProductSchemaProps | ArticleSchemaProps

const BASE_URL = 'https://cloudbasket.co'

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
          url: `${BASE_URL}/brand/logo-full.svg`,
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
      url: BASE_URL,
      description: "India's best price comparison platform",
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
