// services/pod/printful.ts
// Printful API v2 — secondary POD fulfiller.

import { env, isConfigured } from '@/lib/env'

export type PrintfulProduct = { id:number; title:string; type:string; brand:string; model:string; image:string }
export type PrintfulVariant = { id:number; product_id:number; name:string; size:string; color:string; price:number }
export type MockupTask = { task_key:string; status:'pending'|'completed'|'failed' }
export type MockupResult = { status:string; mockups:{placement:string;mockup_url:string;extra:any[]}[] }
export type ShippingRate = { id:string; name:string; rate:string; currency:string; minDeliveryDays:number; maxDeliveryDays:number }
export type PrintfulOrder = { id:number; status:string; shipping:string; created:string; updated:string }

const BASE = 'https://api.printful.com'
function headers() { return {Authorization:`Bearer ${env.PRINTFUL_API_KEY}`,'Content-Type':'application/json'} }

export class PrintfulAPI {
  private isReady() { return isConfigured('PRINTFUL_API_KEY') }

  async getProducts(): Promise<PrintfulProduct[]> {
    if (!this.isReady()) return []
    try { const r = await fetch(`${BASE}/v2/catalog-products`,{headers:headers()}); return r.ok?((await r.json()).data||[]):[] } catch { return [] }
  }

  async getProductVariants(productId: number): Promise<PrintfulVariant[]> {
    if (!this.isReady()) return []
    try { const r = await fetch(`${BASE}/v2/catalog-products/${productId}/catalog-variants`,{headers:headers()}); return r.ok?((await r.json()).data||[]):[] } catch { return [] }
  }

  async createMockup(productId: number, variantIds: number[], imageUrl: string): Promise<MockupTask|null> {
    if (!this.isReady()) return null
    try {
      const r = await fetch(`${BASE}/mockup-generator/create-task/${productId}`,{method:'POST',headers:headers(),body:JSON.stringify({variant_ids:variantIds,format:'jpg',files:[{placement:'default',image_url:imageUrl,position:{area_width:1800,area_height:2400,width:1800,height:2400,top:0,left:0}}]})})
      return r.ok?await r.json():null
    } catch { return null }
  }

  async getMockupResult(taskKey: string): Promise<MockupResult|null> {
    if (!this.isReady()) return null
    for (let i=0;i<30;i++) {
      try {
        const r = await fetch(`${BASE}/mockup-generator/task?task_key=${taskKey}`,{headers:headers()})
        if (!r.ok) break
        const data = await r.json()
        if (data.status === 'completed') return data
        if (data.status === 'failed') break
        await new Promise(res=>setTimeout(res,2000))
      } catch { break }
    }
    return null
  }

  async getShippingRates(recipient: {address1:string;city:string;state_code:string;country_code:string;zip:string}, items: {product_id:number;quantity:number}[]): Promise<ShippingRate[]> {
    if (!this.isReady()) return []
    try {
      const r = await fetch(`${BASE}/shipping/rates`,{method:'POST',headers:headers(),body:JSON.stringify({recipient,items})})
      return r.ok?((await r.json()).result||[]):[]
    } catch { return [] }
  }

  async createOrder(order: any): Promise<PrintfulOrder|null> {
    if (!this.isReady()) return null
    try { const r = await fetch(`${BASE}/v2/orders`,{method:'POST',headers:headers(),body:JSON.stringify(order)}); return r.ok?await r.json():null } catch { return null }
  }

  async getOrderStatus(orderId: number): Promise<string> {
    if (!this.isReady()) return 'unknown'
    try { const r = await fetch(`${BASE}/v2/orders/${orderId}`,{headers:headers()}); return r.ok?((await r.json()).status||'unknown'):'unknown' } catch { return 'unknown' }
  }
}

export const printfulAPI = new PrintfulAPI()