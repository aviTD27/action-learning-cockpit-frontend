import { useState, useRef } from 'react'
import '../../styles/modals.css'

interface Props {
  open: boolean
  onClose: () => void
}

export default function ImportCSVModal({ open, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.name.endsWith('.csv')) {
      setStatus('error')
      setMessage('Only .csv files are accepted.')
      return
    }
    setFile(f)
    setStatus('idle')
    setMessage('')
  }

  const handleImport = () => {
    if (!file) {
      setStatus('error')
      setMessage('Please select a CSV file first.')
      return
    }
    // TODO: Send file to backend
    setStatus('success')
    setMessage(`${file.name} ready to import. Connect backend to process.`)
  }

  const handleClose = () => {
    setFile(null)
    setStatus('idle')
    setMessage('')
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-box wide">

        <div className="modal-header">
          <p className="modal-title">📥 Import Students via CSV</p>
          <button className="modal-close" onClick={handleClose}>✕</button>
        </div>

        {/* Template format */}
        <div className="csv-template">
          <p className="csv-template-title">
            Required CSV format — first row must be headers:
          </p>
          <p className="csv-template-row">
            firstName, lastName, email, studentId, cohort, programme
          </p>
        </div>

        {/* Example */}
        <div className="modal-field">
          <label className="modal-label">Example row:</label>
          <p style={{
            fontSize: '11px',
            color: '#6b7280',
            fontFamily: 'monospace',
            background: '#f9fafb',
            padding: '0.5rem 0.75rem',
            borderRadius: '4px',
            border: '1px solid #e5e7eb',
            margin: 0,
          }}>
            Jane, Smith, j.smith@epita.fr, STU-2024F-001, MSc-2024-Fall, MSc Software Engineering
          </p>
        </div>

        {/* Drop zone */}
        <div
          className={`csv-dropzone ${file ? 'has-file' : ''}`}
          onClick={() => fileRef.current?.click()}
        >
          <div className="csv-dropzone-icon">
            {file ? '✅' : '📂'}
          </div>
          {file ? (
            <p className="csv-dropzone-file">{file.name}</p>
          ) : (
            <p className="csv-dropzone-text">
              Click to browse or drag and drop your CSV file here
            </p>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
        </div>

        {status === 'error' && <p className="modal-error">{message}</p>}
        {status === 'success' && <p className="modal-success">✅ {message}</p>}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={handleClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleImport}>
            Import Students
          </button>
        </div>

      </div>
    </div>
  )
}