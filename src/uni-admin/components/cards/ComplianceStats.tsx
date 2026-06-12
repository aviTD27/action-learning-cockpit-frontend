import { useUniAdminStats } from '../../hooks/useUniAdminStats'
import '../../styles/uniAdmin.css'

export default function ComplianceStats() {
  const { stats, loading } = useUniAdminStats()

  if (loading || !stats) {
    return (
      <div className="ua-card">
        <p className="ua-table-empty">Loading compliance…</p>
      </div>
    )
  }

  const nlpPct = Math.round(stats.avgNlpScore)
  const failPct = 100 - stats.checkpointPassRate

  const rows = [
    { label: 'Total Students', value: `${stats.totalStudents}`, color: ''},
    { label: 'Active Cohorts', value: `${stats.activeCohorts}`, color: ''},
    { label: 'Checkpoint Pass Rate', value: `${stats.checkpointPassRate}%`, color: 'green'},
    { label: 'Checkpoint Failure Rate', value: `${failPct}%`, color: 'red'},
    { label: 'Avg NLP Score', value: `${nlpPct} / 100`, color: 'orange'},
    { label: 'On-Time Submission Rate', value: `${stats.avgNlpScore}%`, color: 'green'},
  ]

  return (
    <div className="ua-card">

      <div className="ua-card-header">
        <p className="ua-card-title">📋 Compliance Overview — Cycle 3</p>
        <button
          className="ua-btn ua-btn-primary"
          onClick={() => alert('Download ready when backend is connected.')}
        >
          ⬇️ Download Report
        </button>
      </div>

      <div style={{ padding: '0 1rem' }}>
        {rows.map(({ label, value, color }) => (
          <div key={label} className="ua-stat-row">
            <span className="ua-stat-label">{label}</span>
            <span className={`ua-stat-value ${color}`}>{value}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
