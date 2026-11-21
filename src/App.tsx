import React, { useState, useEffect } from 'react'
import type { UserProfile, MovementRecord, ActiveVoucher, RegisteredAccount } from './types'
import { SplashView } from './components/SplashView'
import { SplashLoginView } from './components/SplashLoginView'
import { CreateAccountView } from './components/CreateAccountView'
import { ForgotPasswordView } from './components/ForgotPasswordView'
import { HomeDashboard } from './components/HomeDashboard'
import { StoreSection } from './components/StoreSection'
import { HistoryView } from './components/HistoryView'
import { ProfileView } from './components/ProfileView'
import { BottomNavBar, type NavTab } from './components/BottomNavBar'
import { PlanetMascot } from './components/BrandLogos'
import { QRScannerModal, type BoteStation } from './components/QRScannerModal'
import { sanitizeUserProfile } from './utils/security'

export type AppScreen = 'login' | 'create_account' | 'forgot_password' | 'app' | 'bin_info'

const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 'BP-84920',
    firstName: 'Alex',
    lastName: 'Fernández',
    // Hash SHA-256 precalculado para 'password123' con sal 'alex_salt_2026'
    passwordHash: '521518a7dcd3278cf5757541aa84a8e26ae3a17794312e6a99e2830703837be8',
    passwordSalt: 'alex_salt_2026',
    password: 'password123',
    points: 230,
    totalWasteCollected: 12,
    totalKg: 3.2,
    activeDays: 7,
    tier: 'Plata',
  },
]

export const App: React.FC = () => {
  // Lista de cuentas registradas con persistencia en localStorage y sanitización
  const [accounts, setAccounts] = useState<RegisteredAccount[]>(() => {
    const saved = localStorage.getItem('beachpoints_registered_accounts_v1')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return parsed.map((acc) => sanitizeUserProfile(acc) as RegisteredAccount)
        }
      } catch (err) {
        console.error('Error loading accounts from storage:', err)
      }
    }
    return DEFAULT_ACCOUNTS
  })

  // Estado de pantalla actual (inicia por defecto en el Splash Login requerido)
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login')

  // Modo de Relación de Aspecto: 'android' (Max Mobile Screen Ratio con Safespace) | 'windows' (Ratio Ventana PC)
  const [ratioMode, setRatioMode] = useState<'android' | 'windows'>(() => {
    const saved = localStorage.getItem('beachpoints_ratio_mode')
    return saved === 'windows' ? 'windows' : 'android'
  })

  const toggleRatioMode = () => {
    const next = ratioMode === 'android' ? 'windows' : 'android'
    setRatioMode(next)
    localStorage.setItem('beachpoints_ratio_mode', next)
  }

  // Notificación para la pantalla de inicio de sesión (por ejemplo, después de cambiar contraseña)
  const [loginNotice, setLoginNotice] = useState<string | null>(null)

  // Pestaña activa dentro de la app móvil: 'home' | 'history' | 'store' | 'profile' | 'qr'
  const [activeTab, setActiveTab] = useState<NavTab>('home')

  // Estado del Escáner QR obligatorio para acreditar botellas
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [preselectedStation, setPreselectedStation] = useState<BoteStation | undefined>(undefined)

  // Mensaje flotante de alerta / felicitación dentro de la app
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Estado del usuario activo con validación de integridad
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('beachpoints_user_v2')
    if (saved) {
      try {
        return sanitizeUserProfile(JSON.parse(saved))
      } catch (err) {
        console.error('Invalid user state in localStorage, restoring defaults:', err)
      }
    }
    return DEFAULT_ACCOUNTS[0]
  })

  // Historial de movimientos (depósitos y canjes)
  const [movements, setMovements] = useState<MovementRecord[]>(() => {
    const saved = localStorage.getItem('beachpoints_movements_v2')
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'm1',
            type: 'deposito',
            title: 'Depósito en Bote Inteligente #01',
            subtitle: '6 botellas PET · Playa Norte · Verificado por QR',
            points: 60,
            date: 'Hoy, 09:15',
          },
          {
            id: 'm2',
            type: 'deposito',
            title: 'Depósito en Bote Inteligente #02',
            subtitle: '6 latas de aluminio · Playa Central · Verificado por QR',
            points: 60,
            date: 'Ayer, 16:40',
          },
          {
            id: 'm3',
            type: 'canje',
            title: 'Cupón OXXO 10% Descuento',
            subtitle: 'Canje digital en tienda',
            points: 150,
            date: '24 Oct 2026',
          },
        ]
  })

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('beachpoints_registered_accounts_v1', JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    localStorage.setItem('beachpoints_user_v2', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('beachpoints_movements_v2', JSON.stringify(movements))
  }, [movements])

  // Mostrar mensaje flotante de aviso con autocierre
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr))
    }, 4000)
  }

  // MANEJADORES DE AUTENTICACIÓN
  // 1.- Inicio de sesión exitoso
  const handleLoginSuccess = (signedInUser: UserProfile) => {
    const sanitized = sanitizeUserProfile(signedInUser)
    setUser(sanitized)
    setCurrentScreen('app')
    showToast(`¡Bienvenido a BeachPoints, ${sanitized.firstName}!`)
  }

  // 2.- Cuenta creada (con números aleatorios al final del nombre)
  const handleAccountCreated = (newAccount: RegisteredAccount) => {
    const sanitized = sanitizeUserProfile(newAccount) as RegisteredAccount
    setAccounts((prev) => [sanitized, ...prev])
    setUser(sanitized)
    setCurrentScreen('app')
    showToast(`¡Cuenta ${sanitized.firstName} activada con éxito (+100 puntos bono)!`)
  }

  // 3.- Contraseña restablecida mediante verificación biométrica / telefónica
  const handlePasswordChanged = (
    account: RegisteredAccount,
    newPass: string,
    newHash?: string,
    newSalt?: string
  ) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === account.id
          ? {
              ...acc,
              password: newPass,
              passwordHash: newHash || acc.passwordHash,
              passwordSalt: newSalt || acc.passwordSalt,
            }
          : acc
      )
    )
    setLoginNotice(`Contraseña actualizada con cifrado SHA-256 para ${account.firstName}. Ingresa con tu nueva clave.`)
    setCurrentScreen('login')
  }

  // 4.- Cerrar Sesión
  const handleLogout = () => {
    setLoginNotice('Has cerrado sesión correctamente.')
    setCurrentScreen('login')
  }

  // Abrir el escáner QR obligatorio
  const handleOpenScanner = (station?: BoteStation) => {
    setPreselectedStation(station)
    setIsScannerOpen(true)
  }

  // Lógica de depósito de residuos TRAS ESCANEAR EL CÓDIGO QR (con validación de límites)
  const handleDepositFromScan = (bottlesCount: number, station: BoteStation) => {
    // Validación de límites: entre 1 y 50 botellas por depósito (previene manipulación de valores negativos o desbordamientos)
    const safeCount = Math.max(1, Math.min(50, Math.floor(bottlesCount || 1)))
    const earnedPoints = safeCount * 10
    const addedKg = Number((safeCount * 0.25).toFixed(1))

    setUser((prev) => {
      const newTotalWaste = prev.totalWasteCollected + safeCount
      const newTier =
        newTotalWaste >= 50
          ? 'Diamante'
          : newTotalWaste >= 25
          ? 'Oro'
          : newTotalWaste >= 10
          ? 'Plata'
          : 'Bronce'

      return {
        ...prev,
        points: prev.points + earnedPoints,
        totalWasteCollected: newTotalWaste,
        totalKg: Number((prev.totalKg + addedKg).toFixed(1)),
        tier: newTier,
      }
    })

    const newMov: MovementRecord = {
      id: Date.now().toString(),
      type: 'deposito',
      title: `Depósito en ${station.name}`,
      subtitle: `${safeCount} envase${safeCount > 1 ? 's' : ''} · ${station.location} · QR Verificado`,
      points: earnedPoints,
      date: 'Recién verificado por QR',
    }

    setMovements((prev) => [newMov, ...prev])
    showToast(
      `¡Código QR verificado! Depositaste ${safeCount} envase${
        safeCount > 1 ? 's' : ''
      } en ${station.name} y ganaste +${earnedPoints} puntos.`
    )
  }

  // Lógica de canje de cupón o producto (con verificación estricta de solvencia de puntos)
  const handleRedeemVoucher = (voucher: ActiveVoucher) => {
    if (user.points < voucher.pointsSpent) {
      showToast('⚠️ No cuentas con puntos suficientes para realizar este canje.')
      return
    }

    setUser((prev) => ({
      ...prev,
      points: Math.max(0, prev.points - voucher.pointsSpent),
    }))

    const newMov: MovementRecord = {
      id: Date.now().toString(),
      type: 'canje',
      title: voucher.title,
      subtitle: voucher.discountOrReward,
      points: voucher.pointsSpent,
      date: 'Canjeado hoy',
    }

    setMovements((prev) => [newMov, ...prev])
    showToast(`¡Felicidades! Canjeaste ${voucher.title} por ${voucher.pointsSpent} puntos.`)
  }

  // Reiniciar datos de prueba
  const handleResetDemo = () => {
    setUser(DEFAULT_ACCOUNTS[0])
    setAccounts(DEFAULT_ACCOUNTS)
    setMovements([
      {
        id: 'm1',
        type: 'deposito',
        title: 'Depósito en Bote Inteligente #01',
        subtitle: '6 botellas PET · Playa Norte · Verificado por QR',
        points: 60,
        date: 'Hoy, 09:15',
      },
      {
        id: 'm2',
        type: 'deposito',
        title: 'Depósito en Bote Inteligente #02',
        subtitle: '6 latas de aluminio · Playa Central · Verificado por QR',
        points: 60,
        date: 'Ayer, 16:40',
      },
    ])
    showToast('Datos de demostración restablecidos a la maqueta original.')
  }

  // ========================================================
  // RENDERIZADO CONDICIONAL DE PANTALLAS
  // ========================================================

  // PANTALLA 1: SPLASH LOGIN SCREEN
  if (currentScreen === 'login') {
    return (
      <>
        <div className="pc-ratio-switcher">
          <button
            type="button"
            onClick={toggleRatioMode}
            title="Alternar relación de aspecto (Android Max Ratio vs Ventana Windows)"
            style={{
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 14px',
              borderRadius: '24px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <span>{ratioMode === 'android' ? '📱' : '💻'}</span>
            <span>
              {ratioMode === 'android' ? 'Aspecto: Android (Max Ratio)' : 'Aspecto: Windows (PC Ratio)'}
            </span>
          </button>
        </div>
        <SplashLoginView
          registeredAccounts={accounts}
          onLoginSuccess={handleLoginSuccess}
          onNavigateToCreate={() => setCurrentScreen('create_account')}
          onNavigateToForgot={() => setCurrentScreen('forgot_password')}
          onViewBinInfo={() => setCurrentScreen('bin_info')}
          initialNotice={loginNotice}
          ratioMode={ratioMode}
        />
      </>
    )
  }

  // PANTALLA 2: CREATE ACCOUNT SCREEN
  if (currentScreen === 'create_account') {
    return (
      <>
        <div className="pc-ratio-switcher">
          <button
            type="button"
            onClick={toggleRatioMode}
            title="Alternar relación de aspecto"
            style={{
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 14px',
              borderRadius: '24px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <span>{ratioMode === 'android' ? '📱' : '💻'}</span>
            <span>
              {ratioMode === 'android' ? 'Aspecto: Android (Max Ratio)' : 'Aspecto: Windows (PC Ratio)'}
            </span>
          </button>
        </div>
        <CreateAccountView
          onBackToLogin={() => setCurrentScreen('login')}
          onAccountCreated={handleAccountCreated}
          ratioMode={ratioMode}
        />
      </>
    )
  }

  // PANTALLA 3: FORGOT PASSWORD SCREEN (VERIFICACIÓN TELEFÓNICA + CAMBIO DE CONTRASEÑA)
  if (currentScreen === 'forgot_password') {
    return (
      <>
        <div className="pc-ratio-switcher">
          <button
            type="button"
            onClick={toggleRatioMode}
            title="Alternar relación de aspecto"
            style={{
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 14px',
              borderRadius: '24px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <span>{ratioMode === 'android' ? '📱' : '💻'}</span>
            <span>
              {ratioMode === 'android' ? 'Aspecto: Android (Max Ratio)' : 'Aspecto: Windows (PC Ratio)'}
            </span>
          </button>
        </div>
        <ForgotPasswordView
          registeredAccounts={accounts}
          onBackToLogin={() => setCurrentScreen('login')}
          onPasswordChanged={handlePasswordChanged}
          ratioMode={ratioMode}
        />
      </>
    )
  }

  // PANTALLA OPCIONAL: INFOGRAFÍA / MAQUETA BOTE INTELIGENTE
  if (currentScreen === 'bin_info') {
    return (
      <>
        <div className="pc-ratio-switcher">
          <button
            type="button"
            onClick={toggleRatioMode}
            title="Alternar relación de aspecto"
            style={{
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              padding: '8px 14px',
              borderRadius: '24px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <span>{ratioMode === 'android' ? '📱' : '💻'}</span>
            <span>
              {ratioMode === 'android' ? 'Aspecto: Android (Max Ratio)' : 'Aspecto: Windows (PC Ratio)'}
            </span>
          </button>
        </div>
        <SplashView
          onEnterApp={() => setCurrentScreen('app')}
          onScanBin={() => {
            setCurrentScreen('app')
            handleOpenScanner()
          }}
          userPoints={user.points}
          ratioMode={ratioMode}
        />
      </>
    )
  }

  // PANTALLA PRINCIPAL: APLICACIÓN MÓVIL BEACHPOINTS
  return (
    <>
      <div className="pc-ratio-switcher">
        <button
          type="button"
          onClick={toggleRatioMode}
          title="Alternar relación de aspecto"
          style={{
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            color: '#ffffff',
            border: '1.5px solid rgba(255, 255, 255, 0.3)',
            padding: '8px 14px',
            borderRadius: '24px',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          }}
        >
          <span>{ratioMode === 'android' ? '📱' : '💻'}</span>
          <span>
            {ratioMode === 'android' ? 'Aspecto: Android (Max Ratio)' : 'Aspecto: Windows (PC Ratio)'}
          </span>
        </button>
      </div>

      <div
        className={`app-viewport-shell mode-${ratioMode}`}
        style={{
          maxWidth: ratioMode === 'windows' ? 'min(860px, 94vw)' : '440px',
          margin: '0 auto',
          minHeight: '100dvh',
          backgroundColor: '#1b6826',
          color: '#ffffff',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Barra de estado superior del móvil (con Android Safespace) */}
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
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

      {/* Notificación flotante emergente */}
      {toastMessage && (
        <div
          style={{
            position: 'sticky',
            top: '8px',
            zIndex: 100,
            margin: '4px 16px',
            backgroundColor: '#22c55e',
            color: '#ffffff',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            textAlign: 'center',
            boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
          }}
        >
          🌱 {toastMessage}
        </div>
      )}

      {/* Encabezado: ¡Hola, Alex! + Botón al Splash del Bote + Cerrar Sesión */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 20px 10px',
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 900,
              letterSpacing: '-0.3px',
              color: '#ffffff',
            }}
          >
            ¡Hola, {user.firstName}!
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#bbf7d0', opacity: 0.9 }}>
            Sigue haciendo la diferencia
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Botón para ver la infografía del Bote Inteligente */}
          <button
            onClick={() => setCurrentScreen('bin_info')}
            title="Ver Prototipo de Bote Inteligente"
            style={{
              background: 'rgba(255,255,255,0.18)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '6px 9px',
              borderRadius: '18px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>🗑️</span>
            <span>Bote</span>
          </button>

          {/* Botón rápido para volver al Login / Splash */}
          <button
            onClick={handleLogout}
            title="Cerrar sesión e ir a Splash Login"
            style={{
              background: 'rgba(239, 68, 68, 0.25)',
              color: '#fee2e2',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              padding: '6px 9px',
              borderRadius: '18px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>🚪</span>
            <span>Salir</span>
          </button>

          {/* Mascota del planeta con hojita */}
          <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
            <PlanetMascot size={38} />
          </div>
        </div>
      </header>

      {/* Franja de Puntos con acceso al Historial */}
      <div
        onClick={() => setActiveTab('history')}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 20px 14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          cursor: 'pointer',
          background: 'rgba(0, 0, 0, 0.08)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 900,
              letterSpacing: '0.5px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>TUS PUNTOS:</span>
            <span style={{ color: '#fef08a', fontSize: '20px' }}>{user.points}</span>
            <span style={{ color: '#fef08a' }}>★</span>
          </div>
          <div style={{ fontSize: '11px', color: '#bbf7d0', marginTop: '2px' }}>
            Historial de movimientos
          </div>
        </div>
        <div style={{ fontSize: '22px', fontWeight: 300, color: '#bbf7d0', paddingRight: '4px' }}>
          ›
        </div>
      </div>

      {/* Contenido Principal según la pestaña activa (con Safespace inferior) */}
      <main
        style={{
          flex: 1,
          padding: '16px 18px calc(90px + env(safe-area-inset-bottom, 0px))',
          overflowY: 'auto',
        }}
      >
        {/* 1. PESTAÑA INICIO */}
        {activeTab === 'home' && (
          <HomeDashboard
            user={user}
            onOpenScanner={() => handleOpenScanner()}
            onOpenStore={() => setActiveTab('store')}
          />
        )}

        {/* 2. PESTAÑA TIENDA (DOS SECCIONES DE CANJE: CUPONES Y PRODUCTOS) */}
        {activeTab === 'store' && (
          <StoreSection
            userPoints={user.points}
            onRedeem={handleRedeemVoucher}
            onOpenHistory={() => setActiveTab('history')}
          />
        )}

        {/* 3. PESTAÑA HISTORIAL */}
        {activeTab === 'history' && (
          <HistoryView
            movements={movements}
            currentPoints={user.points}
            onBack={() => setActiveTab('home')}
          />
        )}

        {/* 4. PESTAÑA PERFIL */}
        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            onResetDemo={handleResetDemo}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* MODAL OBLIGATORIO DE ESCÁNER QR PARA ACREDITAR BOTELLAS */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onDepositSuccess={handleDepositFromScan}
        preselectedStation={preselectedStation}
      />

      {/* Barra de Navegación Inferior Móvil con soporte para Safespace y Windows Ratio */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onQuickRecycle={() => handleOpenScanner()}
        ratioMode={ratioMode}
      />
    </div>
    </>
  )
}

export default App
