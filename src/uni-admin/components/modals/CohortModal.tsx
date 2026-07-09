import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type {
  CohortResponse,
  CohortSeason,
  CohortStatus,
  CreateCohortRequest,
  ProgrammeResponse,
} from '../../api/types'
import { COHORT_SEASONS, COHORT_STATUSES } from '../../api/types'
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
  onClose: () => void
  onSave: (data: CreateCohortRequest) => Promise<void>
}

const currentYear = new Date().getFullYear()

export default function CohortModal({ open, existing, programmes, onClose, onSave }: Props) {
  const [season, setSeason] = useState<CohortSeason>('SPRING')
  const [academicYear, setAcademicYear] = useState<number>(currentYear)
  const [status, setStatus] = useState<CohortStatus>('NOT_STARTED')
  const [programmeIds, setProgrammeIds] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setSeason(existing?.season ?? 'SPRING')
      setAcademicYear(existing?.academicYear ?? currentYear)
      setStatus(existing?.status ?? 'NOT_STARTED')
      setProgrammeIds(existing?.programmeIds ?? [])
      setError(null)
    }
  }, [open, existing])

  if (!open) return null

  const selectable = programmes.filter(p => p.status === 'ACTIVE')
  const noProgrammes = selectable.length === 0

  const toggleProgramme = (id: number) => {
    setProgrammeIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  const seasonLabel = season === 'SPRING' ? 'Spring' : 'Fall'
  const previewName = `${seasonLabel} ${academicYear}`

  const submit = async () => {
    setSaving(true)
    try {
      await onSave({
        season,
        academicYear,
        programmeIds,
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
        <h2 className="ua-modal-title">{existing ? 'Edit Intake' : 'Create Intake'}</h2>
        <p className="ua-field-hint" style={{ marginTop: '-0.4rem' }}>
          An intake is a university-wide admission season. Attach the programmes that run in it.
        </p>

        <div className="ua-modal-row" style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="ua-modal-field" style={{ flex: 1 }}>
            <label className="ua-modal-label">Season *</label>
            <select
              className="ua-modal-input"
              value={season}
              onChange={e => setSeason(e.target.value as CohortSeason)}
            >
              {COHORT_SEASONS.map(s => (
                <option key={s} value={s}>{s === 'SPRING' ? 'Spring' : 'Fall'}</option>
              ))}
            </select>
          </div>
          <div className="ua-modal-field" style={{ flex: 1 }}>
            <label className="ua-modal-label">Academic Year *</label>
            <input
              className="ua-modal-input"
              type="number"
              value={academicYear}
              min={2000}
              max={2100}
              onChange={e => setAcademicYear(Number(e.target.value))}
            />
          </div>
        </div>

        <p className="ua-field-hint">This intake will be named <strong>{previewName}</strong>.</p>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Programmes in this intake</label>
          {noProgrammes ? (
            <div className="ua-empty-inline">
              <p className="ua-field-hint" style={{ margin: 0 }}>
                No programmes yet  create a programme first.
              </p>
              <Link to="/uni-admin/programmes" className="ua-btn ua-btn-primary ua-btn-xs" onClick={onClose}>
                Go to Programmes
              </Link>
            </div>
          ) : (
            <div className="ua-checklist">
              {selectable.map(p => (
                <label key={p.id} className="ua-checklist-item">
                  <input
                    type="checkbox"
                    checked={programmeIds.includes(p.id)}
                    onChange={() => toggleProgramme(p.id)}
                  />
                  {p.name}
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
          <button className="ua-btn ua-btn-primary" onClick={submit} disabled={saving || noProgrammes}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
