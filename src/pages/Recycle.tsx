import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useApp } from '../context/AppContext'
import { POINTS_PER_BOTTLE } from '../data/catalog'

export function Recycle() {
  const { user, qrPayload, deposit, points } = useApp()
  const [qty, setQty] = useState(1)
  const [flash, setFlash] = useState<string | null>(null)
  if (!user) return null

  function drop() {
    deposit(qty)
    setFlash(`Bin accepted ${qty} bottle${qty === 1 ? '' : 's'} · +${qty * POINTS_PER_BOTTLE} points`)
  }

  return (
    <div className="screen">
      <header className="page-head">
        <h1>Seaside bin</h1>
        <p>Your live QR identifies which account to credit.</p>
      </header>

      <section className="card qr-card">
        <p className="eyebrow">Personal code · updates with each session</p>
        <div className="qr-wrap">
          <QRCodeSVG value={qrPayload} size={180} level="M" includeMargin />
        </div>
        <p className="mono">
          {user.firstName} {user.lastName}
          <br />
          {user.email}
        </p>
      </section>

      <section className="card">
        <h2>Demo drop</h2>
        <p className="hint">
          Hardware is not connected yet. Use this to simulate the beach-side unit reading your QR or RFID card.
        </p>
        <label>
          Bottles deposited
          <input
            type="number"
            min={1}
            max={15}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
        <button type="button" className="primary" onClick={drop}>
          Credit {qty * POINTS_PER_BOTTLE} points
        </button>
        {flash && <p className="success">{flash}</p>}
        <p className="muted">Balance after typical drop stays on Home in large type. Current: {points} points.</p>
      </section>
    </div>
  )
}
