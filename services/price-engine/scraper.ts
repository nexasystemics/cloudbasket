import puppeteer from 'puppeteer';
import Redis from 'ioredis';
import { Pool } from 'pg';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

interface ProductPrice {
  productId: string;
  price: number;
  currency: string;
  source: string;
}

export class PriceScraper {
  private browser: any = null;

  /**
   * Initialize browser instance (reuse across scrapes)
   */
  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  /**
   * Scrape price from a product URL
   */
  async scrapePrice(productUrl: string, selectors: string[]): Promise<number | null> {
    // Check cache first (24 hour TTL)
    const cacheKey = `price:${productUrl}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`💰 Cache hit for ${productUrl}`);
      return parseFloat(cached);
    }

    await this.initialize();
    const page = await this.browser.newPage();

    try {
      console.log(`🔍 Scraping ${productUrl}...`);
      await page.goto(productUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Try multiple selectors
      let priceText = null;
      for (const selector of selectors) {
        try {
          priceText = await page.$eval(selector, (el: any) => el.textContent);
          if (priceText) break;
        } catch (e) {
          continue;
        }
      }

      if (!priceText) {
        console.warn(`⚠️ No price found for ${productUrl}`);
        return null;
      }

      // Extract numeric value
      const numericPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      
      if (isNaN(numericPrice)) return null;

      // Cache for 24 hours
      await redis.setex(cacheKey, 86400, numericPrice.toString());

      console.log(`✅ Scraped price: $${numericPrice}`);
      return numericPrice;

    } catch (error) {
      console.error(`❌ Scraping error for ${productUrl}:`, error);
      return null;
    } finally {
      await page.close();
    }
  }

  /**
   * Scrape and save price to database
   */
  async scrapeAndSave(
    productId: string,
    productUrl: string,
    selectors: string[]
  ): Promise<void> {
    const price = await this.scrapePrice(productUrl, selectors);
    
    if (price) {
      // Save to price_history table
      await pool.query(
        `INSERT INTO price_history (product_id, price, currency, source, recorded_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [productId, price, 'USD', 'scraped']
      );

      // Update product base_price
      await pool.query(
        'UPDATE products SET base_price = $1 WHERE product_id = $2',
        [price, productId]
      );

      console.log(`💾 Saved price $${price} for product ${productId}`);
    }
  }

  /**
   * Batch scrape multiple products
   */
  async scrapeBatch(products: Array<{
    productId: string;
    url: string;
    selectors: string[];
  }>) {
    console.log(`📦 Starting batch scrape for ${products.length} products...`);
    
    for (const product of products) {
      await this.scrapeAndSave(product.productId, product.url, product.selectors);
      // Rate limiting - wait 2 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('✅ Batch scrape complete');
  }

  /**
   * Close browser when done
   */
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Export singleton instance
export const priceScraper = new PriceScraper();