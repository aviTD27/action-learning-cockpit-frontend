import { useEffect, useState } from 'react'
import type { StudentResponse } from '../../uni-admin/api/types'
import type { StudentGrade } from '../types'
import GradeBadge from './GradeBadge'
import '../styles/lecturer.css'

interface Props {
  open: boolean
  student: StudentResponse | null
  maxPoints: number
  existing?: StudentGrade
  onClose: () => void
  onSave: (grade: number, feedback: string) => void
}

export default function GradeModal({ open, student, maxPoints, existing, onClose, onSave }: Props) {
  const [grade, setGrade] = useState('')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setGrade(existing != null ? String(existing.grade) : '')
      setFeedback(existing?.feedback ?? '')
      setError(null)
    }
  }, [open, existing])

  if (!open || !student) return null

  const submit = () => {
    const value = Number(grade)
    if (grade === '' || Number.isNaN(value)) { setError('Enter a grade'); return }
    if (value < 0 || value > maxPoints) { setError(`Grade must be between 0 and ${maxPoints}`); return }
    onSave(value, feedback.trim())
    onClose()
  }

  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title">Grade — {student.firstName} {student.lastName}</h2>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Grade * (out of {maxPoints})</label>
          <input className="ua-modal-input" type="number" min={0} max={maxPoints}
            value={grade} onChange={e => setGrade(e.target.value)} />
          {grade !== '' && !Number.isNaN(Number(grade)) && Number(grade) >= 0 && Number(grade) <= maxPoints && (
            <p className="ua-grade-preview">
              Classification: <GradeBadge grade={Number(grade)} maxPoints={maxPoints} />
            </p>
          )}
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Feedback</label>
          <textarea className="ua-modal-input" rows={3} value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Comments for the student" />
        </div>

        {error && <p className="ua-modal-error">{error}</p>}

        <div className="ua-modal-actions">
          <button className="ua-btn ua-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ua-btn ua-btn-primary" onClick={submit}>Save Grade</button>
        </div>
      </div>
    </div>
  )
}
