import { useState } from 'react'
import '../../styles/modals.css'

interface Props {
  open: boolean
  onClose: () => void
  studentCount: number
}

const GROUPS = [
  { value: 'all', label: 'All Students'},
  { value: 'at_risk', label: 'At-Risk Students Only'},
  { value: 'late', label: 'Late Submissions Only'},
  { value: 'not_started', label: 'Not Started Yet'},
]

export default function BulkNotifyModal({
  open, onClose, studentCount
}: Props) {
  const [group, setGroup] = useState('all')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const handleSend = () => {
    if (!subject || !message) {
      setError('Subject and message are required.')
      return
    }
    // TODO: Backend
    setSent(true)
    setError('')
  }

  const handleClose = () => {
    setGroup('all')
    setSubject('')
    setMessage('')
    setSent(false)
    setError('')
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <div className="modal-header">
          <p className="modal-title">📣 Bulk Notify Students</p>
          <button className="modal-close" onClick={handleClose}>✕</button>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p style={{ fontSize: '2rem' }}>✅</p>
            <p style={{ fontWeight: 600, color: '#16a34a' }}>
              Notification queued successfully
            </p>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Will be sent once backend is connected.
            </p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={handleClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Recipient group */}
            <div className="modal-field">
              <label className="modal-label">
                Send to
                <span className="recipient-count">
                  {studentCount} students
                </span>
              </label>
              <select
                value={group}
                onChange={e => setGroup(e.target.value)}
                className="modal-select"
              >
                {GROUPS.map(g => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div className="modal-field">
              <label className="modal-label">Subject *</label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="modal-input"
                placeholder="e.g. Submission deadline reminder"
              />
            </div>

            {/* Message */}
            <div className="modal-field">
              <label className="modal-label">Message *</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="modal-textarea"
                placeholder="Write your message here..."
              />
              <p className="modal-hint">
                Students will receive this via email and in-app notification.
              </p>
            </div>

            {error && <p className="modal-error">{error}</p>}

            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={handleClose}>Cancel</button>
              <button className="btn btn-warning" onClick={handleSend}>
                📣 Send Notification
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  )
}