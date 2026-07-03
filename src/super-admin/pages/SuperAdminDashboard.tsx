import { useEffect, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import Layout from '../../shared/layout/Layout'
import { SUPER_ADMIN_NAV } from '../nav'
import { listRegistrations, type RegistrationResponse } from '../../api/registrations'
import { listPlatformAdmins, type PlatformAdmin } from '../../api/platformAdmins'
import '../../shared/styles/dashboard.css'
import '../styles/superAdmin.css'


const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function buildTrend(regs: RegistrationResponse[]) {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const y = d.getFullYear(), m = d.getMonth()
    const slice = regs.filter(r => {
      if (!r.submittedAt) return false
      const rd = new Date(r.submittedAt)
      return rd.getFullYear() === y && rd.getMonth() === m
    })
    return {
      month: MONTH_LABELS[m],
      requests: slice.length,
      approved: slice.filter(r => r.status === 'APPROVED').length,
    }
  })
}

const STATUS_COLORS: Record<string, string> = {
  Approved: '#10b981',
  Pending:  '#f59e0b',
  Declined: '#ef4444',
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
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

// ── Component ─────────────────────────────────────────────────────────────────
export default function SuperAdminDashboard() {
  const [regs,   setRegs]   = useState<RegistrationResponse[]>([])
  const [admins, setAdmins] = useState<PlatformAdmin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      listRegistrations().catch(() => ({ data: [] as RegistrationResponse[] })),
      listPlatformAdmins().catch(() => ({ data: [] as PlatformAdmin[] })),
    ]).then(([rRes, aRes]) => {
      setRegs(rRes.data)
      setAdmins(aRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const pending       = regs.filter(r => r.status === 'PENDING').length
  const approved      = regs.filter(r => r.status === 'APPROVED').length
  const declined      = regs.filter(r => r.status === 'DECLINED').length
  const activeAdmins  = admins.filter(a => !a.blocked).length

  const trend          = buildTrend(regs)
  const approvedRegs   = regs.filter(r => r.status === 'APPROVED')

  const statusData = [
    { name: 'Approved', value: approved },
    { name: 'Pending',  value: pending  },
    { name: 'Declined', value: declined },
  ].filter(d => d.value > 0)

  const totalReqs = regs.length

  return (
    <Layout navItems={SUPER_ADMIN_NAV} title="Super Admin" subtitle="ACL Platform · Global oversight">
      <div className="db-page">

        {/* Header */}
        <div className="db-header">
          <h1 className="db-title">Platform Dashboard</h1>
          <p className="db-sub">Real-time overview of universities, administrators, and platform activity.</p>
        </div>

        {/* KPI Row */}
        <div className="db-kpi-row">
          <div className="db-kpi db-kpi-blue">
            <div className="db-kpi-label">Active Universities</div>
            <div className="db-kpi-value">{loading ? '—' : approved}</div>
            <div className="db-kpi-note">Approved & running</div>
          </div>
          <div className="db-kpi db-kpi-indigo">
            <div className="db-kpi-label">Admin Users</div>
            <div className="db-kpi-value">{loading ? '—' : activeAdmins}</div>
            <div className="db-kpi-note">Active accounts</div>
          </div>
          <div className="db-kpi db-kpi-amber">
            <div className="db-kpi-label">Pending Reviews</div>
            <div className="db-kpi-value">{loading ? '—' : pending}</div>
            <div className="db-kpi-note">{pending > 0 ? 'Awaiting your action' : 'All clear'}</div>
          </div>
          <div className="db-kpi db-kpi-green">
            <div className="db-kpi-label">Total Requests</div>
            <div className="db-kpi-value">{loading ? '—' : totalReqs}</div>
            <div className="db-kpi-note">Since platform launch</div>
          </div>
        </div>

        {/* Row: Trend + Donut */}
        <div className="db-row-2-1">

          {/* Area chart: registration trend */}
          <div className="db-chart-card">
            <p className="db-chart-title">
              Registration Trend <span className="db-chart-sub">last 6 months</span>
            </p>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={trend} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="gReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="gApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="requests" name="Requests" stroke="#6366f1" strokeWidth={2.5} fill="url(#gReq)" dot={false} />
                <Area type="monotone" dataKey="approved" name="Approved" stroke="#10b981" strokeWidth={2.5} fill="url(#gApp)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="db-legend">
              <div className="db-legend-item"><span className="db-legend-dot" style={{ background: '#6366f1' }} />Requests</div>
              <div className="db-legend-item"><span className="db-legend-dot" style={{ background: '#10b981' }} />Approved</div>
            </div>
          </div>

          {/* Donut: status breakdown */}
          <div className="db-chart-card">
            <p className="db-chart-title">Request Status</p>
            {loading ? (
              <div className="db-no-data">Loading…</div>
            ) : statusData.length === 0 ? (
              <div className="db-no-data">No requests yet</div>
            ) : (
              <>
                <div className="db-donut-wrap" style={{ position: 'relative' }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                        startAngle={90} endAngle={-270}
                      >
                        {statusData.map((entry) => (
                          <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#6366f1'} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="db-donut-centre">
                    <span className="db-donut-num">{totalReqs}</span>
                    <span className="db-donut-label">total</span>
                  </div>
                </div>
                <div className="db-legend">
                  {statusData.map(d => (
                    <div key={d.name} className="db-legend-item">
                      <span className="db-legend-dot" style={{ background: STATUS_COLORS[d.name] }} />
                      {d.name} ({d.value})
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Approved universities table */}
        {!loading && approvedRegs.length > 0 && (
          <div className="db-leaderboard" style={{ marginTop: '1rem' }}>
            <div className="db-lb-header">
              <span className="db-lb-title">Approved Universities</span>
              <span className="db-lb-badge">{approvedRegs.length} institutions on platform</span>
            </div>
            <table className="db-lb-table">
              <thead>
                <tr>
                  <th style={{ width: 48 }}>#</th>
                  <th>Institution</th>
                  <th>Country</th>
                  <th>Domain</th>
                  <th>Approved</th>
                </tr>
              </thead>
              <tbody>
                {approvedRegs.map((r, i) => (
                  <tr key={r.id}>
                    <td>
                      <span className={`db-rank ${i === 0 ? 'db-rank-1' : i === 1 ? 'db-rank-2' : i === 2 ? 'db-rank-3' : 'db-rank-n'}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="db-name-cell">{r.orgName}</td>
                    <td style={{ color: '#6b7280' }}>{r.country}</td>
                    <td style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: 12 }}>{r.domain}</td>
                    <td style={{ color: '#6b7280', fontSize: 13 }}>
                      {r.reviewedAt ? new Date(r.reviewedAt).toLocaleDateString() : '—'}
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
