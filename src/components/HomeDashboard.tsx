import React, { useState, useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import type { UserProfile } from '../types'
import { EcoStoreLogo, NaturaLogo, BioMarketLogo } from './BrandLogos'

interface Props {
  user: UserProfile
  onOpenScanner: () => void
  onOpenStore: () => void
}

export const HomeDashboard: React.FC<Props> = ({
  user,
  onOpenScanner,
  onOpenStore,
}) => {
  const [rfidActive, setRfidActive] = useState(false)
  const [rfidMsg, setRfidMsg] = useState<string | null>(null)

  const handleSimulateRfid = () => {
    setRfidActive(true)
    setRfidMsg('¡Tarjeta RFID detectada! Abriendo escáner óptico del bote...')
    setTimeout(() => {
      setRfidActive(false)
      setRfidMsg(null)
      onOpenScanner()
    }, 900)
  }

  const qrPayload = useMemo(
    () =>
      JSON.stringify({
        app: 'BeachPoints',
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
      }),
    [user.id, user.firstName, user.lastName],
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Mensaje flotante de simulación RFID */}
      {rfidMsg && (
        <div style={{
          background: '#22c55e',
          color: '#ffffff',
          padding: '10px 14px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 700,
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
        }}>
          💳 {rfidMsg}
        </div>
      )}

      {/* Tarjeta 1: Tu Impacto */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.14)',
        borderRadius: '16px',
        padding: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 800,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginBottom: '14px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>Tu impacto</span>
          <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '10px' }}>
            Nivel: {user.tier}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
          {/* Botes Usados */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '20px', marginBottom: '2px' }}>🗑️</span>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>{user.totalWasteCollected}</span>
            <span style={{ fontSize: '11px', color: '#bbf7d0', marginTop: '2px', lineHeight: 1.2 }}>
              Botes<br />usados
            </span>
          </div>

          <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />

          {/* Residuos Reciclados */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '20px', marginBottom: '2px' }}>♻️</span>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>{user.totalKg} kg</span>
            <span style={{ fontSize: '11px', color: '#bbf7d0', marginTop: '2px', lineHeight: 1.2 }}>
              Residuos<br />reciclados
            </span>
          </div>

          <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />

          {/* Días Activos */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '20px', marginBottom: '2px' }}>⏱️</span>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff' }}>{user.activeDays}</span>
            <span style={{ fontSize: '11px', color: '#bbf7d0', marginTop: '2px', lineHeight: 1.2 }}>
              Días<br />activos
            </span>
          </div>
        </div>
      </div>

      {/* Tarjeta 2: Escanea para Reciclar / Mi Identificador */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.14)',
        borderRadius: '16px',
        padding: '18px 16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
      }}>
        <div style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px', color: '#ffffff' }}>
          Escanea para reciclar
        </div>
        <p style={{ margin: '0 0 12px', fontSize: '11px', color: '#e2e8f0' }}>
          Muestra este código al sensor óptico del bote inteligente
        </p>

        {/* QR Code Container */}
        <div style={{
          display: 'inline-block',
          background: '#ffffff',
          padding: '12px',
          borderRadius: '14px',
          boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
        }}>
          <QRCodeSVG value={qrPayload} size={150} level="M" />
        </div>

        <div style={{ marginTop: '10px', fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
          {user.firstName} {user.lastName}
        </div>
        <div style={{ fontSize: '10px', color: '#bbf7d0' }}>ID: {user.id}</div>

        {/* Botón principal obligatorio: Escanear QR del Bote */}
        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={onOpenScanner}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 18px',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(34, 197, 94, 0.45)',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span style={{ fontSize: '18px' }}>📷</span>
            <span>Escanear QR del Bote para Reciclar</span>
          </button>

          <button
            onClick={handleSimulateRfid}
            style={{
              background: rfidActive ? '#22c55e' : 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '7px 14px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>(((•)))</span>
            <span>O vincular con tarjeta RFID</span>
          </button>

          <span style={{ fontSize: '10px', color: '#bbf7d0', opacity: 0.9 }}>
            ⚠️ Requisito: Debes escanear el código QR del Bote Inteligente para validar y acreditar tus botellas.
          </span>
        </div>
      </div>

      {/* Tarjeta 3: Notificaciones */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.14)',
        borderRadius: '16px',
        padding: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 800,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginBottom: '10px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span>🔔</span>
          <span>Notificaciones</span>
        </div>

        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          fontSize: '12px',
          lineHeight: 1.4,
          color: '#f0fdf4',
        }}>
          <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span>🪙</span>
            <span>Gana puntos extras por mantener tu racha diaria de reciclaje.</span>
          </li>
          <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span>🚀</span>
            <span>Nuevos retos ambientales: ¡Limpia 15 botellas este fin de semana!</span>
          </li>
          <li style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <span>🌟</span>
            <span>Promociones exclusivas: Descuentos en OXXO, Go Mart y Six activas.</span>
          </li>
        </ul>
      </div>

      {/* Tarjeta 4: Alianza con Tiendas */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.14)',
        borderRadius: '16px',
        padding: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 800,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          marginBottom: '12px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>Alianza con tiendas</span>
          <button
            onClick={onOpenStore}
            style={{
              background: 'none',
              border: 'none',
              color: '#fef08a',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Ver catálogo ›
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
          <EcoStoreLogo size="sm" />
          <NaturaLogo size="sm" />
          <BioMarketLogo size="sm" />
        </div>
      </div>

      {/* Banner Slogan Inferior: TÚ RECICLAS, TODOS GANAMOS */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.25)',
        borderRadius: '14px',
        padding: '12px 14px',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}>
        <span style={{ fontSize: '18px' }}>🏆</span>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#ffffff', letterSpacing: '0.6px' }}>
            TÚ RECICLAS, TODOS GANAMOS
          </div>
          <div style={{ fontSize: '10px', color: '#bbf7d0' }}>
            Menos basura, más puntos, un mejor planeta.
          </div>
        </div>
      </div>
    </div>
  )
}
