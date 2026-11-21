import type { Partner, Reward } from '../types'

export const POINTS_PER_BOTTLE = 10
export const GRAMS_PER_BOTTLE = 25
export const RANK_STEP = 12

export const rewards: Reward[] = [
  {
    id: 'thermo',
    name: 'Reusable bottle',
    points: 6300,
    blurb: 'Keep drinks cold after a beach day.',
    emoji: '🍾',
  },
  {
    id: 'cap',
    name: 'Eco cap',
    points: 1600,
    blurb: 'Sun cover made with recycled fabric.',
    emoji: '🧢',
  },
  {
    id: 'tote',
    name: 'Canvas tote',
    points: 1200,
    blurb: 'Skip the plastic bag at partner shops.',
    emoji: '🛍️',
  },
  {
    id: 'snack',
    name: 'Healthy snack',
    points: 600,
    blurb: 'A same-day treat at the beach kiosk.',
    emoji: '🥜',
  },
]

export const partners: Partner[] = [
  { id: 'green', name: 'green', tag: 'Cafe' },
  { id: 'natura', name: 'NATURA', tag: 'Market' },
  { id: 'eco', name: 'eco care', tag: 'Wellness' },
  { id: 'bio', name: 'Bio Market', tag: 'Grocer' },
]

export const phrases = [
  'The shoreline looks better because you showed up.',
  'One more bottle is one less in the tide.',
  'Your streak is the kind of competition beaches love.',
  'Partner shops are waiting for your next redeem.',
  'Small drops. Real credit. Keep going.',
]

export const community = [
  { id: 'u-maya', name: 'Maya Chen', bottles: 41, points: 410 },
  { id: 'u-luis', name: 'Luis Ortega', bottles: 28, points: 280 },
  { id: 'u-sofia', name: 'Sofia Hale', bottles: 19, points: 190 },
  { id: 'u-jordan', name: 'Jordan Kim', bottles: 12, points: 120 },
  { id: 'u-priya', name: 'Priya Nair', bottles: 9, points: 90 },
]
