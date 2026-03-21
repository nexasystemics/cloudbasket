// services/pod/printify.ts
// Printify API v1 integration — POD product creation and fulfilment.
// Stubs return null/[] when PRINTIFY_API_KEY not configured.

import { env, isConfigured } from '@/lib/env'

export type PrintifyShop = { id: number; title: string; sales_channel: string }
export type PrintifyBlueprint = { id: number; title: string; description: string; brand: string; model: string; images: string[] }
export type PrintifyProvider = { id: number; title: string; location: { country: string; region: string } }
export type PrintifyImage = { id: string; file_name: string; preview_url: string; upload_time: string }
export type PrintifyVariant = { id: number; title: string; price: number; is_enabled: boolean }
export type PrintifyPrintArea = { variant_ids: number[]; placeholders: { position: string; images: { id:string; x:number; y:number; scale:number; angle:number }[] }[] }
export type PrintifyProductInput = { title: string; description: string; blueprint_id: number; print_provider_id: number; variants: PrintifyVariant[]; print_areas: PrintifyPrintArea[] }
export type PrintifyProduct = { id: string; title: string; description: string; shop_id: number; images: string[]; variants: PrintifyVariant[]; published: boolean }
export type PrintifyOrder = { id: string; status: string; line_items: any[] }

const BASE = 'https://api.printify.com/v1'

function headers() { return { Authorization: `Bearer ${env.PRINTIFY_API_KEY}`, 'Content-Type': 'application/json' } }

export class PrintifyAPI {
  private isReady() { return isConfigured('PRINTIFY_API_KEY') }

  async getShops(): Promise<PrintifyShop[]> {
    if (!this.isReady()) return []
    try { const r = await fetch(`${BASE}/shops.json`,{headers:headers()}); return r.ok?(await r.json()):[] } catch { return [] }
  }

  async getBlueprints(): Promise<PrintifyBlueprint[]> {
    if (!this.isReady()) return []
    try {
      const r = await fetch(`${BASE}/catalog/blueprints.json`,{headers:headers()})
      if (!r.ok) return []
      const data = await r.json()
      if (isConfigured('NEXT_PUBLIC_SUPABASE_URL') && isConfigured('SUPABASE_SERVICE_ROLE_KEY')) {
        try {
          const {createClient} = await import('@supabase/supabase-js')
          const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
          for (const bp of (data||[]).slice(0,100)) {
            await sb.from('printify_blueprints').upsert({id:bp.id,title:bp.title,description:bp.description,brand:bp.brand,model:bp.model,synced_at:new Date().toISOString()})
          }
        } catch { /* no-op */ }
      }
      return data
    } catch { return [] }
  }

  async getBlueprintProviders(blueprintId: number): Promise<PrintifyProvider[]> {
    if (!this.isReady()) return []
    try { const r = await fetch(`${BASE}/catalog/blueprints/${blueprintId}/print_providers.json`,{headers:headers()}); return r.ok?(await r.json()):[] } catch { return [] }
  }

  async uploadImage(base64Data: string, fileName: string): Promise<PrintifyImage|null> {
    if (!this.isReady()) return null
    try {
      const r = await fetch(`${BASE}/uploads/images.json`,{method:'POST',headers:headers(),body:JSON.stringify({file_name:fileName,contents:base64Data})})
      return r.ok?await r.json():null
    } catch { return null }
  }

  async createProduct(shopId: string, product: PrintifyProductInput): Promise<PrintifyProduct|null> {
    if (!this.isReady()) return null
    try {
      const r = await fetch(`${BASE}/shops/${shopId}/products.json`,{method:'POST',headers:headers(),body:JSON.stringify(product)})
      const data = r.ok?await r.json():null
      if (data && isConfigured('NEXT_PUBLIC_SUPABASE_URL')) {
        try {
          const {createClient} = await import('@supabase/supabase-js')
          const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
          await sb.from('pod_designs').upsert({id:`PRNT-${data.id}`,product_name:data.title,source:'printify',external_id:data.id,status:'draft',created_at:new Date().toISOString()})
        } catch { /* no-op */ }
      }
      return data
    } catch { return null }
  }

  async publishProduct(shopId: string, productId: string): Promise<void> {
    if (!this.isReady()) return
    try { await fetch(`${BASE}/shops/${shopId}/products/${productId}/publish.json`,{method:'POST',headers:headers(),body:JSON.stringify({title:true,description:true,images:true,variants:true})}) } catch { /* no-op */ }
  }

  async getProducts(shopId: string): Promise<PrintifyProduct[]> {
    if (!this.isReady()) return []
    try { const r = await fetch(`${BASE}/shops/${shopId}/products.json`,{headers:headers()}); return r.ok?((await r.json()).data||[]):[] } catch { return [] }
  }

  async syncOrderToPrintify(order: any, shopId: string): Promise<PrintifyOrder|null> {
    if (!this.isReady()) return null
    try {
      const body = { line_items: order.items?.map((i:any)=>({print_provider_id:99,blueprint_id:99,variant_id:i.variantId||99,quantity:i.quantity||1})), shipping_method: 1, address_to: order.shippingAddress }
      const r = await fetch(`${BASE}/shops/${shopId}/orders.json`,{method:'POST',headers:headers(),body:JSON.stringify(body)})
      return r.ok?await r.json():null
    } catch { return null }
  }
}

export const printifyAPI = new PrintifyAPI()