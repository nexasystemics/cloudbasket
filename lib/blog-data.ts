export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  imageId: string
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'best-5g-phones-2026',
    title: 'Best 5G Phones Under ₹20,000 in 2026',
    excerpt:
      'We compared top 5G options that deliver strong performance without crossing budget limits. This guide covers battery, camera and value picks.',
    category: 'Mobiles',
    readTime: '6 min read',
    date: 'March 2026',
    imageId: '1592750475338-74b7b21085ab',
  },
  {
    slug: 'amazon-vs-flipkart',
    title: 'Amazon vs Flipkart: Where to Buy Electronics',
    excerpt:
      'Platform pricing changes daily and hidden shipping costs can impact final value. We break down when each marketplace usually wins.',
    category: 'Guides',
    readTime: '8 min read',
    date: 'March 2026',
    imageId: '1511707171634-5f897ff02aa9',
  },
  {
    slug: 'dpdpa-shopping-guide',
    title: 'Your Rights Under DPDPA 2023 While Shopping Online',
    excerpt:
      'Indian shoppers now get clearer control over personal data shared with digital platforms. Learn practical rights and how to exercise them safely.',
    category: 'Privacy',
    readTime: '5 min read',
    date: 'March 2026',
    imageId: '1488459716781-31db52582fe9',
  },
  {
    slug: 'laptop-buying-guide',
    title: 'Complete Laptop Buying Guide 2026',
    excerpt:
      'Choosing a laptop is easier when you match processor, memory and workload correctly. This checklist helps students, creators and professionals.',
    category: 'Laptops',
    readTime: '10 min read',
    date: 'March 2026',
    imageId: '1496181133206-80ce9b88a853',
  },
  {
    slug: 'cashback-tricks',
    title: '10 Cashback Tricks That Actually Work',
    excerpt:
      'Most shoppers miss predictable cashback cycles and card stacking opportunities. These tactics focus on repeatable savings instead of hype.',
    category: 'Deals',
    readTime: '4 min read',
    date: 'March 2026',
    imageId: '1542838132-92c53300491e',
  },
  {
    slug: 'cloudbasket-how-it-works',
    title: 'How CloudBasket Finds You the Best Price',
    excerpt:
      'CloudBasket is built as a zero-checkout discovery engine that compares verified offers. This article explains ranking, freshness and redirect flow.',
    category: 'About',
    readTime: '3 min read',
    date: 'March 2026',
    imageId: '1543168253-40520932252c',
  },
]
