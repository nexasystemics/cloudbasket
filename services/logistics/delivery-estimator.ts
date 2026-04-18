// services/logistics/delivery-estimator.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { isConfigured } from "@/lib/env";

/**
 * Delivery Estimation Service.
 * Calculates estimated delivery dates and shipping costs based on pincode and logistics partners.
 */

export type DeliveryZone = "metro" | "tier1" | "tier2" | "rural";

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

interface VendorRow {
  avg_lead_time_days: number;
}

// Pincode prefixes for major metro cities (first 3 digits)
const METRO_PREFIXES = new Set([
  "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", // Delhi NCR
  "400", "401", "402", "403", "404", "405", "406", "407", "408", "409", "410", // Mumbai
  "560", "561", "562",                                                          // Bangalore
  "600", "601", "602", "603", "604",                                            // Chennai
  "700", "701", "702", "703", "704", "705", "706", "707", "708",               // Kolkata
  "500", "501", "502",                                                          // Hyderabad
]);

// Pincode prefixes for Tier-1 cities (first 3 digits)
const TIER1_PREFIXES = new Set([
  "380", "382", "390", "395",  // Ahmedabad / Surat
  "411", "412", "413",         // Pune
  "302", "303",                // Jaipur
  "226", "227",                // Lucknow
  "440", "441",                // Nagpur
  "160", "161",                // Chandigarh
  "380", "395",                // Gujarat majors
  "682", "683",                // Kochi
  "641", "642",                // Coimbatore
  "530", "531",                // Visakhapatnam
]);

function getClient(): SupabaseClient | null {
  if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL") || !isConfigured("SUPABASE_SERVICE_ROLE_KEY")) {
    return null;
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Returns the delivery zone for a given pincode.
 * metro → major metros | tier1 → large cities | tier2 → smaller cities | rural → rest
 */
export function getDeliveryZone(pincode: string): DeliveryZone {
  const prefix3 = pincode.substring(0, 3);
  if (METRO_PREFIXES.has(prefix3)) return "metro";
  if (TIER1_PREFIXES.has(prefix3)) return "tier1";

  // Pincodes starting with 1–6 tend to cover urban/semi-urban areas
  const firstDigit = parseInt(pincode.charAt(0), 10);
  if (firstDigit >= 1 && firstDigit <= 6) return "tier2";
  return "rural";
}

// Days by zone and platform speed tier
const ZONE_DAYS: Record<DeliveryZone, number> = {
  metro: 2,
  tier1: 3,
  tier2: 5,
  rural: 7,
};

// Platforms known for faster fulfillment get a 1-day reduction (floored at 1)
const FAST_PLATFORMS = new Set(["amazon", "flipkart", "meesho"]);

/**
 * Returns estimated delivery days for a pincode + platform combination.
 */
export function estimateDelivery(pincode: string, platform: string): number {
  const zone = getDeliveryZone(pincode);
  const baseDays = ZONE_DAYS[zone];
  const isFast = FAST_PLATFORMS.has(platform.toLowerCase());
  return isFast ? Math.max(1, baseDays - 1) : baseDays;
}

/**
 * Returns a customer-facing delivery message, e.g. "Delivered in 2-3 days".
 */
export function formatDeliveryMessage(days: number): string {
  if (days <= 1) return "Delivered by tomorrow";
  return `Delivered in ${days - 1}-${days} days`;
}

/**
 * Checks if a specific pincode is serviceable by any logistics partner.
 */
export async function checkPincodeServiceability(pincode: string): Promise<boolean> {
  const sb = getClient();
  if (!sb) return true;

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

    let leadTime = 1;
    if (vendorId) {
      leadTime = await getVendorLeadTime(vendorId);
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
    return (data as VendorRow).avg_lead_time_days || 1;
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
