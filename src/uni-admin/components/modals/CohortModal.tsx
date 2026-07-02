import { useEffect, useState } from 'react'
import type {
  CohortResponse,
  CohortStatus,
  CreateCohortRequest,
  LecturerResponse,
  ProgrammeResponse,
} from '../../api/types'
import { COHORT_STATUSES } from '../../api/types'
import '../../styles/uniAdmin.css'

import { isAxiosError } from 'axios'

function apiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err) && err.response?.data?.message) return err.response.data.message
  return fallback
}

interface Props {
  open: boolean
  existing?: CohortResponse | null
  programmes: ProgrammeResponse[]
  lecturers: LecturerResponse[]
  onClose: () => void
  onSave: (data: CreateCohortRequest) => Promise<void>
}

export default function CohortModal({ open, existing, programmes, lecturers, onClose, onSave }: Props) {
  const [name, setName] = useState('')
  const [programmeId, setProgrammeId] = useState<number | ''>('')
  const [status, setStatus] = useState<CohortStatus>('NOT_STARTED')
  const [lecturerIds, setLecturerIds] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setName(existing?.name ?? '')
      setProgrammeId(existing?.programmeId ?? '')
      setStatus(existing?.status ?? 'NOT_STARTED')
      setLecturerIds(existing?.lecturerIds ?? [])
      setError(null)
    }
  }, [open, existing])

  if (!open) return null

  const eligibleLecturers = programmeId === ''
    ? lecturers
    : lecturers.filter(l => l.programmeIds.includes(programmeId))

  const toggleLecturer = (id: number) => {
    setLecturerIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const submit = async () => {
    if (!name.trim()) { setError('Name is required'); return }
    if (programmeId === '') { setError('Programme is required'); return }
    setSaving(true)
    try {
      await onSave({
        name: name.trim(),
        programmeId,
        lecturerIds,
        ...(existing ? { status } : {}),
      })
      onClose()
    } catch (err) {
      setError(apiErrorMessage(err, 'Failed to save cohort'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title">{existing ? 'Edit Cohort' : 'Create Cohort'}</h2>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Cohort Name *</label>
          <input
            className="ua-modal-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. SE Cohort 2026"
          />
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Programme *</label>
          <select
            className="ua-modal-input"
            value={programmeId}
            onChange={e => {
              const v = e.target.value === '' ? '' : Number(e.target.value)
              setProgrammeId(v)
              // Drop lecturers that don't teach the newly selected programme.
              if (v !== '') {
                setLecturerIds(prev => prev.filter(id =>
                  lecturers.find(l => l.id === id)?.programmeIds.includes(v)))
              }
            }}
          >
            <option value="">Select a programme…</option>
            {programmes.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Assigned Lecturers</label>
          {eligibleLecturers.length === 0 ? (
            <p className="ua-field-hint">
              {programmeId === '' ? 'No lecturers available.' : 'No lecturers teach this programme yet.'}
            </p>
          ) : (
            <div className="ua-checklist">
              {eligibleLecturers.map(l => (
                <label key={l.id} className="ua-checklist-item">
                  <input
                    type="checkbox"
                    checked={lecturerIds.includes(l.id)}
                    onChange={() => toggleLecturer(l.id)}
                  />
                  {l.firstName} {l.lastName}
                </label>
              ))}
            </div>
          )}
        </div>

        {existing && (
          <div className="ua-modal-field">
            <label className="ua-modal-label">Status</label>
            <select
              className="ua-modal-input"
              value={status}
              onChange={e => setStatus(e.target.value as CohortStatus)}
            >
              {COHORT_STATUSES.map(s => (
                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
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
