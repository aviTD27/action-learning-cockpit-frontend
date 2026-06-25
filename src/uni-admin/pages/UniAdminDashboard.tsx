import { useEffect, useMemo, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts'
import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV, UNI_ADMIN_USER } from '../nav'
import { getCohorts, getLecturers, getProgrammes, getStudents } from '../api/uniAdmin'
import type { StudentResponse, LecturerResponse, CohortResponse, ProgrammeResponse } from '../api/types'
import { useAuth } from '../../auth/AuthContext'
import '../../shared/styles/dashboard.css'
import '../styles/uniAdmin.css'

// ── Palette ───────────────────────────────────────────────────────────────────
const C = ['#6366f1', '#10b981', '#f59e0b', '#0ea5e9', '#ef4444', '#8b5cf6', '#f97316']

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:          '#10b981',
  INACTIVE:        '#94a3b8',
  GRADUATED:       '#6366f1',
  PROBATION:       '#f59e0b',
  PAYMENT_PENDING: '#0ea5e9',
  SUSPENDED:       '#ef4444',
  EXPELLED:        '#7f1d1d',
  DROPPED_OUT:     '#6b7280',
  COMPLETED:       '#8b5cf6',
}

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Active', INACTIVE: 'Inactive', GRADUATED: 'Graduated',
  PROBATION: 'Probation', PAYMENT_PENDING: 'Pmt. Pending',
  SUSPENDED: 'Suspended', EXPELLED: 'Expelled',
  DROPPED_OUT: 'Dropped Out', COMPLETED: 'Completed',
}

const COHORT_STATUS_COLORS: Record<string, string> = {
  NOT_STARTED: '#94a3b8',
  ONGOING:     '#10b981',
  COMPLETED:   '#6366f1',
  GRADUATED:   '#8b5cf6',
  ARCHIVED:    '#d1d5db',
}

// Mock enrollment trend (replace with backend analytics when available)
const ENROLLMENT_TREND = [
  { month: 'Jan', students: 42, active: 38 },
  { month: 'Feb', students: 58, active: 51 },
  { month: 'Mar', students: 74, active: 65 },
  { month: 'Apr', students: 89, active: 78 },
  { month: 'May', students: 105, active: 91 },
  { month: 'Jun', students: 125, active: 108 },
]

// ── Custom tooltip ─────────────────────────────────────────────────────────────
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

// ── Component ──────────────────────────────────────────────────────────────────
export default function UniAdminDashboard() {
  const { universityId } = useAuth()
  const [students,   setStudents]   = useState<StudentResponse[]>([])
  const [lecturers,  setLecturers]  = useState<LecturerResponse[]>([])
  const [cohorts,    setCohorts]    = useState<CohortResponse[]>([])
  const [programmes, setProgrammes] = useState<ProgrammeResponse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const uid = universityId ?? undefined
    Promise.all([
      getStudents(uid).catch(() => ({ data: [] as StudentResponse[] })),
      getLecturers(uid).catch(() => ({ data: [] as LecturerResponse[] })),
      getCohorts(uid).catch(() => ({ data: [] as CohortResponse[] })),
      getProgrammes(uid).catch(() => ({ data: [] as ProgrammeResponse[] })),
    ]).then(([s, l, c, p]) => {
      setStudents(s.data)
      setLecturers(l.data)
      setCohorts(c.data)
      setProgrammes(p.data)
    }).finally(() => setLoading(false))
  }, [universityId])

  // ── Derived chart data ─────────────────────────────────────────────────────
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

  const cohortStatusData = useMemo(() => {
    const counts: Record<string, number> = {}
    cohorts.forEach(c => { counts[c.status] = (counts[c.status] ?? 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [cohorts])

  const activeStudents   = students.filter(s => s.status === 'ACTIVE').length
  const activeLecturers  = lecturers.filter(l => l.status === 'ACTIVE').length
  const ongoingCohorts   = cohorts.filter(c => c.status === 'ONGOING').length

  // Top-student mock leaderboard — sorted by name for deterministic display
  const topStudents = useMemo(() =>
    [...students]
      .filter(s => s.status === 'ACTIVE')
      .sort((a, b) => a.lastName.localeCompare(b.lastName))
      .slice(0, 5)
  , [students])

  return (
    <Layout navItems={UNI_ADMIN_NAV} user={UNI_ADMIN_USER} title="University Admin" subtitle="Dashboard · Action Learning Cockpit">
      <div className="db-page">

        {/* Header */}
        <div className="db-header">
          <h1 className="db-title">University Dashboard</h1>
          <p className="db-sub">Live metrics for your institution — students, cohorts, lecturers, and programmes.</p>
        </div>

        {/* KPI Row */}
        <div className="db-kpi-row">
          <div className="db-kpi db-kpi-blue">
            <div className="db-kpi-label">Total Students</div>
            <div className="db-kpi-value">{loading ? '—' : students.length}</div>
            <div className="db-kpi-note">{loading ? '' : `${activeStudents} active`}</div>
          </div>
          <div className="db-kpi db-kpi-indigo">
            <div className="db-kpi-label">Lecturers</div>
            <div className="db-kpi-value">{loading ? '—' : lecturers.length}</div>
            <div className="db-kpi-note">{loading ? '' : `${activeLecturers} active`}</div>
          </div>
          <div className="db-kpi db-kpi-green">
            <div className="db-kpi-label">Cohorts</div>
            <div className="db-kpi-value">{loading ? '—' : cohorts.length}</div>
            <div className="db-kpi-note">{loading ? '' : `${ongoingCohorts} ongoing`}</div>
          </div>
          <div className="db-kpi db-kpi-cyan">
            <div className="db-kpi-label">Programmes</div>
            <div className="db-kpi-value">{loading ? '—' : programmes.length}</div>
            <div className="db-kpi-note">Active curricula</div>
          </div>
        </div>

        {/* Row: Enrollment trend + Student status donut */}
        <div className="db-row-2-1">

          {/* Area: enrollment trend */}
          <div className="db-chart-card">
            <p className="db-chart-title">
              Enrollment Trend <span className="db-chart-sub">last 6 months</span>
            </p>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={ENROLLMENT_TREND} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="gStu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="gAct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="students" name="Total"  stroke="#6366f1" strokeWidth={2.5} fill="url(#gStu)" dot={false} />
                <Area type="monotone" dataKey="active"   name="Active" stroke="#10b981" strokeWidth={2.5} fill="url(#gAct)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="db-legend">
              <div className="db-legend-item"><span className="db-legend-dot" style={{ background: '#6366f1' }} />Total enrolled</div>
              <div className="db-legend-item"><span className="db-legend-dot" style={{ background: '#10b981' }} />Active students</div>
            </div>
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

        {/* Student leaderboard */}
        {topStudents.length > 0 && (
          <div className="db-leaderboard">
            <div className="db-lb-header">
              <span className="db-lb-title">🎓 Active Students</span>
              <span className="db-lb-badge">{activeStudents} active out of {students.length}</span>
            </div>
            <table className="db-lb-table">
              <thead>
                <tr>
                  <th style={{ width: 48 }}>#</th>
                  <th>Student</th>
                  <th>Ref</th>
                  <th>Programme</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {topStudents.map((s, i) => (
                  <tr key={s.id}>
                    <td>
                      <span className={`db-rank ${i === 0 ? 'db-rank-1' : i === 1 ? 'db-rank-2' : i === 2 ? 'db-rank-3' : 'db-rank-n'}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="db-name-cell">{s.firstName} {s.lastName}</td>
                    <td style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: 12 }}>{s.studentRef}</td>
                    <td style={{ color: '#6b7280' }}>{s.programmeName}</td>
                    <td>
                      <span
                        className="db-pill"
                        style={{
                          background: `${STATUS_COLORS[s.status] ?? '#94a3b8'}22`,
                          color: STATUS_COLORS[s.status] ?? '#94a3b8',
                        }}
                      >
                        {STATUS_LABELS[s.status] ?? s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </Layout>
  )
}
