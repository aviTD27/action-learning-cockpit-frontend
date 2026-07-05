import { useEffect, useState } from 'react'
import { AlertCircle, Award, BarChart2, CalendarDays, CheckCheck, Clock } from 'lucide-react'
import {
  getMyAttendance,
  getMyAttendanceStats,
} from '../../api/attendanceApi'
import type {
  AttendanceRecordResponse,
  StudentAttendanceStats,
  CohortAttendanceStat,
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

function CohortCard({ stat }: { stat: CohortAttendanceStat }) {
  const rate  = Math.round(stat.attendanceRate)
  const color = rate >= 80 ? '#16a34a' : rate >= 60 ? '#d97706' : '#dc2626'

  return (
    <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: '0.625rem', gap: '0.5rem',
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1E3A5F' }}>{stat.cohortName}</div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{stat.programmeName}</div>
        </div>
        {stat.qualifiedForExam
          ? <span className="att-qual-yes"><CheckCheck size={11} /> Qualified</span>
          : <span className="att-qual-no"><AlertCircle size={11} /> Not qualified</span>
        }
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '0.625rem', fontSize: '0.75rem' }}>
        <span style={{ color: '#16a34a', fontWeight: 700 }}>{stat.present} present</span>
        <span style={{ color: '#d97706', fontWeight: 700 }}>{stat.late} late</span>
        <span style={{ color: '#dc2626', fontWeight: 700 }}>{stat.absent} absent</span>
        <span style={{ color: '#9ca3af' }}>{stat.totalSessions} sessions</span>
      </div>

      <div className="att-rate-bar-wrap">
        <div className="att-rate-bar-fill" style={{ width: `${Math.min(rate, 100)}%`, background: color }} />
      </div>
      <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 4 }}>{rate}% attendance rate</div>
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

  if (loading) return <p className="sd-table-empty">Loading attendance…</p>
  if (error)   return <p className="sd-table-empty">{error}</p>

  const allCohorts    = stats?.cohorts ?? []
  const totalSessions = allCohorts.reduce((s, c) => s + c.totalSessions, 0)
  const totalPresent  = allCohorts.reduce((s, c) => s + c.present, 0)
  const totalLate     = allCohorts.reduce((s, c) => s + c.late, 0)
  const totalAbsent   = allCohorts.reduce((s, c) => s + c.absent, 0)
  const overallRate   = totalSessions > 0
    ? Math.round((totalPresent + totalLate) / totalSessions * 100)
    : 0

  return (
    <div className="sd-page">

      {/* ── KPI cards ── */}
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
            <span className="sd-kpi-label">Attendance Rate</span>
          </div>
        </div>
      )}

      {/* ── Per-cohort breakdown ── */}
      {allCohorts.length > 0 && (
        <div className="sd-card">
          <div className="sd-card-header">
            <h3 className="sd-card-title">
              <Award size={15} /> Cohort Breakdown
              <span className="sd-card-count">{allCohorts.length} cohort{allCohorts.length !== 1 ? 's' : ''}</span>
            </h3>
          </div>
          {allCohorts.map(c => <CohortCard key={c.cohortId} stat={c} />)}
        </div>
      )}

      {/* ── Records list ── */}
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
              <span>Topic · Cohort</span>
              <span>Status</span>
            </div>
            {records.map(r => (
              <div key={r.recordId} className="att-record-row">
                <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                  {formatDate(r.sessionDate)}
                </span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: '#1E3A5F' }}>
                    {r.topic || 'General Session'}
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
