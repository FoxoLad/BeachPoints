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
