import { useApp } from '../context/AppContext'

function when(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function Notices() {
  const { record, noticeOpen, setNoticeOpen, markNoticesRead, points } = useApp()
  if (!noticeOpen) return null

  return (
    <div className="sheet" role="dialog" aria-labelledby="notices-title">
      <div className="sheet-panel">
        <header>
          <h2 id="notices-title">Reminders</h2>
          <button type="button" className="ghost compact" onClick={() => setNoticeOpen(false)}>
            Close
          </button>
        </header>
        <p className="hint">Balance updates plus a nudge to keep collecting. You currently have {points} points.</p>
        <ul className="notice-list">
          {record.notices.length === 0 && <li className="hint">No reminders yet.</li>}
          {record.notices.map((item) => (
            <li key={item.id} className={item.read ? 'read' : ''}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
              <time>{when(item.at)}</time>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="primary"
          onClick={() => {
            markNoticesRead()
            setNoticeOpen(false)
          }}
        >
          Mark reminders read
        </button>
      </div>
    </div>
  )
}
