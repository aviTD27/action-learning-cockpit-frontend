import { Link } from 'react-router-dom'
import { Presentation } from 'lucide-react'
import { useLecturers } from '../../hooks/useLecturers'
import StatusBadge from '../shared/StatusBadge'
import '../../styles/uniAdmin.css'

export default function LecturerPanel() {
  const { lecturers, loading } = useLecturers()
  const recent = lecturers.slice(-5).reverse()

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <p className="ua-card-title"><Presentation size={14} /> Recent Lecturers</p>
        <Link to="/uni-admin/lecturers" className="ua-link">View all →</Link>
      </div>
      <div className="ua-panel-body">
        {loading ? (
          <p className="ua-table-empty">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="ua-table-empty">No lecturers added yet.</p>
        ) : (
          recent.map(l => (
            <div className="ua-stat-row" key={l.id}>
              <span>
                <span className="ua-row-name">{l.firstName} {l.lastName}</span>
                <span className="ua-row-sub"> · {l.programmeNames.join(', ')}</span>
              </span>
              <StatusBadge status={l.status} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
