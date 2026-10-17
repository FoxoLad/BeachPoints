import { useApp } from '../context/AppContext'

function when(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function History() {
  const { record } = useApp()
  const rows = [
    ...record.collections.map((event) => ({
      id: event.id,
      at: event.at,
      title: `${event.quantity} PET bottle${event.quantity === 1 ? '' : 's'}`,
      detail: event.location,
      delta: `+${event.points}`,
      kind: 'in' as const,
    })),
    ...record.redemptions.map((event) => ({
      id: event.id,
      at: event.at,
      title: event.name,
      detail: 'Store redemption',
      delta: `−${event.points}`,
      kind: 'out' as const,
    })),
  ].sort((a, b) => b.at.localeCompare(a.at))

  return (
    <div className="screen">
      <header className="page-head">
        <h1>Collection history</h1>
        <p>Date and quantity for every drop, plus store redemptions.</p>
      </header>

      {rows.length === 0 ? (
        <section className="card">
          <p className="hint">No activity yet. Scan at the seaside bin to log your first bottles.</p>
        </section>
      ) : (
        <ol className="timeline">
          {rows.map((row) => (
            <li key={row.id} className="card timeline-item">
              <div>
                <h2>{row.title}</h2>
                <p>
                  {when(row.at)} · {row.detail}
                </p>
              </div>
              <strong className={row.kind}>{row.delta}</strong>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
