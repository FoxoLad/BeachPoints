import React, { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  userId: string;
  userName: string;
}

export const UserQR: React.FC<Props> = ({ userId, userName }) => {
  // Payload encoded inside the QR code
  const qrPayload = useMemo(() => JSON.stringify({
    app: 'BeachPoints',
    userId: userId,
    issuedAt: Date.now(),
  }), [userId]);

  return (
    <div style={{ textAlign: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
      <h3 style={{ margin: '0 0 0.5rem 0' }}>Tu Código QR de Depósito</h3>
      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
        Muéstralo en la estación de reciclaje o al voluntario supervisor para recibir puntos.
      </p>
      <div style={{ display: 'inline-block', padding: '12px', background: '#fff', borderRadius: '8px' }}>
        <QRCodeSVG value={qrPayload} size={180} />
      </div>
      <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>{userName}</p>
      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {userId}</span>
    </div>
  );
};
