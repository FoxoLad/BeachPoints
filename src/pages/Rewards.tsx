import { useState } from 'react'
import { partners, rewards } from '../data/catalog'
import { useApp } from '../context/AppContext'

export function Rewards() {
  const { points, redeem } = useApp()
  const [message, setMessage] = useState<string | null>(null)

  return (
    <div className="screen">
      <header className="page-head">
        <h1>Redeem in store</h1>
        <p>Use your points for what you like.</p>
      </header>

      <div className="balance-pill">
        You have <strong>{points}</strong> points
      </div>
      {message && <p className="success">{message}</p>}

      <ul className="reward-list">
        {rewards.map((item) => {
          const affordable = points >= item.points
          return (
            <li key={item.id} className="reward-card">
              <div className="reward-emoji" aria-hidden="true">
                {item.emoji}
              </div>
              <div>
                <h2>{item.name}</h2>
                <p>
                  {item.points} points · {item.blurb}
                </p>
              </div>
              <button
                type="button"
                className="primary compact"
                disabled={!affordable}
                onClick={() => {
                  const result = redeem(item.id, item.name, item.points)
                  setMessage(result.message)
                }}
              >
                Redeem
              </button>
            </li>
          )
        })}
      </ul>

      <section className="card partners">
        <h2>Store partners</h2>
        <p className="hint">More allies, more benefits.</p>
        <div className="partner-row">
          {partners.map((partner) => (
            <div key={partner.id} className="partner">
              <strong>{partner.name}</strong>
              <span>{partner.tag}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
