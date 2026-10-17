import { QRCodeSVG } from 'qrcode.react'
import { useApp } from '../context/AppContext'
import { IconBell, IconStar, IconWave } from '../components/Icons'
import { tierFor } from '../lib/tiers'

export function Home() {
  const { user, points, bottles, kg, activeDays, qrPayload, setTab, setNoticeOpen, record } = useApp()
  if (!user) return null
  const unread = record.notices.filter((item) => !item.read).length
  const tier = tierFor(bottles)

  return (
    <div className="screen">
      <header className="top">
        <div>
          <h1>Hi, {user.firstName}!</h1>
          <p>Keep making a difference</p>
        </div>
        <div className="top-actions">
          <button type="button" className="icon-btn" onClick={() => setNoticeOpen(true)} aria-label="Notifications">
            <IconBell />
            {unread > 0 && <span className="badge">{unread}</span>}
          </button>
          <div className="globe">
            <IconWave />
          </div>
        </div>
      </header>

      <section className="points-card">
        <p>Your points</p>
        <div className="points-row">
          <span className="points">{points}</span>
          <span className="star">
            <IconStar />
          </span>
        </div>
        <div className="tier-chip">{tier.label} tier</div>
        <button type="button" className="link" onClick={() => setTab('history')}>
          Movement history
        </button>
      </section>

      <section className="card">
        <h2>Your impact</h2>
        <div className="stats">
          <div>
            <strong>{bottles}</strong>
            <span>Bottles recycled</span>
          </div>
          <div>
            <strong>{kg} kg</strong>
            <span>Waste diverted</span>
          </div>
          <div>
            <strong>{activeDays}</strong>
            <span>Days active</span>
          </div>
        </div>
      </section>

      <section className="card qr-card">
        <h2>Scan to recycle</h2>
        <p className="hint">Show this personal code at the seaside bin. Points land on {user.firstName} {user.lastName}.</p>
        <div className="qr-wrap">
          <QRCodeSVG value={qrPayload} size={168} level="M" includeMargin />
        </div>
        <button type="button" className="ghost wide" onClick={() => setTab('recycle')}>
          Or tap your BeachPoints RFID
        </button>
      </section>
    </div>
  )
}
