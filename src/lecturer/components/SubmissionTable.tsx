import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useCohorts } from '../../uni-admin/hooks/useCohorts'
import { useSubmissions } from '../hooks/useSubmissions'
import SubmissionModal from './SubmissionModal'
import type { Submission } from '../types'
import '../../uni-admin/styles/uniAdmin.css'

export default function SubmissionTable() {
  const { submissions, create, update, remove, error } = useSubmissions()
  const { cohorts } = useCohorts()

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Submission | null>(null)
  const [cohortFilter, setCohortFilter] = useState<number | ''>('')

  const visible = cohortFilter === ''
    ? submissions
    : submissions.filter(s => s.cohortId === cohortFilter)

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (submission: Submission) => { setEditTarget(submission); setModalOpen(true) }

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <p className="ua-card-title"><ClipboardList size={14} /> Submissions<span className="ua-count">{visible.length} shown · {submissions.length} total</span></p>
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
            <Plus size={12} /> Create Submission
          </button>
        </div>
      </div>

      {error && <p className="ua-modal-error" style={{ margin: '0 0 12px' }}>{error}</p>}

      <div className="ua-table-wrap">
        {visible.length === 0 ? (
          <p className="ua-table-empty">No submissions found.</p>
        ) : (
          <table className="ua-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Cohort</th>
                <th>Due Date</th>
                <th>Max Pts</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(s => (
                <tr key={s.id}>
                  <td className="col-name">{s.title}</td>
                  <td className="col-muted">{s.description || '—'}</td>
                  <td className="col-highlight">{s.cohortName}</td>
                  <td className="col-muted">{s.dueDate}</td>
                  <td>{s.maxPoints}</td>
                  <td className="col-actions">
                    <Link to={`/lecturer/submissions/${s.id}`} className="ua-icon-btn" title="View students & grade">
                      <Eye size={13} />
                    </Link>
                    <button
                      className="ua-icon-btn"
                      title="Edit submission"
                      onClick={() => openEdit(s)}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      className="ua-icon-btn"
                      title="Delete submission"
                      onClick={() => remove(s.id)}
                    >
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
        onSave={data => {
          if (editTarget) update(editTarget.id, data)
          else create(data)
        }}
      />
    </div>
  )
}
