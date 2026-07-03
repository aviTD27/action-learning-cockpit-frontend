import { useMemo } from 'react'
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import Layout from '../../shared/layout/Layout'
import { LECTURER_NAV } from '../nav'
import { useAuth } from '../../auth/AuthContext'
import { useCohorts } from '../../uni-admin/hooks/useCohorts'
import { useStudents } from '../../uni-admin/hooks/useStudents'
import { useSubmissions } from '../hooks/useSubmissions'
import { useGradeOverview } from '../hooks/useGradeOverview'
import '../../shared/styles/dashboard.css'
import '../styles/lecturer.css'

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
  const { cohorts, loading: loadingCohorts } = useCohorts()
  const { students, loading: loadingStudents } = useStudents()
  const { submissions, loading: loadingSubs } = useSubmissions()
  const { grades } = useGradeOverview()

  const loading = loadingCohorts || loadingStudents || loadingSubs

  const institution = useMemo(
    () => students.find(s => s.universityName)?.universityName ?? '',
    [students],
  )
  const sidebarUser = { name: displayName ?? '', role: 'Lecturer', institution }

  const ongoingCohorts = cohorts.filter(c => c.status === 'ONGOING').length
  const activeStudents = students.filter(s => s.status === 'ACTIVE').length
  const releasedGrades = grades.filter(g => g.status === 'RELEASED').length
  const draftGrades = grades.filter(g => g.status === 'DRAFT').length

  const subsPerCohort = useMemo(() => {
    const counts: Record<string, number> = {}
    submissions.forEach(s => { counts[s.cohortName] = (counts[s.cohortName] ?? 0) + 1 })
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
    const subMap = new Map<number, { cohortName: string; maxPoints: number }>()
    submissions.forEach(s => subMap.set(s.id, { cohortName: s.cohortName, maxPoints: s.maxPoints }))
    const buckets: Record<string, number[]> = {}
    grades.filter(g => g.status === 'RELEASED').forEach(g => {
      const sub = subMap.get(g.submissionId)
      if (!sub || sub.maxPoints <= 0) return
      const pct = Math.min(100, Math.max(0, (g.grade / sub.maxPoints) * 100))
      ;(buckets[sub.cohortName] ??= []).push(pct)
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

        {/* KPI Row */}
        <div className="db-kpi-row">
          <div className="db-kpi db-kpi-blue">
            <div className="db-kpi-label">Assignments</div>
            <div className="db-kpi-value">{loading ? '—' : submissions.length}</div>
            <div className="db-kpi-note">total submissions</div>
          </div>
          <div className="db-kpi db-kpi-green">
            <div className="db-kpi-label">Cohorts</div>
            <div className="db-kpi-value">{loading ? '—' : cohorts.length}</div>
            <div className="db-kpi-note">{loading ? '' : `${ongoingCohorts} ongoing`}</div>
          </div>
          <div className="db-kpi db-kpi-indigo">
            <div className="db-kpi-label">Students</div>
            <div className="db-kpi-value">{loading ? '—' : students.length}</div>
            <div className="db-kpi-note">{loading ? '' : `${activeStudents} active`}</div>
          </div>
          <div className="db-kpi db-kpi-cyan">
            <div className="db-kpi-label">Released Grades</div>
            <div className="db-kpi-value">{loading ? '—' : releasedGrades}</div>
            <div className="db-kpi-note">{loading ? '' : `${draftGrades} drafts pending`}</div>
          </div>
        </div>

        <div className="db-row-2-1">

          <div className="db-chart-card">
            <p className="db-chart-title">Assignments per Cohort</p>
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
                  <div key={d.id} className="db-deadline-row">
                    <div className="db-deadline-main">
                      <span className="db-deadline-title">{d.title}</span>
                      <span className="db-deadline-cohort">{d.cohortName}</span>
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
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="db-chart-card">
            <p className="db-chart-title">Average Score per Cohort</p>
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

      </div>
    </Layout>
  )
}
