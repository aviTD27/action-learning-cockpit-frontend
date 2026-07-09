import { useTenantSummary, useGradeDistribution } from '../../hooks/useAnalytics'
import '../../styles/uniAdmin.css'

export default function ComplianceStats() {
  const { summary, loading: loadingSummary, error } = useTenantSummary()
  const { distribution, loading: loadingDist } = useGradeDistribution()
  const loading = loadingSummary || loadingDist

  if (loading || !summary) {
    return (
      <div className="ua-card">
        <p className="ua-table-empty">{error ?? 'Loading compliance…'}</p>
      </div>
    )
  }

  const totalReleased = distribution.reduce((sum, d) => sum + d.count, 0)
  const passedCount = distribution
    .filter(d => d.band !== 'Fail')
    .reduce((sum, d) => sum + d.count, 0)
  const failedCount = totalReleased - passedCount
  const hasGrades = totalReleased > 0
  const passRate = hasGrades ? Math.round((passedCount / totalReleased) * 100) : 0
  const failRate = hasGrades ? 100 - passRate : 0

  const tiles = [
    { label: 'Total Students', value: summary.totalStudents, color: '#6366f1' },
    { label: 'Active Students', value: summary.activeStudents, color: '#10b981' },
    { label: 'Active Cohorts', value: summary.activeCohorts, color: '#0ea5e9' },
    { label: 'Total Assignments',  value: summary.totalSubmissions, color: '#f59e0b' },
    { label: 'Released Grades', value: summary.releasedGrades, color: '#8b5cf6' },
    { label: 'Graded This Month',  value: summary.gradedThisMonth, color: '#f97316' },
  ]

  return (
    <div className="ua-card">

      <div className="ua-card-header">
        <p className="ua-card-title">📋 Compliance Overview</p>
        <button
          className="ua-btn ua-btn-primary"
          disabled
          title="PDF report export is not available yet  backend endpoint pending."
          style={{ opacity: 0.5, cursor: 'not-allowed' }}
        >
          ⬇️ Download Report
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.75rem',
          padding: '0.5rem 1rem 1rem',
        }}
      >
        {tiles.map(t => (
          <div
            key={t.label}
            style={{
              border: '1px solid #eef0f4',
              borderRadius: 12,
              padding: '0.85rem 1rem',
              background: '#fff',
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 700, color: t.color, lineHeight: 1.1 }}>{t.value}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{t.label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 1rem 0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Grade Quality</span>
          <span style={{ fontSize: 13, color: '#6b7280' }}>
            Average Score: <strong style={{ color: '#ea580c' }}>{hasGrades ? `${summary.avgScorePct}%` : ''}</strong>
          </span>
        </div>

        {hasGrades ? (
          <>
            <div style={{ display: 'flex', height: 16, borderRadius: 8, overflow: 'hidden', background: '#f1f5f9' }}>
              {passRate > 0 && <div style={{ width: `${passRate}%`, background: '#10b981' }} />}
              {failRate > 0 && <div style={{ width: `${failRate}%`, background: '#ef4444' }} />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}>
              <span style={{ color: '#10b981', fontWeight: 600 }}>● Pass {passRate}% ({passedCount})</span>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>Fail {failRate}% ({failedCount}) ●</span>
            </div>
          </>
        ) : (
          <div
            style={{
              padding: '0.85rem',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: 13,
              background: '#f8fafc',
              borderRadius: 8,
            }}
          >
            No grades released yet  the pass/fail split appears once grading begins.
          </div>
        )}
      </div>

      <p style={{ padding: '0.5rem 1rem 0', fontSize: 12, color: '#9ca3af' }}>
        Pass rate counts released grades of 50% or higher. An on-time submission rate is not shown 
        the system records when work is graded, not when it is submitted.
      </p>

    </div>
  )
}
