import { AlertTriangle } from 'lucide-react'
import '../styles/lecturer.css'

interface Props {
  open: boolean
  title?: string
  message: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  danger = true,
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null

  return (
    <div className="ua-modal-overlay" onClick={onClose}>
      <div className="ua-modal ua-modal-sm" onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title">
          {danger && <AlertTriangle size={15} className="ua-confirm-icon" />} {title}
        </h2>
        <p className="ua-confirm-text">{message}</p>
        <div className="ua-modal-actions">
          <button className="ua-btn ua-btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className={`ua-btn ${danger ? 'ua-btn-danger' : 'ua-btn-primary'}`}
            onClick={() => { onConfirm(); onClose() }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
