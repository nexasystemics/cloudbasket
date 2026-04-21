export const translations = {
  common: {
    viewDeal: 'View Deal', comparePrices: 'Compare Prices', addToWishlist: 'Add to Wishlist',
    removeFromWishlist: 'Remove from Wishlist', priceAlert: 'Set Price Alert', addToCompare: 'Add to Compare',
    shareProduct: 'Share', buyNow: 'Buy Now', loading: 'Loading...', error: 'Something went wrong',
    retry: 'Try Again', noResults: 'No results found', searchPlaceholder: 'Search for products, brands, categories...',
    seeAll: 'See All', viewAll: 'View All',
  },
  home: {
    heroHeadline: "Compare Prices Across India's Top Platforms",
    heroSubheadline: 'Find the best deal on everything — electronics, fashion, home, beauty and more.',
    flashDeals: 'Flash Deals', topDealsToday: 'Top Deals Today', trendingSearches: 'Trending now:',
    platformTrust: 'We compare prices from', popularBrands: 'Popular Indian Brands', trendingInIndia: 'Trending in India', pickedForYou: 'Picked For You',
  },
  product: {
    priceHistory: 'Price History', priceHistoryComing: 'Price tracking coming soon',
    youMightLike: 'You might also like', recentlyViewed: 'Recently Viewed',
    specifications: 'Specifications', compareTable: 'Compare Prices', lowestPrice: 'Lowest Price',
    affiliateNote: "You'll be redirected to complete your purchase",
  },
  deals: {
    flashSale: 'Flash Sale', endsIn: 'Sale ends in:', dealScore: 'Deal Score',
    expiringSoon: 'Expiring Soon', todayOnly: 'Today Only', limitedStock: 'Limited Stock',
    bestSeller: 'Best Seller', bestPrice: 'Best Price',
  },
  nav: {
    deals: 'Deals', categories: 'Categories', products: 'Products', compare: 'Compare',
    blog: 'Blog', pod: 'CloudBasket Originals', login: 'Login', register: 'Register', dashboard: 'My Account',
  },
} as const

export type TranslationKeys = typeof translations
