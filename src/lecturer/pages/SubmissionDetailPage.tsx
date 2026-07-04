import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Archive, ArrowLeft, Bell, Brain, CheckCheck, Download, FileArchive, FileDown, FileText, GraduationCap, Pencil, Send, Unlock } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { LECTURER_NAV } from '../nav'
import { useLecturerSidebarUser } from '../hooks/useLecturerSidebarUser'
import { useStudents } from '../../uni-admin/hooks/useStudents'
import { useSubmissions } from '../hooks/useSubmissions'
import { useGrades } from '../hooks/useGrades'
import { useStudentSubmissions } from '../hooks/useStudentSubmissions'
import { downloadUpload, downloadSubmissionsZip, downloadTemplate } from '../api/lecturer'
import GradeModal from '../components/GradeModal'
import ScoreModal from '../components/ScoreModal'
import GradeBadge from '../components/GradeBadge'
import { buildGradeCsv, downloadCsv, gradeCsvFilename } from '../lib/exportGrades'
import type { StudentResponse } from '../../uni-admin/api/types'
import '../styles/lecturer.css'

function saveBlob(data: Blob, filename: string) {
  const url = URL.createObjectURL(data)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export default function SubmissionDetailPage() {
  const { id } = useParams()
  const submissionId = Number(id)
  const sidebarUser = useLecturerSidebarUser()
  const { submissions, notify, publish, archive, unarchive, reopen } = useSubmissions()
  const submission = submissions.find(s => s.id === submissionId)

  const { students, loading } = useStudents({ programmeId: submission?.programmeId })
  const { setGrade, releaseAll, gradeFor, draftCount } = useGrades(submissionId)
  const { available: subsTracked, submissionFor, submittedCount, reload: reloadSubs } = useStudentSubmissions(submissionId)

  const [gradeTarget, setGradeTarget] = useState<StudentResponse | null>(null)
  const [scoreTarget, setScoreTarget] = useState<{ name: string; uploadId: number } | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const handleNotify = () => {
    notify(submissionId)
    const pending = Math.max(students.length - submittedCount, 0)
    setNotice(pending === 0
      ? 'Everyone has submitted — no reminders were sent.'
      : `Reminder sent to ${pending} student${pending === 1 ? '' : 's'} who haven't submitted yet.`)
  }

  const handleDownloadUpload = async (uploadId: number, fileName: string) => {
    const res = await downloadUpload(uploadId)
    saveBlob(res.data, fileName || `submission-${uploadId}`)
  }

  const handleDownloadZip = async () => {
    if (!submission) return
    const res = await downloadSubmissionsZip(submissionId)
    saveBlob(res.data, `submissions-${submission.title.replace(/\s+/g, '_')}.zip`)
  }

  const handleDownloadTemplate = async () => {
    if (!submission) return
    const res = await downloadTemplate(submissionId)
    saveBlob(res.data, submission.templateFileName || 'template')
  }

  const handleReopen = async (studentId: number, name: string) => {
    await reopen(submissionId, studentId)
    await reloadSubs()
    setNotice(`Re-opened "${submission?.title}" for ${name} — they can submit a late exception.`)
  }

  const handleRelease = () => {
    releaseAll()
    setNotice('All draft grades released — students will see them once the student portal exists.')
  }

  const handleExport = () => {
    if (!submission) return
    const csv = buildGradeCsv({ submission, students, gradeFor, submissionFor, tracked: subsTracked })
    downloadCsv(gradeCsvFilename(submission.title), csv)
  }

  if (!submission) {
    return (
      <Layout navItems={LECTURER_NAV} user={sidebarUser} title="Submission" subtitle="Not found">
        <div className="ua-page">
          <div className="ua-card">
            <p className="ua-table-empty">Submission not found.</p>
          </div>
          <Link to="/lecturer/submissions" className="ua-link"><ArrowLeft size={12} /> Back to submissions</Link>
        </div>
      </Layout>
    )
  }

  const graded = students.filter(s => gradeFor(s.id)).length

  return (
    <Layout navItems={LECTURER_NAV} user={sidebarUser} title={submission.title} subtitle={`${submission.courseName} · due ${submission.dueDate}`}>
      <div className="ua-page">

        <Link to="/lecturer/submissions" className="ua-link"><ArrowLeft size={12} /> Back to submissions</Link>

        {notice && (
          <div className="ua-card">
            <p className="ua-notice">{notice}</p>
          </div>
        )}

        <div className="ua-card">
          <div className="ua-card-header">
            <p className="ua-card-title"><FileText size={14} /> {submission.title}
              <span className={`ua-badge ${submission.status === 'PUBLISHED' ? 'ua-badge-active' : submission.status === 'ARCHIVED' ? 'ua-badge-archived' : 'ua-badge-not_started'}`} style={{ marginLeft: 8 }}>
                <span className="ua-badge-dot" />{submission.status.charAt(0) + submission.status.slice(1).toLowerCase()}
              </span>
            </p>
            <div className="ua-header-actions">
              {submission.status === 'DRAFT' && (
                <button className="ua-btn ua-btn-primary" onClick={() => publish(submissionId)}>
                  <Send size={12} /> Publish
                </button>
              )}
              <button className="ua-btn ua-btn-secondary" onClick={handleNotify}>
                <Bell size={12} /> Remind Non-Submitters
              </button>
              {submission.status !== 'ARCHIVED' ? (
                <button className="ua-btn ua-btn-secondary" onClick={() => archive(submissionId)}>
                  <Archive size={12} /> Archive
                </button>
              ) : (
                <button className="ua-btn ua-btn-secondary" onClick={() => unarchive(submissionId)}>
                  <Archive size={12} /> Unarchive
                </button>
              )}
            </div>
          </div>
          <div className="ua-detail-grid">
            <div className="ua-detail-item full">
              <span className="ua-detail-label">Description / Instructions</span>
              <span className="ua-detail-value">{submission.description || '—'}</span>
            </div>
            {(submission.additionalNotes || submission.instructions) && (
              <div className="ua-detail-item full">
                <span className="ua-detail-label">Additional Notes</span>
                <span className="ua-detail-value">{submission.additionalNotes || submission.instructions}</span>
              </div>
            )}
            <div className="ua-detail-item">
              <span className="ua-detail-label">Course</span>
              <span className="ua-detail-value">{submission.courseName}</span>
            </div>
            <div className="ua-detail-item">
              <span className="ua-detail-label">Submission Type</span>
              <span className="ua-detail-value">
                {submission.submissionType === 'BOTH' ? 'File or Text' : submission.submissionType === 'FILE' ? 'File only' : 'Text only'}
              </span>
            </div>
            <div className="ua-detail-item">
              <span className="ua-detail-label">Deadline</span>
              <span className="ua-detail-value">{submission.dueDate}{submission.dueTime ? ` at ${submission.dueTime.slice(0, 5)}` : ' at 23:59'}</span>
            </div>
            <div className="ua-detail-item">
              <span className="ua-detail-label">Max Points</span>
              <span className="ua-detail-value">{submission.maxPoints}</span>
            </div>
            <div className="ua-detail-item">
              <span className="ua-detail-label">Template File</span>
              <span className="ua-detail-value">
                {(submission.hasTemplateFile || submission.hasTemplate) ? (
                  <button className="ua-link-btn" onClick={handleDownloadTemplate}>
                    <FileDown size={12} /> {submission.templateFileName ?? 'Download template'}
                  </button>
                ) : '—'}
              </span>
            </div>
            <div className="ua-detail-item">
              <span className="ua-detail-label">Allowed File Types</span>
              <span className="ua-detail-value">{submission.rules.allowedFileTypes || 'Any'}</span>
            </div>
            <div className="ua-detail-item">
              <span className="ua-detail-label">Max File Size</span>
              <span className="ua-detail-value">{submission.rules.maxFileSizeBytes ? `${Math.round(submission.rules.maxFileSizeBytes / (1024 * 1024))} MB` : '—'}</span>
            </div>
            <div className="ua-detail-item">
              <span className="ua-detail-label">Word Count</span>
              <span className="ua-detail-value">
                {submission.rules.minWordCount || submission.rules.maxWordCount
                  ? `${submission.rules.minWordCount ?? 0} – ${submission.rules.maxWordCount ?? '∞'}`
                  : '—'}
              </span>
            </div>
            <div className="ua-detail-item">
              <span className="ua-detail-label">Naming Convention</span>
              <span className="ua-detail-value">{submission.rules.namingPattern || '—'}</span>
            </div>
            <div className="ua-detail-item">
              <span className="ua-detail-label">Required Headings</span>
              <span className="ua-detail-value">{submission.rules.requiredHeadings || '—'}</span>
            </div>
            <div className="ua-detail-item">
              <span className="ua-detail-label">Max Attempts</span>
              <span className="ua-detail-value">{submission.rules.maxAttempts}</span>
            </div>
            <div className="ua-detail-item">
              <span className="ua-detail-label">Late Submissions</span>
              <span className={`ua-detail-value ${submission.rules.lateAllowed ? 'green' : 'red'}`}>
                {submission.rules.lateAllowed ? 'Allowed' : 'Not allowed'}
              </span>
            </div>
            <div className="ua-detail-item">
              <span className="ua-detail-label">Last Notified</span>
              <span className="ua-detail-value">
                {submission.lastNotifiedAt ? new Date(submission.lastNotifiedAt).toLocaleString() : 'Never'}
              </span>
            </div>
          </div>
        </div>

        <div className="ua-card">
          <div className="ua-card-header">
            <p className="ua-card-title"><GraduationCap size={14} /> Students<span className="ua-count">{students.length} total{subsTracked ? ` · ${submittedCount} submitted` : ''} · {graded} graded · {draftCount} draft</span></p>
            <div className="ua-header-actions">
              <button
                className="ua-btn ua-btn-secondary"
                onClick={handleDownloadZip}
                disabled={submittedCount === 0}
                title={submittedCount === 0 ? 'No submissions to download' : 'Download every submission as a ZIP'}
              >
                <FileArchive size={12} /> Download All (ZIP)
              </button>
              <button
                className="ua-btn ua-btn-secondary"
                onClick={handleExport}
                disabled={students.length === 0}
                title={students.length === 0 ? 'No students to export' : 'Download grades & student details as CSV'}
              >
                <Download size={12} /> Export CSV
              </button>
              <button
                className="ua-btn ua-btn-success"
                onClick={handleRelease}
                disabled={draftCount === 0}
                title={draftCount === 0 ? 'No draft grades to release' : 'Publish all draft grades'}
              >
                <CheckCheck size={12} /> Release Grades{draftCount > 0 ? ` (${draftCount})` : ''}
              </button>
            </div>
          </div>
          <div className="ua-table-wrap">
            {loading ? (
              <p className="ua-table-empty">Loading students…</p>
            ) : students.length === 0 ? (
              <p className="ua-table-empty">No students in this course.</p>
            ) : (
              <table className="ua-table">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Submission</th>
                    <th>AI Score</th>
                    <th>Status</th>
                    <th>Grade</th>
                    <th>Feedback</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => {
                    const g = gradeFor(s.id)
                    return (
                      <tr key={s.id}>
                        <td className="col-highlight">{s.studentRef}</td>
                        <td className="col-name">{s.firstName} {s.lastName}</td>
                        <td className="col-muted">{s.email}</td>
                        <td>
                          {(() => {
                            if (!subsTracked) return <span className="col-muted">—</span>
                            const sub = submissionFor(s.id)
                            if (!sub) {
                              return (
                                <span className="ua-badge ua-badge-missing">
                                  <span className="ua-badge-dot" /> Not submitted
                                </span>
                              )
                            }
                            return (
                              <span
                                className={`ua-badge ${sub.late ? 'ua-badge-late' : 'ua-badge-submitted'}`}
                                title={`${sub.fileName} · attempt ${sub.attemptNumber} · ${new Date(sub.submittedAt).toLocaleString()}`}
                              >
                                <span className="ua-badge-dot" />
                                Submitted{sub.late ? ' · late' : ''}
                              </span>
                            )
                          })()}
                        </td>
                        <td>
                          {(() => {
                            const sub = submissionFor(s.id)
                            if (!sub || sub.overallScore == null) return <span className="col-muted">—</span>
                            const pct = Math.round(sub.overallScore * 100)
                            return (
                              <span className={`ua-score-chip ua-score-chip-${sub.scoreLevel ?? 'average'}`}>
                                {pct}% · {sub.scoreLevel}
                              </span>
                            )
                          })()}
                        </td>
                        <td>
                          <span className={`ua-badge ${!g ? 'ua-badge-not_started' : g.status === 'RELEASED' ? 'ua-badge-completed' : 'ua-badge-payment_pending'}`}>
                            <span className="ua-badge-dot" />
                            {!g ? 'Pending' : g.status === 'RELEASED' ? 'Released' : 'Draft'}
                          </span>
                        </td>
                        <td className="col-highlight">
                          {g ? (
                            <span className="ua-grade-cell">
                              {g.grade} / {submission.maxPoints}
                              <GradeBadge grade={g.grade} maxPoints={submission.maxPoints} />
                            </span>
                          ) : '—'}
                        </td>
                        <td className="col-muted">{g?.feedback || '—'}</td>
                        <td className="col-actions">
                          {(() => {
                            const sub = subsTracked ? submissionFor(s.id) : undefined
                            if (!sub?.uploadId) return null
                            return (
                              <>
                                <button
                                  className="ua-icon-btn"
                                  title={`Download ${sub.fileName}`}
                                  onClick={() => handleDownloadUpload(sub.uploadId!, sub.fileName)}
                                >
                                  <FileDown size={13} />
                                </button>
                                <button
                                  className="ua-icon-btn"
                                  title="View AI score"
                                  onClick={() => setScoreTarget({ name: `${s.firstName} ${s.lastName}`, uploadId: sub.uploadId! })}
                                >
                                  <Brain size={13} />
                                </button>
                              </>
                            )
                          })()}
                          <button
                            className="ua-icon-btn"
                            title="Re-open for this student (late exception)"
                            onClick={() => handleReopen(s.id, `${s.firstName} ${s.lastName}`)}
                          >
                            <Unlock size={13} />
                          </button>
                          <button
                            className="ua-icon-btn"
                            title={g ? 'Edit grade' : 'Grade student'}
                            onClick={() => setGradeTarget(s)}
                          >
                            <Pencil size={13} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      <GradeModal
        open={gradeTarget !== null}
        student={gradeTarget}
        maxPoints={submission.maxPoints}
        existing={gradeTarget ? gradeFor(gradeTarget.id) : undefined}
        onClose={() => setGradeTarget(null)}
        onSave={(grade, feedback) => {
          if (gradeTarget) setGrade(gradeTarget.id, grade, feedback)
        }}
      />

      <ScoreModal
        open={scoreTarget !== null}
        studentName={scoreTarget?.name ?? ''}
        uploadId={scoreTarget?.uploadId ?? null}
        onClose={() => setScoreTarget(null)}
      />
    </Layout>
  )
}
