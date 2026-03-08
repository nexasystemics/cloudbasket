export type Season = 'summer' | 'monsoon' | 'winter' | 'spring'
export type FestivalSignal = string
export type LifeSituation = string

export interface CalendarContext {
  season: Season
  festivals: FestivalSignal[]
  lifeSituations: LifeSituation[]
  month: number
  urgency: 'high' | 'medium' | 'low'
}

export function getSeason(month: number): Season {
  if (month >= 3 && month <= 5) return 'summer'
  if (month >= 6 && month <= 9) return 'monsoon'
  if (month >= 10 || month <= 1) return 'winter'
  return 'spring'
}

const FESTIVAL_CALENDAR: Record<number, FestivalSignal[]> = {
  1: ['pongal', 'sankranti', 'republic_day', 'new_year'],
  2: ['valentines_day', 'exam_season'],
  3: ['holi', 'ugadi', 'exam_ends', 'summer_prep'],
  4: ['baisakhi', 'tamil_new_year', 'summer_vacation'],
  5: ['mothers_day', 'summer_peak', 'school_holiday'],
  6: ['fathers_day', 'school_opening', 'monsoon_prep'],
  7: ['monsoon_indoor', 'stay_home'],
  8: ['independence_day', 'raksha_bandhan', 'onam_prep'],
  9: ['ganesh_chaturthi', 'onam', 'teachers_day'],
  10: ['navratri', 'dussehra', 'festive_gifting', 'diwali_prep'],
  11: ['diwali', 'childrens_day', 'wedding_season', 'bhai_dooj'],
  12: ['christmas', 'new_year_prep', 'wedding_season', 'winter_peak'],
}

const SITUATION_CALENDAR: Record<number, LifeSituation[]> = {
  1: ['school_reopens', 'new_year_resolutions', 'fitness_goals'],
  2: ['exam_prep', 'gifting', 'study_supplies'],
  3: ['exam_season', 'festival_fashion', 'summer_wardrobe'],
  4: ['summer_vacation_prep', 'travel_planning', 'cooling_products'],
  5: ['summer_essentials', 'children_play', 'outdoor_activities'],
  6: ['school_supplies', 'monsoon_gear', 'new_academic_year'],
  7: ['home_comfort', 'indoor_entertainment', 'monsoon_fashion'],
  8: ['gifting_siblings', 'patriotic', 'back_to_college'],
  9: ['festive_prep', 'home_decoration', 'pooja_supplies'],
  10: ['festive_gifting', 'new_clothes', 'home_makeover'],
  11: ['wedding_shopping', 'winter_wardrobe', 'gifting_season'],
  12: ['winter_essentials', 'year_end_gifting', 'new_year_outfit'],
}

export function getCalendarContext(date: Date = new Date()): CalendarContext {
  const month = date.getMonth() + 1
  const season = getSeason(month)
  const festivals = FESTIVAL_CALENDAR[month] ?? []
  const lifeSituations = SITUATION_CALENDAR[month] ?? []
  const urgency = festivals.length >= 3 ? 'high' : festivals.length >= 1 ? 'medium' : 'low'
  return { season, festivals, lifeSituations, month, urgency }
}

export function getSeasonDisplayName(season: Season): string {
  const names: Record<Season, string> = {
    summer: '☀️ Summer',
    monsoon: '🌧️ Monsoon',
    winter: '❄️ Winter',
    spring: '🌸 Spring',
  }
  return names[season]
}

export function getNextFestivalBanner(month: number): { name: string; emoji: string; color: string } | null {
  const banners: Record<string, { name: string; emoji: string; color: string }> = {
    pongal: { name: 'Pongal Deals', emoji: '🌾', color: '#F5C842' },
    holi: { name: 'Holi Specials', emoji: '🎨', color: '#FF6B35' },
    ugadi: { name: 'Ugadi Offers', emoji: '🪔', color: '#10B981' },
    baisakhi: { name: 'Baisakhi Sale', emoji: '🌼', color: '#F5C842' },
    mothers_day: { name: "Mother's Day", emoji: '💐', color: '#EC4899' },
    fathers_day: { name: "Father's Day", emoji: '🧔', color: '#0277BD' },
    independence_day: { name: 'Independence Day', emoji: '🇮🇳', color: '#FF9933' },
    raksha_bandhan: { name: 'Raksha Bandhan', emoji: '🪢', color: '#FF6B35' },
    ganesh_chaturthi: { name: 'Ganesh Chaturthi', emoji: '🐘', color: '#F5C842' },
    navratri: { name: 'Navratri Offers', emoji: '🪔', color: '#FF0080' },
    dussehra: { name: 'Dussehra Sale', emoji: '🏹', color: '#FF6B35' },
    diwali: { name: 'Diwali Dhamaka', emoji: '🪔', color: '#F5C842' },
    christmas: { name: 'Christmas Sale', emoji: '🎄', color: '#10B981' },
  }
  const festivals = FESTIVAL_CALENDAR[month] ?? []
  for (const festival of festivals) {
    if (banners[festival]) return banners[festival]
  }
  return null
}
