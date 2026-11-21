import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { type UserProfile, type WasteRecord, type StoreItem, type RankTier } from '../types';

// Descuentos basados en tu captura (OXXO, Go Mart, Six)
const STORE_ITEMS: StoreItem[] = [
  { id: '1', name: 'Cupón OXXO', cost: 300, description: '10% DESCUENTO', icon: '🏪' },
  { id: '2', name: 'Cupón GO MART', cost: 600, description: '15% DESCUENTO', icon: '🏪' },
  { id: '3', name: 'Cupón SIX', cost: 1000, description: '20% DESCUENTO', icon: '🏪' }
];

export const App: React.FC = () => {
  // Pestaña activa: 'home' | 'history' | 'store' | 'profile' | 'qr'
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'store' | 'profile' | 'qr'>('home');

  // Perfil del usuario
  const [user, setUser] = useState<UserProfile & { totalKg: number }>({
    id: 'BP-94820',
    firstName: 'Alex',
    lastName: 'Fernández',
    points: 230,
    totalWasteCollected: 12,
    totalKg: 3.2,
    activeDays: 7,
    tier: 'Plata'
  });

  // Historial de recolección
  const [history, setHistory] = useState<WasteRecord[]>([
    { id: '1', date: '24/10/2026', type: 'Botellas PET', quantity: 6, pointsEarned: 120 },
    { id: '2', date: '22/10/2026', type: 'Latas Aluminio', quantity: 6, pointsEarned: 110 }
  ]);

  // Mensaje o notificación activa
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // Sistema de Ranking cada 10 a 15 desechos
  const getTier = (wasteCount: number): RankTier => {
    if (wasteCount < 15) return 'Bronce';
    if (wasteCount < 30) return 'Plata';
    if (wasteCount < 45) return 'Oro';
    return 'Diamante';
  };

  // Simular depósito de residuos al escanear
  const handleDepositSim = (bottles: number) => {
    const earned = bottles * 10;
    const newCount = user.totalWasteCollected + bottles;
    const newKg = Number((user.totalKg + (bottles * 0.05)).toFixed(1));
    const newTier = getTier(newCount);

    setUser((prev) => ({
      ...prev,
      points: prev.points + earned,
      totalWasteCollected: newCount,
      totalKg: newKg,
      tier: newTier
    }));

    const newRecord: WasteRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-MX'),
      type: 'Botellas y Latas',
      quantity: bottles,
      pointsEarned: earned
    };

    setHistory(prev => [newRecord, ...prev]);
    setAlertMsg(`¡Sumaste +${earned} puntos por ${bottles} envases depositados!`);
    setTimeout(() => setAlertMsg(null), 4000);
  };

  // Canjear cupón en la tienda
  const handleRedeem = (item: StoreItem) => {
    if (user.points < item.cost) {
      alert('Puntos insuficientes para este cupón.');
      return;
    }
    setUser((prev) => ({ ...prev, points: prev.points - item.cost }));
    setAlertMsg(`¡Canjeaste cupón de ${item.name}! Código generado.`);
    setTimeout(() => setAlertMsg(null), 4000);
  };

  return (
    <div style={styles.phoneContainer}>
      {/* Barra superior con hora y saludo */}
      <div style={styles.statusBar}>
        <span>9:01</span>
        <span>📶 🔋</span>
      </div>

      <header style={styles.header}>
        <h1 style={styles.greeting}>¡Hola, {user.firstName} {user.lastName}!</h1>
        <button style={styles.iconBtn} onClick={() => alert('Tienes retos activos y recordatorios pendientes.')}>
          🔔
        </button>
      </header>

      {/* Franja de Puntos en grande e Historial */}
      <div style={styles.pointsBar} onClick={() => setActiveTab('history')}>
        <div>
          <div style={styles.pointsTitle}>TUS PUNTOS: {user.points}</div>
          <div style={styles.pointsSubtitle}>Historial de movimientos</div>
        </div>
        <div style={styles.arrowIcon}>›</div>
      </div>

      {/* Notificación flotante informativa */}
      {alertMsg && (
        <div style={styles.toast}>
          🌱 {alertMsg}
        </div>
      )}

      {/* Contenido principal según pestaña */}
      <main style={styles.mainContent}>
        {/* PESTAÑA INICIO */}
        {activeTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Tarjeta: Tu Impacto */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>Tu impacto</div>
              <div style={styles.statsRow}>
                <div style={styles.statBox}>
                  <span style={styles.statNumber}>{user.totalWasteCollected}</span>
                  <span style={styles.statLabel}>Botes<br />usados</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statNumber}>{user.totalKg} kg</span>
                  <span style={styles.statLabel}>Residuos<br />reciclados</span>
                </div>
                <div style={styles.statBox}>
                  <span style={styles.statNumber}>{user.activeDays}</span>
                  <span style={styles.statLabel}>Días<br />activos</span>
                </div>
              </div>
              <div style={styles.tierBadge}>
                Rango: <strong>{user.tier}</strong> (Faltan {15 - (user.totalWasteCollected % 15)} para subir)
              </div>
            </div>

            {/* Tarjeta: Notificaciones y frases motivadoras */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>NOTIFICACIONES</div>
              <ul style={styles.notifList}>
                <li>🪙 Gana puntos extras por mantener tu racha diaria.</li>
                <li>🚀 Nuevo reto: ¡Limpia 15 botellas este fin de semana!</li>
                <li>🌟 "Cada envase que recoges mantiene el océano libre de plástico."</li>
              </ul>
            </div>

            {/* Tarjeta: Alianzas */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>ALIANZA CON TIENDAS</div>
              <div style={styles.brandsRow}>
                <div style={styles.brandBadge}>eco store</div>
                <div style={styles.brandBadge}>NATURA</div>
                <div style={styles.brandBadge}>Bio Market</div>
              </div>
            </div>

            <div style={styles.slogan}>TÚ RECICLAS, TODOS GANAMOS</div>
          </div>
        )}

        {/* PESTAÑA TIENDA */}
        {activeTab === 'store' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {STORE_ITEMS.map((item) => (
              <div key={item.id} style={styles.couponCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ ...styles.brandLogo, backgroundColor: item.logoBg, color: item.logoColor }}>
                    {item.name}
                  </div>
                  <div style={styles.discountText}>{item.discount}</div>
                </div>
                <div style={styles.couponFooter}>
                  <span style={styles.costText}>{item.cost} puntos</span>
                  <button style={styles.redeemBtn} onClick={() => handleRedeem(item)}>
                    Canjear
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PESTAÑA QR / ESCANEAR */}
        {activeTab === 'qr' && (
          <div style={styles.qrContainer}>
            <h2 style={{ margin: '0 0 6px 0', fontSize: '18px' }}>Tu Identificador QR</h2>
            <p style={{ fontSize: '13px', color: '#e2e8f0', margin: '0 0 16px 0' }}>
              Muestra este código ante el escáner de la máquina o al supervisor para acreditar tus puntos.
            </p>
            <div style={styles.qrWrapper}>
              <QRCodeSVG value={JSON.stringify({ user: user.id, name: `${user.firstName} ${user.lastName}` })} size={170} />
            </div>
            <div style={{ marginTop: '12px', fontWeight: 'bold' }}>{user.firstName} {user.lastName}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>ID: {user.id}</div>

            <div style={{ marginTop: '24px', width: '100%' }}>
              <p style={{ fontSize: '12px', marginBottom: '8px' }}>Simular depósito automático en estación:</p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button style={styles.simBtn} onClick={() => handleDepositSim(5)}>+5 Envases</button>
                <button style={styles.simBtn} onClick={() => handleDepositSim(10)}>+10 Envases</button>
                <button style={styles.simBtn} onClick={() => handleDepositSim(15)}>+15 Envases</button>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA HISTORIAL */}
        {activeTab === 'history' && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>HISTORIAL DE MOVIMIENTOS</div>
            {history.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#d1fae5' }}>Sin recolecciones registradas aún.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {history.map((rec) => (
                  <div key={rec.id} style={styles.historyRow}>
                    <div>
                      <strong>{rec.type}</strong> ({rec.quantity} pzas)
                      <div style={{ fontSize: '11px', opacity: 0.8 }}>{rec.date}</div>
                    </div>
                    <span style={styles.historyPoints}>+{rec.pointsEarned} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA PERFIL */}
        {activeTab === 'profile' && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>PERFIL DEL USUARIO</div>
            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
              <div><strong>Nombre:</strong> {user.firstName} {user.lastName}</div>
              <div><strong>ID de cuenta:</strong> {user.id}</div>
              <div><strong>Nivel actual:</strong> {user.tier}</div>
              <div><strong>Total recolectado:</strong> {user.totalWasteCollected} envases</div>
              <div><strong>Peso recuperado:</strong> {user.totalKg} kg</div>
            </div>
          </div>
        )}
      </main>

      {/* Barra de Navegación Inferior con Botón QR Flotante */}
      <footer style={styles.bottomNav}>
        <button style={styles.navItem} onClick={() => setActiveTab('home')}>
          <span style={styles.navIcon}>🏠</span>
          <span style={activeTab === 'home' ? styles.navLabelActive : styles.navLabel}>Inicio</span>
        </button>

        <button style={styles.navItem} onClick={() => setActiveTab('history')}>
          <span style={styles.navIcon}>🕒</span>
          <span style={activeTab === 'history' ? styles.navLabelActive : styles.navLabel}>Historial</span>
        </button>

        {/* Botón Central Flotante para Escanear / QR */}
        <div style={styles.qrFloatingWrapper}>
          <button style={styles.qrFloatingBtn} onClick={() => setActiveTab('qr')}>
            📷
          </button>
        </div>

        <button style={styles.navItem} onClick={() => setActiveTab('store')}>
          <span style={styles.navIcon}>🏪</span>
          <span style={activeTab === 'store' ? styles.navLabelActive : styles.navLabel}>Tienda</span>
        </button>

        <button style={styles.navItem} onClick={() => setActiveTab('profile')}>
          <span style={styles.navIcon}>👤</span>
          <span style={activeTab === 'profile' ? styles.navLabelActive : styles.navLabel}>Perfil</span>
        </button>
      </footer>
    </div>
  );
};

// Estilos visuales exactos a la maqueta verde
const styles: { [key: string]: React.CSSProperties } = {
  phoneContainer: {
    maxWidth: '420px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#1b6826',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 20px',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 20px 10px 20px',
  },
  greeting: {
    fontSize: '22px',
    fontWeight: 700,
    margin: 0,
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '18px',
    cursor: 'pointer',
  },
  pointsBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 20px 14px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    cursor: 'pointer',
  },
  pointsTitle: {
    fontSize: '17px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  pointsSubtitle: {
    fontSize: '12px',
    opacity: 0.85,
    marginTop: '2px',
  },
  arrowIcon: {
    fontSize: '22px',
    fontWeight: 300,
    opacity: 0.8,
  },
  toast: {
    backgroundColor: '#22c55e',
    color: '#ffffff',
    margin: '10px 20px 0 20px',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 600,
    boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
  },
  mainContent: {
    flex: 1,
    padding: '16px 20px 100px 20px',
    overflowY: 'auto',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    padding: '16px',
    backdropFilter: 'blur(10px)',
  },
  cardHeader: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '12px',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
  statBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: '20px',
    fontWeight: 800,
  },
  statLabel: {
    fontSize: '11px',
    marginTop: '4px',
    opacity: 0.85,
    lineHeight: '1.2',
  },
  tierBadge: {
    marginTop: '12px',
    fontSize: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '6px 10px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  notifList: {
    margin: 0,
    paddingLeft: '0',
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '12px',
    lineHeight: '1.4',
  },
  brandsRow: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'space-around',
  },
  brandBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    padding: '8px 14px',
    borderRadius: '10px',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  slogan: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: '13px',
    marginTop: '6px',
    letterSpacing: '0.8px',
    opacity: 0.95,
  },
  couponCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderRadius: '16px',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  brandLogo: {
    padding: '6px 16px',
    borderRadius: '8px',
    fontWeight: '900',
    fontSize: '18px',
    letterSpacing: '1px',
    display: 'inline-block',
  },
  discountText: {
    fontSize: '16px',
    fontWeight: '800',
    textAlign: 'right',
  },
  couponFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costText: {
    fontSize: '13px',
    fontWeight: '600',
    opacity: 0.9,
  },
  redeemBtn: {
    backgroundColor: '#ffffff',
    color: '#1b6826',
    border: 'none',
    padding: '6px 18px',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '13px',
    cursor: 'pointer',
  },
  qrContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    padding: '24px 16px',
    textAlign: 'center',
  },
  qrWrapper: {
    backgroundColor: '#ffffff',
    display: 'inline-block',
    padding: '14px',
    borderRadius: '12px',
  },
  simBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#ffffff',
    border: '1px solid rgba(255,255,255,0.4)',
    padding: '6px 10px',
    borderRadius: '8px',
    fontSize: '11px',
    cursor: 'pointer',
  },
  historyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    fontSize: '13px',
  },
  historyPoints: {
    fontWeight: 'bold',
    color: '#86efac',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '68px',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    padding: '0 8px',
  },
  navItem: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    flex: 1,
  },
  navIcon: {
    fontSize: '18px',
  },
  navLabel: {
    fontSize: '11px',
    color: '#475569',
    marginTop: '2px',
  },
  navLabelActive: {
    fontSize: '11px',
    color: '#1b6826',
    fontWeight: 'bold',
    marginTop: '2px',
  },
  qrFloatingWrapper: {
    position: 'relative',
    top: '-18px',
    display: 'flex',
    justifyContent: 'center',
  },
  qrFloatingBtn: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    backgroundColor: '#1b6826',
    border: '4px solid #ffffff',
    color: '#ffffff',
    fontSize: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
  },
};