import React from 'react'

export type NavTab = 'home' | 'history' | 'store' | 'profile' | 'qr'

interface Props {
  activeTab: NavTab
  onSelectTab: (tab: NavTab) => void
  onQuickRecycle: () => void
  ratioMode?: 'android' | 'windows'
}

export const BottomNavBar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  onQuickRecycle,
  ratioMode = 'android',
}) => {
  return (
    <footer
      className={`bottom-nav-shell mode-${ratioMode}`}
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: ratioMode === 'windows' ? 'min(860px, 94vw)' : '440px',
        height: 'calc(68px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopLeftRadius: '22px',
        borderTopRightRadius: '22px',
        paddingLeft: '8px',
        paddingRight: '8px',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.12)',
        zIndex: 50,
      }}
    >
      {/* 1. Inicio */}
      <button
        onClick={() => onSelectTab('home')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          flex: 1,
          padding: '6px 0',
        }}
      >
        <span style={{ fontSize: '18px' }}>🏠</span>
        <span
          style={{
            fontSize: '11px',
            color: activeTab === 'home' ? '#166534' : '#64748b',
            fontWeight: activeTab === 'home' ? 800 : 500,
            marginTop: '2px',
          }}
        >
          Inicio
        </span>
      </button>

      {/* 2. Historial */}
      <button
        onClick={() => onSelectTab('history')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          flex: 1,
          padding: '6px 0',
        }}
      >
        <span style={{ fontSize: '18px' }}>🕒</span>
        <span
          style={{
            fontSize: '11px',
            color: activeTab === 'history' ? '#166534' : '#64748b',
            fontWeight: activeTab === 'history' ? 800 : 500,
            marginTop: '2px',
          }}
        >
          Historial
        </span>
      </button>

      {/* 3. Botón Flotante Central (Escanear QR del Bote) */}
      <div style={{ position: 'relative', top: '-16px', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <button
          onClick={onQuickRecycle}
          title="Escanear QR del Bote Inteligente para Depositar"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#166534',
            border: '4px solid #ffffff',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 14px rgba(22, 101, 52, 0.4)',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {/* Icono de Escáner QR / Código de barras de la maqueta */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <line x1="7" y1="12" x2="17" y2="12" stroke="#4ade80" strokeWidth="2" />
            <line x1="8" y1="7" x2="8" y2="9" stroke="#ffffff" strokeWidth="2" />
            <line x1="12" y1="7" x2="12" y2="9" stroke="#ffffff" strokeWidth="2" />
            <line x1="16" y1="7" x2="16" y2="9" stroke="#ffffff" strokeWidth="2" />
            <line x1="8" y1="15" x2="8" y2="17" stroke="#ffffff" strokeWidth="2" />
            <line x1="12" y1="15" x2="12" y2="17" stroke="#ffffff" strokeWidth="2" />
            <line x1="16" y1="15" x2="16" y2="17" stroke="#ffffff" strokeWidth="2" />
          </svg>
        </button>
        <span
          style={{
            fontSize: '10px',
            color: '#166534',
            fontWeight: 800,
            marginTop: '1px',
          }}
        >
          Escanear
        </span>
      </div>

      {/* 4. Tienda */}
      <button
        onClick={() => onSelectTab('store')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          flex: 1,
          padding: '6px 0',
        }}
      >
        <span style={{ fontSize: '18px' }}>🏪</span>
        <span
          style={{
            fontSize: '11px',
            color: activeTab === 'store' ? '#166534' : '#64748b',
            fontWeight: activeTab === 'store' ? 800 : 500,
            marginTop: '2px',
          }}
        >
          Tienda
        </span>
      </button>

      {/* 5. Perfil */}
      <button
        onClick={() => onSelectTab('profile')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          flex: 1,
          padding: '6px 0',
        }}
      >
        <span style={{ fontSize: '18px' }}>👤</span>
        <span
          style={{
            fontSize: '11px',
            color: activeTab === 'profile' ? '#166534' : '#64748b',
            fontWeight: activeTab === 'profile' ? 800 : 500,
            marginTop: '2px',
          }}
        >
          Perfil
        </span>
      </button>
    </footer>
  )
}
