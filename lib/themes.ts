export type TenantTheme = {
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  logo: string
  favicon: string
  tagline: string
  industry: string
  description: string
  domain: string
}

export const TENANT_THEMES: Record<string, TenantTheme> = {
  cloudbasket: {
    name: 'CloudBasket',
    primaryColor: '#039BE5',
    secondaryColor: '#0288D1',
    accentColor: '#F59E0B',
    logo: '/logos/cloudbasket.png',
    favicon: '/favicons/cloudbasket.ico',
    tagline: 'Design. Print. Earn.',
    industry: 'affiliate-pod',
    description: 'Shop smart. Earn more. Browse 1M+ products, compare prices and discover unique designs.',
    domain: 'cloudbasket.in',
  },
  infotyx: {
    name: 'INFOTYX',
    primaryColor: '#8B5CF6',
    secondaryColor: '#6D28D9',
    accentColor: '#EC4899',
    logo: '/logos/infotyx.png',
    favicon: '/favicons/infotyx.ico',
    tagline: 'Intelligence That Drives Decisions',
    industry: 'media-info',
    description: 'Deep insights, industry news and B2B intelligence across logistics, energy, real estate and technology.',
    domain: 'infotyx.in',
  },
  infotyxco: {
    name: 'INFOTYX Services',
    primaryColor: '#6D28D9',
    secondaryColor: '#4C1D95',
    accentColor: '#10B981',
    logo: '/logos/infotyxco.png',
    favicon: '/favicons/infotyxco.ico',
    tagline: 'From Intelligence to Execution',
    industry: 'tech-services',
    description: 'Custom software, ERP solutions, hardware procurement and global technology partnerships.',
    domain: 'infotyx.co',
  },
  myhomefinder: {
    name: 'MyHomeFinder',
    primaryColor: '#1565C0',   // R8 Role 01 — Navy Blue     (was #10B981)
    secondaryColor: '#039BE5', // R8 Role 03 — Sky Blue      (was #059669)
    accentColor: '#E65100',    // R8 Role 02 — Orange CTA    (was #F59E0B)
    logo: '/logos/myhomefinder.png',
    favicon: '/favicons/myhomefinder.ico',
    tagline: 'Find Your Perfect Home',
    industry: 'realestate',
    description: 'RERA-verified property listings. Connect with top developers. Get best home loan rates.',
    domain: 'myhomefinder.in',
  },
  skybluecloud: {
    name: 'SkyBlueCloud',
    primaryColor: '#0EA5E9',
    secondaryColor: '#0284C7',
    accentColor: '#8B5CF6',
    logo: '/logos/skybluecloud.png',
    favicon: '/favicons/skybluecloud.ico',
    tagline: 'Your Cloud. Your Choice.',
    industry: 'tech-affiliate',
    description: 'Compare cloud software, SaaS tools and enterprise technology. Find the best deals on global tech.',
    domain: 'skybluecloud.tech',
  },
  eseva: {
    name: 'eSevaPragatiMitra',
    primaryColor: '#DC2626',
    secondaryColor: '#B91C1C',
    accentColor: '#F59E0B',
    logo: '/logos/eseva.png',
    favicon: '/favicons/eseva.ico',
    tagline: 'Har Kaam. Har Baar. Aasaan.',
    industry: 'govt-services',
    description: 'GST filing, PAN, Aadhar, Income Tax, Trademark, IEC, travel bookings and all government services.',
    domain: 'esevapragatimitra.in',
  },
  esevai: {
    name: 'eSeva Info Hub',
    primaryColor: '#B45309',
    secondaryColor: '#92400E',
    accentColor: '#DC2626',
    logo: '/logos/esevai.png',
    favicon: '/favicons/esevai.ico',
    tagline: 'Samajho. Seekho. Karo.',
    industry: 'govt-info',
    description: 'Free guides on GST rules, Income Tax, PAN process, customs, IEC registration and all compliance.',
    domain: 'esevapragatimitra.com',
  },
  nexqon: {
    name: 'NEXQON',
    primaryColor: '#1B3A5C',
    secondaryColor: '#0F2542',
    accentColor: '#F59E0B',
    logo: '/logos/nexqon.png',
    favicon: '/favicons/nexqon.ico',
    tagline: 'Building India\'s Digital Future',
    industry: 'holding',
    description: 'NEXQON Holdings — master holding company for India\'s fastest growing digital brand portfolio.',
    domain: 'nexqon.in',
  },
  nexqonorg: {
    name: 'NEXQON Intelligence',
    primaryColor: '#374151',
    secondaryColor: '#1F2937',
    accentColor: '#3B82F6',
    logo: '/logos/nexqonorg.png',
    favicon: '/favicons/nexqonorg.ico',
    tagline: 'The Intelligence Behind the Empire',
    industry: 'info-platform',
    description: 'NEXQON group insights, brand updates and industry intelligence across all sectors.',
    domain: 'nexqon.org',
  },
}

export function getTheme(tenant: string): TenantTheme {
  return TENANT_THEMES[tenant] ?? TENANT_THEMES['cloudbasket']
}