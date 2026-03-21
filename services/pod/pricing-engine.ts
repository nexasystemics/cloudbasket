// services/pod/pricing-engine.ts
// POD pricing engine — margin calculation and competitive analysis.

export type PriceRecommendation = { baseCost:number; recommendedPrice:number; margin:number; marginAmount:number; competitiveAnalysis:{amazonMerchAvgPrice:number;redbubbleAvgPrice:number;etsyAvgPrice:number;ourPricePosition:'below'|'at'|'above'} }

const TARGET_MARGINS: Record<string,number> = { tshirt:0.45, mug:0.55, 'phone-case':0.60, poster:0.65, hoodie:0.40, 'tote-bag':0.50 }
const BASE_COSTS: Record<string,[number,number]> = { tshirt:[450,650], mug:[280,350], 'phone-case':[180,250], poster:[120,180], hoodie:[850,1200], 'tote-bag':[250,350] }
const COMPETITOR_PRICES: Record<string,{amazon:number;redbubble:number;etsy:number}> = {
  tshirt:{amazon:799,redbubble:999,etsy:1299},
  mug:{amazon:499,redbubble:699,etsy:899},
  'phone-case':{amazon:399,redbubble:599,etsy:799},
  poster:{amazon:299,redbubble:499,etsy:699},
  hoodie:{amazon:1499,redbubble:1999,etsy:2499},
  'tote-bag':{amazon:599,redbubble:799,etsy:999},
}

export class PODPricingEngine {
  calculateRecommendedPrice(productType: string, baseCost?: number): PriceRecommendation {
    const costs = BASE_COSTS[productType]||[500,700]
    const cost = baseCost||(costs[0]+costs[1])/2
    const margin = TARGET_MARGINS[productType]||0.45
    const recommended = Math.round(cost/(1-margin)/10)*10
    const comp = COMPETITOR_PRICES[productType]||{amazon:999,redbubble:1299,etsy:1599}
    const avgComp = (comp.amazon+comp.redbubble+comp.etsy)/3
    return {
      baseCost:cost, recommendedPrice:recommended, margin, marginAmount:recommended-cost,
      competitiveAnalysis:{amazonMerchAvgPrice:comp.amazon,redbubbleAvgPrice:comp.redbubble,etsyAvgPrice:comp.etsy,ourPricePosition:recommended<avgComp*0.95?'below':recommended>avgComp*1.05?'above':'at'}
    }
  }

  addGST(basePrice: number, productType: string): number {
    const rates: Record<string,number> = {tshirt:0.05,mug:0.12,'phone-case':0.18,poster:0.12,hoodie:0.12,'tote-bag':0.05}
    return Math.round(basePrice*(1+(rates[productType]||0.12)))
  }
}

export const podPricingEngine = new PODPricingEngine()