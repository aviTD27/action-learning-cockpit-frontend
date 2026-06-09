import { useState, useEffect } from 'react'
import type { Cohort }from '../../hooks/useCohorts'
import '../../styles/uniAdmin.css'

interface Props {
  open: boolean
  existing?: Cohort | null
  onClose: () => void
  onSave: (data: Partial<Cohort>) => Promise<void>
}

const EMPTY = { name:'', programme:'', lecturerName:'', totalCycles: 4 }

export default function CohortModal({ open, existing, onClose, onSave }: Props) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(existing
      ? { name: existing.name, programme: existing.programme,
          lecturerName: existing.lecturerName, totalCycles: existing.totalCycles }
      : EMPTY
    )
    setError('')
  }, [existing, open])

  if (!open) return null

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async () => {
    if (!form.name || !form.programme || !form.lecturerName) {
      setError('Name, programme and lecturer are required.')
      return
    }
    setSaving(true)
    await onSave(form)
    setSaving(false)
    onClose()
  }

  return (
    <div className="ua-modal-overlay">
      <div className="ua-modal">

        <p className="ua-modal-title">
          {existing ? 'Edit Cohort' : 'Create New Cohort'}
        </p>

        {[
          { label: 'Cohort Name',  name: 'name', placeholder: 'e.g. MSc-2025-Fall' },
          { label: 'Programme', name: 'programme', placeholder: 'e.g. MSc Software Eng' },
          { label: 'Lecturer', name: 'lecturerName', placeholder: 'e.g. Dr. Tom' },
        ].map(f => (
          <div key={f.name} className="ua-modal-field">
            <label className="ua-modal-label">{f.label}</label>
            <input
              name={f.name}
              value={(form as Record<string,unknown>)[f.name] as string}
              onChange={handle}
              placeholder={f.placeholder}
              className="ua-modal-input"
            />
          </div>
        ))}

        <div className="ua-modal-field">
          <label className="ua-modal-label">Total Cycles</label>
          <input
            name="totalCycles"
            type="number"
            min={1}
            max={8}
            value={form.totalCycles}
            onChange={handle}
            className="ua-modal-input"
          />
        </div>

        {error && <p className="ua-modal-error">{error}</p>}

        <div className="ua-modal-actions">
          <button className="ua-btn ua-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="ua-btn ua-btn-primary"  onClick={submit} disabled={saving}>
            {saving ? 'Saving…' : 'Save Cohort'}
          </button>
        </div>

      </div>
    </div>
  )
}