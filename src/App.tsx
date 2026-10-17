import { NavBar } from './components/NavBar'
import { useApp } from './context/AppContext'
import { History } from './pages/History'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Notices } from './pages/Notices'
import { Rank } from './pages/Rank'
import { Recycle } from './pages/Recycle'
import { Rewards } from './pages/Rewards'

export default function App() {
  const { user, tab } = useApp()

  if (!user) {
    return (
      <div className="shell">
        <Login />
      </div>
    )
  }

  return (
    <div className="shell">
      {tab === 'home' && <Home />}
      {tab === 'history' && <History />}
      {tab === 'recycle' && <Recycle />}
      {tab === 'rewards' && <Rewards />}
      {tab === 'rank' && <Rank />}
      <Notices />
      <NavBar />
    </div>
  )
}
