import { useEffect, useMemo, useState } from 'react'
import type {
  CohortResponse,
  CreateStudentRequest,
  ProgrammeResponse,
  StudentResponse,
  StudentStatus,
} from '../../api/types'
import { STUDENT_STATUSES } from '../../api/types'
import { useAuth } from '../../../auth/AuthContext'
import '../../styles/uniAdmin.css'

import { isAxiosError } from 'axios'

function apiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err) && err.response?.data?.message) return err.response.data.message
  return fallback
}

function normalizePart(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '')
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
  const { email: adminEmail } = useAuth()
  const domain = adminEmail?.includes('@')
    ? adminEmail.slice(adminEmail.indexOf('@') + 1)
    : ''

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [personalEmail, setPersonalEmail] = useState('')
  const [programmeId, setProgrammeId] = useState<number | ''>('')
  const [cohortId, setCohortId] = useState<number | ''>('')
  const [status, setStatus] = useState<StudentStatus>('ACTIVE')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const isEditing = !!existing

  const platformEmailPreview = useMemo(() => {
    if (isEditing) return existing?.email ?? ''
    const first = normalizePart(firstName)
    const last = normalizePart(lastName)
    if (!first && !last) return ''
    return `${first || 'firstname'}.${last || 'lastname'}@${domain || '...'}`
  }, [isEditing, existing, firstName, lastName, domain])

  useEffect(() => {
    if (open) {
      setFirstName(existing?.firstName ?? '')
      setLastName(existing?.lastName ?? '')
      setPersonalEmail('')
      setProgrammeId(existing?.programmeId ?? '')
      setCohortId(existing?.cohortId ?? '')
      setStatus(existing?.status ?? 'ACTIVE')
      setError(null)
    }
  }, [open, existing])

  if (!open) return null

  const cohortsForProgramme = programmeId === ''
    ? cohorts
    : cohorts.filter(c => c.programmeIds.includes(programmeId as number))

  const submit = async () => {
    if (!firstName.trim() || !lastName.trim()) { setError('First and last name are required'); return }
    if (!isEditing && !/^\S+@\S+\.\S+$/.test(personalEmail)) {
      setError('A valid personal email is required  login credentials will be sent there')
      return
    }
    if (programmeId === '') { setError('Programme is required'); return }
    if (cohortId === '') { setError('Cohort is required'); return }
    setSaving(true)
    try {
      const payload: CreateStudentRequest = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        programmeId: programmeId as number,
        status,
        cohortId: cohortId as number,
      }
      if (!isEditing) {
        payload.personalEmail = personalEmail.trim()
      }
      await onSave(payload)
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
        <h2 className="ua-modal-title">{isEditing ? 'Edit Student' : 'Add Student'}</h2>

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
          <label className="ua-modal-label">
            Platform Login Email
            {!isEditing && (
              <span style={{ fontWeight: 400, color: '#9ca3af', marginLeft: 6 }}>
                (auto-generated)
              </span>
            )}
          </label>
          <input
            className="ua-modal-input"
            value={platformEmailPreview}
            readOnly
            placeholder={isEditing ? '' : 'Enter name above to preview…'}
            style={{ background: '#f9fafb', color: '#6b7280', cursor: 'default' }}
          />
        </div>

        {!isEditing && (
          <div className="ua-modal-field">
            <label className="ua-modal-label">
              Personal Email *
              <span style={{ fontWeight: 400, color: '#9ca3af', marginLeft: 6 }}>
                (login credentials will be sent here)
              </span>
            </label>
            <input
              className="ua-modal-input"
              type="email"
              value={personalEmail}
              onChange={e => setPersonalEmail(e.target.value)}
              placeholder="student@gmail.com"
            />
          </div>
        )}

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
