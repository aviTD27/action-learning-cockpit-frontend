import { Users } from 'lucide-react'
import type { CohortProgressItem } from '../lib/dashboardStats'
import '../styles/lecturer.css'

export default function CohortProgressCards({ items }: { items: CohortProgressItem[] }) {
  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <p className="ua-card-title"><Users size={14} /> Cohort Progress<span className="ua-count">{items.length} ongoing</span></p>
      </div>
      <div className="ua-panel-body">
        {items.length === 0 ? (
          <p className="ua-table-empty">No ongoing cohorts.</p>
        ) : (
          <div className="ua-cohort-grid">
            {items.map(c => (
              <div className="ua-cohort-card" key={c.cohortId}>
                <div className="ua-cohort-head">
                  <span className="ua-cohort-name">{c.cohortName}</span>
                  <span className="ua-cohort-prog">{c.programmeName}</span>
                </div>
                <div className="ua-cohort-stats">
                  <span>{c.students} students</span>
                  <span className="ua-dot-sep">·</span>
                  <span>{c.deliverables} deliverable{c.deliverables === 1 ? '' : 's'}</span>
                </div>
                <div className="ua-progress">
                  <div className="ua-progress-label"><span>Grading</span><span>{c.gradedPct}%</span></div>
                  <div className="ua-progress-track">
                    <div className="ua-progress-fill" style={{ width: `${c.gradedPct}%` }} />
                  </div>
                </div>
                <div className="ua-cohort-avg">Avg grade: <strong>{c.avgPercent != null ? `${c.avgPercent}%` : '—'}</strong></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
