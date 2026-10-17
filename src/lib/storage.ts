import type { User, UserRecord } from '../types'

const USERS_KEY = 'beachpoints.users'
const SESSION_KEY = 'beachpoints.session'

function recordKey(userId: string) {
  return `beachpoints.record.${userId}`
}

export function loadUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]') as User[]
  } catch {
    return []
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function loadSession(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export function saveSession(userId: string | null) {
  if (userId) localStorage.setItem(SESSION_KEY, userId)
  else localStorage.removeItem(SESSION_KEY)
}

export function emptyRecord(): UserRecord {
  return { collections: [], redemptions: [], notices: [] }
}

export function loadRecord(userId: string): UserRecord {
  try {
    const parsed = JSON.parse(localStorage.getItem(recordKey(userId)) ?? 'null') as UserRecord | null
    return parsed ?? emptyRecord()
  } catch {
    return emptyRecord()
  }
}

export function saveRecord(userId: string, record: UserRecord) {
  localStorage.setItem(recordKey(userId), JSON.stringify(record))
}

export function demoCodeFor(email: string) {
  const seed = email.trim().toLowerCase()
  let hash = 0
  for (const char of seed) hash = (hash * 33 + char.charCodeAt(0)) % 1000000
  return String(100000 + (hash % 900000))
}

export function uid(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}
