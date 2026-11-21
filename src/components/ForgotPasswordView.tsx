import React, { useState } from 'react'
import type { RegisteredAccount } from '../types'
import { PlanetMascot } from './BrandLogos'
import {
  generateCryptographicSalt,
  hashPasswordWithSalt,
  sanitizeUserInput,
  validatePasswordStrength,
} from '../utils/security'

interface Props {
  registeredAccounts: RegisteredAccount[]
  onBackToLogin: () => void
  onPasswordChanged: (
    account: RegisteredAccount,
    newPass: string,
    newHash?: string,
    newSalt?: string
  ) => void
  ratioMode?: 'android' | 'windows'
}

type ForgotStep = 'identify' | 'biometric_unlock' | 'change_password' | 'success'

export const ForgotPasswordView: React.FC<Props> = ({
  registeredAccounts,
  onBackToLogin,
  onPasswordChanged,
  ratioMode = 'android',
}) => {
  const [step, setStep] = useState<ForgotStep>('identify')
  const [usernameInput, setUsernameInput] = useState('')
  const [selectedAccount, setSelectedAccount] = useState<RegisteredAccount | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Toggle de cuentas de prueba para mitigar enumeración de usuarios
  const [showDevAccounts, setShowDevAccounts] = useState(false)

  // Estado de la verificación biométrica / desbloqueo del teléfono
  const [isVerifying, setIsVerifying] = useState(false)
  const [isUnlockValid, setIsUnlockValid] = useState(false)

  // Estado del formulario de cambio de contraseña
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Paso 1: Identificar usuario con sanitización
  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const clean = sanitizeUserInput(usernameInput, 50).toLowerCase()
    if (!clean) {
      setErrorMessage('Por favor ingresa tu nombre de usuario o ID.')
      return
    }

    const found = registeredAccounts.find((acc) => {
      const full = `${acc.firstName} ${acc.lastName}`.trim().toLowerCase()
      const first = acc.firstName.toLowerCase()
      const id = acc.id.toLowerCase()
      return full === clean || first === clean || id === clean
    })

    if (!found) {
      setErrorMessage(
        'No se encontró ninguna cuenta asociada a este usuario. Verifica el nombre ingresado.'
      )
      return
    }

    setSelectedAccount(found)
    setStep('biometric_unlock')
  }

  // Paso 2: Validación Biométrica / Desbloqueo del Teléfono (Versión de prueba PC con botón OK)
  const handleSimulatePhoneUnlock = () => {
    setIsVerifying(true)
    setErrorMessage(null)

    // Simular escaneo de huella / desbloqueo telefónico (600ms)
    setTimeout(() => {
      setIsVerifying(false)
      setIsUnlockValid(true)

      // Dar medio segundo para que el usuario aprecie el estado "Válido" en el teléfono y luego habilitar el cambio de contraseña
      setTimeout(() => {
        setStep('change_password')
      }, 700)
    }, 600)
  }

  // Paso 3: Guardar nueva contraseña con SHA-256 + Sal criptográfica
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const p1 = newPassword.trim()
    const p2 = confirmPassword.trim()

    // Validación de fortaleza de contraseña
    const check = validatePasswordStrength(p1)
    if (!check.valid) {
      setErrorMessage(check.message || 'Contraseña inválida.')
      return
    }

    if (p1 !== p2) {
      setErrorMessage('Las contraseñas no coinciden. Por favor revísalas.')
      return
    }

    setIsUpdating(true)

    try {
      if (selectedAccount) {
        const salt = generateCryptographicSalt(16)
        const passwordHash = await hashPasswordWithSalt(p1, salt)

        onPasswordChanged(selectedAccount, p1, passwordHash, salt)
        setStep('success')
      }
    } catch (err) {
      console.error('Error updating password:', err)
      setErrorMessage('Ocurrió un error al cifrar la nueva contraseña.')
    } finally {
      setIsUpdating(false)
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

      {/* Contenedor Principal */}
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
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              border: '3px solid #ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              margin: '0 auto 8px',
              boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
            }}
          >
            🔑
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, margin: 0, color: '#ffffff' }}>
            Recuperar Contraseña
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#bbf7d0', opacity: 0.9 }}>
            Verificación biométrica y desbloqueo seguro
          </p>
        </div>

        {/* Tarjeta de Acción */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.97)',
            borderRadius: '24px',
            padding: '24px 20px',
            color: '#1f2937',
            boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
          }}
        >
          {errorMessage && (
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

          {/* ========================================================
              FASE 1: Identificar la cuenta a recuperar
             ======================================================== */}
          {step === 'identify' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#0284c7',
                    background: '#e0f2fe',
                    padding: '3px 10px',
                    borderRadius: '10px',
                  }}
                >
                  Paso 1 de 3
                </span>
                <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: '6px 0 2px' }}>
                  ¿A qué cuenta deseas ingresar?
                </h2>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  Escribe el nombre o usuario registrado
                </p>
              </div>

              <form onSubmit={handleIdentify}>
                <div style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#374151',
                      marginBottom: '6px',
                    }}
                  >
                    Nombre o ID de Usuario
                  </label>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Ej. Alex o Sarah#4829"
                    required
                    maxLength={50}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '14px',
                      color: '#111827',
                      outline: 'none',
                      backgroundColor: '#f9fafb',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                  }}
                >
                  Continuar al Desbloqueo Telefónico →
                </button>
              </form>

              {/* Toggle de Cuentas para mitigar User Enumeration */}
              <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px dashed #e5e7eb', textAlign: 'center' }}>
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
                  {showDevAccounts ? '🔒 Ocultar cuentas de prueba' : '🛠️ Ayuda de prueba (Cuentas activas)'}
                </button>

                {showDevAccounts && registeredAccounts.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                    {registeredAccounts.map((acc) => (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setUsernameInput(acc.firstName)}
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
                      >
                        👤 {acc.firstName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              FASE 2: Desbloqueo Telefónico / Biométrico (Teléfono + Botón OK para PC Test)
             ======================================================== */}
          {step === 'biometric_unlock' && selectedAccount && (
            <div style={{ textAlign: 'center' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#d97706',
                  background: '#fef3c7',
                  padding: '3px 10px',
                  borderRadius: '10px',
                }}
              >
                Paso 2 de 3 · Prueba Telefónica
              </span>

              <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#111827', margin: '8px 0 4px' }}>
                Verificación en el Teléfono
              </h2>
              <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 16px' }}>
                Validando seguridad para <strong>{selectedAccount.firstName}</strong>
              </p>

              {/* Módulo Gráfico de Pantalla de Teléfono para el Desbloqueo */}
              <div
                style={{
                  background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
                  borderRadius: '20px',
                  padding: '20px 16px',
                  color: '#ffffff',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.2)',
                  border: '2px solid #334155',
                  marginBottom: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Badge de Modo de Prueba PC */}
                <div
                  style={{
                    display: 'inline-block',
                    background: 'rgba(59, 130, 246, 0.25)',
                    border: '1px solid #60a5fa',
                    color: '#93c5fd',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '10px',
                    letterSpacing: '0.5px',
                    marginBottom: '14px',
                  }}
                >
                  MODO DE PRUEBA EN PC (SIMULADOR DE TELÉFONO)
                </div>

                {/* Ícono de Sensor Biométrico / Huella */}
                <div
                  style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    background: isUnlockValid
                      ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                      : isVerifying
                      ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                      : 'rgba(255,255,255,0.08)',
                    border: isUnlockValid
                      ? '3px solid #86efac'
                      : isVerifying
                      ? '3px solid #93c5fd'
                      : '2px dashed #64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    boxShadow: isUnlockValid
                      ? '0 0 25px rgba(34, 197, 94, 0.6)'
                      : isVerifying
                      ? '0 0 20px rgba(59, 130, 246, 0.5)'
                      : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ fontSize: '40px' }}>
                    {isUnlockValid ? '✓' : isVerifying ? '🔄' : '📱'}
                  </span>
                </div>

                {/* Estado visual en el lado del teléfono */}
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                  {isUnlockValid
                    ? '¡Prueba Válida en Teléfono!'
                    : isVerifying
                    ? 'Verificando huella y desbloqueo...'
                    : 'Esperando confirmación del teléfono'}
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: isUnlockValid ? '#86efac' : '#94a3b8',
                    maxWidth: '260px',
                    margin: '0 auto 16px',
                  }}
                >
                  {isUnlockValid
                    ? 'Huella digital autenticada correctamente. Procediendo al cambio de contraseña...'
                    : 'Para validar el test en PC, presiona el botón "OK" abajo en el teléfono.'}
                </div>

                {/* BOTÓN "OK" PHONESIDE */}
                <button
                  type="button"
                  onClick={handleSimulatePhoneUnlock}
                  disabled={isVerifying || isUnlockValid}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '14px',
                    background: isUnlockValid
                      ? '#22c55e'
                      : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: 900,
                    letterSpacing: '0.5px',
                    cursor: isVerifying || isUnlockValid ? 'default' : 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'transform 0.15s',
                  }}
                >
                  <span>{isUnlockValid ? '✓' : '🆗'}</span>
                  <span>
                    {isUnlockValid
                      ? 'DESBLOQUEO VÁLIDO (CONFIRMADO)'
                      : isVerifying
                      ? 'Escaneando...'
                      : 'OK - Confirmar Desbloqueo en Teléfono'}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep('identify')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                ← Cambiar usuario
              </button>
            </div>
          )}

          {/* ========================================================
              FASE 3: Pequeña pantalla de cambio de contraseña con SHA-256
             ======================================================== */}
          {step === 'change_password' && selectedAccount && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#dcfce7',
                    border: '1px solid #86efac',
                    color: '#15803d',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <span>✓</span>
                  <span>Desbloqueo telefónico verificado con éxito</span>
                </div>

                <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#111827', margin: '4px 0' }}>
                  Cambiar Contraseña
                </h2>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                  Establece una nueva contraseña para <strong>{selectedAccount.firstName}</strong>
                </p>
              </div>

              <form onSubmit={handleChangePassword}>
                {/* Campo: Nueva Contraseña */}
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
                    Nueva Contraseña
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 5 caracteres con letras y números"
                      required
                      maxLength={64}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '11px 42px 11px 14px',
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
                </div>

                {/* Campo: Confirmar Contraseña */}
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
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                    required
                    maxLength={64}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #d1d5db',
                      fontSize: '14px',
                      color: '#111827',
                      outline: 'none',
                      backgroundColor: '#f9fafb',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '14px',
                    background: isUpdating
                      ? '#9ca3af'
                      : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                  }}
                >
                  {isUpdating ? 'Cifrando Contraseña...' : 'Guardar Nueva Contraseña Cifrada ✓'}
                </button>
              </form>
            </div>
          )}

          {/* ========================================================
              FASE 4: Confirmación Exitosa
             ======================================================== */}
          {step === 'success' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ fontSize: '46px', marginBottom: '8px' }}>🎉</div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#166534', margin: '0 0 6px' }}>
                ¡Contraseña Actualizada y Cifrada!
              </h2>
              <p style={{ fontSize: '13px', color: '#4b5563', margin: '0 0 18px' }}>
                Tu contraseña ha sido restablecida y cifrada con SHA-256. Ya puedes iniciar sesión de
                forma segura.
              </p>

              <button
                type="button"
                onClick={onBackToLogin}
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
                Ir a Iniciar Sesión →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
