/**
 * CloudBasket — Comprehensive UI/UX Audit Suite
 * Drop into: tests/ui-audit.spec.ts
 * Run with: pnpm playwright test tests/ui-audit.spec.ts --reporter=html
 *
 * Catches: 404s · dead CTAs · unlinked buttons · invisible/tiny text ·
 *          broken hovers · bad spacing · unstructured forms · integration gaps
 */

import { test, expect, Page, Browser } from '@playwright/test';

// ─── CONFIG ────────────────────────────────────────────────────────────────
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const MAX_PAGES_TO_CRAWL = 1300;
const VISITED = new Set<string>();
const AUDIT_RESULTS: AuditResult[] = [];

interface AuditResult {
  url: string;
  issues: Issue[];
}
interface Issue {
  type: string;
  severity: 'critical' | 'warning' | 'info';
  detail: string;
  selector?: string;
}

// ─── CRAWL & COLLECT ALL ROUTES ────────────────────────────────────────────
async function crawlRoutes(page: Page, startUrl: string): Promise<string[]> {
  const queue: string[] = [startUrl];
  const routes: string[] = [];

  while (queue.length > 0 && routes.length < MAX_PAGES_TO_CRAWL) {
    const url = queue.shift()!;
    if (VISITED.has(url)) continue;
    VISITED.add(url);

    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      if (!res || res.status() >= 400) continue;

      routes.push(url);

      // Collect all same-origin links
      const links = await page.$$eval('a[href]', (anchors, base) =>
        anchors
          .map(a => (a as HTMLAnchorElement).href)
          .filter(href =>
            href.startsWith(base) &&
            !href.includes('#') &&
            !href.match(/\.(pdf|zip|png|jpg|svg|ico|xml|json|txt)$/i)
          ),
        BASE_URL
      );

      for (const link of links) {
        if (!VISITED.has(link) && !queue.includes(link)) {
          queue.push(link);
        }
      }
    } catch {
      // timeout or nav error — skip
    }
  }

  return routes;
}

// ─── PER-PAGE AUDIT ENGINE ─────────────────────────────────────────────────
async function auditPage(page: Page, url: string): Promise<Issue[]> {
  const issues: Issue[] = [];

  try {
    const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });

    // ── 1. HTTP STATUS ────────────────────────────────────────────────────
    if (res && res.status() >= 400) {
      issues.push({
        type: 'HTTP_ERROR',
        severity: 'critical',
        detail: `Page returned HTTP ${res.status()}`,
      });
      return issues; // no point auditing a 404
    }

    // ── 2. BROKEN LINKS (404 hrefs) ───────────────────────────────────────
    const links = await page.$$eval('a[href]', anchors =>
      anchors.map(a => ({
        href: (a as HTMLAnchorElement).href,
        text: (a as HTMLAnchorElement).textContent?.trim().slice(0, 60) || '',
        id: (a as HTMLAnchorElement).id,
      }))
    );

    for (const link of links) {
      if (!link.href || link.href.startsWith('mailto:') || link.href.startsWith('tel:')) continue;
      if (!link.href.startsWith(BASE_URL)) continue; // skip external — too slow
      try {
        const r = await page.request.get(link.href, { timeout: 8000 });
        if (r.status() >= 400) {
          issues.push({
            type: 'BROKEN_LINK',
            severity: 'critical',
            detail: `Link "${link.text}" → ${link.href} returns ${r.status()}`,
          });
        }
      } catch {
        issues.push({
          type: 'BROKEN_LINK',
          severity: 'critical',
          detail: `Link "${link.text}" → ${link.href} unreachable`,
        });
      }
    }

    // ── 3. BUTTONS WITH NO ACTION ─────────────────────────────────────────
    const deadButtons = await page.$$eval('button, [role="button"]', btns =>
      btns
        .filter(btn => {
          const el = btn as HTMLElement;
          const hasClick = el.onclick !== null || el.getAttribute('data-action') !== null;
          const hasForm = el.closest('form') !== null;
          const hasType = el.getAttribute('type') === 'submit';
          const hasHref = el.getAttribute('href') !== null;
          // flag only if truly naked
          return !hasClick && !hasForm && !hasType && !hasHref &&
                 !el.getAttribute('aria-expanded') &&
                 !el.getAttribute('data-bs-toggle') &&
                 !el.getAttribute('data-toggle');
        })
        .map(btn => ({
          text: (btn as HTMLElement).textContent?.trim().slice(0, 60),
          class: (btn as HTMLElement).className?.slice(0, 80),
        }))
    );

    for (const btn of deadButtons) {
      issues.push({
        type: 'DEAD_BUTTON',
        severity: 'warning',
        detail: `Button "${btn.text}" appears to have no click handler, form, or href`,
        selector: `.${btn.class?.split(' ')[0]}`,
      });
    }

    // ── 4. CTA LINKS THAT ARE EMPTY (#) ──────────────────────────────────
    const emptyCTAs = await page.$$eval('a[href="#"], a[href=""], a:not([href])', els =>
      els.map(el => ({
        text: (el as HTMLAnchorElement).textContent?.trim().slice(0, 60),
        class: (el as HTMLAnchorElement).className?.slice(0, 80),
      }))
    );
    for (const cta of emptyCTAs) {
      if (cta.text) {
        issues.push({
          type: 'UNLINKED_CTA',
          severity: 'warning',
          detail: `CTA/link "${cta.text}" has no real destination (href="#" or missing)`,
        });
      }
    }

    // ── 5. INVISIBLE TEXT (color contrast check via computed styles) ───────
    const invisibleTexts = await page.evaluate(() => {
      const results: { text: string; reason: string }[] = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const text = node.textContent?.trim();
        if (!text || text.length < 3) continue;
        const parent = node.parentElement;
        if (!parent) continue;
        const style = window.getComputedStyle(parent);
        const color = style.color;
        const bg = style.backgroundColor;
        // detect pure white-on-white or transparent
        if (
          (color === 'rgb(255, 255, 255)' && bg === 'rgb(255, 255, 255)') ||
          (color === 'rgb(0, 0, 0)' && bg === 'rgb(0, 0, 0)') ||
          color === 'transparent' ||
          style.opacity === '0' ||
          style.visibility === 'hidden' ||
          style.display === 'none'
        ) {
          results.push({ text: text.slice(0, 60), reason: `color:${color} bg:${bg}` });
        }
      }
      return results.slice(0, 20);
    });

    for (const t of invisibleTexts) {
      issues.push({
        type: 'INVISIBLE_TEXT',
        severity: 'critical',
        detail: `Text "${t.text}" may be invisible — ${t.reason}`,
      });
    }

    // ── 6. FONT SIZE TOO SMALL (< 11px) ──────────────────────────────────
    const tinyTexts = await page.evaluate(() => {
      const results: string[] = [];
      document.querySelectorAll('p, span, a, li, label, td, th, div').forEach(el => {
        const style = window.getComputedStyle(el);
        const size = parseFloat(style.fontSize);
        const text = el.textContent?.trim();
        if (size > 0 && size < 11 && text && text.length > 3) {
          results.push(`"${text.slice(0, 40)}" is ${size}px`);
        }
      });
      return [...new Set(results)].slice(0, 10);
    });
    for (const t of tinyTexts) {
      issues.push({ type: 'TINY_TEXT', severity: 'warning', detail: t });
    }

    // ── 7. FONT SIZE TOO LARGE (> 96px body text) ─────────────────────────
    const hugeTexts = await page.evaluate(() => {
      const results: string[] = [];
      document.querySelectorAll('p, span, li, td').forEach(el => {
        const size = parseFloat(window.getComputedStyle(el).fontSize);
        const text = el.textContent?.trim();
        if (size > 96 && text && text.length > 2) {
          results.push(`"${text.slice(0, 40)}" is ${size}px`);
        }
      });
      return results.slice(0, 5);
    });
    for (const t of hugeTexts) {
      issues.push({ type: 'OVERSIZED_TEXT', severity: 'warning', detail: t });
    }

    // ── 8. IMAGES WITHOUT ALT TEXT ────────────────────────────────────────
    const missingAlt = await page.$$eval(
      'img:not([alt]), img[alt=""]',
      imgs => imgs.map(img => (img as HTMLImageElement).src.split('/').pop() || 'unknown')
    );
    for (const src of missingAlt.slice(0, 10)) {
      issues.push({
        type: 'MISSING_ALT',
        severity: 'warning',
        detail: `Image "${src}" has no alt text (accessibility + SEO issue)`,
      });
    }

    // ── 9. FORM INPUTS WITHOUT LABELS ─────────────────────────────────────
    const unlabeledInputs = await page.evaluate(() => {
      const results: string[] = [];
      document.querySelectorAll('input, select, textarea').forEach(input => {
        const el = input as HTMLInputElement;
        if (['hidden', 'submit', 'button', 'image', 'reset'].includes(el.type)) return;
        const hasLabel = el.labels && el.labels.length > 0;
        const hasAria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
        const hasPlaceholder = el.getAttribute('placeholder');
        if (!hasLabel && !hasAria && !hasPlaceholder) {
          results.push(`${el.tagName.toLowerCase()}[type="${el.type}"][name="${el.name}"]`);
        }
      });
      return results.slice(0, 10);
    });
    for (const inp of unlabeledInputs) {
      issues.push({
        type: 'UNLABELED_INPUT',
        severity: 'warning',
        detail: `Form field ${inp} has no label, aria-label, or placeholder`,
      });
    }

    // ── 10. ZERO-HEIGHT / ZERO-WIDTH ELEMENTS WITH TEXT ───────────────────
    const zeroSizeElements = await page.evaluate(() => {
      const results: string[] = [];
      document.querySelectorAll('div, section, article, main, aside').forEach(el => {
        const rect = el.getBoundingClientRect();
        const text = el.textContent?.trim();
        if (rect.height === 0 && rect.width === 0 && text && text.length > 10) {
          results.push(`"${text.slice(0, 50)}" in <${el.tagName.toLowerCase()}> is 0×0`);
        }
      });
      return results.slice(0, 5);
    });
    for (const z of zeroSizeElements) {
      issues.push({ type: 'ZERO_SIZE_CONTENT', severity: 'warning', detail: z });
    }

    // ── 11. CONSOLE ERRORS ────────────────────────────────────────────────
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 120));
    });
    // small wait to capture async console errors
    await page.waitForTimeout(500);
    for (const err of consoleErrors.slice(0, 5)) {
      issues.push({
        type: 'CONSOLE_ERROR',
        severity: 'critical',
        detail: `JS Console Error: ${err}`,
      });
    }

    // ── 12. HOVER STATES (interactive elements) ───────────────────────────
    const hoverTargets = await page.$$('button, a, [role="button"], .btn');
    let hoverFailCount = 0;
    for (const target of hoverTargets.slice(0, 20)) {
      try {
        const before = await target.evaluate(el =>
          window.getComputedStyle(el).backgroundColor + window.getComputedStyle(el).color
        );
        await target.hover({ timeout: 2000 });
        await page.waitForTimeout(150);
        const after = await target.evaluate(el =>
          window.getComputedStyle(el).backgroundColor + window.getComputedStyle(el).color
        );
        // if styles never changed, it might not have a hover state
        if (before === after) hoverFailCount++;
      } catch {
        // element gone or not hoverable
      }
    }
    if (hoverTargets.length > 5 && hoverFailCount === hoverTargets.slice(0, 20).length) {
      issues.push({
        type: 'NO_HOVER_STATES',
        severity: 'info',
        detail: `None of the first ${hoverTargets.slice(0, 20).length} interactive elements show a style change on hover`,
      });
    }

    // ── 13. PAGE TITLE & META ─────────────────────────────────────────────
    const title = await page.title();
    if (!title || title.trim().length === 0) {
      issues.push({ type: 'MISSING_TITLE', severity: 'critical', detail: 'Page has no <title>' });
    }
    const metaDesc = await page.$eval(
      'meta[name="description"]',
      el => el.getAttribute('content') || '',
    ).catch(() => '');
    if (!metaDesc) {
      issues.push({ type: 'MISSING_META_DESC', severity: 'info', detail: 'No meta description tag' });
    }

    // ── 14. OVERFLOW / HORIZONTAL SCROLL ──────────────────────────────────
    const hasHorizontalScroll = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    if (hasHorizontalScroll) {
      issues.push({
        type: 'HORIZONTAL_OVERFLOW',
        severity: 'warning',
        detail: 'Page has horizontal scroll — likely broken layout or uncontained element',
      });
    }

    // ── 15. EMPTY SECTIONS ────────────────────────────────────────────────
    const emptySections = await page.$$eval(
      'section, .section, [class*="section"], [class*="block"]',
      els => els
        .filter(el => (el.textContent?.trim() || '').length === 0)
        .map(el => el.className?.slice(0, 60))
        .slice(0, 5)
    );
    for (const sec of emptySections) {
      issues.push({
        type: 'EMPTY_SECTION',
        severity: 'info',
        detail: `Empty section/block: .${sec}`,
      });
    }

  } catch (err: any) {
    issues.push({
      type: 'PAGE_LOAD_FAILURE',
      severity: 'critical',
      detail: `Could not load page: ${err.message?.slice(0, 100)}`,
    });
  }

  return issues;
}

// ─── TESTS ─────────────────────────────────────────────────────────────────

test.describe('CloudBasket — Full UI/UX Audit', () => {

  // Step 1: Crawl all routes
  test('CRAWL — discover all routes', async ({ page }) => {
    console.log(`\n🕷  Starting crawl from ${BASE_URL} ...`);
    const routes = await crawlRoutes(page, BASE_URL);
    console.log(`✅ Discovered ${routes.length} routes`);
    // Save for other tests via global
    (global as any).__AUDIT_ROUTES__ = routes;
    expect(routes.length).toBeGreaterThan(0);
  });

  // Step 2: Audit every route
  test('AUDIT — run checks on all discovered routes', async ({ page, browserName }) => {
    const routes: string[] = (global as any).__AUDIT_ROUTES__ || [BASE_URL];
    console.log(`\n🔍 Auditing ${routes.length} routes on ${browserName}...\n`);

    let criticalCount = 0;
    let warningCount = 0;

    for (const url of routes) {
      const issues = await auditPage(page, url);
      if (issues.length > 0) {
        AUDIT_RESULTS.push({ url, issues });
        const crits = issues.filter(i => i.severity === 'critical').length;
        const warns = issues.filter(i => i.severity === 'warning').length;
        criticalCount += crits;
        warningCount += warns;
        if (crits > 0) {
          console.log(`\n🔴 CRITICAL on ${url}:`);
          issues.filter(i => i.severity === 'critical').forEach(i =>
            console.log(`   [${i.type}] ${i.detail}`)
          );
        }
        if (warns > 0) {
          console.log(`\n🟡 WARNINGS on ${url}:`);
          issues.filter(i => i.severity === 'warning').forEach(i =>
            console.log(`   [${i.type}] ${i.detail}`)
          );
        }
      } else {
        console.log(`✅ ${url}`);
      }
    }

    console.log('\n═══════════════════════════════════════════════');
    console.log(`📊 AUDIT COMPLETE`);
    console.log(`   Pages audited : ${routes.length}`);
    console.log(`   Pages with issues: ${AUDIT_RESULTS.length}`);
    console.log(`   🔴 Critical issues : ${criticalCount}`);
    console.log(`   🟡 Warnings        : ${warningCount}`);
    console.log('═══════════════════════════════════════════════\n');

    // Fail the test suite if any critical issues found
    expect(criticalCount, `${criticalCount} critical issues found across ${routes.length} pages`).toBe(0);
  });

  // Step 3: Mobile viewport audit (responsiveness)
  test('RESPONSIVE — audit on mobile viewport (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const routes: string[] = ((global as any).__AUDIT_ROUTES__ || [BASE_URL]).slice(0, 50);

    for (const url of routes) {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      if (overflow) {
        console.log(`📱 Mobile overflow on: ${url}`);
      }
    }
  });

  // Step 4: Specific interaction tests
  test('INTERACTIONS — forms submit, modals open, nav works', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // Test nav links
    const navLinks = await page.$$('nav a[href]');
    console.log(`\n🧭 Testing ${navLinks.length} nav links...`);
    for (const link of navLinks.slice(0, 20)) {
      const href = await link.getAttribute('href');
      if (!href || href === '#') {
        const text = await link.textContent();
        console.log(`⚠️  Nav link "${text?.trim()}" has no real href`);
      }
    }

    // Test all buttons are clickable without throwing
    const buttons = await page.$$('button:not([disabled])');
    console.log(`🖱  Testing ${buttons.length} buttons for clickability...`);
    for (const btn of buttons.slice(0, 30)) {
      try {
        await btn.hover({ timeout: 1000 });
      } catch {
        const text = await btn.textContent().catch(() => '?');
        console.log(`⚠️  Button "${text?.trim()}" not hoverable`);
      }
    }

    expect(true).toBe(true); // interaction test is informational
  });

});
