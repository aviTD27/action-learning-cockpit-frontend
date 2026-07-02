import { useMemo, useState } from 'react'
import { GraduationCap, Pencil, Plus, Upload } from 'lucide-react'
import { useStudents } from '../../hooks/useStudents'
import { useCohorts } from '../../hooks/useCohorts'
import { useProgrammes } from '../../hooks/useProgrammes'
import { createStudent, updateStudent } from '../../api/uniAdmin'
import type { CreateStudentRequest, StudentResponse } from '../../api/types'
import { STUDENT_STATUSES } from '../../api/types'
import StudentModal from '../modals/StudentModal'
import ImportCSVModal from '../modals/ImportCSVModal'
import StatusBadge from '../shared/StatusBadge'
import '../../styles/uniAdmin.css'

export default function StudentTable() {
  const { students, loading, error, reload } = useStudents()
  const { cohorts } = useCohorts()
  const { programmes } = useProgrammes()

  const [modalOpen, setModalOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<StudentResponse | null>(null)
  const [cohortFilter, setCohortFilter] = useState<number | ''>('')
  const [programmeFilter, setProgrammeFilter] = useState<number | ''>('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  const cohortNames = useMemo(
    () => new Map(cohorts.map(c => [c.id, c.name])),
    [cohorts],
  )

  const visible = useMemo(
    () => students.filter(s =>
      (cohortFilter === ''    || s.cohortId === cohortFilter) &&
      (programmeFilter === '' || s.programmeId === programmeFilter) &&
      (statusFilter === ''    || s.status === statusFilter)
    ),
    [students, cohortFilter, programmeFilter, statusFilter],
  )

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (student: StudentResponse) => { setEditTarget(student); setModalOpen(true) }

  const handleSave = async (data: CreateStudentRequest) => {
    if (editTarget) await updateStudent(editTarget.id, data)
    else await createStudent(data)
    reload()
  }

  return (
    <div className="ua-card">
      <div className="ua-card-header">
        <p className="ua-card-title"><GraduationCap size={14} /> Students<span className="ua-count">{visible.length} shown · {students.length} total</span></p>
        <div className="ua-header-actions">
          <select
            className="ua-modal-input ua-filter"
            value={programmeFilter}
            onChange={e => setProgrammeFilter(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">All programmes</option>
            {programmes.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
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
          <select
            className="ua-modal-input ua-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            {STUDENT_STATUSES.map(s => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <button className="ua-btn ua-btn-secondary" onClick={() => setImportOpen(true)}>
            <Upload size={12} /> Import CSV
          </button>
          <button className="ua-btn ua-btn-success" onClick={openCreate}>
            <Plus size={12} /> Add Student
          </button>
        </div>
      </div>

      <div className="ua-table-wrap">
        {loading ? (
          <p className="ua-table-empty">Loading students…</p>
        ) : error ? (
          <p className="ua-table-empty">{error}</p>
        ) : visible.length === 0 ? (
          <p className="ua-table-empty">No students found.</p>
        ) : (
          <table className="ua-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Name</th>
                <th>Email</th>
                <th>Programme</th>
                <th>Cohort</th>
                <th>Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(s => (
                <tr key={s.id}>
                  <td className="col-highlight">{s.studentRef}</td>
                  <td className="col-name">{s.firstName} {s.lastName}</td>
                  <td className="col-muted">{s.email}</td>
                  <td className="col-muted">{s.programmeName}</td>
                  <td className="col-muted">{cohortNames.get(s.cohortId) ?? s.cohortId}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td className="col-actions">
                    <button
                      className="ua-icon-btn"
                      title="Edit student"
                      onClick={() => openEdit(s)}
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

      <StudentModal
        open={modalOpen}
        existing={editTarget}
        programmes={programmes}
        cohorts={cohorts}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <ImportCSVModal
        open={importOpen}
        mode="student"
        programmes={programmes}
        cohorts={cohorts}
        onClose={() => setImportOpen(false)}
        onImported={reload}
      />
    </div>
  )
}
