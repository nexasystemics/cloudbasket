// lib/india-catalog-2/index.ts
// India Catalog 2 — Tech Accessories, Fitness, Baby Products, Books, Groceries + Brand Catalog
import { TECH_ACCESSORIES } from './tech-accessories'
import { SMARTPHONES, LAPTOPS, HEADPHONES, SMARTWATCHES, HOME_APPLIANCES } from './india-brands'
import type { IndiaProduct } from '@/lib/india-catalog/types'

export const INDIA_CATALOG_2: IndiaProduct[] = [
  ...TECH_ACCESSORIES,
  ...SMARTPHONES,
  ...LAPTOPS,
  ...HEADPHONES,
  ...SMARTWATCHES,
  ...HOME_APPLIANCES,
]

export type { IndiaProduct }
