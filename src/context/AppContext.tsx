import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { community, GRAMS_PER_BOTTLE, phrases, POINTS_PER_BOTTLE } from '../data/catalog'
import {
  demoCodeFor,
  emptyRecord,
  loadRecord,
  loadSession,
  loadUsers,
  saveRecord,
  saveSession,
  saveUsers,
  uid,
} from '../lib/storage'
import { rankBand, tierFor } from '../lib/tiers'
import type { AppNotice, LeaderboardRow, Tab, User, UserRecord } from '../types'

type AuthPhase = 'email' | 'code' | 'name'

type AppState = {
  tab: Tab
  setTab: (tab: Tab) => void
  user: User | null
  record: UserRecord
  authPhase: AuthPhase
  pendingEmail: string
  demoCode: string | null
  authError: string
  noticeOpen: boolean
  setNoticeOpen: (open: boolean) => void
  requestCode: (email: string) => void
  verifyCode: (code: string) => void
  completeProfile: (firstName: string, lastName: string) => void
  loadDemo: () => void
  signOut: () => void
  deposit: (quantity: number) => void
  redeem: (rewardId: string, name: string, cost: number) => { ok: boolean; message: string }
  markNoticesRead: () => void
  points: number
  bottles: number
  kg: string
  activeDays: number
  qrPayload: string
}

const AppContext = createContext<AppState | null>(null)

function totals(record: UserRecord) {
  const bottles = record.collections.reduce((sum, event) => sum + event.quantity, 0)
  const earned = record.collections.reduce((sum, event) => sum + event.points, 0)
  const spent = record.redemptions.reduce((sum, event) => sum + event.points, 0)
  return { bottles, points: earned - spent, earned }
}

function notice(title: string, body: string): AppNotice {
  return { id: uid('n'), at: new Date().toISOString(), title, body, read: false }
}

function seedAlex(): { user: User; record: UserRecord } {
  const user: User = {
    id: 'demo-alex',
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@gmail.com',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  }
  const days = [6, 5, 4, 3, 2, 1, 0]
  const qty = [2, 3, 4, 3, 4, 3, 4]
  const collections = days.map((day, index) => ({
    id: `c-alex-${index}`,
    at: new Date(Date.now() - day * 86400000).toISOString(),
    quantity: qty[index],
    points: qty[index] * POINTS_PER_BOTTLE,
    location: 'Seaside bin · North pier',
    material: 'PET bottles',
  }))
  const record: UserRecord = {
    collections,
    redemptions: [],
    notices: [
      notice(
        'You have 230 points',
        'Keep making a difference — a canvas tote is 20 points away from your next goal.',
      ),
      notice('Streak bonus unlocked', 'Seven active days at the beach bin. Extra points drop on your next 12 bottles.'),
      notice('Partner perk', 'Bio Market is running a double-stamp weekend for Gold-bound collectors.'),
    ],
  }
  return { user, record }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => loadUsers())
  const [user, setUser] = useState<User | null>(() => {
    const session = loadSession()
    if (!session) return null
    return loadUsers().find((entry) => entry.id === session) ?? null
  })
  const [record, setRecord] = useState<UserRecord>(() => {
    const session = loadSession()
    return session ? loadRecord(session) : emptyRecord()
  })
  const [tab, setTab] = useState<Tab>('home')
  const [authPhase, setAuthPhase] = useState<AuthPhase>('email')
  const [pendingEmail, setPendingEmail] = useState('')
  const [demoCode, setDemoCode] = useState<string | null>(null)
  const [authError, setAuthError] = useState('')
  const [noticeOpen, setNoticeOpen] = useState(false)

  const persistUser = useCallback((next: User, nextRecord: UserRecord, allUsers: User[]) => {
    setUser(next)
    setRecord(nextRecord)
    setUsers(allUsers)
    saveUsers(allUsers)
    saveRecord(next.id, nextRecord)
    saveSession(next.id)
  }, [])

  const requestCode = useCallback((email: string) => {
    const trimmed = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setAuthError('Enter a valid email, such as a Gmail or Hotmail address.')
      return
    }
    setAuthError('')
    setPendingEmail(trimmed)
    setDemoCode(demoCodeFor(trimmed))
    setAuthPhase('code')
  }, [])

  const verifyCode = useCallback(
    (code: string) => {
      if (!pendingEmail || code.trim() !== demoCodeFor(pendingEmail)) {
        setAuthError('That code does not match. Check the demo inbox below.')
        return
      }
      setAuthError('')
      const existing = users.find((entry) => entry.email === pendingEmail)
      if (existing) {
        persistUser(existing, loadRecord(existing.id), users)
        setTab('home')
        return
      }
      setAuthPhase('name')
    },
    [pendingEmail, persistUser, users],
  )

  const completeProfile = useCallback(
    (firstName: string, lastName: string) => {
      const first = firstName.trim()
      const last = lastName.trim()
      if (first.length < 1 || last.length < 1) {
        setAuthError('First and last name are required so the bin can credit you.')
        return
      }
      const next: User = {
        id: uid('u'),
        firstName: first,
        lastName: last,
        email: pendingEmail,
        createdAt: new Date().toISOString(),
      }
      const welcome = emptyRecord()
      welcome.notices = [
        notice(
          'Welcome to BeachPoints',
          `${first}, scan your personal QR at the seaside bin to start earning.`,
        ),
      ]
      persistUser(next, welcome, [...users, next])
      setTab('home')
    },
    [pendingEmail, persistUser, users],
  )

  const loadDemo = useCallback(() => {
    const seeded = seedAlex()
    const without = users.filter((entry) => entry.id !== seeded.user.id)
    persistUser(seeded.user, seeded.record, [...without, seeded.user])
    setTab('home')
  }, [persistUser, users])

  const signOut = useCallback(() => {
    saveSession(null)
    setUser(null)
    setRecord(emptyRecord())
    setAuthPhase('email')
    setPendingEmail('')
    setDemoCode(null)
    setAuthError('')
    setNoticeOpen(false)
  }, [])

  const deposit = useCallback(
    (quantity: number) => {
      if (!user || quantity < 1) return
      const points = quantity * POINTS_PER_BOTTLE
      const event = {
        id: uid('c'),
        at: new Date().toISOString(),
        quantity,
        points,
        location: 'Seaside bin · North pier',
        material: 'PET bottles',
      }
      const { bottles } = totals(record)
      const nextBottles = bottles + quantity
      const band = rankBand(nextBottles)
      const nextTier = tierFor(nextBottles)
      const prevTier = tierFor(bottles)
      const extra: AppNotice[] = [
        notice(
          `+${points} points · balance ${totals(record).points + points}`,
          phrases[nextBottles % phrases.length],
        ),
      ]
      if (bottles > 0 && Math.floor(bottles / band.step) < Math.floor(nextBottles / band.step)) {
        extra.push(
          notice(
            `${band.label} unlocked`,
            `Every ${band.step} bottles lifts your collector rank. Friendly competition starts here.`,
          ),
        )
      }
      if (prevTier.id !== nextTier.id) {
        extra.push(notice(`${nextTier.label} tier reached`, 'Show the store team your QR to redeem at partner shops.'))
      }
      const nextRecord: UserRecord = {
        collections: [event, ...record.collections],
        redemptions: record.redemptions,
        notices: [...extra, ...record.notices],
      }
      persistUser(user, nextRecord, users)
    },
    [persistUser, record, user, users],
  )

  const redeem = useCallback(
    (rewardId: string, name: string, cost: number) => {
      if (!user) return { ok: false, message: 'Sign in first.' }
      const { points } = totals(record)
      if (points < cost) return { ok: false, message: `You need ${cost - points} more points.` }
      const nextRecord: UserRecord = {
        collections: record.collections,
        redemptions: [
          {
            id: uid('r'),
            at: new Date().toISOString(),
            rewardId,
            name,
            points: cost,
          },
          ...record.redemptions,
        ],
        notices: [
          notice('Redeemed in store', `${name} · ${cost} points. Show this confirmation at the counter.`),
          ...record.notices,
        ],
      }
      persistUser(user, nextRecord, users)
      return { ok: true, message: `${name} is yours. Present your QR at the partner shop.` }
    },
    [persistUser, record, user, users],
  )

  const markNoticesRead = useCallback(() => {
    if (!user) return
    const nextRecord = {
      ...record,
      notices: record.notices.map((item) => ({ ...item, read: true })),
    }
    persistUser(user, nextRecord, users)
  }, [persistUser, record, user, users])

  const { bottles, points } = totals(record)
  const kg = ((bottles * GRAMS_PER_BOTTLE) / 1000).toFixed(1)
  const activeDays = new Set(record.collections.map((event) => event.at.slice(0, 10))).size
  const qrPayload = user
    ? JSON.stringify({
        v: 1,
        app: 'BeachPoints',
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        issued: new Date().toISOString(),
      })
    : ''

  const value = useMemo<AppState>(
    () => ({
      tab,
      setTab,
      user,
      record,
      authPhase,
      pendingEmail,
      demoCode,
      authError,
      noticeOpen,
      setNoticeOpen,
      requestCode,
      verifyCode,
      completeProfile,
      loadDemo,
      signOut,
      deposit,
      redeem,
      markNoticesRead,
      points,
      bottles,
      kg,
      activeDays,
      qrPayload,
    }),
    [
      activeDays,
      authError,
      authPhase,
      bottles,
      completeProfile,
      demoCode,
      deposit,
      kg,
      loadDemo,
      markNoticesRead,
      noticeOpen,
      pendingEmail,
      points,
      qrPayload,
      record,
      redeem,
      requestCode,
      signOut,
      tab,
      user,
      verifyCode,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function useLeaderboard(user: User | null, bottles: number, points: number): LeaderboardRow[] {
  const you: LeaderboardRow | null = user
    ? {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        bottles,
        points,
        isYou: true,
      }
    : null
  const others = community.filter((row) => row.id !== user?.id)
  const rows: LeaderboardRow[] = [
    ...others.map((row) => ({ ...row, isYou: false })),
    ...(you ? [you] : []),
  ]
  return rows.sort((a, b) => b.bottles - a.bottles || b.points - a.points)
}
