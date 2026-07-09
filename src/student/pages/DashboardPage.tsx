import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, Clock, GraduationCap, Star, TrendingUp } from 'lucide-react'
import { useStudentDashboard } from '../hooks/useStudentDashboard'
import '../styles/student.css'

function formatDeadline(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = d.getTime() - now.getTime()
  const diffH = diffMs / 3_600_000

  if (diffH < 0) return d.toLocaleDateString()
  if (diffH < 24) return 'Today'
  if (diffH < 48) return 'Tomorrow'
  return d.toLocaleDateString()
}

function urgencyClass(iso: string, pastDue: boolean): string {
  if (pastDue) return 'sd-deadline-today'
  const diffH = (new Date(iso).getTime() - Date.now()) / 3_600_000
  if (diffH < 24) return 'sd-deadline-today'
  if (diffH < 48) return 'sd-deadline-soon'
  return ''
}

export default function DashboardPage() {
  const { stats, upcomingDeadlines, recentGrades, loading } = useStudentDashboard()

  if (loading) {
    return <div className="sd-page" style={{ padding: '2rem', color: '#6b7280' }}>Loading dashboard...</div>
  }

  const KPIS = [
    { icon: BookOpen, label: 'Total Assignments', value: stats.totalAssignments, color: ''},
    { icon: CheckCircle, label: 'Submitted', value: stats.submitted, color: 'green'},
    { icon: Clock, label: 'Pending', value: stats.pending, color: 'orange'},
    { icon: Star, label: 'Graded', value: stats.graded, color: 'blue'},
  ]

  return (
    <div className="sd-page">

      <div className="sd-kpi-row">
        {KPIS.map(k => (
          <div className="sd-kpi-card" key={k.label}>
            <span className={`sd-kpi-icon ${k.color}`}><k.icon size={20} /></span>
            <span className={`sd-kpi-value ${k.color}`}>{k.value}</span>
            <span className="sd-kpi-label">{k.label}</span>
          </div>
        ))}
      </div>

      <div className="sd-card">
        <div className="sd-card-header">
          <p className="sd-card-title">
            <Clock size={14} /> Upcoming Deadlines
            <span className="sd-card-count">{upcomingDeadlines.length} total</span>
          </p>
          <Link to="/student/assignments" className="sd-card-link">View all</Link>
        </div>
        <div className="sd-table-wrap">
          {upcomingDeadlines.length === 0 ? (
            <p className="sd-table-empty">No upcoming assignments.</p>
          ) : (
            <table className="sd-table">
              <thead>
                <tr>
                  <th>Assignment</th>
                  <th>Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingDeadlines.map(a => {
                  const urg = urgencyClass(a.deadline, a.pastDue)
                  return (
                    <tr key={a.id}>
                      <td className="col-title">{a.title}</td>
                      <td>
                        <div className="sd-deadline">
                          <span className="sd-deadline-date">{formatDeadline(a.deadline)}</span>
                          {urg && <span className={urg}>{a.pastDue ? 'Past due' : 'Due soon'}</span>}
                        </div>
                      </td>
                      <td>
                        {a.pastDue
                          ? <span className="sd-badge sd-badge-past-due">Past Due</span>
                          : a.submitted
                          ? <span className="sd-badge sd-badge-submitted">Submitted</span>
                          : <span className="sd-badge sd-badge-pending">Pending</span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="sd-two-col">

        <div className="sd-card">
          <div className="sd-card-header">
            <p className="sd-card-title"><TrendingUp size={14} /> Recent Grades</p>
            <Link to="/student/grades" className="sd-card-link">View all</Link>
          </div>
          <div className="sd-table-wrap">
            {recentGrades.length === 0 ? (
              <p className="sd-table-empty">No grades released yet.</p>
            ) : (
              <table className="sd-table">
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Score</th>
                    <th>Released</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGrades.slice(0, 5).map(g => (
                    <tr key={g.id}>
                      <td className="col-title">
                        {g.assignmentTitle}
                        {g.revised && <span className="sd-badge sd-badge-revised" style={{ marginLeft: 6 }}>Revised</span>}
                      </td>
                      <td className="col-score">{g.score}/{g.maxScore}</td>
                      <td className="col-muted">{new Date(g.releasedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="sd-card">
          <div className="sd-card-header">
            <p className="sd-card-title"><GraduationCap size={14} /> Quick Links</p>
          </div>
          <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { to: '/student/assignments', icon: BookOpen, label: 'View all assignments'},
              { to: '/student/grades', icon: Star, label: 'View my grades'},
              { to: '/student/cohort', icon: GraduationCap, label: 'My cohort info'},
            ].map(l => (
              <Link
                key={l.to}
                to={l.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#1E3A5F',
                  textDecoration: 'none',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
              >
                <l.icon size={14} />
                {l.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
