import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Archive, ArchiveRestore, ClipboardList, Eye, Pencil, Plus, Send, Trash2 } from 'lucide-react'
import { useCohorts } from '../../uni-admin/hooks/useCohorts'
import { useSubmissions } from '../hooks/useSubmissions'
import { uploadTemplate } from '../api/lecturer'
import SubmissionModal from './SubmissionModal'
import ConfirmDialog from './ConfirmDialog'
import type { CreateSubmissionData, Submission } from '../types'
import '../styles/lecturer.css'

const STATUS_CLASS: Record<string, string> = {
  DRAFT: 'ua-badge-not_started',
  PUBLISHED: 'ua-badge-active',
  ARCHIVED: 'ua-badge-archived',
}

export default function SubmissionTable() {
  const { submissions, create, update, remove, publish, archive, unarchive, reload, error } = useSubmissions()
  const { cohorts } = useCohorts()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Submission | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Submission | null>(null)
  const [archiveTarget, setArchiveTarget] = useState<Submission | null>(null)
  const [cohortFilter, setCohortFilter] = useState<number | ''>('')

  const visible = cohortFilter === ''
    ? submissions
    : submissions.filter(s => s.cohortId === cohortFilter)

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (submission: Submission) => { setEditTarget(submission); setModalOpen(true) }

  const handleSave = async (data: CreateSubmissionData, templateFile?: File) => {
    let id: number | undefined = editTarget?.id
    if (editTarget) await update(editTarget.id, data)
    else id = await create(data)
    if (id && templateFile) {
      try { await uploadTemplate(id, templateFile); await reload() } catch { /* handled by hook error */ }
    }
  }

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <p className="ua-card-title"><ClipboardList size={14} /> Assignments<span className="ua-count">{visible.length} shown · {submissions.length} total</span></p>
        <div className="ua-header-actions">
          <select
            className="ua-modal-input ua-filter"
            value={cohortFilter}
            onChange={e => setCohortFilter(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">All cohorts</option>
            {cohorts.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button className="ua-btn ua-btn-success" onClick={openCreate}>
            <Plus size={12} /> Create Assignment
          </button>
        </div>
      </div>

      {error && <p className="ua-modal-error" style={{ margin: '0 0 12px' }}>{error}</p>}

      <div className="ua-table-wrap">
        {visible.length === 0 ? (
          <p className="ua-table-empty">No assignments found.</p>
        ) : (
          <table className="ua-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Cohort</th>
                <th>Type</th>
                <th>Due</th>
                <th>Status</th>
                <th>Max Pts</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(s => (
                <tr key={s.id}>
                  <td className="col-name">{s.title}</td>
                  <td className="col-highlight">{s.cohortName}</td>
                  <td className="col-muted">{s.submissionType === 'BOTH' ? 'File/Text' : s.submissionType === 'FILE' ? 'File' : 'Text'}</td>
                  <td className="col-muted">{s.dueDate}{s.dueTime ? ` ${s.dueTime.slice(0, 5)}` : ''}</td>
                  <td>
                    <span className={`ua-badge ${STATUS_CLASS[s.status] ?? 'ua-badge-not_started'}`}>
                      <span className="ua-badge-dot" />
                      {s.status.charAt(0) + s.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td>{s.maxPoints}</td>
                  <td className="col-actions">
                    <Link to={`/lecturer/submissions/${s.id}`} className="ua-icon-btn" title="View students & grade">
                      <Eye size={13} />
                    </Link>
                    <button className="ua-icon-btn" title="Edit assignment" onClick={() => openEdit(s)}>
                      <Pencil size={13} />
                    </button>
                    {s.status === 'DRAFT' && (
                      <button className="ua-icon-btn" title="Publish assignment" onClick={() => publish(s.id)}>
                        <Send size={13} />
                      </button>
                    )}
                    {s.status !== 'ARCHIVED' ? (
                      <button className="ua-icon-btn" title="Archive assignment" onClick={() => setArchiveTarget(s)}>
                        <Archive size={13} />
                      </button>
                    ) : (
                      <button className="ua-icon-btn" title="Unarchive assignment" onClick={() => unarchive(s.id)}>
                        <ArchiveRestore size={13} />
                      </button>
                    )}
                    <button className="ua-icon-btn" title="Delete assignment" onClick={() => setDeleteTarget(s)}>
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <SubmissionModal
        open={modalOpen}
        existing={editTarget}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete assignment?"
        message={deleteTarget
          ? `"${deleteTarget.title}" will be permanently deleted. Published assignments with submissions can only be archived.`
          : ''}
        confirmLabel="Delete"
        onConfirm={() => { if (deleteTarget) remove(deleteTarget.id) }}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={archiveTarget !== null}
        title="Archive assignment?"
        message={archiveTarget
          ? `"${archiveTarget.title}" will be hidden from students but kept for reference.`
          : ''}
        confirmLabel="Archive"
        onConfirm={() => { if (archiveTarget) archive(archiveTarget.id) }}
        onClose={() => setArchiveTarget(null)}
      />
    </div>
  )
}
