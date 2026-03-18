import { IndiaProduct } from "./types"
import { HUL_PRODUCTS } from "./personal-care/hul"
import { DABUR_PRODUCTS } from "./personal-care/dabur"
import { ITC_PRODUCTS, GODREJ_CONSUMER_PRODUCTS } from "./personal-care/itc-godrej"
import { GODREJ_APPLIANCE_PRODUCTS } from "./home-appliances/godrej"
import { BAJAJ_PRODUCTS, HAVELLS_PRODUCTS } from "./home-appliances/bajaj-havells"
import { PHILIPS_PRODUCTS, PRESTIGE_PRODUCTS } from "./home-appliances/philips-prestige"
import { BOAT_PRODUCTS, NOISE_PRODUCTS } from "./electronics/boat-noise"
import { REALME_PRODUCTS, SAMSUNG_BUDGET_PRODUCTS } from "./electronics/realme-samsung"
import { PUMA_PRODUCTS, BIBA_PRODUCTS } from "./fashion/puma-biba"
import { ITC_FOOD_PRODUCTS, BRITANNIA_PRODUCTS } from "./food-grocery/itc-britannia"

export const INDIA_CATALOG: IndiaProduct[] = [
  ...HUL_PRODUCTS,
  ...DABUR_PRODUCTS,
  ...ITC_PRODUCTS,
  ...GODREJ_CONSUMER_PRODUCTS,
  ...GODREJ_APPLIANCE_PRODUCTS,
  ...BAJAJ_PRODUCTS,
  ...HAVELLS_PRODUCTS,
  ...PHILIPS_PRODUCTS,
  ...PRESTIGE_PRODUCTS,
  ...BOAT_PRODUCTS,
  ...NOISE_PRODUCTS,
  ...REALME_PRODUCTS,
  ...SAMSUNG_BUDGET_PRODUCTS,
  ...PUMA_PRODUCTS,
  ...BIBA_PRODUCTS,
  ...ITC_FOOD_PRODUCTS,
  ...BRITANNIA_PRODUCTS
]

export { HUL_PRODUCTS } from "./personal-care/hul"
export { DABUR_PRODUCTS } from "./personal-care/dabur"
export { ITC_PRODUCTS, GODREJ_CONSUMER_PRODUCTS } from "./personal-care/itc-godrej"
export { GODREJ_APPLIANCE_PRODUCTS } from "./home-appliances/godrej"
export { BAJAJ_PRODUCTS, HAVELLS_PRODUCTS } from "./home-appliances/bajaj-havells"
export { PHILIPS_PRODUCTS, PRESTIGE_PRODUCTS } from "./home-appliances/philips-prestige"
export { BOAT_PRODUCTS, NOISE_PRODUCTS } from "./electronics/boat-noise"
export { REALME_PRODUCTS, SAMSUNG_BUDGET_PRODUCTS } from "./electronics/realme-samsung"
export { PUMA_PRODUCTS, BIBA_PRODUCTS } from "./fashion/puma-biba"
export { ITC_FOOD_PRODUCTS, BRITANNIA_PRODUCTS } from "./food-grocery/itc-britannia"
