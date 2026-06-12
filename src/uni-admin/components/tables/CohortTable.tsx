import { useState } from 'react'
import { Pencil, Plus, Users } from 'lucide-react'
import { useCohorts } from '../../hooks/useCohorts'
import { useProgrammes } from '../../hooks/useProgrammes'
import { createCohort, updateCohort } from '../../api/uniAdmin'
import type { CohortResponse, CreateCohortRequest } from '../../api/types'
import CohortModal from '../modals/CohortModal'
import StatusBadge from '../shared/StatusBadge'
import '../../styles/uniAdmin.css'

export default function CohortTable() {
  const { cohorts, loading, error, reload } = useCohorts()
  const { programmes } = useProgrammes()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<CohortResponse | null>(null)

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
        <p className="ua-card-title"><Users size={14} /> Cohort Management<span className="ua-count">{cohorts.length} total · {cohorts.filter(c => c.status === 'ONGOING').length} ongoing</span></p>
        <button className="ua-btn ua-btn-success" onClick={openCreate}>
          <Plus size={12} /> Create New Cohort
        </button>
      </div>

      <div className="ua-table-wrap">
        {loading ? (
          <p className="ua-table-empty">Loading cohorts…</p>
        ) : error ? (
          <p className="ua-table-empty">{error}</p>
        ) : cohorts.length === 0 ? (
          <p className="ua-table-empty">No cohorts yet. Create the first one.</p>
        ) : (
          <table className="ua-table">
            <thead>
              <tr>
                <th>Cohort Name</th>
                <th>Programme</th>
                <th>Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map(c => (
                <tr key={c.id}>
                  <td className="col-name">{c.name}</td>
                  <td className="col-muted">{c.programmeName}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="col-actions">
                    <button className="ua-icon-btn" title="Edit cohort" onClick={() => openEdit(c)}>
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
    </div>
  )
}
