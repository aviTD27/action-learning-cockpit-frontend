import { useState } from 'react'
import { useCohorts } from '../../hooks/useCohorts'
import type { Cohort } from '../../hooks/useCohorts'
import CohortModal from '../modals/CohortModal'
import '../../styles/uniAdmin.css'

const STATUS_LABELS: Record<string, string> = {
  open: '✅ Open',
  closed: '🔒 Closed',
  late: '⚠️ Late',
  not_started: '🕐 Not started',
}

export default function CohortTable() {
  const { cohorts, loading, refetch } = useCohorts()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [modalOpen,  setModalOpen ] = useState(false)
  const [editTarget, setEditTarget] = useState<Cohort | null>(null)

  const selected = cohorts.find(c => c.id === selectedId) ?? null

  const openCreate = () => { setEditTarget(null);     setModalOpen(true) }
  const openEdit   = () => { setEditTarget(selected); setModalOpen(true) }

  const handleSave = async (data: Partial<Cohort>) => {
    // TODO: API Call for Backend
    console.log(editTarget ? 'UPDATE' : 'CREATE', data)
    refetch()
  }

  const handleArchive = () => {
    if (!selectedId) return
    // TODO: API Call for Backend
    console.log('ARCHIVE', selectedId)
    setSelectedId(null)
    refetch()
  }

  return (
    <div className="ua-card">

      <div className="ua-card-header">
        <p className="ua-card-title">👥 Cohort Management</p>
        <button className="ua-btn ua-btn-success" onClick={openCreate}>
          + Create New Cohort
        </button>
      </div>

      <div className="ua-table-wrap">
        {loading ? (
          <p className="ua-table-empty">Loading cohorts…</p>
        ) : (
          <table className="ua-table">
            <thead>
              <tr>
                <th>Cohort Name</th>
                <th>Programme</th>
                <th>Lecturer</th>
                <th>Students</th>
                <th>Cycle</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map(c => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={selectedId === c.id ? 'selected' : ''}
                >
                  <td className="col-name">{c.name}</td>
                  <td className="col-muted">{c.programme}</td>
                  <td className="col-muted">{c.lecturerName}</td>
                  <td>{c.studentCount}</td>
                  <td className="col-highlight">{c.currentCycle} / {c.totalCycles}</td>
                  <td>
                    <span className={`ua-badge ua-badge-${c.status}`}>
                      {STATUS_LABELS[c.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="ua-card-footer">
        <button className="ua-btn ua-btn-secondary" onClick={openEdit} disabled={!selectedId}>✏️ Edit</button>
        <button className="ua-btn ua-btn-success" disabled={!selectedId}>➕ Enroll Students</button>
        <button className="ua-btn ua-btn-ghost" onClick={handleArchive} disabled={!selectedId}>🗄 Archive</button>
      </div>

      <CohortModal
        open={modalOpen}
        existing={editTarget}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

    </div>
  )
}