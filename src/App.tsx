import React, { useState, useEffect } from 'react'
import type { UserProfile, MovementRecord, ActiveVoucher } from './types'
import { SplashView } from './components/SplashView'
import { HomeDashboard } from './components/HomeDashboard'
import { StoreSection } from './components/StoreSection'
import { HistoryView } from './components/HistoryView'
import { ProfileView } from './components/ProfileView'
import { BottomNavBar, type NavTab } from './components/BottomNavBar'
import { PlanetMascot } from './components/BrandLogos'
import { QRScannerModal, type BoteStation } from './components/QRScannerModal'

export const App: React.FC = () => {
  // Modo de pantalla principal: 'splash' (Bote Inteligente) | 'app' (Aplicación móvil)
  const [screenMode, setScreenMode] = useState<'splash' | 'app'>('app')

  // Pestaña activa dentro de la app móvil: 'home' | 'history' | 'store' | 'profile' | 'qr'
  const [activeTab, setActiveTab] = useState<NavTab>('home')

  // Estado del Escáner QR obligatorio para acreditar botellas
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [preselectedStation, setPreselectedStation] = useState<BoteStation | undefined>(undefined)

  // Mensaje flotante de alerta / felicitación
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Estado del usuario con persistencia en localStorage
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('beachpoints_user_v2')
    return saved
      ? JSON.parse(saved)
      : {
          id: 'BP-84920',
          firstName: 'Alex',
          lastName: 'Fernández',
          points: 230,
          totalWasteCollected: 12,
          totalKg: 3.2,
          activeDays: 7,
          tier: 'Plata',
        }
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
    localStorage.setItem('beachpoints_user_v2', JSON.stringify(user))
  }, [user])

  useEffect(() => {
    localStorage.setItem('beachpoints_movements_v2', JSON.stringify(movements))
  }, [movements])

  // Mostrar mensaje de aviso con autocierre
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr))
    }, 4000)
  }

  // Abrir el escáner QR obligatorio
  const handleOpenScanner = (station?: BoteStation) => {
    setPreselectedStation(station)
    setIsScannerOpen(true)
  }

  // Lógica de depósito de residuos TRAS ESCANEAR EL CÓDIGO QR
  const handleDepositFromScan = (bottlesCount: number, station: BoteStation) => {
    const earnedPoints = bottlesCount * 10
    const addedKg = Number((bottlesCount * 0.25).toFixed(1))

    setUser((prev) => {
      const newTotalWaste = prev.totalWasteCollected + bottlesCount
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
      subtitle: `${bottlesCount} envase${bottlesCount > 1 ? 's' : ''} · ${station.location} · QR Verificado`,
      points: earnedPoints,
      date: 'Recién verificado por QR',
    }

    setMovements((prev) => [newMov, ...prev])
    showToast(`¡Código QR verificado! Depositaste ${bottlesCount} envase${bottlesCount > 1 ? 's' : ''} en ${station.name} y ganaste +${earnedPoints} puntos.`)
  }

  // Lógica de canje de cupón o producto
  const handleRedeemVoucher = (voucher: ActiveVoucher) => {
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
    setUser(defaultUser)
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

  // SI ESTÁ EN PANTALLA 1: SPLASH / INFOGRAFÍA BOTE INTELIGENTE
  if (screenMode === 'splash') {
    return (
      <SplashView
        onEnterApp={() => setScreenMode('app')}
        onScanBin={() => {
          setScreenMode('app')
          handleOpenScanner()
        }}
        userPoints={user.points}
      />
    )
  }

  // PANTALLA 2: APLICACIÓN MÓVIL BEACHPOINTS
  return (
    <div
      style={{
        maxWidth: '440px',
        margin: '0 auto',
        minHeight: '100vh',
        backgroundColor: '#1b6826',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      }}
    >
      {/* Barra de estado superior del móvil (9:01, señal, batería) */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 20px 4px',
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

      {/* Encabezado: ¡Hola, Alex! + Botón al Splash del Bote */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 20px 10px',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 900, letterSpacing: '-0.3px', color: '#ffffff' }}>
            ¡Hola, {user.firstName}!
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#bbf7d0', opacity: 0.9 }}>
            Sigue haciendo la diferencia
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Botón para volver a la infografía del Bote Inteligente */}
          <button
            onClick={() => setScreenMode('splash')}
            title="Ver Prototipo de Bote Inteligente"
            style={{
              background: 'rgba(255,255,255,0.18)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '6px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>🗑️</span>
            <span>Bote Info</span>
          </button>

          {/* Mascota del planeta con hojita */}
          <div style={{ cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
            <PlanetMascot size={42} />
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
          <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.5px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
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

      {/* Contenido Principal según la pestaña activa */}
      <main style={{ flex: 1, padding: '16px 18px 90px', overflowY: 'auto' }}>
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
          <ProfileView user={user} onResetDemo={handleResetDemo} />
        )}
      </main>

      {/* MODAL OBLIGATORIO DE ESCÁNER QR PARA ACREDITAR BOTELLES */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onDepositSuccess={handleDepositFromScan}
        preselectedStation={preselectedStation}
      />

      {/* Barra de Navegación Inferior Móvil con Botón Escáner Flotante */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onQuickRecycle={() => handleOpenScanner()}
      />
    </div>
  )
}

export default App
