import { useState } from 'react'
import { BookOpen, Pencil, Plus } from 'lucide-react'
import { useProgrammes } from '../../hooks/useProgrammes'
import { createProgramme, updateProgramme } from '../../api/uniAdmin'
import { CURRENT_UNIVERSITY_ID } from '../../tenant'
import ProgrammeModal from '../modals/ProgrammeModal'
import type { ProgrammeFormData } from '../modals/ProgrammeModal'
import type { ProgrammeResponse } from '../../api/types'
import '../../styles/uniAdmin.css'

export default function ProgrammeTable() {
  const { programmes, loading, error, reload } = useProgrammes()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ProgrammeResponse | null>(null)

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (programme: ProgrammeResponse) => { setEditTarget(programme); setModalOpen(true) }

  const handleSave = async (data: ProgrammeFormData) => {
    if (editTarget) await updateProgramme(editTarget.id, { ...data, universityId: CURRENT_UNIVERSITY_ID })
    else await createProgramme({ ...data, universityId: CURRENT_UNIVERSITY_ID })
    reload()
  }

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <p className="ua-card-title"><BookOpen size={14} /> Programmes<span className="ua-count">{programmes.length} total</span></p>
        <button className="ua-btn ua-btn-success" onClick={openCreate}>
          <Plus size={12} /> Create Programme
        </button>
      </div>

      <div className="ua-table-wrap">
        {loading ? (
          <p className="ua-table-empty">Loading programmes…</p>
        ) : error ? (
          <p className="ua-table-empty">{error}</p>
        ) : programmes.length === 0 ? (
          <p className="ua-table-empty">No programmes yet. Create the first one.</p>
        ) : (
          <table className="ua-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Description</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programmes.map(p => (
                <tr key={p.id}>
                  <td className="col-name">{p.name}</td>
                  <td className="col-highlight">{p.code}</td>
                  <td className="col-muted">{p.description}</td>
                  <td className="col-actions">
                    <button className="ua-icon-btn" title="Edit programme" onClick={() => openEdit(p)}>
                      <Pencil size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ProgrammeModal
        open={modalOpen}
        existing={editTarget}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
