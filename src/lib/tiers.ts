import { RANK_STEP } from '../data/catalog'

export type TierId = 'bronze' | 'silver' | 'gold' | 'diamond'

export type Tier = {
  id: TierId
  label: string
  minBottles: number
  next: number | null
}

export const tiers: Tier[] = [
  { id: 'bronze', label: 'Bronze', minBottles: 0, next: 15 },
  { id: 'silver', label: 'Silver', minBottles: 15, next: 45 },
  { id: 'gold', label: 'Gold', minBottles: 45, next: 90 },
  { id: 'diamond', label: 'Diamond', minBottles: 90, next: null },
]

export function tierFor(bottles: number): Tier {
  return [...tiers].reverse().find((tier) => bottles >= tier.minBottles) ?? tiers[0]
}

export function rankBand(bottles: number) {
  const remainder = bottles % RANK_STEP
  const untilNext = remainder === 0 ? RANK_STEP : RANK_STEP - remainder
  return {
    level: Math.floor(bottles / RANK_STEP) + 1,
    label: `Collector ${Math.floor(bottles / RANK_STEP) + 1}`,
    untilNext,
    step: RANK_STEP,
  }
}
