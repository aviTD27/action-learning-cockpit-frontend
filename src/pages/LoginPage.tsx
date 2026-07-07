import { useEffect, useRef, useState } from 'react'
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

interface Particle {
  x: number; y: number; vx: number; vy: number; r: number; alpha: number
}

function useParticleCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const particles = useRef<Particle[]>([])
  const mouse = useRef({ x: 0, y: 0 })
  const animFrame = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const w = canvas.offsetWidth
    const h = canvas.offsetHeight
    particles.current = Array.from({ length: 35 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.25 + 0.05,
    }))

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const animate = () => {
      const cw = canvas.offsetWidth
      const ch = canvas.offsetHeight
      ctx.clearRect(0, 0, cw, ch)

      particles.current.forEach(p => {
        const dx = mouse.current.x - p.x
        const dy = mouse.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 160) {
          p.vx += dx * 0.00002
          p.vy += dy * 0.00002
        }
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99
        if (p.x < 0) p.x = cw
        if (p.x > cw) p.x = 0
        if (p.y < 0) p.y = ch
        if (p.y > ch) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`
        ctx.fill()
      })

      const pts = particles.current
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.sqrt((pts[i].x - pts[j].x) ** 2 + (pts[i].y - pts[j].y) ** 2)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(255,255,255,${0.04 * (1 - d / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animFrame.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouse)
    window.addEventListener('resize', resize)
    animate()

    return () => {
      cancelAnimationFrame(animFrame.current)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', resize)
    }
  }, [canvasRef])
}

export default function LoginPage() {
  const { isAuthenticated, role, login } = useAuth()
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useParticleCanvas(canvasRef)

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
    <div className="auth-split">
      {/* LEFT: Branded panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-shapes">
          <div className="auth-shape auth-shape-1" />
          <div className="auth-shape auth-shape-2" />
          <div className="auth-shape auth-shape-3" />
          <div className="auth-shape auth-shape-4" />
          <div className="auth-shape auth-shape-5" />
          <div className="auth-brand-dots" />
        </div>
        <canvas ref={canvasRef} className="auth-canvas" />
        <div className="auth-brand-content">
          <div className="auth-brand-icon">
            <GraduationCap size={26} />
          </div>
          <h1 className="auth-brand-title">Action Learning<br />Cockpit</h1>
          <p className="auth-brand-desc">
            One platform for teaching, submissions and grading — across all your universities.
          </p>
          <div className="auth-brand-stats">
            <div className="auth-stat">
              <div className="auth-stat-value">5+</div>
              <div className="auth-stat-label">Universities</div>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <div className="auth-stat-value">1.2k</div>
              <div className="auth-stat-label">Students</div>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <div className="auth-stat-value">99%</div>
              <div className="auth-stat-label">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-dots" />
        <div className="auth-form-container">
          <Link to="/" className="auth-back-link">
            ← Back to home
          </Link>

          <div className="auth-card-glass">
            <div className="auth-card-header">
              <h2 className="auth-card-title">Welcome back</h2>
              <p className="auth-card-subtitle">Sign in to your account to continue</p>
            </div>

            {error && <div className="auth-error-banner">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="auth-field">
                <label className="auth-label" htmlFor="email">Email address</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    className="auth-input auth-input-icon-pad"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <div className="auth-label-row">
                  <label className="auth-label" htmlFor="password">Password</label>
                  <a href="#" className="auth-forgot">Forgot password?</a>
                </div>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </span>
                  <input
                    id="password"
                    type="password"
                    className="auth-input auth-input-icon-pad"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="auth-btn-primary" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* <div className="auth-divider">
              <span>OR</span>
            </div>

            <button type="button" className="auth-btn-sso">
              <GraduationCap size={16} />
              Sign in with University SSO
            </button> */}
          </div>

          <p className="auth-footer">
            New university?{' '}
            <Link to="/request-access">Request access</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
