export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: 'Beauty' | 'Books' | 'Sports' | 'Toys';
  image: string;
}

export const PRODUCTS: Product[] = [
  // Beauty (1-13)
  {
    id: 1,
    name: "Advanced Hydrating Serum",
    price: 1250,
    description: "Experience deep cellular rejuvenation with our scientifically formulated serum. This advanced blend of hyaluronic acid and vitamins restores skin elasticity and provides long-lasting moisture.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1570172619661-8935ef7a9332?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    name: "Organic Lavender Facial Oil",
    price: 850,
    description: "Calm your senses and nourish your skin with 100% pure organic lavender essential oil. It is ideal for evening aromatherapy sessions or as a gentle addition to your daily skincare routine.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Mineral UV Protection Cream",
    price: 1100,
    description: "Our broad-spectrum SPF 50 mineral sunscreen offers superior protection against harmful UVA and UVB rays. The lightweight, non-greasy formula blends seamlessly into all skin tones without leaving a white cast.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1556228578-8c7c2f971c91?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "Botanical Night Repair Mask",
    price: 1800,
    description: "Wake up to radiant skin with this overnight treatment infused with rare botanical extracts. It works during your sleep cycle to repair environmental damage and smooth fine lines.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    name: "Charcoal Detoxifying Cleanser",
    price: 650,
    description: "Gently lift away impurities and excess oil with the power of activated charcoal. This deep-cleansing formula minimizes pores and leaves your skin feeling exceptionally fresh and balanced.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    name: "Rose Quartz Facial Roller",
    price: 950,
    description: "Enhance your daily beauty ritual with this premium rose quartz facial roller. Regular use helps reduce puffiness, improves blood circulation, and promotes a natural glowing complexion.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 7,
    name: "Vitamin C Brightening Mask",
    price: 1400,
    description: "Achieve instant radiance with our concentrated Vitamin C sheet masks. These professional-grade treatments target dark spots and uneven skin tone for a brighter appearance.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 8,
    name: "Matte Finish Foundation",
    price: 2200,
    description: "A high-coverage liquid foundation that provides a flawless matte finish for up to 24 hours. The breathable formula is sweat-resistant and perfect for long working days.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 9,
    name: "Vegan Lip Tint Set",
    price: 1600,
    description: "This curated collection features four versatile shades made with natural pigments and shea butter. Enjoy long-lasting color that hydrates your lips without any harsh chemicals.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 10,
    name: "Silk Eye Recovery Gel",
    price: 2400,
    description: "Target dark circles and fine lines with our innovative silk protein eye gel. The cooling applicator provides instant relief to tired eyes while delivering potent anti-aging ingredients.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 11,
    name: "Exfoliating Sea Salt Scrub",
    price: 780,
    description: "Buff away dry skin with mineral-rich sea salt and nourishing almond oil. This invigorating body scrub leaves your skin incredibly soft and delicately scented with oceanic notes.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1607006344380-b6775a0824a7?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 12,
    name: "Professional Makeup Brush Set",
    price: 3500,
    description: "A 12-piece professional brush collection designed for precise application of powders, creams, and liquids. Each brush features high-quality synthetic bristles and an ergonomic handle.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 13,
    name: "Aromatic Sandalwood Perfume",
    price: 4500,
    description: "A sophisticated fragrance featuring base notes of sustainable sandalwood and top notes of bergamot. This long-lasting eau de parfum is suitable for both formal and casual occasions.",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800"
  },

  // Books (14-26)
  {
    id: 14,
    name: "The Infinite Horizon",
    price: 499,
    description: "Explore the depths of cosmic philosophy in this award-winning exploration of space and time. A must-read for anyone seeking to understand the fundamental nature of our universe.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 15,
    name: "Digital Marketing Masterclass",
    price: 899,
    description: "Stay ahead of the curve with this comprehensive guide to modern advertising strategies. Learn everything from SEO basics to advanced social media conversion tactics from industry experts.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 16,
    name: "Secrets of the Silent City",
    price: 350,
    description: "This gripping historical mystery takes readers through the cobblestone streets of 19th-century London. A masterful blend of suspense and atmospheric detail that keeps you turning pages until dawn.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 17,
    name: "Sustainable Living Guide",
    price: 550,
    description: "Transform your lifestyle with practical advice on reducing your carbon footprint. This beautifully illustrated book covers everything from urban gardening to ethical consumption habits.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 18,
    name: "The Art of Culinary Science",
    price: 1200,
    description: "Unlock the chemistry behind your favorite dishes with this innovative cookbook. Perfect for amateur chefs who want to understand the 'why' behind traditional cooking techniques.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1551029170-1461732a6d88?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 19,
    name: "Architecture of Tomorrow",
    price: 2500,
    description: "A stunning visual survey of contemporary sustainable architecture around the globe. This coffee table book features high-resolution photography and insightful commentary from world-renowned architects.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 20,
    name: "Python for Data Analysis",
    price: 950,
    description: "Master the essential tools for data manipulation and visualization using the Python programming language. This technical guide provides hands-on exercises for real-world data science applications.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 21,
    name: "Modern Leadership Dynamics",
    price: 750,
    description: "Navigate the complexities of managing remote and hybrid teams in the modern corporate environment. This book offers evidence-based strategies for fostering innovation and emotional intelligence.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 22,
    name: "Gardening in Small Spaces",
    price: 450,
    description: "Learn how to create a thriving green oasis even in the smallest urban apartments. Practical tips for container gardening and vertical planting ensure anyone can enjoy the benefits of nature.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1524486361537-8ad15938e1a3?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 23,
    name: "The Mindful Path",
    price: 599,
    description: "An evidence-based approach to practicing mindfulness in a fast-paced digital world. Discover techniques for reducing anxiety and improving focus through daily meditative practices.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 24,
    name: "Classic Poetry Collection",
    price: 650,
    description: "An elegant hardcover edition featuring the greatest works of romantic and modern poets. A timeless addition to any library, complete with critical essays and biographical notes.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1512428559087-560ad5185257?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 25,
    name: "Global Economic Trends",
    price: 1800,
    description: "A comprehensive analysis of the forces shaping the world economy in the 21st century. This textbook is an essential resource for students and professionals in finance and international relations.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 26,
    name: "The History of Jazz",
    price: 880,
    description: "Trace the evolution of jazz from its roots in New Orleans to contemporary global movements. Includes rare interviews with legendary musicians and detailed discographies for enthusiasts.",
    category: "Books",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=800"
  },

  // Sports (27-39)
  {
    id: 27,
    name: "Pro Carbon Tennis Racket",
    price: 8500,
    description: "Engineered for maximum power and precision on the court. The lightweight carbon frame ensures rapid swing speeds while maintaining superior control for competitive players.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1617083281297-af330b568615?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 28,
    name: "Elite Performance Running Shoes",
    price: 6200,
    description: "Experience unparalleled comfort with our latest responsive cushioning technology. Designed for marathon runners and fitness enthusiasts alike, these shoes provide optimal energy return.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 29,
    name: "Smart Fitness Watch",
    price: 12000,
    description: "Track your progress with medical-grade accuracy using our advanced biometric sensors. This water-resistant smartwatch features built-in GPS and personalized training recommendations.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1508685096489-7aac296839c8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 30,
    name: "Weighted Yoga Mat",
    price: 2500,
    description: "A high-density eco-friendly yoga mat with an integrated non-slip surface. Its extra-thick construction provides superior joint support during intense training sessions.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 31,
    name: "Adjustable Dumbbell Set",
    price: 15000,
    description: "Save space in your home gym with this versatile adjustable weight system. Easily switch between different intensity levels with a secure and intuitive locking mechanism.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa200c01?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 32,
    name: "Professional Soccer Ball",
    price: 1800,
    description: "FIFA-quality construction ensures consistent flight and durability on any playing surface. This thermal-bonded ball is designed for professional match play and high-level training.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 33,
    name: "Hydration Backpack 2L",
    price: 3200,
    description: "Stay hydrated during long treks or cycling trips with this ergonomic 2-liter reservoir. The breathable mesh straps and lightweight design ensure maximum comfort during physical activity.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 34,
    name: "Carbon Fiber Road Bike",
    price: 95000,
    description: "A professional-grade cycling machine built for speed and efficiency. Features a lightweight aerodynamic frame and high-precision gear components for serious cyclists.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 35,
    name: "Compression Recovery Sleeves",
    price: 1400,
    description: "Accelerate your post-workout recovery with medical-grade graduated compression. These sleeves improve circulation and reduce muscle soreness after intense athletic performance.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1518611012118-2969c6390da2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 36,
    name: "Portable Basketball Hoop",
    price: 18000,
    description: "Bring the game to your driveway with this durable height-adjustable basketball system. Features a shatterproof backboard and a heavy-duty base for stability during dunks.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 37,
    name: "Professional Swimming Goggles",
    price: 1200,
    description: "Anti-fog treated lenses with a wide peripheral view for competitive swimming. The soft silicone gaskets provide a leak-proof seal without causing uncomfortable pressure.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1530549387074-d56a99e142e0?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 38,
    name: "Weightlifting Belt",
    price: 2800,
    description: "High-quality genuine leather belt providing essential lumbar support for heavy lifting. Designed to help maintain proper form and prevent injuries during squats and deadlifts.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 39,
    name: "Badminton Kit Bag",
    price: 2400,
    description: "A spacious triple-compartment bag designed to carry rackets, shoes, and apparel. Features padded straps and thermal lining to protect your equipment from temperature fluctuations.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1626225453076-2f7902092193?auto=format&fit=crop&q=80&w=800"
  },

  // Toys (40-50)
  {
    id: 40,
    name: "Solar System Building Kit",
    price: 2100,
    description: "Inspire the next generation of astronomers with this detailed educational building set. Children can learn about planetary orbits while developing fine motor skills and spatial awareness.",
    category: "Toys",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 41,
    name: "Remote Control Drone",
    price: 4500,
    description: "A beginner-friendly quadcopter with HD camera and stable flight technology. Features one-key takeoff and altitude hold for easy operation by young pilots.",
    category: "Toys",
    image: "https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 42,
    name: "Classic Wooden Train Set",
    price: 3200,
    description: "A timeless 80-piece wooden railway collection compatible with most major brands. Crafted from sustainable beech wood with non-toxic finishes for years of imaginative play.",
    category: "Toys",
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 43,
    name: "Interactive Robotics Kit",
    price: 7500,
    description: "Build and program your own working robot using this comprehensive STEAM education kit. Perfect for children interested in coding and mechanical engineering fundamentals.",
    category: "Toys",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 44,
    name: "Abstract Strategy Board Game",
    price: 1800,
    description: "Engage in a battle of wits with this award-winning strategic game for two to four players. Promotes critical thinking and long-term planning through elegant game mechanics.",
    category: "Toys",
    image: "https://images.unsplash.com/photo-1610812382601-098547f89745?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 45,
    name: "Magnifying Science Lab",
    price: 2800,
    description: "A fully equipped junior science laboratory featuring a high-power microscope and essential tools. Includes 30 experiments to introduce children to the wonders of microbiology.",
    category: "Toys",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 46,
    name: "Magical Storybook Castle",
    price: 5200,
    description: "A grand four-story dollhouse featuring handcrafted furniture and working light fixtures. This premium play set encourages creative storytelling and social development through role-playing.",
    category: "Toys",
    image: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 47,
    name: "Advanced Coding Blocks",
    price: 3800,
    description: "Introduce the logic of computer programming without the need for a screen. These tactile blocks allow children to create complex sequences and loops through physical interaction.",
    category: "Toys",
    image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 48,
    name: "Musical Keyboard for Kids",
    price: 2400,
    description: "Develop early musical talent with this 44-key electronic keyboard featuring various instrument sounds. Includes a teaching mode and record function to help young musicians progress.",
    category: "Toys",
    image: "https://images.unsplash.com/photo-1514119412350-e174d90d280e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 49,
    name: "Outdoor Explorer Kit",
    price: 1500,
    description: "Equip your little adventurer with binoculars, a working compass, and a magnifying glass. This durable set encourages exploration of the natural world in your own backyard.",
    category: "Toys",
    image: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 50,
    name: "Eco-Friendly Building Blocks",
    price: 1200,
    description: "A set of 100 colorful blocks made from 100% recycled plastic materials. These durable pieces promote creative construction while teaching children about environmental responsibility.",
    category: "Toys",
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&q=80&w=800"
  }
];
