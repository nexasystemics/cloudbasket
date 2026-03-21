// services/apis/open-food-facts.ts
// Open Food Facts API — free, no key required.

export type NutritionFacts = { calories: number; protein: number; fat: number; carbs: number; sugar: number; sodium: number }
export type OFFProduct = { barcode: string; name: string; brand: string; imageUrl: string; ingredients: string; nutrition: NutritionFacts; nutriscore: 'a'|'b'|'c'|'d'|'e'; allergens: string[] }

function parse(data: any): OFFProduct | null {
  if (!data?.product) return null
  const p = data.product
  return { barcode: p.code || '', name: p.product_name || '', brand: p.brands || '', imageUrl: p.image_url || '', ingredients: p.ingredients_text || '', nutrition: { calories: p.nutriments?.energy_kcal_100g || 0, protein: p.nutriments?.proteins_100g || 0, fat: p.nutriments?.fat_100g || 0, carbs: p.nutriments?.carbohydrates_100g || 0, sugar: p.nutriments?.sugars_100g || 0, sodium: p.nutriments?.sodium_100g || 0 }, nutriscore: (p.nutriscore_grade || 'c') as 'a'|'b'|'c'|'d'|'e', allergens: (p.allergens_tags || []).map((a: string) => a.replace('en:', '')) }
}

export class OpenFoodFactsAPI {
  async getProductByBarcode(barcode: string): Promise<OFFProduct | null> {
    try { const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, { next: { revalidate: 86400 } }); return r.ok ? parse(await r.json()) : null } catch { return null }
  }
  async searchProducts(query: string): Promise<OFFProduct[]> {
    try {
      const r = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1&page_size=20`)
      if (!r.ok) return []
      const json = await r.json()
      return (json.products || []).map((p: any) => parse({ product: p })).filter(Boolean) as OFFProduct[]
    } catch { return [] }
  }
}
export const openFoodFacts = new OpenFoodFactsAPI()