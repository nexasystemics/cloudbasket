// © 2026 NEXQON HOLDINGS — CloudBasket scraper.ts
// services/price-engine/scraper.ts — Puppeteer price scraper with Upstash cache.
import puppeteer, { Browser } from 'puppeteer'
import { Pool } from 'pg'
import { cacheGet, cacheSet } from '@/lib/cache/redis'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

interface ProductPrice {
  productId: string
  price: number
  currency: string
  source: string
}

export class PriceScraper {
  private browser: Browser | null = null

  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    }
  }

  async scrapePrice(productUrl: string, selectors: string[]): Promise<number | null> {
    const cacheKey = `price:${productUrl}`
    const cached = await cacheGet(cacheKey)
    if (cached) return parseFloat(cached)

    await this.initialize()
    if (!this.browser) return null
    const page = await this.browser.newPage()

    try {
      await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 30000 })

      let priceText: string | null = null
      for (const selector of selectors) {
        try {
          priceText = await page.$eval(selector, (el: Element) => el.textContent)
          if (priceText) break
        } catch {
          continue
        }
      }

      if (!priceText) return null

      const numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''))
      if (isNaN(numericPrice)) return null

      await cacheSet(cacheKey, numericPrice.toString(), 86400)
      return numericPrice
    } catch {
      return null
    } finally {
      await page.close()
    }
  }

  async scrapeAndSave(productId: string, productUrl: string, selectors: string[]): Promise<void> {
    const price = await this.scrapePrice(productUrl, selectors)
    if (!price) return

    await pool.query(
      `INSERT INTO price_history (product_id, price, currency, source, recorded_at) VALUES ($1, $2, $3, $4, NOW())`,
      [productId, price, 'INR', 'scraped']
    )
    await pool.query('UPDATE products SET base_price = $1 WHERE product_id = $2', [price, productId])
  }

  async scrapeBatch(products: Array<{ productId: string; url: string; selectors: string[] }>): Promise<void> {
    for (const product of products) {
      await this.scrapeAndSave(product.productId, product.url, product.selectors)
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}

export const priceScraper = new PriceScraper()


