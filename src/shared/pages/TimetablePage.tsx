import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import WeeklyCalendar from '../components/WeeklyCalendar'
import TimetableModal from '../../uni-admin/components/modals/TimetableModal'
import {
  getTimetable, createTimetableEntry, updateTimetableEntry, deleteTimetableEntry,
  getCohorts, getLecturers,
} from '../../uni-admin/api/uniAdmin'
import type { CohortResponse, CreateTimetableRequest, LecturerResponse, TimetableEntry } from '../../uni-admin/api/types'

interface Props {
  canEdit?: boolean
  universityId?: number | null
}

export default function TimetablePage({ canEdit, universityId }: Props) {
  const uid = universityId ?? undefined

  const [entries,   setEntries]   = useState<TimetableEntry[]>([])
  const [cohorts,   setCohorts]   = useState<CohortResponse[]>([])
  const [lecturers, setLecturers] = useState<LecturerResponse[]>([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing,   setEditing]   = useState<TimetableEntry | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<TimetableEntry | null>(null)
  const [deleting,     setDeleting]     = useState(false)

  useEffect(() => {
    const fetches = [
      getTimetable().then(r => setEntries(r.data)).catch(() => {}),
    ]
    if (canEdit) {
      fetches.push(
        getCohorts(uid).then(r => setCohorts(r.data)).catch(() => {}),
        getLecturers(uid).then(r => setLecturers(r.data)).catch(() => {}),
      )
    }
    Promise.all(fetches).finally(() => setLoading(false))
  }, [canEdit, uid])

  const openAdd  = ()                      => { setEditing(null); setModalOpen(true) }
  const openEdit = (e: TimetableEntry)     => { setEditing(e);    setModalOpen(true) }
  const closeModal = ()                    => { setModalOpen(false); setEditing(null) }

  const handleSave = async (data: CreateTimetableRequest) => {
    if (editing) {
      const res = await updateTimetableEntry(editing.id, data)
      setEntries(prev => prev.map(e => e.id === editing.id ? res.data : e))
    } else {
      const res = await createTimetableEntry(data)
      setEntries(prev => [...prev, res.data])
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteTimetableEntry(deleteTarget.id)
      setEntries(prev => prev.filter(e => e.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      setError(isAxiosError(err) ? (err.response?.data?.message ?? 'Delete failed') : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div style={{ padding: '2rem', color: '#9ca3af' }}>Loading timetable…</div>

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {error && (
        <div style={{ marginBottom: '1rem', padding: '.75rem 1rem', background: '#fee2e2', borderRadius: 8, color: '#dc2626', fontSize: 14 }}>
          {error}
        </div>
      )}

      <WeeklyCalendar
        entries={entries}
        canEdit={canEdit}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
      />

      {canEdit && (
        <TimetableModal
          open={modalOpen}
          existing={editing}
          cohorts={cohorts}
          lecturers={lecturers}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="ua-modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="ua-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <h2 className="ua-modal-title">Delete Entry</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Remove <strong>{deleteTarget.title}</strong> on {deleteTarget.dayOfWeek}? This cannot be undone.
            </p>
            <div className="ua-modal-actions">
              <button className="ua-btn ua-btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="ua-btn" style={{ background: '#ef4444', color: '#fff' }}
                onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
