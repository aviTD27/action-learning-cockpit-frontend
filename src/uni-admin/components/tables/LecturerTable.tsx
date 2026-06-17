import { useState } from 'react'
import { Pencil, Plus, Presentation, Upload } from 'lucide-react'
import { useLecturers } from '../../hooks/useLecturers'
import { useProgrammes } from '../../hooks/useProgrammes'
import { createLecturer, updateLecturer } from '../../api/uniAdmin'
import type { CreateLecturerRequest, LecturerResponse } from '../../api/types'
import LecturerModal from '../modals/LecturerModal'
import ImportCSVModal from '../modals/ImportCSVModal'
import StatusBadge from '../shared/StatusBadge'
import '../../styles/uniAdmin.css'

export default function LecturerTable() {
  const { lecturers, loading, error, reload } = useLecturers()
  const { programmes } = useProgrammes()

  const [modalOpen, setModalOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<LecturerResponse | null>(null)

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (lecturer: LecturerResponse) => { setEditTarget(lecturer); setModalOpen(true) }

  const handleSave = async (data: CreateLecturerRequest) => {
    if (editTarget) await updateLecturer(editTarget.id, data)
    else await createLecturer(data)
    reload()
  }

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <p className="ua-card-title"><Presentation size={14} /> Lecturers<span className="ua-count">{lecturers.length} total · {lecturers.filter(l => l.status === 'ACTIVE').length} active</span></p>
        <div className="ua-header-actions">
          <button className="ua-btn ua-btn-secondary" onClick={() => setImportOpen(true)}>
            <Upload size={12} /> Import CSV
          </button>
          <button className="ua-btn ua-btn-success" onClick={openCreate}>
            <Plus size={12} /> Add Lecturer
          </button>
        </div>
      </div>

      <div className="ua-table-wrap">
        {loading ? (
          <p className="ua-table-empty">Loading lecturers…</p>
        ) : error ? (
          <p className="ua-table-empty">{error}</p>
        ) : lecturers.length === 0 ? (
          <p className="ua-table-empty">No lecturers yet. Add the first one.</p>
        ) : (
          <table className="ua-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Name</th>
                <th>Email</th>
                <th>Programmes</th>
                <th>Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lecturers.map(l => (
                <tr key={l.id}>
                  <td className="col-highlight">{l.lecturerRef}</td>
                  <td className="col-name">{l.firstName} {l.lastName}</td>
                  <td className="col-muted">{l.email}</td>
                  <td className="col-muted">{l.programmeNames.join(', ')}</td>
                  <td><StatusBadge status={l.status} /></td>
                  <td className="col-actions">
                    <button className="ua-icon-btn" title="Edit lecturer" onClick={() => openEdit(l)}>
                      <Pencil size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <LecturerModal
        open={modalOpen}
        existing={editTarget}
        programmes={programmes}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <ImportCSVModal
        open={importOpen}
        mode="lecturer"
        programmes={programmes}
        cohorts={[]}
        onClose={() => setImportOpen(false)}
        onImported={reload}
      />
    </div>
  )
}
