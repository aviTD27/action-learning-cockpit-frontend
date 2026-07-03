import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Bell, Brain, CheckCheck, Download, FileDown, FileText, GraduationCap, Pencil } from 'lucide-react'
import Layout from '../../shared/layout/Layout'
import { LECTURER_NAV, LECTURER_USER } from '../nav'
import { downloadStudentFile, downloadTemplate } from '../api/lecturer'
import { useStudents } from '../../uni-admin/hooks/useStudents'
import { useSubmissions } from '../hooks/useSubmissions'
import { useGrades } from '../hooks/useGrades'
import { useStudentSubmissions } from '../hooks/useStudentSubmissions'
import GradeModal from '../components/GradeModal'
import ScoreModal from '../components/ScoreModal'
import GradeBadge from '../components/GradeBadge'
import { buildGradeCsv, downloadCsv, gradeCsvFilename } from '../lib/exportGrades'
import type { StudentResponse } from '../../uni-admin/api/types'
import '../styles/lecturer.css'

export default function SubmissionDetailPage() {
  const { id } = useParams()
  const submissionId = Number(id)
  const { submissions, notify } = useSubmissions()
  const submission = submissions.find(s => s.id === submissionId)

  const { students, loading } = useStudents(submission?.cohortId)
  const { setGrade, releaseAll, gradeFor, draftCount } = useGrades(submissionId)
  const { available: subsTracked, submissionFor, submittedCount } = useStudentSubmissions(submissionId)

  const [gradeTarget, setGradeTarget] = useState<StudentResponse | null>(null)
  const [scoreTarget, setScoreTarget] = useState<{ name: string; uploadId: number } | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const handleNotify = () => {
    notify(submissionId)
    setNotice(`Notification sent ${students.length} student${students.length === 1 ? '' : 's'} emailed and notified on the platform.`)
  }

  const handleRelease = () => {
    releaseAll()
    setNotice('All draft grades released — students will see them once the student portal exists.')
  }

  const handleDownloadStudentFile = async (uploadId: number, fileName: string) => {
    const res = await downloadStudentFile(uploadId)
    const url = URL.createObjectURL(res.data)
    const a = document.createElement('a')
    a.href = url; a.download = fileName; a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadTemplate = async () => {
    if (!submission) return
    const res = await downloadTemplate(submission.id)
    const url = URL.createObjectURL(res.data)
    const a = document.createElement('a')
    a.href = url; a.download = submission.templateFileName ?? 'template'; a.click()
    URL.revokeObjectURL(url)
  }

  const handleExport = () => {
    if (!submission) return
    const csv = buildGradeCsv({ submission, students, gradeFor, submissionFor, tracked: subsTracked })
    downloadCsv(gradeCsvFilename(submission.title), csv)
  }

  if (!submission) {
    return (
      <Layout navItems={LECTURER_NAV} user={LECTURER_USER} title="Submission" subtitle="Not found">
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
    <Layout navItems={LECTURER_NAV} user={LECTURER_USER} title={submission.title} subtitle={`${submission.cohortName} · due ${submission.dueDate}`}>
      <div className="ua-page">

        <Link to="/lecturer/submissions" className="ua-link"><ArrowLeft size={12} /> Back to submissions</Link>

        {notice && (
          <div className="ua-card">
            <p className="ua-notice">{notice}</p>
          </div>
        )}

        <div className="ua-card">
          <div className="ua-card-header">
            <p className="ua-card-title"><FileText size={14} /> {submission.title}</p>
            <button className="ua-btn ua-btn-secondary" onClick={handleNotify}>
              <Bell size={12} /> Notify Students
            </button>
          </div>
          <div className="ua-panel-body">
            <div className="ua-stat-row">
              <span className="ua-stat-label">Description</span>
              <span className="ua-stat-value">{submission.description || '—'}</span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Cohort</span>
              <span className="ua-stat-value">{submission.cohortName}</span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Due Date</span>
              <span className="ua-stat-value">{submission.dueDate}</span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Max Points</span>
              <span className="ua-stat-value">{submission.maxPoints}</span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Template File</span>
              <span className="ua-stat-value">
                {submission.hasTemplate ? (
                  <button className="ua-link-btn" onClick={handleDownloadTemplate}>
                    <FileDown size={12} /> {submission.templateFileName}
                  </button>
                ) : (submission.templateFileName ?? '—')}
              </span>
            </div>
            {submission.instructions && (
              <div className="ua-stat-row ua-stat-row-block">
                <span className="ua-stat-label">Instructions</span>
                <p className="ua-instructions-text">{submission.instructions}</p>
              </div>
            )}
            <div className="ua-stat-row">
              <span className="ua-stat-label">Allowed File Types</span>
              <span className="ua-stat-value">{submission.rules.allowedFileTypes || 'Any'}</span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Max Attempts</span>
              <span className="ua-stat-value">{submission.rules.maxAttempts}</span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Late Submissions</span>
              <span className={`ua-stat-value ${submission.rules.lateAllowed ? 'green' : 'red'}`}>
                {submission.rules.lateAllowed ? 'Allowed' : 'Not allowed'}
              </span>
            </div>
            <div className="ua-stat-row">
              <span className="ua-stat-label">Last Notified</span>
              <span className="ua-stat-value">
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
              <p className="ua-table-empty">No students in this cohort.</p>
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
                            const sub = submissionFor(s.id)
                            if (!sub?.uploadId) return null
                            return (
                              <>
                                <button
                                  className="ua-icon-btn"
                                  title="Download submission"
                                  onClick={() => handleDownloadStudentFile(sub.uploadId!, sub.fileName)}
                                >
                                  <Download size={13} />
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
