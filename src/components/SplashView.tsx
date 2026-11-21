import React, { useState } from 'react'
import { SmartBinIllustration } from './BrandLogos'
import { QRCodeSVG } from 'qrcode.react'

interface Props {
  onEnterApp: () => void
  onScanBin: () => void
  userPoints: number
  ratioMode?: 'android' | 'windows'
}

export const SplashView: React.FC<Props> = ({
  onEnterApp,
  onScanBin,
  userPoints,
  ratioMode = 'android',
}) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)
  const binPulsing = false

  const features = [
    {
      id: 'rfid',
      title: 'LECTOR RFID / QR',
      desc: 'Identifica al usuario al escanear el código QR de la estación o acercar su tarjeta.',
      icon: '📶',
    },
    {
      id: 'sensor',
      title: 'SENSOR DE APERTURA',
      desc: 'La compuerta se abre de inmediato tras la validación óptica del código QR.',
      icon: '🔄',
    },
    {
      id: 'detector',
      title: 'DETECTOR DE RESIDUOS',
      desc: 'Reconoce botellas PET y latas; calcula peso exacto y créditos a transferir.',
      icon: '🔍',
    },
    {
      id: 'screen',
      title: 'PANTALLA CON CÓDIGO QR',
      desc: 'Genera el código QR de estación para que la app valide y habilite el depósito.',
      icon: '🖥️',
    },
  ]

  const steps = [
    { num: '1', title: 'Abres la app', desc: 'Inicias sesión con tu cuenta móvil', icon: '👤' },
    { num: '2', title: 'Escaneas el QR', desc: 'Obligatorio: enfocas el QR del bote', icon: '📷' },
    { num: '3', title: 'Depositas residuo', desc: 'Se abre la compuerta del contenedor', icon: '🍾' },
    { num: '4', title: 'Sumas puntos', desc: '+10 pts por envase acreditado', icon: '⭐' },
  ]

  return (
    <div
      className={`app-viewport-shell mode-${ratioMode}`}
      style={{
        maxWidth: ratioMode === 'windows' ? 'min(860px, 94vw)' : '440px',
        margin: '0 auto',
        minHeight: '100dvh',
        background: '#f4f7f4',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Barra superior con badge de estatus y Android Safespace */}
      <div
        style={{
          padding: 'calc(14px + env(safe-area-inset-top, 0px)) 20px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🌊</span>
          <span style={{ fontWeight: 800, fontSize: '18px', color: '#166534', letterSpacing: '-0.3px' }}>BeachPoints</span>
        </div>
        <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', fontWeight: 700, padding: '4px 10px', borderRadius: '14px' }}>
          PROTOTIPO V2.0
        </span>
      </div>

      <div style={{ padding: '0 20px 100px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Encabezado Principal de la Infografía */}
        <div style={{ textAlign: 'center', margin: '10px 0 16px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#14532d', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
            Prototipo de Bote Inteligente
          </h1>
          <p style={{ fontSize: '13px', color: '#4b5563', marginTop: '4px', fontWeight: 500 }}>
            Recicla, escanea tu código QR y gana puntos en comercios locales
          </p>
        </div>

        {/* Kiosco interactivo del Bote Inteligente */}
        <div style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)',
          borderRadius: '20px',
          padding: '20px 14px',
          boxShadow: '0 10px 25px rgba(20, 83, 45, 0.08)',
          border: '1px solid #dcfce7',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SmartBinIllustration width={210} height={290} active={binPulsing} />
          </div>

          {/* Badge del Código QR Oficial de la Estación */}
          <div
            style={{
              marginTop: '12px',
              background: '#ffffff',
              borderRadius: '16px',
              padding: '10px 14px',
              border: '1.5px dashed #16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase' }}>
                QR Oficial de Estación #01
              </span>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                Playa Norte · Muelle 3
              </div>
              <span style={{ fontSize: '10px', color: '#64748b' }}>
                Escaneo requerido para acreditar
              </span>
            </div>

            <div
              onClick={onScanBin}
              style={{
                background: '#f0fdf4',
                padding: '4px',
                borderRadius: '8px',
                border: '1px solid #bbf7d0',
                cursor: 'pointer',
              }}
              title="Haz clic para escanear este QR"
            >
              <QRCodeSVG value="BP-BIN-01-PLAYA-NORTE" size={48} />
            </div>
          </div>

          {/* Botón para abrir el escáner QR obligatorio */}
          <button
            onClick={onScanBin}
            style={{
              marginTop: '10px',
              width: '100%',
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 18px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>📷</span>
            <span>Escanear QR de este Bote (+10 pts/ud)</span>
          </button>
        </div>

        {/* Sensores y Componentes destacados */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
            Tecnología y Sensores del Bote
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {features.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveFeature(activeFeature === item.id ? null : item.id)}
                style={{
                  background: activeFeature === item.id ? '#dcfce7' : '#ffffff',
                  border: activeFeature === item.id ? '1.5px solid #16a34a' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  <strong style={{ fontSize: '11px', color: '#14532d', lineHeight: 1.2 }}>{item.title}</strong>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#4b5563', lineHeight: 1.3 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ¿CÓMO FUNCIONA? - 4 Pasos con énfasis en Escaneo de QR */}
        <div style={{
          marginTop: '22px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '16px 14px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '13px', fontWeight: 900, color: '#14532d', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
            ¿Cómo Funciona el Proceso?
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
            {steps.map((st) => (
              <div key={st.num} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#f0fdf4',
                  border: '1.5px solid #16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 6px',
                  fontSize: '16px',
                  color: '#15803d',
                  fontWeight: 'bold'
                }}>
                  {st.icon}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#1f2937', lineHeight: 1.2 }}>
                  {st.num}. {st.title}
                </div>
                <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '2px', lineHeight: 1.2 }}>
                  {st.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA para entrar a la Aplicación */}
        <div style={{ marginTop: '22px' }}>
          <button
            onClick={onEnterApp}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '14px',
              borderRadius: '14px',
              fontSize: '15px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(22, 101, 52, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>📱</span>
            <span>Abrir la Aplicación BeachPoints</span>
            <span style={{ fontSize: '18px' }}>›</span>
          </button>
          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
            Tienes <strong>{userPoints} puntos</strong> acumulados
          </div>
        </div>
      </div>
    </div>
  )
}
