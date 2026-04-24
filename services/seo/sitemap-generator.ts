
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isConfigured = (key: string): boolean => Boolean(process.env[key]);

export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: number;
}

interface ProductRow {
  slug: string;
  updated_at: string;
}

interface GenericRow {
  slug: string;
  updated_at: string;
}

function getClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );
}

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://cloudbasket.co";
}

function isFastBuild(): boolean {
  return Boolean(process.env.DEV_FAST_BUILD);
}

function safeDate(value: string): string {
  try {
    return new Date(value).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

async function fetchPaginated<T>(
  table: string,
  batchSize: number,
  maxRows: number
): Promise<T[]> {
  const results: T[] = [];

  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return [];

    const supabase = getClient();

    let from = 0;

    while (results.length < maxRows) {
      const to = from + batchSize - 1;

      const { data, error } = await supabase
        .from(table)
        .select("*")
        .range(from, to);

      if (error) throw error;

      if (!data || data.length === 0) break;

      results.push(...(data as T[]));

      if (data.length < batchSize) break;

      from += batchSize;
    }

    return results.slice(0, maxRows);
  } catch (err) {
    console.warn("fetchPaginated failed", err);
    return [];
  }
}

/**
 * Generate product sitemap entries
 */
export async function generateProductSitemap(limit: number): Promise<SitemapEntry[]> {
  try {
    if (isFastBuild()) return [];
    if (!limit || limit <= 0) return [];

    const rows = await fetchPaginated<ProductRow>("products", 1000, limit);

    const base = getBaseUrl();

    const entries: SitemapEntry[] = [];

    for (const row of rows) {
      if (!row.slug) continue;

      entries.push({
        loc: `${base}/product/${row.slug}`,
        lastmod: safeDate(row.updated_at),
        changefreq: "daily",
        priority: 0.8,
      });
    }

    return entries;
  } catch (err) {
    console.warn("generateProductSitemap failed", err);
    return [];
  }
}

/**
 * Generate blog sitemap entries
 */
export async function generateBlogSitemap(): Promise<SitemapEntry[]> {
  try {
    if (isFastBuild()) return [];

    const rows = await fetchPaginated<GenericRow>("blogs", 500, 5000);

    const base = getBaseUrl();

    return rows.map((row) => ({
      loc: `${base}/blog/${row.slug}`,
      lastmod: safeDate(row.updated_at),
      changefreq: "weekly",
      priority: 0.6,
    }));
  } catch (err) {
    console.warn("generateBlogSitemap failed", err);
    return [];
  }
}

/**
 * Generate brand sitemap entries
 */
export async function generateBrandSitemap(): Promise<SitemapEntry[]> {
  try {
    if (isFastBuild()) return [];

    const rows = await fetchPaginated<GenericRow>("brands", 500, 5000);

    const base = getBaseUrl();

    const result: SitemapEntry[] = [];

    for (const row of rows) {
      if (!row.slug) continue;

      result.push({
        loc: `${base}/brand/${row.slug}`,
        lastmod: safeDate(row.updated_at),
        changefreq: "weekly",
        priority: 0.7,
      });
    }

    return result;
  } catch (err) {
    console.warn("generateBrandSitemap failed", err);
    return [];
  }
}

/**
 * Generate category sitemap entries
 */
export async function generateCategorySitemap(): Promise<SitemapEntry[]> {
  try {
    if (isFastBuild()) return [];

    const rows = await fetchPaginated<GenericRow>("categories", 500, 5000);

    const base = getBaseUrl();

    return rows.map((row) => ({
      loc: `${base}/category/${row.slug}`,
      lastmod: safeDate(row.updated_at),
      changefreq: "weekly",
      priority: 0.7,
    }));
  } catch (err) {
    console.warn("generateCategorySitemap failed", err);
    return [];
  }
}

/**
 * Generate full sitemap
 */
export async function generateFullSitemap(): Promise<SitemapEntry[]> {
  try {
    if (isFastBuild()) return [];

    const [products, blogs, brands, categories] = await Promise.all([
      generateProductSitemap(20000),
      generateBlogSitemap(),
      generateBrandSitemap(),
      generateCategorySitemap(),
    ]);

    return [...products, ...blogs, ...brands, ...categories];
  } catch (err) {
    console.warn("generateFullSitemap failed", err);
    return [];
  }
}

/**
 * Get sitemap stats
 */
export async function getSitemapStats(): Promise<{
  total: number;
  products: number;
  blogs: number;
  brands: number;
  categories: number;
}> {
  try {
    if (isFastBuild()) {
      return { total: 0, products: 0, blogs: 0, brands: 0, categories: 0 };
    }

    const [p, b, br, c] = await Promise.all([
      generateProductSitemap(10000),
      generateBlogSitemap(),
      generateBrandSitemap(),
      generateCategorySitemap(),
    ]);

    return {
      total: p.length + b.length + br.length + c.length,
      products: p.length,
      blogs: b.length,
      brands: br.length,
      categories: c.length,
    };
  } catch (err) {
    console.warn("getSitemapStats failed", err);
    return { total: 0, products: 0, blogs: 0, brands: 0, categories: 0 };
  }
}
