export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  mainCategory: string;
  subCategory: string;
  category: string; 
  image: string;
  brand: string;
  rating: number;
  stock: number;
  warranty: string;
  specs: Record<string, string>;
  affiliateUrl: string;
}

export const MAIN_CATEGORIES = [
  'Mobiles', 'Laptops', 'Fashion', 'Home', 'Beauty', 
  'Sports', 'Toys', 'Grocery', 'Automotive', 'Books'
];

export const SUB_CATEGORIES: Record<string, string[]> = {
  Mobiles: ['Flagship', 'Budget', 'Mid-range', 'Refurbished', 'Gaming Phones', '5G Phones', 'Accessories', 'Tablets', 'Foldables', 'iPhones'],
  Laptops: ['Workstations', 'Gaming', 'Ultrabooks', 'Student', 'MacBooks', 'Chromebooks', '2-in-1s', 'Monitors', 'Peripherals', 'Servers'],
  Fashion: ['Menswear', 'Womenswear', 'Kids', 'Footwear', 'Watches', 'Jewelry', 'Bags', 'Activewear', 'Winterwear', 'Luxury'],
  Home: ['Furniture', 'Kitchen', 'Decor', 'Bedding', 'Lighting', 'Garden', 'Smart Home', 'Appliances', 'Storage', 'Wall Art'],
  Beauty: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Bath & Body', 'Tools', 'Mens Grooming', 'Natural', 'Sunscreen', 'Professional'],
  Sports: ['Fitness', 'Running', 'Cycling', 'Swimming', 'Cricket', 'Football', 'Yoga', 'Racket Sports', 'Golf', 'Adventure'],
  Toys: ['Education', 'Action Figures', 'Dolls', 'Board Games', 'Puzzles', 'Lego', 'Remote Control', 'Plush', 'Outdoors', 'Collectibles'],
  Grocery: ['Beverages', 'Snacks', 'Pantry', 'Organic', 'Dairy', 'Frozen', 'Health Food', 'Sweets', 'Spices', 'International'],
  Automotive: ['Car Care', 'Accessories', 'Parts', 'Electronics', 'Tools', 'Tyres', 'Oil & Fluids', 'Safety', 'Motorbike', 'Cleaning'],
  Books: ['Fiction', 'Non-Fiction', 'Business', 'Tech', 'Self-Help', 'Children', 'Cookbooks', 'Comics', 'Education', 'Biography']
};

const generateProducts = (): Product[] => {
  const products: Product[] = [];
  let id = 1;

  MAIN_CATEGORIES.forEach((mainCat, mainIdx) => {
    const subs = SUB_CATEGORIES[mainCat];
    subs.forEach((subCat, subIdx) => {
      for (let i = 1; i <= 20; i++) {
        // Use diverse image IDs by combining indices
        const imageId = 1500000000000 + (mainIdx * 500) + (subIdx * 50) + (i * 7);
        products.push({
          id: id++,
          name: `${subCat} ${i} Pro ${mainCat}`,
          price: Math.floor(Math.random() * 80000) + 999,
          description: `Experience elite performance with the ${subCat} ${i}. Engineered for the modern Indian lifestyle with premium ${mainCat.toLowerCase()} components.`,
          mainCategory: mainCat,
          subCategory: subCat,
          category: subCat,
          image: `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&q=80&w=800`,
          brand: ['Skyline', 'Alpha', 'Omega', 'Vortex', 'Prime'][Math.floor(Math.random() * 5)],
          rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
          stock: Math.floor(Math.random() * 50) + 1,
          warranty: '1 Year Brand Warranty',
          specs: {
            'Model': `CB-2026-${id}`,
            'Material': 'Premium Composite',
            'Origin': 'Global',
            'Shipping': 'Express 2-Day',
            'Authentic': 'Verified Supplier',
            'Condition': 'New',
            'Tax': 'Inclusive of GST',
            'Returns': '7-Day Policy',
            'Quality': 'Grade-A Platinum',
            'Support': '24/7 Tech Hub'
          },
          affiliateUrl: `https://example.com/affiliate/deal-${id}?tag=cloudbasket-21`
        });
      }
    });
  });

  return products;
};

export const PRODUCTS = generateProducts();
