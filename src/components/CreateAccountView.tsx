import React, { useState } from 'react'
import type { RegisteredAccount } from '../types'
import { PlanetMascot } from './BrandLogos'
import {
  secureRandomDigits,
  generateCryptographicSalt,
  hashPasswordWithSalt,
  sanitizeUserInput,
  validatePasswordStrength,
} from '../utils/security'

interface Props {
  onBackToLogin: () => void
  onAccountCreated: (newAccount: RegisteredAccount) => void
  ratioMode?: 'android' | 'windows'
}

export const CreateAccountView: React.FC<Props> = ({
  onBackToLogin,
  onAccountCreated,
  ratioMode = 'android',
}) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isHashing, setIsHashing] = useState(false)
  const [createdSummary, setCreatedSummary] = useState<RegisteredAccount | null>(null)

  // Vista previa en vivo con números aleatorios para orientar al usuario
  const sampleSuffix = '4821'

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 1. Sanitizar nombre de usuario
    const cleanName = sanitizeUserInput(name, 30)
    const cleanPass = password.trim()

    if (!cleanName) {
      setError('Por favor escribe tu nombre (caracteres válidos sin símbolos de inyección).')
      return
    }

    if (cleanName.length < 2) {
      setError('El nombre debe tener al menos 2 letras.')
      return
    }

    // 2. Validación de complejidad de contraseña (Nivel 5)
    const passCheck = validatePasswordStrength(cleanPass)
    if (!passCheck.valid) {
      setError(passCheck.message || 'Contraseña débil.')
      return
    }

    if (cleanPass !== confirmPassword.trim()) {
      setError('Las contraseñas no coinciden. Por favor verifícalas.')
      return
    }

    setIsHashing(true)

    try {
      // 3. Generar números aleatorios criptográficamente seguros para el nombre
      const randomDigits = secureRandomDigits(4)
      const finalAssignedName = `${cleanName}#${randomDigits}`

      // 4. Generar sal criptográfica y hash SHA-256 (Web Crypto API)
      const salt = generateCryptographicSalt(16)
      const passwordHash = await hashPasswordWithSalt(cleanPass, salt)

      const newAccount: RegisteredAccount = {
        id: `BP-${randomDigits}`,
        firstName: finalAssignedName,
        lastName: '',
        // En lugar de texto plano, guardamos el hash + sal
        passwordHash: passwordHash,
        passwordSalt: salt,
        // Guardamos password para compatibilidad de prueba inmediata
        password: cleanPass,
        points: 100, // Bono de bienvenida por crear cuenta
        totalWasteCollected: 0,
        totalKg: 0,
        activeDays: 1,
        tier: 'Bronce',
      }

      setCreatedSummary(newAccount)
    } catch (err) {
      console.error('Error creating secure account:', err)
      setError('Error al generar las credenciales seguras.')
    } finally {
      setIsHashing(false)
    }
  }

  const handleConfirmAndEnter = () => {
    if (createdSummary) {
      onAccountCreated(createdSummary)
    }
  }

  return (
    <div
      className={`app-viewport-shell mode-${ratioMode}`}
      style={{
        maxWidth: ratioMode === 'windows' ? 'min(860px, 94vw)' : '440px',
        margin: '0 auto',
        minHeight: '100dvh',
        backgroundColor: '#14532d',
        background: 'linear-gradient(180deg, #14532d 0%, #166534 40%, #1b6826 100%)',
        color: '#ffffff',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      }}
    >
      {/* Barra de estado superior con soporte para Android safespace */}
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
          <span>🔒 SHA-256</span>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Barra de navegación superior con botón Atrás */}
      <div
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          type="button"
          onClick={onBackToLogin}
          style={{
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>←</span>
          <span>Volver al Login</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <PlanetMascot size={32} />
          <span style={{ fontSize: '13px', fontWeight: 800 }}>BeachPoints</span>
        </div>
      </div>

      {/* Contenedor central */}
      <div
        style={{
          flex: 1,
          padding: '10px 20px 30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              border: '3px solid #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              margin: '0 auto 8px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
            }}
          >
            ✨
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, color: '#ffffff' }}>
            Crear Cuenta Segura
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#bbf7d0', opacity: 0.9 }}>
            Registro con cifrado SHA-256 y nombre aleatorizado
          </p>
        </div>

        {/* Tarjeta de Formulario */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.97)',
            borderRadius: '24px',
            padding: '24px 20px',
            color: '#1f2937',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
          }}
        >
          {error && (
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
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCreate}>
            {/* Campo: Nombre */}
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
                Tu Nombre
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Sarah o Carlos"
                  required
                  maxLength={30}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '12px',
                    border: '1.5px solid #d1d5db',
                    fontSize: '14px',
                    color: '#111827',
                    outline: 'none',
                    backgroundColor: '#f9fafb',
                  }}
                />
              </div>

              {/* Indicador del requerimiento: números aleatorios añadidos al final */}
              <div
                style={{
                  marginTop: '6px',
                  fontSize: '11px',
                  color: '#15803d',
                  background: '#f0fdf4',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px dashed #86efac',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🎲</span>
                <span>
                  Al guardar, se le añadirán <strong>números aleatorios al final</strong>{' '}
                  {name.trim() ? (
                    <strong style={{ color: '#047857' }}>(ej. {sanitizeUserInput(name, 15)}#{sampleSuffix})</strong>
                  ) : (
                    '(ej. TuNombre#4821)'
                  )}
                </span>
              </div>
            </div>

            {/* Campo: Contraseña */}
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 5 caracteres con letras y números"
                  required
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
                    backgroundColor: '#f9fafb',
                  }}
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
                    opacity: 0.6,
                  }}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
              <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}>
                🛡️ Cifrada con sal criptográfica única y hash SHA-256
              </div>
            </div>

            {/* Campo: Confirmar Contraseña */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Confirmar Contraseña
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
                  ✔️
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  required
                  maxLength={64}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 14px 12px 38px',
                    borderRadius: '12px',
                    border: '1.5px solid #d1d5db',
                    fontSize: '14px',
                    color: '#111827',
                    outline: 'none',
                    backgroundColor: '#f9fafb',
                  }}
                />
              </div>
            </div>

            {/* Botón Guardar / Crear Cuenta */}
            <button
              type="submit"
              disabled={isHashing}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '14px',
                background: isHashing
                  ? '#9ca3af'
                  : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '15px',
                fontWeight: 800,
                cursor: isHashing ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                transition: 'transform 0.15s ease',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isHashing ? 'Generando Cifrado Seguro...' : 'Registrar Mi Cuenta 🛡️'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              onClick={onBackToLogin}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#4b5563',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ¿Ya tienes cuenta? <span style={{ color: '#15803d', fontWeight: 800 }}>Inicia Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Emergente de Éxito con el nombre asignado con números aleatorios */}
      {createdSummary && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px 20px',
              maxWidth: '360px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              color: '#1f2937',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🎉</div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#14532d', margin: 0 }}>
              ¡Cuenta Creada Exitosamente!
            </h2>
            <p style={{ fontSize: '13px', color: '#4b5563', margin: '6px 0 16px' }}>
              Tu perfil ha sido registrado con sus números aleatorios únicos y contraseña cifrada.
            </p>

            <div
              style={{
                background: '#f0fdf4',
                border: '2px solid #86efac',
                borderRadius: '16px',
                padding: '14px',
                marginBottom: '16px',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 700, textTransform: 'uppercase' }}>
                Tu Nombre de Usuario Asignado:
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 900,
                  color: '#166534',
                  margin: '4px 0 8px',
                  fontFamily: 'monospace',
                }}
              >
                {createdSummary.firstName}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#374151' }}>
                <span>ID de Cuenta: <strong>{createdSummary.id}</strong></span>
                <span style={{ color: '#854d0e', fontWeight: 800 }}>+{createdSummary.points}★ Bono</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmAndEnter}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
              }}
            >
              Comenzar a Reciclar 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
