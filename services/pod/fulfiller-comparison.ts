// services/pod/fulfiller-comparison.ts
// Compare Printify vs Printful — recommend best fulfiller per product type.

export type FulfillerComparison = { fulfiller: 'printify'|'printful'; productType: string; baseCost: number; shippingDays: number; qualityScore: number; recommendation: string }

const COMPARISON_DATA: Record<string, FulfillerComparison[]> = {
  tshirt: [
    {fulfiller:'printify',productType:'tshirt',baseCost:450,shippingDays:7,qualityScore:85,recommendation:'Best value for bulk orders'},
    {fulfiller:'printful',productType:'tshirt',baseCost:600,shippingDays:10,qualityScore:92,recommendation:'Better quality DTG printing'},
  ],
  mug: [
    {fulfiller:'printify',productType:'mug',baseCost:280,shippingDays:7,qualityScore:88,recommendation:'Best mug quality on Printify'},
    {fulfiller:'printful',productType:'mug',baseCost:350,shippingDays:10,qualityScore:90,recommendation:'Consistent sublimation quality'},
  ],
}

export function recommendFulfiller(productType: string): 'printify'|'printful' {
  const data = COMPARISON_DATA[productType]
  if (!data || data.length === 0) return 'printify'
  const best = data.sort((a,b)=>(a.baseCost-b.baseCost))[0]
  return best.fulfiller
}

export function getComparison(productType: string): FulfillerComparison[] {
  return COMPARISON_DATA[productType] || []
}