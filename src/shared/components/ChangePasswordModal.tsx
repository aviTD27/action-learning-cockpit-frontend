import { useState } from 'react'
import { changePassword } from '../../api/authService'
import './changePassword.css'

interface Props {
  onClose: () => void
}

export default function ChangePasswordModal({ onClose }: Props) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  const validate = (): string | null => {
    if (!current || !next || !confirm) return 'All fields are required.'
    if (next.length < 8) return 'New password must be at least 8 characters.'
    if (!/[A-Z]/.test(next)) return 'New password must include an uppercase letter.'
    if (!/[0-9]/.test(next)) return 'New password must include a number.'
    if (!/[^A-Za-z0-9]/.test(next)) return 'New password must include a special character.'
    if (next !== confirm) return 'New passwords do not match.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const msg = validate()
    if (msg) { setError(msg); return }
    setSaving(true); setError(null)
    try {
      await changePassword(current, next)
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Current password is incorrect.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="cp-overlay" onClick={onClose}>
      <div className="cp-modal" onClick={e => e.stopPropagation()}>
        <h2 className="cp-title">Change Password</h2>

        {success ? (
          <div className="cp-success">
            <p>Password updated successfully.</p>
            <button className="cp-btn cp-btn-primary" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="cp-field">
              <label className="cp-label">Current password</label>
              <input className="cp-input" type="password" value={current} onChange={e => setCurrent(e.target.value)} autoComplete="current-password" required />
            </div>
            <div className="cp-field">
              <label className="cp-label">New password</label>
              <input className="cp-input" type="password" value={next} onChange={e => setNext(e.target.value)} autoComplete="new-password" required />
              <span className="cp-hint">Min 8 chars · 1 uppercase · 1 number · 1 special character</span>
            </div>
            <div className="cp-field">
              <label className="cp-label">Confirm new password</label>
              <input className="cp-input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" required />
            </div>
            {error && <p className="cp-error">{error}</p>}
            <div className="cp-actions">
              <button type="button" className="cp-btn cp-btn-cancel" onClick={onClose}>Cancel</button>
              <button type="submit" className="cp-btn cp-btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
