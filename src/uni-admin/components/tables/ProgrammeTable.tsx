import { useState } from 'react'
import { isAxiosError } from 'axios'
import { BookOpen, Pencil, Plus } from 'lucide-react'
import { useProgrammes } from '../../hooks/useProgrammes'
import { createProgramme, updateProgramme, archiveProgramme, unarchiveProgramme } from '../../api/uniAdmin'
import { useAuth } from '../../../auth/AuthContext'
import ProgrammeModal from '../modals/ProgrammeModal'
import type { ProgrammeFormData } from '../modals/ProgrammeModal'
import type { ProgrammeResponse, ProgrammeStatus } from '../../api/types'
import { PROGRAMME_STATUSES } from '../../api/types'
import '../../styles/uniAdmin.css'

export default function ProgrammeTable() {
  const { universityId } = useAuth()
  const { programmes, loading, error, reload } = useProgrammes()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ProgrammeResponse | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (programme: ProgrammeResponse) => { setEditTarget(programme); setModalOpen(true) }

  const handleSave = async (data: ProgrammeFormData) => {
    if (editTarget) await updateProgramme(editTarget.id, { ...data, universityId: universityId! })
    else await createProgramme({ ...data, universityId: universityId! })
    reload()
  }

  const handleStatusChange = async (p: ProgrammeResponse, next: ProgrammeStatus) => {
    if (next === p.status) return
    setNotice(null)
    setBusyId(p.id)
    try {
      if (next === 'ARCHIVED') await archiveProgramme(p.id)
      else await unarchiveProgramme(p.id)
      reload()
    } catch (err) {
      let msg = 'Could not change the status of this programme.'
      if (isAxiosError(err) && err.response?.data?.message) {
        msg = err.response.data.message
        if (msg.includes('active cohorts')) {
          msg += ' Go to the Cohorts tab to complete or archive them.'
        } else if (msg.includes('lecturers')) {
          msg += ' Go to the Lecturers tab to unassign them.'
        }
      }
      setNotice(msg)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <p className="ua-card-title"><BookOpen size={14} /> Programmes<span className="ua-count">{programmes.length} total</span></p>
        <button className="ua-btn ua-btn-success" onClick={openCreate}>
          <Plus size={12} /> Create Programme
        </button>
      </div>

      {notice && <p className="ua-modal-error" style={{ margin: '0 0 0.5rem' }}>{notice}</p>}

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
                <th>Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programmes.map(p => (
                <tr key={p.id}>
                  <td className="col-name">{p.name}</td>
                  <td className="col-highlight">{p.code}</td>
                  <td className="col-muted">{p.description}</td>
                  <td>
                    <div className="ua-status-cell">
                      <span className={`ua-badge ua-badge-${p.status.toLowerCase()}`}>
                        {p.status === 'ACTIVE' ? 'Active' : 'Archived'}
                      </span>
                      <select
                        className="ua-status-select"
                        value={p.status}
                        disabled={busyId === p.id}
                        onChange={e => handleStatusChange(p, e.target.value as ProgrammeStatus)}
                      >
                        {PROGRAMME_STATUSES.map(s => (
                          <option key={s} value={s}>{s === 'ACTIVE' ? 'Active' : 'Archived'}</option>
                        ))}
                      </select>
                    </div>
                  </td>
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
