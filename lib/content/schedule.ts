// lib/content/schedule.ts
// Blog post scheduling logic for CloudBasket content pipeline.
// No external dependencies — stub-safe.

export interface ScheduleSlot {
  id: string
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0 = Sunday
  hour: number   // 0-23 IST
  minute: number // 0-59
  category: string
  topic: string
  keywords: string[]
  active: boolean
}

export interface ScheduledPost {
  slotId: string
  scheduledFor: string // ISO date string
  topic: string
  category: string
  keywords: string[]
}

// Default weekly content schedule for CloudBasket
export const DEFAULT_SCHEDULE: ScheduleSlot[] = [
  {
    id: 'slot-mon-deals',
    dayOfWeek: 1,
    hour: 9,
    minute: 0,
    category: 'deals',
    topic: 'Best Monday Deals in India',
    keywords: ['monday deals', 'india offers', 'price drop'],
    active: true,
  },
  {
    id: 'slot-wed-electronics',
    dayOfWeek: 3,
    hour: 10,
    minute: 0,
    category: 'electronics',
    topic: 'Top Electronics Deals This Week',
    keywords: ['electronics', 'smartphones', 'laptops', 'india'],
    active: true,
  },
  {
    id: 'slot-fri-fashion',
    dayOfWeek: 5,
    hour: 11,
    minute: 0,
    category: 'fashion',
    topic: 'Weekend Fashion Sale Picks',
    keywords: ['fashion', 'clothing', 'sale', 'india brands'],
    active: true,
  },
  {
    id: 'slot-sat-home',
    dayOfWeek: 6,
    hour: 9,
    minute: 30,
    category: 'home-appliances',
    topic: 'Home Appliance Deals This Weekend',
    keywords: ['home appliances', 'kitchen', 'weekend sale'],
    active: true,
  },
]

// Get next scheduled date for a given slot
export function getNextScheduledDate(slot: ScheduleSlot): Date {
  const now = new Date()
  const result = new Date()

  result.setHours(slot.hour, slot.minute, 0, 0)

  const currentDay = now.getDay()
  let daysUntil = slot.dayOfWeek - currentDay

  if (daysUntil < 0 || (daysUntil === 0 && now >= result)) {
    daysUntil += 7
  }

  result.setDate(result.getDate() + daysUntil)
  return result
}

// Get all upcoming scheduled posts for the next N days
export function getUpcomingPosts(
  schedule: ScheduleSlot[] = DEFAULT_SCHEDULE,
  days: number = 7
): ScheduledPost[] {
  const now = new Date()
  const cutoff = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

  return schedule
    .filter((slot) => slot.active)
    .map((slot) => {
      const scheduledFor = getNextScheduledDate(slot)
      return {
        slotId: slot.id,
        scheduledFor: scheduledFor.toISOString(),
        topic: slot.topic,
        category: slot.category,
        keywords: slot.keywords,
      }
    })
    .filter((post) => new Date(post.scheduledFor) <= cutoff)
    .sort(
      (a, b) =>
        new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
    )
}

// Format scheduled date for display (IST)
export function formatScheduledDate(isoDate: string): string {
  return new Date(isoDate).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

// Check if a slot is due to run (within 5 minute window)
export function isSlotDue(slot: ScheduleSlot): boolean {
  const now = new Date()
  const currentDay = now.getDay()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  return (
    slot.active &&
    slot.dayOfWeek === currentDay &&
    slot.hour === currentHour &&
    Math.abs(slot.minute - currentMinute) <= 5
  )
}

// Get all slots due right now
export function getDueSlots(
  schedule: ScheduleSlot[] = DEFAULT_SCHEDULE
): ScheduleSlot[] {
  return schedule.filter(isSlotDue)
}
