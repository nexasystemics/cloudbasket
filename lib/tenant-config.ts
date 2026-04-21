export interface Tenant {
  name: string
  domain: string
  theme: string
}

export const tenants: Record<string, Tenant> = {
  cloudbasket: {
    name: 'CloudBasket',
    domain: 'cloudbasket.co',
    theme: '#039BE5'
  },
  infotyx: {
    name: 'Infotyx',
    domain: 'infotyx.in',
    theme: '#8B5CF6'
  },
  myhomefinder: {
    name: 'MyHomeFinder',
    domain: 'myhomefinder.in',
    theme: '#10B981'
  },
  infotyxco: {
    name: 'Infotyx Corporate',
    domain: 'infotyx.co',
    theme: '#6D28D9'
  },
  skybluecloud: {
    name: 'SkyBlueCloud',
    domain: 'skybluecloud.tech',
    theme: '#0EA5E9'
  },
  eseva: {
    name: 'eSevaPragatiMitra',
    domain: 'esevapragatimitra.in',
    theme: '#DC2626'
  },
  esevai: {
    name: 'eSevaPragatiMitra India',
    domain: 'esevapragatimitra.com',
    theme: '#B45309'
  },
  nexqon: {
    name: 'NEXQON',
    domain: 'nexqon.in',
    theme: '#1B3A5C'
  },
  nexqonorg: {
    name: 'NEXQON Organization',
    domain: 'nexqon.org',
    theme: '#374151'
  }
}

export function getTenantFromHeaders(headersList: Headers): Tenant {
  const host = headersList.get('host') || ''
  
  // Extract subdomain or domain
  const parts = host.split('.')
  
  // Map hostnames to tenant keys
  if (host.includes('cloudbasket')) return tenants.cloudbasket
  if (host.includes('infotyx.in')) return tenants.infotyx
  if (host.includes('infotyx.co')) return tenants.infotyxco
  if (host.includes('myhomefinder')) return tenants.myhomefinder
  if (host.includes('skybluecloud')) return tenants.skybluecloud
  if (host.includes('esevapragatimitra.in')) return tenants.eseva
  if (host.includes('esevapragatimitra.com')) return tenants.esevai
  if (host.includes('nexqon.in')) return tenants.nexqon
  if (host.includes('nexqon.org')) return tenants.nexqonorg
  
  // Default to cloudbasket for localhost or unknown domains
  return tenants.cloudbasket
}

export function getTenantByName(name: string): Tenant {
  return tenants[name] || tenants.cloudbasket
}
