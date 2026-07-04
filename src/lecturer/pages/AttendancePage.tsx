import { useEffect, useState } from 'react'
import { CalendarDays, CheckCheck, Clock, Plus, Save, UserRound, Users } from 'lucide-react'
import { getCohorts } from '../../uni-admin/api/uniAdmin'
import type { CohortResponse } from '../../uni-admin/api/types'
import {
  createSession,
  getLecturerSessions,
  getSessionStudents,
  markAttendance,
} from '../../api/attendanceApi'
import type {
  AttendanceSession,
  SessionStudentResponse,
  AttendanceStatus,
  MarkAttendanceEntry,
} from '../../api/attendanceApi'
import '../../shared/styles/attendance.css'
import '../styles/lecturer.css'

type MarkState = { status: AttendanceStatus | null; minutesLate: string }

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export default function LecturerAttendancePage() {
  const [cohorts,          setCohorts]          = useState<CohortResponse[]>([])
  const [selectedCohortId, setSelectedCohortId] = useState<number | ''>('')
  const [sessionDate,      setSessionDate]      = useState(todayIso())
  const [topic,            setTopic]            = useState('')
  const [sessions,         setSessions]         = useState<AttendanceSession[]>([])
  const [creating,         setCreating]         = useState(false)
  const [activeSession,    setActiveSession]    = useState<AttendanceSession | null>(null)
  const [students,         setStudents]         = useState<SessionStudentResponse[]>([])
  const [marks,            setMarks]            = useState<Record<number, MarkState>>({})
  const [loadingStudents,  setLoadingStudents]  = useState(false)
  const [saving,           setSaving]           = useState(false)
  const [savedBanner,      setSavedBanner]      = useState(false)
  const [error,            setError]            = useState<string | null>(null)

  useEffect(() => {
    getCohorts().then(r => setCohorts(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedCohortId) { setSessions([]); return }
    getLecturerSessions(selectedCohortId as number).then(setSessions).catch(() => {})
  }, [selectedCohortId])

  useEffect(() => {
    if (!activeSession) return
    setLoadingStudents(true)
    getSessionStudents(activeSession.id)
      .then(studs => {
        setStudents(studs)
        const m: Record<number, MarkState> = {}
        for (const s of studs) {
          m[s.studentId] = {
            status: s.status ?? null,
            minutesLate: s.minutesLate?.toString() ?? '',
          }
        }
        setMarks(m)
      })
      .catch(() => {})
      .finally(() => setLoadingStudents(false))
  }, [activeSession])

  const handleCreateSession = async () => {
    if (!selectedCohortId) { setError('Select a cohort first'); return }
    setCreating(true); setError(null)
    try {
      const session = await createSession({
        cohortId:    selectedCohortId as number,
        sessionDate,
        topic:       topic.trim() || undefined,
      })
      setSessions(prev => [session, ...prev])
      setActiveSession(session)
      setTopic('')
    } catch {
      setError('Failed to create session. It may already exist for this cohort and date.')
    } finally {
      setCreating(false)
    }
  }

  const handleSelectSession = (s: AttendanceSession) => {
    setActiveSession(s)
    setError(null)
  }

  const handleStatus = (studentId: number, status: AttendanceStatus) => {
    setMarks(prev => {
      const current = prev[studentId]?.status
      return {
        ...prev,
        [studentId]: {
          status:      current === status ? null : status,
          minutesLate: current === status ? '' : (status === 'LATE' ? (prev[studentId]?.minutesLate ?? '') : ''),
        },
      }
    })
  }

  const handleMinutes = (studentId: number, val: string) => {
    setMarks(prev => ({ ...prev, [studentId]: { ...prev[studentId], minutesLate: val } }))
  }

  const handleSave = async () => {
    if (!activeSession) return
    const entries: MarkAttendanceEntry[] = students
      .filter(s => marks[s.studentId]?.status != null)
      .map(s => {
        const m = marks[s.studentId]
        return {
          studentId:   s.studentId,
          status:      m.status!,
          minutesLate: m.status === 'LATE' ? (parseInt(m.minutesLate || '0', 10) || 0) : undefined,
        }
      })
    setSaving(true); setError(null)
    try {
      await markAttendance(activeSession.id, entries)
      setSavedBanner(true)
      setTimeout(() => setSavedBanner(false), 3500)
      if (selectedCohortId) {
        getLecturerSessions(selectedCohortId as number).then(setSessions).catch(() => {})
      }
    } catch {
      setError('Failed to save attendance. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const markedCount  = students.filter(s => marks[s.studentId]?.status != null).length
  const presentCount = students.filter(s => marks[s.studentId]?.status === 'PRESENT').length
  const lateCount    = students.filter(s => marks[s.studentId]?.status === 'LATE').length
  const absentCount  = students.filter(s => marks[s.studentId]?.status === 'ABSENT').length

  return (
    <div className="ua-page">

      {/* ── Session form ── */}
      <div className="ua-card">
        <div className="ua-card-header">
          <p className="ua-card-title"><CalendarDays size={14} /> Session Setup</p>
        </div>
        <div style={{ padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="att-form-row">
            <div className="att-form-field">
              <label className="att-form-label">Cohort *</label>
              <select
                className="ua-modal-input"
                value={selectedCohortId}
                onChange={e => {
                  setSelectedCohortId(e.target.value ? Number(e.target.value) : '')
                  setActiveSession(null)
                  setStudents([])
                }}
              >
                <option value="">Select cohort…</option>
                {cohorts.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="att-form-field">
              <label className="att-form-label">Date *</label>
              <input
                className="ua-modal-input"
                type="date"
                value={sessionDate}
                onChange={e => setSessionDate(e.target.value)}
              />
            </div>
            <div className="att-form-field" style={{ flex: 2 }}>
              <label className="att-form-label">Topic (optional)</label>
              <input
                className="ua-modal-input"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Introduction to React"
              />
            </div>
            <button
              className="ua-btn ua-btn-primary"
              style={{ flexShrink: 0, alignSelf: 'flex-end' }}
              onClick={handleCreateSession}
              disabled={creating || !selectedCohortId}
            >
              <Plus size={13} /> {creating ? 'Creating…' : 'New Session'}
            </button>
          </div>
          {error && (
            <p style={{ fontSize: '0.8rem', color: '#dc2626', margin: 0 }}>{error}</p>
          )}
        </div>
      </div>

      {/* ── Sessions list ── */}
      {sessions.length > 0 && !activeSession && (
        <div className="ua-card">
          <div className="ua-card-header">
            <p className="ua-card-title">
              <CalendarDays size={14} /> Sessions
              <span className="ua-count">{sessions.length}</span>
            </p>
          </div>
          <div className="att-session-list">
            {sessions.map(s => (
              <button key={s.id} className="att-session-item" onClick={() => handleSelectSession(s)}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#1E3A5F' }}>
                    {s.sessionDate}{s.topic ? ` · ${s.topic}` : ''}
                  </div>
                  <div className="att-session-meta">{s.cohortName}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="att-session-progress">
                    {s.markedStudents}/{s.totalStudents} marked
                  </span>
                  <span style={{
                    fontSize: '0.72rem', background: '#eff6ff', color: '#1d4ed8',
                    padding: '2px 8px', borderRadius: 999, fontWeight: 700,
                  }}>Open →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Student marking ── */}
      {activeSession && (
        <>
          {savedBanner && (
            <div style={{
              padding: '.75rem 1rem', background: '#dcfce7', borderRadius: 8,
              color: '#16a34a', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <CheckCheck size={16} /> Attendance saved successfully.
            </div>
          )}

          <div className="ua-card">
            <div className="ua-card-header">
              <p className="ua-card-title">
                <Users size={14} /> {activeSession.cohortName}
                <span style={{ fontWeight: 400, color: '#9ca3af', marginLeft: 8, fontSize: '0.78rem' }}>
                  {activeSession.sessionDate}{activeSession.topic ? ` · ${activeSession.topic}` : ''}
                </span>
                <span className="ua-count">
                  {markedCount}/{students.length}
                  {presentCount > 0 && ` · ${presentCount}P`}
                  {lateCount > 0    && ` · ${lateCount}L`}
                  {absentCount > 0  && ` · ${absentCount}A`}
                </span>
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="ua-btn ua-btn-ghost"
                  onClick={() => { setActiveSession(null); setStudents([]) }}
                >
                  ← Back
                </button>
                <button
                  className="ua-btn ua-btn-success"
                  onClick={handleSave}
                  disabled={saving || markedCount === 0}
                >
                  <Save size={13} /> {saving ? 'Saving…' : 'Save Attendance'}
                </button>
              </div>
            </div>

            {loadingStudents ? (
              <p className="ua-table-empty">Loading students…</p>
            ) : students.length === 0 ? (
              <div className="att-empty">
                <Users size={28} />
                <span>No students in this cohort.</span>
              </div>
            ) : (
              <div className="att-student-grid">
                {students.map(s => {
                  const mark = marks[s.studentId]
                  const st   = mark?.status
                  const cardClass =
                    st === 'PRESENT' ? 'marked-present' :
                    st === 'ABSENT'  ? 'marked-absent'  :
                    st === 'LATE'    ? 'marked-late'     : ''
                  return (
                    <div key={s.studentId} className={`att-student-card ${cardClass}`}>
                      {/* Avatar + info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div className="att-avatar">
                          <UserRound size={20} color="#9ca3af" />
                        </div>
                        <div className="att-student-info">
                          <div className="att-student-name">{s.firstName} {s.lastName}</div>
                          <div className="att-student-ref">{s.studentRef}</div>
                        </div>
                      </div>

                      {/* Status buttons */}
                      <div className="att-status-btns">
                        <button
                          className={`att-status-btn present ${st === 'PRESENT' ? 'active' : ''}`}
                          onClick={() => handleStatus(s.studentId, 'PRESENT')}
                        >Present</button>
                        <button
                          className={`att-status-btn absent ${st === 'ABSENT' ? 'active' : ''}`}
                          onClick={() => handleStatus(s.studentId, 'ABSENT')}
                        >Absent</button>
                        <button
                          className={`att-status-btn late ${st === 'LATE' ? 'active' : ''}`}
                          onClick={() => handleStatus(s.studentId, 'LATE')}
                        >Late</button>
                      </div>

                      {/* Minutes late */}
                      {st === 'LATE' && (
                        <div className="att-late-row">
                          <Clock size={12} style={{ color: '#d97706', flexShrink: 0 }} />
                          <input
                            className="att-late-input"
                            type="number"
                            min="1"
                            max="120"
                            placeholder="0"
                            value={mark.minutesLate}
                            onChange={e => handleMinutes(s.studentId, e.target.value)}
                          />
                          <span className="att-late-label">mins late</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
