import { RANK_STEP } from '../data/catalog'
import { useApp, useLeaderboard } from '../context/AppContext'
import { rankBand, tierFor, tiers } from '../lib/tiers'
import type { Redemption } from '../types'

export function Rank() {
  const { user, bottles, points, signOut, record } = useApp()
  const board = useLeaderboard(
    user,
    bottles,
    points + record.redemptions.reduce((sum: number, item: Redemption) => sum + item.points, 0)
  )
  if (!user) return null
  const tier = tierFor(bottles)
  const band = rankBand(bottles)
  const progress = ((band.step - band.untilNext) / band.step) * 100

  return (
    <div className="screen">
      <header className="page-head">
        <h1>Tiers & ranking</h1>
        <p>Friendly competition, with a lift every {RANK_STEP} bottles.</p>
      </header>

      <section className="card">
        <p className="eyebrow">Your tier</p>
        <h2 className="tier-name">{tier.label}</h2>
        <div className="tier-track">
          {tiers.map((item) => (
            <span key={item.id} className={item.id === tier.id ? 'on' : ''}>
              {item.label}
            </span>
          ))}
        </div>
        <p className="hint">
          {tier.next
            ? `${Math.max(tier.next - bottles, 0)} bottles to ${tiers.find((item) => item.minBottles === tier.next)?.label}.`
            : 'Diamond is the top beach crew. Keep the shoreline clear.'}
        </p>
      </section>

      <section className="card">
        <p className="eyebrow">{band.label}</p>
        <h2>Next rank in {band.untilNext} bottles</h2>
        <div className="meter" aria-hidden="true">
          <i style={{ width: `${progress}%` }} />
        </div>
        <p className="hint">Ranks move every 10–15 items collected. BeachPoints uses {RANK_STEP} as the step.</p>
      </section>

      <section className="card">
        <h2>Beach board</h2>
        <ol className="board">
          {board.map((row, index) => (
            <li key={row.id} className={row.isYou ? 'you' : ''}>
              <span className="place">{index + 1}</span>
              <span>
                {row.name}
                {row.isYou ? ' · you' : ''}
              </span>
              <span>
                {row.bottles} bottles · {row.points} pts
              </span>
            </li>
          ))}
        </ol>
      </section>

      <button type="button" className="text-btn" onClick={signOut}>
        Sign out {user.email}
      </button>
    </div>
  )
}
