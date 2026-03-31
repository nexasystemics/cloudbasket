// E21: Automated POD Seasonal Campaign Manager
import { env, isConfigured } from '@/lib/env'

export type Season = 'diwali' | 'christmas' | 'holi' | 'ipl' | 'eid' | 'new-year' | 'valentines' | 'independence-day'
export type CampaignAsset = { designTheme: string; colorPalette: string[]; suggestedProducts: string[]; keywords: string[]; discountPercent: number; startDate: string; endDate: string }

const CAMPAIGN_CALENDAR: Record<Season, CampaignAsset> = {
  diwali: { designTheme: 'Diya lamps, rangoli patterns, golden motifs, fireworks', colorPalette: ['#FFD700', '#FF6B00', '#8B0000', '#2C1810'], suggestedProducts: ['tshirt', 'mug', 'tote-bag', 'poster'], keywords: ['diwali gift', 'festive special', 'rangoli design', 'diwali collection'], discountPercent: 20, startDate: 'Oct-15', endDate: 'Nov-15' },
  christmas: { designTheme: 'Santa, snowflakes, Christmas tree, reindeer, gifts', colorPalette: ['#CC0000', '#006400', '#FFD700', '#FFFFFF'], suggestedProducts: ['tshirt', 'mug', 'hoodie', 'phone-case'], keywords: ['christmas gift', 'xmas special', 'holiday collection', 'christmas tshirt'], discountPercent: 25, startDate: 'Dec-01', endDate: 'Dec-31' },
  holi: { designTheme: 'Color splashes, water guns, festival joy, abstract color explosion', colorPalette: ['#FF69B4', '#FF4500', '#32CD32', '#1E90FF', '#FFD700'], suggestedProducts: ['tshirt', 'tote-bag', 'poster'], keywords: ['holi special', 'festival of colors', 'holi tshirt', 'color festival'], discountPercent: 15, startDate: 'Feb-20', endDate: 'Mar-20' },
  ipl: { designTheme: 'Cricket bat, stumps, stadium, jersey numbers, cricket ball', colorPalette: ['#003087', '#FFD700', '#0077C0', '#FF6B00'], suggestedProducts: ['tshirt', 'mug', 'hoodie', 'phone-case'], keywords: ['ipl 2025', 'cricket fan', 'team jersey', 'cricket special'], discountPercent: 15, startDate: 'Mar-20', endDate: 'May-30' },
  eid: { designTheme: 'Crescent moon, star, lanterns, mosque silhouette, geometric islamic patterns', colorPalette: ['#006400', '#FFD700', '#FFFFFF', '#C0C0C0'], suggestedProducts: ['tshirt', 'mug', 'tote-bag'], keywords: ['eid gift', 'eid mubarak', 'eid collection', 'ramadan special'], discountPercent: 15, startDate: 'Mar-20', endDate: 'Apr-15' },
  'new-year': { designTheme: 'Fireworks, champagne, 2025 typography, clock striking midnight', colorPalette: ['#FFD700', '#C0C0C0', '#000080', '#FF4500'], suggestedProducts: ['tshirt', 'mug', 'poster', 'phone-case'], keywords: ['new year gift', '2025 collection', 'new year special'], discountPercent: 20, startDate: 'Dec-25', endDate: 'Jan-10' },
  valentines: { designTheme: 'Hearts, roses, love quotes, couple silhouettes, romantic typography', colorPalette: ['#FF1493', '#FF69B4', '#DC143C', '#FFB6C1'], suggestedProducts: ['mug', 'tshirt', 'phone-case', 'tote-bag'], keywords: ['valentines gift', 'love gift', 'couple gift', 'valentines day'], discountPercent: 15, startDate: 'Feb-01', endDate: 'Feb-14' },
  'independence-day': { designTheme: 'Tricolor flag, Ashoka chakra, India map, patriotic typography', colorPalette: ['#FF9933', '#FFFFFF', '#138808', '#000080'], suggestedProducts: ['tshirt', 'mug', 'tote-bag', 'poster'], keywords: ['independence day', 'patriotic tshirt', 'india pride', '15 august'], discountPercent: 15, startDate: 'Aug-01', endDate: 'Aug-20' },
}

export function getCurrentSeasonCampaigns(): { season: Season; campaign: CampaignAsset }[] {
  const now = new Date()
  const month = now.getMonth() + 1
  const active: { season: Season; campaign: CampaignAsset }[] = []
  if (month >= 10 && month <= 11) active.push({ season: 'diwali', campaign: CAMPAIGN_CALENDAR.diwali })
  if (month === 12 || month === 1) active.push({ season: 'christmas', campaign: CAMPAIGN_CALENDAR.christmas })
  if (month >= 2 && month <= 3) active.push({ season: 'holi', campaign: CAMPAIGN_CALENDAR.holi })
  if (month >= 3 && month <= 5) active.push({ season: 'ipl', campaign: CAMPAIGN_CALENDAR.ipl })
  if (month >= 2 && month <= 4) active.push({ season: 'eid', campaign: CAMPAIGN_CALENDAR.eid })
  if (month === 2) active.push({ season: 'valentines', campaign: CAMPAIGN_CALENDAR.valentines })
  if (month === 8) active.push({ season: 'independence-day', campaign: CAMPAIGN_CALENDAR['independence-day'] })
  return active.length > 0 ? active : [{ season: 'new-year', campaign: CAMPAIGN_CALENDAR['new-year'] }]
}

export async function generateSeasonalDesignPrompt(season: Season): Promise<string> {
  const campaign = CAMPAIGN_CALENDAR[season]
  if (!isConfigured('GEMINI_API_KEY')) {
    return `Create a ${season} themed design: ${campaign.designTheme}. Use colors: ${campaign.colorPalette.join(', ')}. Suitable for: ${campaign.suggestedProducts.join(', ')}.`
  }
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `Generate a detailed AI image prompt for a ${season} POD design. Theme: ${campaign.designTheme}. Colors: ${campaign.colorPalette.join(', ')}. Make it print-ready, centered, transparent background. Max 200 chars.` }] }] })
    })
    const json = await r.json()
    return json?.candidates?.[0]?.content?.parts?.[0]?.text || `${season} design: ${campaign.designTheme}`
  } catch { return `${season} design: ${campaign.designTheme}` }
}

export const seasonalCampaigns = { CAMPAIGN_CALENDAR, getCurrentSeasonCampaigns, generateSeasonalDesignPrompt }
