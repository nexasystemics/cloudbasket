// services/pod/shopify.ts
// Shopify Storefront + Admin API for POD product sync.

import { env, isConfigured } from '@/lib/env'

export type ShopifyProduct = { id:string; title:string; handle:string; description:string; variants:{edges:{node:{id:string;price:{amount:string}}}[]}[]; images:{edges:{node:{url:string}}[]}[] }
export type ShopifyCart = { id:string; checkoutUrl:string; lines:{edges:{node:{quantity:number}}[]}[] }

const STOREFRONT_BASE = () => `https://${env.SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`
const ADMIN_BASE = () => `https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01`

export class ShopifyStorefrontAPI {
  private isReady() { return isConfigured('SHOPIFY_STOREFRONT_TOKEN') && isConfigured('SHOPIFY_STORE_DOMAIN') }

  async getProducts(first=20): Promise<ShopifyProduct[]> {
    if (!this.isReady()) return []
    try {
      const query = `{products(first:${first}){edges{node{id title handle description variants(first:20){edges{node{id price{amount currencyCode}}}} images(first:5){edges{node{url altText}}}}}}}`
      const r = await fetch(STOREFRONT_BASE(),{method:'POST',headers:{'X-Shopify-Storefront-Access-Token':env.SHOPIFY_STOREFRONT_TOKEN,'Content-Type':'application/json'},body:JSON.stringify({query})})
      return r.ok?((await r.json()).data?.products?.edges?.map((e:any)=>e.node)||[]):[]
    } catch { return [] }
  }

  async createCart(items: {variantId:string;quantity:number}[]): Promise<ShopifyCart|null> {
    if (!this.isReady()) return null
    try {
      const mutation = `mutation{cartCreate(input:{lines:[${items.map(i=>`{merchandiseId:"${i.variantId}",quantity:${i.quantity}}`).join(',')}]}){cart{id checkoutUrl}}}`
      const r = await fetch(STOREFRONT_BASE(),{method:'POST',headers:{'X-Shopify-Storefront-Access-Token':env.SHOPIFY_STOREFRONT_TOKEN,'Content-Type':'application/json'},body:JSON.stringify({query:mutation})})
      return r.ok?((await r.json()).data?.cartCreate?.cart||null):null
    } catch { return null }
  }

  async getCheckoutUrl(cartId: string): Promise<string|null> {
    const cart = await this.getCart(cartId)
    return cart?.checkoutUrl||null
  }

  private async getCart(cartId: string): Promise<ShopifyCart|null> {
    try {
      const query = `{cart(id:"${cartId}"){id checkoutUrl}}`
      const r = await fetch(STOREFRONT_BASE(),{method:'POST',headers:{'X-Shopify-Storefront-Access-Token':env.SHOPIFY_STOREFRONT_TOKEN,'Content-Type':'application/json'},body:JSON.stringify({query})})
      return r.ok?((await r.json()).data?.cart||null):null
    } catch { return null }
  }
}

export class ShopifyAdminAPI {
  private isReady() { return isConfigured('SHOPIFY_ADMIN_TOKEN') }
  private headers() { return {'X-Shopify-Access-Token':env.SHOPIFY_ADMIN_TOKEN,'Content-Type':'application/json'} }

  async createProduct(product: {title:string;body_html:string;vendor:string;product_type:string;tags:string;variants:{price:string;inventory_quantity:number}[];images:{src:string}[]}): Promise<any> {
    if (!this.isReady()) return null
    try { const r = await fetch(`${ADMIN_BASE()}/products.json`,{method:'POST',headers:this.headers(),body:JSON.stringify({product})}); return r.ok?await r.json():null } catch { return null }
  }
}

export const shopifyStorefront = new ShopifyStorefrontAPI()
export const shopifyAdmin = new ShopifyAdminAPI()