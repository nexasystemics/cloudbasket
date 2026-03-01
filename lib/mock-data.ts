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
  status: 'Pending' | 'Approved' | 'Rejected';
}

export const MAIN_CATEGORIES = [
  'Mobiles', 'Laptops', 'Fashion', 'Home', 'Beauty', 
  'Sports', 'Toys', 'Grocery', 'Automotive', 'Books'
];

export const CATEGORY_SEO: Record<string, { title: string, description: string }> = {
  Mobiles: { title: 'Best Mobile Deals 2026', description: 'Compare latest 5G smartphones and flagship deals from top global brands.' },
  Laptops: { title: 'High-Performance Laptops', description: 'Discover work and gaming laptop deals with verified specs and regional pricing.' },
  Fashion: { title: 'Premium Global Fashion', description: 'Curated apparel, watches, and accessories from elite international nodes.' },
};

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
        // High-fidelity image IDs from Unsplash curated collections
        const imageId = 1500000000000 + (mainIdx * 700) + (subIdx * 100) + (i * 11);
        products.push({
          id: id++,
          name: `${subCat} Elite ${i} ${mainCat}`,
          price: Math.floor(Math.random() * 85000) + 1299,
          description: `The ${subCat} Elite Series represents the pinnacle of sovereign design. Engineered for high-throughput environments with a focus on durability and localized performance metrics. Each unit is verifiably audited for global hub compliance.`,
          mainCategory: mainCat,
          subCategory: subCat,
          category: subCat,
          image: `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&q=80&w=800`,
          brand: ['Skyline', 'Alpha', 'Omega', 'Vortex', 'Prime'][Math.floor(Math.random() * 5)],
          rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
          stock: Math.floor(Math.random() * 50) + 5,
          warranty: '1 Year Brand Warranty',
          specs: {
            'Series': 'Sovereign Hub v1.0',
            'Authentic': 'Verified Node',
            'Origin': 'Global Distribution',
            'Logistics': 'Priority Express',
            'Compliance': 'DPDPA/GDPR Ready',
            'Support': '24/7 Command Center',
            'Security': 'Encrypted Supply Chain',
            'Integrity': 'Platinum Grade',
            'Redirect': 'Income Shield Active',
            'Audit': 'Step 10 Certified'
          },
          affiliateUrl: `https://amazon.in/dp/B00EXAMPLE?tag=cloudbasket-21`,
          status: 'Approved'
        });
      }
    });
  });

  return products;
};

export const PRODUCTS = generateProducts();
