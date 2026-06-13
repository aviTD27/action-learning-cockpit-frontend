import { BarChart3 } from 'lucide-react'
import type { CohortBar } from '../lib/dashboardStats'
import '../styles/lecturer.css'

export default function SubmissionsByCohort({ bars }: { bars: CohortBar[] }) {
  const max = bars.reduce((m, b) => Math.max(m, b.count), 0) || 1
  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <p className="ua-card-title"><BarChart3 size={14} /> Submissions by Cohort</p>
      </div>
      <div className="ua-panel-body">
        {bars.length === 0 ? (
          <p className="ua-table-empty">No submissions yet.</p>
        ) : (
          bars.map(b => (
            <div className="ua-bar-row" key={b.cohortId}>
              <span className="ua-bar-label" title={b.cohortName}>{b.cohortName}</span>
              <div className="ua-bar-track">
                <div className="ua-bar-fill" style={{ width: `${(b.count / max) * 100}%` }} />
              </div>
              <span className="ua-bar-value">{b.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
