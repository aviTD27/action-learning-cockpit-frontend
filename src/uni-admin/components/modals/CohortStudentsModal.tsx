import { useEffect, useMemo, useState } from 'react'
import { GraduationCap } from 'lucide-react'
import { getStudentsByCohort } from '../../api/uniAdmin'
import type { CohortResponse, StudentResponse } from '../../api/types'
import StatusBadge from '../shared/StatusBadge'
import '../../styles/uniAdmin.css'

interface Props {
  open: boolean
  cohort: CohortResponse | null
  onClose: () => void
}

export default function CohortStudentsModal({ open, cohort, onClose }: Props) {
  const [students, setStudents] = useState<StudentResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !cohort) return
    setLoading(true)
    setError(null)
    getStudentsByCohort(cohort.id)
      .then(res => setStudents(res.data))
      .catch(() => setError('Failed to load students for this intake.'))
      .finally(() => setLoading(false))
  }, [open, cohort])

  // Group students by programme so it's clear who studies what.
  const groups = useMemo(() => {
    const map = new Map<string, StudentResponse[]>()
    for (const s of students) {
      const key = s.programmeName ?? 'No programme'
      const list = map.get(key) ?? []
      list.push(s)
      map.set(key, list)
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [students])

  if (!open || !cohort) return null

  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal ua-modal-lg" onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title">
          <GraduationCap size={16} style={{ verticalAlign: '-2px', marginRight: 6 }} />
          Students in {cohort.name}
          <span className="ua-count" style={{ marginLeft: 8 }}>
            {loading ? '' : `${students.length} enrolled · ${groups.length} programme${groups.length === 1 ? '' : 's'}`}
          </span>
        </h2>

        <div className="ua-table-wrap" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {loading ? (
            <p className="ua-table-empty">Loading students…</p>
          ) : error ? (
            <p className="ua-table-empty">{error}</p>
          ) : students.length === 0 ? (
            <p className="ua-table-empty">No students enrolled in this intake yet.</p>
          ) : (
            groups.map(([programme, list]) => (
              <div key={programme} style={{ marginBottom: '1.1rem' }}>
                <p className="ua-card-title" style={{ fontSize: '0.85rem', margin: '0.25rem 0 0.4rem' }}>
                  {programme}
                  <span className="ua-count">{list.length} student{list.length === 1 ? '' : 's'}</span>
                </p>
                <table className="ua-table">
                  <thead>
                    <tr>
                      <th>Ref</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(s => (
                      <tr key={s.id}>
                        <td className="col-highlight">{s.studentRef}</td>
                        <td className="col-name">{s.firstName} {s.lastName}</td>
                        <td className="col-muted">{s.email}</td>
                        <td><StatusBadge status={s.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>

        <div className="ua-modal-actions">
          <button className="ua-btn ua-btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
