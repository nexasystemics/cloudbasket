export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  imageId: string
  author?: string
  content?: string
}

const BASE_BLOG_POSTS: BlogPost[] = [
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

const REQUIRED_BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'how-to-track-flash-sales',
    title: 'How to Track Flash Sales Without Missing the Best Window',
    excerpt:
      'Flash sales move fast, but most misses come from poor preparation rather than slow clicks. This guide shows how to build a repeatable process that catches real deals.',
    category: 'Deals',
    readTime: '4 min read',
    date: '2026-03-01',
    imageId: '1483985988355-763728e1935b',
    author: 'CloudBasket Team',
    content: `Flash sales reward preparation more than speed. Start by deciding exactly what you want to buy, what price makes it worthwhile, and which stores are allowed. When shoppers enter a sale without those limits, they waste the short discount window comparing basic details and often buy the wrong variant. Create a shortlist with the product name, storage size, color, and maximum acceptable price. Then save product pages in advance, sign in to each store, and confirm your delivery address and payment method are already available.

The next step is tracking. Use price history, sale calendars, and platform alerts together instead of relying on a single notification. Many flash promotions repeat at predictable times, especially around payday, weekends, and marketplace events. If you see a discount that looks dramatic, compare it with the usual selling price before acting. A banner that says sixty percent off is not useful if the product was inflated yesterday.

The final habit is verifying the total cost. Shipping, coupons, exchange offers, and seller quality matter as much as the headline price. The best flash-sale strategy is simple: prepare early, compare quickly, and buy only when the final landed price beats your target by enough to matter.`,
  },
  {
    slug: 'best-price-comparison-tips',
    title: 'Best Price Comparison Tips for Smarter Online Shopping',
    excerpt:
      'Comparing prices properly means checking final cost, seller quality, and timing instead of chasing the lowest visible number. These habits improve savings and reduce bad purchases.',
    category: 'Guides',
    readTime: '5 min read',
    date: '2026-03-01',
    imageId: '1523474253046-8cd2748b5fd2',
    author: 'CloudBasket Team',
    content: `Good price comparison starts with matching identical products. That sounds obvious, but shoppers often compare different storage sizes, bundled accessories, imported versions, or seller-refurbished units and assume the cheapest listing wins. Before comparing, verify the exact model number, warranty terms, return window, and seller reputation. If any of those differ, you are not looking at the same deal.

Next, compare the full transaction value instead of the product card price. Add shipping charges, platform fees, coupon eligibility, cashback, bank discounts, and exchange bonuses. Some marketplaces look expensive until card offers are applied, while others appear cheap but recover the difference through shipping or weaker return policies. If the item is imported, consider delivery timelines and possible customs handling as part of the real cost.

Timing is the final edge. Prices move throughout the week and around promotional cycles, so one snapshot is rarely enough. Check a few times, watch price history if available, and set a target price before you feel urgency. The best comparison habit is disciplined consistency: verify the same product, calculate the final payable amount, and only act when the best offer is clearly better than the alternatives you have already measured.`,
  },
  {
    slug: 'save-money-online-shopping',
    title: 'Save Money Online Shopping With Repeatable Buying Rules',
    excerpt:
      'The easiest way to spend less online is to build simple purchase rules that remove impulse decisions. These savings tactics work across categories and sales events.',
    category: 'Savings',
    readTime: '4 min read',
    date: '2026-03-01',
    imageId: '1542838132-92c53300491e',
    author: 'CloudBasket Team',
    content: `Saving money online is less about finding one perfect coupon and more about following repeatable rules before you pay. Start with a waiting rule for non-urgent items. If a purchase is not needed this week, give it at least twenty-four hours before checkout. That pause filters out a surprising number of impulse buys and gives you time to compare prices, read reviews, and decide whether the product is truly worth the spend.

Bundle your savings methods instead of using them one at a time. Compare multiple stores, check for bank discounts, test valid coupons, and review cashback options before you commit. Even modest reductions stack into meaningful savings when the cart value is high. If you shop often, keep a short list of preferred cards, dependable sellers, and common sale dates so you do not restart your research every time.

Most importantly, set a buy price before the sale begins. When shoppers wait for a discount without a target, they are easy to manipulate with countdown timers and inflated reference prices. A target price gives you an objective decision point. If the final amount is still above your limit, skip it. Saving money online is not just buying cheaper things; it is buying deliberately when the numbers genuinely work in your favor.`,
  },
]

const ACTION_14_BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'best-smartphones-under-15000-india-2026',
    title: 'Best Smartphones Under ₹15,000 in India 2026',
    excerpt:
      'Finding a 5G smartphone with a good camera and solid battery under ₹15,000 is easier than ever in 2026. Here are the models worth buying right now.',
    category: 'Mobiles',
    readTime: '7 min read',
    date: '2026-04-22',
    imageId: '1570101750729-d02e99f069f2',
    author: 'CloudBasket Team',
    content: `The under-fifteen-thousand segment in India has become genuinely competitive in 2026. Brands like Realme, Poco, Redmi and iQOO have all released 5G-capable models in this range, and most of them arrive with large batteries, capable cameras and AMOLED displays. The challenge is not finding a phone — it is knowing which trade-offs are acceptable for your specific use.

Start with connectivity. If your city has 5G coverage, prioritise phones built on the Dimensity 6100 Plus or Snapdragon 695 chipsets. Both deliver reliable 5G throughput and efficient power use. The Realme Narzo 60x 5G and Poco M6 Pro 5G are the two most recommended entries at this price point, consistently topping review benchmarks for everyday speed and call quality. Either is a safe choice if 5G is your priority.

Camera quality at this segment has improved significantly. Most phones now ship with 50MP main sensors, though sensor size and aperture vary considerably. The Redmi 13 5G and Samsung Galaxy M15 5G both produce acceptable daylight shots but lose detail in low light. If you shoot frequently after dark, spend an extra thousand rupees and move up to the Realme Narzo 70 Pro or Poco X6 Neo, which offer better night mode algorithms and OIS.

Battery life is a strength across this entire price tier. Expect 5000mAh as the baseline, with most phones offering 33W charging as standard. The Poco M6 Pro and Realme Narzo 60x both hit full charge in under seventy minutes. Some models from iQOO and OnePlus in this range ship with 44W or higher, which becomes meaningful if you use your phone intensively throughout the day.

Display quality separates mid-range from budget purchases at this segment. AMOLED panels with 90Hz refresh are available from Realme and Poco, while Samsung and Motorola options in this range still ship with IPS LCD. For media consumption and gaming, AMOLED is the better choice. For outdoor use in bright sunlight, look specifically for peak brightness above 600 nits.

Software longevity is a newer consideration worth adding to your checklist. Samsung has committed to four years of OS updates on select M-series models. Motorola promises three years on its Edge Lite range. Realme and Poco still offer two years as standard. If you plan to keep the phone for three or more years, Samsung or Motorola give you better long-term security patch coverage.

The final buying filter is build quality. At this price, most frames are polycarbonate, which is acceptable. However, Gorilla Glass 5 protection on the front panel meaningfully reduces screen damage from drops. The Poco M6 Pro and Realme Narzo 60x both include it; check the spec sheet for any model you are considering before finalising.

For most buyers in India in 2026, the Poco M6 Pro 5G at around thirteen thousand and the Realme Narzo 60x 5G at twelve thousand represent the best value in the segment. Both deliver 5G, AMOLED displays and fast charging with no meaningful compromise. Use the camera and software longevity criteria above to choose between them based on your own priorities.`,
  },
  {
    slug: 'top-10-boat-headphones-india',
    title: 'Top 10 boAt Headphones and Earbuds in India',
    excerpt:
      'boAt dominates the affordable audio market in India. This guide covers the top ten models across earbuds, on-ear and neckband categories with clear recommendations for each use case.',
    category: 'Audio',
    readTime: '6 min read',
    date: '2026-04-22',
    imageId: '1505740420928-5e560c06d30e',
    author: 'CloudBasket Team',
    content: `boAt has built the largest share of the affordable audio market in India by consistently shipping products that work reliably at prices most competitors cannot match. Their catalogue now spans over a hundred SKUs, which makes picking the right model genuinely confusing. These ten models represent the best from each product line based on current pricing, feature-to-cost ratio and real-world review data.

The Airdopes 141 is the most popular TWS from boAt for a reason. At under eight hundred rupees, it delivers 42 hours of total playback through BEAST mode, Bluetooth 5.1 and IPX4 splash resistance. Sound is bass-heavy, which suits Indian listening preferences. Call quality is acceptable for daily use. If you are buying your first pair of wireless earbuds, start here.

The Airdopes 311 Pro improves on the 141 with active noise cancellation. At around fourteen hundred rupees, it adds environmental noise reduction that genuinely helps during commutes and in open offices. The seal fit is tighter than the 141, which also contributes to passive isolation. Battery takes a small hit versus the 141, settling at around 35 hours total.

For neckband users, the Rockerz 255 Pro Plus is the default recommendation. Magnetic earpieces with auto-play, Bluetooth 5.0, IPX7 waterproofing and 60 hours of playback make it the most capable neckband at under twelve hundred rupees. The cable is tangle-resistant and the fit is comfortable for gym sessions. This is also one of the few boAt products with genuine high-resistance water protection.

The Rockerz 450 is the go-to on-ear headphone. Forty-millimetre drivers with boAt signature bass, fifteen hours of playback and a foldable design suit commuters and students. The earcups are soft and do not cause discomfort over two-to-three hour listening sessions. At around thirteen hundred rupees, it competes directly with similar offerings from JBL and Sony but undercuts them significantly.

For over-ear isolation, the Rockerz 550 adds ANC and extends to fifteen hours with cancellation active. It costs slightly more but the passive isolation from the larger earcup design is noticeable even with ANC off. The Micro-USB charging is a legacy choice that will frustrate users expecting USB-C, but performance at the price justifies the trade-off for most buyers.

The Airdopes 181 is worth considering for sport and running use. Hook-and-fin design, IPX4, 30 hours total and BEAST mode gaming latency mode make it the best boAt option if exercise is your primary use. It sits around eleven hundred rupees and holds position reliably during high-intensity activity.

The Bassheads 100 wired earphone remains relevant at under four hundred rupees. It uses a dynamic 10mm driver, includes an in-line mic, and works with any device that has a 3.5mm jack. Build quality is modest but functional. For students, office workers and anyone who prefers wired audio without spending on Bluetooth, this is the most dependable budget choice.

The Airdopes 800 is boAt's current flagship TWS with 35dB hybrid ANC, LHDC codec support and 35 hours total battery. It targets buyers stepping up from entry-level earbuds and delivers noticeably cleaner audio and better call isolation than models below it. At around three thousand five hundred rupees, it faces stronger competition from JBL and Sony, but holds its own on bass response.

The Wave Flex Earbuds offer a semi-in-ear design for users who find standard earbuds uncomfortable. IPX5, 30 hours total and dual device pairing make it practical. The open-ear fit reduces isolation but also reduces ear fatigue over long sessions, making it the recommended choice for extended work-from-home use where awareness of surroundings matters.

The Stone Spinx 2.0 portable speaker rounds out this list as a speaker option rather than headphone. Ten-watt output, IPX5, ten-hour playtime and True Wireless Stereo pairing with a second Spinx unit make it the most capable boAt speaker under two thousand rupees. For small rooms and outdoor use, it punches above its price category on volume and clarity.`,
  },
  {
    slug: 'amazon-vs-flipkart-which-is-better',
    title: 'Amazon vs Flipkart: Which Platform Is Better for Indian Shoppers?',
    excerpt:
      'Amazon and Flipkart both offer competitive prices, but each platform wins in different categories. This breakdown helps you decide where to buy based on what you are shopping for.',
    category: 'Guides',
    readTime: '8 min read',
    date: '2026-04-22',
    imageId: '1563013544-824ae1b704d3',
    author: 'CloudBasket Team',
    content: `Amazon and Flipkart have competed for Indian shoppers since before either platform reached its current scale. Both have built logistics networks that cover most of India, both run identical-looking sale events, and both have introduced subscription programs with shipping and streaming benefits. Despite this surface similarity, there are consistent patterns in pricing, category strength, return experience and seller quality that should influence where you buy depending on what you need.

Category strength is the clearest differentiator. Flipkart has traditionally dominated electronics, particularly smartphones. Most exclusive launches from Realme, Poco, iQOO and Motorola happen on Flipkart first, often with platform-specific pricing. Amazon tends to recoup those same models within weeks, but the first-run pricing advantage on launch day usually sits with Flipkart. If you are buying a phone within the first thirty days of its release, check Flipkart first.

Amazon is stronger in books, imported electronics, home and kitchen, and international brands that maintain an official storefront. Products from brands like Anker, Bosch, Philips and 3M tend to be more reliably sourced on Amazon, with verified seller listings and stronger authenticity guarantees. For anything where counterfeits are a concern, Amazon's brand registry and fulfilled-by-Amazon classification offer better protection.

Pricing patterns differ meaningfully around sale events. Flipkart's Big Billion Days and Amazon's Great Indian Festival overlap in October and both deliver genuine discounts, but category-level pricing can vary by 5 to 15 percent between platforms on the same day. Neither platform is consistently cheaper across all categories. The reliable approach is to check both before purchasing, or use a price comparison tool to surface the actual lower price at checkout.

Return policy is a factor that matters most when something goes wrong. Both platforms offer ten-day return windows on most products. Amazon's return process is slightly more standardised — initiation through the website, courier pickup in most cities, and refunds within five to seven days. Flipkart has improved but customer experience with returns is more variable, particularly with third-party sellers. For high-value purchases where a smooth return matters, Amazon's consistency is an advantage.

Seller quality varies on both platforms, but Flipkart has a higher proportion of marketplace sellers versus Amazon-fulfilled inventory in certain categories. When buying on either platform, filtering to sold and shipped by Amazon or Flipkart Assured reduces the risk of delayed delivery or quality mismatch. Avoid third-party sellers without ratings above 4.0 and fewer than five hundred reviews regardless of which platform you are using.

Delivery speed in Tier 1 cities is comparable for Prime and Flipkart Plus subscribers, with same-day and next-day options available for many products. In Tier 2 and Tier 3 cities, Amazon has marginally better delivery coverage, though Flipkart has been closing this gap through its Jeeves and Ekart logistics investments.

Payment offers differ month to month. Amazon maintains partnerships with ICICI, SBI and Axis banks for recurring card discounts. Flipkart runs rotating offers with Axis, Kotak and HDFC. Neither bank discount list is static — checking current offers on both platforms before any purchase above three thousand rupees can reveal savings of five to ten percent through card stacking alone.

The practical recommendation is to avoid platform loyalty for everyday purchases. Use whichever platform has the lower final price after shipping, cashback and bank discounts are calculated. For smartphones and televisions, check Flipkart first. For books, international brands and anything fulfilled-by-seller where authenticity matters, Amazon is the safer default.`,
  },
  {
    slug: 'how-to-get-best-deals-online-india',
    title: 'How to Get the Best Deals Online in India: A Practical Guide',
    excerpt:
      'Getting a genuinely good deal online takes more than waiting for a sale. These repeatable tactics cover timing, bank offers, coupon stacking and price tracking to help you buy at the lowest possible price.',
    category: 'Deals',
    readTime: '6 min read',
    date: '2026-04-22',
    imageId: '1556742049-0cfed4f6a45d',
    author: 'CloudBasket Team',
    content: `The best online deal is not the one with the biggest discount banner — it is the one where the final amount you pay is the lowest you could have achieved for the exact product you need. Getting there requires combining timing, bank offers, coupons and price awareness into a consistent process. Most shoppers who overpay are not making bad decisions — they are skipping steps that take less than five minutes to complete.

Price history is the foundation. Before buying anything above two thousand rupees, check the historical price of that product. Many heavily advertised discounts use inflated reference prices. A product shown at forty percent off may have sold at the discounted price for months. Price trackers that log historical data help you separate real discounts from manufactured urgency. If the product has been at the sale price for more than two weeks, the discount is effectively the normal price.

Timing purchases around pay cycles and platform events improves outcomes. The first week of each month sees card offer resets and new cashback deals. Late March activates year-end offers. October brings the two largest competing sale events from Amazon and Flipkart. If your purchase is not urgent, holding it for one of these windows regularly produces five to fifteen percent savings over buying on a random weekday.

Bank card offers are the most underused saving method for regular shoppers. Amazon, Flipkart, Myntra and most other platforms run rotating instant discounts tied to specific debit and credit cards. These discounts activate at checkout without any coupon code. Checking the offers section on your bank app or the platform's bank offers page before any significant purchase takes two minutes and can reduce the price by ten percent immediately. Cards from HDFC, Axis, SBI and ICICI participate most frequently.

Coupon stacking works when a platform coupon combines with a bank offer. Not all platforms allow this, and the combination eligibility changes during sales. The general rule is: apply any available product coupon first, verify the final discounted price, then confirm whether the bank offer stacks on top of that reduced amount or only applies to the original price. Reading the offer terms before checkout prevents the frustration of discovering the stack was not permitted after payment.

Exchange offers add meaningful value on smartphones and appliances. Most platforms give exchange discounts ranging from one thousand to five thousand rupees for trading in an old device. The functional condition requirements are less strict than many buyers assume — a phone with minor cosmetic damage but functional touch and display usually qualifies. Factor in the exchange value when comparing prices across platforms because a one-thousand-rupee exchange difference changes which platform is actually cheaper.

Wishlist tracking and price alerts reduce the mental load of monitoring products. Add items you intend to buy to your cart or wishlist rather than bookmarking them. Most platforms will notify you when the price drops. CloudBasket and similar comparison tools offer alert features that notify you when any tracked product crosses your target price across multiple platforms simultaneously.

EMI without cost is worth evaluating for purchases above ten thousand rupees. Many bank cards offer zero-cost EMI on three-month tenures for electronics and appliances. The processing fee, if any, is usually two to three hundred rupees — less than the interest you would otherwise pay on a credit purchase. This does not reduce the price, but it makes larger purchases manageable without carrying a balance.

The simplest summary of online deal discipline: check price history, verify the final cart amount including shipping after bank offers and coupons, compare across two platforms, and buy only when the number clears your pre-set target. Five minutes of verification before checkout is the highest-return habit a regular online shopper can build.`,
  },
  {
    slug: 'best-laptops-for-students-india-2026',
    title: 'Best Laptops for Students in India 2026',
    excerpt:
      'Students in India need laptops that handle coursework, last a full day on battery and stay within budget. These picks across three price ranges cover most academic needs without overspending.',
    category: 'Laptops',
    readTime: '8 min read',
    date: '2026-04-22',
    imageId: '1593642632315-76516e65b23f',
    author: 'CloudBasket Team',
    content: `Choosing a student laptop in India in 2026 comes down to matching the machine to the actual workload rather than buying the most powerful option in budget. A commerce student who writes documents and uses spreadsheets has different needs from an engineering student running simulation software or a design student exporting video. The recommendations below are organised by use type, not just price, to make that match easier.

For general coursework — notes, documents, presentations, web browsing and video calls — an Intel Core i3 or AMD Ryzen 3 with 8GB RAM and a 256GB SSD is sufficient. The Acer Aspire 3 with Core i3 and the Lenovo IdeaPad 1 with Ryzen 3 are the two most recommended options in this category, both sitting between twenty-eight thousand and thirty-five thousand rupees. Both run Office, Chrome with ten open tabs and Teams calls without perceptible lag. The 256GB storage is tight, but pairing with a one-terabyte external drive or using Google Drive resolves this.

Engineering and computer science students typically need more processing headroom for IDEs, compilers, virtual machines and data analysis tools. A Core i5 or Ryzen 5 with 16GB RAM and a 512GB SSD is the minimum sensible configuration. The Lenovo IdeaPad Slim 3 with Core i5 and the HP Laptop 15 with Core i5 cover this need between forty-five thousand and fifty thousand rupees. Both handle Python, Java development environments and basic machine learning notebooks without issue. For students who plan to run multiple Docker containers or heavy virtual machines, upgrading to a Ryzen 5 model with expandable RAM slots is worth the extra five thousand.

Design and media students face the most demanding requirements because Adobe and DaVinci Resolve are resource-intensive and benefit from dedicated GPU acceleration. At a minimum, look for an NVIDIA GTX 1650 or equivalent paired with a Ryzen 5 or Core i5. The HP Victus 15 and the Asus VivoBook 15 OLED both meet this bar. The Victus focuses on cooling and GPU performance while the VivoBook OLED prioritises display accuracy — relevant if colour grading is part of the workload. Both sit between fifty-five thousand and sixty-five thousand rupees.

Battery life is the most commonly underestimated purchase criterion. A laptop that runs for four hours on a charge is functionally a tethered device for students who move between classes, libraries and study groups. Target at least seven hours of real-world battery under moderate use. Manufacturer claims frequently reflect light workloads. For realistic estimates, look at independent battery tests rather than spec sheet numbers. Lenovo IdeaPad and HP Laptop 15 series consistently deliver seven to nine hours; gaming variants like the Nitro 5 and TUF A15 drop to four to five hours under load.

Display quality matters for students who spend six or more hours daily at the screen. A minimum of 250 nits brightness is needed for comfortable library use. 300 nits is better. Anti-glare coating is more practical than glossy panels for varied lighting conditions. The Asus VivoBook 15 OLED at around fifty-three thousand has the best display panel in the mid-range student segment, with accurate colours and comfortable contrast for text reading.

Weight becomes meaningful for students who carry their laptop in a backpack between multiple locations daily. Laptops above 2.2 kg cause noticeable fatigue over a semester. The Lenovo IdeaPad Slim 3 at 1.6 kg and the HP Laptop 15 at 1.75 kg are the lightest options in the performance segment. Gaming laptops in this range almost universally exceed 2.2 kg due to larger chassis and cooling systems — factor this into the decision if portability is a daily priority.

Warranty coverage is the final filter. Most student laptops include one year of onsite warranty. Some brands offer extended coverage or accidental damage protection as an add-on. For a device that will last three to four years of academic use, spending an additional two to three thousand rupees on an extended warranty or accidental cover is a reasonable hedge against the cost of a mid-cycle repair.

The single best value recommendation for most Indian students in 2026 is the Lenovo IdeaPad Slim 3 with Core i5 and 16GB RAM. It balances performance, portability, battery life and brand reliability at a price most student budgets can accommodate, and the 13th Gen Core i5 processor gives it enough headroom to remain useful through an entire undergraduate or postgraduate programme.`,
  },
]

export const BLOG_POSTS: BlogPost[] = [
  ...BASE_BLOG_POSTS,
  ...REQUIRED_BLOG_POSTS.filter(
    (requiredPost) => !BASE_BLOG_POSTS.some((post) => post.slug === requiredPost.slug),
  ),
  ...ACTION_14_BLOG_POSTS.filter(
    (post) =>
      !BASE_BLOG_POSTS.some((p) => p.slug === post.slug) &&
      !REQUIRED_BLOG_POSTS.some((p) => p.slug === post.slug),
  ),
]
