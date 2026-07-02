import { useEffect, useState } from 'react'
import { useCohorts } from '../../uni-admin/hooks/useCohorts'
import FileTypeSelect from './FileTypeSelect'
import type { CreateSubmissionData, Submission, SubmissionType } from '../types'
import '../styles/lecturer.css'

interface Props {
  open: boolean
  existing?: Submission | null
  onClose: () => void
  onSave: (data: CreateSubmissionData, templateFile?: File) => Promise<void>
}

export default function SubmissionModal({ open, existing, onClose, onSave }: Props) {
  const { cohorts } = useCohorts()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [additionalNotes, setAdditionalNotes] = useState('')
  const [submissionType, setSubmissionType] = useState<SubmissionType>('BOTH')
  const [cohortId, setCohortId] = useState<number | ''>('')
  const [cohortIds, setCohortIds] = useState<number[]>([])
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('23:59')
  const [maxPoints, setMaxPoints] = useState('20')
  const [templateFile, setTemplateFile] = useState<File | null>(null)
  // Smart-Gate rules
  const [allowedFileTypes, setAllowedFileTypes] = useState('')
  const [maxAttempts, setMaxAttempts] = useState('1')
  const [lateAllowed, setLateAllowed] = useState(false)
  const [minWordCount, setMinWordCount] = useState('')
  const [maxWordCount, setMaxWordCount] = useState('')
  const [maxFileSizeMb, setMaxFileSizeMb] = useState('')
  const [namingPattern, setNamingPattern] = useState('')
  const [requiredHeadings, setRequiredHeadings] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const isEditing = !!existing
  const ongoingCohorts = cohorts.filter(
    c => c.status === 'ONGOING' || c.id === existing?.cohortId,
  )

  useEffect(() => {
    if (open) {
      setTitle(existing?.title ?? '')
      setDescription(existing?.description ?? '')
      setAdditionalNotes(existing?.additionalNotes ?? '')
      setSubmissionType(existing?.submissionType ?? 'BOTH')
      setCohortId(existing?.cohortId ?? '')
      setCohortIds(existing?.cohortId ? [existing.cohortId] : [])
      setDueDate(existing?.dueDate ?? '')
      setDueTime(existing?.dueTime ?? '23:59')
      setMaxPoints(existing ? String(existing.maxPoints) : '20')
      setTemplateFile(null)
      setAllowedFileTypes(existing?.rules.allowedFileTypes ?? '')
      setMaxAttempts(existing ? String(existing.rules.maxAttempts) : '1')
      setLateAllowed(existing?.rules.lateAllowed ?? false)
      setMinWordCount(existing?.rules.minWordCount != null ? String(existing.rules.minWordCount) : '')
      setMaxWordCount(existing?.rules.maxWordCount != null ? String(existing.rules.maxWordCount) : '')
      setMaxFileSizeMb(existing?.rules.maxFileSizeBytes != null
        ? String(Math.round(existing.rules.maxFileSizeBytes / (1024 * 1024))) : '')
      setNamingPattern(existing?.rules.namingPattern ?? '')
      setRequiredHeadings(existing?.rules.requiredHeadings ?? '')
      setError(null)
    }
  }, [open, existing])

  if (!open) return null

  const toggleCohort = (id: number) => {
    setCohortIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const buildData = (status: 'DRAFT' | 'PUBLISHED' | undefined): CreateSubmissionData | null => {
    if (!title.trim()) { setError('Title is required'); return null }
    const selected = isEditing ? (cohortId === '' ? [] : [cohortId as number]) : cohortIds
    if (selected.length === 0) { setError('Select at least one cohort'); return null }
    if (!dueDate) { setError('Due date is required'); return null }
    const points = Number(maxPoints)
    if (!points || points <= 0) { setError('Max points must be a positive number'); return null }
    const attempts = Number(maxAttempts)
    if (!attempts || attempts <= 0) { setError('Max attempts must be at least 1'); return null }
    const minW = minWordCount ? Number(minWordCount) : null
    const maxW = maxWordCount ? Number(maxWordCount) : null
    if (minW != null && maxW != null && minW > maxW) { setError('Min word count cannot exceed max'); return null }
    if (maxFileSizeMb && Number(maxFileSizeMb) > 50) {
      setError('Max file size cannot exceed 50 MB (server upload limit).')
      return null
    }
    const sizeBytes = maxFileSizeMb ? Number(maxFileSizeMb) * 1024 * 1024 : null
    const firstCohort = ongoingCohorts.find(c => c.id === selected[0])
    return {
      title: title.trim(),
      description: description.trim(),
      additionalNotes: additionalNotes.trim() || undefined,
      submissionType,
      status,
      cohortId: selected[0],
      cohortName: firstCohort?.name ?? '',
      cohortIds: isEditing ? undefined : selected,
      dueDate,
      dueTime: dueTime || undefined,
      maxPoints: points,
      rules: {
        allowedFileTypes: allowedFileTypes.trim(),
        maxAttempts: attempts,
        lateAllowed,
        minWordCount: minW,
        maxWordCount: maxW,
        maxFileSizeBytes: sizeBytes,
        namingPattern: namingPattern.trim() || null,
        requiredHeadings: requiredHeadings.trim() || null,
      },
      templateFileName: templateFile?.name,
    }
  }

  const submit = async (status: 'DRAFT' | 'PUBLISHED' | undefined) => {
    const data = buildData(status)
    if (!data) return
    setSaving(true)
    try {
      await onSave(data, templateFile ?? undefined)
      onClose()
    } catch {
      setError('Could not save assignment')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal ua-modal-lg" onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title">{isEditing ? 'Edit Assignment' : 'Create Assignment'}</h2>

        {/* ── Basics ── */}
        <div className="ua-form-section">
          <p className="ua-form-section-title">Basics</p>
          <div className="ua-form-grid">
            <div className="ua-modal-field full">
              <label className="ua-modal-label">Title *</label>
              <input className="ua-modal-input" value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Sprint 2 deliverable" />
            </div>
            <div className="ua-modal-field full">
              <label className="ua-modal-label">Description / Instructions</label>
              <textarea className="ua-modal-input" rows={2} value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What students must submit" />
            </div>
            <div className="ua-modal-field full">
              <label className="ua-modal-label">Additional Notes</label>
              <textarea className="ua-modal-input" rows={2} value={additionalNotes}
                onChange={e => setAdditionalNotes(e.target.value)}
                placeholder="Free-text notes shown with the assignment (optional)" />
            </div>
            <div className="ua-modal-field">
              <label className="ua-modal-label">Submission Type *</label>
              <select className="ua-modal-input" value={submissionType}
                onChange={e => setSubmissionType(e.target.value as SubmissionType)}>
                <option value="BOTH">File or Text</option>
                <option value="FILE">File only</option>
                <option value="TEXT">Text only</option>
              </select>
            </div>
            <div className="ua-modal-field">
              <label className="ua-modal-label">Max Points *</label>
              <input className="ua-modal-input" type="number" min={1} value={maxPoints}
                onChange={e => setMaxPoints(e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── Deadline & Cohorts ── */}
        <div className="ua-form-section">
          <p className="ua-form-section-title">Deadline &amp; Cohorts</p>
          <div className="ua-form-grid">
            {isEditing ? (
              <div className="ua-modal-field full">
                <label className="ua-modal-label">Cohort * (ongoing only)</label>
                <select className="ua-modal-input" value={cohortId}
                  onChange={e => setCohortId(e.target.value === '' ? '' : Number(e.target.value))}>
                  <option value="">Select a cohort…</option>
                  {ongoingCohorts.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — {c.programmeName}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="ua-modal-field full">
                <label className="ua-modal-label">Cohorts * (assign to one or more)</label>
                {ongoingCohorts.length === 0 ? (
                  <p className="ua-modal-error">No ongoing cohorts — set a cohort to ONGOING first.</p>
                ) : (
                  <div className="ua-checklist">
                    {ongoingCohorts.map(c => (
                      <label key={c.id} className="ua-checklist-item">
                        <input type="checkbox" checked={cohortIds.includes(c.id)}
                          onChange={() => toggleCohort(c.id)} />
                        {c.name} — {c.programmeName}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="ua-modal-field">
              <label className="ua-modal-label">Due Date *</label>
              <input className="ua-modal-input" type="date" value={dueDate}
                onChange={e => setDueDate(e.target.value)} />
            </div>
            <div className="ua-modal-field">
              <label className="ua-modal-label">Due Time</label>
              <input className="ua-modal-input" type="time" value={dueTime}
                onChange={e => setDueTime(e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── Smart-Gate rules ── */}
        <div className="ua-form-section">
          <p className="ua-form-section-title">Submission Rules (Smart-Gate)</p>
          <div className="ua-form-grid-3">
            <div className="ua-modal-field">
              <label className="ua-modal-label">Allowed File Types</label>
              <FileTypeSelect value={allowedFileTypes} onChange={setAllowedFileTypes} />
            </div>
            <div className="ua-modal-field">
              <label className="ua-modal-label">Max File Size (MB)</label>
              <input className="ua-modal-input" type="number" min={1} max={50} value={maxFileSizeMb}
                onChange={e => setMaxFileSizeMb(e.target.value)} placeholder="e.g. 50 (max 50)" />
            </div>
            <div className="ua-modal-field">
              <label className="ua-modal-label">Max Attempts *</label>
              <input className="ua-modal-input" type="number" min={1} value={maxAttempts}
                onChange={e => setMaxAttempts(e.target.value)} />
            </div>
            <div className="ua-modal-field">
              <label className="ua-modal-label">Min Word Count</label>
              <input className="ua-modal-input" type="number" min={0} value={minWordCount}
                onChange={e => setMinWordCount(e.target.value)} placeholder="optional" />
            </div>
            <div className="ua-modal-field">
              <label className="ua-modal-label">Max Word Count</label>
              <input className="ua-modal-input" type="number" min={0} value={maxWordCount}
                onChange={e => setMaxWordCount(e.target.value)} placeholder="optional" />
            </div>
            <div className="ua-modal-field">
              <label className="ua-checkbox-row" style={{ padding: '1.55rem 0 0' }}>
                <input type="checkbox" checked={lateAllowed}
                  onChange={e => setLateAllowed(e.target.checked)} />
                Allow late submissions
              </label>
            </div>
            <div className="ua-modal-field">
              <label className="ua-modal-label">File Naming Convention</label>
              <input className="ua-modal-input" value={namingPattern}
                onChange={e => setNamingPattern(e.target.value)}
                placeholder="e.g. {studentRef}_sprint2.pdf" />
            </div>
            <div className="ua-modal-field">
              <label className="ua-modal-label">Required Headings / Sections</label>
              <input className="ua-modal-input" value={requiredHeadings}
                onChange={e => setRequiredHeadings(e.target.value)}
                placeholder="e.g. Problem, Action, Reflection" />
            </div>
            <div className="ua-modal-field">
              <label className="ua-modal-label">Template / Brief File</label>
              <input className="ua-modal-input" type="file"
                onChange={e => setTemplateFile(e.target.files?.[0] ?? null)} />
              {isEditing && existing?.hasTemplateFile && !templateFile && (
                <p className="ua-field-hint">Current: {existing.templateFileName}</p>
              )}
            </div>
          </div>
        </div>

        {error && <p className="ua-modal-error">{error}</p>}

        <div className="ua-modal-actions">
          <button className="ua-btn ua-btn-ghost" onClick={onClose} disabled={saving}>Cancel</button>
          {isEditing ? (
            <button className="ua-btn ua-btn-primary" onClick={() => submit(undefined)} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          ) : (
            <>
              <button className="ua-btn ua-btn-secondary" onClick={() => submit('DRAFT')} disabled={saving}>
                Save as Draft
              </button>
              <button className="ua-btn ua-btn-primary" onClick={() => submit('PUBLISHED')} disabled={saving}>
                Publish
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
