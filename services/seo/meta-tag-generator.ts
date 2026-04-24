// services/seo/meta-tag-generator.ts
import { isConfigured } from "@/lib/env";

/**
 * Dynamic Meta Tag & OpenGraph Generator for CloudBasket.
 * Ensures consistent SEO presence across products, categories, and blog posts.
 */

export interface MetaTags {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  canonical: string;
  twitterCard: 'summary' | 'summary_large_image';
}

const DEFAULT_DESCRIPTION = "CloudBasket - India's smartest price comparison platform. Save more on electronics, fashion, and home essentials.";
const DEFAULT_IMAGE = "/brand/og-default.png";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cloudbasket.co";

/**
 * Generates SEO meta tags for a specific product page.
 */
export function generateProductMeta(product: {
  title: string;
  description?: string;
  price: number;
  category: string;
  brand: string;
  id: string;
  image?: string;
}): MetaTags {
  const cleanTitle = `${product.title} | Price comparison @ CloudBasket`;
  const cleanDesc = product.description 
    ? product.description.substring(0, 160) 
    : `Compare prices for ${product.title} by ${product.brand}. Best deals starting from ₹${product.price} only on CloudBasket.`;

  return {
    title: cleanTitle,
    description: cleanDesc,
    keywords: `${product.title}, ${product.brand}, ${product.category}, price comparison India, best price, buy ${product.title}`,
    ogTitle: product.title,
    ogDescription: cleanDesc,
    ogImage: product.image || DEFAULT_IMAGE,
    ogUrl: `${BASE_URL}/product/${product.id}`,
    canonical: `${BASE_URL}/product/${product.id}`,
    twitterCard: 'summary_large_image'
  };
}

/**
 * Generates SEO meta tags for a category landing page.
 */
export function generateCategoryMeta(category: {
  name: string;
  slug: string;
  itemCount: number;
}): MetaTags {
  const title = `Best ${category.name} Deals & Price Comparison | CloudBasket`;
  const description = `Discover and compare ${category.itemCount}+ ${category.name} products. Real-time price tracking and best offers from Amazon, Flipkart, and more.`;

  return {
    title,
    description,
    keywords: `${category.name}, buy ${category.name} online, ${category.name} price list, top ${category.name} brands`,
    ogTitle: title,
    ogDescription: description,
    ogImage: `/brand/categories/${category.slug}.png`,
    ogUrl: `${BASE_URL}/category/${category.slug}`,
    canonical: `${BASE_URL}/category/${category.slug}`,
    twitterCard: 'summary'
  };
}

/**
 * Generates SEO meta tags for a blog post.
 */
export function generateBlogMeta(post: {
  title: string;
  excerpt: string;
  slug: string;
  author: string;
  tags: string[];
  image?: string;
}): MetaTags {
  return {
    title: `${post.title} | CloudBasket Blog`,
    description: post.excerpt,
    keywords: post.tags.join(", ") + ", CloudBasket blog, shopping tips, price trends",
    ogTitle: post.title,
    ogDescription: post.excerpt,
    ogImage: post.image || "/brand/blog-default.png",
    ogUrl: `${BASE_URL}/blog/${post.slug}`,
    canonical: `${BASE_URL}/blog/${post.slug}`,
    twitterCard: 'summary_large_image'
  };
}

/**
 * Generates optimal keyword string from a list of strings, removing duplicates.
 */
export function getOptimalTags(keywords: string[]): string {
  const unique = Array.from(new Set(keywords.map(k => k.trim().toLowerCase())));
  return unique.join(", ");
}

/**
 * Generates Schema.org JSON-LD for a Product to enhance Google search results.
 */
export function generateProductSchema(product: any) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": [product.image],
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "AggregateOffer",
      "url": `${BASE_URL}/product/${product.id}`,
      "priceCurrency": "INR",
      "lowPrice": product.price,
      "offerCount": product.seller_count || 1
    }
  };
}
