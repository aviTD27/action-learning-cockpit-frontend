import { useState } from 'react'
import { GraduationCap, KeyRound, Landmark, UserRound, Users } from 'lucide-react'
import { useStudentProfile } from '../hooks/useStudentProfile'
import { changePassword } from '../../api/authService'
import '../styles/student.css'

function initials(first: string, last: string) {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase()
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE:          'sd-badge sd-badge-submitted',
    SUSPENDED:       'sd-badge sd-badge-past-due',
    GRADUATED:       'sd-badge sd-badge-graded',
    WITHDRAWN:       'sd-badge sd-badge-pending',
    INACTIVE:        'sd-badge sd-badge-pending',
  }
  const cls = map[status.toUpperCase()] ?? 'sd-badge sd-badge-pending'
  return <span className={cls}>{status.charAt(0) + status.slice(1).toLowerCase()}</span>
}

export default function ProfilePage() {
  const { profile, loading, error } = useStudentProfile()

  const [current, setCurrent]   = useState('')
  const [next, setNext]         = useState('')
  const [confirm, setConfirm]   = useState('')
  const [pwError, setPwError]   = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState(false)
  const [saving, setSaving]     = useState(false)

  const validatePw = (): string | null => {
    if (!current || !next || !confirm) return 'All fields are required.'
    if (next.length < 8)              return 'New password must be at least 8 characters.'
    if (!/[A-Z]/.test(next))          return 'Must include an uppercase letter.'
    if (!/[0-9]/.test(next))          return 'Must include a number.'
    if (!/[^A-Za-z0-9]/.test(next))   return 'Must include a special character.'
    if (next !== confirm)             return 'New passwords do not match.'
    return null
  }

  const handleChangePw = async (e: React.FormEvent) => {
    e.preventDefault()
    const msg = validatePw()
    if (msg) { setPwError(msg); return }
    setSaving(true); setPwError(null); setPwSuccess(false)
    try {
      await changePassword(current, next)
      setPwSuccess(true)
      setCurrent(''); setNext(''); setConfirm('')
    } catch (err: any) {
      setPwError(err.response?.data?.message ?? 'Current password is incorrect.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="sd-table-empty">Loading profile…</p>
  if (error || !profile) return <p className="sd-table-empty">{error ?? 'Profile not found.'}</p>

  return (
    <div className="sd-page">

      {/* Profile header */}
      <div className="sd-card">
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '3.5rem', height: '3.5rem', borderRadius: '9999px',
            background: '#1E3A5F', border: '2px solid #F0A500',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '1.125rem', flexShrink: 0,
          }}>
            {initials(profile.firstName, profile.lastName)}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1E3A5F' }}>
              {profile.firstName} {profile.lastName}
            </p>
            <p style={{ margin: '2px 0 6px', fontSize: '0.8125rem', color: '#6b7280' }}>
              {profile.email}
            </p>
            <StatusBadge status={profile.status} />
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="sd-two-col">

        {/* Personal info */}
        <div className="sd-card">
          <div className="sd-card-header">
            <p className="sd-card-title"><UserRound size={14} /> Personal Info</p>
          </div>
          <div style={{ padding: '0.25rem 1rem' }}>
            {[
              { label: 'First name',   value: profile.firstName },
              { label: 'Last name',    value: profile.lastName  },
              { label: 'Email',        value: profile.email     },
              { label: 'Student ref',  value: profile.studentRef },
              { label: 'Status',       value: <StatusBadge status={profile.status} /> },
            ].map(r => (
              <div key={r.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6',
                fontSize: '0.75rem',
              }}>
                <span style={{ color: '#6b7280' }}>{r.label}</span>
                <span style={{ fontWeight: 600, color: '#1E3A5F' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Academic info */}
        <div className="sd-card">
          <div className="sd-card-header">
            <p className="sd-card-title"><GraduationCap size={14} /> Academic Info</p>
          </div>
          <div style={{ padding: '0.25rem 1rem' }}>
            {[
              { label: 'University', icon: Landmark,      value: profile.universityName ?? '—' },
              { label: 'Programme',  icon: GraduationCap, value: profile.programmeName          },
              { label: 'Cohort',     icon: Users,         value: profile.cohortName ?? '—'      },
            ].map(r => (
              <div key={r.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6',
                fontSize: '0.75rem',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6b7280' }}>
                  <r.icon size={12} /> {r.label}
                </span>
                <span style={{ fontWeight: 600, color: '#1E3A5F' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Change password */}
      <div className="sd-card">
        <div className="sd-card-header">
          <p className="sd-card-title"><KeyRound size={14} /> Change Password</p>
        </div>
        <div style={{ padding: '1rem', maxWidth: '420px' }}>
          {pwSuccess && (
            <p style={{ color: '#16a34a', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>
              Password updated successfully.
            </p>
          )}
          <form onSubmit={handleChangePw} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: 'Current password', value: current, onChange: setCurrent, auto: 'current-password' },
              { label: 'New password',     value: next,    onChange: setNext,    auto: 'new-password'     },
              { label: 'Confirm new password', value: confirm, onChange: setConfirm, auto: 'new-password' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  {f.label}
                </label>
                <input
                  type="password"
                  value={f.value}
                  onChange={e => f.onChange(e.target.value)}
                  autoComplete={f.auto}
                  style={{
                    width: '100%', border: '1px solid #d1d5db', borderRadius: '0.375rem',
                    padding: '0.375rem 0.75rem', fontSize: '0.875rem', fontFamily: 'inherit',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                />
              </div>
            ))}
            <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0 }}>
              Min 8 chars · 1 uppercase · 1 number · 1 special character
            </p>
            {pwError && <p style={{ color: '#dc2626', fontSize: '0.75rem', margin: 0 }}>{pwError}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={saving}
                className="ua-btn ua-btn-primary"
                style={{ fontSize: '0.8125rem', padding: '0.4rem 1rem' }}
              >
                {saving ? 'Saving…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  )
}
