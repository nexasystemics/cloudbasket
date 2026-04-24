// lib/india-catalog-2/index.ts
// India Catalog 2 — 200 products across Tech, Fashion, Beauty, Home, Cameras, Tablets, TVs, Gaming, Sports, Baby
import { TECH_ACCESSORIES } from './tech-accessories'
import { SMARTPHONES, LAPTOPS, HEADPHONES, SMARTWATCHES, HOME_APPLIANCES } from './india-brands'
import { LEVIS, PETER_ENGLAND, VAN_HEUSEN, FABINDIA, HM, MANYAVAR, BATA, PUMA, ADIDAS_FASHION, WOODLAND, LAKME, MAMAEARTH, WOW, PLUM } from './fashion-personal'
import { PIGEON, PRESTIGE, MILTON, BOROSIL, HAWKINS, CELLO, CANON, SONY_CAMERAS, SAMSUNG_TABLETS, LENOVO_TABLETS, SAMSUNG_TVS, LG_TVS, PLAYSTATION, NIVIA, ADIDAS_SPORTS, PAMPERS } from './home-gadgets'
import type { IndiaProduct } from '@/lib/india-catalog/types'

export const INDIA_CATALOG_2: IndiaProduct[] = [
  // Tech accessories + brand flagship (65)
  ...TECH_ACCESSORIES,
  ...SMARTPHONES,
  ...LAPTOPS,
  ...HEADPHONES,
  ...SMARTWATCHES,
  ...HOME_APPLIANCES,
  // Fashion & footwear (42)
  ...LEVIS,
  ...PETER_ENGLAND,
  ...VAN_HEUSEN,
  ...FABINDIA,
  ...HM,
  ...MANYAVAR,
  ...BATA,
  ...PUMA,
  ...ADIDAS_FASHION,
  ...WOODLAND,
  // Beauty & personal care (19)
  ...LAKME,
  ...MAMAEARTH,
  ...WOW,
  ...PLUM,
  // Home & kitchen (30)
  ...PIGEON,
  ...PRESTIGE,
  ...MILTON,
  ...BOROSIL,
  ...HAWKINS,
  ...CELLO,
  // Cameras (8)
  ...CANON,
  ...SONY_CAMERAS,
  // Tablets (7)
  ...SAMSUNG_TABLETS,
  ...LENOVO_TABLETS,
  // Smart TVs (7)
  ...SAMSUNG_TVS,
  ...LG_TVS,
  // Gaming (3)
  ...PLAYSTATION,
  // Sports (7)
  ...NIVIA,
  ...ADIDAS_SPORTS,
  // Baby (3)
  ...PAMPERS,
]

export type { IndiaProduct }
