import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import type { CreateLecturerRequest, LecturerResponse, LecturerStatus, ProgrammeResponse } from '../../api/types'
import { LECTURER_STATUSES } from '../../api/types'
import MultiSelect from '../shared/MultiSelect'
import '../../styles/uniAdmin.css'

function apiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err) && err.response?.data?.message) return err.response.data.message
  return fallback
}

interface Props {
  open: boolean
  existing?: LecturerResponse | null
  programmes: ProgrammeResponse[]
  onClose: () => void
  onSave: (data: CreateLecturerRequest) => Promise<void>
}

export default function LecturerModal({ open, existing, programmes, onClose, onSave }: Props) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [programmeIds, setProgrammeIds] = useState<number[]>([])
  const [lecturerRef, setLecturerRef] = useState('')
  const [status, setStatus] = useState<LecturerStatus>('ACTIVE')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setFirstName(existing?.firstName ?? '')
      setLastName(existing?.lastName ?? '')
      setEmail(existing?.email ?? '')
      setPhone(existing?.phone ?? '')
      setProgrammeIds(existing?.programmeIds ?? [])
      setLecturerRef(existing?.lecturerRef ?? '')
      setStatus(existing?.status ?? 'ACTIVE')
      setError(null)
    }
  }, [open, existing])

  if (!open) return null

  const submit = async () => {
    if (!firstName.trim() || !lastName.trim()) { setError('First and last name are required'); return }
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email)) { setError('Enter a valid personal email or leave it blank'); return }
    if (!lecturerRef.trim()) { setError('Lecturer reference is required'); return }
    if (programmeIds.length === 0) { setError('Select at least one programme'); return }
    setSaving(true)
    try {
      await onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        lecturerRef: lecturerRef.trim(),
        programmeIds,
        ...(email.trim() ? { email: email.trim() } : {}),
        ...(phone.trim() ? { phone: phone.trim() } : {}),
        ...(existing ? { status } : {}),
      })
      onClose()
    } catch (err) {
      setError(apiErrorMessage(err, 'Failed to save lecturer'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title">{existing ? 'Edit Lecturer' : 'Add Lecturer'}</h2>

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

        <div className="ua-two-col">
          <div className="ua-modal-field">
            <label className="ua-modal-label">Personal Email</label>
            <input className="ua-modal-input" type="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="their personal email, e.g. name@gmail.com" />
          </div>
          <div className="ua-modal-field">
            <label className="ua-modal-label">Phone</label>
            <input className="ua-modal-input" value={phone}
              onChange={e => setPhone(e.target.value)} placeholder="optional" />
          </div>
        </div>
        <p className="ua-field-hint">Login credentials are emailed to the personal address. The professional login email is generated automatically.</p>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Lecturer Ref *</label>
          <input className="ua-modal-input" value={lecturerRef}
            onChange={e => setLecturerRef(e.target.value)} placeholder="e.g. LEC-2026-001" />
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Programmes *</label>
          <MultiSelect
            options={programmes.map(p => ({ id: p.id, label: p.name }))}
            selected={programmeIds}
            onChange={setProgrammeIds}
            placeholder="Select programmes…"
          />
        </div>

        {existing && (
          <div className="ua-modal-field">
            <label className="ua-modal-label">Status</label>
            <select
              className="ua-modal-input"
              value={status}
              onChange={e => setStatus(e.target.value as LecturerStatus)}
            >
              {LECTURER_STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

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
