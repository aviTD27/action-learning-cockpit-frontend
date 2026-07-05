import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { getLecturers } from '../../api/uniAdmin'
import { useAuth } from '../../../auth/AuthContext'
import type { CourseResponse, CreateCourseRequest, LecturerResponse } from '../../api/types'
import '../../styles/uniAdmin.css'

function apiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err) && err.response?.data?.message) return err.response.data.message
  return fallback
}

interface Props {
  open: boolean
  semesterId: number
  lecturers: LecturerResponse[]
  existing?: CourseResponse | null
  onClose: () => void
  onSave: (data: CreateCourseRequest) => Promise<void>
}

export default function CourseModal({ open, semesterId, lecturers: initialLecturers, existing, onClose, onSave }: Props) {
  const { universityId } = useAuth()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [lecturerId, setLecturerId] = useState<number | ''>('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [freshLecturers, setFreshLecturers] = useState<LecturerResponse[]>(initialLecturers)

  useEffect(() => {
    if (open) {
      setName(existing?.name ?? '')
      setCode(existing?.code ?? '')
      setDescription(existing?.description ?? '')
      setLecturerId(existing?.lecturerId ?? '')
      setError(null)
      // Always fetch fresh lecturer list when modal opens
      getLecturers(universityId ?? undefined)
        .then(r => setFreshLecturers(r.data))
        .catch(() => {})
    }
  }, [open, existing, universityId])

  if (!open) return null

  const activeLecturers = freshLecturers.filter(l => l.status === 'ACTIVE')
  const noLecturers     = activeLecturers.length === 0

  const submit = async () => {
    if (!name.trim()) { setError('Name is required'); return }
    setSaving(true)
    try {
      await onSave({
        name: name.trim(),
        code: code.trim() || undefined,
        description: description.trim() || undefined,
        semesterId,
        lecturerId: lecturerId === '' ? null : lecturerId,
      })
      onClose()
    } catch (err) {
      setError(apiErrorMessage(err, 'Failed to save course'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title">{existing ? 'Edit Course' : 'Add Course'}</h2>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Course Name *</label>
          <input
            className="ua-modal-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Software Architecture"
          />
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Code</label>
          <input
            className="ua-modal-input"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="e.g. SE-301"
          />
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Description</label>
          <input
            className="ua-modal-input"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Short description"
          />
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">
            Teaching Lecturer <span style={{ fontWeight: 400, color: '#9ca3af' }}>(optional)</span>
          </label>

          {noLecturers ? (
            <div className="ua-empty-inline">
              <p className="ua-field-hint" style={{ margin: 0 }}>
                No lecturers yet — add one first, then assign them here.
              </p>
              <Link to="/uni-admin/lecturers" className="ua-btn ua-btn-secondary ua-btn-xs" onClick={onClose}>
                Go to Lecturers
              </Link>
            </div>
          ) : (
            <>
              <select
                className="ua-modal-input"
                value={lecturerId}
                onChange={e => setLecturerId(e.target.value === '' ? '' : Number(e.target.value))}
              >
                <option value="">Unassigned</option>
                {activeLecturers.map(l => (
                  <option key={l.id} value={l.id}>{l.firstName} {l.lastName}</option>
                ))}
              </select>
              <Link
                to="/uni-admin/lecturers"
                className="ua-field-hint"
                onClick={onClose}
                style={{ display: 'inline-block', marginTop: '0.35rem', color: '#4f46e5', textDecoration: 'none' }}
              >
                + Add or manage lecturers
              </Link>
            </>
          )}
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
