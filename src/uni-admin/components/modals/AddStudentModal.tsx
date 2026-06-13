import { useState } from 'react'
import '../../styles/modals.css'

interface Props {
  open: boolean
  onClose: () => void
  onSave:  (student: {
    firstName: string
    lastName: string
    email: string
    studentId: string
    cohort: string
    programme: string
  }) => void
}

const COHORTS = [
  'MSc-2023-Spring',
  'MSc-2023-Fall',
  'MSc-2024-Spring',
  'MSc-2024-Fall',
  'MSc-2025-Spring',
  'MSc-2025-Fall',
]

const PROGRAMMES = [
  'MSc Software Engineering',
  'MSc Data Science',
  'MSc Computer Security',
  'MSc Artificial Intelligence',
  'MSc Artificial Intelligence with Marketing Strategy',
]

const EMPTY = {
  firstName: '', lastName: '', email: '',
  studentId: '', cohort: '', programme: '',
}

export default function AddStudentModal({ open, onClose, onSave }: Props) {
  const [form,  setForm ] = useState(EMPTY)
  const [error, setError] = useState('')

  if (!open) return null

  const handle = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = () => {
    if (!form.firstName || !form.lastName || !form.email ||
        !form.studentId || !form.cohort) {
      setError('Please fill in all required fields.')
      return
    }
    if (!form.email.includes('@')) {
      setError('Please enter a valid email address.')
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
          <p className="modal-title">🎓 Add New Student</p>
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
              placeholder="e.g. Jane"
            />
          </div>
          <div className="modal-field">
            <label className="modal-label">Last Name *</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handle}
              className="modal-input"
              placeholder="e.g. Brown"
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
            placeholder="e.g. j.brown@epita.fr"
          />
        </div>

        {/* Student ID */}
        <div className="modal-field">
          <label className="modal-label">Student ID *</label>
          <input
            name="studentId"
            value={form.studentId}
            onChange={handle}
            className="modal-input"
            placeholder="e.g. STU-2024S-001"
          />
          <p className="modal-hint">
            Must be unique. Used for document naming in submissions.
          </p>
        </div>

        {/* Cohort + Programme */}
        <div className="modal-row">
          <div className="modal-field">
            <label className="modal-label">Cohort *</label>
            <select
              name="cohort"
              value={form.cohort}
              onChange={handle}
              className="modal-select"
            >
              <option value="">Select cohort</option>
              {COHORTS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="modal-field">
            <label className="modal-label">Programme</label>
            <select
              name="programme"
              value={form.programme}
              onChange={handle}
              className="modal-select"
            >
              <option value="">Select programme</option>
              {PROGRAMMES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-success"
            onClick={submit}
          >
            Add Student
          </button>
        </div>

      </div>
    </div>
  )
}