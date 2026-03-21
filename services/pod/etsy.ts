// services/pod/etsy.ts
// Etsy Open API v3 integration — list POD products on Etsy marketplace.

import { env, isConfigured } from '@/lib/env'
import crypto from 'crypto'

export type EtsyTokens = { access_token:string; refresh_token:string; expires_in:number }
export type EtsyShop = { shop_id:number; shop_name:string; title:string; url:string }
export type EtsyListingInput = { quantity:number; title:string; description:string; price:number; who_made:string; when_made:string; taxonomy_id:number; tags:string[]; state:'draft'|'active' }
export type EtsyListing = { listing_id:number; title:string; state:string; url:string; price:{ amount:number; currency_code:string } }

const BASE = 'https://openapi.etsy.com/v3'

export class EtsyAPI {
  private isReady() { return isConfigured('ETSY_API_KEY') }

  getAuthUrl(state: string, codeChallenge: string): string {
    const params = new URLSearchParams({response_type:'code',redirect_uri:env.ETSY_REDIRECT_URI||'',scope:'listings_w listings_r shops_r',client_id:env.ETSY_API_KEY,state,code_challenge:codeChallenge,code_challenge_method:'S256'})
    return `https://www.etsy.com/oauth/connect?${params}`
  }

  async exchangeCode(code: string, codeVerifier: string): Promise<EtsyTokens|null> {
    if (!this.isReady()) return null
    try {
      const r = await fetch('https://api.etsy.com/v3/public/oauth/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'authorization_code',client_id:env.ETSY_API_KEY,redirect_uri:env.ETSY_REDIRECT_URI||'',code,code_verifier:codeVerifier}).toString()})
      return r.ok?await r.json():null
    } catch { return null }
  }

  async getShop(shopId: string, token: string): Promise<EtsyShop|null> {
    try { const r = await fetch(`${BASE}/application/shops/${shopId}`,{headers:{'x-api-key':env.ETSY_API_KEY,Authorization:`Bearer ${token}`}}); return r.ok?await r.json():null } catch { return null }
  }

  async createListing(shopId: string, listing: EtsyListingInput, token: string): Promise<EtsyListing|null> {
    if (!this.isReady()) return null
    try {
      const r = await fetch(`${BASE}/application/shops/${shopId}/listings`,{method:'POST',headers:{'x-api-key':env.ETSY_API_KEY,Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(listing)})
      return r.ok?await r.json():null
    } catch { return null }
  }

  POD_TAXONOMY_MAP: Record<string,number> = {'tshirt':2069,'mug':68887645,'phone-case':68887513,'poster':2078,'hoodie':2076,'tote-bag':2073}
}

export const etsyAPI = new EtsyAPI()