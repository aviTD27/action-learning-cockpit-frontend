import { useEffect, useState } from 'react'
import { useCohorts } from '../../uni-admin/hooks/useCohorts'
import FileTypeSelect from './FileTypeSelect'
import type { CreateSubmissionData, Submission } from '../types'
import '../../uni-admin/styles/uniAdmin.css'

interface Props {
  open: boolean
  existing?: Submission | null
  onClose: () => void
  onSave: (data: CreateSubmissionData) => void
}

export default function SubmissionModal({ open, existing, onClose, onSave }: Props) {
  const { cohorts } = useCohorts()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [cohortId, setCohortId] = useState<number | ''>('')
  const [dueDate, setDueDate] = useState('')
  const [maxPoints, setMaxPoints] = useState('20')
  const [templateFileName, setTemplateFileName] = useState('')
  // Submission rules
  const [allowedFileTypes, setAllowedFileTypes] = useState('')
  const [maxAttempts, setMaxAttempts] = useState('1')
  const [lateAllowed, setLateAllowed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ongoingCohorts = cohorts.filter(
    c => c.status === 'ONGOING' || c.id === existing?.cohortId,
  )

  useEffect(() => {
    if (open) {
      setTitle(existing?.title ?? '')
      setDescription(existing?.description ?? '')
      setCohortId(existing?.cohortId ?? '')
      setDueDate(existing?.dueDate ?? '')
      setMaxPoints(existing ? String(existing.maxPoints) : '20')
      setTemplateFileName(existing?.templateFileName ?? '')
      setAllowedFileTypes(existing?.rules.allowedFileTypes ?? '')
      setMaxAttempts(existing ? String(existing.rules.maxAttempts) : '1')
      setLateAllowed(existing?.rules.lateAllowed ?? false)
      setError(null)
    }
  }, [open, existing])

  if (!open) return null

  const submit = () => {
    if (!title.trim()) { setError('Title is required'); return }
    if (cohortId === '') { setError('Select a cohort'); return }
    if (!dueDate) { setError('Due date is required'); return }
    const points = Number(maxPoints)
    if (!points || points <= 0) { setError('Max points must be a positive number'); return }
    const attempts = Number(maxAttempts)
    if (!attempts || attempts <= 0) { setError('Max attempts must be at least 1'); return }
    const cohort = ongoingCohorts.find(c => c.id === cohortId)
    onSave({
      title: title.trim(),
      description: description.trim(),
      cohortId,
      cohortName: cohort?.name ?? '',
      dueDate,
      maxPoints: points,
      rules: {
        allowedFileTypes: allowedFileTypes.trim(),
        maxAttempts: attempts,
        lateAllowed,
      },
      templateFileName: templateFileName || undefined,
    })
    onClose()
  }

  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title">{existing ? 'Edit Submission' : 'Create Submission'}</h2>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Title *</label>
          <input className="ua-modal-input" value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Sprint 2 deliverable" />
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Description</label>
          <textarea className="ua-modal-input" rows={3} value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What students must submit" />
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Cohort * (ongoing only)</label>
          <select
            className="ua-modal-input"
            value={cohortId}
            onChange={e => setCohortId(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">Select a cohort…</option>
            {ongoingCohorts.map(c => (
              <option key={c.id} value={c.id}>{c.name} — {c.programmeName}</option>
            ))}
          </select>
          {ongoingCohorts.length === 0 && (
            <p className="ua-modal-error">No ongoing cohorts — set a cohort to ONGOING first.</p>
          )}
        </div>

        <div className="ua-two-col">
          <div className="ua-modal-field">
            <label className="ua-modal-label">Due Date *</label>
            <input className="ua-modal-input" type="date" value={dueDate}
              onChange={e => setDueDate(e.target.value)} />
          </div>
          <div className="ua-modal-field">
            <label className="ua-modal-label">Max Points *</label>
            <input className="ua-modal-input" type="number" min={1} value={maxPoints}
              onChange={e => setMaxPoints(e.target.value)} />
          </div>
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Template File</label>
          {/* TODO (backend): real upload needs file storage — only the name is kept for now */}
          <input className="ua-modal-input" type="file"
            onChange={e => setTemplateFileName(e.target.files?.[0]?.name ?? '')} />
        </div>

        <div className="ua-two-col">
          <div className="ua-modal-field">
            <label className="ua-modal-label">Allowed File Types</label>
            <FileTypeSelect value={allowedFileTypes} onChange={setAllowedFileTypes} />
          </div>
          <div className="ua-modal-field">
            <label className="ua-modal-label">Max Attempts *</label>
            <input className="ua-modal-input" type="number" min={1} value={maxAttempts}
              onChange={e => setMaxAttempts(e.target.value)} />
          </div>
        </div>

        <div className="ua-modal-field">
          <label className="ua-checkbox-row" style={{ padding: 0 }}>
            <input type="checkbox" checked={lateAllowed}
              onChange={e => setLateAllowed(e.target.checked)} />
            Allow late submissions
          </label>
        </div>

        {error && <p className="ua-modal-error">{error}</p>}

        <div className="ua-modal-actions">
          <button className="ua-btn ua-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ua-btn ua-btn-primary" onClick={submit}>{existing ? 'Save' : 'Create'}</button>
        </div>
      </div>
    </div>
  )
}
