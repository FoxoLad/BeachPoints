import React, { useState } from 'react'
import type { CouponReward, EcoProductReward, ActiveVoucher } from '../types'
import {
  OxxoLogo,
  GoMartLogo,
  SixLogo,
  NaturaLogo,
  ThermosIllustration,
  CapIllustration,
  ToteBagIllustration,
  SnackIllustration,
} from './BrandLogos'

const COUPONS_DATA: CouponReward[] = [
  {
    id: 'oxxo-10',
    storeName: 'OXXO',
    discount: '10% DESCUENTO',
    points: 300,
    description: 'Válido en cualquier compra en tiendas OXXO participantes.',
    validity: '30 días desde el canje',
    barcode: '7501009849201',
  },
  {
    id: 'gomart-15',
    storeName: 'GO MART',
    discount: '15% DESCUENTO',
    points: 600,
    description: 'Aplica en snacks, bebidas frías y productos seleccionados.',
    validity: '30 días desde el canje',
    barcode: '7502391048293',
  },
  {
    id: 'six-20',
    storeName: 'SIX',
    discount: '20% DESCUENTO',
    points: 1000,
    description: 'Válido en compras mínimas de $100 MXN en sucursales SIX.',
    validity: '30 días desde el canje',
    barcode: '7503928174920',
  },
  {
    id: 'natura-25',
    storeName: 'NATURA',
    discount: '25% DESCUENTO',
    points: 1600,
    description: 'En toda la línea de jabones orgánicos y cuidado personal ecológico.',
    validity: '45 días desde el canje',
    barcode: '7504819203812',
  },
]

const PRODUCTS_DATA: EcoProductReward[] = [
  {
    id: 'thermo-750',
    name: 'Termo reutilizable',
    points: 6300,
    description: 'Acero inoxidable grado alimenticio 750ml. Mantiene bebidas frías 24 hrs.',
    imageKey: 'thermo',
    specs: 'Doble pared térmica · Libre de BPA',
  },
  {
    id: 'eco-cap',
    name: 'Gorra ecológica',
    points: 1600,
    description: 'Confeccionada con fibra 100% poliéster reciclado de botellas del mar.',
    imageKey: 'cap',
    specs: 'Ajustable · Protección UV50+',
  },
  {
    id: 'tote-bag',
    name: 'Bolsa de tela',
    points: 1200,
    description: 'Algodón orgánico resistente. Reemplaza más de 500 bolsas plásticas al año.',
    imageKey: 'tote',
    specs: 'Lavable · Carga hasta 15 kg',
  },
  {
    id: 'snack-eco',
    name: 'Snack saludable',
    points: 600,
    description: 'Barrita artesanal de amaranto inflado, semillas de girasol y miel de agave.',
    imageKey: 'snack',
    specs: 'Sin azúcar añadida · Vegano',
  },
]

interface Props {
  userPoints: number
  onRedeem: (voucher: ActiveVoucher) => void
  onOpenHistory: () => void
}

export const StoreSection: React.FC<Props> = ({ userPoints, onRedeem, onOpenHistory }) => {
  const [activeCategory, setActiveCategory] = useState<'cupones' | 'productos'>('cupones')
  const [voucherModal, setVoucherModal] = useState<ActiveVoucher | null>(null)
  const [copied, setCopied] = useState(false)

  const handleRedeemCoupon = (coupon: CouponReward) => {
    if (userPoints < coupon.points) {
      alert(`Puntos insuficientes. Tienes ${userPoints} pts y necesitas ${coupon.points} pts. ¡Recicla ${Math.ceil((coupon.points - userPoints) / 10)} botellas más!`)
      return
    }

    const newVoucher: ActiveVoucher = {
      code: `BP-${coupon.storeName.replace(/\s+/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `Cupón ${coupon.storeName}`,
      discountOrReward: coupon.discount,
      pointsSpent: coupon.points,
      date: new Date().toLocaleDateString('es-MX'),
      barcode: coupon.barcode,
    }

    onRedeem(newVoucher)
    setVoucherModal(newVoucher)
  }

  const handleRedeemProduct = (prod: EcoProductReward) => {
    if (userPoints < prod.points) {
      alert(`Puntos insuficientes. Tienes ${userPoints} pts y necesitas ${prod.points} pts. ¡Recicla ${Math.ceil((prod.points - userPoints) / 10)} botellas más!`)
      return
    }

    const newVoucher: ActiveVoucher = {
      code: `BP-PROD-${Math.floor(1000 + Math.random() * 9000)}`,
      title: prod.name,
      discountOrReward: '1 Producto Físico en Tienda Aliada',
      pointsSpent: prod.points,
      date: new Date().toLocaleDateString('es-MX'),
      barcode: `84920${Math.floor(100000 + Math.random() * 900000)}`,
    }

    onRedeem(newVoucher)
    setVoucherModal(newVoucher)
  }

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Selector de Sección de Canje (Cupones vs Productos Físicos) */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.22)',
        padding: '4px',
        borderRadius: '14px',
        display: 'flex',
        gap: '4px',
      }}>
        <button
          onClick={() => setActiveCategory('cupones')}
          style={{
            flex: 1,
            padding: '10px 6px',
            borderRadius: '10px',
            border: 'none',
            background: activeCategory === 'cupones' ? '#ffffff' : 'transparent',
            color: activeCategory === 'cupones' ? '#166534' : '#ffffff',
            fontWeight: 800,
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: activeCategory === 'cupones' ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
          }}
        >
          <span>🏪</span>
          <span>Cupones en Tiendas</span>
        </button>

        <button
          onClick={() => setActiveCategory('productos')}
          style={{
            flex: 1,
            padding: '10px 6px',
            borderRadius: '10px',
            border: 'none',
            background: activeCategory === 'productos' ? '#ffffff' : 'transparent',
            color: activeCategory === 'productos' ? '#166534' : '#ffffff',
            fontWeight: 800,
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: activeCategory === 'productos' ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
          }}
        >
          <span>🎁</span>
          <span>Productos Ecológicos</span>
        </button>
      </div>

      {/* SECCIÓN 1: CUPONES EN TIENDAS DE CONVENIENCIA (OXXO, GO MART, SIX) */}
      {activeCategory === 'cupones' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '12px', opacity: 0.9, padding: '0 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Descuentos inmediatos al pagar en caja:</span>
            <button
              onClick={onOpenHistory}
              style={{ background: 'none', border: 'none', color: '#fef08a', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline', fontWeight: 700 }}
            >
              Mis Canjes ›
            </button>
          </div>

          {COUPONS_DATA.map((coupon) => {
            const canAfford = userPoints >= coupon.points
            return (
              <div
                key={coupon.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.14)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                }}
              >
                {/* Fila superior: Logo y porcentaje de descuento */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ background: '#ffffff', borderRadius: '10px', padding: '4px 8px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    {coupon.storeName === 'OXXO' && <OxxoLogo width={92} height={36} />}
                    {coupon.storeName === 'GO MART' && <GoMartLogo width={100} height={36} />}
                    {coupon.storeName === 'SIX' && <SixLogo width={100} height={38} />}
                    {coupon.storeName === 'NATURA' && <NaturaLogo size="sm" />}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', letterSpacing: '0.5px' }}>
                      {coupon.discount}
                    </div>
                    <span style={{ fontSize: '10px', color: '#bbf7d0', opacity: 0.9 }}>{coupon.validity}</span>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '11px', color: '#e2e8f0', lineHeight: 1.3 }}>
                  {coupon.description}
                </p>

                {/* Fila inferior: Costo en puntos y botón de canje */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '17px', fontWeight: 900, color: '#ffffff' }}>{coupon.points}</span>
                    <span style={{ fontSize: '13px', color: '#fef08a' }}>★ puntos</span>
                  </div>

                  <button
                    onClick={() => handleRedeemCoupon(coupon)}
                    disabled={!canAfford}
                    style={{
                      background: canAfford ? '#ffffff' : 'rgba(255,255,255,0.25)',
                      color: canAfford ? '#166534' : 'rgba(255,255,255,0.6)',
                      border: 'none',
                      padding: '7px 20px',
                      borderRadius: '20px',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: canAfford ? 'pointer' : 'not-allowed',
                      boxShadow: canAfford ? '0 3px 8px rgba(0,0,0,0.2)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {canAfford ? 'Canjear' : `Faltan ${coupon.points - userPoints} pts`}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* SECCIÓN 2: PRODUCTOS ECOLÓGICOS FÍSICOS (TERMO, GORRA, BOLSA, SNACK) */}
      {activeCategory === 'productos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '12px', opacity: 0.9, padding: '0 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Premios ecológicos para recoger en tienda:</span>
            <span style={{ fontWeight: 700, color: '#fef08a' }}>Saldo: {userPoints} pts</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            {PRODUCTS_DATA.map((prod) => {
              const canAfford = userPoints >= prod.points
              return (
                <div
                  key={prod.id}
                  style={{
                    background: '#ffffff',
                    color: '#1e293b',
                    borderRadius: '16px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Ilustración limpia del producto */}
                  <div style={{
                    width: '80px',
                    height: '90px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid #f1f5f9',
                  }}>
                    {prod.imageKey === 'thermo' && <ThermosIllustration size={65} />}
                    {prod.imageKey === 'cap' && <CapIllustration size={72} />}
                    {prod.imageKey === 'tote' && <ToteBagIllustration size={65} />}
                    {prod.imageKey === 'snack' && <SnackIllustration size={65} />}
                  </div>

                  {/* Detalles del producto */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0f172a' }}>
                      {prod.name}
                    </h3>
                    <p style={{ margin: '3px 0 6px', fontSize: '11px', color: '#64748b', lineHeight: 1.3 }}>
                      {prod.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 900, color: '#166534' }}>{prod.points}</span>
                      <span style={{ fontSize: '13px', color: '#d97706' }}>★ puntos</span>
                    </div>

                    <button
                      onClick={() => handleRedeemProduct(prod)}
                      disabled={!canAfford}
                      style={{
                        width: '100%',
                        background: canAfford ? '#16a34a' : '#cbd5e1',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontWeight: 700,
                        fontSize: '12px',
                        cursor: canAfford ? 'pointer' : 'not-allowed',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      {canAfford ? 'Canjear' : `Faltan ${prod.points - userPoints} pts`}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* MODAL EMERGENTE DE CUPÓN / VOUCHER CANJEADO */}
      {voucherModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 9999,
        }}>
          <div style={{
            background: '#ffffff',
            color: '#0f172a',
            borderRadius: '24px',
            padding: '24px 20px',
            maxWidth: '340px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            animation: 'scaleUp 0.25s ease',
          }}>
            <div style={{ fontSize: '42px', marginBottom: '4px' }}>🎉</div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#166534' }}>
              ¡Canje Exitoso!
            </h3>
            <p style={{ margin: '4px 0 16px', fontSize: '13px', color: '#64748b' }}>
              Presenta este cupón digital al momento de pagar en caja
            </p>

            {/* Tarjeta simulada de Cupón */}
            <div style={{
              background: '#f0fdf4',
              border: '2px dashed #16a34a',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#166534' }}>
                {voucherModal.title}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                {voucherModal.discountOrReward}
              </div>
              <div style={{
                background: '#ffffff',
                border: '1px solid #dcfce7',
                borderRadius: '8px',
                padding: '8px',
                margin: '10px 0 6px',
                fontFamily: 'monospace',
                fontSize: '16px',
                fontWeight: 'bold',
                letterSpacing: '2px',
                color: '#15803d',
              }}>
                {voucherModal.code}
              </div>

              {/* Código de barras simulado SVG */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 4px' }}>
                <svg width="200" height="36" viewBox="0 0 200 36">
                  {Array.from({ length: 45 }).map((_, i) => (
                    <rect
                      key={i}
                      x={i * 4.4 + 2}
                      y="2"
                      width={i % 3 === 0 ? 3 : i % 2 === 0 ? 1.5 : 2.5}
                      height="32"
                      fill="#0f172a"
                    />
                  ))}
                </svg>
              </div>
              <span style={{ fontSize: '10px', color: '#64748b' }}>Cód: {voucherModal.barcode}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => copyCode(voucherModal.code)}
                style={{
                  background: '#f1f5f9',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  padding: '9px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                {copied ? '✅ ¡Código copiado!' : '📋 Copiar Código'}
              </button>

              <button
                onClick={() => setVoucherModal(null)}
                style={{
                  background: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '11px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(22, 163, 74, 0.3)',
                }}
              >
                Listo, volver a la tienda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
