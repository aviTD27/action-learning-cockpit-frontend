import { useEffect, useState } from 'react'
import type {
  CohortResponse,
  CreateStudentRequest,
  ProgrammeResponse,
  StudentResponse,
  StudentStatus,
} from '../../api/types'
import { STUDENT_STATUSES } from '../../api/types'
import '../../styles/uniAdmin.css'

import { isAxiosError } from 'axios'

function apiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err) && err.response?.data?.message) return err.response.data.message
  return fallback
}

interface Props {
  open: boolean
  existing?: StudentResponse | null
  programmes: ProgrammeResponse[]
  cohorts: CohortResponse[]
  onClose: () => void
  onSave: (data: CreateStudentRequest) => Promise<void>
}

export default function StudentModal({ open, existing, programmes, cohorts, onClose, onSave }: Props) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [studentRef, setStudentRef] = useState('')
  const [programmeId, setProgrammeId] = useState<number | ''>('')
  const [cohortId, setCohortId] = useState<number | ''>('')
  const [status, setStatus] = useState<StudentStatus>('ACTIVE')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setFirstName(existing?.firstName ?? '')
      setLastName(existing?.lastName ?? '')
      setEmail(existing?.email ?? '')
      setPassword('')
      setStudentRef(existing?.studentRef ?? '')
      setProgrammeId(existing?.programmeId ?? '')
      setCohortId(existing?.cohortId ?? '')
      setStatus(existing?.status ?? 'ACTIVE')
      setError(null)
    }
  }, [open, existing])

  if (!open) return null

  const cohortsForProgramme = programmeId === ''
    ? cohorts
    : cohorts.filter(c => c.programmeId === programmeId)

  const submit = async () => {
    if (!firstName.trim() || !lastName.trim()) { setError('First and last name are required'); return }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('A valid email is required'); return }
    if (!existing && !password) { setError('Password is required'); return }
    if (!studentRef.trim()) { setError('Student reference is required'); return }
    if (programmeId === '') { setError('Programme is required'); return }
    if (cohortId === '') { setError('Cohort is required'); return }
    setSaving(true)
    try {
      await onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        studentRef: studentRef.trim(),
        programmeId,
        status,
        cohortId,
      })
      onClose()
    } catch (err) {
      setError(apiErrorMessage(err, 'Failed to save student'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title">{existing ? 'Edit Student' : 'Add Student'}</h2>

        <div className="ua-two-col">
          <div className="ua-modal-field">
            <label className="ua-modal-label">First Name *</label>
            <input className="ua-modal-input" value={firstName}
              onChange={e => setFirstName(e.target.value)} />
          </div>
          <div className="ua-modal-field">
            <label className="ua-modal-label">Last Name *</label>
            <input className="ua-modal-input" value={lastName}
              onChange={e => setLastName(e.target.value)} />
          </div>
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Email *</label>
          <input className="ua-modal-input" type="email" value={email}
            onChange={e => setEmail(e.target.value)} placeholder="name@student.edu" />
        </div>

        <div className="ua-two-col">
          <div className="ua-modal-field">
            <label className="ua-modal-label">Password *</label>
            <input className="ua-modal-input" type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={existing ? 'Leave blank to keep current' : ''} />
          </div>
          <div className="ua-modal-field">
            <label className="ua-modal-label">Student Ref *</label>
            <input className="ua-modal-input" value={studentRef}
              onChange={e => setStudentRef(e.target.value)} placeholder="e.g. STU-2026-001" />
          </div>
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Programme *</label>
          <select
            className="ua-modal-input"
            value={programmeId}
            onChange={e => {
              setProgrammeId(e.target.value === '' ? '' : Number(e.target.value))
              setCohortId('')
            }}
          >
            <option value="">Select a programme…</option>
            {programmes.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="ua-two-col">
          <div className="ua-modal-field">
            <label className="ua-modal-label">Cohort *</label>
            <select
              className="ua-modal-input"
              value={cohortId}
              onChange={e => setCohortId(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="">Select a cohort…</option>
              {cohortsForProgramme.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="ua-modal-field">
            <label className="ua-modal-label">Status *</label>
            <select
              className="ua-modal-input"
              value={status}
              onChange={e => setStatus(e.target.value as StudentStatus)}
            >
              {STUDENT_STATUSES.map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="ua-modal-error">{error}</p>}

        <div className="ua-modal-actions">
          <button className="ua-btn ua-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ua-btn ua-btn-primary" onClick={submit} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
