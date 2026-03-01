export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  mainCategory: string;
  subCategory: string;
  category: string; // for compatibility
  image: string;
  brand: string;
  rating: number;
  stock: number;
  warranty: string;
  specs: Record<string, string>;
}

export const MAIN_CATEGORIES = [
  'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 
  'Toys', 'Grocery', 'Automotive', 'Books', 'Health'
];

export const SUB_CATEGORIES: Record<string, string[]> = {
  Electronics: ['Smartphones', 'Laptops', 'Audio', 'Wearables', 'Cameras', 'Gaming', 'TVs', 'Tablets', 'Accessories', 'Drones'],
  Fashion: ['Menswear', 'Womenswear', 'Kids', 'Footwear', 'Watches', 'Jewelry', 'Bags', 'Activewear', 'Winterwear', 'Accessories'],
  Home: ['Furniture', 'Kitchen', 'Decor', 'Bedding', 'Lighting', 'Garden', 'Smart Home', 'Appliances', 'Storage', 'Cleaning'],
  Beauty: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Bath & Body', 'Tools', 'Mens Grooming', 'Natural', 'Sunscreen', 'Nails'],
  Sports: ['Fitness', 'Running', 'Cycling', 'Swimming', 'Team Sports', 'Outdoor', 'Yoga', 'Racket Sports', 'Golf', 'Winter Sports'],
  Toys: ['Education', 'Action Figures', 'Dolls', 'Board Games', 'Puzzles', 'Lego', 'Remote Control', 'Plush', 'Art & Craft', 'Outdoor Play'],
  Grocery: ['Beverages', 'Snacks', 'Pantry', 'Organic', 'Dairy', 'Frozen', 'Health Food', 'Sweets', 'Spices', 'International'],
  Automotive: ['Car Care', 'Accessories', 'Parts', 'Electronics', 'Tools', 'Tyres', 'Oil & Fluids', 'Safety', 'Motorbike', 'Cleaning'],
  Books: ['Fiction', 'Non-Fiction', 'Business', 'Tech', 'Self-Help', 'Children', 'Cookbooks', 'Comics', 'Education', 'Biography'],
  Health: ['Supplements', 'Vitamins', 'Personal Care', 'Wellness', 'Devices', 'First Aid', 'Nutrition', 'Oral Care', 'Fitness Help', 'Sleep']
};

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  let id = 1;

  MAIN_CATEGORIES.forEach(mainCat => {
    const subs = SUB_CATEGORIES[mainCat];
    subs.forEach(subCat => {
      for (let i = 1; i <= 20; i++) {
        products.push({
          id: id++,
          name: `${subCat} ${i} Premium`,
          price: Math.floor(Math.random() * 50000) + 500,
          description: `High-quality ${subCat} item designed for professional use. Featuring advanced ${mainCat.toLowerCase()} technology and durable materials.`,
          mainCategory: mainCat,
          subCategory: subCat,
          category: subCat, // compatible with existing category filters
          image: `https://images.unsplash.com/photo-${1500000000000 + id}?auto=format&fit=crop&q=80&w=800`,
          brand: ['CloudTech', 'BasketElite', 'GlobalPure', 'AlphaDesign', 'OmegaLife'][Math.floor(Math.random() * 5)],
          rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
          stock: Math.floor(Math.random() * 100) + 5,
          warranty: ['1 Year', '2 Years', '6 Months', 'No Warranty', 'Lifetime'][Math.floor(Math.random() * 5)],
          specs: {
            'Material': 'Industrial Grade',
            'Origin': 'Global Distribution',
            'Weight': `${(Math.random() * 5).toFixed(1)}kg`,
            'Dimensions': 'Variable',
            'Energy': 'Efficient',
            'Cert': 'ISO 9001',
            'Color': 'Titanium Gray',
            'Usage': 'Multi-purpose',
            'Style': 'Apple-Clean',
            'Shipping': 'Global Express'
          }
        });
      }
    });
  });

  return products;
};

export const PRODUCTS = generateProducts();
