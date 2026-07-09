import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Award, BarChart2, BookOpen, CalendarDays, CheckCheck, Clock } from 'lucide-react'
import {
  getMyAttendance,
  getMyAttendanceStats,
} from '../../api/attendanceApi'
import type {
  AttendanceRecordResponse,
  StudentAttendanceStats,
} from '../../api/attendanceApi'
import '../../shared/styles/attendance.css'
import '../styles/student.css'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function StatusBadge({ status, minutesLate }: { status: string; minutesLate?: number | null }) {
  if (status === 'PRESENT') {
    return <span className="att-badge att-badge-present"><CheckCheck size={11} /> Present</span>
  }
  if (status === 'ABSENT') {
    return <span className="att-badge att-badge-absent"><AlertCircle size={11} /> Absent</span>
  }
  if (status === 'LATE') {
    return (
      <span className="att-badge att-badge-late">
        <Clock size={11} /> Late{minutesLate ? ` (${minutesLate}m)` : ''}
      </span>
    )
  }
  return null
}

interface CourseStats {
  courseName: string
  cohortName: string
  present: number
  late: number
  absent: number
  total: number
  rate: number
  qualifiedForExam?: boolean
}

function CourseCard({ stat }: { stat: CourseStats }) {
  const color = stat.rate >= 80 ? '#16a34a' : stat.rate >= 60 ? '#d97706' : '#dc2626'
  return (
    <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: '0.625rem', gap: '0.5rem',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1E3A5F', display: 'flex', alignItems: 'center', gap: 5 }}>
            <BookOpen size={13} style={{ color: '#6366f1', flexShrink: 0 }} />
            {stat.courseName}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: 2 }}>{stat.cohortName}</div>
        </div>
        {stat.qualifiedForExam != null && (
          stat.qualifiedForExam
            ? <span className="att-qual-yes"><CheckCheck size={11} /> Qualified</span>
            : <span className="att-qual-no"><AlertCircle size={11} /> Not qualified</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '0.625rem', fontSize: '0.75rem' }}>
        <span style={{ color: '#16a34a', fontWeight: 700 }}>{stat.present} present</span>
        <span style={{ color: '#d97706', fontWeight: 700 }}>{stat.late} late</span>
        <span style={{ color: '#dc2626', fontWeight: 700 }}>{stat.absent} absent</span>
        <span style={{ color: '#9ca3af' }}>{stat.total} sessions</span>
      </div>

      <div className="att-rate-bar-wrap">
        <div className="att-rate-bar-fill" style={{ width: `${Math.min(stat.rate, 100)}%`, background: color }} />
      </div>
      <div style={{ fontSize: '0.7rem', color, marginTop: 4, fontWeight: 600 }}>{stat.rate}% attendance rate</div>
    </div>
  )
}

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecordResponse[]>([])
  const [stats,   setStats]   = useState<StudentAttendanceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getMyAttendance(), getMyAttendanceStats()])
      .then(([recs, s]) => { setRecords(recs); setStats(s) })
      .catch(() => setError('Failed to load attendance data.'))
      .finally(() => setLoading(false))
  }, [])

  const courseStats = useMemo<CourseStats[]>(() => {
    const map = new Map<string, CourseStats>()
    for (const r of records) {
      const key = r.topic ?? r.cohortName
      if (!map.has(key)) {
        map.set(key, {
          courseName: key,
          cohortName: r.cohortName,
          present: 0, late: 0, absent: 0, total: 0, rate: 0,
        })
      }
      const cs = map.get(key)!
      cs.total++
      if (r.status === 'PRESENT') cs.present++
      else if (r.status === 'LATE') cs.late++
      else if (r.status === 'ABSENT') cs.absent++
    }
    for (const cs of map.values()) {
      cs.rate = cs.total > 0 ? Math.round((cs.present + cs.late) / cs.total * 100) : 0
    }
    const cohortMap = new Map(stats?.cohorts.map(c => [c.cohortName, c.qualifiedForExam]) ?? [])
    for (const cs of map.values()) {
      const qual = cohortMap.get(cs.cohortName)
      if (qual !== undefined) cs.qualifiedForExam = qual
    }
    return Array.from(map.values())
  }, [records, stats])

  const totalSessions = records.length
  const totalPresent  = records.filter(r => r.status === 'PRESENT').length
  const totalLate = records.filter(r => r.status === 'LATE').length
  const totalAbsent = records.filter(r => r.status === 'ABSENT').length
  const overallRate = totalSessions > 0
    ? Math.round((totalPresent + totalLate) / totalSessions * 100)
    : 0

  if (loading) return <p className="sd-table-empty">Loading attendance…</p>
  if (error) return <p className="sd-table-empty">{error}</p>

  return (
    <div className="sd-page">

      {totalSessions > 0 && (
        <div className="sd-kpi-row">
          <div className="sd-kpi-card">
            <CalendarDays size={20} className="sd-kpi-icon blue" />
            <span className="sd-kpi-value blue">{totalSessions}</span>
            <span className="sd-kpi-label">Total Sessions</span>
          </div>
          <div className="sd-kpi-card">
            <CheckCheck size={20} className="sd-kpi-icon green" />
            <span className="sd-kpi-value green">{totalPresent}</span>
            <span className="sd-kpi-label">Present</span>
          </div>
          <div className="sd-kpi-card">
            <Clock size={20} style={{ color: '#d97706' }} />
            <span className="sd-kpi-value orange">{totalLate}</span>
            <span className="sd-kpi-label">Late</span>
          </div>
          <div className="sd-kpi-card">
            <AlertCircle size={20} style={{ color: '#dc2626' }} />
            <span className="sd-kpi-value" style={{ color: '#dc2626' }}>{totalAbsent}</span>
            <span className="sd-kpi-label">Absent</span>
          </div>
          <div className="sd-kpi-card">
            <BarChart2 size={20} className={overallRate >= 80 ? 'sd-kpi-icon green' : 'sd-kpi-icon orange'} />
            <span
              className={overallRate >= 80 ? 'sd-kpi-value green' : 'sd-kpi-value orange'}
              style={overallRate < 60 ? { color: '#dc2626' } : undefined}
            >
              {overallRate}%
            </span>
            <span className="sd-kpi-label">Overall Rate</span>
          </div>
        </div>
      )}

      {courseStats.length > 0 && (
        <div className="sd-card">
          <div className="sd-card-header">
            <h3 className="sd-card-title">
              <Award size={15} /> By Course
              <span className="sd-card-count">{courseStats.length} course{courseStats.length !== 1 ? 's' : ''}</span>
            </h3>
          </div>
          {courseStats.map(cs => <CourseCard key={cs.courseName} stat={cs} />)}
        </div>
      )}

      <div className="sd-card">
        <div className="sd-card-header">
          <h3 className="sd-card-title">
            <CalendarDays size={15} /> Attendance Records
            <span className="sd-card-count">{records.length}</span>
          </h3>
        </div>

        {records.length === 0 ? (
          <div className="att-empty">
            <CalendarDays size={32} />
            <span>No attendance records yet.</span>
            <span style={{ fontSize: '0.8125rem' }}>
              Records appear once your lecturer marks attendance.
            </span>
          </div>
        ) : (
          <div>
            <div className="att-record-row att-record-header">
              <span>Date</span>
              <span>Course</span>
              <span>Status</span>
            </div>
            {records.map(r => (
              <div key={r.recordId} className="att-record-row">
                <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                  {formatDate(r.sessionDate)}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#1E3A5F', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <BookOpen size={11} style={{ color: '#6366f1', flexShrink: 0 }} />
                    {r.topic ?? r.cohortName}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{r.cohortName}</div>
                </div>
                <StatusBadge status={r.status} minutesLate={r.minutesLate} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
