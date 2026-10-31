import React from 'react'
import type { UserProfile } from '../types'

interface Props {
  user: UserProfile
  onResetDemo: () => void
}

export const ProfileView: React.FC<Props> = ({ user, onResetDemo }) => {
  const tiers = [
    { name: 'Bronce', min: 0 },
    { name: 'Plata', min: 10 },
    { name: 'Oro', min: 25 },
    { name: 'Diamante', min: 50 },
  ]

  const nextTier = tiers.find((t) => t.min > user.totalWasteCollected) ?? { name: 'Leyenda', min: 100 }
  const needed = Math.max(0, nextTier.min - user.totalWasteCollected)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Tarjeta de Perfil */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.14)',
        borderRadius: '16px',
        padding: '20px 16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
      }}>
        {/* Avatar */}
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #22c55e 0%, #166534 100%)',
          border: '3px solid #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          margin: '0 auto 10px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        }}>
          👤
        </div>

        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#ffffff' }}>
          {user.firstName} {user.lastName}
        </h2>
        <span style={{ fontSize: '11px', color: '#bbf7d0' }}>ID de Cuenta: {user.id}</span>

        {/* Badge de Rango */}
        <div style={{ marginTop: '12px' }}>
          <span style={{
            background: '#fef08a',
            color: '#854d0e',
            fontWeight: 800,
            fontSize: '12px',
            padding: '4px 14px',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <span>⭐</span>
            <span>Rango: {user.tier}</span>
          </span>
        </div>

        {/* Progreso al siguiente rango */}
        <div style={{ marginTop: '16px', textAlign: 'left', background: 'rgba(0,0,0,0.15)', padding: '12px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ffffff', marginBottom: '6px' }}>
            <span>Próximo nivel: <strong>{nextTier.name}</strong></span>
            <span>Faltan <strong>{needed} envases</strong></span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, (user.totalWasteCollected / nextTier.min) * 100)}%`,
              height: '100%',
              background: '#22c55e',
              borderRadius: '4px',
              transition: 'width 0.3s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Tarjeta Virtual RFID */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '16px',
        padding: '16px',
        color: '#ffffff',
        boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: '13px', letterSpacing: '1px', color: '#4ade80' }}>
            BEACHPOINTS PASS
          </div>
          <span style={{ fontSize: '18px' }}>(((•)))</span>
        </div>

        <div style={{ margin: '22px 0 14px', fontFamily: 'monospace', fontSize: '14px', letterSpacing: '3px', color: '#94a3b8' }}>
          •••• •••• •••• 8492
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '11px' }}>
          <div>
            <div style={{ fontSize: '8px', color: '#64748b', textTransform: 'uppercase' }}>Titular</div>
            <div style={{ fontWeight: 'bold' }}>{user.firstName.toUpperCase()} {user.lastName.toUpperCase()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '8px', color: '#64748b', textTransform: 'uppercase' }}>Puntos</div>
            <div style={{ fontWeight: 'bold', color: '#fef08a' }}>{user.points} PTS</div>
          </div>
        </div>
      </div>

      {/* Botón de reinicio de demo */}
      <button
        onClick={onResetDemo}
        style={{
          background: 'rgba(255,255,255,0.12)',
          color: '#ffffff',
          border: '1px solid rgba(255,255,255,0.25)',
          padding: '10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        🔄 Restablecer datos iniciales de la maqueta
      </button>
    </div>
  )
}
