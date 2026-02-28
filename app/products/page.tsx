import { getTheme } from '@/lib/themes'
import { headers } from 'next/headers'
import ProductsClient from '@/components/ProductsClient'



export default async function ProductsPage() {
  const headersList = await headers()
  const tenant = headersList.get('x-tenant') || 'cloudbasket'
  const theme = getTheme(tenant)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SECTION 1 — Page Header */}
      <section
        className="py-10 px-4 text-white"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold">Product Catalog</h1>
          <p className="mt-2 text-lg opacity-90">
            Compare prices across Amazon, Flipkart and top brands
          </p>
        </div>
      </section>

      <ProductsClient theme={theme} />

      {/* SECTION 6 — CTA Banner */}
      <section
        className="py-12 px-4 text-white"
        style={{ backgroundColor: theme.secondaryColor }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-bold">Can&apos;t find what you&apos;re looking for?</h2>
          <p className="mt-2 text-white/90 text-sm">
            Browse our full collection or search directly on Amazon and Flipkart
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.amazon.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center px-6 py-3 rounded-lg bg-white font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ color: theme.primaryColor }}
            >
              Search Amazon
            </a>
            <a
              href="https://www.flipkart.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center px-6 py-3 rounded-lg bg-white font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ color: theme.primaryColor }}
            >
              Search Flipkart
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
