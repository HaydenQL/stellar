import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { IconStarLogo } from '@/components/ui/Icons.jsx'

export default function LoginPage() {
  const { signIn, signUp, error, clearError, loading, isConfigured } = useAuth()
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tag, setTag] = useState('')
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState('')

  const toggleMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'))
    clearError()
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setBusy(true)
    setSuccess('')

    if (mode === 'signup') {
      const data = await signUp(email, password, tag || email.split('@')[0])
      if (data) {
        setSuccess('Account created! Check your email to confirm, then sign in.')
        setMode('signin')
      }
    } else {
      await signIn(email, password)
    }
    setBusy(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <IconStarLogo />
          <div>
            <div className="login-brand-name">Stellar</div>
            <div className="login-brand-sub">Clip Engine</div>
          </div>
        </div>

        <h1 className="login-title">
          {mode === 'signin' ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="login-lead">
          {mode === 'signin'
            ? 'Sign in to access your clips and discover community content.'
            : 'Sign up to save clips to the cloud and share with friends.'}
        </p>

        {!isConfigured && (
          <div className="login-warning">
            ⚠️ Supabase not configured. Add <code>VITE_SUPABASE_URL</code> and{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file.
          </div>
        )}

        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {mode === 'signup' && (
            <div className="login-field">
              <label htmlFor="login-tag">Display Tag</label>
              <input
                id="login-tag"
                className="stellar-input"
                type="text"
                placeholder="YourName#0001"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
              />
            </div>
          )}
          <div className="login-field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              className="stellar-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              className="stellar-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>
          <button
            type="submit"
            className="stellar-btn stellar-btn--primary login-submit"
            disabled={busy || loading}
          >
            {busy ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="login-toggle">
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button type="button" className="login-link" onClick={toggleMode}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="login-link" onClick={toggleMode}>
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
