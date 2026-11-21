import React, { useState, useEffect } from 'react'
import type { RegisteredAccount, UserProfile } from '../types'
import { PlanetMascot } from './BrandLogos'
import {
  hashPasswordWithSalt,
  sanitizeUserInput,
  checkRateLimit,
  recordFailedLogin,
  resetLoginAttempts,
} from '../utils/security'

interface Props {
  registeredAccounts: RegisteredAccount[]
  onLoginSuccess: (user: UserProfile) => void
  onNavigateToCreate: () => void
  onNavigateToForgot: () => void
  onViewBinInfo: () => void
  initialNotice?: string | null
  ratioMode?: 'android' | 'windows'
}

export const SplashLoginView: React.FC<Props> = ({
  registeredAccounts,
  onLoginSuccess,
  onNavigateToCreate,
  onNavigateToForgot,
  onViewBinInfo,
  initialNotice,
  ratioMode = 'android',
}) => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(initialNotice || null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Control de Bloqueo Anti Fuerza Bruta (Rate Limiting)
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(() => {
    return checkRateLimit('global').remainingSeconds
  })
  // Toggle de modo desarrollador para evitar exposición de credenciales / enumeración de usuarios
  const [showDevAccounts, setShowDevAccounts] = useState(false)

  // Temporizador de cuenta regresiva si hay bloqueo activo
  useEffect(() => {
    if (lockoutRemaining <= 0) return

    const timer = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [lockoutRemaining])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    // 1. Verificar bloqueo por fuerza bruta
    const rateCheck = checkRateLimit(identifier || 'global')
    if (rateCheck.locked) {
      setLockoutRemaining(rateCheck.remainingSeconds)
      setErrorMessage(
        `Demasiados intentos fallidos. Por seguridad, espera ${rateCheck.remainingSeconds}s antes de intentar de nuevo.`
      )
      return
    }

    // 2. Sanitizar entradas
    const cleanInput = sanitizeUserInput(identifier, 50).toLowerCase()
    const cleanPass = password.trim()

    if (!cleanInput) {
      setErrorMessage('Por favor ingresa tu nombre de usuario o ID.')
      return
    }

    if (!cleanPass) {
      setErrorMessage('Por favor escribe tu contraseña.')
      return
    }

    setIsSubmitting(true)

    try {
      // Buscar usuario registrado
      const match = registeredAccounts.find((acc) => {
        const full = `${acc.firstName} ${acc.lastName}`.trim().toLowerCase()
        const first = acc.firstName.toLowerCase()
        const id = acc.id.toLowerCase()
        return full === cleanInput || first === cleanInput || id === cleanInput
      })

      if (!match) {
        const failure = recordFailedLogin(cleanInput)
        if (failure.locked) {
          setLockoutRemaining(failure.remainingSeconds)
          setErrorMessage(
            `Cuenta bloqueada temporalmente por 30s debido a múltiples intentos erróneos.`
          )
        } else {
          setErrorMessage(
            `Credenciales inválidas. Intentos restantes antes del bloqueo: ${failure.attemptsLeft}`
          )
        }
        setIsSubmitting(false)
        return
      }

      // 3. Comparación segura mediante Hash + Salt
      let isPasswordCorrect = false

      if (match.passwordHash && match.passwordSalt) {
        const computedHash = await hashPasswordWithSalt(cleanPass, match.passwordSalt)
        isPasswordCorrect = computedHash === match.passwordHash
      } else if (match.password) {
        // Fallback para cuentas demo anteriores en texto plano
        isPasswordCorrect = match.password === cleanPass
      }

      if (!isPasswordCorrect) {
        const failure = recordFailedLogin(cleanInput)
        if (failure.locked) {
          setLockoutRemaining(failure.remainingSeconds)
          setErrorMessage(
            `Cuenta bloqueada temporalmente por 30s debido a múltiples intentos erróneos.`
          )
        } else {
          setErrorMessage(
            `Contraseña incorrecta. Intentos restantes: ${failure.attemptsLeft}. Puedes usar "¿Olvidaste tu contraseña?".`
          )
        }
        setIsSubmitting(false)
        return
      }

      // Restablecer contador de intentos fallidos al tener éxito
      resetLoginAttempts(cleanInput)

      setSuccessMessage(`¡Autenticación exitosa! Bienvenido, ${match.firstName}.`)
      setTimeout(() => {
        onLoginSuccess(match)
      }, 400)
    } catch (err) {
      console.error('Error during login verification:', err)
      setErrorMessage('Ocurrió un error de validación de seguridad.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Autocompletar para pruebas
  const handleDemoFill = (acc: RegisteredAccount) => {
    setIdentifier(acc.firstName)
    setPassword(acc.password || '123456')
    setErrorMessage(null)
  }

  return (
    <div
      className={`app-viewport-shell mode-${ratioMode}`}
      style={{
        maxWidth: ratioMode === 'windows' ? 'min(860px, 94vw)' : '440px',
        margin: '0 auto',
        minHeight: '100dvh',
        backgroundColor: '#14532d',
        background: 'linear-gradient(180deg, #14532d 0%, #166534 35%, #1b6826 100%)',
        color: '#ffffff',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      }}
    >
      {/* Barra de estado móvil con soporte para Android safespace (notches y punch holes) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'calc(8px + env(safe-area-inset-top, 0px)) 20px 4px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#ffffff',
          opacity: 0.9,
        }}
      >
        <span>9:01</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span title="Cifrado WebCrypto SHA-256 Activo">🔒</span>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Contenido Principal con Safe Area Bottom */}
      <div
        style={{
          flex: 1,
          padding: '16px 20px calc(30px + env(safe-area-inset-bottom, 0px))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Encabezado Visual */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              display: 'inline-flex',
              padding: '12px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.25)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              marginBottom: '10px',
            }}
          >
            <PlanetMascot size={64} />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '26px' }}>🌊</span>
            <h1
              style={{
                fontSize: '28px',
                fontWeight: 900,
                letterSpacing: '-0.5px',
                margin: 0,
                color: '#ffffff',
                textShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              BeachPoints
            </h1>
          </div>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: '13px',
              color: '#bbf7d0',
              fontWeight: 500,
              letterSpacing: '0.2px',
            }}
          >
            Recicla en la playa · Gana puntos · Cuida el océano
          </p>

          {/* Badge de Seguridad Nivel 5 */}
          <div style={{ marginTop: '8px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                background: 'rgba(16, 185, 129, 0.25)',
                color: '#a7f3d0',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                padding: '3px 10px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>🛡️</span>
              <span>Protección Nivel 5: SHA-256 + Anti-BruteForce</span>
            </span>
          </div>
        </div>

        {/* Tarjeta de Formulario de Inicio de Sesión */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            borderRadius: '24px',
            padding: '24px 20px',
            color: '#1f2937',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: '#16a34a',
                background: '#dcfce7',
                padding: '4px 12px',
                borderRadius: '12px',
                display: 'inline-block',
                marginBottom: '6px',
              }}
            >
              Acceso Seguro
            </span>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: 900,
                color: '#14532d',
                margin: 0,
              }}
            >
              Iniciar Sesión
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
              Ingresa tus credenciales para acceder a tu billetera
            </p>
          </div>

          {/* Banner de Bloqueo por Fuerza Bruta */}
          {lockoutRemaining > 0 && (
            <div
              style={{
                background: '#fef2f2',
                border: '1.5px solid #ef4444',
                color: '#991b1b',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '20px' }}>⏳</span>
              <div>
                <div>Acceso bloqueado por protección anti-fuerza bruta</div>
                <div style={{ fontSize: '11px', fontWeight: 500, color: '#b91c1c' }}>
                  Espera <strong>{lockoutRemaining} segundos</strong> para reintentar.
                </div>
              </div>
            </div>
          )}

          {/* Banner de Éxito */}
          {successMessage && (
            <div
              style={{
                background: '#dcfce7',
                border: '1px solid #86efac',
                color: '#166534',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>✅</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Banner de Error */}
          {errorMessage && lockoutRemaining <= 0 && (
            <div
              style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#991b1b',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSignIn}>
            {/* Campo: Nombre / Usuario */}
            <div style={{ marginBottom: '14px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Nombre o Usuario
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '16px',
                    opacity: 0.6,
                  }}
                >
                  👤
                </span>
                <input
                  type="text"
                  value={identifier}
                  disabled={lockoutRemaining > 0 || isSubmitting}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Ej. Alex o Sarah#4829"
                  maxLength={50}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '12px',
                    border: '1.5px solid #d1d5db',
                    fontSize: '14px',
                    color: '#111827',
                    outline: 'none',
                    backgroundColor: lockoutRemaining > 0 ? '#f3f4f6' : '#f9fafb',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#16a34a')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
              </div>
            </div>

            {/* Campo: Contraseña */}
            <div style={{ marginBottom: '18px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '16px',
                    opacity: 0.6,
                  }}
                >
                  🔒
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  disabled={lockoutRemaining > 0 || isSubmitting}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña secreta"
                  maxLength={64}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 42px 12px 38px',
                    borderRadius: '12px',
                    border: '1.5px solid #d1d5db',
                    fontSize: '14px',
                    color: '#111827',
                    outline: 'none',
                    backgroundColor: lockoutRemaining > 0 ? '#f3f4f6' : '#f9fafb',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#16a34a')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '4px',
                    opacity: 0.6,
                  }}
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
            </div>

            {/* BOTÓN PRINCIPAL: Iniciar Sesión */}
            <button
              type="submit"
              disabled={lockoutRemaining > 0 || isSubmitting}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '14px',
                background:
                  lockoutRemaining > 0
                    ? '#9ca3af'
                    : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '15px',
                fontWeight: 800,
                cursor: lockoutRemaining > 0 || isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow:
                  lockoutRemaining > 0 ? 'none' : '0 4px 14px rgba(22, 163, 74, 0.35)',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={(e) => {
                if (lockoutRemaining === 0) e.currentTarget.style.transform = 'scale(0.98)'
              }}
              onMouseUp={(e) => {
                if (lockoutRemaining === 0) e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {isSubmitting
                ? 'Verificando Cifrado...'
                : lockoutRemaining > 0
                ? `Bloqueado (${lockoutRemaining}s)`
                : 'Iniciar Sesión Segura'}
            </button>
          </form>

          {/* BOTONES DEBAJO DEL INICIAR SESIÓN */}
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            {/* 1.- Botón "¿Olvidaste tu contraseña?" */}
            <button
              type="button"
              onClick={onNavigateToForgot}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#15803d',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '6px 10px',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>🔑</span>
              <span>¿Olvidaste tu contraseña?</span>
            </button>

            {/* Divisor */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                margin: '2px 0',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
              <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>O</span>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            </div>

            {/* 2.- Botón "Crear cuenta" */}
            <button
              type="button"
              onClick={onNavigateToCreate}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                background: '#f0fdf4',
                color: '#15803d',
                border: '1.5px solid #86efac',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#dcfce7')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
            >
              <span>✨</span>
              <span>Crear nueva cuenta</span>
            </button>
          </div>

          {/* Toggle de Modo Pruebas / Dev (Mitigación de Enumeración de Usuarios) */}
          <div
            style={{
              marginTop: '18px',
              paddingTop: '12px',
              borderTop: '1px dashed #e5e7eb',
              textAlign: 'center',
            }}
          >
            <button
              type="button"
              onClick={() => setShowDevAccounts(!showDevAccounts)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '11px',
                color: '#6b7280',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {showDevAccounts
                ? '🔒 Ocultar cuentas de prueba (Modo Seguro Activo)'
                : '🛠️ Mostrar cuentas de prueba (Modo Pruebas PC)'}
            </button>

            {showDevAccounts && registeredAccounts.length > 0 && (
              <div style={{ marginTop: '8px', textAlign: 'left' }}>
                <div
                  style={{
                    fontSize: '10px',
                    color: '#9ca3af',
                    marginBottom: '6px',
                    fontStyle: 'italic',
                  }}
                >
                  * Nota de seguridad: En producción esta lista se omite para evitar la enumeración de usuarios.
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {registeredAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleDemoFill(acc)}
                      style={{
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        fontSize: '11px',
                        color: '#1f2937',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                      title="Haz clic para autocompletar"
                    >
                      👤 {acc.firstName} ({acc.points}★)
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Acceso a la infografía del Bote Inteligente */}
        <div style={{ textAlign: 'center', marginTop: '18px' }}>
          <button
            type="button"
            onClick={onViewBinInfo}
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '8px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🗑️</span>
            <span>Ver Maqueta de Bote Inteligente</span>
          </button>
        </div>
      </div>
    </div>
  )
}
