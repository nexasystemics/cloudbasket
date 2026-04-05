// services/pod/order-manager.ts
// POD order routing and fulfilment management.

import { printifyAPI } from './printify'
import { printfulAPI } from './printful'
import { recommendFulfiller } from './fulfiller-comparison'
import { hasSupabase, env } from '@/lib/env'

export type PODOrder = { id:string; items:{productId:string;productType:string;size?:string;colour?:string;quantity:number;unitPrice:number}[]; shippingAddress:{name:string;address:string;city:string;state:string;pincode:string;phone:string}; total:number }
export type RoutingDecision = { fulfiller:'printify'|'printful'; reason:string; estimatedShipDate:Date; shippingCost:number; totalCost:number }
export type OrderTrackingInfo = { status:string; trackingNumber?:string; carrier?:string; estimatedDelivery?:Date; events:{status:string;location:string;timestamp:Date}[] }

export class PODOrderManager {
  routeOrder(order: PODOrder): RoutingDecision {
    const mainProduct = order.items[0]
    const fulfiller = recommendFulfiller(mainProduct?.productType||'tshirt')
    return {
      fulfiller, reason:`${fulfiller} recommended for ${mainProduct?.productType}`,
      estimatedShipDate: new Date(Date.now()+5*86400000),
      shippingCost: 99, totalCost: order.total + 99,
    }
  }

  async trackOrder(orderId: string): Promise<OrderTrackingInfo> {
    if (hasSupabase()) {
      try {
        const {createClient} = await import('@supabase/supabase-js')
        const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        const {data} = await sb.from('pod_orders').select('status,tracking_number,carrier,shipped_at').eq('id',orderId).single()
        if (data) return {status:data.status,trackingNumber:data.tracking_number,carrier:data.carrier,estimatedDelivery:data.shipped_at?new Date(new Date(data.shipped_at).getTime()+7*86400000):undefined,events:[]}
      } catch { /* no-op */ }
    }
    return {status:'processing',events:[{status:'Order Received',location:'CloudBasket',timestamp:new Date()}]}
  }
}

export const podOrderManager = new PODOrderManager()

