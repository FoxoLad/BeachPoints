import type { Tab } from '../types'
import { useApp } from '../context/AppContext'
import { IconGift, IconHistory, IconHome, IconRecycle, IconTrophy } from './Icons'

const items: { id: Tab; label: string; icon: typeof IconHome }[] = [
  { id: 'home', label: 'Home', icon: IconHome },
  { id: 'history', label: 'History', icon: IconHistory },
  { id: 'recycle', label: 'Recycle', icon: IconRecycle },
  { id: 'rewards', label: 'Store', icon: IconGift },
  { id: 'rank', label: 'Tiers', icon: IconTrophy },
]

export function NavBar() {
  const { tab, setTab } = useApp()
  return (
    <nav className="nav" aria-label="Main">
      {items.map((item) => {
        const Icon = item.icon
        const active = tab === item.id
        return (
          <button
            key={item.id}
            type="button"
            className={active ? 'nav-item active' : 'nav-item'}
            onClick={() => setTab(item.id)}
          >
            <Icon />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
