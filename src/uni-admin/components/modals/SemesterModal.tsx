import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import type { CreateSemesterRequest, SemesterResponse } from '../../api/types'
import '../../styles/uniAdmin.css'

function apiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err) && err.response?.data?.message) return err.response.data.message
  return fallback
}

interface Props {
  open: boolean
  programmeId: number
  existing?: SemesterResponse | null
  onClose: () => void
  onSave: (data: CreateSemesterRequest) => Promise<void>
}

export default function SemesterModal({ open, programmeId, existing, onClose, onSave }: Props) {
  const [name, setName] = useState('')
  const [orderIndex, setOrderIndex] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setName(existing?.name ?? '')
      setOrderIndex(existing?.orderIndex ?? 1)
      setError(null)
    }
  }, [open, existing])

  if (!open) return null

  const submit = async () => {
    if (!name.trim()) { setError('Name is required'); return }
    setSaving(true)
    try {
      await onSave({ name: name.trim(), orderIndex, programmeId })
      onClose()
    } catch (err) {
      setError(apiErrorMessage(err, 'Failed to save semester'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title">{existing ? 'Edit Semester' : 'Add Semester'}</h2>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Semester Name *</label>
          <input
            className="ua-modal-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Year 1  Semester 1"
          />
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Order</label>
          <input
            className="ua-modal-input"
            type="number"
            min={1}
            value={orderIndex}
            onChange={e => setOrderIndex(Number(e.target.value))}
          />
        </div>

        {error && <p className="ua-modal-error">{error}</p>}

        <div className="ua-modal-actions">
          <button className="ua-btn ua-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ua-btn ua-btn-primary" onClick={submit} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
