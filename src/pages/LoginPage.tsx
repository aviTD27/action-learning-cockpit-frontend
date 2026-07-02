import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { loginUser } from '../api/authService'
import './auth.css'

const ROLE_ROUTES: Record<string, string> = {
  ROLE_SUPER_ADMIN:    '/super-admin',
  ROLE_PLATFORM_ADMIN: '/super-admin',
  ROLE_UNI_ADMIN:      '/uni-admin',
  ROLE_LECTURER:       '/lecturer',
  ROLE_STUDENT:        '/student',
}

export default function LoginPage() {
  const { isAuthenticated, role, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={ROLE_ROUTES[role ?? ''] ?? '/login'} replace />
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await loginUser(email, password)
      const { token } = res.data
      login(token)
      const payload = JSON.parse(atob(token.split('.')[1]))
      navigate(ROLE_ROUTES[payload.role] ?? '/login', { replace: true })
    } catch (err: any) {
      const status = err.response?.status
      const msg = err.response?.data?.message
      if (status === 403) {
        setError(msg ?? 'Your account has been deactivated. Please contact your administrator.')
      } else if (status === 401) {
        setError('Invalid email or password.')
      } else {
        setError(msg ?? 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-title">
            <GraduationCap size={20} /> ALC
          </div>
          <div className="auth-logo-sub">Action Learning Cockpit</div>
        </div>

        <h1 className="auth-heading">Sign in to your account</h1>

        {error && <div className="auth-error-banner">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="auth-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="auth-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          New university?{' '}
          <Link to="/request-access">Request access</Link>
        </p>
      </div>
    </div>
  )
}
