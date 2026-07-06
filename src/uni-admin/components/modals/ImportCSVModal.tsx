import { useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Download, FileText, Upload } from 'lucide-react'
import { createLecturer, createStudent } from '../../api/uniAdmin'
import {
  LECTURER_STATUSES,
  STUDENT_STATUSES,
  type CohortResponse,
  type CreateLecturerRequest,
  type CreateStudentRequest,
  type ProgrammeResponse,
} from '../../api/types'
import '../../styles/uniAdmin.css'

type ImportMode = 'student' | 'lecturer'
type AnyRequest = CreateStudentRequest | CreateLecturerRequest

const STUDENT_HEADERS = ['firstName', 'lastName', 'email', 'programme', 'cohort', 'status']
const LECTURER_HEADERS = ['firstName', 'lastName', 'email', 'programmes', 'status']
const EMAIL_RE = /^\S+@\S+\.\S+$/

interface PreparedRow {
  line: number
  label: string
  request?: AnyRequest
  error?: string
}

interface RowResult {
  line: number
  label: string
  ok: boolean
  reason?: string
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ }
        else inQuotes = false
      } else field += c
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field); field = ''
    } else if (c === '\n') {
      row.push(field); rows.push(row); row = []; field = ''
    } else if (c !== '\r') {
      field += c
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  return rows.filter(r => r.some(c => c.trim() !== ''))
}

function parseRecords(text: string): Record<string, string>[] {
  const rows = parseCsv(text)
  if (rows.length < 2) return []
  const headers = rows[0].map(h => h.trim().toLowerCase())
  return rows.slice(1).map(cells => {
    const rec: Record<string, string> = {}
    headers.forEach((h, i) => { rec[h] = (cells[i] ?? '').trim() })
    return rec
  })
}

function templateFor(mode: ImportMode): string {
  return mode === 'student'
    ? [STUDENT_HEADERS.join(','), 'Jane,Smith,jane.smith@epita.fr,MSc-SE,MSc-2026-Fall,ACTIVE'].join('\r\n')
    : [LECTURER_HEADERS.join(','), 'John,Doe,john.doe@epita.fr,MSc-SE; MSc-DS,ACTIVE'].join('\r\n')
}

function downloadCsv(filename: string, content: string): void {
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function programmeIndex(programmes: ProgrammeResponse[]): Map<string, number> {
  const map = new Map<string, number>()
  programmes.forEach(p => {
    if (p.code) map.set(p.code.trim().toLowerCase(), p.id)
    if (p.name) map.set(p.name.trim().toLowerCase(), p.id)
  })
  return map
}

function prepareStudents(records: Record<string, string>[], programmes: ProgrammeResponse[], cohorts: CohortResponse[]): PreparedRow[] {
  const progByKey = programmeIndex(programmes)
  const cohortByName = new Map(cohorts.map(c => [c.name.trim().toLowerCase(), c.id]))
  return records.map((rec, i) => {
    const line = i + 1
    const label = `${rec.firstname || '?'} ${rec.lastname || ''} (${rec.email || 'row ' + line})`.trim()
    const fail = (error: string): PreparedRow => ({ line, label, error })
    if (!rec.firstname || !rec.lastname || !rec.email) return fail('missing a required field (firstName, lastName, email)')
    if (!EMAIL_RE.test(rec.email)) return fail(`invalid email "${rec.email}"`)
    const programmeId = progByKey.get((rec.programme || '').toLowerCase())
    if (!programmeId) return fail(`unknown programme "${rec.programme}"`)
    const cohortId = cohortByName.get((rec.cohort || '').toLowerCase())
    if (!cohortId) return fail(`unknown cohort "${rec.cohort}"`)
    const status = (rec.status || 'ACTIVE').toUpperCase()
    if (!(STUDENT_STATUSES as readonly string[]).includes(status)) return fail(`invalid status "${rec.status}"`)
    return {
      line, label,
      request: {
        firstName: rec.firstname, lastName: rec.lastname, personalEmail: rec.email,
        programmeId, status: status as CreateStudentRequest['status'], cohortId,
      },
    }
  })
}

function prepareLecturers(records: Record<string, string>[], programmes: ProgrammeResponse[]): PreparedRow[] {
  const progByKey = programmeIndex(programmes)
  return records.map((rec, i) => {
    const line = i + 1
    const label = `${rec.firstname || '?'} ${rec.lastname || ''} (${rec.email || 'row ' + line})`.trim()
    const fail = (error: string): PreparedRow => ({ line, label, error })
    if (!rec.firstname || !rec.lastname || !rec.email) return fail('missing a required field (firstName, lastName, email)')
    if (!EMAIL_RE.test(rec.email)) return fail(`invalid email "${rec.email}"`)
    const names = (rec.programmes || '').split(/[;|]/).map(s => s.trim()).filter(Boolean)
    if (names.length === 0) return fail('no programmes listed (use ";" to separate multiple)')
    const programmeIds: number[] = []
    for (const n of names) {
      const id = progByKey.get(n.toLowerCase())
      if (!id) return fail(`unknown programme "${n}"`)
      programmeIds.push(id)
    }
    const status = (rec.status || 'ACTIVE').toUpperCase()
    if (!(LECTURER_STATUSES as readonly string[]).includes(status)) return fail(`invalid status "${rec.status}"`)
    return {
      line, label,
      request: {
        firstName: rec.firstname, lastName: rec.lastname, email: rec.email,
        programmeIds, status: status as CreateLecturerRequest['status'],
      },
    }
  })
}

function messageFrom(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } | string } }
  const data = e?.response?.data
  if (typeof data === 'string' && data) return data
  if (data && typeof data === 'object' && data.message) return data.message
  return 'request failed'
}

interface Props {
  open: boolean
  mode: ImportMode
  programmes: ProgrammeResponse[]
  cohorts: CohortResponse[]
  onClose: () => void
  onImported: () => void
}

export default function ImportCSVModal({ open, mode, programmes, cohorts, onClose, onImported }: Props) {
  const [fileName, setFileName] = useState('')
  const [prepared, setPrepared] = useState<PreparedRow[]>([])
  const [results, setResults] = useState<RowResult[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const noun = mode === 'student' ? 'Students' : 'Lecturers'
  const headers = mode === 'student' ? STUDENT_HEADERS : LECTURER_HEADERS
  const validRows = prepared.filter(r => r.request)
  const invalidRows = prepared.filter(r => !r.request)

  const reset = () => { setFileName(''); setPrepared([]); setResults(null); setError(null); setBusy(false) }
  const close = () => { reset(); onClose() }

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.name.toLowerCase().endsWith('.csv')) { setError('Please choose a .csv file.'); return }
    setError(null); setResults(null); setFileName(f.name)
    const text = await f.text()
    const recs = parseRecords(text)
    if (recs.length === 0) { setError('No data rows found (need a header row + at least one row).'); setPrepared([]); return }
    setPrepared(mode === 'student' ? prepareStudents(recs, programmes, cohorts) : prepareLecturers(recs, programmes))
  }

  const runImport = async () => {
    setBusy(true)
    const out: RowResult[] = invalidRows.map(r => ({ line: r.line, label: r.label, ok: false, reason: r.error }))
    for (const r of validRows) {
      try {
        if (mode === 'student') await createStudent(r.request as CreateStudentRequest)
        else await createLecturer(r.request as CreateLecturerRequest)
        out.push({ line: r.line, label: r.label, ok: true })
      } catch (err) {
        out.push({ line: r.line, label: r.label, ok: false, reason: messageFrom(err) })
      }
    }
    out.sort((a, b) => a.line - b.line)
    setResults(out)
    setBusy(false)
    onImported()
  }

  const createdCount = results?.filter(r => r.ok).length ?? 0
  const failedCount = results?.filter(r => !r.ok).length ?? 0

  return (
    <div className="ua-modal-overlay" onClick={close}>
      <div className="ua-modal ua-modal-wide" onClick={e => e.stopPropagation()}>
        <h2 className="ua-modal-title"><Upload size={15} style={{ verticalAlign: -2 }} /> Import {noun} via CSV</h2>

        {!results && (
          <>
            <div className="ua-csv-headers">
              <div className="ua-csv-headers-row">
                <span>Required columns (first row = headers):</span>
                <button className="ua-btn ua-btn-ghost ua-btn-xs" onClick={() => downloadCsv(`${mode}-template.csv`, templateFor(mode))}>
                  <Download size={11} /> Template
                </button>
              </div>
              <code>{headers.join(', ')}</code>
              <p className="ua-csv-hint">
                Programme matches by code or name{mode === 'student' ? ', cohort by name' : ' (separate multiple with ";")'}.
                Blank <code>status</code> defaults to ACTIVE. A temporary password is generated and emailed to each new account.
              </p>
            </div>

            <div className={`ua-csv-drop ${fileName ? 'has-file' : ''}`} onClick={() => fileRef.current?.click()}>
              <FileText size={20} />
              <p>{fileName || 'Click to choose a CSV file'}</p>
              <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={onFile} />
            </div>

            {prepared.length > 0 && (
              <p className="ua-csv-summary">
                <strong>{validRows.length}</strong> ready{invalidRows.length > 0 ? <> &middot; <strong>{invalidRows.length}</strong> will be skipped (see below)</> : null}
              </p>
            )}

            {invalidRows.length > 0 && (
              <div className="ua-csv-results">
                {invalidRows.map(r => (
                  <div className="ua-csv-row ua-csv-fail" key={`pre-${r.line}`}>
                    <AlertCircle size={12} /> Row {r.line}: {r.label} &mdash; {r.error}
                  </div>
                ))}
              </div>
            )}

            {error && <p className="ua-modal-error">{error}</p>}

            <div className="ua-modal-actions">
              <button className="ua-btn ua-btn-ghost" onClick={close}>Cancel</button>
              <button className="ua-btn ua-btn-primary" onClick={runImport} disabled={busy || validRows.length === 0}>
                {busy ? 'Importing…' : `Import ${validRows.length} ${noun}`}
              </button>
            </div>
          </>
        )}

        {results && (
          <>
            <p className="ua-csv-summary">
              <CheckCircle2 size={13} className="ua-csv-ok-ic" /> <strong>{createdCount}</strong> created
              {failedCount > 0 && <> &middot; <AlertCircle size={13} className="ua-csv-fail-ic" /> <strong>{failedCount}</strong> skipped</>}
            </p>
            <div className="ua-csv-results">
              {results.map(r => (
                <div className={`ua-csv-row ${r.ok ? 'ua-csv-ok' : 'ua-csv-fail'}`} key={r.line}>
                  {r.ok ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  Row {r.line}: {r.label}{r.ok ? '' : ` — ${r.reason}`}
                </div>
              ))}
            </div>
            <div className="ua-modal-actions">
              <button className="ua-btn ua-btn-ghost" onClick={reset}>Import another file</button>
              <button className="ua-btn ua-btn-primary" onClick={close}>Done</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
