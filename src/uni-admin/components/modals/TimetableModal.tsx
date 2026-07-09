import { useEffect, useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { getCourses } from '../../api/uniAdmin'
import { useAuth } from '../../../auth/AuthContext'
import type {
  CohortResponse, CourseResponse, CreateTimetableRequest, DayOfWeek,
  LecturerResponse, TimetableEntry,
} from '../../api/types'
import '../../styles/uniAdmin.css'

const DAYS: DayOfWeek[] = ['MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY']

const PRESET_COLORS = [
  '#6366f1', '#10b981', '#f59e0b', '#0ea5e9',
  '#ef4444', '#8b5cf6', '#f97316', '#14b8a6',
]

function apiErr(err: unknown, fallback: string) {
  if (isAxiosError(err) && err.response?.data?.message) return err.response.data.message
  return fallback
}

interface Props {
  open:      boolean
  existing?: TimetableEntry | null
  cohorts:   CohortResponse[]
  lecturers: LecturerResponse[]
  onClose:   () => void
  onSave:    (data: CreateTimetableRequest) => Promise<void>
}

export default function TimetableModal({ open, existing, cohorts, lecturers, onClose, onSave }: Props) {
  const { universityId } = useAuth()

  const [courses,        setCourses]        = useState<CourseResponse[]>([])
  const [courseSearch,   setCourseSearch]   = useState('')
  const [dropdownOpen,   setDropdownOpen]   = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(null)

  const [title,      setTitle]      = useState('')
  const [room,       setRoom]       = useState('')
  const [day,        setDay]        = useState<DayOfWeek>('MONDAY')
  const [startTime,  setStartTime]  = useState('08:00')
  const [endTime,    setEndTime]    = useState('10:00')
  const [color,      setColor]      = useState(PRESET_COLORS[0])
  const [cohortId,   setCohortId]   = useState<number | ''>('')
  const [lecturerId, setLecturerId] = useState<number | ''>('')
  const [error,      setError]      = useState<string | null>(null)
  const [saving,     setSaving]     = useState(false)

  const searchRef   = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    getCourses({ universityId: universityId ?? undefined })
      .then(r => setCourses(r.data))
      .catch(() => {})
  }, [open, universityId])

  useEffect(() => {
    if (!open) return
    setTitle(existing?.title ?? '')
    setRoom(existing?.room ?? '')
    setDay(existing?.dayOfWeek ?? 'MONDAY')
    setStartTime(existing?.startTime?.slice(0, 5) ?? '08:00')
    setEndTime(existing?.endTime?.slice(0, 5) ?? '10:00')
    setColor(existing?.color ?? PRESET_COLORS[0])
    setCohortId(existing?.cohortId ?? '')
    setLecturerId(existing?.lecturerId ?? '')
    setCourseSearch(existing?.title ?? '')
    setSelectedCourse(null)
    setDropdownOpen(false)
    setError(null)
  }, [open, existing])

  useEffect(() => {
    if (!existing || courses.length === 0) return
    const match = courses.find(c => c.name === existing.title)
    if (match) {
      setSelectedCourse(match)
      setCourseSearch(match.name)
      if (match.lecturerId && !existing.lecturerId) setLecturerId(match.lecturerId)
    }
  }, [courses, existing])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        searchRef.current   && !searchRef.current.contains(e.target as Node)
      ) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!open) return null

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
    (c.programmeName ?? '').toLowerCase().includes(courseSearch.toLowerCase()) ||
    (c.lecturerName  ?? '').toLowerCase().includes(courseSearch.toLowerCase())
  )

  const handleSelectCourse = (c: CourseResponse) => {
    setSelectedCourse(c)
    setCourseSearch(c.name)
    setTitle(c.name)
    setDropdownOpen(false)
    if (c.lecturerId) setLecturerId(c.lecturerId)
  }

  const submit = async () => {
    if (!existing && !selectedCourse) { setError('Select a course'); return }
    if (!title.trim()) { setError('Course / title is required'); return }
    if (!room.trim()) { setError('Room is required'); return }
    if (!cohortId) { setError('Select a cohort'); return }
    if (startTime >= endTime) { setError('End time must be after start time'); return }

    setSaving(true)
    try {
      await onSave({
        title: title.trim(),
        room: room.trim(),
        dayOfWeek: day,
        startTime,
        endTime,
        color,
        cohortId: Number(cohortId),
        lecturerId: lecturerId !== '' ? Number(lecturerId) : null,
      })
      onClose()
    } catch (err) {
      setError(apiErr(err, 'Failed to save entry'))
    } finally {
      setSaving(false)
    }
  }

  const activeLecturers = lecturers.filter(l => l.status === 'ACTIVE')

  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title">{existing ? 'Edit Timetable Entry' : 'Add Timetable Entry'}</h2>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Course</label>
          <div style={{ position: 'relative' }}>
            <input
              ref={searchRef}
              className="ua-modal-input"
              placeholder="Search course by name, programme or lecturer…"
              value={courseSearch}
              autoComplete="off"
              onChange={e => {
                setCourseSearch(e.target.value)
                setDropdownOpen(true)
                if (!e.target.value) { setSelectedCourse(null); setLecturerId('') }
              }}
              onFocus={() => setDropdownOpen(true)}
            />
            {dropdownOpen && filteredCourses.length > 0 && (
              <div
                ref={dropdownRef}
                style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 60,
                  background: 'white', border: '1px solid #e5e7eb', borderRadius: 8,
                  boxShadow: '0 4px 16px rgba(0,0,0,.12)', maxHeight: 220, overflowY: 'auto',
                  marginTop: 3,
                }}
              >
                {filteredCourses.map(c => (
                  <div
                    key={c.id}
                    onMouseDown={() => handleSelectCourse(c)}
                    style={{
                      padding: '0.55rem 0.875rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f3f4f6',
                      background: selectedCourse?.id === c.id ? '#eff6ff' : 'white',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                    onMouseLeave={e => (e.currentTarget.style.background = selectedCourse?.id === c.id ? '#eff6ff' : 'white')}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#1E3A5F' }}>{c.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 2 }}>
                      {c.programmeName ?? ''}
                      {c.lecturerName && <> · <span style={{ color: '#6366f1' }}>{c.lecturerName}</span></>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {(selectedCourse?.lecturerName ?? existing?.lecturerName) && (
            <div style={{
              marginTop: '0.4rem',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#eff6ff', color: '#1d4ed8',
              border: '1px solid #bfdbfe', borderRadius: 6,
              padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600,
            }}>
              Lecturer: {selectedCourse?.lecturerName ?? existing?.lecturerName}
            </div>
          )}
        </div>

        <div className="ua-two-col">
          <div className="ua-modal-field">
            <label className="ua-modal-label">Room *</label>
            <input className="ua-modal-input" value={room}
              onChange={e => setRoom(e.target.value)} placeholder="e.g. KB601" />
          </div>
          <div className="ua-modal-field">
            <label className="ua-modal-label">Day *</label>
            <select className="ua-modal-input" value={day}
              onChange={e => setDay(e.target.value as DayOfWeek)}>
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="ua-two-col">
          <div className="ua-modal-field">
            <label className="ua-modal-label">Start Time *</label>
            <input className="ua-modal-input" type="time" value={startTime}
              onChange={e => setStartTime(e.target.value)} />
          </div>
          <div className="ua-modal-field">
            <label className="ua-modal-label">End Time *</label>
            <input className="ua-modal-input" type="time" value={endTime}
              onChange={e => setEndTime(e.target.value)} />
          </div>
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Cohort *</label>
          <select className="ua-modal-input" value={cohortId}
            onChange={e => setCohortId(Number(e.target.value))}>
            <option value="">Select cohort…</option>
            {cohorts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {!selectedCourse && (
          <div className="ua-modal-field">
            <label className="ua-modal-label">Lecturer (optional)</label>
            <select className="ua-modal-input" value={lecturerId}
              onChange={e => setLecturerId(e.target.value ? Number(e.target.value) : '')}>
              <option value="">No lecturer assigned</option>
              {activeLecturers.map(l => (
                <option key={l.id} value={l.id}>{l.firstName} {l.lastName}</option>
              ))}
            </select>
          </div>
        )}

        <div className="ua-modal-field">
          <label className="ua-modal-label">Colour</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 28, height: 28, borderRadius: '50%', background: c,
                  border: color === c ? '3px solid #111' : '2px solid transparent',
                  cursor: 'pointer', padding: 0,
                }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer' }}
              title="Custom colour"
            />
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
