// services/apis/open-food-facts.ts
// Open Food Facts API integration for food & grocery products.
// Stub-safe — returns mock data when not reachable.

export interface FoodProduct {
  barcode: string
  name: string
  brand: string
  category: string
  ingredients: string
  nutritionGrade: string // a-e
  imageUrl: string
  labels: string[]
  country: string
}

function stubProduct(barcode: string): FoodProduct {
  return {
    barcode,
    name: 'Britannia Good Day Butter Cookies',
    brand: 'Britannia',
    category: 'Biscuits and cakes',
    ingredients: 'Wheat flour, Sugar, Edible vegetable oil, Butter',
    nutritionGrade: 'c',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
    labels: ['Vegetarian', 'FSSAI Approved'],
    country: 'India',
  }
}

class OpenFoodFactsAPI {
  private baseUrl = 'https://world.openfoodfacts.org/api/v2'

  async getByBarcode(barcode: string): Promise<FoodProduct | null> {
    try {
      const res = await fetch(`${this.baseUrl}/product/${barcode}.json`)
      if (!res.ok) {
        console.warn('[OpenFoodFacts] Product not found:', barcode)
        return stubProduct(barcode)
      }
      const data = await res.json() as {
        status: number
        product?: {
          product_name?: string
          brands?: string
          categories?: string
          ingredients_text?: string
          nutrition_grades?: string
          image_url?: string
          labels?: string
          countries?: string
        }
      }
      if (data.status !== 1 || !data.product) return stubProduct(barcode)
      const p = data.product
      return {
        barcode,
        name: p.product_name ?? 'Unknown',
        brand: p.brands ?? 'Unknown',
        category: p.categories ?? 'Food',
        ingredients: p.ingredients_text ?? '',
        nutritionGrade: p.nutrition_grades ?? 'unknown',
        imageUrl: p.image_url ?? '',
        labels: p.labels?.split(',').map((l: string) => l.trim()) ?? [],
        country: p.countries ?? 'India',
      }
    } catch (err) {
      console.warn('[OpenFoodFacts] Error:', err)
      return stubProduct(barcode)
    }
  }

  async searchProducts(query: string, limit = 10): Promise<FoodProduct[]> {
    try {
      const res = await fetch(
        `${this.baseUrl}/search?search_terms=${encodeURIComponent(query)}&page_size=${limit}&json=true`
      )
      if (!res.ok) return [stubProduct(query)]
      const data = await res.json() as { products?: Array<{ code?: string; product_name?: string; brands?: string; categories?: string; ingredients_text?: string; nutrition_grades?: string; image_url?: string; labels?: string; countries?: string }> }
      return (data.products ?? []).map((p) => ({
        barcode: p.code ?? '',
        name: p.product_name ?? 'Unknown',
        brand: p.brands ?? '',
        category: p.categories ?? 'Food',
        ingredients: p.ingredients_text ?? '',
        nutritionGrade: p.nutrition_grades ?? 'unknown',
        imageUrl: p.image_url ?? '',
        labels: p.labels?.split(',').map((l: string) => l.trim()) ?? [],
        country: p.countries ?? 'India',
      }))
    } catch (err) {
      console.warn('[OpenFoodFacts] Search error:', err)
      return [stubProduct(query)]
    }
  }
}

export const openFoodFacts = new OpenFoodFactsAPI()


