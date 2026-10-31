import React from 'react'
import type { MovementRecord } from '../types'

interface Props {
  movements: MovementRecord[]
  currentPoints: number
  onBack: () => void
}

export const HistoryView: React.FC<Props> = ({ movements, currentPoints, onBack }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.14)',
        borderRadius: '16px',
        padding: '16px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#ffffff', textTransform: 'uppercase' }}>
              Historial de Movimientos
            </h2>
            <span style={{ fontSize: '11px', color: '#bbf7d0' }}>Balance actual: {currentPoints} pts</span>
          </div>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ← Volver
          </button>
        </div>

        {movements.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#cbd5e1', fontSize: '13px', margin: '20px 0' }}>
            Aún no tienes movimientos registrados. ¡Prueba reciclando un envase!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {movements.map((mov) => (
              <div
                key={mov.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  background: 'rgba(0, 0, 0, 0.15)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: mov.type === 'deposito' ? '#22c55e' : '#f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                  }}>
                    {mov.type === 'deposito' ? '♻️' : '🏷️'}
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#ffffff', display: 'block' }}>{mov.title}</strong>
                    <span style={{ fontSize: '10px', color: '#bbf7d0' }}>{mov.subtitle} · {mov.date}</span>
                  </div>
                </div>

                <div style={{
                  fontSize: '14px',
                  fontWeight: 900,
                  color: mov.type === 'deposito' ? '#4ade80' : '#fca5a5',
                }}>
                  {mov.type === 'deposito' ? `+${mov.points}` : `-${mov.points}`} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
