import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { registerUser } from '../api/authService'
import './auth.css'

interface FormState {
  firstName: string
  surname: string
  dateOfBirth: string
  email: string
  password: string
  role: string
}

export default function RegisterPage() {
  const { isAuthenticated, role } = useAuth()
  const navigate = useNavigate()

  const isAdminSession = isAuthenticated && role === 'ROLE_ADMIN'

  const [form, setForm] = useState<FormState>({
    firstName: '',
    surname: '',
    dateOfBirth: '',
    email: '',
    password: '',
    role: 'ROLE_ADMIN',
  })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [banner, setBanner] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && !isAdminSession) {
    return <Navigate to="/student" replace />
  }

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  const validate = (): Partial<FormState> => {
    const e: Partial<FormState> = {}
    if (!form.firstName.trim()) e.firstName = 'First name is required'
    if (!form.surname.trim()) e.surname = 'Surname is required'
    if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBanner('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    try {
      const payload: Parameters<typeof registerUser>[0] = {
        firstName: form.firstName.trim(),
        surname: form.surname.trim(),
        dateOfBirth: form.dateOfBirth,
        email: form.email.trim(),
        password: form.password,
      }
      if (isAdminSession) {
        payload.role = form.role
      }

      await registerUser(payload)
      navigate('/login', { replace: true })
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Something went wrong. Please try again.'
      setBanner(msg)
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

        <h1 className="auth-heading">Create Account</h1>

        {banner && <div className="auth-error-banner">{banner}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label className="auth-label" htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              className={`auth-input${errors.firstName ? ' error' : ''}`}
              value={form.firstName}
              onChange={set('firstName')}
              required
            />
            {errors.firstName && <span className="auth-field-error">{errors.firstName}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="surname">Surname</label>
            <input
              id="surname"
              type="text"
              className={`auth-input${errors.surname ? ' error' : ''}`}
              value={form.surname}
              onChange={set('surname')}
              required
            />
            {errors.surname && <span className="auth-field-error">{errors.surname}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="dob">Date of Birth</label>
            <input
              id="dob"
              type="date"
              className={`auth-input${errors.dateOfBirth ? ' error' : ''}`}
              value={form.dateOfBirth}
              onChange={set('dateOfBirth')}
              required
            />
            {errors.dateOfBirth && <span className="auth-field-error">{errors.dateOfBirth}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={`auth-input${errors.email ? ' error' : ''}`}
              value={form.email}
              onChange={set('email')}
              autoComplete="email"
              required
            />
            {errors.email && <span className="auth-field-error">{errors.email}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={`auth-input${errors.password ? ' error' : ''}`}
              value={form.password}
              onChange={set('password')}
              autoComplete="new-password"
              required
            />
            {errors.password && <span className="auth-field-error">{errors.password}</span>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="role">
              User Type{' '}
              {!isAdminSession && (
                <span className="auth-role-hint">(Bootstrap — Admin only)</span>
              )}
            </label>
            <select
              id="role"
              className="auth-select"
              value={form.role}
              onChange={set('role')}
              disabled={!isAdminSession}
            >
              <option value="ROLE_ADMIN">Admin</option>
              {isAdminSession && <option value="ROLE_STUDENT">Student</option>}
            </select>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
