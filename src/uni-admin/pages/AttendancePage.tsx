import { useEffect, useState } from 'react'
import { AlertCircle, BarChart3, CheckCheck, Users, UserRound } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import { useUniAdminSidebarUser } from '../hooks/useUniAdminSidebarUser'
import { getCohorts } from '../api/uniAdmin'
import type { CohortResponse } from '../api/types'
import {
  getCohortAttendanceStats,
  getStudentAttendanceStats,
} from '../../api/attendanceApi'
import type { StudentAttendanceStats } from '../../api/attendanceApi'
import '../styles/uniAdmin.css'
import '../../shared/styles/attendance.css'

function RateBar({ rate }: { rate: number }) {
  const r     = Math.round(rate)
  const color = r >= 80 ? '#16a34a' : r >= 60 ? '#d97706' : '#dc2626'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <div className="att-rate-bar-wrap" style={{ flex: 1, minWidth: 80 }}>
        <div className="att-rate-bar-fill" style={{ width: `${Math.min(r, 100)}%`, background: color }} />
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color, flexShrink: 0, minWidth: 34 }}>
        {r}%
      </span>
    </div>
  )
}

interface DetailModalProps {
  stats:   StudentAttendanceStats
  onClose: () => void
}

function StudentDetailModal({ stats, onClose }: DetailModalProps) {
  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserRound size={18} />
          {stats.studentName}
          <span style={{ fontWeight: 400, color: '#9ca3af', fontSize: '0.8rem' }}>{stats.studentRef}</span>
        </h2>

        {stats.cohorts.length === 0 && (
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No attendance data yet.</p>
        )}

        {stats.cohorts.map(c => {
          const rate  = Math.round(c.attendanceRate)
          const color = rate >= 80 ? '#16a34a' : rate >= 60 ? '#d97706' : '#dc2626'
          return (
            <div key={c.cohortId} style={{
              marginBottom: '0.875rem', padding: '0.875rem',
              background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'flex-start', marginBottom: '0.5rem',
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#1E3A5F' }}>{c.cohortName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{c.programmeName}</div>
                </div>
                {c.qualifiedForExam
                  ? <span className="att-qual-yes"><CheckCheck size={11} /> Qualified</span>
                  : <span className="att-qual-no"><AlertCircle size={11} /> Not qualified</span>
                }
              </div>
              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ color: '#16a34a', fontWeight: 700 }}>{c.present}P</span>
                <span style={{ color: '#d97706', fontWeight: 700 }}>{c.late}L</span>
                <span style={{ color: '#dc2626', fontWeight: 700 }}>{c.absent}A</span>
                <span style={{ color: '#9ca3af' }}>/ {c.totalSessions} sessions</span>
              </div>
              <div className="att-rate-bar-wrap">
                <div className="att-rate-bar-fill" style={{ width: `${Math.min(rate, 100)}%`, background: color }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 4 }}>{rate}% attendance rate</div>
            </div>
          )
        })}

        <div className="ua-modal-actions">
          <button className="ua-btn ua-btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

export default function UniAdminAttendancePage() {
  const sidebarUser = useUniAdminSidebarUser()

  const [cohorts,          setCohorts]          = useState<CohortResponse[]>([])
  const [selectedCohortId, setSelectedCohortId] = useState<number | ''>('')
  const [stats,            setStats]            = useState<StudentAttendanceStats[]>([])
  const [loading,          setLoading]          = useState(false)
  const [selectedStudent,  setSelectedStudent]  = useState<StudentAttendanceStats | null>(null)
  const [loadingDetail,    setLoadingDetail]    = useState(false)

  useEffect(() => {
    getCohorts().then(r => setCohorts(r.data)).catch(() => {})
  }, [])

  const handleLoad = async () => {
    if (!selectedCohortId) return
    setLoading(true)
    try {
      const data = await getCohortAttendanceStats(selectedCohortId as number)
      setStats(data)
    } catch {
      setStats([])
    } finally {
      setLoading(false)
    }
  }

  const handleStudentClick = async (studentId: number) => {
    setLoadingDetail(true)
    try {
      const detail = await getStudentAttendanceStats(studentId)
      setSelectedStudent(detail)
    } catch {
      const found = stats.find(s => s.studentId === studentId)
      if (found) setSelectedStudent(found)
    } finally {
      setLoadingDetail(false)
    }
  }

  const qualified    = stats.filter(s => s.cohorts.some(c => c.qualifiedForExam)).length
  const notQualified = stats.length - qualified
  const avgRate      = stats.length > 0
    ? Math.round(stats.reduce((sum, s) => sum + (s.cohorts[0]?.attendanceRate ?? 0), 0) / stats.length)
    : 0

  return (
    <Layout
      navItems={UNI_ADMIN_NAV}
      user={sidebarUser}
      title="Attendance"
      subtitle="Monitor student attendance and exam eligibility"
    >
      <div className="ua-page">

        {/* ── Cohort selector ── */}
        <div className="ua-card">
          <div className="ua-card-header">
            <p className="ua-card-title"><BarChart3 size={14} /> Attendance Overview</p>
          </div>
          <div style={{ padding: '0.875rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, maxWidth: 320 }}>
              <label className="att-form-label" style={{ display: 'block', marginBottom: '0.3rem' }}>
                Select Cohort
              </label>
              <select
                className="ua-modal-input"
                value={selectedCohortId}
                onChange={e => {
                  setSelectedCohortId(e.target.value ? Number(e.target.value) : '')
                  setStats([])
                }}
              >
                <option value="">Choose cohort…</option>
                {cohorts.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button
              className="ua-btn ua-btn-primary"
              onClick={handleLoad}
              disabled={!selectedCohortId || loading}
            >
              {loading ? 'Loading…' : 'Load Stats'}
            </button>
          </div>
        </div>

        {/* ── KPIs ── */}
        {stats.length > 0 && (
          <>
            <div className="ua-kpi-row">
              <div className="ua-kpi-card">
                <Users size={20} style={{ color: '#1E3A5F' }} />
                <span className="ua-kpi-value">{stats.length}</span>
                <span className="ua-kpi-label">Students</span>
              </div>
              <div className="ua-kpi-card">
                <CheckCheck size={20} style={{ color: '#16a34a' }} />
                <span className="ua-kpi-value green">{qualified}</span>
                <span className="ua-kpi-label">Qualified for Exam</span>
              </div>
              <div className="ua-kpi-card">
                <AlertCircle size={20} style={{ color: '#dc2626' }} />
                <span className="ua-kpi-value" style={{ color: '#dc2626' }}>{notQualified}</span>
                <span className="ua-kpi-label">Not Qualified</span>
              </div>
              <div className="ua-kpi-card">
                <BarChart3 size={20} style={{ color: '#2563eb' }} />
                <span className="ua-kpi-value" style={{ color: '#2563eb' }}>{avgRate}%</span>
                <span className="ua-kpi-label">Avg Attendance Rate</span>
              </div>
            </div>

            {/* ── Stats table ── */}
            <div className="ua-card">
              <div className="ua-card-header">
                <p className="ua-card-title">
                  <Users size={14} /> Student Attendance
                  <span className="ua-count">{stats.length} students · click row for details</span>
                </p>
              </div>
              <div className="ua-table-wrap">
                <table className="ua-table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Ref</th>
                      <th style={{ textAlign: 'center' }}>Present</th>
                      <th style={{ textAlign: 'center' }}>Late</th>
                      <th style={{ textAlign: 'center' }}>Absent</th>
                      <th style={{ textAlign: 'center' }}>Sessions</th>
                      <th style={{ minWidth: 160 }}>Attendance Rate</th>
                      <th>Exam Eligibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map(student => {
                      const c = student.cohorts[0]
                      if (!c) return null
                      return (
                        <tr
                          key={student.studentId}
                          className="att-admin-row"
                          onClick={() => handleStudentClick(student.studentId)}
                          title="Click for full breakdown"
                        >
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="att-avatar" style={{ width: 28, height: 28 }}>
                                <UserRound size={14} color="#9ca3af" />
                              </div>
                              <span className="col-name">{student.studentName}</span>
                            </div>
                          </td>
                          <td className="col-muted">{student.studentRef}</td>
                          <td style={{ textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>{c.present}</td>
                          <td style={{ textAlign: 'center', color: '#d97706', fontWeight: 700 }}>{c.late}</td>
                          <td style={{ textAlign: 'center', color: '#dc2626', fontWeight: 700 }}>{c.absent}</td>
                          <td style={{ textAlign: 'center', color: '#6b7280' }}>{c.totalSessions}</td>
                          <td><RateBar rate={c.attendanceRate} /></td>
                          <td>
                            {c.qualifiedForExam
                              ? <span className="att-qual-yes"><CheckCheck size={11} /> Qualified</span>
                              : <span className="att-qual-no"><AlertCircle size={11} /> Not qualified</span>
                            }
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Student detail modal ── */}
        {selectedStudent && (
          <StudentDetailModal
            stats={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        )}

        {loadingDetail && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          }}>
            <div style={{ background: 'white', padding: '1rem 2rem', borderRadius: 8, fontSize: '0.875rem' }}>
              Loading student data…
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}
