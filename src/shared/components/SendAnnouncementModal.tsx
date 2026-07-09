import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { getCohorts, getStudents, getLecturers } from '../../uni-admin/api/uniAdmin'
import type { CohortResponse, StudentResponse, LecturerResponse } from '../../uni-admin/api/types'
import { sendAnnouncement } from '../../api/announcementsApi'
import type { AnnouncementAudience, CreateAnnouncementRequest } from '../../api/announcementsApi'
import '../../uni-admin/styles/uniAdmin.css'

interface AudienceOption {
  value: AnnouncementAudience
  label:  string
}

const ADMIN_AUDIENCES: AudienceOption[] = [
  { value: 'ALL_UNIVERSITY_STUDENTS',  label: 'All students in my university' },
  { value: 'ALL_COHORT_STUDENTS', label: 'All students in a cohort' },
  { value: 'SPECIFIC_STUDENTS', label: 'Specific students' },
  { value: 'ALL_UNIVERSITY_LECTURERS', label: 'All lecturers in my university' },
  { value: 'SPECIFIC_LECTURERS', label: 'Specific lecturers' },
]

const LECTURER_AUDIENCES: AudienceOption[] = [
  { value: 'ALL_COHORT_STUDENTS', label: 'All students in a cohort' },
  { value: 'SPECIFIC_STUDENTS',   label: 'Specific students' },
]

interface Props {
  role: 'UNI_ADMIN' | 'LECTURER'
  open: boolean
  onClose: () => void
  onSent:  () => void
}

export default function SendAnnouncementModal({ role, open, onClose, onSent }: Props) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState<AnnouncementAudience>('ALL_COHORT_STUDENTS')
  const [cohortId, setCohortId] = useState<number | ''>('')
  const [studentIds, setStudentIds] = useState<number[]>([])
  const [lecturerIds, setLecturerIds]  = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [cohorts, setCohorts] = useState<CohortResponse[]>([])
  const [students, setStudents] = useState<StudentResponse[]>([])
  const [lecturers, setLecturers] = useState<LecturerResponse[]>([])

  const audiences = role === 'UNI_ADMIN' ? ADMIN_AUDIENCES : LECTURER_AUDIENCES

  useEffect(() => {
    if (!open) return
    setSubject(''); setMessage(''); setError(null)
    setAudience(audiences[0].value)
    setCohortId(''); setStudentIds([]); setLecturerIds([])

    getCohorts().then(r => setCohorts(r.data)).catch(() => {})
    getStudents().then(r => setStudents(r.data)).catch(() => {})
    if (role === 'UNI_ADMIN') {
      getLecturers().then(r => setLecturers(r.data)).catch(() => {})
    }
  }, [open])

  if (!open) return null

  const toggleId = (
    id: number,
    list: number[],
    setter: (v: number[]) => void,
  ) => setter(list.includes(id) ? list.filter(x => x !== id) : [...list, id])

  const submit = async () => {
    if (!subject.trim()) { setError('Subject is required'); return }
    if (!message.trim()) { setError('Message is required');  return }
    if (audience === 'ALL_COHORT_STUDENTS' && !cohortId) {
      setError('Select a cohort'); return
    }
    if (audience === 'SPECIFIC_STUDENTS' && studentIds.length === 0) {
      setError('Select at least one student'); return
    }
    if (audience === 'SPECIFIC_LECTURERS' && lecturerIds.length === 0) {
      setError('Select at least one lecturer'); return
    }

    const payload: CreateAnnouncementRequest = {
      subject: subject.trim(),
      message: message.trim(),
      audience,
      cohortId: audience === 'ALL_COHORT_STUDENTS'  ? Number(cohortId) : null,
      studentIds: audience === 'SPECIFIC_STUDENTS'    ? studentIds       : null,
      lecturerIds: audience === 'SPECIFIC_LECTURERS'   ? lecturerIds      : null,
    }

    setSaving(true)
    try {
      await sendAnnouncement(payload)
      onSent()
      onClose()
    } catch (err) {
      setError(isAxiosError(err) ? (err.response?.data?.message ?? 'Failed to send') : 'Failed to send')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title">New Announcement</h2>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Send to *</label>
          <select className="ua-modal-input" value={audience}
            onChange={e => { setAudience(e.target.value as AnnouncementAudience); setCohortId(''); setStudentIds([]); setLecturerIds([]) }}>
            {audiences.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        {audience === 'ALL_COHORT_STUDENTS' && (
          <div className="ua-modal-field">
            <label className="ua-modal-label">Cohort *</label>
            <select className="ua-modal-input" value={cohortId}
              onChange={e => setCohortId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">Select cohort…</option>
              {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}

        {audience === 'SPECIFIC_STUDENTS' && (
          <div className="ua-modal-field">
            <label className="ua-modal-label">Students * <span style={{ fontWeight: 400, color: '#9ca3af' }}>(click to select)</span></label>
            <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 0' }}>
              {students.map(s => (
                <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', cursor: 'pointer', background: studentIds.includes(s.id) ? '#eff6ff' : undefined }}>
                  <input type="checkbox" checked={studentIds.includes(s.id)}
                    onChange={() => toggleId(s.id, studentIds, setStudentIds)} />
                  <span style={{ fontSize: '0.82rem' }}>{s.firstName} {s.lastName}</span>
                </label>
              ))}
              {students.length === 0 && <p style={{ padding: '8px 12px', color: '#9ca3af', fontSize: '0.8rem' }}>No students found</p>}
            </div>
            {studentIds.length > 0 && <p style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: 4 }}>{studentIds.length} selected</p>}
          </div>
        )}

        {audience === 'SPECIFIC_LECTURERS' && (
          <div className="ua-modal-field">
            <label className="ua-modal-label">Lecturers * <span style={{ fontWeight: 400, color: '#9ca3af' }}>(click to select)</span></label>
            <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 0' }}>
              {lecturers.map(l => (
                <label key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', cursor: 'pointer', background: lecturerIds.includes(l.id) ? '#eff6ff' : undefined }}>
                  <input type="checkbox" checked={lecturerIds.includes(l.id)}
                    onChange={() => toggleId(l.id, lecturerIds, setLecturerIds)} />
                  <span style={{ fontSize: '0.82rem' }}>{l.firstName} {l.lastName}</span>
                </label>
              ))}
              {lecturers.length === 0 && <p style={{ padding: '8px 12px', color: '#9ca3af', fontSize: '0.8rem' }}>No lecturers found</p>}
            </div>
            {lecturerIds.length > 0 && <p style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: 4 }}>{lecturerIds.length} selected</p>}
          </div>
        )}

        <div className="ua-modal-field">
          <label className="ua-modal-label">Subject *</label>
          <input className="ua-modal-input" value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="e.g. Class cancelled tomorrow" />
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Message *</label>
          <textarea className="ua-modal-input" value={message} rows={5}
            style={{ resize: 'vertical', fontFamily: 'inherit' }}
            onChange={e => setMessage(e.target.value)}
            placeholder="Write your announcement here…" />
        </div>

        {error && <p className="ua-modal-error">{error}</p>}

        <div className="ua-modal-actions">
          <button className="ua-btn ua-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ua-btn ua-btn-primary" onClick={submit} disabled={saving}>
            {saving ? 'Sending…' : 'Send Announcement'}
          </button>
        </div>
      </div>
    </div>
  )
}
