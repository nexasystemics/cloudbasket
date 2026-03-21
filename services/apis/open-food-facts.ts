// services/apis/open-food-facts.ts
// Open Food Facts API — free, no key required.
// Enriches FMCG product data with nutrition, ingredients, nutriscore.

export type NutritionFacts = {
  calories: number
  protein: number
  fat: number
  saturatedFat: number
  carbs: number
  sugar: number
  fibre: number
  sodium: number
}

export type OFFProduct = {
  barcode: string
  name: string
  brand: string
  imageUrl: string
  ingredients: string
  nutrition: NutritionFacts
  nutriscore: 'a' | 'b' | 'c' | 'd' | 'e'
  novaGroup: 1 | 2 | 3 | 4
  allergens: string[]
  labels: string[]
  quantity: string
}

const BASE = 'https://world.openfoodfacts.org'

function parseProduct(data: any): OFFProduct | null {
  if (!data?.product) return null
  const p = data.product
  return {
    barcode: p.code || '',
    name: p.product_name || '',
    brand: p.brands || '',
    imageUrl: p.image_url || '',
    ingredients: p.ingredients_text || '',
    nutrition: {
      calories: p.nutriments?.energy_kcal_100g || 0,
      protein: p.nutriments?.proteins_100g || 0,
      fat: p.nutriments?.fat_100g || 0,
      saturatedFat: p.nutriments?.['saturated-fat_100g'] || 0,
      carbs: p.nutriments?.carbohydrates_100g || 0,
      sugar: p.nutriments?.sugars_100g || 0,
      fibre: p.nutriments?.fiber_100g || 0,
      sodium: p.nutriments?.sodium_100g || 0,
    },
    nutriscore: (p.nutriscore_grade || 'c') as 'a' | 'b' | 'c' | 'd' | 'e',
    novaGroup: (p.nova_group || 3) as 1 | 2 | 3 | 4,
    allergens: (p.allergens_tags || []).map((a: string) => a.replace('en:', '')),
    labels: (p.labels_tags || []).map((l: string) => l.replace('en:', '')),
    quantity: p.quantity || '',
  }
}

export class OpenFoodFactsAPI {
  async getProductByBarcode(barcode: string): Promise<OFFProduct | null> {
    try {
      const res = await fetch(`${BASE}/api/v2/product/${barcode}.json`, { next: { revalidate: 86400 } })
      if (!res.ok) return null
      return parseProduct(await res.json())
    } catch { return null }
  }

  async searchProducts(query: string, brand?: string): Promise<OFFProduct[]> {
    try {
      const params = new URLSearchParams({ search_terms: query, json: '1', page_size: '20' })
      if (brand) params.set('brands', brand)
      const res = await fetch(`${BASE}/cgi/search.pl?${params}`)
      if (!res.ok) return []
      const json = await res.json()
      return (json.products || []).map((p: any) => parseProduct({ product: p })).filter(Boolean) as OFFProduct[]
    } catch { return [] }
  }
}

export const openFoodFacts = new OpenFoodFactsAPI()