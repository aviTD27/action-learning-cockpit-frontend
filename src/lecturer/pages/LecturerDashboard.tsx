import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, CheckCheck, ClipboardList, Clock, ShieldCheck } from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import Layout from '../../shared/layout/Layout'
import { LECTURER_NAV } from '../nav'
import { useAuth } from '../../auth/AuthContext'
import { useCourses } from '../../uni-admin/hooks/useCourses'
import { useStudents } from '../../uni-admin/hooks/useStudents'
import { useSubmissions } from '../hooks/useSubmissions'
import { useGradeOverview } from '../hooks/useGradeOverview'
import { getLecturerOverview } from '../api/lecturer'
import type { LecturerOverview } from '../api/types'
import '../../shared/styles/dashboard.css'
import '../styles/lecturer.css'

const BAND_COLORS: Record<string, string> = {
  Distinction: '#6366f1', Good: '#10b981', Pass: '#f59e0b', Fail: '#ef4444',
}

const C = ['#6366f1', '#10b981', '#f59e0b', '#0ea5e9', '#ef4444', '#8b5cf6', '#f97316']
const GRADE_COLORS: Record<string, string> = { RELEASED: '#10b981', DRAFT: '#f59e0b' }

const trunc = (s: string) => (s && s.length > 14 ? s.slice(0, 13) + '…' : s || '—')

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="db-tooltip">
      {label && <p className="db-tooltip-label">{label}</p>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="db-tooltip-row">
          <span className="db-tooltip-dot" style={{ background: p.color ?? p.fill }} />
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  )
}

export default function LecturerDashboard() {
  const { displayName } = useAuth()
  const { courses, loading: loadingCourses } = useCourses()
  const { students, loading: loadingStudents } = useStudents()
  const { submissions, loading: loadingSubs } = useSubmissions()
  const { grades } = useGradeOverview()

  const [overview, setOverview] = useState<LecturerOverview | null>(null)
  useEffect(() => {
    getLecturerOverview().then(res => setOverview(res.data)).catch(() => setOverview(null))
  }, [])

  const loading = loadingCourses || loadingStudents || loadingSubs
  const isEmpty = !loading && submissions.length === 0

  const institution = useMemo(
    () => students.find(s => s.universityName)?.universityName ?? '',
    [students],
  )
  const sidebarUser = { name: displayName ?? '', role: 'Lecturer', institution }

  const activeCourses = courses.filter(c => c.status === 'ACTIVE').length
  const activeStudents = students.filter(s => s.status === 'ACTIVE').length
  const releasedGrades = grades.filter(g => g.status === 'RELEASED').length
  const draftGrades = grades.filter(g => g.status === 'DRAFT').length

  const subsPerCohort = useMemo(() => {
    const counts: Record<string, number> = {}
    submissions.forEach(s => { counts[s.courseName] = (counts[s.courseName] ?? 0) + 1 })
    return Object.entries(counts)
      .map(([name, value]) => ({ name: trunc(name), submissions: value, full: name }))
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 8)
  }, [submissions])

  const gradeStatusData = useMemo(() => (
    [
      { name: 'Released', value: releasedGrades, key: 'RELEASED' },
      { name: 'Draft', value: draftGrades, key: 'DRAFT' },
    ].filter(d => d.value > 0)
  ), [releasedGrades, draftGrades])

  const avgScorePerCohort = useMemo(() => {
    const subMap = new Map<number, { courseName: string; maxPoints: number }>()
    submissions.forEach(s => subMap.set(s.id, { courseName: s.courseName, maxPoints: s.maxPoints }))
    const buckets: Record<string, number[]> = {}
    grades.filter(g => g.status === 'RELEASED').forEach(g => {
      const sub = subMap.get(g.submissionId)
      if (!sub || sub.maxPoints <= 0) return
      const pct = Math.min(100, Math.max(0, (g.grade / sub.maxPoints) * 100))
      ;(buckets[sub.courseName] ??= []).push(pct)
    })
    return Object.entries(buckets)
      .map(([name, arr]) => ({
        name: trunc(name),
        score: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length),
        full: name,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
  }, [submissions, grades])

  const deadlines = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    return submissions
      .filter(s => new Date(s.dueDate) >= today)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 6)
      .map(s => ({
        ...s,
        daysLeft: Math.ceil((new Date(s.dueDate).getTime() - today.getTime()) / 86_400_000),
      }))
  }, [submissions])

  return (
    <Layout navItems={LECTURER_NAV} user={sidebarUser} title="Lecturer Dashboard" subtitle="Dashboard · Action Learning Cockpit">
      <div className="db-page">

        <div className="db-header">
          <h1 className="db-title">Lecturer Dashboard</h1>
          <p className="db-sub">Your assignments, grading progress, and upcoming deadlines at a glance.</p>
        </div>

        {/* KPI Row — clickable tiles */}
        <div className="db-kpi-row">
          <Link to="/lecturer/submissions" className="db-kpi db-kpi-blue" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="db-kpi-label">Assignments</div>
            <div className="db-kpi-value">{loading ? '—' : submissions.length}</div>
            <div className="db-kpi-note">total submissions</div>
          </Link>
          <div className="db-kpi db-kpi-green">
            <div className="db-kpi-label">Courses</div>
            <div className="db-kpi-value">{loading ? '—' : courses.length}</div>
            <div className="db-kpi-note">{loading ? '' : `${activeCourses} active`}</div>
          </div>
          <div className="db-kpi db-kpi-indigo">
            <div className="db-kpi-label">Students</div>
            <div className="db-kpi-value">{loading ? '—' : students.length}</div>
            <div className="db-kpi-note">{loading ? '' : `${activeStudents} active`}</div>
          </div>
          <Link to="/lecturer/grade-review" className="db-kpi db-kpi-amber" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="db-kpi-label">Awaiting Grades</div>
            <div className="db-kpi-value">{overview ? overview.gradingBacklog : '—'}</div>
            <div className="db-kpi-note">submitted, not graded</div>
          </Link>
          <Link to="/lecturer/grade-review" className="db-kpi db-kpi-cyan" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="db-kpi-label">Released Grades</div>
            <div className="db-kpi-value">{loading ? '—' : releasedGrades}</div>
            <div className="db-kpi-note">{loading ? '' : `${draftGrades} drafts pending`}</div>
          </Link>
        </div>

        {/* Empty-state onboarding */}
        {isEmpty && (
          <div className="db-onboard">
            <h2 className="db-onboard-title">Welcome! You have no assignments yet</h2>
            <p className="db-onboard-sub">Create your first assignment to start collecting and grading student work.</p>
            <div className="db-onboard-grid">
              <Link to="/lecturer/submissions" className="db-onboard-card">
                <ClipboardList size={20} className="db-onboard-icon" />
                <span className="db-onboard-card-title">Create an Assignment</span>
                <span className="db-onboard-card-text">Set a title, deadline, submission type and Smart-Gate rules for your course.</span>
              </Link>
              <Link to="/lecturer/notify" className="db-onboard-card">
                <AlertTriangle size={20} className="db-onboard-icon" />
                <span className="db-onboard-card-title">Notify Students</span>
                <span className="db-onboard-card-text">Send reminders to students who haven't submitted yet.</span>
              </Link>
              <Link to="/lecturer/grade-review" className="db-onboard-card">
                <CheckCheck size={20} className="db-onboard-icon" />
                <span className="db-onboard-card-title">Review &amp; Release Grades</span>
                <span className="db-onboard-card-text">Grade submissions and release results to students together.</span>
              </Link>
            </div>
          </div>
        )}

        <div className="db-row-2-1">

          <div className="db-chart-card">
            <p className="db-chart-title">Assignments per Course</p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : subsPerCohort.length === 0 ? (
              <div className="db-no-data">No assignments yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={subsPerCohort} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="submissions" name="Assignments" radius={[6, 6, 0, 0]} maxBarSize={46}>
                    {subsPerCohort.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="db-chart-card">
            <p className="db-chart-title">Grading Status</p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : gradeStatusData.length === 0 ? (
              <div className="db-no-data">No grades yet</div>
            ) : (
              <>
                <div className="db-donut-wrap">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={gradeStatusData} cx="50%" cy="50%" innerRadius={58} outerRadius={82} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                        {gradeStatusData.map(d => <Cell key={d.key} fill={GRADE_COLORS[d.key] ?? '#94a3b8'} />)}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="db-donut-centre">
                    <span className="db-donut-num">{releasedGrades + draftGrades}</span>
                    <span className="db-donut-label">grades</span>
                  </div>
                </div>
                <div className="db-legend">
                  {gradeStatusData.map(d => (
                    <div key={d.key} className="db-legend-item">
                      <span className="db-legend-dot" style={{ background: GRADE_COLORS[d.key] ?? '#94a3b8' }} />
                      {d.name} ({d.value})
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="db-row-equal">

          <div className="db-chart-card">
            <p className="db-chart-title">Upcoming Deadlines</p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : deadlines.length === 0 ? (
              <div className="db-no-data">No upcoming deadlines</div>
            ) : (
              <div className="db-deadlines">
                {deadlines.map(d => (
                  <Link key={d.id} to={`/lecturer/submissions/${d.id}`} className="db-deadline-row" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="db-deadline-main">
                      <span className="db-deadline-title">{d.title}</span>
                      <span className="db-deadline-cohort">{d.courseName}</span>
                    </div>
                    <span
                      className="db-pill"
                      style={{
                        background: d.daysLeft <= 3 ? '#fee2e2' : d.daysLeft <= 7 ? '#fef3c7' : '#dcfce7',
                        color: d.daysLeft <= 3 ? '#b91c1c' : d.daysLeft <= 7 ? '#b45309' : '#15803d',
                      }}
                    >
                      {d.daysLeft === 0 ? 'Due today' : `${d.daysLeft}d left`}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="db-chart-card">
            <p className="db-chart-title">Average Score per Course</p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : avgScorePerCohort.length === 0 ? (
              <div className="db-no-data">No released grades yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={avgScorePerCohort} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="score" name="Avg Score %" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {avgScorePerCohort.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Submission quality strip: Smart-Gate compliance + on-time/late */}
        {overview && (overview.compliancePassed + overview.complianceFailed + overview.onTime + overview.late) > 0 && (
          <div className="db-chart-card" style={{ marginBottom: '1rem' }}>
            <p className="db-chart-title"><ShieldCheck size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} /> Submission Quality</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', padding: '0.25rem 0.25rem 0.5rem' }}>
              {[
                { label: 'Smart-Gate Passed', value: overview.compliancePassed, color: '#15803d' },
                { label: 'Smart-Gate Failed', value: overview.complianceFailed, color: '#b91c1c' },
                { label: 'On Time', value: overview.onTime, color: '#15803d' },
                { label: 'Late', value: overview.late, color: '#c2410c' },
              ].map(s => (
                <div key={s.label} style={{ border: '1px solid #f3f4f6', borderRadius: '0.5rem', padding: '0.6rem 0.75rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Needs grading queue + Grade distribution */}
        <div className="db-row-2-1">
          <div className="db-chart-card">
            <p className="db-chart-title">
              <ClipboardList size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />
              Needs Grading <span className="db-chart-sub">submitted, not graded — oldest first</span>
            </p>
            {!overview ? (
              <div className="db-no-data">Loading…</div>
            ) : overview.needsGrading.length === 0 ? (
              <div className="db-no-data">All caught up 🎉</div>
            ) : (
              <div className="ua-table-wrap" style={{ maxHeight: 260, overflowY: 'auto' }}>
                <table className="ua-table">
                  <thead>
                    <tr><th>Assignment</th><th>Cohort</th><th>Waiting</th><th className="col-actions"></th></tr>
                  </thead>
                  <tbody>
                    {overview.needsGrading.map(n => (
                      <tr key={n.submissionId}>
                        <td className="col-name">{n.title}</td>
                        <td className="col-muted">{n.courseName ?? '—'}</td>
                        <td><span className="ua-badge ua-badge-payment_pending">{n.awaiting}</span></td>
                        <td className="col-actions">
                          <Link to={`/lecturer/submissions/${n.submissionId}`} className="ua-btn ua-btn-primary ua-btn-xs">Grade</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="db-chart-card">
            <p className="db-chart-title">Grade Distribution</p>
            {!overview || overview.gradeDistribution.every(d => d.count === 0) ? (
              <div className="db-no-data">No released grades yet</div>
            ) : (
              <>
                <div className="db-donut-wrap">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={overview.gradeDistribution} cx="50%" cy="50%" innerRadius={58} outerRadius={82} paddingAngle={3} dataKey="count" nameKey="band" startAngle={90} endAngle={-270}>
                        {overview.gradeDistribution.map(d => <Cell key={d.band} fill={BAND_COLORS[d.band] ?? '#94a3b8'} />)}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="db-donut-centre">
                    <span className="db-donut-num">{overview.gradeDistribution.reduce((s, d) => s + d.count, 0)}</span>
                    <span className="db-donut-label">grades</span>
                  </div>
                </div>
                <div className="db-legend">
                  {overview.gradeDistribution.map(d => (
                    <div key={d.band} className="db-legend-item">
                      <span className="db-legend-dot" style={{ background: BAND_COLORS[d.band] ?? '#94a3b8' }} />
                      {d.band} ({d.count})
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* At-risk students + Recent activity */}
        <div className="db-row-equal">
          <div className="db-chart-card">
            <p className="db-chart-title">
              <AlertTriangle size={14} style={{ verticalAlign: '-2px', color: '#ef4444', marginRight: 4 }} />
              Students at Risk <span className="db-chart-sub">in your cohorts</span>
            </p>
            {!overview ? (
              <div className="db-no-data">Loading…</div>
            ) : overview.atRisk.length === 0 ? (
              <div className="db-no-data">No at-risk students 🎉</div>
            ) : (
              <div className="ua-table-wrap" style={{ maxHeight: 260, overflowY: 'auto' }}>
                <table className="ua-table">
                  <thead>
                    <tr><th>Student</th><th>Cohort</th><th>Avg</th><th>Reason</th></tr>
                  </thead>
                  <tbody>
                    {overview.atRisk.map(s => (
                      <tr key={s.studentId}>
                        <td className="col-name">{s.studentName}<div className="col-muted" style={{ fontSize: 11 }}>{s.studentRef}</div></td>
                        <td className="col-muted">{s.courseName ?? '—'}</td>
                        <td>{s.avgScorePct != null ? `${s.avgScorePct}%` : '—'}</td>
                        <td className="col-muted" style={{ fontSize: 11 }}>{s.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="db-chart-card">
            <p className="db-chart-title">
              <Clock size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} /> Recent Activity
            </p>
            {!overview ? (
              <div className="db-no-data">Loading…</div>
            ) : overview.recentActivity.length === 0 ? (
              <div className="db-no-data">No recent activity</div>
            ) : (
              <div style={{ padding: '0.25rem 0.25rem', maxHeight: 260, overflowY: 'auto' }}>
                {overview.recentActivity.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', padding: '0.5rem 0.25rem', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: 9999, marginTop: 5, flexShrink: 0,
                      background: a.type === 'GRADE' ? '#10b981' : '#6366f1',
                    }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.78rem', color: '#374151' }}>{a.text}</div>
                      <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>{new Date(a.at).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </Layout>
  )
}
