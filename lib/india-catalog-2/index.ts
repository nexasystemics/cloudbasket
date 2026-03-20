// lib/india-catalog-2/index.ts
// India Catalog 2 — Tech Accessories, Fitness, Baby Products, Books, Groceries
// Template: 15 products. Expand to 1000 using the patterns defined in C29 prompt.

import { TECH_ACCESSORIES } from './tech-accessories'
import type { IndiaProduct } from '@/lib/india-catalog/types'

export const INDIA_CATALOG_2: IndiaProduct[] = [
  ...TECH_ACCESSORIES,
]

export type { IndiaProduct }