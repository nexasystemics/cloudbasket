// F86: Browser Extension API endpoints
export type ExtensionProduct = { id: string; name: string; price: number; site: string; foundAt: string }

export async function getCurrentPagePrice(url: string): Promise<ExtensionProduct | null> {
  try {
    const site = new URL(url).hostname
    if (site.includes('amazon')) {
      return { id: 'ext-product', name: 'Product from Amazon', price: 0, site: 'Amazon', foundAt: url }
    }
    if (site.includes('flipkart')) {
      return { id: 'ext-product', name: 'Product from Flipkart', price: 0, site: 'Flipkart', foundAt: url }
    }
    return null
  } catch { return null }
}