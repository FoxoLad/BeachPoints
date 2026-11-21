import React from 'react';
import type { StoreItem } from '../types';

const STORE_CATALOG: StoreItem[] = [
  { id: '1', name: 'Botella Térmica Reutilizable', cost: 6300, description: 'Mantén tus bebidas frías sin generar basura.', icon: '🍶' },
  { id: '2', name: 'Bolsa de Tela Ecológica', cost: 1200, description: 'Ideal para tus compras sin bolsas plásticas.', icon: '🛍️' },
  { id: '3', name: 'Protector Solar Biodegradable', cost: 200, description: 'Protege tu piel y cuida los arrecifes.', icon: '🧴' },
  { id: '4', name: 'Cupón $100 Restaurante Costero', cost: 300, description: 'Válido en comercios locales asociados.', icon: '☕' },
];

interface Props {
  currentPoints: number;
  onRedeem: (item: StoreItem) => void;
}

export const Store: React.FC<Props> = ({ currentPoints, onRedeem }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
      {STORE_CATALOG.map((item) => {
        const canAfford = currentPoints >= item.cost;
        return (
          <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem' }}>{item.icon}</div>
            <h4 style={{ margin: '0.5rem 0' }}>{item.name}</h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.description}</p>
            <p style={{ fontWeight: 'bold', color: '#0369a1' }}>{item.cost} Puntos</p>
            <button
              onClick={() => onRedeem(item)}
              disabled={!canAfford}
              style={{
                padding: '6px 12px',
                background: canAfford ? '#10b981' : '#cbd5e1',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: canAfford ? 'pointer' : 'not-allowed'
              }}
            >
              {canAfford ? 'Canjear' : 'Puntos insuficientes'}
            </button>
          </div>
        );
      })}
    </div>
  );
};