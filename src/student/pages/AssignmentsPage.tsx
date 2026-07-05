import { useEffect, useRef, useState, useMemo, type ChangeEvent } from 'react'
import { BookOpen, Calendar, CheckCircle2, ChevronLeft, ChevronRight, Download, FileText, List, Minus, Upload, XCircle } from 'lucide-react'
import { useStudentAssignments, type Assignment, type AssignmentStatus } from '../hooks/useStudentAssignments'
import { uploadDocument, turnInDocument, getMyUploadStatus, downloadAssignmentTemplate, type CheckResult, type ComplianceReport } from '../api/studentApi'
import '../styles/student.css'
import '../styles/assignments.css'
import '../styles/compliance.css'

type FilterTab = 'all' | 'pending' | 'past-due'
type ViewMode  = 'list' | 'calendar'

const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December']
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function StatusBadge({ status }: { status: AssignmentStatus }) {
  if (status === 'past-due') return <span className="sd-badge sd-badge-past-due">Past Due</span>
  return <span className="sd-badge sd-badge-pending">Pending</span>
}

function formatDue(iso: string): string {
  const due  = new Date(iso)
  const now  = new Date()
  const diff = (due.setHours(23,59,59,999), due.getTime()) - now.getTime()
  const days = Math.ceil(diff / 86_400_000)
  if (days < 0)  return `Due ${new Date(iso).toLocaleDateString()}`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  if (days <= 7)  return `Due in ${days} days`
  return `Due ${new Date(iso).toLocaleDateString()}`
}

function urgencyColor(status: AssignmentStatus, iso: string): string {
  if (status === 'past-due') return '#b91c1c'
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000)
  if (days <= 1) return '#dc2626'
  if (days <= 3) return '#ea580c'
  return '#6b7280'
}

function submissionType(allowedFileTypes: string | null): string {
  if (!allowedFileTypes || allowedFileTypes.trim() === '') return 'Text'
  return `File (${allowedFileTypes})`
}

function formatTimestamp(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

/* ── Compliance report ── */
function ComplianceCheckRow({ result }: { result: CheckResult }) {
  if (result.skipped) {
    return (
      <div className="compliance-check skipped">
        <span className="compliance-icon-wrap"><Minus size={14} /></span>
        <div>
          <span className="compliance-label">{result.label}:</span>
          <span className="compliance-msg">{result.message}</span>
        </div>
      </div>
    )
  }
  return (
    <div className={`compliance-check ${result.passed ? 'passed' : 'failed'}`}>
      <span className="compliance-icon-wrap">
        {result.passed ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
      </span>
      <div>
        <span className="compliance-label">{result.label}:</span>
        <span className="compliance-msg">{result.message}</span>
        {result.detail && <div className="compliance-detail">{result.detail}</div>}
      </div>
    </div>
  )
}

function ComplianceReportPanel({ report }: { report: ComplianceReport }) {
  return (
    <div className={`compliance-panel ${report.overallPass ? 'pass' : 'fail'}`}>
      <div className="compliance-banner">
        {report.overallPass
          ? <><CheckCircle2 size={15} /> Document passed all compliance checks</>
          : <><XCircle size={15} /> Document failed one or more compliance checks</>}
      </div>
      <div className="compliance-checks">
        <ComplianceCheckRow result={report.fileType} />
        <ComplianceCheckRow result={report.naming} />
        <ComplianceCheckRow result={report.wordCount} />
        <ComplianceCheckRow result={report.headings} />
      </div>
    </div>
  )
}

/* ── List view card ── */
function AssignmentCard({ a }: { a: Assignment }) {
  const fileInputRef                        = useRef<HTMLInputElement>(null)
  const [uploading, setUploading]           = useState(false)
  const [report, setReport]                 = useState<ComplianceReport | null>(null)
  const [uploadError, setUploadError]       = useState<string | null>(null)
  const [turningIn, setTurningIn]           = useState(false)
  const [turnedIn, setTurnedIn]             = useState(false)
  const [submittedAt, setSubmittedAt]       = useState<string | null>(null)
  const [isLate, setIsLate]                 = useState(false)
  const [isReopened, setIsReopened]         = useState(false)
  const [resubmitting, setResubmitting]     = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [textInput, setTextInput]           = useState('')

  useEffect(() => {
    getMyUploadStatus(a.id).then(status => {
      if (status) {
        setIsReopened(status.reopened)
        if (status.turnedIn) {
          setTurnedIn(true)
          setSubmittedAt(status.turnedInAt)
          setIsLate(status.late)
        } else if (status.complianceReport) {
          setReport(status.complianceReport)
        }
      }
    })
  }, [a.id])

  const doUpload = async (file: File) => {
    const HARD_LIMIT = 50 * 1024 * 1024
    const limit = a.maxFileSizeBytes && a.maxFileSizeBytes > 0
      ? Math.min(a.maxFileSizeBytes, HARD_LIMIT)
      : HARD_LIMIT
    if (file.size > limit) {
      setReport(null)
      setUploadError(
        `"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)} MB — too large. ` +
        `The maximum allowed for this assignment is ${Math.round(limit / 1024 / 1024)} MB.`,
      )
      return
    }
    setUploading(true)
    setUploadError(null)
    try {
      const r = await uploadDocument(a.id, file)
      setReport(r)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setUploadError(msg ?? 'Upload failed. Please check your connection and try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await doUpload(file)
  }

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      setUploadError('Please enter some text before submitting.')
      return
    }
    const blob = new Blob([textInput], { type: 'text/plain' })
    const safeName = a.title.replace(/[^a-zA-Z0-9]/g, '_')
    const file = new File([blob], `${safeName}_submission.txt`, { type: 'text/plain' })
    await doUpload(file)
  }

  const handleTurnIn = async () => {
    if (!report?.uploadId) return
    setTurningIn(true)
    try {
      await turnInDocument(report.uploadId)
      setTurnedIn(true)
      setResubmitting(false)
      const status = await getMyUploadStatus(a.id)
      if (status) {
        setSubmittedAt(status.turnedInAt)
        setIsLate(status.late)
      }
    } catch {
      setUploadError('Turn-in failed. Please try again.')
    } finally {
      setTurningIn(false)
    }
  }

  const handleDownloadTemplate = async () => {
    const res = await downloadAssignmentTemplate(a.id)
    const url = URL.createObjectURL(res.data)
    const link = document.createElement('a')
    link.href = url
    link.download = a.templateFileName || 'template'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const hasInstructions = !!(a.instructions || a.additionalNotes)
  const hasTemplate = !!(a.hasTemplateFile || a.hasTemplate)
  const instructionsText = a.instructions || a.additionalNotes
  const isPastDeadline = a.status === 'past-due'
  const canSubmit = !isPastDeadline || isReopened
  const showForm = (!turnedIn || resubmitting) && canSubmit
  const showFileInput = (a.submissionType === 'FILE' || a.submissionType === 'BOTH') && showForm
  const showTextInput = (a.submissionType === 'TEXT' || a.submissionType === 'BOTH') && showForm

  return (
    <div className="asgn-card">
      <div className="asgn-card-top">
        <div className="asgn-card-meta">
          <span className="asgn-card-title">{a.title}</span>
          <StatusBadge status={a.status} />
        </div>
        <span className="asgn-card-type">{submissionType(a.allowedFileTypes)}</span>
      </div>
      {a.description && (
        <p className="asgn-card-desc">{a.description}</p>
      )}

      {(hasInstructions || hasTemplate) && (
        <div className="asgn-info-row">
          {hasInstructions && (
            <button className="asgn-info-btn" onClick={() => setShowInstructions(v => !v)}>
              <FileText size={12} />
              {showInstructions ? 'Hide instructions' : 'View instructions'}
            </button>
          )}
          {hasTemplate && (
            <button className="asgn-info-btn" onClick={handleDownloadTemplate}>
              <Download size={12} /> Download template
            </button>
          )}
        </div>
      )}

      {showInstructions && instructionsText && (
        <div className="asgn-instructions">
          <p>{instructionsText}</p>
        </div>
      )}

      <div className="asgn-card-footer">
        <span style={{ color: urgencyColor(a.status, a.dueDate), fontSize: '0.75rem', fontWeight: 600 }}>
          {formatDue(a.dueDate)}
        </span>
        <span className="asgn-card-points">{a.maxPoints} pts</span>
      </div>

      {/* Submitted state */}
      {turnedIn && !resubmitting && (
        <div className="asgn-submission-result">
          <div className="asgn-turnedin-badge">
            <CheckCircle2 size={14} /> Submitted successfully
          </div>
          {isLate && <div className="asgn-late-badge">LATE</div>}
          {submittedAt && (
            <div className="asgn-submitted-at">
              Submitted at {formatTimestamp(submittedAt)}
            </div>
          )}
        </div>
      )}

      {/* Resubmit — only available before deadline (or if reopened) */}
      {turnedIn && !resubmitting && canSubmit && (
        <button
          className="asgn-resubmit-btn"
          onClick={() => { setResubmitting(true); setReport(null); setUploadError(null) }}
        >
          Resubmit
        </button>
      )}

      {/* Deadline locked — no submission on record */}
      {!turnedIn && !canSubmit && (
        <div className="asgn-locked-msg">
          Deadline has passed. Submissions are no longer accepted.
        </div>
      )}

      {/* Reopened notice */}
      {isReopened && isPastDeadline && showForm && (
        <div className="asgn-reopened-note">
          Re-opened by lecturer — late submission accepted.
        </div>
      )}

      {showFileInput && (
        <div className="asgn-upload-row">
          <button
            className="asgn-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload size={13} />
            {uploading ? 'Checking…' : 'Upload File'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      )}

      {showTextInput && (
        <div className="asgn-text-row">
          <textarea
            className="asgn-text-area"
            placeholder="Enter your submission text here…"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            disabled={uploading}
          />
          <button
            className="asgn-upload-btn"
            onClick={handleTextSubmit}
            disabled={uploading || !textInput.trim()}
          >
            <FileText size={13} />
            {uploading ? 'Checking…' : 'Submit Text'}
          </button>
        </div>
      )}

      {showForm && uploadError && <p className="asgn-upload-error">{uploadError}</p>}
      {showForm && report && <ComplianceReportPanel report={report} />}
      {showForm && report?.overallPass && (
        <button
          className="asgn-turnin-btn"
          onClick={handleTurnIn}
          disabled={turningIn}
        >
          {turningIn ? 'Submitting…' : 'Turn In'}
        </button>
      )}
    </div>
  )
}

/* ── Calendar view ── */
function CalendarView({ assignments }: { assignments: Assignment[] }) {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const byDate = useMemo(() => {
    const map: Record<string, Assignment[]> = {}
    assignments.forEach(a => {


      
      const key = a.dueDate.slice(0, 10)
      ;(map[key] ??= []).push(a)
    })
    return map
  }, [assignments])

  function prev() { month === 0 ? (setMonth(11), setYear(y => y - 1)) : setMonth(m => m - 1) }
  function next() { month === 11 ? (setMonth(0),  setYear(y => y + 1)) : setMonth(m => m + 1) }

  const firstDay  = new Date(year, month, 1).getDay()
  const daysInMo  = new Date(year, month + 1, 0).getDate()
  const cells     = Array.from({ length: firstDay + daysInMo }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  )

  return (
    <div className="asgn-cal">
      <div className="asgn-cal-header">
        <button className="asgn-cal-nav" onClick={prev}><ChevronLeft size={16} /></button>
        <span className="asgn-cal-title">{MONTH_NAMES[month]} {year}</span>
        <button className="asgn-cal-nav" onClick={next}><ChevronRight size={16} /></button>
      </div>
      <div className="asgn-cal-grid">
        {DAY_NAMES.map(d => <div key={d} className="asgn-cal-day-name">{d}</div>)}
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="asgn-cal-cell asgn-cal-empty" />
          const key   = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const items = byDate[key] ?? []
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
          return (
            <div key={key} className={`asgn-cal-cell ${isToday ? 'asgn-cal-today' : ''}`}>
              <span className="asgn-cal-date">{day}</span>
              {items.map(a => (
                <div key={a.id} className={`asgn-cal-item ${a.status === 'past-due' ? 'asgn-cal-item-due' : 'asgn-cal-item-pending'}`}>
                  {a.title}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function AssignmentsPage() {
  const { assignments, loading, error } = useStudentAssignments()
  const [view,   setView]   = useState<ViewMode>('list')
  const [filter, setFilter] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = assignments
    if (filter === 'pending')  list = list.filter(a => a.status === 'pending')
    if (filter === 'past-due') list = list.filter(a => a.status === 'past-due')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a => a.title.toLowerCase().includes(q))
    }
    return list
  }, [assignments, filter, search])

  const counts = useMemo(() => ({
    all:      assignments.length,
    pending:  assignments.filter(a => a.status === 'pending').length,
    'past-due': assignments.filter(a => a.status === 'past-due').length,
  }), [assignments])

  if (loading) return <p className="sd-table-empty">Loading assignments…</p>
  if (error)   return <p className="sd-table-empty">{error}</p>

  return (
    <div className="sd-page">

      {/* Controls row */}
      <div className="asgn-controls">
        {/* Filter tabs */}
        <div className="asgn-tabs">
          {(['all', 'pending', 'past-due'] as FilterTab[]).map(t => (
            <button
              key={t}
              className={`asgn-tab ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {t === 'all' ? 'All' : t === 'pending' ? 'Pending' : 'Past Due'}
              <span className="asgn-tab-count">{counts[t]}</span>
            </button>
          ))}
        </div>

        <div className="asgn-controls-right">
          {/* Search */}
          <input
            className="asgn-search"
            type="text"
            placeholder="Search assignments…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {/* View toggle */}
          <div className="asgn-view-toggle">
            <button className={`asgn-view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} title="List view">
              <List size={15} />
            </button>
            <button className={`asgn-view-btn ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')} title="Calendar view">
              <Calendar size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {view === 'calendar' ? (
        <CalendarView assignments={filtered} />
      ) : filtered.length === 0 ? (
        <div className="sd-card">
          <p className="sd-table-empty">
            <BookOpen size={28} style={{ display: 'block', margin: '0 auto 0.5rem' }} />
            {search ? 'No assignments match your search.' : 'No assignments found.'}
          </p>
        </div>
      ) : (
        <div className="asgn-list">
          {filtered.map(a => <AssignmentCard key={a.id} a={a} />)}
        </div>
      )}

    </div>
  )
}
