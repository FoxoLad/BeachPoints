/**
 * BeachPoints Client-Side Security & Hardening Suite
 * Target Security Level: Solid 5/10 (Maximum robust client-side security without a backend)
 */

import type { UserProfile, RankTier } from '../types'

/**
 * Genera números aleatorios criptográficamente seguros en lugar de Math.random()
 */
export function secureRandomDigits(length: number = 4): string {
  const array = new Uint32Array(1)
  window.crypto.getRandomValues(array)
  const min = Math.pow(10, length - 1)
  const max = Math.pow(10, length) - 1
  const num = min + (array[0] % (max - min + 1))
  return num.toString()
}

/**
 * Genera una sal criptográfica segura en hexadecimal
 */
export function generateCryptographicSalt(byteLength: number = 16): string {
  const bytes = new Uint8Array(byteLength)
  window.crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Hashea una contraseña usando SHA-256 mediante la Web Crypto API nativa
 * Nunca almacena contraseñas en texto plano en localStorage
 */
export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const saltedPassword = `${salt}:${password}:beachpoints_secret_v1`
  const data = encoder.encode(saltedPassword)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Sanitiza texto ingresado por el usuario para prevenir inyección XSS / caracteres de control
 */
export function sanitizeUserInput(input: string, maxLength: number = 60): string {
  if (!input || typeof input !== 'string') return ''
  return input
    .replace(/[<>&"'`]/g, '') // Elimina caracteres susceptibles a HTML/XSS
    .split('')
    .filter((char) => {
      const code = char.charCodeAt(0)
      return (code >= 32 && code !== 127) || code > 159
    })
    .join('')
    .trim()
    .slice(0, maxLength)
}

/**
 * Validador de complejidad mínima de contraseña
 */
export interface PasswordValidationResult {
  valid: boolean
  message?: string
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  if (!password || password.length < 5) {
    return { valid: false, message: 'La contraseña debe tener al menos 5 caracteres.' }
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return {
      valid: false,
      message: 'La contraseña debe contener al menos una letra y un número.',
    }
  }
  return { valid: true }
}

/**
 * Sistema de Bloqueo Anti Fuerza Bruta (Rate Limiting en el cliente)
 * Tras 5 intentos fallidos consecutivos, bloquea el inicio de sesión por 30 segundos.
 */
interface AttemptTracker {
  count: number
  lockUntil: number
}

const ATTEMPTS_STORAGE_KEY = 'beachpoints_login_attempts_v1'
const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 30 * 1000 // 30 segundos

function getAttemptMap(): Record<string, AttemptTracker> {
  try {
    const raw = sessionStorage.getItem(ATTEMPTS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveAttemptMap(map: Record<string, AttemptTracker>): void {
  try {
    sessionStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(map))
  } catch {
    // Si sessionStorage no está disponible
  }
}

export function checkRateLimit(identifier: string): { locked: boolean; remainingSeconds: number } {
  const key = identifier.toLowerCase().trim() || 'global'
  const map = getAttemptMap()
  const record = map[key]

  if (!record) {
    return { locked: false, remainingSeconds: 0 }
  }

  const now = Date.now()
  if (record.lockUntil > now) {
    const remaining = Math.ceil((record.lockUntil - now) / 1000)
    return { locked: true, remainingSeconds: remaining }
  }

  // Si ya pasó el tiempo de bloqueo, limpiar
  if (record.lockUntil > 0 && record.lockUntil <= now) {
    delete map[key]
    saveAttemptMap(map)
  }

  return { locked: false, remainingSeconds: 0 }
}

export function recordFailedLogin(identifier: string): { locked: boolean; remainingSeconds: number; attemptsLeft: number } {
  const key = identifier.toLowerCase().trim() || 'global'
  const map = getAttemptMap()
  const record = map[key] || { count: 0, lockUntil: 0 }

  record.count += 1

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockUntil = Date.now() + LOCKOUT_DURATION_MS
    record.count = 0
    map[key] = record
    saveAttemptMap(map)
    return { locked: true, remainingSeconds: 30, attemptsLeft: 0 }
  }

  map[key] = record
  saveAttemptMap(map)
  return { locked: false, remainingSeconds: 0, attemptsLeft: MAX_FAILED_ATTEMPTS - record.count }
}

export function resetLoginAttempts(identifier: string): void {
  const key = identifier.toLowerCase().trim() || 'global'
  const map = getAttemptMap()
  if (map[key]) {
    delete map[key]
    saveAttemptMap(map)
  }
}

/**
 * Validador e integridad de datos del usuario
 * Asegura que los puntos no sean negativos ni manipulados con valores extremos o NaN
 */
export function sanitizeUserProfile(raw: unknown): UserProfile {
  const defaultUser: UserProfile = {
    id: 'BP-84920',
    firstName: 'Alex',
    lastName: 'Fernández',
    points: 230,
    totalWasteCollected: 12,
    totalKg: 3.2,
    activeDays: 7,
    tier: 'Plata',
  }

  if (!raw || typeof raw !== 'object') {
    return defaultUser
  }

  const obj = raw as Record<string, unknown>

  const cleanPoints = typeof obj.points === 'number' && !isNaN(obj.points)
    ? Math.max(0, Math.min(1000000, Math.floor(obj.points)))
    : defaultUser.points

  const cleanTotalWaste = typeof obj.totalWasteCollected === 'number' && !isNaN(obj.totalWasteCollected)
    ? Math.max(0, Math.min(100000, Math.floor(obj.totalWasteCollected)))
    : defaultUser.totalWasteCollected

  const cleanKg = typeof obj.totalKg === 'number' && !isNaN(obj.totalKg)
    ? Math.max(0, Math.min(10000, Number(obj.totalKg.toFixed(1))))
    : defaultUser.totalKg

  const validTiers: RankTier[] = ['Bronce', 'Plata', 'Oro', 'Diamante', 'Legendario']
  const cleanTier = validTiers.includes(obj.tier as RankTier) ? (obj.tier as RankTier) : 'Bronce'

  return {
    id: typeof obj.id === 'string' && obj.id.startsWith('BP-') ? obj.id : defaultUser.id,
    firstName: sanitizeUserInput(typeof obj.firstName === 'string' ? obj.firstName : defaultUser.firstName, 40),
    lastName: sanitizeUserInput(typeof obj.lastName === 'string' ? obj.lastName : '', 40),
    points: cleanPoints,
    totalWasteCollected: cleanTotalWaste,
    totalKg: cleanKg,
    activeDays: typeof obj.activeDays === 'number' && !isNaN(obj.activeDays) ? Math.max(1, obj.activeDays) : 1,
    tier: cleanTier,
    passwordHash: typeof obj.passwordHash === 'string' ? obj.passwordHash : undefined,
    passwordSalt: typeof obj.passwordSalt === 'string' ? obj.passwordSalt : undefined,
  }
}
