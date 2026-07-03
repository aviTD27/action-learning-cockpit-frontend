import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import Layout from '../../shared/layout/Layout'
import { UNI_ADMIN_NAV } from '../nav'
import BenchmarkTable from '../components/tables/BenchmarkTable'
import { useAnalytics } from '../hooks/useAnalytics'
import '../../shared/styles/dashboard.css'
import '../styles/uniAdmin.css'

const C = ['#6366f1', '#10b981', '#f59e0b', '#0ea5e9', '#ef4444', '#8b5cf6', '#f97316']

const BAND_COLORS: Record<string, string> = {
  Distinction: '#6366f1',
  Good: '#10b981',
  Pass: '#0ea5e9',
  Fail: '#ef4444',
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

const trunc = (s: string) => (s.length > 14 ? s.slice(0, 13) + '…' : s)

export default function AnalyticsPage() {
  const { summary, trends, distribution, benchmark, loading, error } = useAnalytics()

  const cohortScores = benchmark.map(b => ({
    name: trunc(b.cohortName),
    score: b.avgScorePct,
    fullName: b.cohortName,
  }))
  const distData = distribution.filter(d => d.count > 0)

  return (
    <Layout navItems={UNI_ADMIN_NAV} title="Analytics" subtitle="Benchmarking and analytics">
      <div className="db-page">

        <div className="db-header">
          <h1 className="db-title">Analytics</h1>
          <p className="db-sub">Submission trends, grade quality, and cohort benchmarking for your institution.</p>
        </div>

        {error && <div className="db-no-data" style={{ color: '#ef4444' }}>{error}</div>}

        <div className="db-kpi-row">
          <div className="db-kpi db-kpi-indigo">
            <div className="db-kpi-label">Average Score</div>
            <div className="db-kpi-value">{loading || !summary ? '—' : `${summary.avgScorePct}%`}</div>
            <div className="db-kpi-note">across released grades</div>
          </div>
          <div className="db-kpi db-kpi-blue">
            <div className="db-kpi-label">Total Assignments</div>
            <div className="db-kpi-value">{loading || !summary ? '—' : summary.totalSubmissions}</div>
            <div className="db-kpi-note">created for your cohorts</div>
          </div>
          <div className="db-kpi db-kpi-green">
            <div className="db-kpi-label">Released Grades</div>
            <div className="db-kpi-value">{loading || !summary ? '—' : summary.releasedGrades}</div>
            <div className="db-kpi-note">visible to students</div>
          </div>
          <div className="db-kpi db-kpi-cyan">
            <div className="db-kpi-label">Graded This Month</div>
            <div className="db-kpi-value">{loading || !summary ? '—' : summary.gradedThisMonth}</div>
            <div className="db-kpi-note">released this month</div>
          </div>
        </div>

        <div className="db-row-2-1">

          <div className="db-chart-card">
            <p className="db-chart-title">
              Submission &amp; Quality Trend <span className="db-chart-sub">last 6 months</span>
            </p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : trends.length === 0 ? (
              <div className="db-no-data">No data yet</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={230}>
                  <LineChart data={trends} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line yAxisId="left" type="monotone" dataKey="submissions" name="Assignments" stroke="#6366f1" strokeWidth={2.5} dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="avgScore" name="Avg Score %" stroke="#10b981" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="db-legend">
                  <div className="db-legend-item"><span className="db-legend-dot" style={{ background: '#6366f1' }} />Assignments created</div>
                  <div className="db-legend-item"><span className="db-legend-dot" style={{ background: '#10b981' }} />Avg score %</div>
                </div>
              </>
            )}
          </div>

          <div className="db-chart-card">
            <p className="db-chart-title">Grade Distribution</p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : distData.length === 0 ? (
              <div className="db-no-data">No released grades yet</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={distData} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={3} dataKey="count" nameKey="band">
                      {distData.map(d => (
                        <Cell key={d.band} fill={BAND_COLORS[d.band] ?? '#94a3b8'} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="db-legend">
                  {distData.map(d => (
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

        <div className="db-chart-card">
          <p className="db-chart-title">Average Score per Cohort</p>
          {loading ? (
            <div className="db-no-data">Loading…</div>
          ) : cohortScores.length === 0 ? (
            <div className="db-no-data">No cohorts yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={cohortScores} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="score" name="Avg Score %" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {cohortScores.map((_, i) => (
                    <Cell key={i} fill={C[i % C.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <BenchmarkTable rows={benchmark} />

      </div>
    </Layout>
  )
}
