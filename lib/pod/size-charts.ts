// E25: Automated Size Chart Generator for Apparel
export type SizeChart = { product: string; unit: 'cm' | 'inch'; sizes: Record<string, Record<string, number>> }

export const SIZE_CHARTS: Record<string, SizeChart> = {
  tshirt: {
    product: 'T-Shirt', unit: 'cm',
    sizes: {
      XS: { chest: 86, length: 66, shoulder: 38, sleeve: 18 },
      S: { chest: 91, length: 68, shoulder: 40, sleeve: 19 },
      M: { chest: 97, length: 70, shoulder: 42, sleeve: 20 },
      L: { chest: 104, length: 72, shoulder: 44, sleeve: 21 },
      XL: { chest: 111, length: 74, shoulder: 46, sleeve: 22 },
      XXL: { chest: 119, length: 76, shoulder: 48, sleeve: 23 },
      XXXL: { chest: 127, length: 78, shoulder: 50, sleeve: 24 },
    }
  },
  hoodie: {
    product: 'Hoodie', unit: 'cm',
    sizes: {
      S: { chest: 94, length: 65, shoulder: 44, sleeve: 60 },
      M: { chest: 100, length: 67, shoulder: 46, sleeve: 62 },
      L: { chest: 107, length: 69, shoulder: 48, sleeve: 64 },
      XL: { chest: 114, length: 71, shoulder: 50, sleeve: 65 },
      XXL: { chest: 122, length: 73, shoulder: 52, sleeve: 66 },
    }
  },
}

export function getSizeRecommendation(chest: number, height: number, product = 'tshirt'): string {
  const chart = SIZE_CHARTS[product]
  if (!chart) return 'M'
  for (const [size, dims] of Object.entries(chart.sizes)) {
    if (chest <= dims.chest) return size
  }
  return 'XXXL'
}
