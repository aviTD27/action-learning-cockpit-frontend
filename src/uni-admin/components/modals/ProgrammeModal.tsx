import { useEffect, useState } from 'react'
import type { CreateProgrammeRequest, ProgrammeResponse } from '../../api/types'

export type ProgrammeFormData = Omit<CreateProgrammeRequest, 'universityId'>
import '../../styles/uniAdmin.css'

import { isAxiosError } from 'axios'

function apiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err) && err.response?.data?.message) return err.response.data.message
  return fallback
}

interface Props {
  open: boolean
  existing?: ProgrammeResponse | null
  onClose: () => void
  onSave: (data: ProgrammeFormData) => Promise<void>
}

const EMPTY: ProgrammeFormData = { name: '', code: '', description: '' }

export default function ProgrammeModal({ open, existing, onClose, onSave }: Props) {
  const [form, setForm] = useState<ProgrammeFormData>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(existing
        ? { name: existing.name, code: existing.code, description: existing.description }
        : EMPTY)
      setError(null)
    }
  }, [open, existing])

  if (!open) return null

  const submit = async () => {
    if (!form.name.trim()) { setError('Name is required'); return }
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      setError(apiErrorMessage(err, 'Failed to save programme'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal" onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title">{existing ? 'Edit Programme' : 'Create Programme'}</h2>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Name *</label>
          <input
            className="ua-modal-input"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. MSc Software Engineering"
          />
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Code</label>
          <input
            className="ua-modal-input"
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value })}
            placeholder="e.g. MSC-SE"
          />
        </div>

        <div className="ua-modal-field">
          <label className="ua-modal-label">Description</label>
          <input
            className="ua-modal-input"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Short description"
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
