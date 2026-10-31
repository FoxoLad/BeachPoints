import React, { useState } from 'react';

interface Props {
  onLogWaste: (type: string, quantity: number) => void;
}

export const WasteLogger: React.FC<Props> = ({ onLogWaste }) => {
  const [wasteType, setWasteType] = useState('Botellas Plásticas');
  const [quantity, setQuantity] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;
    onLogWaste(wasteType, quantity);
    setQuantity(5);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <label>
        Tipo de desecho:
        <select 
          value={wasteType} 
          onChange={(e) => setWasteType(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '6px' }}
        >
          <option value="Botellas Plásticas">Botellas Plásticas</option>
          <option value="Latas de Aluminio">Latas de Aluminio</option>
          <option value="Tapas y Microplásticos">Tapas y Microplásticos</option>
          <option value="Colillas de Cigarro">Colillas de Cigarro</option>
          <option value="Vidrio">Vidrio</option>
        </select>
      </label>

      <label>
        Cantidad recolectada:
        <input 
          type="number" 
          min="1" 
          value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{ width: '100%', padding: '8px', borderRadius: '6px' }}
        />
      </label>

      <button 
        type="submit" 
        style={{ padding: '10px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        Registrar Desechos y Sumar Puntos
      </button>
    </form>
  );
};