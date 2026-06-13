import { useState } from 'react'
import '../../styles/modals.css'

interface Props {
  open: boolean
  onClose: () => void
  onSave:  (lecturer: {
    firstName: string
    lastName: string
    email: string
    staffId: string
    role: string
    cohorts: string[]
  }) => void
}

const COHORTS = [
  'MSc-2023-Spring', 'MSc-2023-Fall',
  'MSc-2024-Spring', 'MSc-2024-Fall',
  'MSc-2025-Spring', 'MSc-2025-Fall',
]

const ROLES = [
  'Lecturer',
  'Senior Lecturer',
  'Programme Coordinator',
  'Professor',
]

const EMPTY = {
  firstName: '', lastName: '', email: '',
  staffId: '', role: '', cohorts: [] as string[],
}

export default function AddLecturerModal({ open, onClose, onSave }: Props) {
  const [form,  setForm ] = useState(EMPTY)
  const [error, setError] = useState('')

  if (!open) return null

  const handle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // toggle cohort selection
  const toggleCohort = (cohort: string) => {
    setForm(f => ({
      ...f,
      cohorts: f.cohorts.includes(cohort)
        ? f.cohorts.filter(c => c !== cohort)
        : [...f.cohorts, cohort],
    }))
  }

  const submit = () => {
    if (!form.firstName || !form.lastName ||
        !form.email || !form.staffId || !form.role) {
      setError('Please fill in all required fields.')
      return
    }
    if (form.cohorts.length === 0) {
      setError('Please assign at least one cohort.')
      return
    }
    onSave(form)
    setForm(EMPTY)
    setError('')
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <div className="modal-header">
          <p className="modal-title">👩‍🏫 Add New Lecturer</p>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Name row */}
        <div className="modal-row">
          <div className="modal-field">
            <label className="modal-label">First Name *</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handle}
              className="modal-input"
              placeholder="e.g. Tom"
            />
          </div>
          <div className="modal-field">
            <label className="modal-label">Last Name *</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handle}
              className="modal-input"
              placeholder="e.g. Scott"
            />
          </div>
        </div>

        {/* Email */}
        <div className="modal-field">
          <label className="modal-label">Email Address *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handle}
            className="modal-input"
            placeholder="e.g. t.scott@epita.fr"
          />
        </div>

        {/* Staff ID + Role */}
        <div className="modal-row">
          <div className="modal-field">
            <label className="modal-label">Staff ID *</label>
            <input
              name="staffId"
              value={form.staffId}
              onChange={handle}
              className="modal-input"
              placeholder="e.g. STAFF-001"
            />
          </div>
          <div className="modal-field">
            <label className="modal-label">Role *</label>
            <select
              name="role"
              value={form.role}
              onChange={handle}
              className="modal-select"
            >
              <option value="">Select role</option>
              {ROLES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cohort assignment */}
        <div className="modal-field">
          <label className="modal-label">
            Assign to Cohorts *
            {form.cohorts.length > 0 && (
              <span className="recipient-count">
                {form.cohorts.length} selected
              </span>
            )}
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.4rem',
            marginTop: '0.25rem',
          }}>
            {COHORTS.map(cohort => (
              <label
                key={cohort}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: '0.3rem 0.5rem',
                  borderRadius: '4px',
                  background: form.cohorts.includes(cohort)
                    ? '#eff6ff' : '#f9fafb',
                  border: form.cohorts.includes(cohort)
                    ? '1px solid #93c5fd' : '1px solid #e5e7eb',
                }}
              >
                <input
                  type="checkbox"
                  checked={form.cohorts.includes(cohort)}
                  onChange={() => toggleCohort(cohort)}
                />
                {cohort}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-success"  onClick={submit}>Add Lecturer</button>
        </div>

      </div>
    </div>
  )
}