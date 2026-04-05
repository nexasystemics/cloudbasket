// services/logistics/delivery-estimator.ts
import { createClient } from "@supabase/supabase-js";
import { isConfigured } from "@/lib/env";

/**
 * Delivery Estimation Service.
 * Calculates estimated delivery dates and shipping costs based on pincode and logistics partners.
 */

export interface ShippingRate {
  partner: string;
  cost: number;
  min_days: number;
  max_days: number;
  serviceable: boolean;
}

export interface DeliveryEstimate {
  pincode: string;
  estimated_date: string;
  min_days: number;
  max_days: number;
  rates: ShippingRate[];
  is_serviceable: boolean;
}

function getClient(): any {
  if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL") || !isConfigured("SUPABASE_SERVICE_ROLE_KEY")) {
    return null;
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Checks if a specific pincode is serviceable by any logistics partner.
 */
export async function checkPincodeServiceability(pincode: string): Promise<boolean> {
  const sb = getClient();
  if (!sb) return true; // Optimistic fallback if DB down

  try {
    const { data, error } = await sb
      .from("serviceable_pincodes")
      .select("pincode")
      .eq("pincode", pincode)
      .single();

    if (error) return false;
    return !!data;
  } catch (err) {
    console.warn("[DeliveryEstimator] checkPincodeServiceability failed", err);
    return true;
  }
}

/**
 * Calculates shipping costs based on weight and destination distance.
 */
export async function calculateShippingCost(
  weight_kg: number,
  pincode: string,
  origin_pincode: string = "110001"
): Promise<ShippingRate[]> {
  const rates: ShippingRate[] = [
    { partner: "BlueDart", cost: 0, min_days: 1, max_days: 3, serviceable: true },
    { partner: "Delhivery", cost: 0, min_days: 2, max_days: 5, serviceable: true },
    { partner: "Ecom Express", cost: 0, min_days: 3, max_days: 7, serviceable: true }
  ];

  try {
    const isServiceable = await checkPincodeServiceability(pincode);
    if (!isServiceable) return rates.map(r => ({ ...r, serviceable: false }));

    // Simple zone-based logic for cost estimation
    const distance_factor = Math.abs(parseInt(pincode.substring(0, 2)) - parseInt(origin_pincode.substring(0, 2)));
    const base_cost = 40;
    const weight_cost = weight_kg * 20;
    const distance_cost = distance_factor * 10;

    return rates.map(r => {
      let multiplier = 1.0;
      if (r.partner === "BlueDart") multiplier = 1.5;
      if (r.partner === "Ecom Express") multiplier = 0.8;

      return {
        ...r,
        cost: Math.round((base_cost + weight_cost + distance_cost) * multiplier)
      };
    });
  } catch (err) {
    console.warn("[DeliveryEstimator] calculateShippingCost failed", err);
    return rates;
  }
}

/**
 * Estimates the final delivery date for a customer order.
 */
export async function estimateDeliveryDate(
  pincode: string,
  vendorId?: string
): Promise<DeliveryEstimate | null> {
  try {
    const rates = await calculateShippingCost(0.5, pincode);
    const isServiceable = rates.some(r => r.serviceable);

    if (!isServiceable) {
      return {
        pincode,
        estimated_date: "",
        min_days: 0,
        max_days: 0,
        rates,
        is_serviceable: false
      };
    }

    // Lead time logic (Vendor prep time)
    let leadTime = 1;
    if (vendorId) {
      const vendorLeadTime = await getVendorLeadTime(vendorId);
      leadTime = vendorLeadTime;
    }

    const minDays = leadTime + Math.min(...rates.filter(r => r.serviceable).map(r => r.min_days));
    const maxDays = leadTime + Math.max(...rates.filter(r => r.serviceable).map(r => r.max_days));

    const estDate = new Date();
    estDate.setDate(estDate.getDate() + maxDays);

    return {
      pincode,
      estimated_date: estDate.toISOString(),
      min_days: minDays,
      max_days: maxDays,
      rates,
      is_serviceable: true
    };
  } catch (err) {
    console.warn("[DeliveryEstimator] estimateDeliveryDate failed", err);
    return null;
  }
}

/**
 * Gets the average lead time (prep time) for a specific vendor.
 */
export async function getVendorLeadTime(vendorId: string): Promise<number> {
  const sb = getClient();
  if (!sb) return 1;

  try {
    const { data, error } = await sb
      .from("vendors")
      .select("avg_lead_time_days")
      .eq("id", vendorId)
      .single();

    if (error || !data) return 1;
    return (data as any).avg_lead_time_days || 1;
  } catch (err) {
    console.warn("[DeliveryEstimator] getVendorLeadTime failed", err);
    return 1;
  }
}

/**
 * Returns a readable string for delivery range (e.g. "3-5 days").
 */
export function formatDeliveryRange(min: number, max: number): string {
  if (min === max) return `${min} day${min > 1 ? 's' : ''}`;
  return `${min}-${max} days`;
}
