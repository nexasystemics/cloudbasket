import { test, expect, Page } from '@playwright/test'
import * as fs from 'fs'

const BASE = 'http://localhost:3000'
const DIR  = 'audit/screenshots'

const ROUTES = [
  '/', '/products', '/deals', '/deals/flash',
  '/compare', '/pod', '/pod/tshirts', '/pod/mugs',
  '/pod/phone-cases', '/blog', '/search?q=mobile',
  '/about', '/contact', '/careers', '/faq',
  '/login', '/register', '/associates',
  '/affiliate-disclosure', '/legal/privacy',
  '/legal/terms', '/cookies', '/cj',
  '/category/mobiles', '/category/laptops',
  '/category/fashion', '/category/home',
  '/category/beauty', '/category/sports',
]

test('CloudBasket Full Audit', async ({ page }) => {
  fs.mkdirSync(DIR, { recursive: true })
  const results: string[] = []

  for (const route of ROUTES) {
    const res = await page.goto(BASE + route, {
      waitUntil: 'domcontentloaded', timeout: 30000
    })

    const status  = res?.status() ?? 0
    const body    = (await page.textContent('body') ?? '').toLowerCase()
    const title   = await page.title()
    const issues: string[] = []

    if (status >= 400) issues.push(`HTTP ${status}`)
    if (body.includes('404')) issues.push('404 text found')
    if (body.includes('not found')) issues.push('Not found text')
    if (body.includes('lorem ipsum')) issues.push('Lorem ipsum found')
    if (!body.includes('nexqon')) issues.push('NEXQON branding missing')
    if (!title || title.length < 3) issues.push('Title missing')

    const imgs = await page.$$('img')
    let brokenImgs = 0
    for (const img of imgs) {
      const w = await img.evaluate((el: HTMLImageElement) => el.naturalWidth)
      if (w === 0) brokenImgs++
    }
    if (brokenImgs > 0) issues.push(`${brokenImgs} broken images`)

    const name = route.replace(/\//g, '-').replace(/\?.*/, '') || '-home'
    await page.screenshot({
      path: `${DIR}/${name}.png`,
      fullPage: true
    })

    const status_label = issues.length === 0 ? 'PASS' :
                         issues.length <= 2   ? 'WARN' : 'FAIL'

    results.push(`${status_label} | ${route} | ${issues.join(', ') || 'No issues'}`)
    console.log(`${status_label} | ${route} | ${issues.join(', ') || 'OK'}`)
  }

  fs.writeFileSync('audit/results.txt', results.join('\n'))
  console.log('\nScreenshots saved to audit/screenshots/')
  console.log('Results saved to audit/results.txt')

  const fails = results.filter(r => r.startsWith('FAIL')).length
  expect(fails).toBeLessThan(10)
})
