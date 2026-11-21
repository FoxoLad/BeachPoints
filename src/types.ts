export type Tab = 'home' | 'history' | 'recycle' | 'rewards' | 'rank'

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
}

export type CollectionEvent = {
  id: string
  at: string
  quantity: number
  points: number
  location: string
  material: string
}

export type Redemption = {
  id: string
  at: string
  rewardId: string
  name: string
  points: number
}

export type AppNotice = {
  id: string
  at: string
  title: string
  body: string
  read: boolean
}

export type Reward = {
  id: string
  name: string
  points: number
  blurb: string
  emoji: string
}

export type Partner = {
  id: string
  name: string
  tag: string
}

export type UserRecord = {
  collections: CollectionEvent[]
  redemptions: Redemption[]
  notices: AppNotice[]
}

export type LeaderboardRow = {
  id: string
  name: string
  bottles: number
  points: number
  isYou: boolean
}

// ----------------------------------------------------
// BeachPoints Refined Interactive Types
// ----------------------------------------------------

export type RankTier = 'Bronce' | 'Plata' | 'Oro' | 'Diamante' | 'Legendario'

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
  points: number
  totalWasteCollected: number
  totalKg: number
  activeDays: number
  tier: RankTier
  passwordHash?: string
  passwordSalt?: string
  password?: string
}

export interface RegisteredAccount extends UserProfile {
  passwordHash?: string
  passwordSalt?: string
  password?: string
}

export type AuthScreen = 'login' | 'create_account' | 'forgot_password'

export type MovementType = 'deposito' | 'canje'

export interface MovementRecord {
  id: string
  type: MovementType
  title: string
  subtitle: string
  points: number
  date: string
}

export interface WasteRecord {
  id: string
  date: string
  type: string
  quantity: number
  pointsEarned: number
}

export interface StoreItem {
  id: string
  name: string
  cost: number
  description: string
  icon: string
  discount?: string
  logoColor?: string
  logoBg?: string
}

export type ExchangeCategory = 'cupones' | 'productos'

export interface CouponReward {
  id: string
  storeName: 'OXXO' | 'GO MART' | 'SIX' | 'NATURA'
  discount: string
  points: number
  description: string
  validity: string
  barcode: string
}

export interface EcoProductReward {
  id: string
  name: string
  points: number
  description: string
  imageKey: 'thermo' | 'cap' | 'tote' | 'snack'
  specs: string
}

export interface ActiveVoucher {
  code: string
  title: string
  discountOrReward: string
  pointsSpent: number
  date: string
  barcode: string
}
