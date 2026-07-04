import { useState } from 'react'
import { Pencil, Plus, Users } from 'lucide-react'
import { useCohorts } from '../../hooks/useCohorts'
import { useProgrammes } from '../../hooks/useProgrammes'
import { createCohort, updateCohort } from '../../api/uniAdmin'
import type { CohortResponse, CreateCohortRequest } from '../../api/types'
import CohortModal from '../modals/CohortModal'
import CohortStudentsModal from '../modals/CohortStudentsModal'
import StatusBadge from '../shared/StatusBadge'
import '../../styles/uniAdmin.css'

export default function CohortTable() {
  const { cohorts, loading, error, reload } = useCohorts()
  const { programmes } = useProgrammes()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<CohortResponse | null>(null)
  const [studentsTarget, setStudentsTarget] = useState<CohortResponse | null>(null)

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (cohort: CohortResponse) => { setEditTarget(cohort); setModalOpen(true) }

  const handleSave = async (data: CreateCohortRequest) => {
    if (editTarget) await updateCohort(editTarget.id, data)
    else await createCohort(data)
    reload()
  }

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <p className="ua-card-title"><Users size={14} /> Intakes<span className="ua-count">{cohorts.length} total · {cohorts.filter(c => c.status === 'ONGOING').length} ongoing</span></p>
        <button className="ua-btn ua-btn-success" onClick={openCreate}>
          <Plus size={12} /> Create New Intake
        </button>
      </div>

      <div className="ua-table-wrap">
        {loading ? (
          <p className="ua-table-empty">Loading intakes…</p>
        ) : error ? (
          <p className="ua-table-empty">{error}</p>
        ) : cohorts.length === 0 ? (
          <p className="ua-table-empty">No intakes yet. Create the first one.</p>
        ) : (
          <table className="ua-table">
            <thead>
              <tr>
                <th>Intake</th>
                <th>Season</th>
                <th>Programmes</th>
                <th>Students</th>
                <th>Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map(c => (
                <tr key={c.id}>
                  <td className="col-name">{c.name}</td>
                  <td className="col-muted">{c.season === 'SPRING' ? 'Spring' : 'Fall'} {c.academicYear}</td>
                  <td className="col-muted">
                    {c.programmeNames && c.programmeNames.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        {c.programmeNames.map(n => <span key={n}>{n}</span>)}
                      </div>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>None attached</span>
                    )}
                  </td>
                  <td className="col-muted">{c.studentCount}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="col-actions">
                    <button
                      className="ua-icon-btn"
                      title="View enrolled students"
                      onClick={() => setStudentsTarget(c)}
                    >
                      <Users size={13} />
                    </button>
                    <button
                      className="ua-icon-btn"
                      title="Edit intake"
                      onClick={() => openEdit(c)}
                    >
                      <Pencil size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CohortModal
        open={modalOpen}
        existing={editTarget}
        programmes={programmes}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <CohortStudentsModal
        open={studentsTarget !== null}
        cohort={studentsTarget}
        onClose={() => setStudentsTarget(null)}
      />
    </div>
  )
}
