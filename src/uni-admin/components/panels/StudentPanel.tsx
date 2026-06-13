import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import { useStudents } from '../../hooks/useStudents'
import StatusBadge from '../shared/StatusBadge'
import '../../styles/uniAdmin.css'

export default function StudentPanel() {
  const { students, loading } = useStudents()
  const recent = students.slice(-5).reverse()

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <p className="ua-card-title"><GraduationCap size={14} /> Recent Students</p>
        <Link to="/uni-admin/students" className="ua-link">View all →</Link>
      </div>
      <div className="ua-panel-body">
        {loading ? (
          <p className="ua-table-empty">Loading…</p>
        ) : recent.length === 0 ? (
          <p className="ua-table-empty">No students enrolled yet.</p>
        ) : (
          recent.map(s => (
            <div className="ua-stat-row" key={s.id}>
              <span>
                <span className="ua-row-name">{s.firstName} {s.lastName}</span>
                <span className="ua-row-sub"> · {s.studentRef}</span>
              </span>
              <StatusBadge status={s.status} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
