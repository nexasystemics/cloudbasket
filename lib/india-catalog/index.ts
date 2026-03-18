// Estimated: ~30 lines
import { IndiaProduct } from "./types"
import { HUL_PRODUCTS } from "./personal-care/hul"
import { DABUR_PRODUCTS } from "./personal-care/dabur"
import { ITC_PRODUCTS, GODREJ_CONSUMER_PRODUCTS } from "./personal-care/itc-godrej"
import { GODREJ_APPLIANCE_PRODUCTS } from "./home-appliances/godrej"
import { BOAT_PRODUCTS, NOISE_PRODUCTS } from "./electronics/boat-noise"

export const INDIA_CATALOG: IndiaProduct[] = [
  ...HUL_PRODUCTS,
  ...DABUR_PRODUCTS,
  ...ITC_PRODUCTS,
  ...GODREJ_CONSUMER_PRODUCTS,
  ...GODREJ_APPLIANCE_PRODUCTS,
  ...BOAT_PRODUCTS,
  ...NOISE_PRODUCTS
]

export { HUL_PRODUCTS } from "./personal-care/hul"
export { DABUR_PRODUCTS } from "./personal-care/dabur"
export { ITC_PRODUCTS, GODREJ_CONSUMER_PRODUCTS } from "./personal-care/itc-godrej"
export { GODREJ_APPLIANCE_PRODUCTS } from "./home-appliances/godrej"
export { BOAT_PRODUCTS, NOISE_PRODUCTS } from "./electronics/boat-noise"
