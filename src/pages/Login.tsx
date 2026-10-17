import { useState, type FormEvent } from 'react'
import { useApp } from '../context/AppContext'
import { IconWave } from '../components/Icons'

export function Login() {
  const { authPhase, authError, demoCode, pendingEmail, requestCode, verifyCode, completeProfile, loadDemo } =
    useApp()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  function onEmail(event: FormEvent) {
    event.preventDefault()
    requestCode(email)
  }

  function onCode(event: FormEvent) {
    event.preventDefault()
    verifyCode(code)
  }

  function onName(event: FormEvent) {
    event.preventDefault()
    completeProfile(firstName, lastName)
  }

  function fillProvider(domain: string) {
    const local = email.includes('@') ? email.split('@')[0] : email || 'you'
    setEmail(`${local}@${domain}`)
  }

  return (
    <div className="screen login">
      <header className="login-hero">
        <div className="brand-mark">
          <IconWave />
        </div>
        <p className="eyebrow">Seaside recycling · local store credit</p>
        <h1>BeachPoints</h1>
        <p className="lede">
          Drop bottles at the beach bin, earn points on your name, and redeem them at partner shops.
        </p>
      </header>

      {authPhase === 'email' && (
        <form className="card form" onSubmit={onEmail}>
          <h2>Sign in</h2>
          <p className="hint">Use a Gmail, Hotmail, Outlook, or any personal email. We email a one-time code.</p>
          <label>
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              required
            />
          </label>
          <div className="provider-row">
            <button type="button" className="ghost" onClick={() => fillProvider('gmail.com')}>
              Gmail
            </button>
            <button type="button" className="ghost" onClick={() => fillProvider('hotmail.com')}>
              Hotmail
            </button>
            <button type="button" className="ghost" onClick={() => fillProvider('outlook.com')}>
              Outlook
            </button>
          </div>
          {authError && <p className="error">{authError}</p>}
          <button type="submit" className="primary">
            Email me a code
          </button>
          <button type="button" className="text-btn" onClick={loadDemo}>
            Preview as Alex (230 points)
          </button>
        </form>
      )}

      {authPhase === 'code' && (
        <form className="card form" onSubmit={onCode}>
          <h2>Enter your code</h2>
          <p className="hint">Sent to {pendingEmail}. In this demo the code appears below — no inbox required.</p>
          {demoCode && (
            <div className="demo-inbox" role="status">
              <span>Demo inbox</span>
              <strong>{demoCode}</strong>
            </div>
          )}
          <label>
            6-digit code
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="000000"
              required
            />
          </label>
          {authError && <p className="error">{authError}</p>}
          <button type="submit" className="primary">
            Continue
          </button>
        </form>
      )}

      {authPhase === 'name' && (
        <form className="card form" onSubmit={onName}>
          <h2>Personalize your account</h2>
          <p className="hint">The bin credits the person on the QR. First and last name are required.</p>
          <label>
            First name
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </label>
          <label>
            Last name
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </label>
          {authError && <p className="error">{authError}</p>}
          <button type="submit" className="primary">
            Create my BeachPoints
          </button>
        </form>
      )}
    </div>
  )
}
