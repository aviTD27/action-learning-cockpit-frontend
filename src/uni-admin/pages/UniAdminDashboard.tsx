import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, BookOpen, Download, GraduationCap, Presentation, Users } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts'
import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import {
  getCohorts, getLecturers, getProgrammes, getStudents,
  getTenantTrends, getGradeDistribution, getCohortBenchmark,
  getGradingBacklog, getAtRiskStudents, getLecturerWorkload,
} from '../api/uniAdmin'
import type {
  StudentResponse, LecturerResponse, CohortResponse, ProgrammeResponse,
  TrendPoint, GradeDistribution, CohortBenchmark,
  GradingBacklog, AtRiskStudent, LecturerWorkload,
} from '../api/types'
import { useAuth } from '../../auth/AuthContext'
import '../../shared/styles/dashboard.css'
import '../styles/uniAdmin.css'

const C = ['#6366f1', '#10b981', '#f59e0b', '#0ea5e9', '#ef4444', '#8b5cf6', '#f97316']

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#10b981',
  INACTIVE: '#94a3b8',
  GRADUATED: '#6366f1',
  PROBATION: '#f59e0b',
  PAYMENT_PENDING: '#0ea5e9',
  SUSPENDED: '#ef4444',
  EXPELLED: '#7f1d1d',
  DROPPED_OUT: '#6b7280',
  COMPLETED: '#8b5cf6',
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active', INACTIVE: 'Inactive', GRADUATED: 'Graduated',
  PROBATION: 'Probation', PAYMENT_PENDING: 'Pmt. Pending',
  SUSPENDED: 'Suspended', EXPELLED: 'Expelled',
  DROPPED_OUT: 'Dropped Out', COMPLETED: 'Completed',
}

const GRADE_COLORS: Record<string, string> = {
  Distinction: '#6366f1',
  Good:        '#10b981',
  Pass:        '#f59e0b',
  Fail:        '#ef4444',
}

const COHORT_STATUS_COLORS: Record<string, string> = {
  NOT_STARTED: '#94a3b8',
  ONGOING:     '#10b981',
  COMPLETED:   '#6366f1',
  GRADUATED:   '#8b5cf6',
  ARCHIVED:    '#d1d5db',
}

function csvCell(v: string | number | null | undefined): string {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

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

export default function UniAdminDashboard() {
  const { universityId, displayName } = useAuth()
  const [students,   setStudents]   = useState<StudentResponse[]>([])
  const [lecturers,  setLecturers]  = useState<LecturerResponse[]>([])
  const [cohorts,    setCohorts]    = useState<CohortResponse[]>([])
  const [programmes, setProgrammes] = useState<ProgrammeResponse[]>([])
  const [trends,          setTrends]          = useState<TrendPoint[]>([])
  const [gradeDist,       setGradeDist]       = useState<GradeDistribution[]>([])
  const [cohortBenchmark, setCohortBenchmark] = useState<CohortBenchmark[]>([])
  const [backlog,         setBacklog]         = useState<GradingBacklog | null>(null)
  const [atRisk,          setAtRisk]          = useState<AtRiskStudent[]>([])
  const [workload,        setWorkload]        = useState<LecturerWorkload[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const uid = universityId ?? undefined
    Promise.all([
      getStudents(uid).catch(() => ({ data: [] as StudentResponse[] })),
      getLecturers(uid).catch(() => ({ data: [] as LecturerResponse[] })),
      getCohorts(uid).catch(() => ({ data: [] as CohortResponse[] })),
      getProgrammes(uid).catch(() => ({ data: [] as ProgrammeResponse[] })),
      getTenantTrends(uid).catch(() => ({ data: [] as TrendPoint[] })),
      getGradeDistribution(uid).catch(() => ({ data: [] as GradeDistribution[] })),
      getCohortBenchmark(uid).catch(() => ({ data: [] as CohortBenchmark[] })),
      getGradingBacklog(uid).catch(() => ({ data: null as GradingBacklog | null })),
      getAtRiskStudents(uid).catch(() => ({ data: [] as AtRiskStudent[] })),
      getLecturerWorkload(uid).catch(() => ({ data: [] as LecturerWorkload[] })),
    ]).then(([s, l, c, p, t, g, cb, gb, ar, lw]) => {
      setStudents(s.data)
      setLecturers(l.data)
      setCohorts(c.data)
      setProgrammes(p.data)
      setTrends(t.data)
      setGradeDist(g.data)
      setCohortBenchmark(cb.data)
      setBacklog(gb.data)
      setAtRisk(ar.data)
      setWorkload(lw.data)
    }).finally(() => setLoading(false))
  }, [universityId])

  const institution = useMemo(
    () => programmes.find(p => p.universityName)?.universityName ?? '',
    [programmes],
  )
  const sidebarUser = { name: displayName ?? '', role: 'Uni Admin', institution }

  const studentStatusData = useMemo(() => {
    const counts: Record<string, number> = {}
    students.forEach(s => { counts[s.status] = (counts[s.status] ?? 0) + 1 })
    return Object.entries(counts)
      .map(([status, value]) => ({ name: STATUS_LABELS[status] ?? status, value, raw: status }))
      .sort((a, b) => b.value - a.value)
  }, [students])

  const studentsPerProgramme = useMemo(() => {
    const counts: Record<string, number> = {}
    students.forEach(s => {
      const name = s.programmeName ?? 'Unknown'
      counts[name] = (counts[name] ?? 0) + 1
    })
    return Object.entries(counts)
      .map(([name, students]) => ({ name: name.length > 14 ? name.slice(0, 13) + '…' : name, students, fullName: name }))
      .sort((a, b) => b.students - a.students)
      .slice(0, 6)
  }, [students])

  const studentsPerCohort = useMemo(() => {
    const counts: Record<number, number> = {}
    students.forEach(s => { counts[s.cohortId] = (counts[s.cohortId] ?? 0) + 1 })
    return cohorts
      .map(c => ({ name: c.name.length > 14 ? c.name.slice(0, 13) + '…' : c.name, students: counts[c.id] ?? 0, fullName: c.name }))
      .sort((a, b) => b.students - a.students)
      .slice(0, 8)
  }, [students, cohorts])

  const cohortStatusData = useMemo(() => {
    const counts: Record<string, number> = {}
    cohorts.forEach(c => { counts[c.status] = (counts[c.status] ?? 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [cohorts])

  const activeStudents   = students.filter(s => s.status === 'ACTIVE').length
  const activeLecturers  = lecturers.filter(l => l.status === 'ACTIVE').length
  const ongoingCohorts   = cohorts.filter(c => c.status === 'ONGOING').length

  const isEmpty = !loading && programmes.length === 0 && cohorts.length === 0 && students.length === 0

  const exportReport = () => {
    const rows: string[] = []
    rows.push('University Dashboard Report')
    rows.push(`Institution,${csvCell(institution)}`)
    rows.push(`Generated,${csvCell(new Date().toLocaleString())}`)
    rows.push('')
    rows.push('Metric,Value')
    rows.push(`Total Students,${students.length}`)
    rows.push(`Active Students,${activeStudents}`)
    rows.push(`Lecturers,${lecturers.length}`)
    rows.push(`Active Lecturers,${activeLecturers}`)
    rows.push(`Cohorts,${cohorts.length}`)
    rows.push(`Ongoing Cohorts,${ongoingCohorts}`)
    rows.push(`Programmes,${programmes.length}`)
    rows.push(`Grades Awaiting Release,${backlog?.awaitingGrades ?? 0}`)
    rows.push('')
    rows.push('Cohort Performance Benchmark')
    rows.push('Rank,Cohort,Programme,Students,Submissions,Avg Score %')
    cohortBenchmark.forEach(cb => {
      rows.push([cb.rank, csvCell(cb.cohortName), csvCell(cb.programmeName ?? ''), cb.students, cb.submissions, cb.avgScorePct].join(','))
    })
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-report-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
  }

  const ONBOARDING = [
    { n: 1, title: 'Create a Programme', text: 'Define a degree or curriculum for your institution.', to: '/uni-admin/programmes', icon: BookOpen },
    { n: 2, title: 'Create a Cohort', text: 'Add an intake under a programme and assign lecturers.', to: '/uni-admin/cohorts', icon: Users },
    { n: 3, title: 'Add Lecturers', text: 'Invite lecturers — they receive login credentials by email.', to: '/uni-admin/lecturers', icon: Presentation },
    { n: 4, title: 'Add Students', text: 'Enrol students into a cohort to get them started.', to: '/uni-admin/students', icon: GraduationCap },
  ]

  return (
    <Layout navItems={UNI_ADMIN_NAV} user={sidebarUser} title="University Admin" subtitle="Dashboard · Action Learning Cockpit">
      <div className="db-page">

        {/* Header */}
        <div className="db-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <h1 className="db-title">University Dashboard</h1>
            <p className="db-sub">Live metrics for your institution — students, cohorts, lecturers, and programmes.</p>
          </div>
          <button
            className="ua-btn ua-btn-secondary"
            onClick={exportReport}
            disabled={loading || isEmpty}
            title="Download the KPIs and cohort benchmark as CSV"
          >
            <Download size={13} /> Export Report
          </button>
        </div>

        {/* KPI Row — each tile links to its tab */}
        <div className="db-kpi-row">
          <Link to="/uni-admin/students" className="db-kpi db-kpi-blue" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="db-kpi-label">Total Students</div>
            <div className="db-kpi-value">{loading ? '—' : students.length}</div>
            <div className="db-kpi-note">{loading ? '' : `${activeStudents} active`}</div>
          </Link>
          <Link to="/uni-admin/lecturers" className="db-kpi db-kpi-indigo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="db-kpi-label">Lecturers</div>
            <div className="db-kpi-value">{loading ? '—' : lecturers.length}</div>
            <div className="db-kpi-note">{loading ? '' : `${activeLecturers} active`}</div>
          </Link>
          <Link to="/uni-admin/cohorts" className="db-kpi db-kpi-green" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="db-kpi-label">Cohorts</div>
            <div className="db-kpi-value">{loading ? '—' : cohorts.length}</div>
            <div className="db-kpi-note">{loading ? '' : `${ongoingCohorts} ongoing`}</div>
          </Link>
          <Link to="/uni-admin/programmes" className="db-kpi db-kpi-cyan" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="db-kpi-label">Programmes</div>
            <div className="db-kpi-value">{loading ? '—' : programmes.length}</div>
            <div className="db-kpi-note">Active curricula</div>
          </Link>
          <div className="db-kpi db-kpi-amber">
            <div className="db-kpi-label">Awaiting Grades</div>
            <div className="db-kpi-value">{loading ? '—' : (backlog?.awaitingGrades ?? 0)}</div>
            <div className="db-kpi-note">{loading ? '' : `${backlog?.turnedIn ?? 0} submitted`}</div>
          </div>
        </div>

        {/* Empty-state onboarding — brand-new university */}
        {isEmpty && (
          <div className="db-onboard">
            <h2 className="db-onboard-title">Welcome! Let's set up your institution</h2>
            <p className="db-onboard-sub">Follow these steps to get your Action Learning Cockpit running.</p>
            <div className="db-onboard-grid">
              {ONBOARDING.map(step => (
                <Link key={step.n} to={step.to} className="db-onboard-card">
                  <span className="db-onboard-num">{step.n}</span>
                  <step.icon size={20} className="db-onboard-icon" />
                  <span className="db-onboard-card-title">{step.title}</span>
                  <span className="db-onboard-card-text">{step.text}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!isEmpty && (<>

        {/* Row: Students per cohort + Student status donut */}
        <div className="db-row-2-1">

          {/* Bar: students per cohort (real data) */}
          <div className="db-chart-card">
            <p className="db-chart-title">
              Students per Cohort <span className="db-chart-sub">top cohorts by size</span>
            </p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : studentsPerCohort.length === 0 ? (
              <div className="db-no-data">No cohorts yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={studentsPerCohort} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="students" name="Students" radius={[6, 6, 0, 0]} maxBarSize={46}>
                    {studentsPerCohort.map((_, i) => (
                      <Cell key={i} fill={C[i % C.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Donut: student status */}
          <div className="db-chart-card">
            <p className="db-chart-title">Student Status</p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : studentStatusData.length === 0 ? (
              <div className="db-no-data">No students yet</div>
            ) : (
              <>
                <div className="db-donut-wrap">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={studentStatusData}
                        cx="50%" cy="50%"
                        innerRadius={58} outerRadius={82}
                        paddingAngle={3}
                        dataKey="value"
                        startAngle={90} endAngle={-270}
                      >
                        {studentStatusData.map(entry => (
                          <Cell key={entry.raw} fill={STATUS_COLORS[entry.raw] ?? '#94a3b8'} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="db-donut-centre">
                    <span className="db-donut-num">{students.length}</span>
                    <span className="db-donut-label">students</span>
                  </div>
                </div>
                <div className="db-legend">
                  {studentStatusData.slice(0, 4).map(d => (
                    <div key={d.raw} className="db-legend-item">
                      <span className="db-legend-dot" style={{ background: STATUS_COLORS[d.raw] ?? '#94a3b8' }} />
                      {d.name} ({d.value})
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Row: Students per programme + Cohort status */}
        <div className="db-row-equal">

          {/* Bar: students per programme */}
          <div className="db-chart-card">
            <p className="db-chart-title">
              Students per Programme
            </p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : studentsPerProgramme.length === 0 ? (
              <div className="db-no-data">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={studentsPerProgramme} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="students" name="Students" radius={[6, 6, 0, 0]} maxBarSize={48}>
                    {studentsPerProgramme.map((_, i) => (
                      <Cell key={i} fill={C[i % C.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar: cohort status breakdown */}
          <div className="db-chart-card">
            <p className="db-chart-title">Cohort Status Breakdown</p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : cohortStatusData.length === 0 ? (
              <div className="db-no-data">No cohorts yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={cohortStatusData} layout="vertical" margin={{ top: 4, right: 16, left: 50, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} width={70} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="value" name="Cohorts" radius={[0, 6, 6, 0]} maxBarSize={22}>
                    {cohortStatusData.map(entry => (
                      <Cell key={entry.name} fill={COHORT_STATUS_COLORS[entry.name] ?? '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Row: Submission trend + Grade distribution */}
        <div className="db-row-2-1">

          {/* Area: submission & grade trend */}
          <div className="db-chart-card">
            <p className="db-chart-title">
              Submission &amp; Grade Trend <span className="db-chart-sub">last 6 months</span>
            </p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : trends.length === 0 ? (
              <div className="db-no-data">No submission data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={trends} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gSub" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                    </linearGradient>
                    <linearGradient id="gScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="submissions" name="Submissions" stroke="#6366f1" strokeWidth={2.5} fill="url(#gSub)" dot={false} />
                  <Area type="monotone" dataKey="avgScore"    name="Avg Score %" stroke="#10b981" strokeWidth={2.5} fill="url(#gScore)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
            <div className="db-legend">
              <div className="db-legend-item"><span className="db-legend-dot" style={{ background: '#6366f1' }} />Submissions</div>
              <div className="db-legend-item"><span className="db-legend-dot" style={{ background: '#10b981' }} />Avg Score %</div>
            </div>
          </div>

          {/* Donut: grade distribution */}
          <div className="db-chart-card">
            <p className="db-chart-title">Grade Distribution</p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : gradeDist.every(d => d.count === 0) ? (
              <div className="db-no-data">No released grades yet</div>
            ) : (
              <>
                <div className="db-donut-wrap">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={gradeDist} cx="50%" cy="50%"
                        innerRadius={58} outerRadius={82} paddingAngle={3}
                        dataKey="count" nameKey="band" startAngle={90} endAngle={-270}>
                        {gradeDist.map(d => (
                          <Cell key={d.band} fill={GRADE_COLORS[d.band] ?? '#94a3b8'} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="db-donut-centre">
                    <span className="db-donut-num">{gradeDist.reduce((s, d) => s + d.count, 0)}</span>
                    <span className="db-donut-label">grades</span>
                  </div>
                </div>
                <div className="db-legend">
                  {gradeDist.map(d => (
                    <div key={d.band} className="db-legend-item">
                      <span className="db-legend-dot" style={{ background: GRADE_COLORS[d.band] ?? '#94a3b8' }} />
                      {d.band} ({d.count})
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cohort benchmark leaderboard */}
        {!loading && cohortBenchmark.length > 0 && (
          <div className="db-leaderboard">
            <div className="db-lb-header">
              <span className="db-lb-title">Cohort Performance Benchmark</span>
              <span className="db-lb-badge">{cohortBenchmark.length} cohorts ranked</span>
            </div>
            <table className="db-lb-table">
              <thead>
                <tr>
                  <th style={{ width: 48 }}>#</th>
                  <th>Cohort</th>
                  <th>Programme</th>
                  <th>Students</th>
                  <th>Submissions</th>
                  <th style={{ minWidth: 160 }}>Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {cohortBenchmark.map((cb, i) => (
                  <tr key={cb.cohortId}>
                    <td>
                      <span className={`db-rank ${i === 0 ? 'db-rank-1' : i === 1 ? 'db-rank-2' : i === 2 ? 'db-rank-3' : 'db-rank-n'}`}>
                        {cb.rank}
                      </span>
                    </td>
                    <td className="db-name-cell">{cb.cohortName}</td>
                    <td style={{ color: '#6b7280' }}>{cb.programmeName ?? '—'}</td>
                    <td>{cb.students}</td>
                    <td>{cb.submissions}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                        <div className="db-progress" style={{ flex: 1 }}>
                          <div className="db-progress-bar"
                            style={{
                              width: `${cb.avgScorePct}%`,
                              background: `linear-gradient(90deg, ${C[i % C.length]}, ${C[(i + 1) % C.length]})`,
                            }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', minWidth: 40 }}>
                          {cb.avgScorePct > 0 ? `${cb.avgScorePct}%` : 'N/A'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* At-risk students + Lecturer workload */}
        <div className="db-row-equal">

          {/* At-risk students */}
          <div className="db-chart-card">
            <p className="db-chart-title">
              <AlertTriangle size={14} style={{ verticalAlign: '-2px', color: '#ef4444', marginRight: 4 }} />
              Students at Risk <span className="db-chart-sub">low average or missed submissions</span>
            </p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : atRisk.length === 0 ? (
              <div className="db-no-data">No at-risk students 🎉</div>
            ) : (
              <div className="ua-table-wrap" style={{ maxHeight: 260, overflowY: 'auto' }}>
                <table className="ua-table">
                  <thead>
                    <tr><th>Student</th><th>Cohort</th><th>Avg</th><th>Missed</th><th>Reason</th></tr>
                  </thead>
                  <tbody>
                    {atRisk.map(s => (
                      <tr key={s.studentId}>
                        <td className="col-name">{s.studentName}<div className="col-muted" style={{ fontSize: 11 }}>{s.studentRef}</div></td>
                        <td className="col-muted">{s.cohortName ?? '—'}</td>
                        <td>{s.avgScorePct != null ? `${s.avgScorePct}%` : '—'}</td>
                        <td>{s.missedSubmissions}</td>
                        <td className="col-muted" style={{ fontSize: 11 }}>{s.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Lecturer workload */}
          <div className="db-chart-card">
            <p className="db-chart-title">
              <Presentation size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} />
              Lecturer Workload <span className="db-chart-sub">assignments · cohorts · grading backlog</span>
            </p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : workload.length === 0 ? (
              <div className="db-no-data">No lecturers yet</div>
            ) : (
              <div className="ua-table-wrap" style={{ maxHeight: 260, overflowY: 'auto' }}>
                <table className="ua-table">
                  <thead>
                    <tr><th>Lecturer</th><th>Assignments</th><th>Cohorts</th><th>Backlog</th></tr>
                  </thead>
                  <tbody>
                    {workload.map(l => (
                      <tr key={l.lecturerId}>
                        <td className="col-name">{l.lecturerName}</td>
                        <td>{l.assignments}</td>
                        <td>{l.cohorts}</td>
                        <td>
                          {l.gradingBacklog > 0
                            ? <span className="ua-badge ua-badge-payment_pending">{l.gradingBacklog} to grade</span>
                            : <span className="col-muted">0</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        </>)}

      </div>
    </Layout>
  )
}
